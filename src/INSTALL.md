# 📥 Инструкция по установке

## Шаг 1: Установка Node.js

### Windows:
1. Скачайте установщик с официального сайта: https://nodejs.org/
2. Выберите версию **LTS (рекомендуется)** - например, 20.x.x
3. Запустите установщик и следуйте инструкциям
4. Проверьте установку, открыв командную строку (CMD) и введя:
```bash
node --version
npm --version
```

### macOS:
1. Установите через Homebrew:
```bash
brew install node
```

Или скачайте с https://nodejs.org/

2. Проверьте установку:
```bash
node --version
npm --version
```

### Linux (Ubuntu/Debian):
```bash
# Обновите систему
sudo apt update

# Установите Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверьте установку
node --version
npm --version
```

---

## Шаг 2: Скачивание проекта

### Вариант A: Через Git
```bash
git clone <URL-репозитория>
cd music-teacher-website
```

### Вариант B: Скачать ZIP
1. Скачайте архив проекта
2. Распакуйте в удобную папку
3. Откройте папку в терминале/командной строке

---

## Шаг 3: Установка зависимостей

Откройте терминал в папке проекта и выполните:

```bash
npm install
```

⏱️ Это может занять 2-5 минут при первой установке.

### Возможные проблемы:

**Ошибка доступа (Permission denied):**
- Windows: Запустите CMD от имени администратора
- macOS/Linux: Используйте `sudo npm install` (НЕ рекомендуется) или настройте npm: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

**Ошибка сети:**
```bash
npm config set registry https://registry.npmjs.org/
npm install
```

---

## Шаг 4: Создание базы данных

```bash
npm run setup
```

Вы увидите:
```
🗄️  Создание базы данных...
✅ Таблицы созданы
📝 Добавление демо-данных...
✅ Демо-данные добавлены
🎉 База данных успешно создана и заполнена!
```

---

## Шаг 5: Запуск проекта

```bash
npm run dev
```

Вы увидите:
```
✅ Сервер запущен на http://localhost:3001
📊 API доступен на http://localhost:3001/api

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Шаг 6: Открытие в браузере

Откройте браузер и перейдите по адресу:

🌐 **http://localhost:5173**

Готово! Сайт запущен! 🎉

---

## 🔐 Вход в админ-панель

1. Кликните **3 раза** на логотип (музыкальная нота вверху страницы)
2. Введите пароль: **admin**
3. Теперь вы можете управлять контентом сайта

---

## 🛑 Остановка сервера

Нажмите `Ctrl + C` в терминале, где запущен сервер

---

## 🔄 Перезапуск

После остановки просто снова запустите:
```bash
npm run dev
```

---

## 📝 Редактирование контента

### Через админ-панель:
- Добавляйте/удаляйте публикации
- Загружайте фото в альбомы
- Модерируйте отзывы
- Управляйте медиа-файлами

### Напрямую в БД:
Используйте любой SQLite браузер:
- **DB Browser for SQLite** (рекомендуется): https://sqlitebrowser.org/
- Откройте файл `server/database.sqlite`

---

## 🚨 Частые проблемы

### Порт 5173 уже занят
Измените порт в `vite.config.ts`:
```typescript
server: {
  port: 5174, // измените на любой свободный порт
}
```

### Порт 3001 уже занят
Измените порт в `server/index.js`:
```javascript
const PORT = 3002; // измените на любой свободный порт
```

Не забудьте также изменить в `vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3002', // новый порт
  }
}
```

### Не загружаются изображения
Убедитесь, что:
1. Сервер запущен (`npm run dev`)
2. Файлы находятся в папке `server/uploads/`
3. В браузере доступен адрес `http://localhost:3001/uploads/`

### База данных повреждена
Пересоздайте БД:
```bash
# Удалите старую БД
rm server/database.sqlite  # macOS/Linux
del server\database.sqlite  # Windows

# Создайте новую
npm run setup
```

---

## 💡 Полезные команды

```bash
# Только фронтенд (без API)
npm run dev:client

# Только бэкенд API
npm run dev:server

# Сборка для продакшена
npm run build

# Просмотр production сборки
npm run preview

# Пересоздать БД с нуля
npm run setup
```

---

## 📞 Нужна помощь?

1. Проверьте раздел "Решение проблем" в README.md
2. Убедитесь, что Node.js версии 18 или выше: `node --version`
3. Попробуйте переустановить зависимости:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Приятной работы с сайтом! 🎵**
