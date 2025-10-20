# 📂 Структура проекта

```
music-teacher-website/
│
├── 📁 components/              # React компоненты
│   ├── 📁 ui/                 # UI компоненты (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ... (все UI компоненты)
│   │
│   ├── 📁 figma/
│   │   └── ImageWithFallback.tsx  # Компонент для изображений
│   │
│   ├── AboutSection.tsx       # Раздел "О себе"
│   ├── Achievements.tsx       # Раздел "Достижения"
│   ├── AdminPanel.tsx         # Админ-панель
│   ├── AudioSection.tsx       # Аудиотека
│   ├── FeedbackForm.tsx       # Форма обратной связи
│   ├── Footer.tsx             # Подвал сайта
│   ├── Header.tsx             # Шапка с навигацией
│   ├── Hero.tsx               # Главная секция
│   ├── PhotoAlbums.tsx        # Фотоальбомы
│   ├── Portfolio.tsx          # Портфолио (дипломы)
│   ├── PublicationsSection.tsx # Публикации
│   ├── ReviewsSection.tsx     # Отзывы
│   └── VideoSection.tsx       # Видеотека
│
├── 📁 server/                 # Backend сервер
│   ├── 📁 uploads/           # Загруженные файлы
│   │   └── .gitkeep
│   │
│   ├── index.js              # Express API сервер
│   ├── setup-db.js           # Скрипт создания БД
│   └── database.sqlite       # База данных SQLite (создается автоматически)
│
├── 📁 styles/                # Стили
│   └── globals.css           # Глобальные CSS стили + Tailwind
│
├── 📁 public/                # Статические файлы
│   └── music-icon.svg        # Иконка сайта
│
├── 📁 guidelines/            # Документация
│   └── Guidelines.md
│
├── App.tsx                   # Главный компонент приложения
├── main.tsx                  # Точка входа React
├── index.html                # HTML шаблон
│
├── 📄 Конфигурационные файлы
├── package.json              # Зависимости и скрипты
├── vite.config.ts           # Конфигурация Vite
├── tsconfig.json            # Конфигурация TypeScript
├── tsconfig.node.json       # TypeScript для Node.js
├── .gitignore               # Игнорируемые файлы для Git
├── .env.example             # Пример переменных окружения
│
├── 📄 Документация
├── README.md                # Основная документация
├── INSTALL.md               # Инструкция по установке
├── USER_GUIDE.md            # Руководство пользователя
├── PROJECT_STRUCTURE.md     # Этот файл
├── QUICKSTART.txt           # Быстрый старт
├── Attributions.md          # Авторство
│
├── 📄 Скрипты установки
├── setup-windows.bat        # Установка для Windows
├── start-windows.bat        # Запуск для Windows
├── setup-mac-linux.sh       # Установка для Mac/Linux
├── start-mac-linux.sh       # Запуск для Mac/Linux
└── check-system.js          # Проверка системы
```

---

## 🎯 Назначение основных файлов

### Frontend (Клиентская часть)

#### Главные файлы:
- **App.tsx** - Корневой компонент, управление навигацией и состоянием
- **main.tsx** - Инициализация React приложения
- **index.html** - HTML шаблон

#### Компоненты разделов:
- **Header.tsx** - Навигационная панель с кнопками разделов
- **Hero.tsx** - Главная страница с приветствием
- **AboutSection.tsx** - Информация о педагоге
- **PublicationsSection.tsx** - Список публикаций с поиском и фильтрами
- **PhotoAlbums.tsx** - Галерея фотоальбомов с лайтбоксом
- **Achievements.tsx** - Достижения и награды
- **Portfolio.tsx** - Дипломы и сертификаты
- **ReviewsSection.tsx** - Отзывы с формой добавления
- **FeedbackForm.tsx** - Форма обратной связи
- **AudioSection.tsx** - Аудиоплеер с плейлистом
- **VideoSection.tsx** - Видеоплеер с галереей
- **AdminPanel.tsx** - Панель администратора
- **Footer.tsx** - Подвал сайта

