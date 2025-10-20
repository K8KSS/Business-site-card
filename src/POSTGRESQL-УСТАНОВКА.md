# 🐘 Миграция на PostgreSQL - Полная инструкция

## ✅ Что изменилось:

### 1. База данных
- **Было**: SQLite (файл database.sqlite)
- **Стало**: PostgreSQL (полноценная СУБД)

### 2. Преимущества PostgreSQL:
- ✅ Более надежная и производительная
- ✅ Лучше подходит для продакшена
- ✅ Поддержка множественных подключений
- ✅ Расширенные возможности SQL
- ✅ Лучшая масштабируемость

---

## 📥 Шаг 1: Установка PostgreSQL

### Windows:

1. **Скачайте PostgreSQL** с официального сайта:
   ```
   https://www.postgresql.org/download/windows/
   ```

2. **Установите PostgreSQL**:
   - Запустите установщик
   - При установке запомните пароль для пользователя `postgres`
   - Порт оставьте по умолчанию: `5432`
   - Установите все компоненты (включая pgAdmin)

3. **Проверьте установку**:
   ```bash
   psql --version
   ```

### macOS:

```bash
# Используя Homebrew
brew install postgresql@16
brew services start postgresql@16
```

### Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## ⚙️ Шаг 2: Настройка базы данных

### Вариант 1: Автоматическое создание (рекомендуется)

1. **Откройте pgAdmin** или командную строку PostgreSQL:
   ```bash
   psql -U postgres
   ```

2. **Создайте базу данных**:
   ```sql
   CREATE DATABASE music_teacher_website;
   ```

3. **Выйдите из psql**:
   ```
   \q
   ```

### Вариант 2: Через командную строку Windows

```bash
# Войдите в PostgreSQL
psql -U postgres

# Создайте базу данных
CREATE DATABASE music_teacher_website;

# Выйдите
\q
```

---

## 🔧 Шаг 3: Настройка проекта

### 1. Отредактируйте файл `.env`:

Откройте файл `.env` в корне проекта и измените параметры:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=ваш_пароль_postgres
DB_NAME=music_teacher_website

# Server Configuration
PORT=3001

# Admin Password
ADMIN_PASSWORD=admin
```

**ВАЖНО**: Замените `ваш_пароль_postgres` на пароль, который вы задали при установке PostgreSQL!

---

## 📦 Шаг 4: Установка зависимостей

```bash
# Удалите старые node_modules
rmdir /s /q node_modules

# Установите новые зависимости (теперь с PostgreSQL)
npm install
```

---

## 🗄️ Шаг 5: Создание таблиц и демо-данных

```bash
npm run setup
```

Вы должны увидеть:
```
🗄️  Создание базы данных PostgreSQL...
📍 Подключение к: localhost:5432
🗑️  Удаление существующих таблиц...
📝 Создание таблиц...
✅ Таблицы созданы
📝 Добавление демо-данных...
✅ Демо-данные добавлены
🎉 База данных успешно создана и заполнена!
```

---

## 🚀 Шаг 6: Запуск проекта

```bash
npm run dev
```

Откройте браузер: `http://localhost:5173`

---

## 🛠️ Устранение проблем

### Ошибка: "password authentication failed"

**Решение**: Проверьте пароль в файле `.env`

### Ошибка: "database does not exist"

**Решение**: Создайте базу данных вручную:
```bash
psql -U postgres
CREATE DATABASE music_teacher_website;
\q
```

### Ошибка: "connection refused"

**Решение**: Убедитесь, что PostgreSQL запущен:

**Windows**:
```
Пуск → Службы → PostgreSQL → Запустить
```

**macOS**:
```bash
brew services start postgresql@16
```

**Linux**:
```bash
sudo systemctl start postgresql
```

### Ошибка: "role postgres does not exist"

**Решение**: Создайте пользователя postgres:
```bash
createuser -s postgres
```

---

## 📊 Управление базой данных

### Подключение к базе через psql:

```bash
psql -U postgres -d music_teacher_website
```

### Полезные команды psql:

```sql
-- Просмотр всех таблиц
\dt

-- Просмотр данных таблицы
SELECT * FROM publications;

-- Очистка таблицы
TRUNCATE TABLE publications RESTART IDENTITY CASCADE;

-- Выход
\q
```

### Через pgAdmin:

1. Откройте pgAdmin
2. Подключитесь к серверу (localhost)
3. Найдите базу данных `music_teacher_website`
4. Управляйте таблицами через графический интерфейс

---

## 🔄 Быстрая переустановка данных

Если нужно пересоздать все таблицы:

```bash
npm run setup
```

Скрипт автоматически:
- Удалит все существующие таблицы
- Создаст новые таблицы
- Добавит демо-данные

---

## 📝 Что изменилось в коде:

### Файлы с изменениями:

1. **`/package.json`**:
   - Убран `better-sqlite3`
   - Добавлен `pg` (PostgreSQL драйвер)
   - Добавлен `dotenv` (переменные окружения)

2. **`/server/index.js`**:
   - Полностью переписан для PostgreSQL
   - Используются параметризованные запросы ($1, $2)
   - Async/await для всех операций с БД

3. **`/server/setup-db.js`**:
   - Переписан для создания таблиц в PostgreSQL
   - Используется синтаксис PostgreSQL (SERIAL, TIMESTAMP)

4. **`/.env`** (новый файл):
   - Хранит настройки подключения к БД
   - Хранит пароль администратора

---

## ✅ Проверка работы

После запуска проверьте:

1. **Главная страница**: `http://localhost:5173`
2. **Админ-панель**: 3 клика на логотип, пароль: `admin`
3. **Публикации**: Должны отображаться 5 демо-публикаций
4. **Альбомы**: Должны отображаться 3 демо-альбома
5. **Отзывы**: Должны отображаться 3 одобренных отзыва

---

## 🎉 Готово!

Теперь ваш проект работает на PostgreSQL - профессиональной базе данных, готовой к продакшену!

Все функции работают точно так же, как и раньше, но теперь с более надежной и масштабируемой СУБД.

---

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте, что PostgreSQL запущен
2. Проверьте настройки в `.env` файле
3. Проверьте логи сервера в консоли
4. Убедитесь, что база данных создана

**Демо-доступ**:
- Админ-панель: 3 клика на логотип
- Пароль: `admin`
