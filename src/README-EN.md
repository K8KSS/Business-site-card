# 🎵 Music Teacher Website

Modern website for a kindergarten music teacher with full content management system.

## 🚀 Quick Start

### Step 1: Install Dependencies

**Double-click:**
```
INSTALL-DEPENDENCIES.bat
```

**Or run:**
```bash
npm install
```

### Step 2: Start the Project

**Double-click:**
```
SIMPLE-START.bat
```

Choose option:
- **1** - Frontend only (no database needed) - **RECOMMENDED FOR FIRST RUN**
- **2** - Frontend + Backend (with PostgreSQL)
- **3** - Setup PostgreSQL database

**Or run manually:**
```bash
npm run dev
```

### Step 3: Open in Browser

```
http://localhost:5173
```

## 🔐 Admin Panel

Access the admin panel:
1. Open the website
2. Press `Ctrl + Shift + A`
3. Enter password: `admin` (default)

Change password in `.env` file:
```
ADMIN_PASSWORD=your_new_password
```

## ✨ Features

- ✅ Publications with 10 categories
- ✅ Photo albums
- ✅ Portfolio with certificates
- ✅ Achievements timeline
- ✅ Reviews with moderation
- ✅ Contact form
- ✅ Audio player
- ✅ Video player (VK iframe support)
- ✅ Hidden admin panel
- ✅ Full content management
- ✅ File downloads
- ✅ PDF/DOCX preview

## 🗄️ Database (Optional)

### Without PostgreSQL (Default)
Works with demo data in memory. Data is not saved after restart.

### With PostgreSQL (For Production)
Data is saved to PostgreSQL database.

**Setup:**
1. Download PostgreSQL: https://www.postgresql.org/download/
2. Configure `.env` file
3. Run `setup-database.bat`
4. Start with option 2

## 📁 Project Structure

```
music-teacher-website/
├── components/          # React components
├── server/             # Backend server
│   ├── index.js       # Main server file
│   └── setup-db.js    # Database setup
├── styles/            # CSS styles
├── public/            # Static files
├── .env               # Configuration
└── package.json       # Dependencies
```

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Express.js, PostgreSQL
- **UI:** ShadCN UI components
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)

## 📚 Documentation

- `НАЧНИ-ОТСЮДА.md` - Main guide (Russian)
- `БЫСТРЫЙ-СТАРТ.md` - Quick start (Russian)
- `POSTGRESQL-УСТАНОВКА.md` - PostgreSQL setup (Russian)
- `РЕШЕНИЕ-ОШИБКИ-EXPRESS.md` - Error fix guide (Russian)

## ❓ Troubleshooting

### Error: "Cannot find package 'express'"

**Solution:**
```bash
npm install
```

See `РЕШЕНИЕ-ОШИБКИ-EXPRESS.md` for details.

### Error: "Port 3001 already in use"

Change port in `.env`:
```
PORT=3002
```

### Error: "PostgreSQL not running"

Use option 1 in `SIMPLE-START.bat` (frontend only).

## 🎯 Main Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start frontend (localhost:5173) |
| `node server/index.js` | Start backend (localhost:3001) |
| `npm run setup` | Setup database |

## 📄 License

This project is for educational purposes.

## 👤 Author

Created for Elena Parfirova - Kindergarten Music Teacher

---

**Status:** ✅ READY TO USE

**Main file to start:** `НАЧНИ-ОТСЮДА.md` (Russian)
