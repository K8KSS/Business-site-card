@echo off
chcp 65001 >nul
echo ========================================
echo Starting Server
echo ========================================
echo.

echo [Step 1/2] Checking if PostgreSQL is running...
psql -U postgres -d music_teacher_website -c "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Database not accessible
    echo.
    echo Please make sure:
    echo 1. PostgreSQL service is running
    echo 2. Database 'music_teacher_website' exists
    echo 3. Run: setup-database.bat first
    echo.
    echo Server will start anyway (will use demo data)
    echo.
)

echo [Step 2/2] Starting server...
node server/index.js

pause