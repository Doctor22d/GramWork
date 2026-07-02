# GramWork Microservices - Troubleshooting Guide

Common issues and solutions for GramWork microservices deployment.

## Configuration Issues

### Issue: Inactive ConfigData Property Source Error

**Error Message:**
```
org.springframework.boot.context.config.InactiveConfigDataAccessException: 
Inactive property source 'Config resource 'class path resource [application.yml]'
via location 'optional:classpath:/' (document #2)' imported from location 
'class path resource [application.yml]' cannot contain property 'spring.profiles.active'
```

**Cause:** In Spring Boot 3.x, `spring.profiles.active` cannot be set inside profile-specific document sections of application.yml. It must only be in the default (first) document.

**Incorrect Configuration:**
```yaml
spring:
  application:
    name: config-server
  profiles:
    active: native  # OK here in default profile

---
# Development Profile
spring:
  config:
    activate:
      on-profile: dev
  profiles:
    active: native  # ❌ NOT ALLOWED HERE!
```

**Correct Configuration:**
```yaml
spring:
  application:
    name: config-server
  profiles:
    active: native  # ✅ Only set in default profile

---
# Development Profile
spring:
  config:
    activate:
      on-profile: dev
  # profiles.active removed from here
```

**Solution:**
Remove all `spring.profiles.active` declarations from profile-specific sections (any section after `---`). Keep it only in the default/main profile at the top of the file.

**Status:** ✅ Fixed in Config Server

**Alternative Activation:**
Use environment variables or command-line args instead:
```bash
# Environment variable
export SPRING_PROFILES_ACTIVE=dev

# Command line
java -jar app.jar --spring.profiles.active=dev

# Maven
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

---

## Java Version Issues

### Issue: Java 25 Incompatibility - TypeTag::UNKNOWN Error

**Error Message:**
```
java: java.lang.ExceptionInInitializerError
com.sun.tools.javac.code.TypeTag :: UNKNOWN
```

**Cause:** Service is configured to use Java 25 (preview/early-access version) which is incompatible with Spring Boot 3.2.1 and Spring Cloud 2023.0.0.

**Affected:**
- Compilation failures
- Runtime errors
- IntelliJ IDEA build issues
- Missing internal compiler classes

**Solution 1: Fix pom.xml**

```xml
<!-- INCORRECT -->
<properties>
    <java.version>25</java.version>
</properties>

<!-- CORRECT -->
<properties>
    <java.version>21</java.version>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
</properties>
```

Then rebuild:
```bash
mvn clean compile
```

**Solution 2: Configure IntelliJ IDEA**

1. **File → Project Structure** (Ctrl+Alt+Shift+S)
2. **Project**: Set SDK to Java 21
3. **Modules**: Set Language Level to 21 for all modules
4. **File → Settings → Maven → Runner**: Set JRE to Java 21
5. **Invalidate Caches**: File → Invalidate Caches → Invalidate and Restart

**Solution 3: Update Run Configuration**

1. **Run → Edit Configurations**
2. Select your service
3. **JRE**: Choose Java 21
4. Click OK

**Status:** ✅ Fixed in Eureka Server

**Why Java 25 Doesn't Work:**
- Not a Long-Term Support (LTS) version
- Spring Boot 3.2.1 only supports Java 17, 19, and 21
- Internal compiler APIs incompatible
- Spring Cloud 2023.0.0 doesn't support Java 22+

**Recommendation:** Use **Java 21 LTS** for all services

**See Also:** [FIX_JAVA_VERSION.md](FIX_JAVA_VERSION.md) for complete guide

---

## Maven Build Issues

### Issue: Spring Boot 4.x Runtime Errors (Multiple Services)

**Error Message:**
```
Running with Spring Boot v4.0.7, Spring v7.0.8
java.lang.IllegalStateException: Error processing condition on...
java.lang.ClassNotFoundException: org.springframework.boot.web.context.WebServerInitializedEvent
```

**Cause:** Multiple services in the project were initially created with Spring Boot 4.x (4.0.6, 4.0.7), which doesn't exist as a stable release yet. This causes:
- Missing classes at runtime
- Incompatibility with Spring Cloud 2023.0.0
- Auto-configuration failures
- ClassNotFoundException errors

**Affected Services:**
- ✅ Auth Service (was 4.0.6, fixed to 3.2.1)
- ✅ Eureka Server (was 4.0.7, fixed to 3.2.1)
- ⚠️ Potentially other services - verify all pom.xml files

**Solution:**
Check and update ALL services to use Spring Boot 3.2.1:

```xml
<!-- INCORRECT - Spring Boot 4.x -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.0.6</version> <!-- or 4.0.7 - WRONG! -->
    <relativePath/>
