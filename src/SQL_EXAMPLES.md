# 📊 Примеры SQL запросов

Это руководство поможет работать с базой данных напрямую через SQL.

## 🛠️ Инструменты для работы с SQLite

Рекомендуемые программы:
- **DB Browser for SQLite** - https://sqlitebrowser.org/
- **SQLite Studio** - https://sqlitestudio.pl/
- **VS Code Extension** - SQLite Viewer

Путь к базе данных: `server/database.sqlite`

---

## 📝 Основные операции

### Просмотр всех таблиц
```sql
SELECT name FROM sqlite_master WHERE type='table';
```

### Структура таблицы
```sql
PRAGMA table_info(publications);
```

---

## 📰 Работа с публикациями

### Получить все публикации
```sql
SELECT * FROM publications ORDER BY date DESC;
```

### Найти публикации по категории
```sql
SELECT * FROM publications 
WHERE category = 'scenarios'
ORDER BY date DESC;
```

### Поиск по тексту
```sql
SELECT * FROM publications 
WHERE title LIKE '%осень%' 
   OR description LIKE '%осень%';
```

### Добавить новую публикацию
```sql
INSERT INTO publications (title, description, category, image, date)
VALUES (
  'Название публикации',
  'Описание публикации',
  'scenarios',
  'https://example.com/image.jpg',
  datetime('now')
);
```

### Обновить публикацию
```sql
UPDATE publications 
SET title = 'Новое название',
    description = 'Новое описание'
WHERE id = 1;
```

### Удалить публикацию
```sql
DELETE FROM publications WHERE id = 1;
```

### Увеличить счетчик просмотров
```sql
UPDATE publications 
SET views = views + 1 
WHERE id = 1;
```

---

## 📸 Работа с альбомами и фото

### Все альбомы с количеством фото
```sql
SELECT 
  a.id,
  a.title,
  a.date,
  COUNT(p.id) as photo_count
FROM albums a
LEFT JOIN photos p ON a.id = p.album_id
GROUP BY a.id
ORDER BY a.date DESC;
```

### Фотографии конкретного альбома
```sql
SELECT * FROM photos 
WHERE album_id = 1;
```

### Создать новый альбом
```sql
INSERT INTO albums (title, cover, date)
VALUES (
  'Весенний праздник',
  'https://example.com/cover.jpg',
  datetime('now')
);
```

### Добавить фото в альбом
```sql
INSERT INTO photos (album_id, url)
VALUES (1, 'https://example.com/photo.jpg');
```

### Удалить альбом со всеми фото
```sql
DELETE FROM photos WHERE album_id = 1;
DELETE FROM albums WHERE id = 1;
```

---

## 🏆 Работа с достижениями

### Получить все достижения
```sql
SELECT * FROM achievements 
ORDER BY year DESC, id DESC;
```

### Достижения за год
```sql
SELECT * FROM achievements 
WHERE year = '2024'
ORDER BY id DESC;
```

### Добавить достижение
```sql
INSERT INTO achievements (title, year, type, icon, color)
VALUES (
  'Диплом победителя',
  '2024',
  'personal',
  'Trophy',
  'from-yellow-400 to-orange-500'
);
```

---

## 📜 Работа с портфолио

### Все дипломы
```sql
SELECT * FROM portfolio 
ORDER BY date DESC;
```

### Дипломы по категории
```sql
SELECT * FROM portfolio 
WHERE category = 'Педагогическое мастерство'
ORDER BY date DESC;
```

### Топ просматриваемых дипломов
```sql
SELECT * FROM portfolio 
ORDER BY views DESC 
LIMIT 10;
```

### Добавить диплом
```sql
INSERT INTO portfolio (title, organization, category, image, date)
VALUES (
  'Диплом лауреата',
  'Министерство образования',
  'Педагогическое мастерство',
  'https://example.com/diploma.jpg',
  datetime('now')
);
```

---

## 💬 Работа с отзывами

### Одобренные отзывы
```sql
SELECT * FROM reviews 
WHERE status = 'approved'
ORDER BY date DESC;
```

### Отзывы на модерации
```sql
SELECT * FROM reviews 
WHERE status = 'pending'
ORDER BY date DESC;
```

### Одобрить отзыв
```sql
UPDATE reviews 
SET status = 'approved'
WHERE id = 1;
```

### Отклонить (удалить) отзыв
```sql
DELETE FROM reviews WHERE id = 1;
```

### Средний рейтинг
```sql
SELECT AVG(rating) as average_rating,
       COUNT(*) as total_reviews
FROM reviews 
WHERE status = 'approved';
```

### Топ отзывов по лайкам
```sql
SELECT * FROM reviews 
WHERE status = 'approved'
ORDER BY likes DESC 
LIMIT 5;
```

### Добавить лайк к отзыву
```sql
UPDATE reviews 
SET likes = likes + 1 
WHERE id = 1;
```

---

## 📧 Работа с сообщениями

### Новые сообщения
```sql
SELECT * FROM messages 
WHERE status = 'new'
ORDER BY date DESC;
```

