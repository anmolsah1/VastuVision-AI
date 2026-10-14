/**
 * @file error.middleware.js
 * @description Global error handling middleware.
 * Catches all unhandled errors and returns consistent error responses.
 * Never exposes stack traces or internal details to the client.
 */

const logger = require('../utils/logger');

/**
 * 404 Not Found handler — for unmatched routes.
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Global error handler middleware.
 * Must be registered AFTER all routes.
 */
const globalErrorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.status || 500} — ${err.message} — ${req.method} ${req.originalUrl}`);
  if (process.env.NODE_ENV === 'development') {
    logger.debug(err.stack);
  }

  // Determine response status
  const status = err.status || err.statusCode || 500;

  // Sanitize error message for client
  let message = err.message || 'An unexpected error occurred.';
  
  // For server errors, send a generic message to clients
  if (status === 500) {
    message = 'Something went wrong on our end. Please try again later.';
  }

  // Specific error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format.',
    });
  }

  if (err.code === 11000) {
    // Mongoose duplicate key error
    return res.status(409).json({
      success: false,
      error: 'A record with this information already exists.',
    });
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: `File too large. Maximum allowed size is ${process.env.MAX_FILE_SIZE_MB || 10}MB.`,
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(413).json({
      success: false,
      error: 'Too many files uploaded at once.',
    });
  }

  res.status(status).json({
    success: false,
    error: message,
  });
};

module.exports = { notFoundHandler, globalErrorHandler };
