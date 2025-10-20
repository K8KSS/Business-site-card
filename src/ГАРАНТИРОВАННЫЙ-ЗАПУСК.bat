@echo off
cls

:: Check if node_modules exists
if not exist "node_modules" (
    echo ========================================
    echo.
    echo   Dependencies not installed!
    echo.
    echo ========================================
    echo.
    echo Installing dependencies...
    echo This will take 2-3 minutes. Please wait...
    echo.
    call npm install
    echo.
    echo Dependencies installed!
    echo.
    timeout /t 2 /nobreak >nul
)

:: Check if Vite exists
if not exist "node_modules\.bin\vite.cmd" (
    echo ========================================
    echo.
    echo   Vite not found!
    echo.
    echo ========================================
    echo.
    echo Reinstalling Vite...
    echo.
    call npm install vite --save-dev
    echo.
    echo Vite installed!
    echo.
    timeout /t 2 /nobreak >nul
)

cls
echo ========================================
echo.
echo   Music Teacher Website - Supabase
echo.
echo ========================================
echo.
echo   Backend: Supabase (cloud)
echo   Frontend: Vite + React
echo.
echo   Open: http://localhost:5173
echo   Admin: Ctrl + Shift + A (password: admin)
echo.
echo ========================================
echo.
echo Starting project...
echo.

:: Try 1: npm run dev:client
call npm run dev:client 2>nul
if %errorlevel% equ 0 goto end

:: Try 2: npx vite
echo.
echo Trying alternative method...
echo.
call npx vite 2>nul
if %errorlevel% equ 0 goto end

:: Try 3: direct run
echo.
echo Trying direct run...
echo.
node_modules\.bin\vite.cmd
if %errorlevel% equ 0 goto end

:: If nothing worked
echo.
echo ========================================
echo   Could not start the project
echo ========================================
echo.
echo Please try:
echo   1. Run: FIX-AND-RUN.bat
echo   2. Reinstall: npm install
echo   3. Run again
echo.
echo Or read: HOW-TO-RUN.txt
echo.

:end
pause
