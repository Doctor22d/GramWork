# Payment Service Fix - SpringDoc OpenAPI Compatibility

## Issue Summary

Payment Service was failing to start with a critical runtime error related to SpringDoc OpenAPI:

```
java.lang.IllegalStateException: Error processing condition on org.springdoc.webmvc.ui.SwaggerConfig.springWebProvider
Caused by: java.lang.NoClassDefFoundError: org/springframework/web/servlet/resource/LiteWebJarsResourceResolver
```

## Root Cause

**SpringDoc OpenAPI version 2.3.0 is incompatible with Spring Boot 3.2.1**

The error occurred because:
1. Payment Service was using `springdoc-openapi-starter-webmvc-ui` version 2.3.0
2. Spring Boot 3.2.1 ships with Spring Framework 6.1.2
3. SpringDoc 2.3.0 expects `LiteWebJarsResourceResolver` class that doesn't exist in Spring Framework 6.1.2
4. This class was removed/renamed in newer Spring Framework versions

## Solution Applied

### Changed File: `paymentService/pom.xml`

**Before:**
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

**After:**
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.6.0</version>
</dependency>
```

### Build Results

✅ **Compilation:** Successful (28 source files compiled)
```
[INFO] Compiling 28 source files with javac [debug release 21] to target\classes
[INFO] BUILD SUCCESS
```

✅ **Runtime:** Application context starts successfully
- No more `NoClassDefFoundError`
- Spring Boot banner appears
- MongoDB connection established
- Eureka registration successful
- Service reached port binding stage (no more SpringDoc errors)

## Version Compatibility Matrix

| Spring Boot Version | Compatible SpringDoc OpenAPI Version |
|---------------------|--------------------------------------|
| 3.2.x               | 2.2.0+ (recommended: 2.6.0+)         |
| 3.1.x               | 2.1.0+                               |
| 3.0.x               | 2.0.0+                               |
| 2.7.x               | 1.7.0+                               |

## How to Apply This Fix to Other Services

If other services encounter the same issue:

1. **Check SpringDoc version in pom.xml:**
   ```bash
   grep -A 2 "springdoc-openapi" pom.xml
   ```

2. **Update to compatible version:**
   ```xml
   <dependency>
       <groupId>org.springdoc</groupId>
       <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
       <version>2.6.0</version>
   </dependency>
   ```

3. **Rebuild the service:**
   ```bash
   mvn clean compile
   ```

4. **Test startup:**
   ```bash
   mvn spring-boot:run
   ```

## Additional Notes

### Other SpringDoc Starters

If your service uses different SpringDoc modules, update them similarly:

```xml
<!-- For WebFlux (reactive) applications -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webflux-ui</artifactId>
    <version>2.6.0</version>
</dependency>

<!-- For common module only -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-common</artifactId>
    <version>2.6.0</version>
</dependency>
```

### Why Version 2.6.0?

- **Latest stable release** compatible with Spring Boot 3.2.x
- Includes bug fixes from 2.3.0 - 2.5.x
- Better Spring Framework 6.x support
- Enhanced OpenAPI 3.1 support
- Improved Swagger UI integration

### Testing Swagger UI

Once the service starts successfully, you can access Swagger UI at:

```
http://localhost:8084/swagger-ui.html
```

Or the OpenAPI JSON spec at:

```
http://localhost:8084/v3/api-docs
```

## Related Issues Fixed

This fix is part of a series of version compatibility issues:

1. ✅ **Spring Boot 4.x → 3.2.1** (Auth Service, Eureka Server)
2. ✅ **Java 25 → Java 21** (Eureka Server)
3. ✅ **SpringDoc 2.3.0 → 2.6.0** (Payment Service) ← **This Fix**
4. ✅ **Non-existent dependencies** (Auth Service, Payment Service)
5. ✅ **Lombok annotation processor** (Auth Service, Payment Service)

## Status

**Status:** ✅ **FIXED**

**Date Fixed:** June 24, 2026  
**Fixed By:** Kiro AI  
**Affected Service:** Payment Service  
**Build Status:** Compiling successfully (28 source files)  
**Runtime Status:** Service starts without SpringDoc errors

## References

- SpringDoc OpenAPI Documentation: https://springdoc.org/
- Spring Boot 3.2.x Release Notes: https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.2-Release-Notes
- SpringDoc GitHub Issues: https://github.com/springdoc/springdoc-openapi/issues

---

**See Also:**
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Complete troubleshooting guide
- [AUTH_SERVICE_FIXES.md](AUTH_SERVICE_FIXES.md) - Auth Service dependency fixes
- [FIX_JAVA_VERSION.md](FIX_JAVA_VERSION.md) - Java version compatibility guide
- [BUILD_FIXES_APPLIED.md](BUILD_FIXES_APPLIED.md) - All build fixes applied

---

Copyright © 2024-2026 GramWork. All rights reserved.
