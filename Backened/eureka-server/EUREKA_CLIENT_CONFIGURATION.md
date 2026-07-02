# Eureka Client Configuration Guide

This document shows how to configure Eureka Client in all GramWork microservices.

## 1. Add Dependencies to pom.xml

```xml
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
```

## 2. Enable Eureka Client in Main Application Class

```java
@SpringBootApplication
@EnableDiscoveryClient  // Add this annotation
public class YourServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(YourServiceApplication.class, args);
    }
}
```

## 3. Configure application.yml for Each Service

### Example: gramwork-auth-service

```yaml
server:
  port: 8086

spring:
  application:
    name: gramwork-auth-service

eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka/}
    register-with-eureka: true
    fetch-registry: true
    registry-fetch-interval-seconds: 30
  instance:
    prefer-ip-address: true
    lease-renewal-interval-in-seconds: 10
    lease-expiration-duration-in-seconds: 30
    instance-id: ${spring.application.name}:${spring.application.instance_id:${random.value}}
    metadata-map:
      zone: zone1
      version: 1.0.0
    health-check-url-path: /actuator/health

# Actuator endpoints
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always
```

## 4. Service Names for All Microservices

Use these exact names in `spring.application.name`:

1. **gramwork-auth-service** (Port: 8086)
2. **laborer-profile-service** (Port: 8081)
3. **employer-profile-service** (Port: 8089)
4. **job-service** (Port: 8083)
5. **assignment-service** (Port: 8084)
6. **attendance-service** (Port: 8085)
7. **payment-service** (Port: 8088)
8. **notification-service** (Port: 8082)

## 5. Docker Environment Configuration

For Docker deployments, use environment variables:

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://eureka-server:8761/eureka/
  instance:
    hostname: ${SERVICE_NAME:localhost}
    prefer-ip-address: false
```

## 6. Load Balancing with Eureka

To call other services using service discovery:

```java
@Configuration
public class RestTemplateConfig {
    
    @Bean
    @LoadBalanced  // Enable load balancing
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

Usage:
```java
// Use service name instead of hardcoded URL
String url = "http://laborer-profile-service/api/profile/{id}";
ResponseEntity<Profile> response = restTemplate.getForEntity(url, Profile.class, profileId);
```

## 7. WebClient Configuration (Recommended)

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    @LoadBalanced
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
```

Usage:
```java
@Service
public class ProfileService {
    
    private final WebClient webClient;
    
    public ProfileService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
    
    public Mono<Profile> getProfile(String id) {
        return webClient.get()
            .uri("http://laborer-profile-service/api/profile/{id}", id)
            .retrieve()
            .bodyToMono(Profile.class);
    }
}
```

## 8. Feign Client Configuration (Alternative)

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

```java
@FeignClient(name = "laborer-profile-service")
public interface ProfileClient {
    
    @GetMapping("/api/profile/{id}")
    Profile getProfile(@PathVariable String id);
}
```

Enable Feign in main class:
```java
@EnableFeignClients
@EnableDiscoveryClient
@SpringBootApplication
public class YourServiceApplication {
    // ...
}
```

## 9. Health Check Configuration

Ensure your service has health endpoint exposed:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: always
  health:
    defaults:
      enabled: true
```

## 10. Eureka Server URL by Environment

**Local Development:**
```
http://localhost:8761/eureka/
```

**Docker:**
```
http://eureka-server:8761/eureka/
```

**Production (with authentication):**
```
http://eureka:eureka123@eureka-server:8761/eureka/
```

## 11. Common Issues and Solutions

### Issue: Service not registering
**Solution:** Check if Eureka server is running and accessible

### Issue: Service discovery not working
**Solution:** Ensure `@EnableDiscoveryClient` is added and `fetch-registry: true`

### Issue: Load balancing not working
**Solution:** Add `@LoadBalanced` annotation to RestTemplate/WebClient.Builder

## 12. Production Recommendations

1. Use multiple Eureka servers for high availability
2. Enable authentication on Eureka server
3. Configure appropriate lease renewal intervals
4. Monitor service health via actuator endpoints
5. Use circuit breakers for inter-service communication
6. Implement retry logic for service calls
7. Configure proper timeouts
8. Use service mesh for advanced scenarios

## 13. Complete Example for Auth Service

See the complete implementation in the config-repository for all services.
