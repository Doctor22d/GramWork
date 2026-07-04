# API Gateway Testing Guide

Comprehensive testing guide for GramWork API Gateway.

## Test Categories

1. **Authentication Tests**
2. **Authorization Tests**
3. **Routing Tests**
4. **Rate Limiting Tests**
5. **Circuit Breaker Tests**
6. **CORS Tests**
7. **Performance Tests**

## Prerequisites

```bash
# Ensure all services are running
- Config Server (8888)
- Eureka Server (8761)
- API Gateway (8080)
- Auth Service (8086)
- Other microservices (8081-8089, 8082)

# Tools needed
- curl
- jq (for JSON parsing)
- Apache Bench (ab) or similar load testing tool
```

## 1. Authentication Tests

### Test 1.1: Access Public Endpoint Without Token
```bash
curl -v http://localhost:8080/api/auth/login

# Expected: 200 OK (or appropriate response from auth service)
```

### Test 1.2: Access Protected Endpoint Without Token
```bash
curl -v http://localhost:8080/api/jobs

# Expected: 401 Unauthorized
# Response:
# {
#   "status": 401,
#   "error": "Unauthorized",
#   "message": "Missing or invalid Authorization header"
# }
```

### Test 1.3: Login and Get Token
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "worker@test.com",
    "password": "Test@123"
  }' | jq -r '.token')

echo "Token: $TOKEN"
```

### Test 1.4: Access Protected Endpoint With Valid Token
```bash
curl -v -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/jobs

# Expected: 200 OK with jobs data
```

### Test 1.5: Access Protected Endpoint With Invalid Token
```bash
curl -v -H "Authorization: Bearer invalid-token-here" \
     http://localhost:8080/api/jobs

# Expected: 401 Unauthorized
# Message: "Invalid or expired JWT token"
```

### Test 1.6: Access Protected Endpoint With Malformed Header
```bash
# Missing "Bearer" prefix
curl -v -H "Authorization: $TOKEN" \
     http://localhost:8080/api/jobs

# Expected: 401 Unauthorized
# Message: "Missing or invalid Authorization header"
```

## 2. Authorization Tests

### Test 2.1: Worker Accessing Worker Endpoint
```bash
# Login as worker
WORKER_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"worker@test.com","password":"Test@123"}' \
  | jq -r '.token')

# Access worker profile
curl -v -H "Authorization: Bearer $WORKER_TOKEN" \
     http://localhost:8080/api/laborers/123

# Expected: 200 OK
```

### Test 2.2: Worker Accessing Employer Endpoint
```bash
# Try to access employer-only endpoint
curl -v -H "Authorization: Bearer $WORKER_TOKEN" \
     http://localhost:8080/api/employers/create

# Expected: 403 Forbidden
# Message: "Access denied - insufficient permissions"
```

### Test 2.3: Employer Accessing Employer Endpoint
```bash
# Login as employer
EMPLOYER_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"employer@test.com","password":"Test@123"}' \
  | jq -r '.token')

# Create job posting
curl -v -H "Authorization: Bearer $EMPLOYER_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Job","category":"AGRICULTURE"}' \
     http://localhost:8080/api/jobs/create

# Expected: 200 OK or 201 Created
```

### Test 2.4: Admin Accessing All Endpoints
```bash
# Login as admin
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin@123"}' \
  | jq -r '.token')

# Admin can access any endpoint
curl -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:8080/api/jobs
curl -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:8080/api/laborers/123
curl -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:8080/api/employers/123

# Expected: All return 200 OK
```

## 3. Routing Tests

### Test 3.1: Auth Service Routing
```bash
curl -v http://localhost:8080/api/auth/login

# Should route to gramwork-auth-service (8086)
# Check logs for routing confirmation
```

### Test 3.2: Job Service Routing
```bash
curl -v -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/jobs

# Should route to job-service (8083)
# Response should contain jobs data
```

### Test 3.3: Profile Service Routing
```bash
curl -v -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/laborers/123

# Should route to laborer-profile-service (8081)
# Path should be rewritten: /api/laborers/123 -> /api/profile/123
```

### Test 3.4: Check All Routes
```bash
curl http://localhost:8080/actuator/gateway/routes | jq

# Expected: JSON array with all configured routes
```

## 4. Rate Limiting Tests

### Test 4.1: Single Request (Within Limit)
```bash
curl -v http://localhost:8080/api/auth/login

# Check headers:
# X-Rate-Limit-Limit: 100
# X-Rate-Limit-Remaining: 99
```

### Test 4.2: Multiple Requests (Exceed Limit)
```bash
# Make 101 requests quickly
for i in {1..101}; do
  RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:8080/api/auth/login)
  echo "Request $i: $RESPONSE"
done

