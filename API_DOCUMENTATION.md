# 🔌 Sweet Shop API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 📋 API Endpoints Summary

| Endpoint | Method | Auth | Admin Only | Description |
|----------|--------|------|------------|-------------|
| `/auth/register` | POST | ❌ | ❌ | Register new user |
| `/auth/login` | POST | ❌ | ❌ | Login user |
| `/auth/profile` | GET | ✅ | ❌ | Get user profile |
| `/sweets` | GET | ✅ | ❌ | Get all sweets |
| `/sweets/search` | GET | ✅ | ❌ | Search sweets |
| `/sweets/:id` | GET | ✅ | ❌ | Get sweet by ID |
| `/sweets/:id/purchase` | POST | ✅ | ❌ | Purchase sweet |
| `/sweets` | POST | ✅ | ✅ | Create sweet |
| `/sweets/:id` | PUT | ✅ | ✅ | Update sweet |
| `/sweets/:id` | DELETE | ✅ | ✅ | Delete sweet |
| `/sweets/:id/restock` | POST | ✅ | ✅ | Restock sweet |

---

## 🔐 Authentication Endpoints

### Register User

**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "user"  // Optional: "user" or "admin", defaults to "user"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors
- `409 Conflict` - Email already exists

---

### Login

**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials

---

### Get Profile

**GET** `/api/auth/profile`

Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "created_at": "2025-12-14T10:00:00.000Z",
  "updated_at": "2025-12-14T10:00:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized` - No token or invalid token

---

## 🍬 Sweet Management Endpoints

### Get All Sweets

**GET** `/api/sweets`

Retrieve all sweets in the inventory.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Chocolate Bar",
    "category": "Chocolate",
    "price": 2.99,
    "quantity": 100,
    "description": "Delicious milk chocolate",
    "image_url": "/uploads/1234567890.jpg",
    "created_by": 1,
    "created_at": "2025-12-14T10:00:00.000Z",
    "updated_at": "2025-12-14T10:00:00.000Z"
  }
]
```

---

### Search Sweets

**GET** `/api/sweets/search`

Search and filter sweets by various criteria.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `name` (string, optional) - Search by name (partial match, case-insensitive)
- `category` (string, optional) - Filter by category
- `minPrice` (number, optional) - Minimum price
- `maxPrice` (number, optional) - Maximum price

**Example Request:**
```
GET /api/sweets/search?name=chocolate&minPrice=2&maxPrice=5
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Chocolate Bar",
    "category": "Chocolate",
    "price": 2.99,
    "quantity": 100,
    "description": "Delicious milk chocolate",
    "image_url": "/uploads/1234567890.jpg",
    "created_by": 1,
    "created_at": "2025-12-14T10:00:00.000Z",
    "updated_at": "2025-12-14T10:00:00.000Z"
  }
]
```

---

### Get Sweet by ID

**GET** `/api/sweets/:id`

Get details of a specific sweet.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Chocolate Bar",
  "category": "Chocolate",
  "price": 2.99,
  "quantity": 100,
  "description": "Delicious milk chocolate",
  "image_url": "/uploads/1234567890.jpg",
  "created_by": 1,
  "created_at": "2025-12-14T10:00:00.000Z",
  "updated_at": "2025-12-14T10:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - Sweet not found

---

### Create Sweet (Admin Only)

**POST** `/api/sweets`

Create a new sweet. Supports file upload for images.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (string, required) - Sweet name
- `category` (string, required) - Category
- `price` (number, required) - Price (must be >= 0)
- `quantity` (number, required) - Initial quantity (must be >= 0)
- `description` (string, optional) - Description
- `image` (file, optional) - Image file (JPEG, PNG, GIF, WEBP, max 5MB)

**Response (201 Created):**
```json
{
  "id": 2,
  "name": "Gummy Bears",
  "category": "Gummy",
  "price": 1.99,
  "quantity": 50,
  "description": "Colorful fruity gummy bears",
  "image_url": "/uploads/1234567891.jpg",
  "created_by": 1,
  "created_at": "2025-12-14T10:00:00.000Z",
  "updated_at": "2025-12-14T10:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors
- `403 Forbidden` - Not an admin user

---

### Update Sweet (Admin Only)

**PUT** `/api/sweets/:id`

Update an existing sweet. Supports file upload for images.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data (all optional):**
- `name` (string) - Sweet name
- `category` (string) - Category
- `price` (number) - Price
- `quantity` (number) - Quantity
- `description` (string) - Description
- `image` (file) - New image file

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Premium Chocolate Bar",
  "category": "Chocolate",
  "price": 3.99,
  "quantity": 100,
  "description": "Premium dark chocolate",
  "image_url": "/uploads/1234567892.jpg",
  "created_by": 1,
  "created_at": "2025-12-14T10:00:00.000Z",
  "updated_at": "2025-12-14T11:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - Sweet not found
- `403 Forbidden` - Not an admin user

---

### Delete Sweet (Admin Only)

**DELETE** `/api/sweets/:id`

Delete a sweet from inventory.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Sweet deleted successfully"
}
```

**Error Responses:**
- `404 Not Found` - Sweet not found
- `403 Forbidden` - Not an admin user

---

### Purchase Sweet

**POST** `/api/sweets/:id/purchase`

Purchase a sweet (reduces quantity).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 2
}
```

