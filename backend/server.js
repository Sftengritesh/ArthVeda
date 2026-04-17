require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Validate essential environment variables
const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
requiredEnv.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`🚨 CRITICAL ERROR: Environment variable ${envVar} is missing!`);
    console.error(`Please add it to your environment variables (Render Dashboard -> Environment).`);
    process.exit(1);
  }
});

// Body Parser — must come BEFORE other middleware that reads body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Middleware
app.use(helmet());

// CORS — allow Vite dev server + production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Logging Middleware
app.use(morgan('dev'));

// ======================
// Database Connection
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });

// ======================
// Routes
// ======================
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const aiRoutes = require("./routes/ai");

app.use("/api/auth", authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/ai', aiRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'API is running',
    timestamp: new Date(),
  });
});

// Error Handling Middleware (must be after routes)
app.use(errorHandler);

// ======================
// Start Server
// ======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});