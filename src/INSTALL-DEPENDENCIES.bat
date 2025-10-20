@echo off
chcp 65001 >nul
echo ========================================
echo Установка зависимостей
echo Installing Dependencies
echo ========================================
echo.
echo Устанавливаем npm пакеты...
echo Installing npm packages...
echo.
npm install
echo.
echo ========================================
echo Готово! Dependencies installed!
echo ========================================
echo.
pause