</parent>

<!-- CORRECT - Spring Boot 3.x -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.1</version> <!-- Stable version -->
    <relativePath/>
</parent>
```

**How to Check All Services:**
```bash
# Windows
findstr /s /i "<version>4.0" *.xml

# Linux/Mac
grep -r "<version>4.0" --include="pom.xml"
```

**Rebuild After Fix:**
```bash
cd <service-directory>
mvn clean install -U
```

**Status:** ✅ Fixed in Auth Service and Eureka Server

### Issue: ExceptionInInitializerError with TypeTag UNKNOWN

**Error Message:**
```
java.lang.ExceptionInInitializerError
com.sun.tools.javac.code.TypeTag :: UNKNOWN
```

**Cause:** This error typically occurs due to:
1. **Incorrect Spring Boot Version** - Using a non-existent or incompatible Spring Boot version (e.g., 4.0.x when only 3.x exists)
2. **Java/Maven Version Mismatch** - Compiler version incompatibility

**Solution:**
```xml
<!-- Ensure using correct Spring Boot version in pom.xml -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.1</version> <!-- NOT 4.0.6 -->
    <relativePath/>
</parent>
```

**Status:** ✅ Fixed in Auth service

### Issue: Annotation Processor Path Resolution Failed

**Error Message:**
```
Resolution of annotationProcessorPath dependencies failed: 
version can neither be null, empty nor blank
```

**Cause:** Maven compiler plugin configuration is missing version for Lombok in annotationProcessorPaths

**Solution:**
Update maven-compiler-plugin configuration in pom.xml:

```xml
<!-- Incorrect -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <executions>
        <execution>
            <configuration>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                        <!-- Missing version! -->
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </execution>
    </executions>
</plugin>

<!-- Correct -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version> <!-- Uses version from parent -->
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

**Status:** ✅ Fixed in Auth service

### Issue: Non-Existent Spring Boot Test Dependencies

**Error Message:**
```
'dependencies.dependency.version' for org.springframework.boot:spring-boot-starter-webmvc:jar is missing
'dependencies.dependency.version' for org.springframework.boot:spring-boot-starter-*-test:jar is missing
```

**Cause:** Spring Boot doesn't provide separate `-test` starters for most modules

**Solution:**
Replace non-existent dependencies:

```xml
<!-- Incorrect -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc</artifactId> <!-- Doesn't exist -->
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security-test</artifactId> <!-- Wrong -->
</dependency>

<!-- Correct -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId> <!-- Correct -->
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId> <!-- Generic test starter -->
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-test</artifactId> <!-- Security test support -->
    <scope>test</scope>
</dependency>
```

**Status:** ✅ Fixed in Auth service

### Issue: Premature End of Content-Length Error

**Error Message:**
```
Could not transfer artifact org.eclipse.jgit:org.eclipse.jgit:jar:6.6.1.202309021850-r
Premature end of Content-Length delimited message body
```

**Cause:** Maven cached a failed/corrupted dependency download

**Solution:**
```bash
# Force update dependencies with -U flag
mvn clean install -U

# Or delete the corrupted artifact manually
rm -rf ~/.m2/repository/org/eclipse/jgit

# Then rebuild
mvn clean install
```

