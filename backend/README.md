# Sweet Shop Management System - Backend

A robust RESTful API built with Node.js, Express, TypeScript, and PostgreSQL for managing a sweet shop inventory system.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control (User/Admin)
- **Sweet Management**: Full CRUD operations for sweets inventory
- **Search & Filter**: Advanced search by name, category, and price range
- **Purchase System**: Real-time inventory management with purchase tracking
- **Restock Functionality**: Admin-only restock capabilities
- **Test-Driven Development**: Comprehensive test suite with Jest and Supertest
- **Database**: PostgreSQL with proper migrations and relationships

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your database credentials:
   ```env
   NODE_ENV=development
   PORT=5000
   
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sweet_shop
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Create PostgreSQL database**
   ```bash
   psql -U postgres
   CREATE DATABASE sweet_shop;
   \q
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production Mode
```bash
npm run build
npm start
```

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run integration tests
```bash
npm run test:integration
```

### Generate coverage report
```bash
npm test -- --coverage
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "user" // or "admin"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Sweet Endpoints (All require authentication)

#### Get All Sweets
```http
GET /api/sweets
Authorization: Bearer <token>
```

#### Search Sweets
```http
GET /api/sweets/search?name=chocolate&category=candy&minPrice=1&maxPrice=10
Authorization: Bearer <token>
```

#### Get Sweet by ID
```http
GET /api/sweets/:id
Authorization: Bearer <token>
```

#### Create Sweet (Admin Only)
```http
POST /api/sweets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Chocolate Bar",
  "category": "Chocolate",
  "price": 2.99,
  "quantity": 100,
  "description": "Delicious chocolate bar",
  "image_url": "https://example.com/image.jpg"
}
```

#### Update Sweet (Admin Only)
```http
PUT /api/sweets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Chocolate Bar",
  "price": 3.49
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/:id
Authorization: Bearer <token>
```

#### Purchase Sweet
```http
POST /api/sweets/:id/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}
```

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/:id/restock
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 50
}
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── __tests__/          # Test files
│   │   ├── auth.test.ts
│   │   └── sweet.test.ts
│   ├── controllers/        # Request handlers
│   │   ├── authController.ts
│   │   └── sweetController.ts
│   ├── database/           # Database configuration
│   │   ├── db.ts
│   │   └── migrate.ts
│   ├── middleware/         # Express middleware
│   │   ├── auth.ts
│   │   └── validate.ts
│   ├── models/             # Data models
│   │   ├── User.ts
│   │   ├── Sweet.ts
│   │   └── types.ts
│   ├── routes/             # API routes
│   │   ├── authRoutes.ts
│   │   └── sweetRoutes.ts
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server entry point
├── .env.example            # Environment variables template
├── .gitignore
├── jest.config.js          # Jest configuration
├── package.json
└── tsconfig.json           # TypeScript configuration
```

## 🧪 Test Coverage

The project follows TDD principles with comprehensive test coverage:

- **Unit Tests**: Individual function and method testing
- **Integration Tests**: Full API endpoint testing
- **Coverage Goals**: 
  - Branches: 70%
  - Functions: 70%
  - Lines: 70%
  - Statements: 70%

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation with express-validator
- Helmet.js for security headers
- CORS configuration

## 📝 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sweets Table
```sql
CREATE TABLE sweets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  image_url VARCHAR(500),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Purchases Table
```sql
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  sweet_id INTEGER REFERENCES sweets(id),
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🤝 Contributing

This project was developed following Test-Driven Development (TDD) principles. All commits follow the pattern:
- Write failing tests (Red)
- Implement functionality (Green)
- Refactor code (Refactor)

## 📄 License

MIT

## 👨‍💻 Author

Developed as part of the Incubyte TDD Kata assessment.
