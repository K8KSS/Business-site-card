# 🎵 Сайт музыкального руководителя

> Современный веб-сайт для музыкального руководителя детского сада с полной системой управления контентом на **Supabase**.

## ✨ Особенности

- ✅ **Облачный backend** - Supabase Edge Functions (не требует локального сервера)
- ✅ **База данных в облаке** - Supabase KV Store
- ✅ **Хранилище файлов** - Supabase Storage для фото, видео, аудио, документов
- ✅ Публикации с 10 категориями
- ✅ Фотоальбомы с галереей
- ✅ Портфолио с дипломами
- ✅ Достижения на временной шкале
- ✅ Отзывы с модерацией
- ✅ Обратная связь
- ✅ Аудио плеер
- ✅ Видео плеер (VK iframe)
- ✅ Скрытая админ-панель
- ✅ Загрузка и скачивание файлов

## 🚀 Быстрый старт

### 1. Установите зависимости

```bash
npm install
```

### 2. Запустите проект

**Локально (только этот компьютер):**
```bash
npm run dev:client
```
Откроется: `http://localhost:5173`

**С доступом из сети (телефон, планшет, другой ПК):**

Дважды кликните файл:
```
ЗАПУСТИТЬ-С-ДОСТУПОМ-ИЗ-СЕТИ.bat
```
Или используйте ту же команду (адрес будет показан в консоли):
```bash
npm run dev:client
```
Откроется: `http://192.168.x.x:5173` (адрес для других устройств)

### 3. Откройте в браузере

**На этом компьютере:**
```
http://localhost:5173
```

**На другом устройстве (в той же Wi-Fi сети):**
```
http://192.168.x.x:5173
```
(замените на ваш реальный IP, показанный в консоли)

**Готово!** Backend уже работает на Supabase ☁️

---

## 🌍 Развертывание в интернете

Чтобы сайт был доступен по ссылке с любого места:

### Vercel (рекомендуется - бесплатно):
```bash
npm install -g vercel
vercel login
vercel --prod
```
Получите ссылку: `https://your-site.vercel.app`

### Netlify (тоже бесплатно):
```bash
npm run build
# Перетащите папку dist на netlify.com
```

📚 **Подробнее:** см. `РАЗВЕРТЫВАНИЕ-В-ИНТЕРНЕТЕ.md`

## 🔐 Админ-панель

**Доступ:** Нажмите `Ctrl + Shift + A`  
**Пароль:** `admin` (по умолчанию)

**Изменить пароль:**
1. Откройте [Supabase Dashboard](https://supabase.com/dashboard/project/oqazxfewxttctehgftuy)
2. Edge Functions → Secrets
3. Добавьте `ADMIN_PASSWORD` с новым значением

## 🌐 Supabase

**Project ID:** `oqazxfewxttctehgftuy`

**API URL:** `https://oqazxfewxttctehgftuy.supabase.co/functions/v1/make-server-322de762`

**Dashboard:** [https://supabase.com/dashboard/project/oqazxfewxttctehgftuy](https://supabase.com/dashboard/project/oqazxfewxttctehgftuy)

## 📚 Документация

### Запуск и развертывание
- ⚡ [⚡-БЫСТРАЯ-СПРАВКА.md](⚡-БЫСТРАЯ-СПРАВКА.md) - **НАЧНИТЕ ОТСЮДА** - Самая важная информация
- 🚀 [КАК-ЗАПУСТИТЬ-САЙТ.md](КАК-ЗАПУСТИТЬ-САЙТ.md) - Подробная инструкция по локальному запуску
- 🌍 [РАЗВЕРТЫВАНИЕ-В-ИНТЕРНЕТЕ.md](РАЗВЕРТЫВАНИЕ-В-ИНТЕРНЕТЕ.md) - Как разместить в интернете

### Supabase
- 📖 [SUPABASE-QUICK-START.md](SUPABASE-QUICK-START.md) - Быстрый старт с Supabase
- 📖 [SUPABASE-INTEGRATION.md](SUPABASE-INTEGRATION.md) - Полное руководство по Supabase
- 📖 [МИГРАЦИЯ-НА-SUPABASE.md](МИГРАЦИЯ-НА-SUPABASE.md) - Как была выполнена миграция
- 📖 [SUPABASE-ГОТОВО.md](SUPABASE-ГОТОВО.md) - Что было сделано

## 🛠️ Технологии

### Frontend
- React 18.3
- TypeScript 5.6
- Vite 6.0
- Tailwind CSS 3.4
- ShadCN UI
- Motion (Framer Motion)
- Lucide React

### Backend (Supabase)
- Deno runtime
- Hono web framework
- Supabase Edge Functions
- Supabase KV Store
- Supabase Storage

## 📦 Структура проекта

```
music-teacher-website/
├── components/              # React компоненты
├── supabase/
│   └── functions/server/    # Backend на Supabase
│       ├── index.tsx        # Главный сервер
│       ├── init-demo-data.tsx  # Демо-данные
│       └── kv_store.tsx     # База данных (автоген)
├── utils/supabase/          # Утилиты Supabase
│   ├── client.tsx           # API клиент
│   └── info.tsx             # Ключи (автоген)
├── styles/                  # Стили
└── App.tsx                  # Главный компонент
```

## 💡 Важно знать

### ❌ Что НЕ нужно

- ❌ Установка PostgreSQL
- ❌ Запуск локального сервера (`node server/index.js`)
- ❌ Настройка локальной базы данных

### ✅ Что нужно

- ✅ Интернет соединение (для Supabase)
- ✅ Node.js 18+ (для фронтенда)
- ✅ Запуск только фронтенда (`npm run dev:client`)

## 🎯 Функции

### Публикации
10 категорий: Конспекты, Сценарии, Картотека, Консультации для родителей, Консультации для педагогов, Мастер-классы, Проекты, Презентации, Статьи, Другое

### Файлы
- **Форматы:** JPG, PNG, PDF, DOCX, MP3, MP4 и другие
- **Макс. размер:** 50 МБ
- **Хранилище:** Supabase Storage (облако)

### Демо-данные
При первом запуске автоматически создаются примеры контента для всех разделов.

## 📊 API Examples

```typescript
import { publicationsApi, uploadFile } from './utils/supabase/client';

// Получить публикации
const publications = await publicationsApi.getAll('Конспекты занятий');

// Создать публикацию
await publicationsApi.create({
  title: 'Новая публикация',
  description: 'Описание',
  category: 'Конспекты занятий',
});

// Загрузить файл
const { url } = await uploadFile(file);
```

## 💰 Supabase план

**Бесплатный план включает:**
- 500 МБ базы данных
- 1 ГБ хранилища файлов
- 2 ГБ трафика в месяц
- 500,000 Edge Function запросов

Этого достаточно для большинства проектов!

## 🆘 Поддержка

**Если что-то не работает:**
1. Проверьте интернет соединение
2. Убедитесь что запущен `npm run dev:client` (не `npm run dev`)
3. Проверьте консоль браузера (F12)
4. Посмотрите логи в [Supabase Dashboard](https://supabase.com/dashboard/project/oqazxfewxttctehgftuy)

## 📄 Лицензия

Образовательный проект

## 👤 Автор

Создано для Парфировой Елены Юрьевны - Музыкальный руководитель детского сада

---

**Статус:** ✅ Готов к использованию  
**Backend:** ☁️ Supabase  
**Frontend:** ⚛️ React + TypeScript