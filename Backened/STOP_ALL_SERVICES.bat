@echo off
echo ========================================
echo GramWork Microservices - Stop All
echo ========================================
echo.

echo Stopping all Java processes...
taskkill /F /IM java.exe /T

echo.
echo ========================================
echo All services stopped!
echo ========================================
echo.
echo Press any key to exit...
pause >nul
