# JWT Authentication in API Gateway

Complete guide for JWT authentication implementation in GramWork API Gateway.

## Overview

The API Gateway implements JWT (JSON Web Token) authentication to secure all microservices. Authentication is handled centrally at the gateway level, and user context is propagated to downstream services.

## Architecture

```
Client Request
    ↓
API Gateway (Port 8080)
    ↓
JWT Authentication Filter
    ├─ Extract JWT Token
    ├─ Validate Token
    ├─ Extract User Info
    └─ Add Headers (X-User-Id, X-User-Role, X-User-Email)
    ↓
Authorization Filter
    ├─ Check Role Permissions
    └─ Allow/Deny Access
    ↓
Route to Microservice
    ↓
Microservice (receives user context in headers)
```

## Components

### 1. JwtUtil
**Location:** `com.gramwork.gateway.util.JwtUtil`

**Responsibilities:**
- Validate JWT tokens
- Extract user information (userId, role, email)
- Check token expiration
- Parse JWT claims

**Methods:**
```java
boolean validateToken(String token)
String getUserId(String token)
String getRole(String token)
String getEmail(String token)
boolean isTokenExpired(String token)
String extractToken(String authHeader)
```

### 2. JwtAuthenticationFilter
**Location:** `com.gramwork.gateway.filter.JwtAuthenticationFilter`

**Order:** `HIGHEST_PRECEDENCE + 3`

**Responsibilities:**
- Intercept all requests
- Skip public endpoints
- Extract and validate JWT tokens
- Add user context headers to requests
- Handle authentication errors

**Headers Added:**
- `X-User-Id`: User's unique identifier
- `X-User-Role`: User's role (ADMIN, EMPLOYER, WORKER)
- `X-User-Email`: User's email address

### 3. AuthorizationFilter
**Location:** `com.gramwork.gateway.filter.AuthorizationFilter`

**Order:** `HIGHEST_PRECEDENCE + 4`

**Responsibilities:**
- Role-based access control
- Endpoint-specific authorization
- Permission validation

### 4. RouteValidator
**Location:** `com.gramwork.gateway.validator.RouteValidator`

**Responsibilities:**
- Maintain list of public endpoints
- Validate if route requires authentication
- Support wildcard matching

### 5. UserContext
**Location:** `com.gramwork.gateway.model.UserContext`

**Purpose:** Model representing authenticated user information

## Public Endpoints

These endpoints **do NOT** require authentication:

```
/api/auth/login
/api/auth/register
/api/auth/send-otp
/api/auth/verify-otp
/api/auth/ResetPasswordMail
/api/auth/ResetPassword
/actuator/health
/actuator/info
```

## Protected Endpoints

All other endpoints require valid JWT authentication.

## Role-Based Access Control

### ADMIN Role
- Full access to all endpoints
- Can view, create, update, delete any resource

### EMPLOYER Role
- Access to employer profile endpoints
- Can create and manage job postings
- Can view and manage their own assignments
- Can process payments for their jobs

### WORKER/LABORER Role
- Access to worker profile endpoints
- Can view job postings
- Can apply to jobs
- Can view and manage their assignments
- Can view their payment history

## JWT Token Format

### Token Structure
```
Header.Payload.Signature
```

### Expected Claims
```json
{
  "sub": "user-id-here",
  "email": "user@example.com",
  "role": "WORKER",
  "iat": 1640000000,
  "exp": 1640086400
}
```

### Required Claims
- `sub` (subject): User ID
- `role`: User role (ADMIN, EMPLOYER, WORKER)
- `email`: User email address
- `exp` (expiration): Token expiration timestamp
- `iat` (issued at): Token creation timestamp

## Authentication Flow

### 1. Login Request
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 2. Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "role": "WORKER",
  "email": "user@example.com"
}
```

### 3. Authenticated Request
```bash
GET /api/jobs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Gateway Processing
1. Extract token from `Authorization` header
2. Validate token signature and expiration
3. Extract user claims (userId, role, email)
4. Add user context headers
5. Route to backend service

### 5. Backend Receives
```
GET /api/job
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-User-Id: 507f1f77bcf86cd799439011
X-User-Role: WORKER
X-User-Email: user@example.com
X-Trace-Id: 123e4567-e89b-12d3-a456-426614174000
```

## Error Responses

### 401 Unauthorized - Missing Token
```json
{
  "timestamp": "2024-01-20T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Missing or invalid Authorization header",
  "path": "/api/jobs"
}
```

### 401 Unauthorized - Invalid Token
```json
{
  "timestamp": "2024-01-20T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token",
  "path": "/api/jobs"
}
```

### 403 Forbidden - Insufficient Permissions
```json
{
  "timestamp": "2024-01-20T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied - insufficient permissions",
  "path": "/api/employers/123"
}
```

## Configuration

### application.yml
```yaml
jwt:
  secret: ${JWT_SECRET:gramwork-secret-key}

public:
  endpoints:
    - /api/auth/login
    - /api/auth/register
    - /actuator/health
```

### Environment Variables
```bash
JWT_SECRET=your-secret-key-change-in-production
```

## Testing

### Test Public Endpoint
```bash
# Should work without token
curl http://localhost:8080/api/auth/login
```

