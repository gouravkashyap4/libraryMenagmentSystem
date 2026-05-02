# 📚 Library Management System API

A complete RESTful backend built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **JWT Authentication**, following MVC architecture.

---

## 🗂 Folder Structure

```
library-management-system/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, Login, Profile
│   ├── bookController.js      # CRUD for books
│   └── issueController.js     # Issue & return books
├── middleware/
│   └── authMiddleware.js      # JWT protect + role-based authorize
├── models/
│   ├── User.js                # User schema (bcrypt password)
│   ├── Book.js                # Book schema
│   └── Issue.js               # Issue/return tracking schema
├── routes/
│   ├── authRoutes.js          # /api/auth
│   ├── bookRoutes.js          # /api/books
│   └── issueRoutes.js         # /api/issues
├── .env.example               # Environment variable template
├── .gitignore
├── package.json
├── README.md
└── server.js                  # Entry point
```

---

## ⚙️ Setup

```bash
# 1. Clone and install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Start in development mode
npm run dev

# 4. Start in production
npm start
```

---

## 🔑 Environment Variables

| Variable    | Description                        | Example                    |
|-------------|------------------------------------|----------------------------|
| PORT        | Server port                        | 5000                       |
| NODE_ENV    | Environment                        | development                |
| MONGO_URI   | MongoDB connection string          | mongodb://localhost:27017/library_db |
| JWT_SECRET  | Secret key for signing JWT tokens  | your_super_secret_key      |
| JWT_EXPIRE  | Token expiry duration              | 7d                         |

---

## 🚀 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint             | Access  | Description               |
|--------|----------------------|---------|---------------------------|
| POST   | /api/auth/register   | Public  | Register a new user       |
| POST   | /api/auth/login      | Public  | Login and receive a token |
| GET    | /api/auth/profile    | Private | Get logged-in user info   |

#### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"           // "user" or "admin"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
// Response includes JWT token — use it as: Authorization: Bearer <token>
```

---

### Book Routes — `/api/books`

| Method | Endpoint         | Access       | Description          |
|--------|------------------|--------------|----------------------|
| GET    | /api/books       | Public       | Get all books        |
| POST   | /api/books       | Admin only   | Add a new book       |
| GET    | /api/books/:id   | Public       | Get single book      |
| PUT    | /api/books/:id   | Admin only   | Update a book        |
| DELETE | /api/books/:id   | Admin only   | Delete a book        |

#### Add Book (Admin)
```json
POST /api/books
Authorization: Bearer <admin_token>
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "978-0132350884",
  "genre": "Programming",
  "description": "A handbook of agile software craftsmanship",
  "totalCopies": 5,
  "publishedYear": 2008
}
```

#### Query Params for GET /api/books
```
/api/books?title=clean&author=martin&genre=programming&available=true
```

---

### Issue Routes — `/api/issues`

All issue routes require authentication (`Authorization: Bearer <token>`).

| Method | Endpoint                      | Access        | Description                    |
|--------|-------------------------------|---------------|--------------------------------|
| POST   | /api/issues/:bookId           | Private       | Issue a book                   |
| PUT    | /api/issues/:issueId/return   | Private       | Return a book                  |
| GET    | /api/issues                   | Private       | Get issues (admin: all; user: own) |
| GET    | /api/issues/my-books          | Private       | Get user's currently issued books |
| GET    | /api/issues/:issueId          | Private       | Get single issue record        |

---

## 🔒 Authentication Flow

1. **Register** or **Login** → receive a JWT token.
2. For protected routes, add the header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Admin-only routes return `403 Forbidden` if accessed by a regular user.

---

## 📦 Dependencies

| Package      | Purpose                          |
|--------------|----------------------------------|
| express      | Web framework                    |
| mongoose     | MongoDB ODM                      |
| bcryptjs     | Password hashing                 |
| jsonwebtoken | JWT creation and verification    |
| dotenv       | Environment variable management  |
| nodemon      | Auto-restart in development      |
