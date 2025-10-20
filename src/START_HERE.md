# 🎵 Start Here!

## 👋 Welcome!

This is a personal website for a kindergarten music teacher.

For Russian documentation, see: **README-RU.md**

---

## ⚡ Quick Start (3 minutes)

### 🪟 Windows - EASIEST WAY:

**Double-click on file:**
```
INSTALL-NOW.bat
```

Done! The script will install everything automatically.

---

### 💻 Manual (if you already have Node.js installed):

```bash
npm install      # 1. Install dependencies
npm run setup    # 2. Create database
npm run dev      # 3. Start project
```

Open: **http://localhost:5173**

---

### ⚠️ If you get "Missing script: setup" error:

**Solution:** Run file `INSTALL-NOW.bat`

Or see: `QUICK-FIX.md`

---

## 📚 Which file to read?

### 🎯 I've never worked with such projects
👉 **Read:** `FIRST_RUN.md`
- Step-by-step instructions
- Explanation of each step
- Common problems solutions

### 💻 I want to install quickly
👉 **Read:** `QUICK-START.txt` or `INSTALL.md`
- Brief instructions
- Commands to copy
- Automatic scripts

### 📖 I need full documentation
👉 **Read:** `README.md`
- All features
- API endpoints
- Server deployment

### 👤 Я буду пользователем сайта
👉 **Читайте:** `USER_GUIDE.md`
- Как пользоваться сайтом
- Как добавлять контент
- Работа с админкой

### 🔧 Я разработчик и хочу понять структуру
👉 **Читайте:** `PROJECT_STRUCTURE.md` и `OVERVIEW.md`
- Архитектура проекта
- Технологии
- Схема работы

### 🗄️ Мне нужно работать с базой данных
👉 **Читайте:** `SQL_EXAMPLES.md`
- Примеры SQL запросов
- Структура таблиц
- Резервное копирование

### ✅ Я хочу проверить что всё работает
👉 **Читайте:** `CHECKLIST.md`
- Чек-лист проверки
- Тестирование функций
- Готовность к продакшену

---

## 🖥️ Автоматическая установка

### Windows:
Двойной клик на файл:
```
setup-windows.bat
```

### Mac/Linux:
В терминале:
```bash
chmod +x setup-mac-linux.sh
./setup-mac-linux.sh
```

---

## 📋 Список всех файлов документации

| Файл | Что внутри | Для кого |
|------|-----------|----------|
| **START_HERE.md** | Этот файл | Все |
| **QUICKSTART.txt** | Быстрый старт | Начинающие |
| **FIRST_RUN.md** | Первый запуск | Новички |
| **INSTALL.md** | Установка | Все |
| **README.md** | Полное руководство | Все |
| **USER_GUIDE.md** | Инструкция пользователя | Пользователи |
| **OVERVIEW.md** | Обзор проекта | Все |
| **PROJECT_STRUCTURE.md** | Структура | Разработчики |
| **SQL_EXAMPLES.md** | Работа с БД | Админы/Разработчики |
| **CHECKLIST.md** | Проверка готовности | Все |

---

## 🎯 Распространенные вопросы

### Что это?
Сайт для музыкального руководителя с публикациями, фото, видео, отзывами и админ-панелью.

### Зачем?
Чтобы делиться методическими материалами, фотографиями с праздников и общаться с родителями.

### Это сложно?
Нет! 3 команды - и сайт работает.

### Нужен ли интернет?
Нет, работает локально на вашем компьютере.

### Можно ли использовать на продакшене?
Да, но нужны доработки безопасности.

### Где данные?
В файле `server/database.sqlite`

### Как сделать бэкап?
Скопируйте папку `server/`

---

## 🆘 Проблемы?

### Node.js не установлен?
Скачайте с https://nodejs.org/
Выберите версию **LTS** (рекомендуется)

### Команды не работают?
Убедитесь что вы в папке проекта:
```bash
cd путь/к/music-teacher-website
```

### Ошибки при установке?
```bash
npm cache clean --force
npm install
```

### Порт занят?
Измените порт в `vite.config.ts`

---

## 🎨 Что умеет сайт?

### Для посетителей:
- 📖 Читать публикации (10 категорий)
- 📸 Смотреть фотоальбомы
- 🎵 Слушать музыку
- 🎬 Смотреть видео
- ⭐ Оставлять отзывы
- 📧 Отправлять сообщения
- 💾 Скачивать файлы

### Для администратора:
- ➕ Добавлять контент
- ✏️ Редактировать всё
- 🗑️ Удалять ненужное
- 👀 Модерировать отзывы
- 📊 Смотреть статистику
- 📤 Загружать файлы

---

## 🚀 После установки

1. **Войдите в админку:**
   - Кликните 3 раза на логотип
   - Пароль: `admin`

2. **Добавьте свой контент:**
   - Публикации
   - Фото
   - Достижения

3. **Настройте под себя:**
   - Измените текст "О себе"
   - Смените пароль админки
   - Добавьте свои категории

---

## 💾 Требования

- **Node.js** 18+ (https://nodejs.org/)
- **1 GB** свободного места
- **Любая ОС:** Windows, Mac, Linux

---

## 📞 Поддержка

Если что-то не работает:

1. 📖 Прочитайте **INSTALL.md** → раздел "Решение проблем"
2. ✅ Запустите **npm run check** для диагностики
3. 🔍 Проверьте консоль браузера (F12)
4. 📝 Посмотрите логи в терминале

---

## 🎯 Структура проекта (коротко)

```
music-teacher-website/
├── 📱 Frontend (React)
│   ├── components/       ← Компоненты
│   └── styles/          ← Стили
│
├── 🖥️ Backend (Express)
│   ├── server/index.js  ← API сервер
│   └── database.sqlite  ← База данных
│
└── 📚 Документация
    └── *.md             ← Всё что вы сейчас читаете
```

---

## ✨ Технологии

- ⚛️ **React** - интерфейс
- ⚡ **Vite** - сборка
- 🎨 **Tailwind CSS** - стили
- ✨ **Motion** - анимации
- 🚀 **Express** - API
- 💾 **SQLite** - база данных

---

## 🎉 Готовы начать?

### Вариант 1: Автоматически
```bash
# Windows: двойной клик
setup-windows.bat

# Mac/Linux: в терминале
./setup-mac-linux.sh
```

### Вариант 2: Вручную
```bash
npm install
npm run setup
npm run dev
```

### Вариант 3: Подробная инструкция
Откройте **FIRST_RUN.md**

---

## 📖 Дальше читать

После успешного запуска:

1. 👤 **USER_GUIDE.md** - как пользоваться
2. 🔧 **README.md** - полная документация
3. 🗄️ **SQL_EXAMPLES.md** - работа с данными

---

## 🔗 Полезные ссылки

После запуска (`npm run dev`) доступны:

- 🌐 **Сайт:** http://localhost:5173
- 🔌 **API:** http://localhost:3001/api
- 📊 **Статистика:** http://localhost:3001/api/stats

---

## ⏱️ Время на установку

- **Установка Node.js:** 5 минут
- **Установка зависимостей:** 2-5 минут
- **Создание БД:** 5 секунд
- **Запуск:** 5 секунд

**Всего: ~10 минут** для первого раза

---

## 🎵 Приступим!

Выберите свой путь:

- 🆕 **Новичок?** → `FIRST_RUN.md`
- ⚡ **Опытный?** → `npm install && npm run setup && npm run dev`
- 📖 **Хочу изучить?** → `README.md`

---

**Удачи! 🎉**

**Создано с ❤️ для музыкального образования детей**