### Test Protected Endpoint Without Token
```bash
# Should return 401
curl http://localhost:8080/api/jobs
```

### Test Protected Endpoint With Valid Token
```bash
# Should return 200
curl -H "Authorization: Bearer <valid-token>" \
     http://localhost:8080/api/jobs
```

### Test Protected Endpoint With Expired Token
```bash
# Should return 401
curl -H "Authorization: Bearer <expired-token>" \
     http://localhost:8080/api/jobs
```

### Test Role-Based Access
```bash
# Worker trying to access employer endpoint - Should return 403
curl -H "Authorization: Bearer <worker-token>" \
     http://localhost:8080/api/employers/create
```

## Security Best Practices

### 1. Secret Key Management
- **Never** hardcode JWT secret in code
- Use environment variables
- Rotate secrets regularly
- Use strong, random secrets (min 256 bits)

### 2. Token Expiration
- Set appropriate expiration times
- Recommended: 24 hours for access tokens
- Implement refresh token mechanism

### 3. Token Transmission
- Always use HTTPS in production
- Never send tokens in URL parameters
- Store tokens securely in client

### 4. Token Validation
- Always validate signature
- Check expiration
- Validate required claims
- Handle all JWT exceptions

### 5. Error Handling
- Don't leak sensitive information in errors
- Log authentication failures
- Implement rate limiting for auth endpoints

## Integration with Microservices

### Extracting User Context in Services

```java
@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    
    @GetMapping
    public ResponseEntity<Profile> getProfile(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader(value = "X-User-Email", required = false) String email) {
        
        // Use user information
        Profile profile = profileService.getProfile(userId);
        return ResponseEntity.ok(profile);
    }
}
```

### Security in Microservices

Even though authentication is handled at gateway:
1. **Validate headers**: Ensure X-User-Id is present
2. **Double-check permissions**: Implement service-level authorization
3. **Trust but verify**: Gateway adds security layer, services add business logic layer

## Monitoring and Debugging

### Enable Debug Logging
```yaml
logging:
  level:
    com.gramwork.gateway.filter.JwtAuthenticationFilter: DEBUG
    com.gramwork.gateway.util.JwtUtil: DEBUG
```

### Check Authentication Logs
```bash
tail -f logs/api-gateway.log | grep JWT
```

### Metrics to Monitor
- Authentication success rate
- Authentication failure rate
- Token expiration rate
- Unauthorized access attempts
- Role distribution of requests

## Troubleshooting

### Problem: "Invalid or expired JWT token"
**Causes:**
- Token has expired
- Token signature is invalid
- Wrong JWT secret configured
- Malformed token

**Solution:**
1. Verify token expiration time
2. Check JWT secret matches auth service
3. Validate token format
4. Generate new token

### Problem: "Missing or invalid Authorization header"
**Causes:**
- No Authorization header sent
- Wrong header format (not "Bearer <token>")
- Whitespace issues in header

**Solution:**
1. Ensure header is included: `Authorization: Bearer <token>`
2. Check for typos in header name
3. Verify token has no extra whitespace

### Problem: "Access denied - insufficient permissions"
**Causes:**
- User role doesn't have permission
- Wrong endpoint accessed
- Role not properly set in token

**Solution:**
1. Check user role in token claims
2. Verify authorization rules in AuthorizationFilter
3. Ensure role is correct for the endpoint

### Problem: Token works locally but not in Docker
**Causes:**
- Different JWT secret in environments
- Network issues between services
- Clock skew between containers

**Solution:**
1. Verify JWT_SECRET environment variable
2. Check container networking
3. Synchronize container clocks

## Production Considerations

### 1. Token Refresh Strategy
Implement refresh token mechanism:
- Short-lived access tokens (15-30 minutes)
- Long-lived refresh tokens (7-30 days)
- Refresh endpoint to get new access token

### 2. Token Revocation
Implement token blacklist:
- Store revoked tokens in Redis
- Check blacklist before validation
- Clean up expired tokens

### 3. Multiple JWT Secrets
Support key rotation:
- Store multiple valid secrets
- Try validation with each key
- Mark old keys for deprecation

### 4. Rate Limiting
Protect authentication endpoints:
- Limit login attempts
- Block after multiple failures
- Implement CAPTCHA for suspicious activity

### 5. Audit Logging
Log security events:
- All authentication attempts
- Authorization failures
- Token validation errors
- Suspicious activities

## API Documentation

### Gateway JWT Endpoints

| Purpose | Method | Endpoint | Auth Required |
|---------|--------|----------|---------------|
| Login | POST | /api/auth/login | No |
| Register | POST | /api/auth/register | No |
| Verify OTP | PUT | /api/auth/verify-otp | No |
| Get Profile | GET | /api/profile | Yes |
| Update Profile | PUT | /api/profile | Yes |

## References

- [JWT.io](https://jwt.io/) - JWT Debugger
- [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
- [JJWT Library](https://github.com/jwtk/jjwt)

## Support

For JWT authentication issues:
1. Check logs for specific error messages
2. Validate token at jwt.io
3. Verify JWT secret matches across services
4. Review this documentation
5. Contact GramWork DevOps team

## License

Copyright © 2024 GramWork. All rights reserved.
