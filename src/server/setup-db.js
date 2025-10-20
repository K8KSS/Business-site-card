import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загрузка переменных окружения
dotenv.config();

const { Pool } = pg;

// Конфигурация подключения к PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'music_teacher_website',
});

console.log('🗄️  Creating PostgreSQL database...');
console.log(`📍 Connecting to: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}`);
console.log(`👤 User: ${process.env.DB_USER || 'postgres'}`);
console.log(`📦 Database: ${process.env.DB_NAME || 'music_teacher_website'}`);

async function setupDatabase() {
  let client;
  try {
    client = await pool.connect();
  } catch (error) {
    console.error('\n❌ Cannot connect to PostgreSQL!');
    console.error('\nPossible reasons:');
    console.error('1. PostgreSQL is not running');
    console.error('2. Wrong password in server/.env file');
    console.error('3. Database does not exist yet');
    console.error('\nCurrent password in .env:', process.env.DB_PASSWORD || 'postgres');
    console.error('\nTo fix:');
    console.error('- Check server/.env file');
    console.error('- Change DB_PASSWORD to your PostgreSQL password');
    console.error('- Make sure PostgreSQL service is running\n');
    throw error;
  }
  
  try {
    // Удаление существующих таблиц (для чистой установки)
    console.log('\n🗑️  Dropping existing tables...');
    await client.query(`
      DROP TABLE IF EXISTS photos CASCADE;
      DROP TABLE IF EXISTS messages CASCADE;
      DROP TABLE IF EXISTS reviews CASCADE;
      DROP TABLE IF EXISTS videos CASCADE;
      DROP TABLE IF EXISTS audio CASCADE;
      DROP TABLE IF EXISTS portfolio CASCADE;
      DROP TABLE IF EXISTS achievements CASCADE;
      DROP TABLE IF EXISTS albums CASCADE;
      DROP TABLE IF EXISTS publications CASCADE;
    `);

    // Создание таблиц
    console.log('📝 Creating tables...');
    
    await client.query(`
      CREATE TABLE publications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        image TEXT,
        file_url TEXT,
        cover TEXT,
        views INTEGER DEFAULT 0,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE albums (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        cover TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE photos (
        id SERIAL PRIMARY KEY,
        album_id INTEGER NOT NULL,
        url TEXT NOT NULL,
        FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
      );

      CREATE TABLE achievements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        year INTEGER,
        type TEXT,
        icon TEXT,
        color TEXT
      );

      CREATE TABLE portfolio (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        organization TEXT,
        category TEXT,
        image TEXT,
        views INTEGER DEFAULT 0,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        author TEXT NOT NULL,
        role TEXT,
        text TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        status TEXT DEFAULT 'pending',
        likes INTEGER DEFAULT 0,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE audio (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        artist TEXT,
        category TEXT,
        file_url TEXT,
        cover TEXT,
        duration TEXT DEFAULT '0:00'
      );

      CREATE TABLE videos (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        thumbnail TEXT,
        video_url TEXT,
        vk_iframe TEXT,
        duration TEXT DEFAULT '0:00',
        views INTEGER DEFAULT 0,
        hidden INTEGER DEFAULT 0,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tables created');

    // Вставка демо-данных
    console.log('📝 Adding demo data...');

    // Публикации
    await client.query(`
      INSERT INTO publications (title, description, category, image, date, views) VALUES
      ('Сценарий осеннего праздника ''Золотая осень''', 'Увлекательный сценарий для старшей группы детского сада с песнями, танцами и играми на осеннюю тематику.', 'scenarios', 'https://images.unsplash.com/photo-1576495350482-942cde5fb23b?w=400', '2024-09-15', 245),
      ('Музыкальные игры для развития чувства ритма', 'Подборка эффективных музыкальных игр и упражнений для развития чувства ритма у дошкольников.', 'music', 'https://images.unsplash.com/photo-1579102072861-c31d565c0903?w=400', '2024-08-22', 189),
      ('Консультация для родителей: Музыка в жизни ребенка', 'Рекомендации для родителей о важности музыкального развития детей и как поддержать интерес к музыке дома.', 'parents', 'https://images.unsplash.com/photo-1601339434203-130259102db6?w=400', '2024-07-10', 312),
      ('Дыхательная гимнастика в музыкаль��ой деятельности', 'Методика проведения дыхательной гимнастики с элементами музыкальной деятельности для здоровьесбережения.', 'health', 'https://images.unsplash.com/photo-1548206328-a50e7afafc6f?w=400', '2024-06-05', 156),
      ('Новогодний утренник ''Волшебство Нового года''', 'Праздничный сценарий с участием Деда Мороза, Снегурочки и сказочных персонажей.', 'scenarios', 'https://images.unsplash.com/photo-1576495350482-942cde5fb23b?w=400', '2023-12-01', 421)
    `);

    // Альбомы
    await client.query(`
      INSERT INTO albums (title, cover, date) VALUES
      ('Осенний праздник 2024', 'https://images.unsplash.com/photo-1576495350482-942cde5fb23b?w=400', '2024-10-15'),
      ('Музыкальные занятия', 'https://images.unsplash.com/photo-1579102072861-c31d565c0903?w=400', '2024-09-20'),
      ('Новогодний утренник', 'https://images.unsplash.com/photo-1601339434203-130259102db6?w=400', '2023-12-25')
    `);

    // Достижения
    await client.query(`
      INSERT INTO achievements (title, year, type, icon, color) VALUES
      ('Победитель районного конкурса ''Лучший педагог года''', 2024, 'personal', 'Trophy', 'from-yellow-400 to-orange-500'),
      ('1 место во Всероссийском конкурсе методических разработок', 2023, 'professional', 'Award', 'from-blue-400 to-purple-500'),
      ('Благодарность от Министерства образования', 2023, 'personal', 'Star', 'from-pink-400 to-red-500')
    `);

    // Портфолио
    await client.query(`
      INSERT INTO portfolio (title, organization, category, image, date, views) VALUES
      ('Диплом победителя конкурса ''Лучший педагог года 2024''', 'Департамент образования города Москвы', 'Педагогическое мастерство', 'https://images.unsplash.com/photo-1715000968071-e3b0068c718d?w=400', '2024-05-20', 245),
      ('Сертификат участника Всероссийской конференции', 'Министерство просвещения РФ', 'Профессиональное развитие', 'https://images.unsplash.com/photo-1715000968071-e3b0068c718d?w=400', '2023-11-15', 189)
    `);

    // Отзывы
    await client.query(`
      INSERT INTO reviews (author, role, text, rating, status, likes, date) VALUES
      ('Анна Петровна', 'Мама воспитанника', 'Елена Юрьевна - замечательный педагог! Моя дочка с радостью идет на музыкальные занятия.', 5, 'approved', 12, '2024-10-10'),
      ('Мария Сергеевна', 'Воспитатель', 'Работать с Еленой Юрьевной одно удовольствие! Профессионал своего дела.', 5, 'approved', 8, '2024-09-25'),
      ('Ольга Викторовна', 'Мама воспитанника', 'Мой сын стал гораздо увереннее в себе после занятий с Еленой Юрьевной.', 5, 'approved', 15, '2024-08-15')
    `);

    // Аудио
    await client.query(`
      INSERT INTO audio (title, artist, category, duration) VALUES
      ('Осенняя песенка', 'Музыкальное занятие', 'Детские песни', '2:45'),
      ('Веселая зарядка', 'Ритмика', 'Физминутки', '3:12'),
      ('Колыбельная', 'Релаксация', 'Успокаивающая музыка', '4:30')
    `);

    // Видео
    await client.query(`
      INSERT INTO videos (title, description, category, thumbnail, duration, views, date) VALUES
      ('Осенний праздник 2024 - Полная запись', 'Выступление детей старшей группы на осеннем празднике', 'Праздники', 'https://images.unsplash.com/photo-1576495350482-942cde5fb23b?w=400', '15:30', 342, '2024-10-15'),
      ('Музыкальное занятие: Развитие ритма', 'Методика проведения занятия по развитию чувства ритма', 'Занятия', 'https://images.unsplash.com/photo-1579102072861-c31d565c0903?w=400', '8:45', 215, '2024-09-20')
    `);

    console.log('✅ Demo data added');
    console.log('🎉 Database successfully created and filled!');
    console.log('📍 Database name: ' + (process.env.DB_NAME || 'music_teacher_website'));
    
  } catch (error) {
    console.error('\n❌ Error creating database tables:', error.message);
    throw error;
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

setupDatabase()
  .then(() => {
    console.log('\n✅ Setup completed successfully!');
    console.log('\nYou can now start the server with:');
    console.log('  cd server');
    console.log('  node index.js\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Setup failed!');
    console.error('\nPlease check the error above and:');
    console.error('1. Make sure PostgreSQL is running');
    console.error('2. Check password in server/.env file');
    console.error('3. Make sure database exists (run setup-database.bat first)\n');
    process.exit(1);
  });