**For Windows:**
```powershell
# Delete corrupted cache
Remove-Item -Recurse -Force "$env:USERPROFILE\.m2\repository\org\eclipse\jgit"

# Force update
mvn clean install -U
```

### Issue: Spring Security WebFlux Package Not Found (API Gateway)

**Error Message:**
```
package org.springframework.security.config.annotation.web.reactive does not exist
cannot find symbol: class EnableWebFluxSecurity
```

**Cause:** Missing Spring Security dependency in API Gateway pom.xml

**Solution:**
Add the following dependency to `api-gateway/pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

**Status:** ✅ Fixed in current version

### Issue: Retry Configuration Type Error (API Gateway)

**Error Message:**
```
incompatible types: <nulltype> cannot be converted to int
in GatewayConfig.java retry configuration
```

**Cause:** Incorrect retry configuration with null values

**Solution:**
Update retry configuration in `GatewayConfig.java`:
```java
// Incorrect (causes error)
.retry(config -> config
    .setRetries(3)
    .setBackoff(null, null, null, false))

// Correct
.retry(config -> config
    .setRetries(3))
```

**Status:** ✅ Fixed in current version

### Issue: SpringDoc OpenAPI Version Incompatibility (Payment Service)

**Error Message:**
```
java.lang.IllegalStateException: Error processing condition on org.springdoc.webmvc.ui.SwaggerConfig.springWebProvider
Caused by: java.lang.NoClassDefFoundError: org/springframework/web/servlet/resource/LiteWebJarsResourceResolver
```

**Cause:** SpringDoc OpenAPI version 2.3.0 is incompatible with Spring Boot 3.2.1. The `LiteWebJarsResourceResolver` class doesn't exist in Spring Framework 6.1.2 (shipped with Spring Boot 3.2.1).

**Solution:**
Update SpringDoc version in `pom.xml` to 2.6.0 or later:

```xml
<!-- Incorrect - Causes NoClassDefFoundError -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version> <!-- Incompatible with Spring Boot 3.2.1 -->
</dependency>

<!-- Correct - Compatible version -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.6.0</version> <!-- Compatible with Spring Boot 3.2.1 -->
</dependency>
```

Then rebuild:
```bash
mvn clean compile
```

**Version Compatibility Matrix:**
- Spring Boot 3.2.x → SpringDoc 2.2.0+ (recommended: 2.6.0+)
- Spring Boot 3.1.x → SpringDoc 2.1.0+
- Spring Boot 3.0.x → SpringDoc 2.0.0+

**Status:** ✅ Fixed in Payment Service

### Issue: Maven Dependencies Not Downloading

**Solution:**
```bash
# Clear entire local repository (use with caution)
rm -rf ~/.m2/repository

# Or force update
mvn dependency:purge-local-repository
mvn clean install -U
```

### Issue: Build Fails with "Cannot find parent POM"

**Solution:**
```bash
# Build parent project first
mvn clean install -N

# Then build child modules
mvn clean install
```

## Service Startup Issues

### Issue: Port Already in Use

**Error:** `Port 8080 is already in use`

**Solution:**
```bash
# Find process using the port (Windows)
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <process_id> /F

# Or change port in application.yml
server:
  port: 8081
```

### Issue: Config Server Not Reachable

**Error:** `Could not locate PropertySource`

**Checklist:**
1. Verify Config Server is running
   ```bash
   curl http://localhost:8888/actuator/health
   ```

2. Check bootstrap.yml exists in microservice
   ```yaml
   spring:
     cloud:
       config:
         uri: http://localhost:8888
   ```

3. Verify service name matches config file
   - bootstrap.yml: `spring.application.name: gramwork-auth-service`
   - Config file: `gramwork-auth-service.yml`

4. Test config endpoint directly
   ```bash
   curl -u config:config123 http://localhost:8888/gramwork-auth-service/default
   ```

### Issue: Eureka Registration Failed

**Error:** `Cannot execute request on any known server`

**Solution:**
```bash
# 1. Verify Eureka Server is running
curl http://localhost:8761/actuator/health

# 2. Check Eureka URL in application.yml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/

