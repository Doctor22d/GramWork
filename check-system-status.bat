@echo off
color 0E
echo ========================================
echo    GramWork System Status Check
echo ========================================
echo.

set MONGODB_OK=0
set USER_OK=0
set AUTH_OK=0
set FRONTEND_OK=0

REM Check 1: MongoDB
echo [1/4] Checking MongoDB Connection...
mongosh --quiet --eval "db.version()" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MongoDB is running on localhost:27017
    set MONGODB_OK=1
) else (
    echo [ERROR] MongoDB is NOT running!
    echo        Please start MongoDB before running GramWork
)
echo.

REM Check 2: User Status in Database
echo [2/4] Checking User Status in Database...
if %MONGODB_OK% equ 1 (
    mongosh --quiet --eval "use GramWorkAuth; var user = db.auth.findOne({_id: ObjectId('6a2562956e387e7ad08e084a')}, {email: 1, isActive: 1, isVerified: 1}); if(!user) { print('NOT_FOUND'); } else if(user.isActive && user.isVerified) { print('OK:' + user.email); } else { print('NEEDS_FIX:Active=' + user.isActive + ',Verified=' + user.isVerified); }" > temp_user.txt
    set /p USER_STATUS=<temp_user.txt
    del temp_user.txt
    
    echo !USER_STATUS! | findstr /C:"OK:" >nul
    if !errorlevel! equ 0 (
        echo [OK] User found and active
        for /f "tokens=2 delims=:" %%a in ("!USER_STATUS!") do echo     Email: %%a
        set USER_OK=1
    ) else (
        echo !USER_STATUS! | findstr /C:"NOT_FOUND" >nul
        if !errorlevel! equ 0 (
            echo [ERROR] User not found in database
            echo        User ID: 6a2562956e387e7ad08e084a
        ) else (
            echo [WARNING] User exists but is NOT active or NOT verified
            echo          !USER_STATUS!
            echo          Run: fix-user-mongodb.bat
        )
    )
) else (
    echo [SKIP] Cannot check user - MongoDB not running
)
echo.

REM Check 3: Auth Service
echo [3/4] Checking Auth Service...
curl -s http://localhost:8086/actuator/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Auth Service is running on port 8086
    set AUTH_OK=1
) else (
    echo [WARNING] Auth Service is NOT running on port 8086
    echo          Start with: cd Backened\Auth ^&^& mvn spring-boot:run
)
echo.

REM Check 4: Frontend
echo [4/4] Checking Frontend...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend is running on port 3000
    set FRONTEND_OK=1
) else (
    echo [WARNING] Frontend is NOT running on port 3000
    echo          Start with: cd Frontend ^&^& npm run dev
)
echo.

echo ========================================
echo    System Status Summary
echo ========================================
echo.

REM Calculate total score
set /a TOTAL_SCORE=MONGODB_OK+USER_OK+AUTH_OK+FRONTEND_OK

if %MONGODB_OK% equ 1 (
    echo [✓] MongoDB:     Running
) else (
    echo [✗] MongoDB:     Not Running
)

if %USER_OK% equ 1 (
    echo [✓] User:        Active and Verified
) else (
    echo [✗] User:        Not Active/Verified or Not Found
)

if %AUTH_OK% equ 1 (
    echo [✓] Auth Service: Running on port 8086
) else (
    echo [✗] Auth Service: Not Running
)

if %FRONTEND_OK% equ 1 (
    echo [✓] Frontend:    Running on port 3000
) else (
    echo [✗] Frontend:    Not Running
)

echo.
echo Score: %TOTAL_SCORE%/4 checks passed
echo.

if %TOTAL_SCORE% equ 4 (
    color 0A
    echo ========================================
    echo    🎉 ALL SYSTEMS GO! 🎉
    echo ========================================
    echo.
    echo You can now access GramWork:
    echo    http://localhost:3000
    echo.
) else (
    color 0C
    echo ========================================
    echo    ⚠️  SYSTEM NOT READY  ⚠️
    echo ========================================
    echo.
    echo Please fix the issues marked with [✗]
    echo.
    if %MONGODB_OK% equ 0 (
        echo 1. Start MongoDB
    )
    if %USER_OK% equ 0 (
        echo 2. Fix user status: run fix-user-mongodb.bat
    )
    if %AUTH_OK% equ 0 (
        echo 3. Start Auth Service: cd Backened\Auth ^&^& mvn spring-boot:run
    )
    if %FRONTEND_OK% equ 0 (
        echo 4. Start Frontend: cd Frontend ^&^& npm run dev
    )
    echo.
    echo Or use the automated script: START_GRAMWORK.bat
    echo.
)

echo ========================================
pause
