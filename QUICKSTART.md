# 🍬 Sweet Shop - SQLite Quick Start Guide

## ✨ Super Easy Setup - No Database Server Needed!

This project now uses **SQLite** - a file-based database that requires ZERO configuration!

## 🚀 Quick Start (3 Steps!)

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Create Database & Tables

```bash
npm run migrate
```

This creates a `database.sqlite` file with all necessary tables.

### Step 3: Start the Backend

```bash
npm run dev
```

✅ Backend running at `http://localhost:5000`

---

### Frontend Setup (In a new terminal)

```bash
cd frontend/sweet
npm install
npm run dev
```

✅ Frontend running at `http://localhost:5173`

## 🎉 That's It!

Open your browser to `http://localhost:5173` and start using the app!

## 🌱 Optional: Add Sample Data

Want to test with pre-loaded data?

```bash
cd backend
npm run seed
```

This creates:
- **Admin Account**: `admin@sweetshop.com` / `admin123`
- **User Account**: `user@sweetshop.com` / `user123`
- **10 Sample Sweets**: Various categories with images

## 📝 What Changed from PostgreSQL?

### Before (PostgreSQL):
1. Install PostgreSQL server
2. Create database
3. Configure connection
4. Run migrations
5. Start app

### Now (SQLite):
1. `npm install`
2. `npm run migrate`
3. `npm run dev`

**That's it!** 🎉

## 🔧 How It Works

- **Database File**: `backend/database.sqlite`
- **Auto-created**: First time you run migrations
- **Portable**: Just one file, easy to backup
- **Fast**: Perfect for development and small-medium apps

## 🧪 Running Tests

```bash
cd backend
npm test
```

All tests work exactly the same!

## 🐛 Troubleshooting

### "Cannot find module 'sql.js'"
```bash
cd backend
npm install
```

### Want to reset the database?
```bash
cd backend
rm database.sqlite
npm run migrate
npm run seed  # Optional
```

### Database file location
The `database.sqlite` file is in the `backend` directory. You can:
- **Backup**: Just copy the file
- **Share**: Send the file to teammates
- **Reset**: Delete and re-migrate

## 📊 Database Schema

Same as before! Users, Sweets, and Purchases tables with all relationships.

## ✅ Benefits of SQLite

- ✅ **Zero Configuration**: No server to install
- ✅ **Single File**: Easy to backup and share
- ✅ **Fast**: Excellent performance
- ✅ **Reliable**: Used by millions of apps
- ✅ **Perfect for Development**: Quick setup
- ✅ **Production Ready**: Can handle high traffic

## 🎯 Next Steps

1. Open `http://localhost:5173`
2. Register a new account
3. Start adding sweets!

Or use the seeded accounts:
- Admin: `admin@sweetshop.com` / `admin123`
- User: `user@sweetshop.com` / `user123`

---

**Happy coding! 🍬🚀**

*No database server, no problem!*
