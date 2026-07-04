# GramWork Config Server

Centralized Configuration Management Server for GramWork Microservices.

## Overview

Spring Cloud Config Server provides centralized external configuration management for all GramWork microservices. It supports Git-based and native file system configuration storage.

## Features

- ✅ Centralized Configuration Management
- ✅ Git-Based Configuration (Production)
- ✅ Native File System (Development)
- ✅ Environment-Specific Profiles
- ✅ Configuration Encryption
- ✅ Service Discovery Integration
- ✅ Security with Basic Auth
- ✅ Health Monitoring
- ✅ Docker Support
- ✅ Hot Configuration Reload

## Technology Stack

- Spring Boot 3.2.1
- Spring Cloud Config Server 2023.0.0
- Spring Cloud Eureka Client
- Spring Security
- Java 21

## Quick Start

### Local Development (Native)

```bash
# Build the project
mvn clean install

# Run with native profile (uses local file system)
mvn spring-boot:run -Dspring-boot.run.profiles=native

# Server will start on port 8888
```

### Production (Git)

```bash
# Set environment variables
export CONFIG_GIT_URI=https://github.com/your-org/gramwork-config-repo.git
export CONFIG_GIT_USERNAME=your-username
export CONFIG_GIT_PASSWORD=your-token

# Run with git profile
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### Docker

```bash
# Build image
docker build -t gramwork/config-server:latest .

# Run container
docker run -d \
  -p 8888:8888 \
  -v $(pwd)/../config-repository:/config-repository \
  --name config-server \
  gramwork/config-server:latest
```

## Configuration

### Default Ports

- **Server Port:** 8888
- **Health Check:** http://localhost:8888/actuator/health

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| CONFIG_USERNAME | config | Config server username |
| CONFIG_PASSWORD | config123 | Config server password |
| CONFIG_GIT_URI | - | Git repository URL |
| CONFIG_GIT_USERNAME | - | Git username |
| CONFIG_GIT_PASSWORD | - | Git password/token |
| CONFIG_GIT_BRANCH | main | Git branch name |
| EUREKA_SERVER_URL | http://localhost:8761/eureka/ | Eureka server URL |

### Profiles

- **native**: Use local file system (development)
- **dev**: Development environment
- **prod**: Production with Git repository
- **docker**: Docker containerized deployment

## Configuration Repository

### File Structure

```
config-repository/
├── gramwork-auth-service.yml
├── laborer-profile-service.yml
├── employer-profile-service.yml
├── job-service.yml
├── assignment-service.yml
├── payment-service.yml
├── notification-service.yml
├── api-gateway.yml
└── README.md
```

### Naming Convention

Configuration files must follow this naming pattern:

```
{application-name}.yml
{application-name}-{profile}.yml
```

Examples:
- `gramwork-auth-service.yml` (default)
- `gramwork-auth-service-dev.yml` (dev profile)
- `gramwork-auth-service-prod.yml` (prod profile)

## Accessing Configuration

### REST Endpoints

```bash
# Get default configuration
GET http://localhost:8888/{application}/default

# Get profile-specific configuration
GET http://localhost:8888/{application}/{profile}

# Get configuration with label (Git branch)
GET http://localhost:8888/{application}/{profile}/{label}

# Examples
curl -u config:config123 http://localhost:8888/gramwork-auth-service/default
curl -u config:config123 http://localhost:8888/api-gateway/prod
curl -u config:config123 http://localhost:8888/job-service/dev/main
```

### Response Formats

```bash
# JSON format (default)
/{application}/{profile}

# YAML format
/{application}-{profile}.yml

# Properties format
/{application}-{profile}.properties
```

## Client Configuration

### Add Dependencies (Client Services)

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
```

### Create bootstrap.yml

```yaml
spring:
  application:
    name: gramwork-auth-service
  cloud:
    config:
      uri: http://localhost:8888
      username: config
      password: config123
      fail-fast: true
      retry:
        max-attempts: 3
        initial-interval: 1000
        multiplier: 1.5
        max-interval: 2000
  profiles:
    active: dev
```

### Docker Configuration

```yaml
spring:
  cloud:
    config:
      uri: http://config-server:8888
```

## Configuration Encryption

### Enable Encryption

```bash
# Generate encryption key
keytool -genkeypair -alias config-server-key \
  -keyalg RSA -keysize 2048 -keystore config-server.jks \
  -storepass changeme
```

### Encrypt Values

```bash
# Encrypt a value
curl -u config:config123 http://localhost:8888/encrypt -d "my-secret-value"

# Response: AQAEncryptedValueHere...
```

### Use Encrypted Values

```yaml
# In configuration file
jwt:
  secret: '{cipher}AQAEncryptedValueHere...'
```