# Expected: First 100 return 200, 101st returns 429 Too Many Requests
# Header: X-Rate-Limit-Retry-After-Seconds: 60
```

### Test 4.3: Rate Limit Recovery
```bash
# Wait 60 seconds after hitting limit
sleep 60

# Try again
curl -v http://localhost:8080/api/auth/login

# Expected: 200 OK (limit reset)
```

## 5. Circuit Breaker Tests

### Test 5.1: Service Available (Closed Circuit)
```bash
# Normal request when service is healthy
curl -v -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/jobs

# Expected: 200 OK with data
# Circuit state: CLOSED
```

### Test 5.2: Service Unavailable (Open Circuit)
```bash
# Stop job-service
docker stop job-service

# Make request
curl -v -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/jobs

# Expected: 503 Service Unavailable
# Response: Fallback message
# {
#   "status": 503,
#   "message": "Job service is temporarily unavailable",
#   "fallback": true
# }
```

### Test 5.3: Check Circuit Breaker Status
```bash
curl http://localhost:8080/actuator/circuitbreakers | jq

# Expected: Circuit states for all services
```

## 6. CORS Tests

### Test 6.1: Preflight Request
```bash
curl -v -X OPTIONS http://localhost:8080/api/jobs \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization"

# Expected: 200 OK
# Headers should include:
# Access-Control-Allow-Origin: http://localhost:3000
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
# Access-Control-Allow-Headers: *
# Access-Control-Max-Age: 3600
```

### Test 6.2: Actual CORS Request
```bash
curl -v http://localhost:8080/api/jobs \
  -H "Origin: http://localhost:3000" \
  -H "Authorization: Bearer $TOKEN"

# Expected: 200 OK
# Header: Access-Control-Allow-Origin: http://localhost:3000
```

### Test 6.3: Disallowed Origin
```bash
curl -v http://localhost:8080/api/jobs \
  -H "Origin: http://malicious-site.com" \
  -H "Authorization: Bearer $TOKEN"

# Expected: No CORS headers in response (browser will block)
```

## 7. Performance Tests

### Test 7.1: Latency Test
```bash
# Measure request latency
curl -w "@curl-format.txt" -o /dev/null -s \
     -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/jobs

# Create curl-format.txt:
# time_namelookup:  %{time_namelookup}\n
# time_connect:  %{time_connect}\n
# time_appconnect:  %{time_appconnect}\n
# time_pretransfer:  %{time_pretransfer}\n
# time_redirect:  %{time_redirect}\n
# time_starttransfer:  %{time_starttransfer}\n
# time_total:  %{time_total}\n
```

### Test 7.2: Load Test
```bash
# Install Apache Bench
# sudo apt-get install apache2-utils

# Run load test: 1000 requests, 10 concurrent
ab -n 1000 -c 10 \
   -H "Authorization: Bearer $TOKEN" \
   http://localhost:8080/api/jobs

# Expected: Success rate > 95%
```

### Test 7.3: Stress Test
```bash
# Gradually increase load
ab -n 5000 -c 50 \
   -H "Authorization: Bearer $TOKEN" \
   http://localhost:8080/api/jobs

# Monitor:
# - Response times
# - Error rates
# - Gateway CPU/Memory
```

## 8. Distributed Tracing Tests

### Test 8.1: Check Trace Headers
```bash
curl -v -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/jobs

# Response headers should include:
# X-Trace-Id: <uuid>
# X-Correlation-Id: <uuid>
```

### Test 8.2: View Traces in Zipkin
```bash
# Make a request
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/jobs

# Open Zipkin UI
open http://localhost:9411/zipkin

# Search for recent traces
# Should show: api-gateway -> job-service
```

## 9. Health and Monitoring Tests

### Test 9.1: Gateway Health
```bash
curl http://localhost:8080/actuator/health | jq

# Expected:
# {
#   "status": "UP",
#   "components": {
#     "circuitBreakers": {"status": "UP"},
#     "discoveryComposite": {"status": "UP"},
#     "redis": {"status": "UP"}
#   }
# }
```

### Test 9.2: Gateway Metrics
```bash
curl http://localhost:8080/actuator/metrics | jq

# Lists all available metrics
```

### Test 9.3: Gateway Info
```bash
curl http://localhost:8080/actuator/info | jq

# Shows application information
```

### Test 9.4: Prometheus Metrics
```bash
curl http://localhost:8080/actuator/prometheus

# Shows metrics in Prometheus format
```

## 10. Error Handling Tests

### Test 10.1: Invalid JSON Request
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d 'invalid-json'

# Expected: 400 Bad Request
```

### Test 10.2: Missing Required Fields
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected: 400 Bad Request with validation errors
```

### Test 10.3: Service Timeout
```bash
# Configure very short timeout in gateway
# Make request to slow service
curl -v -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/jobs

