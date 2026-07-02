# Microservice Configuration Guide

Complete guide for configuring all GramWork microservices with Config Server and Eureka.

## Overview

All GramWork microservices follow a centralized configuration approach:
- **Config Server**: Provides centralized external configuration
- **Eureka Server**: Provides service discovery and registration
- **Bootstrap Configuration**: Connects services to Config Server
- **Application Configuration**: Service-specific settings from Config Server

## Architecture

```
Microservice Startup
    ↓
Read bootstrap.yml (local)
    ↓
Connect to Config Server (8888)
    ↓
Fetch application.yml from Config Server
    ↓
Register with Eureka Server (8761)
    ↓
Service Ready
```

## Service Configuration Matrix

| Service | Name | Port | Database | Config Required |
|---------|------|------|----------|-----------------|
| Auth Service | gramwork-auth-service | 8086 | GramWorkAuth | MongoDB, Redis, RabbitMQ, JWT |
| Laborer Profile | laborer-profile-service | 8081 | GramWorkLaborerProfile | MongoDB, Redis, Feign |
| Employer Profile | employer-profile-service | 8089 | GramWorkEmployerProfile | MongoDB, Redis, Feign |
| Job Service | job-service | 8083 | GramWorkJob | MongoDB, Redis, RabbitMQ, Feign |
| Assignment Service | assignment-service | 8084 | GramWorkAssignment | MongoDB, Redis, RabbitMQ, Feign |
| Payment Service | payment-service | 8088 | GramWorkPayment | MongoDB, Redis, RabbitMQ, Payment Gateways |
| Notification Service | notification-service | 8082 | GramWorkNotification | MongoDB, Redis, RabbitMQ, Email, SMS |

## Required Dependencies

### All Services Must Include

```xml
<!-- Spring Cloud Config Client -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>

<!-- Eureka Client -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>

<!-- Spring Boot Actuator -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Resilience4j Circuit Breaker -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>
```

### Optional Dependencies

```xml
<!-- For services calling other services -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>

<!-- For distributed tracing -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-brave</artifactId>
</dependency>

<!-- For metrics -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

## Bootstrap Configuration (bootstrap.yml)

### Location
`src/main/resources/bootstrap.yml`

### Template
```yaml
spring:
  application:
    name: {service-name}  # Must match config file name
  
  cloud:
    config:
      uri: ${CONFIG_SERVER_URL:http://localhost:8888}
      username: ${CONFIG_USERNAME:config}
      password: ${CONFIG_PASSWORD:config123}
      fail-fast: true
      retry:
        max-attempts: 6
        initial-interval: 1000
        multiplier: 1.5
        max-interval: 2000
  
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}
```

### Service Names
- `gramwork-auth-service`
- `laborer-profile-service`
- `employer-profile-service`
- `job-service`
- `assignment-service`
- `payment-service`
- `notification-service`

## Application Configuration (From Config Server)

### Standard Configuration Blocks

#### 1. Server Configuration
```yaml
server:
  port: 8080
  error:
    include-message: always
    include-binding-errors: always
```

#### 2. Spring Application Name
```yaml
spring:
  application:
    name: service-name
```

#### 3. MongoDB Configuration
```yaml
spring:
  data:
    mongodb:
      uri: ${MONGODB_URI:mongodb://localhost:27017/DatabaseName}
      auto-index-creation: true
```

#### 4. Redis Configuration
```yaml
spring:
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:}
    timeout: 2000ms
    jedis:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
```

#### 5. RabbitMQ Configuration
```yaml
spring:
  rabbitmq:
    host: ${RABBITMQ_HOST:localhost}
    port: ${RABBITMQ_PORT:5672}
    username: ${RABBITMQ_USERNAME:guest}
    password: ${RABBITMQ_PASSWORD:guest}
    virtual-host: /
    listener:
      simple:
        retry:
          enabled: true
          initial-interval: 3000
          max-attempts: 3
```

#### 6. Eureka Client Configuration
```yaml
eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka/}
    register-with-eureka: true
    fetch-registry: true
    registry-fetch-interval-seconds: 30
  instance:
    prefer-ip-address: true
    instance-id: ${spring.application.name}:${spring.application.instance_id:${random.value}}
    lease-renewal-interval-in-seconds: 10
    lease-expiration-duration-in-seconds: 30
    health-check-url-path: /actuator/health
```

#### 7. Actuator Configuration
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
      base-path: /actuator
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true
```

