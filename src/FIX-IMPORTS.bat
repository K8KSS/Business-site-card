@echo off
chcp 65001 >nul
echo ================================================
echo ИСПРАВЛЕНИЕ ИМПОРТОВ
echo ================================================
echo.
echo Это исправит проблему с импортами библиотек
echo.
pause

echo.
echo [1/2] Удаление старых зависимостей...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✓ node_modules удалён
)

if exist package-lock.json (
    del /f /q package-lock.json
    echo ✓ package-lock.json удалён
)

echo.
echo [2/2] Установка зависимостей заново...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ОШИБКА при установке!
    pause
    exit /b 1
)

echo.
echo ================================================
echo ✓ ГОТОВО!
echo ================================================
echo.
echo Теперь запустите проект:
echo   start-windows.bat
echo.
echo Или вручную:
echo   npm run dev
echo.
pause