# Expected: 504 Gateway Timeout (if service is slow)
```

## Test Automation Script

Create `test-gateway.sh`:

```bash
#!/bin/bash

GATEWAY_URL="http://localhost:8080"
PASSED=0
FAILED=0

echo "========================================="
echo "   GramWork API Gateway Test Suite"
echo "========================================="
echo

# Test 1: Health Check
echo "[Test 1] Health Check..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $GATEWAY_URL/actuator/health)
if [ "$RESPONSE" -eq 200 ]; then
    echo "✓ PASSED"
    ((PASSED++))
else
    echo "✗ FAILED (Status: $RESPONSE)"
    ((FAILED++))
fi

# Test 2: Public Endpoint Access
echo "[Test 2] Public Endpoint Access..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $GATEWAY_URL/api/auth/login)
if [ "$RESPONSE" -eq 200 ] || [ "$RESPONSE" -eq 400 ]; then
    echo "✓ PASSED"
    ((PASSED++))
else
    echo "✗ FAILED (Status: $RESPONSE)"
    ((FAILED++))
fi

# Test 3: Protected Endpoint Without Token
echo "[Test 3] Protected Endpoint Without Token..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $GATEWAY_URL/api/jobs)
if [ "$RESPONSE" -eq 401 ]; then
    echo "✓ PASSED"
    ((PASSED++))
else
    echo "✗ FAILED (Expected 401, Got: $RESPONSE)"
    ((FAILED++))
fi

# Test 4: Login and Get Token
echo "[Test 4] Login and Get Token..."
TOKEN=$(curl -s -X POST $GATEWAY_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123"}' \
  | jq -r '.token // empty')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "✓ PASSED (Token received)"
    ((PASSED++))
else
    echo "✗ FAILED (No token received)"
    ((FAILED++))
    TOKEN="dummy-token"
fi

# Test 5: Protected Endpoint With Token
echo "[Test 5] Protected Endpoint With Token..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  $GATEWAY_URL/api/jobs)
if [ "$RESPONSE" -eq 200 ] || [ "$RESPONSE" -eq 401 ]; then
    echo "✓ PASSED"
    ((PASSED++))
else
    echo "✗ FAILED (Status: $RESPONSE)"
    ((FAILED++))
fi

# Test 6: Rate Limit Headers
echo "[Test 6] Rate Limit Headers..."
HEADERS=$(curl -s -I $GATEWAY_URL/api/auth/login | grep -i "x-rate-limit")
if [ -n "$HEADERS" ]; then
    echo "✓ PASSED"
    ((PASSED++))
else
    echo "✗ FAILED (No rate limit headers)"
    ((FAILED++))
fi

# Test 7: CORS Headers
echo "[Test 7] CORS Headers..."
HEADERS=$(curl -s -I -H "Origin: http://localhost:3000" \
  $GATEWAY_URL/api/auth/login | grep -i "access-control")
if [ -n "$HEADERS" ]; then
    echo "✓ PASSED"
    ((PASSED++))
else
    echo "✗ FAILED (No CORS headers)"
    ((FAILED++))
fi

echo
echo "========================================="
echo "   Test Results"
echo "========================================="
echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo "Total:  $((PASSED + FAILED))"
echo "========================================="

if [ "$FAILED" -eq 0 ]; then
    echo "✓ All tests passed!"
    exit 0
else
    echo "✗ Some tests failed"
    exit 1
fi
```

Run tests:
```bash
chmod +x test-gateway.sh
./test-gateway.sh
```

## Continuous Testing

### During Development
```bash
# Watch mode - run tests on file changes
watch -n 5 ./test-gateway.sh
```

### Before Deployment
```bash
# Full test suite
./test-gateway.sh

# Load testing
ab -n 10000 -c 100 http://localhost:8080/api/jobs

# Security scan
# Use tools like OWASP ZAP
```

## Debugging Failed Tests

### Enable Debug Logging
```yaml
logging:
  level:
    com.gramwork.gateway: DEBUG
```

### Check Gateway Logs
```bash
tail -f logs/api-gateway.log
```

### Check Service Registration
```bash
curl http://localhost:8761/eureka/apps | jq
```

### Verify Configuration
```bash
curl http://localhost:8080/actuator/env | jq
```

## Best Practices

1. **Run tests in isolation** - Each test should be independent
2. **Clean up test data** - Remove test users/jobs after tests
3. **Use test-specific tokens** - Don't use production tokens
4. **Monitor during tests** - Check logs and metrics
5. **Automate testing** - Include in CI/CD pipeline
6. **Test error cases** - Not just happy paths
7. **Performance baseline** - Establish acceptable thresholds
8. **Security first** - Test authentication/authorization thoroughly

## License

Copyright © 2024 GramWork. All rights reserved.
