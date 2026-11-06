@echo off
title CampusSphere Launcher
echo ========================================================
echo   Launching CampusSphere - Full Stack MERN Application
echo ========================================================
echo.

echo [1/2] Starting Backend Server on http://localhost:5000 ...
start "CampusSphere Backend (Port 5000)" cmd /k "cd /d %~dp0server && npm run dev"

echo [2/2] Starting Frontend Client on http://localhost:5173 ...
start "CampusSphere Frontend (Port 5173)" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Both servers started in separate windows!
echo Open your browser at: http://localhost:5173
echo.
pause
