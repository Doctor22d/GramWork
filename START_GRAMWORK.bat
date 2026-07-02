@echo off
color 0A
echo ========================================
echo    GramWork Application Startup
echo ========================================
echo.

REM Check if MongoDB is running
echo [1/4] Checking MongoDB...
mongosh --eval "db.version()" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MongoDB is not running on localhost:27017
    echo Please start MongoDB first!
    pause
    exit /b 1
)
echo [OK] MongoDB is running
echo.

REM Check if user needs to be fixed
echo [2/4] Checking user status in database...
mongosh --quiet --eval "use GramWorkAuth; var user = db.auth.findOne({_id: ObjectId('6a2562956e387e7ad08e084a')}, {isActive: 1, isVerified: 1}); if(user && user.isActive && user.isVerified) { print('OK'); } else { print('NEEDS_FIX'); }" > temp_check.txt
set /p USER_STATUS=<temp_check.txt
del temp_check.txt

if "%USER_STATUS%"=="NEEDS_FIX" (
    echo [WARNING] User is not active or verified
    echo.
    echo Would you like to fix this now? (Y/N^)
    set /p FIX_USER=
    if /i "%FIX_USER%"=="Y" (
        echo Fixing user status...
        mongosh --quiet --eval "use GramWorkAuth; db.auth.updateOne({_id: ObjectId('6a2562956e387e7ad08e084a')}, {$set: {isActive: true, isVerified: true}});"
        echo [OK] User status fixed
    ) else (
        echo [WARNING] Skipping user fix - login may fail!
    )
) else (
    echo [OK] User is active and verified
)
echo.

REM Start Auth Service
echo [3/4] Starting Auth Service...
echo Opening new terminal for Auth Service...
start "GramWork Auth Service" cmd /k "cd Backened\Auth && mvn spring-boot:run"
echo [OK] Auth Service starting on port 8086
echo Wait 20-30 seconds for Auth service to fully start...
timeout /t 30 /nobreak
echo.

REM Start Frontend
echo [4/4] Starting Frontend...
echo Opening new terminal for Frontend...
start "GramWork Frontend" cmd /k "cd Frontend && npm run dev"
echo [OK] Frontend starting on port 3000
echo.

echo ========================================
echo    Startup Complete!
echo ========================================
echo.
echo Services:
echo - Auth Service:  http://localhost:8086
echo - Frontend:      http://localhost:3000
echo.
echo Two new terminal windows have opened:
echo 1. Auth Service (Spring Boot on port 8086^)
echo 2. Frontend (Vite on port 3000^)
echo.
echo Wait for both services to fully start, then:
echo 1. Open: http://localhost:3000
echo 2. Login with your credentials
echo.
echo To stop services: Close the terminal windows or press Ctrl+C
echo.
echo ========================================
pause
