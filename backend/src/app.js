/**
 * @file app.js
 * @description Express application setup.
 * Configures middleware, routes, and error handlers.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const config = require('./config/env');
const { notFoundHandler, globalErrorHandler } = require('./middleware/error.middleware');
const aiRoutes = require('./routes/ai.routes');
const designRoutes = require('./routes/design.routes');

const app = express();

// ── Security Middleware ───────────────────────────────────────────────────────

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow serving uploaded images
  })
);

// ── CORS ──────────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin, localhost, vercel.app, onrender.com, or configured frontendUrl
      if (
        !origin ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('vercel.app') ||
        origin.includes('onrender.com') ||
        origin === config.frontendUrl
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id'],
    credentials: true,
  })
);

// ── Rate Limiting ─────────────────────────────────────────────────────────────

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter limit for AI endpoints (expensive operations)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    error: 'Too many AI generation requests. Please wait a moment before trying again.',
  },
});
app.use('/api/ai/', aiLimiter);

// ── Request Parsing ───────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ───────────────────────────────────────────────────────────────────

if (config.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ── Static Files (Uploaded Images) ───────────────────────────────────────────

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Health Check ──────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'Archie AI API is running',
    mockMode: config.ai.mockMode,
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────

app.use('/api/ai', aiRoutes);
app.use('/api/designs', designRoutes);

// ── Error Handling ────────────────────────────────────────────────────────────

app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