#### 8. Feign Client Configuration
```yaml
feign:
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 5000
  circuitbreaker:
    enabled: true
```

#### 9. Resilience4j Circuit Breaker
```yaml
resilience4j:
  circuitbreaker:
    instances:
      serviceName:
        registerHealthIndicator: true
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
        waitDurationInOpenState: 10s
        failureRateThreshold: 50
        eventConsumerBufferSize: 10
  
  retry:
    instances:
      serviceName:
        maxAttempts: 3
        waitDuration: 500ms
```

#### 10. Logging Configuration
```yaml
logging:
  level:
    root: INFO
    com.gramwork: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/{service-name}.log
```

## Enable Service Discovery

### Add Annotation to Main Class

```java
@SpringBootApplication
@EnableDiscoveryClient  // Add this annotation
@EnableFeignClients     // If using Feign
public class ServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ServiceApplication.class, args);
    }
}
```

## Environment Variables

### Development (Local)
```bash
# Config Server
export CONFIG_SERVER_URL=http://localhost:8888
export CONFIG_USERNAME=config
export CONFIG_PASSWORD=config123

# Eureka Server
export EUREKA_SERVER_URL=http://localhost:8761/eureka/

# MongoDB
export MONGODB_URI=mongodb://localhost:27017/{DatabaseName}

# Redis
export REDIS_HOST=localhost
export REDIS_PORT=6379

# RabbitMQ
export RABBITMQ_HOST=localhost
export RABBITMQ_PORT=5672
export RABBITMQ_USERNAME=guest
export RABBITMQ_PASSWORD=guest

# Active Profile
export SPRING_PROFILES_ACTIVE=dev
```

### Docker
```bash
# Config Server
CONFIG_SERVER_URL=http://config-server:8888

# Eureka Server
EUREKA_SERVER_URL=http://eureka-server:8761/eureka/

# MongoDB
MONGODB_URI=mongodb://mongodb:27017/{DatabaseName}

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672

# Active Profile
SPRING_PROFILES_ACTIVE=docker
```

### Production
```bash
# Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
# Never hardcode production credentials
```

## Service Startup Order

**Critical:** Services must start in this order:

1. **Infrastructure Services**
   ```
   1. MongoDB
   2. Redis
   3. RabbitMQ
   ```

2. **Core Services**
   ```
   4. Config Server (8888)
   5. Eureka Server (8761)
   ```

3. **API Gateway**
   ```
   6. API Gateway (8080)
   ```

4. **Business Services** (Can start in parallel)
   ```
   7. Auth Service (8086)
   8. Laborer Profile Service (8081)
   9. Employer Profile Service (8089)
   10. Job Service (8083)
   11. Assignment Service (8084)
   12. Payment Service (8088)
   13. Notification Service (8082)
   ```

## Health Checks

### Check Service Health
```bash
curl http://localhost:{port}/actuator/health
```

### Check Service Registration
```bash
# View all registered services in Eureka
curl http://localhost:8761/eureka/apps | jq
```

### Check Configuration
```bash
# View loaded configuration
curl http://localhost:{port}/actuator/env | jq
```

## Troubleshooting

### Service Not Starting

**Problem:** Service fails to start

**Possible Causes:**
1. Config Server not reachable
2. Eureka Server not reachable
3. MongoDB/Redis/RabbitMQ not running
4. Port already in use
5. Wrong configuration

**Solutions:**
```bash
# Check Config Server
curl http://localhost:8888/actuator/health

# Check Eureka Server
curl http://localhost:8761/actuator/health

# Check if service name matches config file
# bootstrap.yml: spring.application.name
# config-repository: {name}.yml

# Check logs
tail -f logs/{service-name}.log

# Verify port availability
netstat -an | grep {port}
```

### Service Not Registering with Eureka

**Problem:** Service starts but doesn't appear in Eureka

**Possible Causes:**
1. `@EnableDiscoveryClient` annotation missing
2. Wrong Eureka server URL
3. Eureka client dependency missing
4. Network connectivity issues

**Solutions:**
```bash
# Verify Eureka configuration
curl http://localhost:{port}/actuator/env | grep eureka

# Check Eureka server
curl http://localhost:8761/

# Verify dependency in pom.xml
grep eureka pom.xml

# Check application logs for registration errors
grep -i eureka logs/{service-name}.log
```

### Configuration Not Loading