# 3. Verify @EnableDiscoveryClient annotation
@EnableDiscoveryClient
@SpringBootApplication
public class Application { }

# 4. Check network connectivity
ping localhost
telnet localhost 8761
```

## Database Connection Issues

### Issue: MongoDB Connection Refused

**Error:** `com.mongodb.MongoTimeoutException: Timed out after 30000 ms`

**Solution:**
```bash
# Check MongoDB is running
docker ps | grep mongodb

# Start MongoDB
docker-compose up -d mongodb

# Test connection
mongosh mongodb://localhost:27017

# Verify connection string in application.yml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/DatabaseName
```

### Issue: MongoDB Authentication Failed

**Error:** `Authentication failed`

**Solution:**
```bash
# Use correct credentials in connection string
mongodb://username:password@localhost:27017/database?authSource=admin

# Or for Docker
mongodb://admin:admin123@mongodb:27017/GramWorkAuth?authSource=admin
```

## Redis Connection Issues

### Issue: Redis Connection Refused

**Solution:**
```bash
# Check Redis is running
docker ps | grep redis

# Start Redis
docker-compose up -d redis

# Test connection
redis-cli ping

# Verify configuration
spring:
  redis:
    host: localhost
    port: 6379
```

## RabbitMQ Issues

### Issue: RabbitMQ Connection Failed

**Solution:**
```bash
# Check RabbitMQ is running
docker ps | grep rabbitmq

# Start RabbitMQ
docker-compose up -d rabbitmq

# Check management UI
open http://localhost:15672
# Default credentials: guest/guest

# Verify configuration
spring:
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
```

## Docker Issues

### Issue: Docker Build Fails

**Error:** `failed to solve with frontend dockerfile.v0`

**Solution:**
```bash
# Update Dockerfile syntax
FROM maven:3.9.5-amazoncorretto-21 AS build

# Clean build
docker-compose build --no-cache

# Check Docker version
docker --version
# Minimum: 20.10+
```

### Issue: Container Exits Immediately

**Solution:**
```bash
# Check container logs
docker-compose logs service-name

# Run container in foreground for debugging
docker-compose up service-name

# Check health status
docker-compose ps
```

### Issue: Out of Memory

**Error:** `Container killed due to memory pressure`

**Solution:**
```yaml
# Add memory limits to docker-compose.yml
services:
  service-name:
    deploy:
      resources:
        limits:
          memory: 1024M
    environment:
      JAVA_OPTS: "-Xmx512m -Xms256m"
```

## JWT Authentication Issues

### Issue: JWT Token Invalid

**Error:** `Invalid or expired JWT token`

**Solutions:**
1. **Check JWT Secret matches across services**
   ```yaml
   jwt:
     secret: same-secret-in-all-services
   ```

2. **Verify token format**
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Check token expiration**
   ```java
   // Token should not be expired
   exp: 1640086400 // Unix timestamp
   ```

4. **Test token at jwt.io**

### Issue: CORS Error

**Error:** `Access-Control-Allow-Origin header is missing`

**Solution:**
```yaml
# In API Gateway application.yml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowed-origins:
              - "http://localhost:3000"
            allowed-methods:
              - GET
              - POST
              - PUT
              - DELETE
            allowed-headers: "*"
            allow-credentials: true
```

## Circuit Breaker Issues

### Issue: Circuit Breaker Always Open

**Solution:**
```yaml
# Adjust thresholds in application.yml
resilience4j:
  circuitbreaker:
    instances:
      serviceName:
        failureRateThreshold: 50
        minimumNumberOfCalls: 5
        waitDurationInOpenState: 10s
