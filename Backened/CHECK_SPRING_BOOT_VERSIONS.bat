@echo off
REM Check all pom.xml files for Spring Boot version

echo ========================================
echo Spring Boot Version Checker
echo ========================================
echo.
echo Checking all services for Spring Boot versions...
echo.

set INCORRECT_VERSION_FOUND=0

echo Checking services for Spring Boot 4.x (incorrect)...
echo.

REM Check each service
for /d %%D in (config-server eureka-server api-gateway Auth laborer-profile-service employer-profile-service Job-Service Assignment-Service Payment-Service Notification-Service) do (
    if exist "%%D\pom.xml" (
        findstr /C:"<version>4.0" "%%D\pom.xml" >nul 2>&1
        if !errorlevel! equ 0 (
            echo [WARNING] %%D: Using Spring Boot 4.x ^(INCORRECT^)
            set INCORRECT_VERSION_FOUND=1
        ) else (
            findstr /C:"<version>3.2.1</version>" "%%D\pom.xml" >nul 2>&1
            if !errorlevel! equ 0 (
                echo [OK] %%D: Using Spring Boot 3.2.1
            ) else (
                echo [UNKNOWN] %%D: Version unclear, check manually
            )
        )
    ) else (
        echo [SKIP] %%D: pom.xml not found
    )
)

echo.
echo ========================================
echo Summary
echo ========================================

if %INCORRECT_VERSION_FOUND%==1 (
    echo.
    echo [ERROR] Some services are using Spring Boot 4.x!
    echo.
    echo Spring Boot 4.x is NOT a stable release.
    echo Please update all services to Spring Boot 3.2.1
    echo.
    echo Fix: Edit pom.xml in each service and change:
    echo   ^<version^>4.0.x^</version^>
    echo to:
    echo   ^<version^>3.2.1^</version^>
    echo.
    echo Then rebuild: mvn clean install -U
    echo.
) else (
    echo.
    echo [SUCCESS] All checked services are using compatible Spring Boot versions
    echo.
)

echo Check completed at %date% %time%
echo ========================================

pause
