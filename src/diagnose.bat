@echo off

echo ============================================================
echo    PROJECT DIAGNOSTICS
echo ============================================================
echo.

echo [1] Current directory:
cd
echo.

echo [2] Files in current folder:
dir /b
echo.

echo [3] Checking package.json:
if exist "package.json" (
    echo [OK] package.json found
    echo.
    echo Scripts section content:
    findstr /C:"scripts" /C:"setup" /C:"dev" package.json
) else (
    echo [ERROR] package.json NOT FOUND!
    echo    You are not in the project folder!
)
echo.

echo [4] Checking Node.js:
node --version 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js is not installed
) else (
    echo [OK] Node.js is installed
)
echo.

echo [5] Checking npm:
npm --version 2>nul
if errorlevel 1 (
    echo [ERROR] npm is not working
) else (
    echo [OK] npm is working
)
echo.

echo [6] Checking server/setup-db.js:
if exist "server\setup-db.js" (
    echo [OK] server/setup-db.js found
) else (
    echo [ERROR] server/setup-db.js NOT found
)
echo.

echo [7] Checking node_modules:
if exist "node_modules" (
    echo [WARNING] node_modules exists
    echo    May need reinstallation
) else (
    echo [OK] node_modules does not exist
    echo    This is normal, will be created by npm install
)
echo.

echo [8] Checking package-lock.json:
if exist "package-lock.json" (
    echo [INFO] package-lock.json exists
) else (
    echo [INFO] package-lock.json does not exist
    echo    Will be created by npm install
)
echo.

echo ============================================================
echo    RECOMMENDATIONS
echo ============================================================
echo.

if not exist "package.json" (
    echo [CRITICAL ERROR]
    echo    package.json not found
    echo.
    echo SOLUTION:
    echo    Navigate to the correct project folder
    echo    It should contain package.json file
    echo.
) else (
    echo [OK] package.json found - this is good!
    echo.
    echo NEXT STEP:
    echo    Run the file: INSTALL-NOW.bat
    echo    It will automatically install everything
    echo.
)

echo ============================================================
pause
