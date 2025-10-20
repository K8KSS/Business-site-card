@echo off
echo ============================================================
echo    ALTERNATIVE INSTALLATION METHOD
echo    Using --legacy-peer-deps flag
echo ============================================================
echo.

if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo You are not in the project folder!
    pause
    exit /b 1
)

echo Cleaning cache...
call npm cache clean --force
echo.

echo Removing old installations...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del /f /q "package-lock.json"
echo.

echo Installing with legacy peer deps...
echo This may take a few minutes...
echo.
call npm install --legacy-peer-deps

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Installation with --legacy-peer-deps failed!
    echo.
    echo Trying with --force flag...
    echo.
    call npm install --force
    
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Both methods failed!
        echo.
        echo Please check:
        echo 1. Internet connection
        echo 2. Run as administrator
        echo 3. Disable antivirus
        echo.
        pause
        exit /b 1
    )
)

echo.
echo [OK] Dependencies installed successfully!
echo.

echo Creating database...
node server/setup-db.js

if %errorlevel% neq 0 (
    echo [ERROR] Database creation failed!
    pause
    exit /b 1
)

echo.
echo ============================================================
echo    INSTALLATION COMPLETED!
echo ============================================================
echo.
echo To start: npm run dev
echo Or run: start-windows.bat
echo.
pause