## Hot Reload Configuration

### Enable Refresh Endpoint

```yaml
management:
  endpoints:
    web:
      exposure:
        include: refresh
```

### Refresh Configuration

```bash
# Refresh single service
curl -X POST http://localhost:8080/actuator/refresh

# Using Spring Cloud Bus to refresh all services
curl -X POST http://localhost:8888/actuator/bus-refresh
```

### Use @RefreshScope

```java
@RestController
@RefreshScope
public class ConfigController {
    
    @Value("${some.property}")
    private String someProperty;
    
    // This value will be refreshed when /actuator/refresh is called
}
```

## Security

### Basic Authentication

Config Server is protected with Basic Auth:

- **Username:** config (configurable)
- **Password:** config123 (configurable)

**Production:** Always change default credentials!

```bash
export CONFIG_USERNAME=your-username
export CONFIG_PASSWORD=your-strong-password
```

### Secure Client Access

```yaml
spring:
  cloud:
    config:
      uri: http://config-server:8888
      username: ${CONFIG_USERNAME}
      password: ${CONFIG_PASSWORD}
```

## Monitoring

### Actuator Endpoints

- Health: `/actuator/health`
- Info: `/actuator/info`
- Metrics: `/actuator/metrics`
- Environment: `/actuator/env`
- Config Properties: `/actuator/configprops`

### Health Check

```bash
curl http://localhost:8888/actuator/health
```

Response:
```json
{
  "status": "UP",
  "components": {
    "configServer": {
      "status": "UP"
    },
    "diskSpace": {
      "status": "UP"
    }
  }
}
```

## Git Integration

### Public Repository

```yaml
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/your-org/config-repo.git
          default-label: main
          clone-on-start: true
```

### Private Repository (SSH)

```yaml
spring:
  cloud:
    config:
      server:
        git:
          uri: git@github.com:your-org/config-repo.git
          ignore-local-ssh-settings: false
          private-key: |
            -----BEGIN RSA PRIVATE KEY-----
            ...
            -----END RSA PRIVATE KEY-----
```

### Private Repository (HTTPS)

```yaml
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/your-org/config-repo.git
          username: ${CONFIG_GIT_USERNAME}
          password: ${CONFIG_GIT_PASSWORD}
```

## Troubleshooting

### Config Server Not Starting

1. Check if port 8888 is available
2. Verify Eureka server is running
3. Review application logs
4. Check configuration file syntax

### Services Can't Connect to Config Server

1. Verify Config Server is running
2. Check authentication credentials
3. Verify network connectivity
4. Review bootstrap.yml configuration
5. Check service name matches file name

### Configuration Not Loading

1. Verify file naming convention
2. Check active profile
3. Review Config Server logs
4. Test endpoint directly: `curl http://localhost:8888/{service}/default`

### Git Repository Issues

1. Verify Git URL is correct
2. Check authentication credentials
3. Ensure branch exists
4. Review Git repository structure

## Best Practices

1. **Use Git for production** - Version control all configurations
2. **Encrypt sensitive data** - Never store plain text secrets
3. **Use profiles** - Separate dev, test, prod configurations
4. **Enable authentication** - Protect config server access
5. **Monitor changes** - Track who changes what
6. **Test configurations** - Validate before deploying
7. **Document properties** - Comment complex configurations
8. **Use environment variables** - For deployment-specific values
9. **Implement rollback** - Have strategy for bad configurations
10. **Regular backups** - Backup configuration repository

## Performance Tuning

### JVM Options

```bash
JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC"
```

### Git Clone Optimization

```yaml
spring:
  cloud:
    config:
      server:
        git:
          clone-on-start: true
          force-pull: true
          timeout: 10
```

## Production Deployment

### High Availability

Deploy multiple Config Server instances:

```yaml
# Instance 1
eureka:
  instance:
    instance-id: config-server-1

# Instance 2
eureka:
  instance:
    instance-id: config-server-2
```

### Load Balancing

Clients automatically load balance via Eureka:

```yaml
spring:
  cloud:
    config:
      discovery:
        enabled: true
        service-id: config-server
```

## API Documentation

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /{application}/{profile} | GET | Get configuration |
| /{application}/{profile}/{label} | GET | Get configuration with label |
| /{application}-{profile}.yml | GET | Get YAML configuration |
| /encrypt | POST | Encrypt value |
| /decrypt | POST | Decrypt value |
| /actuator/health | GET | Health check |
| /actuator/refresh | POST | Refresh configuration |

## Support

For issues or questions:
- Review documentation
- Check logs in `logs/` directory
- Verify configuration files
- Test endpoints directly
- Contact GramWork DevOps team

## License

Copyright © 2024 GramWork. All rights reserved.
