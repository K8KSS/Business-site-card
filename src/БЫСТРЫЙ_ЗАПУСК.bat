@echo off
chcp 65001 > nul
cls

echo.
echo ====================================================================
echo            QUICK FIX AND PROJECT LAUNCH
echo ====================================================================
echo.
echo This script will perform a complete cleanup and restart
echo with all Tailwind CSS fixes.
echo.
echo This will take 2-3 minutes...
echo.

pause

echo.
echo ====================================================================
echo  STEP 1/4: Stopping all processes...
echo ====================================================================
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo OK: Done

echo.
echo ====================================================================
echo  STEP 2/4: Clearing cache and old files...
echo ====================================================================
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo OK: Vite cache cleared
)
if exist dist (
    rmdir /s /q dist
    echo OK: dist folder cleared
)
if exist postcss.config.js (
    del postcss.config.js
    echo OK: Removed conflicting postcss.config.js
)
echo OK: Cleanup complete

echo.
echo ====================================================================
echo  STEP 3/4: Checking configuration...
echo ====================================================================
if exist postcss.config.cjs (
    echo OK: postcss.config.cjs found
) else (
    echo ERROR: postcss.config.cjs not found!
    pause
    exit /b 1
)

if exist tailwind.config.cjs (
    echo OK: tailwind.config.cjs found
) else (
    echo ERROR: tailwind.config.cjs not found!
    pause
    exit /b 1
)

if exist main.tsx (
    echo OK: main.tsx found
) else (
    echo ERROR: main.tsx not found!
    pause
    exit /b 1
)

echo OK: All configuration files in place

echo.
echo ====================================================================
echo  STEP 4/4: Starting development server...
echo ====================================================================
echo.
echo  Site will be available at: http://localhost:5173
echo  Check that Tailwind CSS is working:
echo     - Gradient background (pink-purple-blue)
echo     - Animated musical notes
echo     - Styled buttons and cards
echo.
echo  Press Ctrl+C to stop
echo.
echo ====================================================================
echo.

call npm run dev:client

echo.
echo.
echo ====================================================================
echo  Server stopped
echo ====================================================================
echo.
echo  If styles are not working:
echo     1. Check file: POLNOE_RESHENIE_PROBLEM.md
echo     2. Or run: npm run dev:client manually
echo     3. Hard reload browser (Ctrl+Shift+R)
echo.

pause
