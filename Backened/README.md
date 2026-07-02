# GramWork Microservices Backend

Production-ready microservices architecture for GramWork application.

## 🚀 Quick Start

### Option 1: Build Verification (Recommended First Step)

Before starting services, verify all services compile correctly:

```bash
# Windows
VERIFY_BUILD.bat

# Linux/Mac
chmod +x BUILD_ALL.sh
./BUILD_ALL.sh
```

### Option 2: Using Docker (Recommended for Production)

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Build all Docker images
docker-compose build

# 3. Start all services
docker-compose up -d

# 4. Check status
docker-compose ps

# 5. View logs
docker-compose logs -f
```

### Option 3: Using Build Scripts (Development)

```bash
# Windows - Build all JARs
BUILD_ALL.bat

# Linux/Mac - Build all JARs
chmod +x BUILD_ALL.sh
./BUILD_ALL.sh
```

### Option 4: Using Startup Scripts (Local Development)

```bash
# Make scripts executable (Linux/Mac)
chmod +x START_SERVICES.sh STOP_SERVICES.sh

# Start all services
./START_SERVICES.sh

# Stop all services
./STOP_SERVICES.sh
```

### Option 5: Manual Start (Development)

```bash
# Start infrastructure
docker-compose up -d mongodb redis rabbitmq zipkin

# Start services in order
cd config-server && mvn spring-boot:run
cd eureka-server && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run
cd Auth && mvn spring-boot:run
# ... etc
```

## 📊 Architecture

```
Frontend → API Gateway → Microservices → Databases
              ↓              ↓
         Eureka Server   Config Server
```

## 🏗️ Services

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 8080 | Single entry point |
| Config Server | 8888 | Centralized configuration |
| Eureka Server | 8761 | Service discovery |
| Auth Service | 8086 | Authentication & authorization |
| Laborer Profile | 8081 | Worker profile management |
| Employer Profile | 8089 | Employer profile management |
| Job Service | 8083 | Job posting & matching |
| Assignment Service | 8084 | Work assignment management |
| Payment Service | 8088 | Payment processing |
| Notification Service | 8082 | Email, SMS, Push notifications |

## 📚 Documentation

### Core Documentation
- **[GRAMWORK_INFRASTRUCTURE_SUMMARY.md](GRAMWORK_INFRASTRUCTURE_SUMMARY.md)** - Complete infrastructure overview
- **[BUILD_FIXES_APPLIED.md](BUILD_FIXES_APPLIED.md)** - Compilation fixes and build verification ⭐ NEW
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - Docker deployment guide
- **[MICROSERVICE_CONFIGURATION_GUIDE.md](MICROSERVICE_CONFIGURATION_GUIDE.md)** - Configuration management
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Production deployment checklist

### Service-Specific Documentation
- **[api-gateway/JWT_AUTHENTICATION.md](api-gateway/JWT_AUTHENTICATION.md)** - JWT authentication guide
- **[api-gateway/TESTING_GUIDE.md](api-gateway/TESTING_GUIDE.md)** - Testing procedures
- **[eureka-server/README.md](eureka-server/README.md)** - Eureka Server documentation
- **[config-server/README.md](config-server/README.md)** - Config Server documentation

### Build Scripts
- **BUILD_ALL.bat / BUILD_ALL.sh** - Build all services with one command
- **VERIFY_BUILD.bat** - Quick compilation verification (Windows)
- **START_SERVICES.sh** - Start all services (Linux/Mac)
- **STOP_SERVICES.sh** - Stop all services (Linux/Mac)

## 🔧 Technology Stack

- **Java 21** - Amazon Corretto
- **Spring Boot 3.2.1** - Framework
- **Spring Cloud 2023.0.0** - Microservices patterns
- **MongoDB 7.0** - Database
- **Redis 7** - Cache
- **RabbitMQ 3.12** - Message queue
- **Docker** - Containerization

## ✅ Features

- ✅ Service Discovery (Eureka)
- ✅ Centralized Configuration (Config Server)
- ✅ API Gateway with JWT Authentication
- ✅ Circuit Breakers (Resilience4j)
- ✅ Rate Limiting (Redis)
- ✅ Distributed Tracing (Zipkin)
- ✅ Health Monitoring
- ✅ Docker Support
- ✅ Load Balancing
- ✅ CORS Support

## 🧪 Testing

```bash
# Check health
curl http://localhost:8080/actuator/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123"}'

# Access protected endpoint
curl -H "Authorization: Bearer <token>" \
  http://localhost:8080/api/jobs
```

## 🐛 Troubleshooting

### Common Build Issues

**Issue: "Premature end of Content-Length" (Maven)**
```bash
# Solution: Force update dependencies
mvn clean install -U
```

**Issue: "Package org.springframework.security does not exist" (API Gateway)**
```
Solution: Already fixed in current version
The Spring Security dependency is now included in pom.xml
```

**Issue: "Incompatible types: <nulltype> cannot be converted to int"**
```
Solution: Already fixed in current version
Retry configuration simplified in GatewayConfig.java
```

For more issues and solutions, see:
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Comprehensive troubleshooting guide
- **[BUILD_FIXES_APPLIED.md](BUILD_FIXES_APPLIED.md)** - All fixes documentation
- **[GRAMWORK_INFRASTRUCTURE_SUMMARY.md](GRAMWORK_INFRASTRUCTURE_SUMMARY.md#troubleshooting)** - Infrastructure troubleshooting

## 📞 Support

For issues or questions, contact GramWork DevOps team.

## 📄 License

Copyright © 2024 GramWork. All rights reserved.
