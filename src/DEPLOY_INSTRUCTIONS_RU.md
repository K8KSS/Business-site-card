# 📋 Инструкция по развертыванию Edge Functions

## ✅ Что исправлено

Проблема была в несоответствии имени Edge Function:
- ❌ Старая папка: `/supabase/functions/server/`
- ✅ Новая папка: `/supabase/functions/make-server-322de762/`
- ✅ Расширение изменено с `.tsx` на `.ts` (как требует Supabase)

## 🚀 Инструкция по деплою

### Шаг 1: Убедитесь, что Supabase CLI установлен

Проверьте установку:
```bash
supabase --version
```

Если не установлен, установите одним из способов:
```bash
# Вариант 1: через scoop
scoop install supabase

# Вариант 2: через npm
npm install -g supabase

# Вариант 3: скачать с https://github.com/supabase/cli/releases
```

### Шаг 2: Запустите скрипт деплоя

Дважды кликните на файл:
```
DEPLOY_EDGE_FUNCTIONS.bat
```

Или запустите из командной строки:
```bash
DEPLOY_EDGE_FUNCTIONS.bat
```

### Шаг 3: Следуйте инструкциям

1. Скрипт проверит наличие Supabase CLI
2. Проверит авторизацию (если нужно, откроется браузер)
3. Подключится к проекту
4. Развернет Edge Function

### Шаг 4: Проверьте деплой

После успешного деплоя функция будет доступна по адресу:
```
https://oqazxfewxttctehgftuy.supabase.co/functions/v1/make-server-322de762/health
```

## 📁 Структура Edge Function

```
/supabase/functions/make-server-322de762/
├── index.ts              # Главный файл с API endpoints
├── kv_store.ts           # Работа с базой данных
└── init-demo-data.ts     # Инициализация демо данных
```

## 🔧 API Endpoints

После деплоя доступны следующие endpoints:

### Проверка здоровья
- `GET /make-server-322de762/health`

### Публикации
- `GET /make-server-322de762/api/publications`
- `GET /make-server-322de762/api/publications/:id`
- `POST /make-server-322de762/api/publications`
- `PUT /make-server-322de762/api/publications/:id`
- `DELETE /make-server-322de762/api/publications/:id`

### Альбомы
- `GET /make-server-322de762/api/albums`
- `POST /make-server-322de762/api/albums`
- `PUT /make-server-322de762/api/albums/:id`
- `POST /make-server-322de762/api/albums/:id/photos`
- `DELETE /make-server-322de762/api/albums/:id`

### Достижения
- `GET /make-server-322de762/api/achievements`
- `POST /make-server-322de762/api/achievements`
- `DELETE /make-server-322de762/api/achievements/:id`

### Портфолио
- `GET /make-server-322de762/api/portfolio`
- `POST /make-server-322de762/api/portfolio`
- `PUT /make-server-322de762/api/portfolio/:id`
- `DELETE /make-server-322de762/api/portfolio/:id`

### Отзывы
- `GET /make-server-322de762/api/reviews`
- `POST /make-server-322de762/api/reviews`
- `PUT /make-server-322de762/api/reviews/:id/approve`
- `PUT /make-server-322de762/api/reviews/:id/like`
- `DELETE /make-server-322de762/api/reviews/:id`

### Сообщения
- `GET /make-server-322de762/api/messages`
- `POST /make-server-322de762/api/messages`
- `PUT /make-server-322de762/api/messages/:id/read`
- `DELETE /make-server-322de762/api/messages/:id`

### Аудио
- `GET /make-server-322de762/api/audio`
- `POST /make-server-322de762/api/audio`
- `DELETE /make-server-322de762/api/audio/:id`

### Видео
- `GET /make-server-322de762/api/videos`
- `POST /make-server-322de762/api/videos`
- `PUT /make-server-322de762/api/videos/:id/view`
- `DELETE /make-server-322de762/api/videos/:id`

### Страницы
- `GET /make-server-322de762/api/pages/:pageId`
- `PUT /make-server-322de762/api/pages/:pageId`

### Админ панель
- `POST /make-server-322de762/api/admin/login`
- `GET /make-server-322de762/api/stats`
- `POST /make-server-322de762/api/admin/init-data`
- `POST /make-server-322de762/api/admin/init-storage`
- `GET /make-server-322de762/api/admin/storage-status`

### Загрузка файлов
- `POST /make-server-322de762/api/upload`
- `GET /make-server-322de762/api/files/:path`

## ⚠️ Возможные проблемы

### Docker не запущен
Если видите ошибку "Docker is not running":
- Docker НЕ требуется для деплоя на Supabase Cloud
- Это предупреждение можно игнорировать
- Функция будет развернута на облаке Supabase

### Ошибка авторизации
Если запрашивается авторизация:
1. Браузер откроется автоматически
2. Войдите в свой аккаунт Supabase
3. Скопируйте токен
4. Вставьте токен в командную строку

### Ошибка 404
Если после деплоя получаете 404:
1. Проверьте имя функции в URL
2. Убедитесь, что используете `/make-server-322de762/` вместо `/server/`
3. Подождите 1-2 минуты после деплоя

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в Supabase Dashboard:
   - https://supabase.com/dashboard/project/oqazxfewxttctehgftuy/logs/edge-functions
2. Проверьте статус функции в Dashboard:
   - https://supabase.com/dashboard/project/oqazxfewxttctehgftuy/functions

## ✨ Готово!

После успешного деплоя запустите сайт командой:
```bash
START.bat
```

Сайт будет доступен по адресу:
```
http://localhost:3000
```
