@echo off
echo ===============================================
echo    Music Teacher Website Installation
echo ===============================================
echo.

echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Download and install Node.js from https://nodejs.org/
    echo Choose LTS version (recommended)
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

echo Installing dependencies...
echo This may take a few minutes...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies
    echo Trying alternative method...
    call npm install --force
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Installation still failed
        echo Try running as administrator
        pause
        exit /b 1
    )
)
echo.

echo Creating database...
call npm run setup
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to create database
    pause
    exit /b 1
)
echo.

echo ===============================================
echo    Installation completed successfully!
echo ===============================================
echo.
echo To start the website use:
echo   npm run dev
echo.
echo Or run: start-windows.bat
echo.
echo Admin panel:
echo   - Click 3 times on the logo
echo   - Password: admin
echo.
pause
