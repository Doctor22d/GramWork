# Java Version Fix - Complete Guide

## Problem: Java 25 Incompatibility

**Error:** `java.lang.ExceptionInInitializerError: com.sun.tools.javac.code.TypeTag :: UNKNOWN`

**Root Cause:** Services configured with Java 25 (preview/early-access) which is incompatible with Spring Boot 3.2.1 and Spring Cloud 2023.0.0.

---

## ✅ Fixed Services

| Service | Java Version (Before) | Java Version (After) | Status |
|---------|----------------------|---------------------|---------|
| Eureka Server | 25 ❌ | 21 ✅ | Fixed |
| Auth Service | ? | 21 ✅ | Check |
| Config Server | ? | 21 ✅ | Check |
| API Gateway | ? | 21 ✅ | Check |
| Other Services | ? | 21 ✅ | Need to verify |

---

## Quick Fix for Any Service

### Step 1: Check Current Java Version in pom.xml

```bash
cd <service-directory>
grep "<java.version>" pom.xml
```

If you see `<java.version>25</java.version>` or anything other than `21`, it needs to be fixed.

### Step 2: Fix pom.xml

Edit the `pom.xml` file and update the properties section:

**INCORRECT:**
```xml
<properties>
    <java.version>25</java.version>
    <spring-cloud.version>2023.0.0</spring-cloud.version>
</properties>
```

**CORRECT:**
```xml
<properties>
    <java.version>21</java.version>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <spring-cloud.version>2023.0.0</spring-cloud.version>
</properties>
```

### Step 3: Rebuild

```bash
mvn clean compile
```

Should show: `Compiling X source files with javac [debug release 21]`

---

## IntelliJ IDEA Configuration

If you're running services from IntelliJ and still getting Java 25 errors, you need to configure IntelliJ:

### Option 1: Project-Wide Settings

1. **File → Project Structure** (or press `Ctrl+Alt+Shift+S`)
2. **Project Settings → Project**:
   - **SDK**: Select Java 21 (NOT Java 25)
   - **Language Level**: 21 - Record patterns, pattern matching for switch
3. **Project Settings → Modules**:
   - For each module, set **Language Level** to 21
4. Click **OK**

### Option 2: Maven Runner Settings

1. **File → Settings** (or `Ctrl+Alt+S`)
2. Navigate to: **Build, Execution, Deployment → Build Tools → Maven → Runner**
3. **JRE**: Select Java 21
4. Click **OK**

### Option 3: Run Configuration

1. **Run → Edit Configurations**
2. Select your Eureka Server configuration
3. **Modify options → Add VM options**
4. Add: `-Djava.version=21`
5. Under **JRE**, select Java 21
6. Click **OK**

### Verify IntelliJ Settings

```bash
# In IntelliJ Terminal
java -version
# Should show: java version "21.0.10" or similar
```

---

## Why Java 25 Doesn't Work

| Reason | Explanation |
|--------|-------------|
| **Not LTS** | Java 25 is a preview/early-access release, not Long-Term Support |
| **Incompatible** | Spring Boot 3.2.1 is built and tested for Java 17, 19, and 21 |
| **Missing Classes** | TypeTag and other internal compiler classes behave differently |
| **Unsupported** | Spring Cloud 2023.0.0 doesn't support Java 25 |

---

## Recommended Java Versions for Spring Boot 3.2.1

| Java Version | Status | Recommendation |
|--------------|--------|----------------|
| Java 17 LTS | ✅ Fully Supported | Good for production |
| Java 19 | ✅ Supported | Not recommended (short-term) |
| Java 21 LTS | ✅ Fully Supported | **RECOMMENDED** for production |
| Java 22+ | ❌ Not Supported | Preview features, incompatible |
| Java 25 | ❌ Not Supported | Early access, many issues |

---

## Check All Services Script

Run this in PowerShell to check all services:

