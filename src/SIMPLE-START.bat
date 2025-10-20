@echo off
chcp 65001 >nul
cls
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║           🎵 MUSIC TEACHER WEBSITE - SUPABASE EDITION 🎵            ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.
echo ☁️  Backend работает на Supabase (облако)
echo ☁️  Локальный сервер НЕ НУЖЕН
echo.
echo ════════════════════════════════════════════════════════════════════════
echo.
echo Выберите опцию:
echo.
echo   1 - Запустить ФРОНТЕНД (рекомендуется)
echo   2 - Запустить ФРОНТЕНД + СТАРЫЙ ЛОКАЛЬНЫЙ СЕРВЕР (не рекомендуется)
echo   3 - Исправить проблемы с npm
echo   4 - Выход
echo.
echo ════════════════════════════════════════════════════════════════════════
echo.
set /p choice="Введите номер (1-4): "

if "%choice%"=="1" goto frontend
if "%choice%"=="2" goto fullstack
if "%choice%"=="3" goto fix
if "%choice%"=="4" goto end

echo.
echo ❌ Неверный выбор. Попробуйте снова.
timeout /t 2 /nobreak >nul
goto :eof

:frontend
cls
echo ════════════════════════════════════════════════════════════════════════
echo   🚀 Запуск фронтенда с Supabase backend
echo ════════════════════════════════════════════════════════════════════════
echo.
echo Frontend:  http://localhost:5173
echo Backend:   Supabase Edge Functions (облако)
echo.
echo ✅ Локальный сервер НЕ НУЖЕН
echo ✅ PostgreSQL НЕ НУЖЕН
echo ✅ Всё работает в облаке!
echo.
echo 🔐 Админка: Ctrl + Shift + A (пароль: admin)
echo.
echo ════════════════════════════════════════════════════════════════════════
echo.
echo Запуск Vite...
echo.
npx vite
goto end

:fullstack
cls
echo ════════════════════════════════════════════════════════════════════════
echo   ⚠️  ВНИМАНИЕ: Запуск старого локального сервера
echo ════════════════════════════════════════════════════════════════════════
echo.
echo ⚠️  Рекомендуется использовать опцию 1 (только фронтенд)
echo ⚠️  Локальный сервер больше не поддерживается
echo ⚠️  Всё работает на Supabase!
echo.
set /p confirm="Продолжить? (Y/N): "
if /i "%confirm%" NEQ "Y" goto :eof
echo.
echo Запуск старого сервера...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001 (старый локальный)
echo.
start cmd /k "node server/index.js"
timeout /t 2 /nobreak >nul
npx vite
goto end

:fix
cls
echo ════════════════════════════════════════════════════════════════════════
echo   🔧 Исправление проблем с npm
echo ════════════════════════════════════════════════════════════════════════
echo.
echo Запуск автоматического исправления...
echo.
call FIX-NPM-CACHE.bat
goto end

:end
echo.
pause
