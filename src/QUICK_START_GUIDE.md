# 🚀 Быстрый Старт - 3 Шага за 5 Минут

## ⚡ Запустите сайт СЕЙЧАС (без настройки базы данных)

### Шаг 1: Установка (2 минуты)

```bash
# 1. Откройте терминал в папке проекта
# 2. Установите зависимости
npm install
```

### Шаг 2: Запуск (1 минута)

```bash
# Запустите сайт
npm run dev:client
```

### Шаг 3: Готово! ✅

Сайт откроется по адресу: **http://localhost:5173**

🎉 **Всё работает!** Сайт работает в демо-режиме с предзагруженными данными.

---

## 🔐 Тестирование Админ-Панели

1. Нажмите **Ctrl + Shift + A** или **тройной клик по логотипу**
2. Пароль по умолчанию: **admin123**
3. Вы увидите административную панель!

⚠️ **Важно:** В демо-режиме изменения не сохраняются. Для полного функционала нужно настроить Supabase (см. ниже).

---

## 📡 Подключение Базы Данных (Опционально)

Хотите сохранять изменения и загружать файлы? Настройте Supabase за 10 минут:

### 1. Создайте проект Supabase (3 минуты)

1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте аккаунт через GitHub
3. Нажмите **New Project**
4. Заполните:
   - **Name:** `music-teacher` (любое имя)
   - **Database Password:** придумайте и **СОХРАНИТЕ**
   - **Region:** `Central EU (Frankfurt)` (ближайший)
5. Нажмите **Create new project**
6. Подождите 2 минуты пока проект создается

### 2. Настройте Edge Functions (5 минут)

#### Установите Supabase CLI:

**Windows (рекомендуется через Scoop):**
```bash
# Установите Scoop (если нет)
# Откройте PowerShell и выполните:
irm get.scoop.sh | iex

# Установите Supabase CLI
scoop install supabase
```

**Альтернативно через NPM:**
```bash
npm install -g supabase
```

#### Разверните Edge Functions:

```bash
# Дважды кликните на файл:
DEPLOY_EDGE_FUNCTIONS.bat

# Или выполните в терминале:
.\DEPLOY_EDGE_FUNCTIONS.bat
```

**Следуйте инструкциям на экране:**
1. При первом запуске откроется браузер для авторизации
2. Войдите в ваш Supabase аккаунт
3. Разрешите доступ
4. Вернитесь в терминал - деплой начнется автоматически

**Ожидайте сообщение:**
```
====================================
DEPLOYMENT COMPLETE!
====================================
```

### 3. Получите API ключи (1 минута)

1. В Supabase Dashboard откройте **Settings** (⚙️ в левом меню)
2. Перейдите в **API**
3. Скопируйте:
   - **Project URL** (начинается с `https://`)
   - **anon public** ключ

### 4. Обновите настройки (1 минута)

1. Откройте файл `utils/supabase/info.tsx`
2. Замените значения:

```typescript
export const projectId = 'ваш-project-id'; // из Project URL
export const publicAnonKey = 'ваш-anon-ключ';
```

**Пример:**
```typescript
// Если Project URL: https://abcdefgh12345678.supabase.co
export const projectId = 'abcdefgh12345678';

export const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 5. Перезапустите сайт

```bash
# Остановите сервер (Ctrl + C)
# Запустите снова
npm run dev:client
```

### 6. Проверьте подключение ✅

Откройте консоль браузера (F12):
- ✅ Должно быть: `✅ Supabase подключён успешно`
- ❌ Если ошибка - проверьте шаги выше

---

## 🎯 Тестирование Edge Functions

Откройте в браузере:
```
https://ваш-project-id.supabase.co/functions/v1/make-server-322de762/health
```

**Ожидаемый ответ:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-22T..."
}
```

Если видите это - **всё работает!** 🎉

---

## 🚀 Деплой на Hosting (Netlify)

### Вариант 1: Через интерфейс (самый простой)

1. Зарегистрируйтесь на [netlify.com](https://netlify.com)
2. Нажмите **Add new site** → **Deploy manually**
3. Соберите проект:
   ```bash
   npm run build
   ```
4. Перетащите папку `dist` в окно Netlify
5. Готово! Сайт опубликован

### Вариант 2: Через Git (автоматический деплой)

1. Загрузите проект на GitHub
2. В Netlify: **Add new site** → **Import from Git**
3. Выберите ваш репозиторий
4. Настройки:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. **Environment variables:**
   - Добавьте `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`
6. Нажмите **Deploy**

После каждого push в GitHub сайт обновится автоматически!

---

## 📚 Полезные Ссылки

- 📖 [Полная документация](./README.md)
- 🔧 [Решение проблемы HTTP 404](./HTTP_404_PROBLEM_SOLVED.md)
- 📋 [Инструкция по деплою Edge Functions](./DEPLOY_INSTRUCTIONS_RU.md)
- 💡 [FAQ и решение проблем](./README.md#faq)

---

## ❓ Частые Вопросы

### Не работает админка?
**Решение:** Используйте пароль `admin123` или измените его в Edge Function

### Ошибка при деплое Edge Functions?
**Решение:** 
1. Убедитесь, что Supabase CLI установлен: `supabase --version`
2. Проверьте авторизацию: `supabase projects list`
3. Посмотрите [подробную инструкцию](./HTTP_404_PROBLEM_SOLVED.md)

### Файлы не загружаются?
**Решение:** 
1. Убедитесь, что Edge Functions развернуты
2. Проверьте health endpoint (см. раздел "Тестирование Edge Functions")
3. Проверьте настройки в `utils/supabase/info.tsx`

### Docker not running warning?
**Это НЕ ошибка!** Docker не нужен для деплоя Edge Functions в облако Supabase. Игнорируйте это предупреждение.

---

## 🎉 Готово!

Теперь у вас:
- ✅ Работающий сайт
- ✅ Функциональная админ-панель
- ✅ Подключение к базе данных (если настроили)
- ✅ Готовность к деплою

**Следующие шаги:**
1. Откройте админ-панель (Ctrl+Shift+A)
2. Добавьте свой контент
3. Разверните на Netlify/Vercel
4. Поделитесь ссылкой! 🎵

**Успехов! ✨**