**Response (200 OK):**
```json
{
  "message": "Purchase successful",
  "sweet": {
    "id": 1,
    "name": "Chocolate Bar",
    "category": "Chocolate",
    "price": 2.99,
    "quantity": 98,
    "description": "Delicious milk chocolate",
    "image_url": "/uploads/1234567890.jpg",
    "created_by": 1,
    "created_at": "2025-12-14T10:00:00.000Z",
    "updated_at": "2025-12-14T12:00:00.000Z"
  },
  "purchased": 2,
  "totalPrice": 5.98
}
```

**Error Responses:**
- `400 Bad Request` - Insufficient quantity in stock
- `404 Not Found` - Sweet not found

---

### Restock Sweet (Admin Only)

**POST** `/api/sweets/:id/restock`

Add more stock to a sweet.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 50
}
```

**Response (200 OK):**
```json
{
  "message": "Restock successful",
  "sweet": {
    "id": 1,
    "name": "Chocolate Bar",
    "category": "Chocolate",
    "price": 2.99,
    "quantity": 150,
    "description": "Delicious milk chocolate",
    "image_url": "/uploads/1234567890.jpg",
    "created_by": 1,
    "created_at": "2025-12-14T10:00:00.000Z",
    "updated_at": "2025-12-14T13:00:00.000Z"
  },
  "restocked": 50
}
```

**Error Responses:**
- `404 Not Found` - Sweet not found
- `403 Forbidden` - Not an admin user

---

## 🖼️ Image Upload

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WEBP (.webp)

### Size Limit
- Maximum: 5MB per image

### Access Uploaded Images
Images are accessible at:
```
http://localhost:5000/uploads/<filename>
```

Example:
```
http://localhost:5000/uploads/1765680303162-970890367.jpg
```

---

## ❌ Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 500 | Internal Server Error |

---

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get Sweets (with token):**
```bash
curl -X GET http://localhost:5000/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using PowerShell

**Login:**
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"admin@sweetshop.com","password":"admin123"}'

$token = ($response.Content | ConvertFrom-Json).token
```

**Get Sweets:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/sweets" `
  -Headers @{"Authorization"="Bearer $token"}
```

---

## 🔑 Default Test Accounts

After running `npm run seed`:

**Admin Account:**
- Email: `admin@sweetshop.com`
- Password: `admin123`

**User Account:**
- Email: `user@sweetshop.com`
- Password: `user123`

---

## 📊 Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting middleware.

---

## 🔒 Security Notes

1. **HTTPS**: Use HTTPS in production
2. **JWT Secret**: Change `JWT_SECRET` in production
3. **CORS**: Configure `CORS_ORIGIN` for your domain
4. **File Upload**: Validate file types and sizes
5. **Input Validation**: All inputs are validated using express-validator

---

**Last Updated:** December 14, 2025  
**API Version:** 1.0.0