#### UI компоненты (components/ui/):
Готовые переиспользуемые компоненты от shadcn/ui:
- Кнопки, поля ввода
- Диалоги, модальные окна
- Табы, аккордеоны
- Слайдеры, чекбоксы
- И многое другое

### Backend (Серверная часть)

#### server/index.js
Express API сервер с endpoints для:
- Публикаций
- Альбомов и фотографий
- Достижений
- Портфолио
- Отзывов
- Сообщений
- Аудио и видео
- Загрузки файлов

#### server/setup-db.js
Скрипт для создания и заполнения базы данных:
- Создание таблиц
- Вставка демо-данных
- Настройка индексов

#### server/database.sqlite
SQLite база данных с таблицами:
- publications
- albums
- photos
- achievements
- portfolio
- reviews
- messages
- audio
- videos

### Конфигурация

#### package.json
- Зависимости проекта
- Скрипты для запуска и сборки
- Метаданные проекта

#### vite.config.ts
- Настройки Vite
- Прокси для API
- Алиасы путей

#### tsconfig.json
- Настройки TypeScript
- Правила компиляции
- Пути модулей

### Стили

#### styles/globals.css
- Tailwind CSS v4
- Переменные цветов
- Базовая типографика
- Глобальные стили

---

## 🔄 Поток данных

```
┌─────────────┐
│   Browser   │
│  (React UI) │
└──────┬──────┘
       │ HTTP Request
       ↓
┌─────────────┐
│    Vite     │
│   (Proxy)   │
└──────┬──────┘
       │ Proxy to /api
       ↓
┌─────────────┐
│   Express   │
│   Server    │
└──────┬──────┘
       │ SQL Query
       ↓
┌─────────────┐
│   SQLite    │
│  Database   │
└─────────────┘
```

---

## 📦 Важные зависимости

### Frontend:
- **react** - UI библиотека
- **motion** - Анимации
- **lucide-react** - Иконки
- **@radix-ui** - Примитивы UI компонентов
- **tailwindcss** - CSS фреймворк

### Backend:
- **express** - Web сервер
- **better-sqlite3** - SQLite драйвер
- **multer** - Загрузка файлов
- **cors** - CORS middleware

### Dev Tools:
- **vite** - Сборщик и dev сервер
- **typescript** - Типизация
- **concurrently** - Параллельный запуск команд

---

## 🗄️ Схема базы данных

### publications
```sql
id, title, description, category, image, file_url, views, date
```

### albums
```sql
id, title, cover, date
```

### photos
```sql
id, album_id, url
```

### achievements
```sql
id, title, year, type, icon, color
```

### portfolio
```sql
id, title, organization, category, image, views, date
```

### reviews
```sql
id, author, role, text, rating, status, likes, date
```

### messages
```sql
id, name, email, phone, subject, message, status, date
```

### audio
```sql
id, title, artist, category, file_url, duration, color
```

### videos
```sql
id, title, description, category, thumbnail, video_url, duration, views, date
```

---

## 🎨 Система дизайна

### Цветовая палитра:
- **Pink**: #ec4899 → Акценты
- **Purple**: #a855f7 → Основной
- **Blue**: #3b82f6 → Дополнительный
- **Градиенты**: pink → purple → blue

### Закругления:
- Кнопки: `rounded-full`
- Карточки: `rounded-3xl`
- Поля ввода: `rounded-full`

### Анимации:
- Hover эффекты: scale, rotate
- Плавающие элементы: floating notes
- Переходы: fade, slide, scale

---

## 📝 Где что редактировать

### Изменить текст "О себе":
`components/AboutSection.tsx`

### Добавить категорию публикаций:
`components/PublicationsSection.tsx` - массив `categories`

### Изменить пароль админки:
`server/index.js` - endpoint `/api/admin/login`

### Настроить порты:
- Frontend: `vite.config.ts`
- Backend: `server/index.js`

### Добавить демо-данные:
`server/setup-db.js`

### Изменить цвета:
`styles/globals.css` - CSS переменные

---

**Для детального понимания смотрите код файлов с комментариями!**
