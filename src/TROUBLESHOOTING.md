# 🔧 Решение проблем

## ❌ Ошибка: "Missing script: setup"

### Причина:
npm не видит файл `package.json` или вы находитесь в неправильной директории.

### Решение:

#### 1. Проверьте текущую директорию

**Windows (CMD):**
```cmd
cd
```

**Windows (PowerShell):**
```powershell
pwd
```

**Mac/Linux:**
```bash
pwd
```

Должно показать путь к папке `music-teacher-website`

#### 2. Перейдите в правильную папку

```cmd
cd D:\Works\Code\music-teacher-website
```

Замените путь на ваш!

#### 3. Проверьте наличие package.json

**Windows:**
```cmd
dir package.json
```

**Mac/Linux:**
```bash
ls -la package.json
```

Если файл НЕ найден - вы в неправильной папке!

---

## 🔴 Решение через BAT-файл (Windows)

Самый простой способ:

1. Найдите файл `install-fix.bat` в папке проекта
2. **Двойной клик** на него
3. Следуйте инструкциям

Этот скрипт:
- ✅ Проверит вашу директорию
- ✅ Очистит кеш
- ✅ Переустановит зависимости
- ✅ Создаст базу данных

---

## 🔵 Ручное решение

### Шаг 1: Откройте CMD в нужной папке

**Способ 1 - Через Проводник:**
1. Откройте папку `music-teacher-website` в проводнике
2. В адресной строке введите: `cmd`
3. Нажмите Enter

**Способ 2 - Через контекстное меню:**
1. Откройте папку проекта
2. Shift + правый клик мыши
3. "Открыть окно PowerShell здесь" или "Открыть в терминале"

### Шаг 2: Проверьте package.json

```cmd
type package.json
```

Должно показать содержимое файла.

### Шаг 3: Установите зависимости

```cmd
npm install
```

### Шаг 4: Создайте БД

```cmd
npm run setup
```

---

## 🟡 Проблема: "npm не является внутренней командой"

### Причина:
Node.js не установлен или не добавлен в PATH

### Решение:

1. Скачайте Node.js: https://nodejs.org/
2. Установите версию **LTS** (рекомендуется)
3. **Перезагрузите компьютер**
4. Откройте новое окно CMD
5. Проверьте:
```cmd
node --version
npm --version
```

---

## 🟢 Проблема: Ошибки при установке зависимостей

### Решение 1: Очистка кеша

```cmd
npm cache clean --force
del package-lock.json
rmdir /s node_modules
npm install
```

### Решение 2: От имени администратора

1. Найдите CMD в меню Пуск
2. Правый клик → "Запуск от имени администратора"
3. Перейдите в папку проекта
4. Выполните `npm install`

### Решение 3: Отключите антивирус

Некоторые антивирусы блокируют установку. Временно отключите его.

---

## 🟣 Проблема: База данных не создается

### Проверка:

```cmd
dir server\database.sqlite
```

Если файл существует, удалите его:

```cmd
del server\database.sqlite
npm run setup
```

### Если ошибка при выполнении:

```cmd
node server/setup-db.js
```

Это покажет детальную ошибку.

---

## 🔴 Проблема: Порты заняты

### Ошибка: "Port 5173 is already in use"

**Решение 1:** Закройте другие Vite проекты

**Решение 2:** Измените порт

Откройте `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 5174, // Измените на любой свободный порт
  },
})
```

### Ошибка: "Port 3001 is already in use"

Откройте `server/index.js`:

```javascript
const PORT = 3002; // Измените порт
```

---

## 🟠 Полная переустановка (последняя мера)

### Windows:

```cmd
@echo off

REM Удаление всех установленных файлов
rmdir /s /q node_modules
del /f /q package-lock.json
del /f /q server\database.sqlite

REM Очистка кеша
npm cache clean --force

REM Переустановка
npm install
npm run setup
npm run dev
```

Сохраните как `reinstall.bat` и запустите.

### Mac/Linux:

```bash
#!/bin/bash

# Удаление
rm -rf node_modules
rm -f package-lock.json
rm -f server/database.sqlite

# Очистка кеша
npm cache clean --force

# Переустановка
npm install
npm run setup
npm run dev
```

Сохраните как `reinstall.sh`, сделайте исполняемым:
```bash
chmod +x reinstall.sh
./reinstall.sh
```

---

## 📋 Чек-лист диагностики

Проверьте по порядку:

- [ ] Node.js установлен (`node --version`)
- [ ] npm работает (`npm --version`)
- [ ] Вы в папке проекта (`dir package.json`)
- [ ] package.json существует
- [ ] Нет папки node_modules (если есть - удалите)
- [ ] Нет package-lock.json (если есть - удалите)
- [ ] Интернет подключен
- [ ] Антивирус не блокирует
- [ ] Есть права на запись в папку

---

## 🆘 Быстрая помощь

### Минимальная последовательность команд:

```cmd
REM 1. Перейдите в папку проекта
cd D:\Works\Code\music-teacher-website

REM 2. Проверьте package.json
type package.json

REM 3. Если файл найден:
npm install
npm run setup
npm run dev

REM 4. Откройте браузер:
start http://localhost:5173
```

---

## 📞 Если ничего не помогло

### Соберите информацию для диагностики:

```cmd
echo === Версии ===
node --version
npm --version

echo === Текущая папка ===
cd

echo === Файлы ===
dir

echo === package.json ===
type package.json

echo === Ошибки npm ===
npm run setup
```

Скопируйте весь вывод и отправьте разработчику.

---

## 💡 Частые ошибки пользователей

### ❌ "Я скачал только код без node_modules"
✅ Это нормально! `node_modules` создается при `npm install`

### ❌ "У меня нет package.json"
✅ Вы скачали не ту папку. Нужна корневая папка проекта.

### ❌ "npm install ничего не делает"
✅ Проверьте подключение к интернету. npm загружает пакеты из сети.

### ❌ "Скачал проект, а он не работает"
✅ Нужно выполнить 3 команды: `npm install`, `npm run setup`, `npm run dev`

### ❌ "Двойной клик на package.json ничего не делает"
✅ Это файл конфигурации, не программа. Используйте CMD!

---

## 🎯 Правильная последовательность действий

```
1. Скачать/распаковать проект
   ↓
2. Открыть CMD в папке проекта
   ↓
3. npm install (первый раз)
   ↓
4. npm run setup (первый раз)
   ↓
5. npm run dev (каждый раз при запуске)
   ↓
6. Открыть http://localhost:5173
```

---

**Удачи в решении проблемы! 🚀**
