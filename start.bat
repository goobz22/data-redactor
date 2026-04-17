@echo off
echo ========================================
echo Starting Data Redactor (Presidio)
echo ========================================
echo.

cd /d "%~dp0"

echo Starting Presidio backend server...
start "Presidio Backend" cmd /k "presidio-backend\Scripts\python.exe presidio-backend\presidio_server.py"

echo Waiting for Presidio to initialize (8 seconds)...
timeout /t 8 /nobreak > nul

echo Starting Bun frontend server...
bun run start

pause
