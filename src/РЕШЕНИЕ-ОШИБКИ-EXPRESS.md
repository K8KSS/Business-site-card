# ✅ Решение ошибки "Cannot find package 'express'"

## Проблема

При запуске `simple-start.bat` возникла ошибка:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express' imported from Z:\music-teacher-website\src\server\index.js
```

## Причина

1. В старом коде использовалась команда `cd server && node index.js`, которая переходила в папку `server` перед запуском
2. Node.js не мог найти пакеты, так как они находятся в корневой папке проекта в `node_modules`
3. Возможно, зависимости не были установлены

## ✅ Исправления

### 1. Исправлен файл `SIMPLE-START.bat`

**Было:**
```batch
start cmd /k "cd server && node index.js"
```

**Стало:**
```batch
start cmd /k "node server/index.js"
```

Теперь сервер запускается из корневой папки проекта, где находятся все зависимости.

### 2. Исправлен файл `start-server.bat`

**Было:**
```batch
cd server
node index.js
cd ..
```

**Стало:**
```batch
node server/index.js
```

### 3. Созданы новые файлы

- `.env` - переменные окружения с настройками базы данных
- `.env.example` - пример конфигурации
- `INSTALL-DEPENDENCIES.bat` - быстрая установка зависимостей
- `БЫСТРЫЙ-СТАРТ.md` - инструкция по запуску

## 🚀 Что делать сейчас?

### Шаг 1: Установите зависимости

**Вариант A (простой):**
Запустите файл: `INSTALL-DEPENDENCIES.bat`

**Вариант B (вручную):**
```bash
npm install
```

### Шаг 2: Запустите проект

**Вариант A (рекомендуется):**
Запустите файл: `SIMPLE-START.bat`

Выберите:
- **1** - Только фронтенд (без базы данных)
- **2** - Фронтенд + Бэкенд (с PostgreSQL)

**Вариант B (вручную):**
```bash
# Только фронтенд
npm run dev

# Или фронтенд + бэкенд (в разных терминалах)
npm run dev
node server/index.js
```

### Шаг 3 (опционально): Настройте PostgreSQL

Если хотите использовать базу данных:

1. Убедитесь что PostgreSQL установлен
2. Отредактируйте файл `.env` (установите свой пароль)
3. Запустите `setup-database.bat`
4. Запустите `SIMPLE-START.bat` → Опция 2

## 📋 Проверка

После установки зависимостей проверьте:

```bash
# Проверьте что пакеты установлены
npm list express
npm list pg
npm list react

# Если показывает версии - всё хорошо!
```

## 🎯 Теперь всё должно работать!

Структура проекта правильная:
```
music-teacher-website/
├── node_modules/          # ← Здесь все зависимости
├── server/
│   └── index.js          # ← Сервер
├── components/           # ← React компоненты
├── .env                  # ← Настройки (новый)
├── package.json          # ← Зависимости
└── SIMPLE-START.bat      # ← Исправлен!
```

Теперь при запуске `node server/index.js` из корня проекта, Node.js найдёт все пакеты в `node_modules/`.

## ❓ Если всё равно не работает

1. **Удалите папку `node_modules`**
   ```bash
   rmdir /s /q node_modules
   ```

2. **Переустановите зависимости**
   ```bash
   npm install
   ```

3. **Проверьте версию Node.js** (должна быть >= 18)
   ```bash
   node --version
   ```

4. **Попробуйте запустить вручную**
   ```bash
   node server/index.js
   ```

## 📞 Поддержка

Если ошибка всё ещё возникает, проверьте:

- ✅ Файл `.env` создан
- ✅ Папка `node_modules` существует
- ✅ Файл `package.json` на месте
- ✅ Команда запускается из корневой папки проекта
- ✅ Node.js версии 18 или новее

---

**Статус:** ✅ ИСПРАВЛЕНО
**Дата:** 20.10.2025
**Изменённые файлы:**
- `SIMPLE-START.bat`
- `start-server.bat`
- `.env` (создан)
- `.env.example` (создан)
- `INSTALL-DEPENDENCIES.bat` (создан)
