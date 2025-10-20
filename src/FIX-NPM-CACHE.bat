@echo off
cls
echo ========================================
echo   Fixing npm cache and scripts
echo ========================================
echo.
echo Step 1: Cleaning npm cache...
call npm cache clean --force
echo Done!
echo.
echo Step 2: Removing node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo Done!
) else (
    echo node_modules not found
)
echo.
echo Step 3: Removing package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo Done!
) else (
    echo package-lock.json not found
)
echo.
echo Step 4: Reinstalling dependencies...
echo This may take 2-3 minutes. Please wait...
call npm install
echo.
echo ========================================
echo   DONE!
echo ========================================
echo.
echo Now you can run:
echo   npm run dev:client
echo.
echo Or just double-click: RUN.bat
echo.
pause