**Problem:** Configuration from Config Server not applied

**Possible Causes:**
1. bootstrap.yml missing or misconfigured
2. Service name mismatch
3. Config Server credentials wrong
4. Config file doesn't exist

**Solutions:**
```bash
# Test Config Server directly
curl -u config:config123 http://localhost:8888/{service-name}/default

# Verify bootstrap.yml exists
ls -la src/main/resources/bootstrap.yml

# Check service name matches
# bootstrap.yml vs config-repository/{name}.yml

# Enable debug logging
logging.level.org.springframework.cloud.config=DEBUG
```

### Service-to-Service Communication Failing

**Problem:** Services can't communicate

**Possible Causes:**
1. Services not registered in Eureka
2. Wrong service name in Feign client
3. Circuit breaker is open
4. Network issues

**Solutions:**
```bash
# Check all services are registered
curl http://localhost:8761/eureka/apps | jq '.applications.application[].name'

# Verify service names in Feign clients match Eureka registration

# Check circuit breaker status
curl http://localhost:{port}/actuator/circuitbreakers | jq

# Test direct service call
curl http://localhost:{target-port}/actuator/health
```

## Best Practices

### 1. Configuration Management
- Store sensitive data in environment variables
- Use profiles (dev, test, prod)
- Version control configuration files
- Encrypt sensitive properties
- Document all custom properties

### 2. Service Registration
- Always use `@EnableDiscoveryClient`
- Configure appropriate lease intervals
- Use meaningful instance IDs
- Enable health checks
- Monitor registration status

### 3. Circuit Breakers
- Configure appropriate thresholds
- Implement fallback methods
- Monitor circuit breaker metrics
- Test failure scenarios
- Document dependencies

### 4. Logging
- Use structured logging
- Include correlation IDs
- Log important events
- Avoid logging sensitive data
- Configure appropriate log levels

### 5. Health Checks
- Expose actuator endpoints
- Include dependency health checks
- Monitor health regularly
- Set up alerts
- Document health indicators

### 6. Security
- Never commit secrets
- Use environment variables
- Rotate credentials regularly
- Implement proper authentication
- Audit access logs

## Configuration Checklist

Before deploying a service, verify:

- [ ] bootstrap.yml exists and is correct
- [ ] Service name matches config file
- [ ] All required dependencies are in pom.xml
- [ ] `@EnableDiscoveryClient` annotation added
- [ ] Health check endpoint is accessible
- [ ] Service registers with Eureka
- [ ] Configuration loads from Config Server
- [ ] Environment variables are set
- [ ] MongoDB/Redis/RabbitMQ are accessible
- [ ] Logs are being written correctly
- [ ] Actuator endpoints are exposed
- [ ] Circuit breakers are configured
- [ ] Metrics are being collected

## Quick Reference

### Service URLs

| Service | Local URL | Docker URL |
|---------|-----------|------------|
| Config Server | http://localhost:8888 | http://config-server:8888 |
| Eureka Server | http://localhost:8761 | http://eureka-server:8761 |
| API Gateway | http://localhost:8080 | http://api-gateway:8080 |
| Auth Service | http://localhost:8086 | http://gramwork-auth-service:8086 |
| Laborer Profile | http://localhost:8081 | http://laborer-profile-service:8081 |
| Employer Profile | http://localhost:8089 | http://employer-profile-service:8089 |
| Job Service | http://localhost:8083 | http://job-service:8083 |
| Assignment Service | http://localhost:8084 | http://assignment-service:8084 |
| Payment Service | http://localhost:8088 | http://payment-service:8088 |
| Notification Service | http://localhost:8082 | http://notification-service:8082 |

### Common Commands

```bash
# View service configuration
curl -u config:config123 http://localhost:8888/{service-name}/default | jq

# Check service health
curl http://localhost:{port}/actuator/health | jq

# View all Eureka services
curl http://localhost:8761/eureka/apps | jq

# Refresh configuration (without restart)
curl -X POST http://localhost:{port}/actuator/refresh

# View metrics
curl http://localhost:{port}/actuator/metrics | jq

# View environment
curl http://localhost:{port}/actuator/env | jq
```

## Support

For configuration issues:
1. Check this guide
2. Review service logs
3. Verify all dependencies are running
4. Test connectivity to Config Server and Eureka
5. Contact GramWork DevOps team

## License

Copyright © 2024 GramWork. All rights reserved.
