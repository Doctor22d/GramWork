@echo off
REM GramWork Microservices - Build Verification Script
REM This script verifies that all services can compile successfully

echo ========================================
echo GramWork Build Verification Script
echo ========================================
echo.
echo This script will verify all services compile correctly
echo It performs a quick compile check without running tests
echo.

set VERIFY_FAILED=0

echo Checking Java version...
java -version
echo.

echo Checking Maven version...
mvn -version
echo.

echo ========================================
echo Starting Compilation Verification
echo ========================================
echo.

REM Verify Config Server
echo [1/10] Verifying Config Server...
cd config-server
call mvn clean compile -q
if errorlevel 1 (
    echo [FAIL] Config Server compilation failed
    set VERIFY_FAILED=1
) else (
    echo [PASS] Config Server compiles successfully
)
cd ..
echo.

REM Verify Eureka Server
echo [2/10] Verifying Eureka Server...
cd eureka-server
call mvn clean compile -q
if errorlevel 1 (
    echo [FAIL] Eureka Server compilation failed
    set VERIFY_FAILED=1
) else (
    echo [PASS] Eureka Server compiles successfully
)
cd ..
echo.

REM Verify API Gateway
echo [3/10] Verifying API Gateway...
cd api-gateway
call mvn clean compile -q
if errorlevel 1 (
    echo [FAIL] API Gateway compilation failed
    set VERIFY_FAILED=1
) else (
    echo [PASS] API Gateway compiles successfully
)
cd ..
echo.

REM Verify Auth Service
echo [4/10] Verifying Auth Service...
cd Auth
call mvn clean compile -q
if errorlevel 1 (
    echo [FAIL] Auth Service compilation failed
    set VERIFY_FAILED=1
) else (
    echo [PASS] Auth Service compiles successfully
)
cd ..
echo.

REM Verify Laborer Profile Service
echo [5/10] Verifying Laborer Profile Service...
cd laborer-profile-service
call mvn clean compile -q
if errorlevel 1 (
    echo [FAIL] Laborer Profile Service compilation failed
    set VERIFY_FAILED=1
) else (
    echo [PASS] Laborer Profile Service compiles successfully
)
cd ..
echo.

REM Verify Employer Profile Service
echo [6/10] Verifying Employer Profile Service...
cd employer-profile-service
call mvn clean compile -q
if errorlevel 1 (
    echo [FAIL] Employer Profile Service compilation failed
    set VERIFY_FAILED=1
) else (
    echo [PASS] Employer Profile Service compiles successfully
)
cd ..
echo.

REM Verify Job Service
echo [7/10] Verifying Job Service...
cd Job-Service
call mvn clean compile -q
if errorlevel 1 (
    echo [FAIL] Job Service compilation failed
    set VERIFY_FAILED=1
) else (
    echo [PASS] Job Service compiles successfully
)
cd ..
echo.

REM Verify Assignment Service
echo [8/10] Verifying Assignment Service...
cd Assignment-Service
call mvn clean compile -q
if errorlevel 1 (
    echo [FAIL] Assignment Service compilation failed
    set VERIFY_FAILED=1
) else (
    echo [PASS] Assignment Service compiles successfully
)
cd ..
echo.

REM Verify Payment Service
echo [9/10] Verifying Payment Service...
cd Payment-Service
call mvn clean compile -q
if errorlevel 1 (
    echo [FAIL] Payment Service compilation failed
    set VERIFY_FAILED=1
) else (
    echo [PASS] Payment Service compiles successfully
)
cd ..
echo.

REM Verify Notification Service
echo [10/10] Verifying Notification Service...
cd Notification-Service
call mvn clean compile -q
if errorlevel 1 (
    echo [FAIL] Notification Service compilation failed
    set VERIFY_FAILED=1
) else (
    echo [PASS] Notification Service compiles successfully
)
cd ..
echo.

echo ========================================
echo Verification Summary
echo ========================================
if %VERIFY_FAILED%==0 (
    echo.
    echo ✓ ALL SERVICES VERIFIED SUCCESSFULLY
    echo.
    echo All microservices compile without errors.
    echo.
    echo Next Steps:
    echo 1. Run BUILD_ALL.bat to build all JAR files
    echo 2. Run docker-compose build to create Docker images
    echo 3. Run docker-compose up -d to start all services
    echo.
) else (
    echo.
    echo ✗ VERIFICATION FAILED
    echo.
    echo Some services failed to compile.
    echo Please check the error messages above.
    echo Refer to TROUBLESHOOTING.md for solutions.
    echo.
    exit /b 1
)

echo Verification completed at %date% %time%
echo ========================================

pause
