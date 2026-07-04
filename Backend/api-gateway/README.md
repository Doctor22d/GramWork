# GramWork API Gateway

Central API Gateway for all GramWork microservices using Spring Cloud Gateway.

## Overview

The API Gateway serves as the single entry point for all client applications, providing routing, load balancing, authentication, rate limiting, and cross-cutting concerns for the microservices architecture.

## Features

- ✅ **Dynamic Routing** with Eureka service discovery
- ✅ **Load Balancing** across multiple service instances
- ✅ **JWT Authentication** and authorization
- ✅ **Rate Limiting** using Redis
- ✅ **Circuit Breaker** with Resilience4j
- ✅ **Request/Response Logging** with correlation IDs
- ✅ **CORS Handling** for frontend applications
- ✅ **Global Exception Handling**
- ✅ **Distributed Tracing** with Zipkin
- ✅ **Health Monitoring** and metrics
- ✅ **Fallback Responses** for service failures

## Technology Stack

- Spring Boot 3.2.1
- Spring Cloud Gateway 4.1.0
- Spring Cloud Eureka Client
- Resilience4j Circuit Breaker
- JWT (io.jsonwebtoken)
- Redis (Rate Limiting)
- Micrometer & Zipkin (Tracing)
- Java 21

## Quick Start

### Local Development

```bash
# Build the project
mvn clean install

# Run the gateway
mvn spring-boot:run

# Or with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Docker

```bash
# Build image
docker build -t gramwork/api-gateway:latest .

# Run container
docker run -d \
  -p 8080:8080 \
  -e EUREKA_SERVER_URL=http://eureka-server:8761/eureka/ \
  -e CONFIG_SERVER_URL=http://config-server:8888 \
  --name api-gateway \
  gramwork/api-gateway:latest
```

## Configuration

### Default Ports

- **Gateway Port:** 8080
- **Health Check:** http://localhost:8080/actuator/health
- **Routes:** http://localhost:8080/actuator/gateway/routes

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| CONFIG_SERVER_URL | http://localhost:8888 | Config server URL |
| CONFIG_USERNAME | config | Config server username |
| CONFIG_PASSWORD | config123 | Config server password |
| EUREKA_SERVER_URL | http://localhost:8761/eureka/ | Eureka server URL |
| JWT_SECRET | - | JWT signing secret |
| REDIS_HOST | localhost | Redis host |
| REDIS_PORT | 6379 | Redis port |
| ZIPKIN_URL | http://localhost:9411/api/v2/spans | Zipkin endpoint |

## Routes Configuration

### Service Routes

| Path | Target Service | Port |
|------|----------------|------|
| /api/auth/** | gramwork-auth-service | 8086 |
| /api/laborers/** | laborer-profile-service | 8081 |
| /api/employers/** | employer-profile-service | 8089 |
| /api/jobs/** | job-service | 8083 |
| /api/assignments/** | assignment-service | 8084 |
| /api/payments/** | payment-service | 8088 |
| /api/notifications/** | notification-service | 8082 |

### Public Endpoints (No Authentication)

```
- /api/auth/login
- /api/auth/register
- /api/auth/send-otp
- /api/auth/verify-otp
- /api/auth/ResetPasswordMail
- /api/auth/ResetPassword
- /actuator/health
- /actuator/info
```

All other endpoints require valid JWT authentication.

## Filters

### Global Filters

1. **LoggingFilter** (Order: HIGHEST_PRECEDENCE)
   - Logs all incoming requests and outgoing responses
   - Captures request method, URI, status code, and execution time
   - Excludes sensitive headers (Authorization, Cookie)

2. **TraceIdFilter** (Order: HIGHEST_PRECEDENCE + 1)
   - Adds unique correlation ID to each request
   - Enables distributed tracing across services
   - Headers: `X-Trace-Id`, `X-Correlation-Id`

3. **RateLimitFilter** (Order: HIGHEST_PRECEDENCE + 2)
   - Implements token bucket algorithm using Redis
   - Default limit: 100 requests per minute per client
   - Headers: `X-Rate-Limit-Limit`, `X-Rate-Limit-Remaining`

4. **JwtAuthenticationFilter** (Order: HIGHEST_PRECEDENCE + 3)
   - Validates JWT tokens
   - Extracts user information
   - Skips public endpoints

### Route-Specific Filters

- **CircuitBreaker**: Protects against cascading failures
- **Retry**: Automatically retries failed requests
- **RewritePath**: Transforms request paths for backend services

## Circuit Breaker Configuration

```yaml
resilience4j:
  circuitbreaker:
    instances:
      authService:
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        failureRateThreshold: 50
        waitDurationInOpenState: 10s
