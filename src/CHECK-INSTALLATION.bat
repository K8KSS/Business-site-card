@echo off
chcp 65001 >nul
echo ============================================================
echo           INSTALLATION CHECK
echo ============================================================
echo.

echo [1/7] Checking current directory...
echo Current folder: %CD%
echo.

echo [2/7] Checking if package.json exists...
if exist "package.json" (
    echo [OK] package.json found
) else (
    echo [ERROR] package.json NOT found!
    echo You are in the WRONG folder!
    goto :error_end
)
echo.

echo [3/7] Checking if node_modules exists...
if exist "node_modules" (
    echo [OK] node_modules folder exists
    
    echo Checking if vite is installed...
    if exist "node_modules\.bin\vite.cmd" (
        echo [OK] Vite is installed
    ) else (
        echo [ERROR] Vite NOT found in node_modules!
        echo Dependencies are incomplete or corrupted
        goto :fix_suggestion
    )
) else (
    echo [ERROR] node_modules folder NOT found!
    echo Dependencies are NOT installed!
    goto :fix_suggestion
)
echo.

echo [4/7] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    goto :error_end
) else (
    echo [OK] Node.js is installed
)
echo.

echo [5/7] Checking npm...
call npm --version
if %errorlevel% neq 0 (
    echo [ERROR] npm not found!
    goto :error_end
) else (
    echo [OK] npm is installed
)
echo.

echo [6/7] Checking server files...
if exist "server\index.js" (
    echo [OK] server/index.js found
) else (
    echo [ERROR] server/index.js NOT found!
)

if exist "server\setup-db.js" (
    echo [OK] server/setup-db.js found
) else (
    echo [ERROR] server/setup-db.js NOT found!
)
echo.

echo [7/7] Checking if database exists...
if exist "server\database.sqlite" (
    echo [OK] Database exists
) else (
    echo [WARNING] Database NOT found!
    echo Run: npm run setup
)
echo.

echo ============================================================
echo              ALL CHECKS PASSED!
echo ============================================================
echo.
echo Your installation looks good!
echo.
echo To start the website:
echo   npm run dev
echo.
echo Or double-click: start-windows.bat
echo.
pause
exit /b 0

:fix_suggestion
echo.
echo ============================================================
echo           FIX SUGGESTION
echo ============================================================
echo.
echo To fix this problem:
echo.
echo   Double-click: REINSTALL.bat
echo.
echo This will:
echo   - Delete old installation
echo   - Clear cache
echo   - Reinstall all dependencies
echo   - Setup database
echo.
pause
exit /b 1

:error_end
echo.
echo ============================================================
echo           CRITICAL ERROR
echo ============================================================
echo.
echo Please fix the errors above and try again.
echo.
pause
exit /b 1
