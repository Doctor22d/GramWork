@echo off
REM GramWork Microservices - Build All Services Script
REM This script builds all microservices and infrastructure components

echo ========================================
echo GramWork Microservices Build Script
echo ========================================
echo.

set BUILD_FAILED=0

echo [1/10] Building Config Server...
cd config-server
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Config Server build failed!
    set BUILD_FAILED=1
) else (
    echo [SUCCESS] Config Server built successfully
)
cd ..
echo.

echo [2/10] Building Eureka Server...
cd eureka-server
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Eureka Server build failed!
    set BUILD_FAILED=1
) else (
    echo [SUCCESS] Eureka Server built successfully
)
cd ..
echo.

echo [3/10] Building API Gateway...
cd api-gateway
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] API Gateway build failed!
    set BUILD_FAILED=1
) else (
    echo [SUCCESS] API Gateway built successfully
)
cd ..
echo.

echo [4/10] Building Auth Service...
cd Auth
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Auth Service build failed!
    set BUILD_FAILED=1
) else (
    echo [SUCCESS] Auth Service built successfully
)
cd ..
echo.

echo [5/10] Building Laborer Profile Service...
cd laborer-profile-service
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Laborer Profile Service build failed!
    set BUILD_FAILED=1
) else (
    echo [SUCCESS] Laborer Profile Service built successfully
)
cd ..
echo.

echo [6/10] Building Employer Profile Service...
cd employer-profile-service
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Employer Profile Service build failed!
    set BUILD_FAILED=1
) else (
    echo [SUCCESS] Employer Profile Service built successfully
)
cd ..
echo.

echo [7/10] Building Job Service...
cd Job-Service
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Job Service build failed!
    set BUILD_FAILED=1
) else (
    echo [SUCCESS] Job Service built successfully
)
cd ..
echo.

echo [8/10] Building Assignment Service...
cd Assignment-Service
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Assignment Service build failed!
    set BUILD_FAILED=1
) else (
    echo [SUCCESS] Assignment Service built successfully
)
cd ..
echo.

echo [9/10] Building Payment Service...
cd Payment-Service
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Payment Service build failed!
    set BUILD_FAILED=1
) else (
    echo [SUCCESS] Payment Service built successfully
)
cd ..
echo.

echo [10/10] Building Notification Service...
cd Notification-Service
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Notification Service build failed!
    set BUILD_FAILED=1
) else (
    echo [SUCCESS] Notification Service built successfully
)
cd ..
echo.

echo ========================================
echo Build Summary
echo ========================================
if %BUILD_FAILED%==0 (
    echo [SUCCESS] All services built successfully!
    echo You can now run: docker-compose up -d
) else (
    echo [ERROR] Some services failed to build
    echo Check the output above for details
    exit /b 1
)
echo.
echo Build completed at %date% %time%
echo ========================================

pause
