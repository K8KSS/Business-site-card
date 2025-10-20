import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pg from 'pg';
import dotenv from 'dotenv';

// Загрузка переменных окружения
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const { Pool } = pg;

// Настройка пула подключений к PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'music_teacher_website',
});

// Проверка подключения
pool.on('connect', () => {
  console.log('✅ Подключено к PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Ошибка PostgreSQL:', err);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Создаем папку для загрузок если её нет
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ========== API ENDPOINTS ==========

// Публикации
app.get('/api/publications', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM publications WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (category && category !== 'all') {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (search) {
      query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount + 1})`;
      params.push(`%${search}%`, `%${search}%`);
      paramCount += 2;
    }

    query += ' ORDER BY date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения публикаций:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/publications/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM publications WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Публикация не найдена' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка получения публикации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/publications', upload.fields([{ name: 'file' }, { name: 'cover' }]), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const fileUrl = req.files?.file?.[0] ? `/uploads/${req.files.file[0].filename}` : null;
    const coverUrl = req.files?.cover?.[0] ? `/uploads/${req.files.cover[0].filename}` : null;
    
    const result = await pool.query(
      `INSERT INTO publications (title, description, category, image, file_url, date)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id`,
      [title, description, category, coverUrl || '', fileUrl]
    );
    
    res.json({ id: result.rows[0].id, message: 'Публикация создана' });
  } catch (error) {
    console.error('Ошибка создания публикации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/publications/:id', upload.single('file'), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    let query = 'UPDATE publications SET title = $1, description = $2, category = $3';
    const params = [title, description, category];
    let paramCount = 4;
    
    if (fileUrl) {
      query += `, file_url = $${paramCount}`;
      params.push(fileUrl);
      paramCount++;
    }
    
    query += ` WHERE id = $${paramCount}`;
    params.push(req.params.id);
    
    await pool.query(query, params);
    res.json({ message: 'Публикация обновлена' });
  } catch (error) {
    console.error('Ошибка обновления публикации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/publications/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM publications WHERE id = $1', [req.params.id]);
    res.json({ message: 'Публикация удалена' });
  } catch (error) {
    console.error('Ошибка удаления публикации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Альбомы
app.get('/api/albums', async (req, res) => {
  try {
    const albumsResult = await pool.query('SELECT * FROM albums ORDER BY date DESC');
    const albums = albumsResult.rows;
    
    // Получаем фото для каждого альбома
    for (let album of albums) {
      const photosResult = await pool.query('SELECT * FROM photos WHERE album_id = $1', [album.id]);
      album.photos = photosResult.rows;
    }
    
    res.json(albums);
  } catch (error) {
    console.error('Ошибка получения альбомов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/albums', upload.single('cover'), async (req, res) => {
  try {
    const { title } = req.body;
    const cover = req.file ? `/uploads/${req.file.filename}` : '';
    
    const result = await pool.query(
      `INSERT INTO albums (title, cover, date) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id`,
      [title, cover]
    );
    
    res.json({ id: result.rows[0].id, message: 'Альбом создан' });
  } catch (error) {
    console.error('Ошибка создания альбома:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/albums/:id/photos', upload.single('photo'), async (req, res) => {
  try {
    const albumId = req.params.id;
    const url = req.file ? `/uploads/${req.file.filename}` : '';
    
    const result = await pool.query(
      'INSERT INTO photos (album_id, url) VALUES ($1, $2) RETURNING id',
      [albumId, url]
    );
    
    res.json({ id: result.rows[0].id, message: 'Фото добавлено' });
  } catch (error) {
    console.error('Ошибка добавления фото:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/albums/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM photos WHERE album_id = $1', [req.params.id]);
    await pool.query('DELETE FROM albums WHERE id = $1', [req.params.id]);
    res.json({ message: 'Альбом удален' });
  } catch (error) {
    console.error('Ошибка удаления альбома:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Достижения
app.get('/api/achievements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM achievements ORDER BY year DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения достижений:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/achievements', async (req, res) => {
  try {
    const { title, year, type, icon, color } = req.body;
    
    const result = await pool.query(
      `INSERT INTO achievements (title, year, type, icon, color) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [title, year, type, icon, color]
    );
    
    res.json({ id: result.rows[0].id, message: 'Достижение добавлено' });
  } catch (error) {
    console.error('Ошибка добавления достижения:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/achievements/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM achievements WHERE id = $1', [req.params.id]);
    res.json({ message: 'Достижение удалено' });
  } catch (error) {
    console.error('Ошибка удаления достижения:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Портфолио (дипломы)
app.get('/api/portfolio', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM portfolio ORDER BY date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения портфолио:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/portfolio', upload.single('image'), async (req, res) => {
  try {
    const { title, organization, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    
    const result = await pool.query(
      `INSERT INTO portfolio (title, organization, category, image, date) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id`,
      [title, organization, category, image]
    );
    
    res.json({ id: result.rows[0].id, message: 'Диплом добавлен' });
  } catch (error) {
    console.error('Ошибка добавления диплома:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM portfolio WHERE id = $1', [req.params.id]);
    res.json({ message: 'Диплом удален' });
  } catch (error) {
    console.error('Ошибка удаления диплома:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Отзывы
app.get('/api/reviews', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM reviews';
    const params = [];
    
    if (status) {
      query += ' WHERE status = $1 ORDER BY date DESC';
      params.push(status);
    } else {
      query += ' ORDER BY date DESC';
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения отзывов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { author, role, text, rating } = req.body;
    
    const result = await pool.query(
      `INSERT INTO reviews (author, role, text, rating, status, likes, date) 
       VALUES ($1, $2, $3, $4, 'pending', 0, CURRENT_TIMESTAMP) RETURNING id`,
      [author, role, text, rating]
    );
    
    res.json({ id: result.rows[0].id, message: 'Отзыв отправлен на модерацию' });
  } catch (error) {
    console.error('Ошибка добавления отзыва:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/reviews/:id/approve', async (req, res) => {
  try {
    await pool.query('UPDATE reviews SET status = $1 WHERE id = $2', ['approved', req.params.id]);
    res.json({ message: 'Отзыв одобрен' });
  } catch (error) {
    console.error('Ошибка одобрения отзыва:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/reviews/:id/like', async (req, res) => {
  try {
    await pool.query('UPDATE reviews SET likes = likes + 1 WHERE id = $1', [req.params.id]);
    res.json({ message: 'Лайк добавлен' });
  } catch (error) {
    console.error('Ошибка добавления лайка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
    res.json({ message: 'Отзыв удален' });
  } catch (error) {
    console.error('Ошибка удаления отзыва:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обратная связь
app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения сообщений:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const result = await pool.query(
      `INSERT INTO messages (name, email, phone, subject, message, status, date) 
       VALUES ($1, $2, $3, $4, $5, 'new', CURRENT_TIMESTAMP) RETURNING id`,
      [name, email, phone || '', subject, message]
    );
    
    res.json({ id: result.rows[0].id, message: 'Сообщение отправлено' });
  } catch (error) {
    console.error('Ошибка отправки сообщения:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/messages/:id/read', async (req, res) => {
  try {
    await pool.query('UPDATE messages SET status = $1 WHERE id = $2', ['read', req.params.id]);
    res.json({ message: 'Сообщение прочитано' });
  } catch (error) {
    console.error('Ошибка обновления сообщения:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
    res.json({ message: 'Сообщение удалено' });
  } catch (error) {
    console.error('Ошибка удаления сообщения:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Аудио
app.get('/api/audio', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM audio ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения аудио:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/audio', upload.single('file'), async (req, res) => {
  try {
    const { title, artist, category } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';
    
    const result = await pool.query(
      `INSERT INTO audio (title, artist, category, file_url, duration) VALUES ($1, $2, $3, $4, '0:00') RETURNING id`,
      [title, artist, category, fileUrl]
    );
    
    res.json({ id: result.rows[0].id, message: 'Трек добавлен' });
  } catch (error) {
    console.error('Ошибка добавления трека:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/audio/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM audio WHERE id = $1', [req.params.id]);
    res.json({ message: 'Трек удален' });
  } catch (error) {
    console.error('Ошибка удаления трека:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Видео
app.get('/api/videos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM videos ORDER BY date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения видео:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/videos', upload.fields([{ name: 'thumbnail' }, { name: 'video' }]), async (req, res) => {
  try {
    const { title, description, category, vk_iframe } = req.body;
    const thumbnail = req.files?.thumbnail?.[0] ? `/uploads/${req.files.thumbnail[0].filename}` : '';
    const videoUrl = req.files?.video?.[0] ? `/uploads/${req.files.video[0].filename}` : '';
    
    const result = await pool.query(
      `INSERT INTO videos (title, description, category, thumbnail, video_url, vk_iframe, duration, views, date) 
       VALUES ($1, $2, $3, $4, $5, $6, '0:00', 0, CURRENT_TIMESTAMP) RETURNING id`,
      [title, description, category, thumbnail, videoUrl, vk_iframe || '']
    );
    
    res.json({ id: result.rows[0].id, message: 'Видео добавлено' });
  } catch (error) {
    console.error('Ошибка добавления видео:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/videos/:id/view', async (req, res) => {
  try {
    await pool.query('UPDATE videos SET views = views + 1 WHERE id = $1', [req.params.id]);
    res.json({ message: 'Просмотр засчитан' });
  } catch (error) {
    console.error('Ошибка обновления просмотров:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/videos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM videos WHERE id = $1', [req.params.id]);
    res.json({ message: 'Видео удалено' });
  } catch (error) {
    console.error('Ошибка удаления видео:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Админ
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  
  // Проверяем пароль из переменных окружения
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
  
  if (password === adminPassword) {
    res.json({ success: true, message: 'Вход выполнен' });
  } else {
    res.status(401).json({ success: false, message: 'Неверный пароль' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const publicationsCount = await pool.query('SELECT COUNT(*) as count FROM publications');
    const albumsCount = await pool.query('SELECT COUNT(*) as count FROM albums');
    const pendingReviewsCount = await pool.query('SELECT COUNT(*) as count FROM reviews WHERE status = $1', ['pending']);
    const newMessagesCount = await pool.query('SELECT COUNT(*) as count FROM messages WHERE status = $1', ['new']);
    const totalViewsResult = await pool.query('SELECT COALESCE(SUM(views), 0) as total FROM videos');
    
    const stats = {
      publications: parseInt(publicationsCount.rows[0].count),
      albums: parseInt(albumsCount.rows[0].count),
      reviews: parseInt(pendingReviewsCount.rows[0].count),
      messages: parseInt(newMessagesCount.rows[0].count),
      totalViews: parseInt(totalViewsResult.rows[0].total),
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
  console.log(`📊 API доступен на http://localhost:${PORT}/api`);
  console.log(`📍 База данных: PostgreSQL (${process.env.DB_NAME})`);
});
