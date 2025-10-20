@echo off
chcp 65001 >nul
echo ============================================================
echo              COMPLETE REINSTALL
echo    This will delete and reinstall everything
echo ============================================================
echo.

echo [STEP 1/6] Checking if you're in the right folder...
if not exist "package.json" (
    echo.
    echo [ERROR] package.json not found!
    echo You are NOT in the project folder!
    echo.
    echo Current folder: %CD%
    echo.
    echo Please:
    echo 1. Open File Explorer
    echo 2. Navigate to project folder
    echo 3. Run this script from there
    echo.
    pause
    exit /b 1
)
echo [OK] Found package.json
echo.

echo [STEP 2/6] Stopping any running processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul
echo [OK] Processes stopped
echo.

echo [STEP 3/6] Cleaning old installation...
if exist "node_modules" (
    echo Removing node_modules folder...
    rmdir /s /q "node_modules" 2>nul
)
if exist "package-lock.json" (
    echo Removing package-lock.json...
    del /f /q "package-lock.json" 2>nul
)
if exist "server\database.sqlite" (
    echo Database exists, keeping it...
)
echo [OK] Cleanup complete
echo.

echo [STEP 4/6] Clearing npm cache...
call npm cache clean --force
echo [OK] Cache cleared
echo.

echo [STEP 5/6] Installing dependencies...
echo This may take 3-5 minutes, please wait...
echo.
call npm install --legacy-peer-deps

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Installation failed with --legacy-peer-deps
    echo Trying with --force...
    echo.
    call npm install --force
    
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Installation completely failed!
        echo.
        echo Please check:
        echo 1. Internet connection
        echo 2. Antivirus settings
        echo 3. Run as administrator
        echo.
        pause
        exit /b 1
    )
)

echo.
echo [OK] Dependencies installed!
echo.

echo [STEP 6/6] Setting up database...
if not exist "server\database.sqlite" (
    echo Creating new database...
    node server/setup-db.js
    
    if %errorlevel% neq 0 (
        echo [WARNING] Database creation failed!
        echo You may need to run: npm run setup
    ) else (
        echo [OK] Database created!
    )
) else (
    echo [OK] Database already exists
)

echo.
echo ============================================================
echo              INSTALLATION COMPLETE!
echo ============================================================
echo.
echo To start the website:
echo.
echo   Option 1: Double-click start-windows.bat
echo   Option 2: Run command: npm run dev
echo.
echo Then open in browser: http://localhost:5173
echo.
pause
