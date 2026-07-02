@echo off
echo ========================================
echo GramWork Microservices - Restart All
echo ========================================
echo.

echo Step 1: Stopping all Java processes...
taskkill /F /IM java.exe /T >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] All Java processes stopped
) else (
    echo [INFO] No Java processes were running
)
timeout /t 3 >nul

echo.
echo Step 2: Starting infrastructure services...
echo.

echo [1/10] Starting Config Server (Port 8888)...
cd "%~dp0config-server"
start "Config Server" cmd /k "mvn spring-boot:run"
timeout /t 15 >nul

echo [2/10] Starting Eureka Server (Port 8761)...
cd "%~dp0eureka-server"
start "Eureka Server" cmd /k "mvn spring-boot:run"
timeout /t 15 >nul

echo [3/10] Starting API Gateway (Port 8080)...
cd "%~dp0api-gateway"
start "API Gateway" cmd /k "mvn spring-boot:run"
timeout /t 10 >nul

echo.
echo Step 3: Starting business services...
echo.

echo [4/10] Starting Auth Service (Port 8086)...
cd "%~dp0Auth"
start "Auth Service" cmd /k "mvn spring-boot:run"
timeout /t 5 >nul

echo [5/10] Starting Laborer Profile Service (Port 8081)...
cd "%~dp0laborer-profile-service"
start "Laborer Profile Service" cmd /k "mvn spring-boot:run"
timeout /t 5 >nul

echo [6/10] Starting Employer Profile Service (Port 8089)...
cd "%~dp0employer-profile-service"
start "Employer Profile Service" cmd /k "mvn spring-boot:run"
timeout /t 5 >nul

echo [7/10] Starting Job Service (Port 8083)...
cd "%~dp0Job-Service"
start "Job Service" cmd /k "mvn spring-boot:run"
timeout /t 5 >nul

echo [8/10] Starting Assignment Service (Port 8084)...
cd "%~dp0Assignment-Service"
start "Assignment Service" cmd /k "mvn spring-boot:run"
timeout /t 5 >nul

echo [9/10] Starting Payment Service (Port 8084)...
cd "%~dp0paymentService"
start "Payment Service" cmd /k "mvn spring-boot:run"
timeout /t 5 >nul

echo [10/10] Starting Notification Service (Port 8088)...
cd "%~dp0Notification-Service"
start "Notification Service" cmd /k "mvn spring-boot:run"
timeout /t 5 >nul

echo.
echo ========================================
echo All services are starting up!
echo ========================================
echo.
echo Wait 2-3 minutes for all services to fully start.
echo.
echo Check service status:
echo - Eureka Dashboard: http://localhost:8761
echo - API Gateway: http://localhost:8080/actuator/health
echo - Config Server: http://localhost:8888/actuator/health
echo.
echo Press any key to exit...
pause >nul
