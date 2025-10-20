#!/bin/bash

echo "==============================================="
echo "  Установка сайта музыкального руководителя"
echo "==============================================="
echo ""

# Проверка Node.js
echo "🔍 Проверка Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен!"
    echo ""
    echo "Установите Node.js одним из способов:"
    echo ""
    echo "macOS (через Homebrew):"
    echo "  brew install node"
    echo ""
    echo "Linux (Ubuntu/Debian):"
    echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    echo ""
    echo "Или скачайте с https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js установлен"
node --version
echo ""

# Установка зависимостей
echo "📦 Установка зависимостей..."
echo "Это может занять несколько минут..."
npm install
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Ошибка при установке зависимостей"
    exit 1
fi
echo ""

# Создание БД
echo "🗄️ Создание базы данных..."
npm run setup
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Ошибка при создании базы данных"
    exit 1
fi
echo ""

echo "==============================================="
echo "  ✅ Установка завершена успешно!"
echo "==============================================="
echo ""
echo "Для запуска сайта используйте команду:"
echo "  npm run dev"
echo ""
echo "Или запустите файл: ./start-mac-linux.sh"
echo ""
echo "Админ-панель:"
echo "  - Кликните 3 раза на логотип"
echo "  - Пароль: admin"
echo ""
