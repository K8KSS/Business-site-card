@echo off
chcp 65001 >nul
cls
echo ========================================
echo System Check for Music Teacher Website
echo ========================================
echo.

echo [1/5] Checking Node.js...
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js found
    node --version
) else (
    echo ✗ Node.js NOT found
    echo Please install from: https://nodejs.org/
)
echo.

echo [2/5] Checking npm...
where npm >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ npm found
    npm --version
) else (
    echo ✗ npm NOT found
)
echo.

echo [3/5] Checking PostgreSQL...
where psql >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ PostgreSQL found
    psql --version
) else (
    echo ✗ PostgreSQL NOT found ^(optional^)
    echo Install from: https://www.postgresql.org/
)
echo.

echo [4/5] Checking project dependencies...
if exist node_modules (
    echo ✓ Dependencies installed
) else (
    echo ✗ Dependencies NOT installed
    echo Run: npm install
)
echo.

echo [5/5] Checking server configuration...
if exist server\.env (
    echo ✓ server/.env exists
    echo.
    echo Current database settings:
    type server\.env
) else (
    echo ✗ server/.env NOT found
    echo This file was just created with default settings
)
echo.

echo ========================================
echo Summary
echo ========================================
echo.
echo Ready to start?
echo - Option 1 (No DB):  Always works
echo - Option 2 (With DB): Needs PostgreSQL
echo.
echo Run: SIMPLE-START.bat
echo.
pause
