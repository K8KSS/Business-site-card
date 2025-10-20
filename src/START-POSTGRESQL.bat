@echo off
chcp 65001 > nul
color 0A
cls

echo.
echo ============================================================
echo    🐘 ЗАПУСК ПРОЕКТА С POSTGRESQL
echo ============================================================
echo.

REM Проверка установки Node.js
echo [Шаг 1/5] Проверка Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ОШИБКА] Node.js не установлен!
    echo.
    echo Скачайте и установите Node.js с https://nodejs.org
    echo.
    pause
    exit /b 1
)
echo [OK] Node.js установлен
echo.

REM Проверка PostgreSQL
echo [Шаг 2/5] Проверка PostgreSQL...
psql --version >nul 2>&1
if errorlevel 1 (
    color 0E
    echo [ВНИМАНИЕ] PostgreSQL не найден в PATH
    echo.
    echo Убедитесь, что PostgreSQL установлен и запущен.
    echo Если установлен, продолжайте. Если нет - установите PostgreSQL.
    echo.
    echo Инструкция: см. файл POSTGRESQL-УСТАНОВКА.md
    echo.
    pause
) else (
    echo [OK] PostgreSQL установлен
    echo.
)

REM Проверка файла .env
echo [Шаг 3/5] Проверка настроек...
if not exist ".env" (
    color 0E
    echo [ВНИМАНИЕ] Файл .env не найден
    echo Создаю файл .env с настройками по умолчанию...
    echo.
    (
        echo # PostgreSQL Database Configuration
        echo DB_HOST=localhost
        echo DB_PORT=5432
        echo DB_USER=postgres
        echo DB_PASSWORD=postgres
        echo DB_NAME=music_teacher_website
        echo.
        echo # Server Configuration
        echo PORT=3001
        echo.
        echo # Admin Password
        echo ADMIN_PASSWORD=admin
    ) > .env
    echo [OK] Файл .env создан
    echo.
    echo ВАЖНО: Откройте файл .env и укажите правильный пароль PostgreSQL!
    echo.
    pause
) else (
    echo [OK] Файл .env существует
    echo.
)

REM Установка зависимостей
echo [Шаг 4/5] Проверка зависимостей...
if not exist "node_modules" (
    echo Устанавливаю зависимости...
    echo Это может занять 2-5 минут...
    echo.
    call npm install
    if errorlevel 1 (
        color 0C
        echo.
        echo [ОШИБКА] Не удалось установить зависимости
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Зависимости установлены
    echo.
) else (
    echo [OK] Зависимости уже установлены
    echo.
)

REM Создание базы данных
echo [Шаг 5/5] Проверка базы данных...
echo.
echo Попытка создания таблиц и демо-данных...
echo Если база не существует, создайте её вручную:
echo   psql -U postgres
echo   CREATE DATABASE music_teacher_website;
echo   \q
echo.
call npm run setup
if errorlevel 1 (
    color 0E
    echo.
    echo [ВНИМАНИЕ] Не удалось создать базу данных
    echo.
    echo Возможные причины:
    echo 1. PostgreSQL не запущен
    echo 2. База данных не создана
    echo 3. Неверный пароль в файле .env
    echo.
    echo Инструкция по устранению в файле: POSTGRESQL-УСТАНОВКА.md
    echo.
    echo Продолжить запуск? (база может быть уже создана)
    pause
)

echo.
echo ============================================================
echo    ✅ ЗАПУСК ПРИЛОЖЕНИЯ
echo ============================================================
echo.
echo 🌐 Фронтенд: http://localhost:5173
echo 🔧 Бэкенд:   http://localhost:3001
echo 🐘 База:     PostgreSQL (music_teacher_website)
echo.
echo 🔑 Админ-панель: 3 клика на логотип, пароль: admin
echo.
echo Нажмите Ctrl+C для остановки сервера
echo.
echo ============================================================
echo.

REM Запуск приложения
call npm run dev

pause
