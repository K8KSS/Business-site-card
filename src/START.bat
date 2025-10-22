@echo off
chcp 65001 > nul
cls

echo.
echo ====================================================================
echo             MUSIC TEACHER WEBSITE - QUICK START
echo ====================================================================
echo.
goto MENU

:MENU
echo.
echo Select action:
echo.
echo   1. Install dependencies (first run)
echo   2. Run development server
echo   3. Build production version
echo   4. Preview production build
echo   5. Deploy Edge Functions to Supabase
echo   6. Open README (deployment guide)
echo   0. Exit
echo.

set /p choice="Enter number: "

if "%choice%"=="1" goto INSTALL
if "%choice%"=="2" goto DEV
if "%choice%"=="3" goto BUILD
if "%choice%"=="4" goto PREVIEW
if "%choice%"=="5" goto DEPLOY
if "%choice%"=="6" goto README
if "%choice%"=="0" goto EXIT
echo.
echo ERROR: Invalid choice! Try again.
echo.
pause
cls
goto MENU

:INSTALL
echo.
echo ====================================================================
echo  Installing dependencies...
echo ====================================================================
echo.
call npm install
if %errorlevel% == 0 (
    echo.
    echo OK: Installation complete!
) else (
    echo.
    echo ERROR: Installation failed!
)
echo.
pause
cls
goto MENU

:DEV
echo.
echo ====================================================================
echo  Starting development server...
echo ====================================================================
echo.
echo  IMPORTANT: For full functionality, you need to deploy
echo             Edge Functions to Supabase (menu option 5)
echo.
echo  Site will be available at: http://localhost:5173
echo  Press Ctrl+C to stop
echo.
call npm run dev:client
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to start!
    echo.
    pause
)
cls
goto MENU

:BUILD
echo.
echo ====================================================================
echo  Building production version...
echo ====================================================================
echo.
call npm run build
echo.
if %errorlevel% == 0 (
    echo OK: Build successful! Files in dist/ folder
) else (
    echo ERROR: Build failed!
)
echo.
pause
cls
goto MENU

:PREVIEW
echo.
echo ====================================================================
echo  Previewing production build...
echo ====================================================================
echo.
echo  First building, then starting preview server
echo  Site will be available at (usually): http://localhost:4173
echo  Press Ctrl+C to stop
echo.
call npm run start
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Preview failed!
    echo.
    pause
)
cls
goto MENU

:DEPLOY
echo.
echo ====================================================================
echo  Deploying Edge Functions to Supabase
echo ====================================================================
echo.
echo  Starting automatic deployment...
echo.
call DEPLOY_EDGE_FUNCTIONS.bat
echo.
pause
cls
goto MENU

:README
echo.
echo ====================================================================
echo  Opening README.md...
echo ====================================================================
echo.
start README.md
echo.
pause
cls
goto MENU

:EXIT
echo.
echo Goodbye!
echo.
exit
