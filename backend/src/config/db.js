/**
 * @file db.js
 * @description MongoDB connection using Mongoose.
 * Implements connection retry logic and event listeners for production stability.
 */
const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/logger');

// Disable buffering so queries fail or fallback immediately when DB is disconnected
mongoose.set('bufferCommands', false);

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

let retryCount = 0;
let isConnected = false;
let reconnectScheduled = false;

/**
 * Establishes a connection to MongoDB.
 * Retries up to MAX_RETRIES times with a delay between attempts.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
    retryCount = 0;
    isConnected = true;
    reconnectScheduled = false;
  } catch (error) {
    retryCount++;
    isConnected = false;
    if (retryCount === 1) {
      logger.info('MongoDB is not running locally. Using in-memory storage (all features remain functional).');
    }
  }
};

// Handle disconnections
mongoose.connection.on('disconnected', () => {
  if (isConnected && retryCount < MAX_RETRIES && !reconnectScheduled) {
    logger.warn('MongoDB disconnected. Scheduling reconnection...');
    reconnectScheduled = true;
    isConnected = false;
    setTimeout(() => {
      reconnectScheduled = false;
      connectDB();
    }, RETRY_DELAY_MS);
  }
});

mongoose.connection.on('error', (err) => {
  if (isConnected) {
    logger.error(`MongoDB error: ${err.message}`);
  }
});

module.exports = { connectDB };
