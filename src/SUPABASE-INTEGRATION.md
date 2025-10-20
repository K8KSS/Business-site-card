# 🚀 Интеграция с Supabase - Полное руководство

## ✅ Что было сделано

Ваш проект успешно интегрирован с **Supabase** - облачной платформой для backend.

### Преимущества Supabase:

- ✅ **Облачная база данных PostgreSQL** - не нужно устанавливать локально
- ✅ **Хранилище файлов (Storage)** - для фото, видео, аудио, документов
- ✅ **Автоматическое масштабирование** - работает при любой нагрузке
- ✅ **Бесплатный план** - до 500 МБ хранилища и 2 ГБ трафика
- ✅ **Глобальная доступность** - сайт работает из любой точки мира
- ✅ **Безопасность** - защищённые API ключи

---

## 📦 Что установлено

### Backend (Supabase Edge Functions)

**Файл:** `/supabase/functions/server/index.tsx`

Полностью функциональный backend на Hono с:
- ✅ API для всех разделов сайта
- ✅ Загрузка файлов в Supabase Storage
- ✅ Автоматическое создание bucket для файлов
- ✅ Демо-данные при первом запуске
- ✅ CORS настроен для всех запросов

### Frontend утилиты

**Файл:** `/utils/supabase/client.tsx`

Готовые функции для работы с API:
```typescript
import { publicationsApi, uploadFile } from './utils/supabase/client';

// Получить публикации
const publications = await publicationsApi.getAll('Конспекты занятий');

// Загрузить файл
const { url } = await uploadFile(file);
```

### Демо-данные

**Файл:** `/supabase/functions/server/init-demo-data.tsx`

Автоматически создаёт:
- 3 публикации
- 2 альбома
- 3 достижения
- 2 портфолио
- 2 отзыва
- 2 аудио трека
- 2 видео

---

## 🔑 Ваши Supabase ключи

**Project ID:** `oqazxfewxttctehgftuy`

**Supabase URL:** `https://oqazxfewxttctehgftuy.supabase.co`

**Anon Key:** (публичный ключ, используется на фронтенде)

**Ключи уже настроены в файле:** `/utils/supabase/info.tsx`

⚠️ **Не изменяйте этот файл!** Он автоматически генерируется.

---

## 🌐 API Endpoints

### Base URL
```
https://oqazxfewxttctehgftuy.supabase.co/functions/v1/make-server-322de762
```

### Публикации

```
GET    /api/publications              # Список публикаций
GET    /api/publications/:id           # Одна публикация
POST   /api/publications               # Создать публикацию
PUT    /api/publications/:id           # Обновить публикацию
DELETE /api/publications/:id           # Удалить публикацию
```

### Альбомы

```
GET    /api/albums                     # Список альбомов
POST   /api/albums                     # Создать альбом
POST   /api/albums/:id/photos          # Добавить фото
DELETE /api/albums/:id                 # Удалить альбом
```

### Достижения

```
GET    /api/achievements               # Список достижений
POST   /api/achievements               # Создать достижение
DELETE /api/achievements/:id           # Удалить достижение
```

### Портфолио

```
GET    /api/portfolio                  # Список дипломов
POST   /api/portfolio                  # Создать диплом
DELETE /api/portfolio/:id              # Удалить диплом
```

### Отзывы

```
GET    /api/reviews                    # Список отзывов
POST   /api/reviews                    # Создать отзыв
PUT    /api/reviews/:id/approve        # Одобрить отзыв
PUT    /api/reviews/:id/like           # Лайкнуть отзыв
DELETE /api/reviews/:id                # Удалить отзыв
```

### Сообщения

```
GET    /api/messages                   # Список сообщений
POST   /api/messages                   # Создать сообщение
PUT    /api/messages/:id/read          # Отметить прочитанным
DELETE /api/messages/:id               # Удалить сообщение
```

### Аудио

```
GET    /api/audio                      # Список аудио
POST   /api/audio                      # Создать аудио
DELETE /api/audio/:id                  # Удалить аудио
```

### Видео

```
GET    /api/videos                     # Список видео
POST   /api/videos                     # Создать видео
PUT    /api/videos/:id/view            # Увеличить просмотры
DELETE /api/videos/:id                 # Удалить видео
```

### Админ

```
POST   /api/admin/login                # Вход в админку
GET    /api/stats                      # Статистика сайта
```

### Файлы

```
POST   /api/upload                     # Загрузить файл
GET    /api/files/:path                # Получить signed URL
```

---

## 💻 Примеры использования

### Получить все публикации

```typescript
import { publicationsApi } from './utils/supabase/client';

const publications = await publicationsApi.getAll();
console.log(publications);
```

### Создать публикацию

```typescript
import { publicationsApi } from './utils/supabase/client';

const newPublication = await publicationsApi.create({
  title: 'Новая публикация',
  description: 'Описание',
  category: 'Конспекты занятий',
  image: '',
  file_url: null,
});
```

### Загрузить файл

```typescript
import { uploadFile } from './utils/supabase/client';

const file = event.target.files[0]; // из input type="file"
const { url, path } = await uploadFile(file);

console.log('File URL:', url);
console.log('File path:', path);
```

### Получить отзывы только со статусом "approved"

```typescript
import { reviewsApi } from './utils/supabase/client';

const approvedReviews = await reviewsApi.getAll('approved');
```

### Войти в админ-панель

