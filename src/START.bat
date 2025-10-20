@echo off
cls
echo.
echo ============================================================
echo          MUSIC TEACHER WEBSITE - QUICK LAUNCHER
echo ============================================================
echo.
echo What would you like to do?
echo.
echo   [1] Install project (automatic)
echo   [2] Install with legacy-peer-deps (if errors)
echo   [3] Complete reinstall (delete and reinstall)
echo   [4] Check installation status
echo   [5] Start website
echo   [6] Run diagnostics
echo   [7] View help
echo   [8] Exit
echo.
echo ============================================================
echo.

set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" (
    echo.
    echo Starting installation...
    call INSTALL-NOW.bat
    goto end
)

if "%choice%"=="2" (
    echo.
    echo Starting alternative installation...
    call install-alternative.bat
    goto end
)

if "%choice%"=="3" (
    echo.
    echo Starting complete reinstall...
    call REINSTALL.bat
    goto end
)

if "%choice%"=="4" (
    echo.
    echo Checking installation status...
    call CHECK-INSTALLATION.bat
    goto end
)

if "%choice%"=="5" (
    echo.
    echo Starting website...
    call start-windows.bat
    goto end
)

if "%choice%"=="6" (
    echo.
    echo Running diagnostics...
    call diagnose.bat
    goto end
)

if "%choice%"=="7" (
    cls
    type READ-ME-FIRST.txt
    echo.
    pause
    goto end
)

if "%choice%"=="8" (
    exit
)

echo Invalid choice. Please run again.
pause

:end