### Прочитанные сообщения
```sql
SELECT * FROM messages 
WHERE status = 'read'
ORDER BY date DESC;
```

### Отметить как прочитанное
```sql
UPDATE messages 
SET status = 'read'
WHERE id = 1;
```

### Поиск сообщений
```sql
SELECT * FROM messages 
WHERE subject LIKE '%консультация%'
   OR message LIKE '%консультация%'
ORDER BY date DESC;
```

---

## 🎵 Работа с аудио

### Все треки
```sql
SELECT * FROM audio 
ORDER BY id;
```

### Треки по категории
```sql
SELECT * FROM audio 
WHERE category = 'Детские песни';
```

### Добавить трек
```sql
INSERT INTO audio (title, artist, category, file_url, duration, color)
VALUES (
  'Песенка про весну',
  'Музыкальное занятие',
  'Детские песни',
  '/uploads/song.mp3',
  '3:25',
  'from-green-500 to-teal-500'
);
```

---

## 🎬 Работа с видео

### Все видео
```sql
SELECT * FROM videos 
ORDER BY date DESC;
```

### Популярные видео
```sql
SELECT * FROM videos 
ORDER BY views DESC 
LIMIT 10;
```

### Видео по категории
```sql
SELECT * FROM videos 
WHERE category = 'Праздники'
ORDER BY date DESC;
```

### Увеличить счетчик просмотров
```sql
UPDATE videos 
SET views = views + 1 
WHERE id = 1;
```

### Добавить видео
```sql
INSERT INTO videos (title, description, category, thumbnail, video_url, duration, date)
VALUES (
  'Выпускной 2024',
  'Выпускной утренник в подготовительной группе',
  'Праздники',
  'https://example.com/thumbnail.jpg',
  '/uploads/video.mp4',
  '25:30',
  datetime('now')
);
```

---

## 📊 Статистика

### Общая статистика
```sql
SELECT 
  (SELECT COUNT(*) FROM publications) as total_publications,
  (SELECT COUNT(*) FROM albums) as total_albums,
  (SELECT COUNT(*) FROM photos) as total_photos,
  (SELECT COUNT(*) FROM achievements) as total_achievements,
  (SELECT COUNT(*) FROM portfolio) as total_diplomas,
  (SELECT COUNT(*) FROM reviews WHERE status='approved') as approved_reviews,
  (SELECT COUNT(*) FROM reviews WHERE status='pending') as pending_reviews,
  (SELECT COUNT(*) FROM messages WHERE status='new') as new_messages,
  (SELECT COUNT(*) FROM audio) as total_audio,
  (SELECT COUNT(*) FROM videos) as total_videos,
  (SELECT SUM(views) FROM videos) as total_video_views;
```

### Активность по датам
```sql
SELECT 
  date(date) as day,
  COUNT(*) as count
FROM publications
GROUP BY date(date)
ORDER BY day DESC
LIMIT 30;
```

### Популярные категории публикаций
```sql
SELECT 
  category,
  COUNT(*) as count
FROM publications
GROUP BY category
ORDER BY count DESC;
```

---

## 🧹 Очистка данных

### Удалить все демо-данные
```sql
-- ОСТОРОЖНО! Удалит все данные!
DELETE FROM publications;
DELETE FROM albums;
DELETE FROM photos;
DELETE FROM achievements;
DELETE FROM portfolio;
DELETE FROM reviews;
DELETE FROM messages;
DELETE FROM audio;
DELETE FROM videos;

-- Сбросить счетчики автоинкремента
DELETE FROM sqlite_sequence;
```

### Удалить старые сообщения
```sql
DELETE FROM messages 
WHERE date < datetime('now', '-30 days')
  AND status = 'read';
```

---

## 🔐 Резервное копирование

### Экспорт в SQL файл (через CLI)
```bash
sqlite3 server/database.sqlite .dump > backup.sql
```

### Восстановление из SQL файла
```bash
sqlite3 server/database.sqlite < backup.sql
```

### Экспорт таблицы в CSV
```bash
sqlite3 server/database.sqlite
.mode csv
.output publications.csv
SELECT * FROM publications;
.quit
```

---

## 💡 Полезные запросы

### Проверить целостность БД
```sql
PRAGMA integrity_check;
```

### Размер базы данных
```sql
SELECT page_count * page_size as size 
FROM pragma_page_count(), pragma_page_size();
```

### Вакуум (оптимизация БД)
```sql
VACUUM;
```

### Анализ производительности
```sql
ANALYZE;
```

---

## ⚠️ Важные замечания

1. **Делайте бэкапы** перед выполнением UPDATE/DELETE запросов
2. **Используйте транзакции** для множественных операций:
```sql
BEGIN TRANSACTION;
-- ваши запросы
COMMIT;
-- или ROLLBACK; для отмены
```

3. **Проверяйте WHERE** условия перед удалением/обновлением
4. **Индексы**: SQLite автоматически создает индексы для PRIMARY KEY

---

**Работайте с базой данных аккуратно!** 🗄️