```

**Check circuit breaker status:**
```bash
curl http://localhost:8080/actuator/circuitbreakers
```

## Performance Issues

### Issue: Slow Response Times

**Solutions:**

1. **Enable caching**
   ```yaml
   spring:
     cache:
       type: redis
   ```

2. **Add database indexes**
   ```javascript
   db.collection.createIndex({ fieldName: 1 })
   ```

3. **Increase connection pool**
   ```yaml
   spring:
     data:
       mongodb:
         auto-index-creation: true
   ```

4. **Monitor metrics**
   ```bash
   curl http://localhost:8080/actuator/metrics
   ```

### Issue: High Memory Usage

**Solutions:**

1. **Adjust JVM settings**
   ```yaml
   environment:
     JAVA_OPTS: "-Xmx512m -Xms256m -XX:+UseG1GC"
   ```

2. **Check for memory leaks**
   ```bash
   jmap -heap <pid>
   jstack <pid>
   ```

3. **Monitor with VisualVM or JProfiler**

## Logging Issues

### Issue: No Logs Visible

**Solution:**
```bash
# Check log file location
logs/service-name.log

# Or view Docker logs
docker-compose logs -f service-name

# Increase log level temporarily
logging:
  level:
    com.gramwork: DEBUG
```

## Network Issues

### Issue: Services Can't Communicate

**Solution:**
```bash
# Check Docker network
docker network ls
docker network inspect gramwork-network

# Verify services are on same network
docker-compose ps

# Test connectivity
docker-compose exec service-name ping other-service

# Check DNS resolution
docker-compose exec service-name nslookup eureka-server
```

## Common Error Messages

### "Application failed to start"

1. Check all dependencies are running (MongoDB, Redis, etc.)
2. Verify configuration files
3. Check port availability
4. Review application logs

### "Connection pool shut down"

- Usually indicates improper shutdown
- Restart the service
- Check for resource leaks

### "Too many open files"

```bash
# Increase file descriptor limit
ulimit -n 65536

# Or in docker-compose.yml
ulimits:
  nofile:
    soft: 65536
    hard: 65536
```

## Quick Diagnostics Script

Create `check-health.sh`:

```bash
#!/bin/bash

echo "Checking infrastructure..."
curl -s http://localhost:27017 && echo "✓ MongoDB" || echo "✗ MongoDB"
redis-cli ping &>/dev/null && echo "✓ Redis" || echo "✗ Redis"
curl -s http://localhost:15672 &>/dev/null && echo "✓ RabbitMQ" || echo "✗ RabbitMQ"

echo -e "\nChecking core services..."
curl -s http://localhost:8888/actuator/health | grep -q UP && echo "✓ Config Server" || echo "✗ Config Server"
curl -s http://localhost:8761/actuator/health | grep -q UP && echo "✓ Eureka Server" || echo "✗ Eureka Server"
curl -s http://localhost:8080/actuator/health | grep -q UP && echo "✓ API Gateway" || echo "✗ API Gateway"

echo -e "\nChecking business services..."
for port in 8086 8081 8089 8083 8084 8088 8082; do
    service=$(curl -s http://localhost:$port/actuator/info 2>/dev/null | jq -r '.app.name // "Service"')
    curl -s http://localhost:$port/actuator/health | grep -q UP && echo "✓ $service ($port)" || echo "✗ $service ($port)"
done
```

## Getting Help

### Gather Information

When reporting issues, include:

1. **Error logs**
   ```bash
   docker-compose logs service-name --tail=100
   ```

2. **Service status**
   ```bash
   docker-compose ps
   ```

3. **Configuration**
   ```bash
   curl http://localhost:8888/service-name/default
   ```

4. **Environment details**
   - OS and version
   - Java version
   - Docker version
   - Maven version

### Useful Commands

```bash
# View all running services
docker-compose ps

# Restart a service
docker-compose restart service-name

# Rebuild and restart
docker-compose up -d --build service-name

# View resource usage
docker stats

# Execute command in container
docker-compose exec service-name sh

# Clean up everything
docker-compose down -v
docker system prune -a
```

## Still Having Issues?

1. Check the relevant README files
2. Review configuration files
3. Test components individually
4. Check GitHub issues
5. Contact GramWork DevOps team

---

**Last Updated:** June 21, 2026  
**Version:** 1.0.0

Copyright © 2024 GramWork. All rights reserved.
