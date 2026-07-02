# GramWork Services Port Configuration

## Architecture

All frontend traffic is routed through the **API Gateway** on port **8080**.
The gateway uses **Eureka Service Discovery** to forward requests to the correct microservice.

```
Frontend (3000/5173)  →  API Gateway (8080)  →  Microservices (8081–8090)
                              ↕
                        Eureka Server (8761)
```

## API Gateway Routes

| Frontend Path | Target Service | Eureka Name | Service Port |
|---------------|---------------|-------------|--------------|
| `/api/auth/**` | Auth Service | `gramwork-auth-service` | 8086 |
| `/api/laborers/**` | Laborer Profile Service | `laborer-profile-service` | 8081 |
| `/api/employers/**` | Employer Profile Service | `employer-profile-service` | 8089 |
| `/api/jobs/**` | Job Service | `job-service` | 8083 |
| `/api/assignments/**` | Assignment Service | `assignment-service` | 8084 |
| `/api/payments/**` | Payment Service | `payment-service` | 8088 |
| `/api/notifications/**` | Notification Service | `notification-service` | 8082 |
| `/api/attendance/**` | Attendance Service | `attendence` | 8090 |
| `/api/Matching/**` | AI Matching Service | `aimatchingservice` | 8087 |

## Infrastructure Services

| Service | Port |
|---------|------|
| **API Gateway** | 8080 |
| **Eureka Server** | 8761 |
| **Config Server** | 8888 |

## Frontend Configuration

The frontend (`constants.ts`) points all API calls to:
```
http://localhost:8080
```

The API Gateway handles routing, JWT authentication, CORS, circuit breaking, and rate limiting.

---

## Quick Test

After starting all services, test via the gateway:
```bash
# Health check
curl http://localhost:8080/actuator/health

# Auth (public endpoint)
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test"}'

# Check gateway routes
curl http://localhost:8080/actuator/gateway/routes
```
