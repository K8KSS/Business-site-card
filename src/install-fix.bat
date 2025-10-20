@echo off

echo ============================================================
echo    INSTALLATION DIAGNOSTICS AND FIX
echo ============================================================
echo.

echo Checking current directory...
cd
echo.

echo Checking package.json...
if exist package.json (
    echo [OK] package.json found
    echo.
    echo Scripts content:
    type package.json | findstr "scripts" -A 10
) else (
    echo [ERROR] package.json NOT found!
    echo.
    echo You are not in the project folder!
    echo Navigate to the music-teacher-website folder
    pause
    exit /b 1
)
echo.

echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not installed!
    pause
    exit /b 1
)
echo.

echo Checking npm...
npm --version
if %errorlevel% neq 0 (
    echo [ERROR] npm is not working!
    pause
    exit /b 1
)
echo.

echo Cleaning npm cache...
call npm cache clean --force
echo.

echo Removing old files...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json
echo.

echo Installing dependencies...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [ERROR] Installation failed!
    echo Trying with --force flag...
    call npm install --force
    if %errorlevel% neq 0 (
        echo [ERROR] Installation still failed!
        echo.
        echo Try to:
        echo 1. Run as administrator
        echo 2. Check internet connection
        echo 3. Disable antivirus temporarily
        pause
        exit /b 1
    )
)
echo.

echo Creating database...
call npm run setup
if %errorlevel% neq 0 (
    echo [ERROR] Database creation failed!
    pause
    exit /b 1
)
echo.

echo ============================================================
echo    Installation completed successfully!
echo ============================================================
echo.
echo To start the project use:
echo   npm run dev
echo.
echo Or run: start-windows.bat
echo.
pause
