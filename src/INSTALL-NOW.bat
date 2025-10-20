@echo off
setlocal enabledelayedexpansion

cls
echo.
echo ============================================================
echo    AUTOMATIC PROJECT INSTALLATION
echo ============================================================
echo.

REM Check if we're in the correct folder
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo.
    echo You are running this script from the wrong folder!
    echo.
    echo The correct folder should contain:
    echo   - package.json
    echo   - server/setup-db.js
    echo   - App.tsx
    echo.
    pause
    exit /b 1
)

echo [Step 1/5] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo [OK] Node.js installed: %NODE_VER%
echo.

echo [Step 2/5] Cleaning old files...
if exist "node_modules" (
    echo    Removing node_modules...
    rmdir /s /q "node_modules" 2>nul
)
if exist "package-lock.json" (
    echo    Removing package-lock.json...
    del /f /q "package-lock.json" 2>nul
)
if exist "server\database.sqlite" (
    echo    Removing old database...
    del /f /q "server\database.sqlite" 2>nul
)
echo [OK] Cleanup completed
echo.

echo [Step 3/5] Cleaning npm cache...
call npm cache clean --force >nul 2>&1
echo [OK] Cache cleaned
echo.

echo [Step 4/5] Installing dependencies...
echo    This may take 2-5 minutes, please wait...
echo.
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to install dependencies!
    echo.
    echo Trying alternative installation method...
    call npm install --force
    if errorlevel 1 (
        echo.
        echo [ERROR] Installation still failed!
        echo.
        echo Possible causes:
        echo   1. No internet connection
        echo   2. Antivirus blocking installation
        echo   3. No administrator privileges
        echo.
        echo Try:
        echo   - Run as administrator
        echo   - Disable antivirus temporarily
        echo   - Check internet connection
        echo.
        pause
        exit /b 1
    )
)
echo.
echo [OK] Dependencies installed
echo.

echo [Step 5/5] Creating database...
node server/setup-db.js
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to create database!
    pause
    exit /b 1
)
echo.

cls
echo.
echo ============================================================
echo    INSTALLATION COMPLETED SUCCESSFULLY!
echo ============================================================
echo.
echo Project is ready to run!
echo.
echo To start the project use:
echo.
echo    npm run dev
echo.
echo    or double-click: start-windows.bat
echo.
echo After starting, open in browser:
echo    http://localhost:5173
echo.
echo Admin panel:
echo    1. Click 3 times on the logo
echo    2. Password: admin
echo.
echo ============================================================
echo.
pause

echo.
echo Start the project now? (Y/N)
set /p RUN="Enter Y to start: "
if /i "%RUN%"=="Y" (
    echo.
    echo Starting project...
    echo.
    start cmd /k "npm run dev"
    timeout /t 3 >nul
    start http://localhost:5173
)

exit /b 0