```

Configured for all services:
- Auth Service
- Profile Services
- Job Service
- Assignment Service
- Payment Service
- Notification Service

## Rate Limiting

Default configuration:
- **Limit**: 100 requests per minute
- **Storage**: Redis
- **Identifier**: User ID (if authenticated) or IP address

Response headers:
```
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 95
X-Rate-Limit-Retry-After-Seconds: 60  (when limit exceeded)
```

## CORS Configuration

Allowed origins:
- http://localhost:3000 (React)
- http://localhost:5173 (Vite)
- http://localhost:4200 (Angular)
- https://gramwork.com (Production)

Allowed methods:
- GET, POST, PUT, DELETE, PATCH, OPTIONS

## Exception Handling

Global exception handler provides consistent error responses:

```json
{
  "timestamp": "2024-01-20T10:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/api/jobs/123"
}
```

## Fallback Responses

When services are unavailable:

```json
{
  "timestamp": "2024-01-20T10:30:00",
  "status": 503,
  "error": "Service Unavailable",
  "message": "Job service is temporarily unavailable",
  "service": "Job Service",
  "fallback": true
}
```

## Monitoring

### Actuator Endpoints

- Health: `/actuator/health`
- Info: `/actuator/info`
- Metrics: `/actuator/metrics`
- Prometheus: `/actuator/prometheus`
- Gateway Routes: `/actuator/gateway/routes`
- Circuit Breakers: `/actuator/circuitbreakers`

### Health Check

```bash
curl http://localhost:8080/actuator/health
```

Response:
```json
{
  "status": "UP",
  "components": {
    "circuitBreakers": {"status": "UP"},
    "discoveryComposite": {"status": "UP"},
    "ping": {"status": "UP"},
    "redis": {"status": "UP"}
  }
}
```

### View Routes

```bash
curl http://localhost:8080/actuator/gateway/routes | jq
```

## Distributed Tracing

Integration with Zipkin for request tracing:

1. **Trace ID**: Unique identifier for entire request flow
2. **Span ID**: Unique identifier for each service call
3. **View traces**: http://localhost:9411/zipkin

## Testing

### Test Gateway Health

```bash
curl http://localhost:8080/actuator/health
```

### Test Service Routing

```bash
# Auth service
curl http://localhost:8080/api/auth/login

# Job service
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/jobs

# Profile service
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/laborers/123
```

### Test Rate Limiting

```bash
# Make 101 requests quickly
for i in {1..101}; do
  curl -w "\n%{http_code}\n" http://localhost:8080/api/auth/login
done
# 101st request should return 429 Too Many Requests
```

### Test Circuit Breaker

```bash
# Stop a service and make requests
# Circuit breaker should open and return fallback response
curl http://localhost:8080/api/jobs
```

## Performance Tuning

### JVM Options

```bash
JAVA_OPTS="-Xmx1024m -Xms512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
```

### Gateway Configuration

```yaml
spring:
  cloud:
    gateway:
      httpclient:
        connect-timeout: 5000
        response-timeout: 10s
        pool:
          max-connections: 500
          max-pending-acquires: 1000
```

## Security

### JWT Authentication

- Token validation on every request
- User information extraction
- Role-based access control ready
- Token expiration checking

### Rate Limiting

- Prevents DDoS attacks
- Protects backend services
- Distributed rate limiting with Redis

### CORS

- Restricts allowed origins
- Configurable for different environments
- Credentials support

## Troubleshooting

### Gateway Not Starting

1. Check if Config Server is accessible
2. Verify Eureka Server is running
3. Check port 8080 availability
4. Review application logs

### Services Not Routing

1. Verify services are registered in Eureka
2. Check service names match route configuration
3. Review gateway routes: `/actuator/gateway/routes`
4. Check circuit breaker status

### Rate Limiting Not Working

1. Verify Redis is running and accessible
2. Check Redis connection in logs
3. Review rate limit configuration
4. Test Redis connectivity

### CORS Errors

1. Verify frontend origin is in allowed origins list
2. Check CORS configuration
3. Review preflight requests (OPTIONS)
4. Check browser console for detailed errors

## Best Practices

1. **Always use JWT authentication** for protected endpoints
2. **Configure appropriate timeouts** for backend services
3. **Monitor circuit breaker metrics** regularly
4. **Set up alerts** for high error rates
5. **Use correlation IDs** for debugging
6. **Enable distributed tracing** in production
7. **Configure rate limits** based on load testing
8. **Keep fallback responses** informative
9. **Log important events** but avoid sensitive data
10. **Regular security updates** for dependencies

## Production Deployment

### High Availability

Deploy multiple gateway instances:

```yaml
# Instance 1
eureka:
  instance:
    instance-id: api-gateway-1

# Instance 2
eureka:
  instance:
    instance-id: api-gateway-2
```

### Load Balancer Configuration

Use external load balancer (Nginx, HAProxy) in front of gateway instances.

### SSL/TLS

Configure HTTPS for production:

```yaml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: ${SSL_KEYSTORE_PASSWORD}
    key-store-type: PKCS12
```

## API Documentation

### Gateway Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /actuator/health | GET | Health check |
| /actuator/gateway/routes | GET | List all routes |
| /actuator/gateway/refresh | POST | Refresh routes |
| /actuator/metrics | GET | Gateway metrics |
| /actuator/prometheus | GET | Prometheus metrics |

## Support

For issues or questions:
- Review documentation
- Check logs in `logs/` directory
- Verify all services are registered in Eureka
- Test individual services directly
- Contact GramWork DevOps team

## License

Copyright © 2024 GramWork. All rights reserved.
