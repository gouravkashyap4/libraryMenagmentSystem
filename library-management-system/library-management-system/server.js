// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// import cors from "cors";

// // Load env vars
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();

// const cors = require("cors");

// // Body parser middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // ─── Routes ───────────────────────────────────────────────────────────────────
// app.use('/api/auth',   require('./routes/authRoutes'));
// app.use('/api/books',  require('./routes/bookRoutes'));
// app.use('/api/issues', require('./routes/issueRoutes'));

// // ─── Root health check ────────────────────────────────────────────────────────
// app.get('/', (req, res) => {
//   res.json({ success: true, message: 'Library Management API is running 📚' });
// });

// // ─── 404 handler ─────────────────────────────────────────────────────────────
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'Route not found' });
// });

// // ─── Global error handler ─────────────────────────────────────────────────────
// app.use((err, req, res, next) => {
//   console.error(`[ERROR] ${err.message}`);
//   const statusCode = err.statusCode || 500;
//   res.status(statusCode).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
//   });
// });

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });


const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Load env vars
dotenv.config();

// Connect DB
connectDB();

const app = express();

// ─── CORS CONFIG (Dynamic) ────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",                // local frontend
  process.env.CLIENT_URL                  // deployed frontend (from .env)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow Postman / no-origin requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ─── Middleware ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',   require('./routes/authRoutes'));
app.use('/api/books',  require('./routes/bookRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));

// ─── Health Check ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Library API running 🚀' });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// ─── Server Start ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});