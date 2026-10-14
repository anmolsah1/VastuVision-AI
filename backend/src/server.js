/**
 * @file server.js
 * @description Entry point for the Archie AI backend server.
 * Initializes the database connection and starts the HTTP server.
 */

const app = require('./app');
const { connectDB } = require('./config/db');
const config = require('./config/env');
const logger = require('./utils/logger');

const startServer = async () => {
  // Start the HTTP server immediately so port 5000 is ready without delay
  const server = app.listen(config.port, '0.0.0.0', () => {
    logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    logger.info(`🏠  Archie AI — Backend Server`);
    logger.info(`🚀  Running at: http://localhost:${config.port}`);
    logger.info(`🌍  Environment: ${config.nodeEnv}`);
    logger.info(`🤖  AI Mock Mode: ${config.ai.mockMode ? 'ENABLED (demo mode)' : 'DISABLED (using real AI)'}`);
    logger.info(`📡  Text AI: ${config.ai.text.provider} / ${config.ai.text.model}`);
    logger.info(`🎨  Image AI: ${config.ai.image.provider} / ${config.ai.image.model}`);
    logger.info(`📁  Upload Provider: ${config.upload.provider}`);
    logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    if (config.ai.mockMode) {
      logger.warn(`⚠️  Mock mode is ON. Set AI_MOCK_MODE=false and add real API keys for production.`);
    }
  });

  // Connect to MongoDB in background (non-blocking)
  connectDB().catch((err) => {
    logger.warn(`MongoDB not connected: ${err.message}. In-memory storage is active.`);
  });


  // Graceful shutdown handlers
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      logger.info('Server closed.');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    server.close(() => {
      logger.info('Server closed.');
      process.exit(0);
    });
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Promise Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
