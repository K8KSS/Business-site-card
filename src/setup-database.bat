@echo off
chcp 65001 >nul
echo ========================================
echo PostgreSQL Database Setup
echo ========================================
echo.

echo [Step 1/3] Checking PostgreSQL...
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PostgreSQL not found!
    echo.
    echo Please install PostgreSQL from:
    echo https://www.postgresql.org/download/windows/
    echo.
    echo Default password during installation: postgres
    pause
    exit /b 1
)
echo [OK] PostgreSQL found
echo.

echo [Step 2/3] Creating database...
echo Enter PostgreSQL password (default: postgres):
psql -U postgres -c "DROP DATABASE IF EXISTS music_teacher_website;"
psql -U postgres -c "CREATE DATABASE music_teacher_website;"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create database
    echo.
    echo Common issues:
    echo 1. Wrong password (default is 'postgres')
    echo 2. PostgreSQL service not running
    echo 3. Run this file as Administrator
    pause
    exit /b 1
)
echo [OK] Database created
echo.

echo [Step 3/3] Setting up tables...
cd server
node setup-db.js
if %errorlevel% neq 0 (
    echo [ERROR] Failed to setup tables
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo SUCCESS! Database is ready!
echo ========================================
echo.
echo Database: music_teacher_website
echo Host: localhost:5432
echo User: postgres
echo.
echo Now you can run: npm run dev
echo.
pause
