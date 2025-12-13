# 🍬 Sweet Shop Management System - SQLite Edition

A full-stack web application for managing a sweet shop inventory with user authentication, role-based access control, and real-time inventory management.

**✨ Now with SQLite - No database server setup required!**

![Sweet Shop](https://img.shields.io/badge/TDD-Enabled-brightgreen) ![React](https://img.shields.io/badge/React-19.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![SQLite](https://img.shields.io/badge/SQLite-3-blue)

## 🎯 Overview

The Sweet Shop Management System is a modern, full-stack application built with Test-Driven Development (TDD) principles. It uses **SQLite** for easy setup - no database server installation required!

### Key Highlights

- ✅ **SQLite Database**: Zero configuration, runs directly from a file
- ✅ **Test-Driven Development**: Comprehensive test coverage with Jest
- ✅ **Secure Authentication**: JWT-based authentication with role-based access control
- ✅ **Modern UI**: Beautiful, responsive design with glassmorphism and smooth animations
- ✅ **Real-time Updates**: Live inventory tracking and instant purchase confirmation
- ✅ **Easy Setup**: Just `npm install` and run!

## 🚀 Quick Start (2 Minutes!)

### Prerequisites

- Node.js (v18 or higher)
- npm

**That's it! No database server needed!**

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Run Database Migrations**
   ```bash
   npm run migrate
   ```
   This creates a `database.sqlite` file automatically.

3. **Seed Sample Data (Optional)**
   ```bash
   npm run seed
   ```
   Creates test accounts:
   - Admin: `admin@sweetshop.com` / `admin123`
   - User: `user@sweetshop.com` / `user123`

4. **Start Backend**
   ```bash
   npm run dev
   ```
   Backend runs at `http://localhost:5000`

5. **Install Frontend Dependencies** (in a new terminal)
   ```bash
   cd frontend/sweet
   npm install
   ```

6. **Start Frontend**
   ```bash
   npm run dev
   ```
   Frontend runs at `http://localhost:5173`

## ✨ Features

### For Customers
- Browse available sweets with detailed information
- Search and filter sweets by name, category, and price range
- Purchase sweets with real-time inventory updates
- View stock availability and pricing

### For Administrators
- Add, edit, and delete sweets
- Manage inventory with restock functionality
- View all products and their stock levels
- Complete control over the sweet catalog

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Testing**: Jest, Supertest

### Frontend
- **Framework**: React 19.2.0
- **Language**: TypeScript
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with modern design

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected endpoints require a JWT token:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile (Protected)

#### Sweets (All Protected)
- `GET /sweets` - Get all sweets
- `GET /sweets/search` - Search sweets with filters
- `GET /sweets/:id` - Get sweet by ID
- `POST /sweets` - Create new sweet (Admin only)
- `PUT /sweets/:id` - Update sweet (Admin only)
- `DELETE /sweets/:id` - Delete sweet (Admin only)
- `POST /sweets/:id/purchase` - Purchase sweet
- `POST /sweets/:id/restock` - Restock sweet (Admin only)

## 🧪 Testing

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

Expected output:
- ✅ All tests passing
- ✅ 70%+ code coverage

## 📁 Project Structure

```
incubyte/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── __tests__/      # Test files
│   │   ├── controllers/    # Request handlers
│   │   ├── database/       # DB configuration & migrations
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── database.sqlite     # SQLite database (auto-generated)
│   └── package.json
│
└── frontend/sweet/         # React frontend
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── context/        # React context (Auth)
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   └── App.tsx         # Main app component
    └── package.json
```

## 🎨 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Sweets Table
```sql
CREATE TABLE sweets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  image_url TEXT,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Purchases Table
```sql
CREATE TABLE purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  sweet_id INTEGER,
  quantity INTEGER NOT NULL,
  total_price REAL NOT NULL,
  purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (sweet_id) REFERENCES sweets(id)
);
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
DB_PATH=./database.sqlite
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
```

## 🐛 Troubleshooting

### Backend won't start

**Error: "Cannot find module 'better-sqlite3'"**
- Run `npm install` in the backend directory

**Error: "SQLITE_ERROR: no such table"**
- Run `npm run migrate` to create tables

### Frontend won't start

**Error: "Cannot connect to backend"**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `frontend/sweet/.env`

### Database Issues

**Want to reset the database?**
```bash
cd backend
rm database.sqlite
npm run migrate
npm run seed  # Optional: add sample data
```

## 🤖 AI Usage

This project was developed with extensive use of **Google Gemini** AI assistant. See the main README.md for detailed AI usage documentation.

## 📝 Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎓 Why SQLite?

- ✅ **Zero Configuration**: No database server to install or configure
- ✅ **Portable**: Single file database, easy to backup and share
- ✅ **Fast**: Excellent performance for small to medium applications
- ✅ **Reliable**: Battle-tested, used by millions of applications
- ✅ **Perfect for Development**: Quick setup, easy testing
- ✅ **Production Ready**: Can handle thousands of requests per second

## 📄 License

MIT

## 👨‍💻 Author

Developed as part of the Incubyte TDD Kata assessment.

---

**Built with ❤️ using Test-Driven Development, SQLite, and AI assistance**