```typescript
import { adminApi } from './utils/supabase/client';

const result = await adminApi.login('admin');
if (result.success) {
  console.log('Logged in!');
}
```

---

## 📁 Хранилище файлов (Storage)

### Bucket

Автоматически создаётся bucket: `make-322de762-files`

**Настройки:**
- Приватный (требует signed URLs)
- Максимальный размер файла: 50 МБ
- Поддерживаемые типы: все

### Загрузка файлов

```typescript
// В React компоненте
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  try {
    const { url } = await uploadFile(file);
    console.log('Uploaded file URL:', url);
    // Сохранить url в публикацию, альбом и т.д.
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Типы файлов

Поддерживаются все типы:
- **Изображения:** JPG, PNG, GIF, WEBP
- **Документы:** PDF, DOCX, DOC, XLS, XLSX
- **Аудио:** MP3, WAV, OGG
- **Видео:** MP4, WEBM (рекомендуется использовать VK iframe)

---

## 🗄️ База данных

### KV Store

Используется таблица `kv_store_322de762` для хранения всех данных.

**Структура:**
```sql
CREATE TABLE kv_store_322de762 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

### Ключи в базе

Данные хранятся с префиксами:

- `publication:*` - Публикации
- `album:*` - Альбомы
- `achievement:*` - Достижения
- `portfolio:*` - Портфолио
- `review:*` - Отзывы
- `message:*` - Сообщения
- `audio:*` - Аудио
- `video:*` - Видео

### Просмотр данных

Вы можете просмотреть данные в Supabase Dashboard:

1. Откройте: https://supabase.com/dashboard/project/oqazxfewxttctehgftuy
2. Перейдите в раздел **Database** → **Tables**
3. Выберите таблицу `kv_store_322de762`

---

## 🔐 Безопасность

### API ключи

- **Public Anon Key** - используется на фронтенде, безопасен
- **Service Role Key** - используется только на backend, никогда не показывайте его

### Пароль админки

По умолчанию: `admin`

**Изменить пароль:**

В Supabase Dashboard:
1. Перейдите в **Edge Functions** → **make-server-322de762**
2. Перейдите в **Secrets**
3. Добавьте переменную `ADMIN_PASSWORD` с новым паролем

---

## 🚀 Запуск проекта

Проект готов к работе! Просто запустите:

```bash
npm run dev:client
```

Или используйте:
```
SIMPLE-START.bat → Опция 1
```

Backend уже работает на Supabase, локальный сервер не нужен!

---

## 📊 Статистика использования

### Проверить лимиты

1. Откройте Supabase Dashboard
2. Перейдите в **Settings** → **Usage**

**Бесплатный план включает:**
- ✅ 500 МБ хранилища
- ✅ 2 ГБ трафика в месяц
- ✅ 500,000 Edge Function вызовов
- ✅ Неограниченное количество API запросов

---

## 🔄 Миграция данных

### Из локального PostgreSQL в Supabase

Если у вас были данные в локальном PostgreSQL, их можно перенести:

1. Экспортируйте данные из локальной БД
2. Создайте публикации/альбомы/и т.д. через API
3. Используйте функцию импорта в админ-панели

### Ручная миграция

```typescript
// Пример миграции публикаций
const localPublications = [/* ваши данные */];

for (const pub of localPublications) {
  await publicationsApi.create(pub);
}
```

---

## 🛠️ Разработка

### Обновление backend

Файл backend: `/supabase/functions/server/index.tsx`

После изменений:
1. Сохраните файл
2. Figma Make автоматически развернёт изменения
3. Обновите страницу

### Добавление нового API endpoint

```typescript
// В /supabase/functions/server/index.tsx

app.get("/make-server-322de762/api/custom", async (c) => {
  try {
    // Ваша логика
    return c.json({ message: 'Custom endpoint' });
  } catch (error) {
    return c.json({ error: 'Error' }, 500);
  }
});
```

---

## ❓ Частые вопросы

### Где хранятся файлы?

В Supabase Storage, bucket `make-322de762-files`.

### Как увеличить лимит хранилища?

Перейдите на платный план в Supabase Dashboard.

### Можно ли использовать свою базу данных?

Нет, в Figma Make используется только Supabase KV Store.

### Как сбросить все данные?

В Supabase Dashboard:
1. Database → Tables → `kv_store_322de762`
2. Удалите все записи
3. Перезапустите Edge Function для создания демо-данных

### Как изменить Admin Password?

В Supabase Dashboard:
1. Edge Functions → Secrets
2. Добавьте `ADMIN_PASSWORD` с новым значением

---

## 📞 Поддержка

### Supabase Dashboard

https://supabase.com/dashboard/project/oqazxfewxttctehgftuy

### Документация Supabase

https://supabase.com/docs

### Логи Edge Functions

1. Откройте Dashboard
2. Edge Functions → make-server-322de762
3. Перейдите в **Logs**

---

## ✅ Чек-лист готовности

- [x] Backend развёрнут на Supabase Edge Functions
- [x] Storage bucket создан автоматически
- [x] Демо-данные инициализированы
- [x] API endpoints работают
- [x] Загрузка файлов настроена
- [x] Frontend утилиты готовы
- [x] Документация создана

---

**Статус:** ✅ ПОЛНОСТЬЮ ГОТОВО К РАБОТЕ!

**Ваш проект работает на Supabase и готов к развёртыванию!** 🚀
