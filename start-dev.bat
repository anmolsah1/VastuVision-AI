@echo off
echo.
echo  ============================================
echo   VastuVision AI - Starting Development Servers
echo  ============================================
echo.

REM Start backend
echo [1/2] Starting Backend (http://localhost:5000)...
start "VastuVision - Backend" cmd /k "cd /d "%~dp0backend" && node src/server.js"

REM Wait a moment for backend to boot
timeout /t 3 /nobreak > nul

REM Start frontend
echo [2/2] Starting Frontend (http://localhost:5173)...
start "VastuVision - Frontend" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

echo.
echo  Both servers started!
echo  Backend:   http://localhost:5000/api/health
echo  Frontend:  http://localhost:5173
echo.
timeout /t 5 /nobreak > nul
start "" "http://localhost:5173"
