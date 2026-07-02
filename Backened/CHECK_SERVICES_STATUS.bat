@echo off
echo ========================================
echo GramWork Microservices - Status Check
echo ========================================
echo.

echo Checking service ports...
echo.

echo [Infrastructure Services]
echo --------------------------
netstat -ano | findstr ":8888" >nul && (echo [RUNNING] Config Server - Port 8888) || (echo [STOPPED] Config Server - Port 8888)
netstat -ano | findstr ":8761" >nul && (echo [RUNNING] Eureka Server - Port 8761) || (echo [STOPPED] Eureka Server - Port 8761)
netstat -ano | findstr ":8080" >nul && (echo [RUNNING] API Gateway - Port 8080) || (echo [STOPPED] API Gateway - Port 8080)

echo.
echo [Business Services]
echo --------------------------
netstat -ano | findstr ":8086" >nul && (echo [RUNNING] Auth Service - Port 8086) || (echo [STOPPED] Auth Service - Port 8086)
netstat -ano | findstr ":8081" >nul && (echo [RUNNING] Laborer Profile - Port 8081) || (echo [STOPPED] Laborer Profile - Port 8081)
netstat -ano | findstr ":8089" >nul && (echo [RUNNING] Employer Profile - Port 8089) || (echo [STOPPED] Employer Profile - Port 8089)
netstat -ano | findstr ":8083" >nul && (echo [RUNNING] Job Service - Port 8083) || (echo [STOPPED] Job Service - Port 8083)
netstat -ano | findstr ":8084" >nul && (echo [RUNNING] Assignment/Payment - Port 8084) || (echo [STOPPED] Assignment/Payment - Port 8084)
netstat -ano | findstr ":8088" >nul && (echo [RUNNING] Notification - Port 8088) || (echo [STOPPED] Notification - Port 8088)

echo.
echo [Database Services]
echo --------------------------
netstat -ano | findstr ":27017" >nul && (echo [RUNNING] MongoDB - Port 27017) || (echo [STOPPED] MongoDB - Port 27017)
netstat -ano | findstr ":6379" >nul && (echo [RUNNING] Redis - Port 6379) || (echo [STOPPED] Redis - Port 6379)

echo.
echo ========================================
echo Quick Links:
echo ========================================
echo - Eureka Dashboard: http://localhost:8761
echo - API Gateway Health: http://localhost:8080/actuator/health
echo - Config Server Health: http://localhost:8888/actuator/health
echo.
echo Press any key to exit...
pause >nul
