@echo off
chcp 65001 >nul
echo ================================================
echo ПЕРЕУСТАНОВКА TAILWIND CSS V3
echo ================================================
echo.
echo Это исправит проблему с отсутствием стилей.
echo.
echo Нажмите любую клавишу для начала...
pause >nul

echo.
echo [1/4] Удаление node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✓ node_modules удалён
) else (
    echo ✓ node_modules не найден
)

echo.
echo [2/4] Удаление package-lock.json...
if exist package-lock.json (
    del /f /q package-lock.json
    echo ✓ package-lock.json удалён
) else (
    echo ✓ package-lock.json не найден
)

echo.
echo [3/4] Установка зависимостей...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ОШИБКА при установке зависимостей!
    echo Попробуйте выполнить вручную: npm install
    pause
    exit /b 1
)

echo.
echo [4/4] Проверка Tailwind CSS...
call npm list tailwindcss

echo.
echo ================================================
echo ✓ ГОТОВО!
echo ================================================
echo.
echo Теперь запустите проект:
echo   npm run dev
echo.
echo И обновите страницу в браузере: Ctrl+F5
echo.
pause
