# GramWork Eureka Server

Service Discovery Server for GramWork Microservices Architecture

## Overview

Eureka Server provides service registration and discovery capabilities for all GramWork microservices. It enables dynamic service discovery, load balancing, and fault tolerance.

## Features

- ✅ Service Registration and Discovery
- ✅ Health Monitoring
- ✅ Load Balancing Support
- ✅ Self-Preservation Mode
- ✅ Dashboard UI
- ✅ Metrics and Monitoring
- ✅ Security (Basic Auth)
- ✅ Docker Support
- ✅ High Availability Ready

## Technology Stack

- Spring Boot 3.2.1
- Spring Cloud 2023.0.0
- Netflix Eureka Server
- Spring Security
- Micrometer & Prometheus
- Java 21

## Quick Start

### Local Development

```bash
# Build the project
mvn clean install

# Run the server
mvn spring-boot:run

# Or run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Docker

```bash
# Build image
docker build -t gramwork/eureka-server:latest .

# Run container
docker run -d \
  -p 8761:8761 \
  --name eureka-server \
  gramwork/eureka-server:latest
```

## Configuration

### Default Ports

- **Server Port:** 8761
- **Dashboard:** http://localhost:8761
- **Health Check:** http://localhost:8761/actuator/health

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| EUREKA_HOSTNAME | localhost | Eureka server hostname |
| EUREKA_USERNAME | eureka | Dashboard username |
| EUREKA_PASSWORD | eureka123 | Dashboard password |
| EUREKA_DASHBOARD | true | Enable/disable dashboard |

### Profiles

- **dev**: Development with debug logging
- **prod**: Production with optimized settings
- **docker**: Docker containerized deployment

## Security

The Eureka Server is protected with Basic Authentication:

- **Username:** eureka (configurable)
- **Password:** eureka123 (configurable)

For production, always change the default credentials via environment variables.

## Monitoring

### Actuator Endpoints

- Health: `/actuator/health`
- Info: `/actuator/info`
- Metrics: `/actuator/metrics`
- Prometheus: `/actuator/prometheus`

### Health Check

```bash
curl http://localhost:8761/actuator/health
```

Response:
```json
{
  "status": "UP"
}
```

## Registered Services

Expected services to register:

1. gramwork-auth-service
2. laborer-profile-service
3. employer-profile-service
4. job-service
5. assignment-service
6. attendance-service
7. payment-service
8. notification-service
9. api-gateway

## Client Configuration

All microservices should include:

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
```

See `EUREKA_CLIENT_CONFIGURATION.md` for complete client setup.

## Production Deployment

### High Availability Setup

For production, deploy multiple Eureka servers:

**Server 1:**
```yaml
eureka:
  client:
    service-url:
      defaultZone: http://eureka2:8761/eureka/,http://eureka3:8761/eureka/
```

**Server 2:**
```yaml
eureka:
  client:
    service-url:
      defaultZone: http://eureka1:8761/eureka/,http://eureka3:8761/eureka/
```

### Best Practices

1. **Use at least 3 Eureka servers** in production
2. **Enable self-preservation mode** to handle network issues
3. **Configure appropriate timeouts**
4. **Monitor server health** via actuator endpoints
5. **Secure with strong credentials**
6. **Use HTTPS** in production
7. **Configure firewall rules** properly
8. **Set up automated backups**

## Troubleshooting

### Services Not Registering

1. Check if Eureka server is accessible
2. Verify client configuration
3. Check network connectivity
4. Review service logs

### Self-Preservation Mode

If you see "EMERGENCY! EUREKA MAY BE INCORRECTLY CLAIMING INSTANCES ARE UP":

- This is normal during network issues
- Eureka prevents mass de-registration
- Services will re-register when network stabilizes

### Dashboard Not Accessible

1. Check if dashboard is enabled
2. Verify credentials
3. Check firewall rules
4. Review security configuration

## Performance Tuning

### JVM Options

```bash
JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC"
```

### Eureka Settings

- `lease-renewal-interval-in-seconds: 10` (how often client sends heartbeat)
- `lease-expiration-duration-in-seconds: 30` (when server removes inactive service)
- `eviction-interval-timer-in-ms: 60000` (how often server checks for expired leases)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /eureka/apps | GET | List all registered services |
| /eureka/apps/{appName} | GET | Get specific service instances |
| /actuator/health | GET | Health check |
| /actuator/metrics | GET | Prometheus metrics |

## Logging

Logs are stored in: `logs/eureka-server.log`

Log levels can be configured per environment:
- Dev: DEBUG
- Prod: INFO/WARN

## Support

For issues or questions:
- Review documentation
- Check logs in `logs/` directory
- Verify configuration
- Contact GramWork DevOps team

## License

Copyright © 2024 GramWork. All rights reserved.