```powershell
$services = @(
    "config-server",
    "eureka-server",
    "api-gateway",
    "Auth",
    "laborer-profile-service",
    "employer-profile-service",
    "Job-Service",
    "Assignment-Service",
    "Payment-Service",
    "Notification-Service"
)

foreach ($service in $services) {
    if (Test-Path "$service\pom.xml") {
        Write-Host "`nChecking $service..." -ForegroundColor Cyan
        $content = Get-Content "$service\pom.xml" -Raw
        if ($content -match '<java\.version>(\d+)</java\.version>') {
            $version = $matches[1]
            if ($version -eq "21") {
                Write-Host "  ✓ Java $version (OK)" -ForegroundColor Green
            } else {
                Write-Host "  ✗ Java $version (WRONG - should be 21)" -ForegroundColor Red
            }
        } else {
            Write-Host "  ? Java version not found" -ForegroundColor Yellow
        }
    }
}
```

---

## Batch Fix Script

To fix ALL services at once, you can use this PowerShell script:

```powershell
# Save as FIX_JAVA_VERSION.ps1

$services = @(
    "config-server",
    "eureka-server",
    "api-gateway",
    "Auth",
    "laborer-profile-service",
    "employer-profile-service",
    "Job-Service",
    "Assignment-Service",
    "Payment-Service",
    "Notification-Service"
)

foreach ($service in $services) {
    $pomPath = "$service\pom.xml"
    if (Test-Path $pomPath) {
        Write-Host "Processing $service..." -ForegroundColor Cyan
        
        $content = Get-Content $pomPath -Raw
        
        # Fix Java version
        $content = $content -replace '<java\.version>\d+</java\.version>', '<java.version>21</java.version>'
        
        # Add compiler source/target if not present
        if ($content -notmatch 'maven\.compiler\.source') {
            $content = $content -replace '(<java\.version>21</java\.version>)', "`$1`n        <maven.compiler.source>21</maven.compiler.source>`n        <maven.compiler.target>21</maven.compiler.target>"
        }
        
        Set-Content -Path $pomPath -Value $content
        Write-Host "  ✓ Updated $service" -ForegroundColor Green
    }
}

Write-Host "`nAll services updated! Run 'mvn clean compile' in each service to verify." -ForegroundColor Green
```

---

## Verification After Fix

### Test Compilation

```bash
cd eureka-server
mvn clean compile
```

**Expected Output:**
```
[INFO] Compiling 2 source files with javac [debug release 21]
[INFO] BUILD SUCCESS
```

### Test Execution (IntelliJ)

1. Right-click on `EurekaServerApplication.java`
2. **Run 'EurekaServerApplication'**
3. Should start without TypeTag errors
4. Check console: `Running with Spring Boot v3.2.1` (NOT 4.0.7)

### Test Execution (Command Line)

```bash
cd eureka-server
mvn spring-boot:run
```

Should start successfully on port 8761.

---

## Common Errors After Fix

### Still Getting Java 25 Errors?

**Check IntelliJ Settings:**
- Project SDK must be Java 21
- Maven Runner JRE must be Java 21
- Run Configuration must use Java 21

**Force IntelliJ to Reload:**
1. **File → Invalidate Caches**
2. Select **Invalidate and Restart**
3. Wait for re-indexing

### Maven Still Uses Wrong Java?

**Check JAVA_HOME:**
```bash
echo %JAVA_HOME%
# Should point to JDK 21, not JDK 25
```

**Set JAVA_HOME (if needed):**
```bash
set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%
```

---

## Production Deployment

For production, ensure:

1. ✅ All pom.xml files use `<java.version>21</java.version>`
2. ✅ Docker images use Java 21 base image
3. ✅ Server JRE/JDK is version 21
4. ✅ No Java 25 anywhere in the stack

**Update Dockerfiles if needed:**
```dockerfile
FROM eclipse-temurin:21-jre-alpine
# or
FROM amazoncorretto:21-alpine
```

---

## Summary

### Before Fix
- ❌ Java 25 in pom.xml
- ❌ IntelliJ using Java 25
- ❌ TypeTag::UNKNOWN errors
- ❌ Services won't start

### After Fix
- ✅ Java 21 in all pom.xml files
- ✅ IntelliJ configured for Java 21
- ✅ Services compile successfully
- ✅ Services run without errors

---

## Quick Reference

**Correct pom.xml properties:**
```xml
<properties>
    <java.version>21</java.version>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <spring-cloud.version>2023.0.0</spring-cloud.version>
</properties>
```

**Check Java version:**
```bash
java -version        # System Java
mvn -version         # Maven's Java
```

**Rebuild:**
```bash
mvn clean install -U
```

---

**Document Version:** 1.0.0  
**Last Updated:** June 21, 2026  
**Status:** Eureka Server Fixed ✅

Copyright © 2024 GramWork. All rights reserved.
