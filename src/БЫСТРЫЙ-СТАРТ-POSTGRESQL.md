# 🚀 Быстрый старт с PostgreSQL

## ⚡ За 5 минут до запуска

### 1️⃣ Установите PostgreSQL (если ещё не установлен)

**Windows**:
- Скачайте: https://www.postgresql.org/download/windows/
- Запустите установщик
- **ЗАПОМНИТЕ ПАРОЛЬ** для пользователя `postgres`
- Порт: `5432` (по умолчанию)

**macOS**:
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Linux**:
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

### 2️⃣ Создайте базу данных

Откройте командную строку и выполните:

```bash
# Войдите в PostgreSQL
psql -U postgres

# Введите пароль, который задали при установке
# Создайте базу данных
CREATE DATABASE music_teacher_website;

# Выйдите
\q
```

---

### 3️⃣ Настройте проект

**Отредактируйте файл `.env`** (в корне проекта):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=ВАШ_ПАРОЛЬ_ЗДЕСЬ  ← ИЗМЕНИТЕ ЭТО!
DB_NAME=music_teacher_website

PORT=3001
ADMIN_PASSWORD=admin
```

**ВАЖНО**: Замените `ВАШ_ПАРОЛЬ_ЗДЕСЬ` на пароль PostgreSQL!

---

### 4️⃣ Установите зависимости и создайте таблицы

```bash
# Удалите старые зависимости (если были)
rmdir /s /q node_modules

# Установите новые
npm install

# Создайте таблицы и демо-данные
npm run setup
```

---

### 5️⃣ Запустите проект

```bash
npm run dev
```

**Или используйте:**
```bash
START-POSTGRESQL.bat
```

---

## ✅ Проверьте работу

- **Сайт**: http://localhost:5173
- **API**: http://localhost:3001/api
- **Админ**: 3 клика на логотип, пароль: `admin`

---

## 🆘 Проблемы?

### "password authentication failed"
→ Проверьте пароль в `.env`

### "database does not exist"
→ Создайте базу: `CREATE DATABASE music_teacher_website;`

### "connection refused"
→ Запустите PostgreSQL:
- **Windows**: Пуск → Службы → PostgreSQL → Запустить
- **macOS**: `brew services start postgresql@16`
- **Linux**: `sudo systemctl start postgresql`

---

## 📖 Подробная инструкция

Смотрите: `POSTGRESQL-УСТАНОВКА.md`

---

## 🎉 Всё!

Теперь проект работает с профессиональной базой данных PostgreSQL!
