/**
 * @file env.js
 * @description Centralized environment variable configuration and validation.
 * Loads variables from .env and exports typed constants for the rest of the app.
 */
require('dotenv').config();

const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',

  // Database
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/vastuvision',

  // Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // AI - Text/Reasoning
  ai: {
    text: {
      provider: process.env.AI_TEXT_PROVIDER || 'gemini',
      apiKey: process.env.AI_TEXT_API_KEY || '',
      model: process.env.AI_TEXT_MODEL || 'gemini-1.5-flash',
    },
    image: {
      provider: process.env.AI_IMAGE_PROVIDER || 'openai',
      apiKey: process.env.AI_IMAGE_API_KEY || '',
      model: process.env.AI_IMAGE_MODEL || 'dall-e-3',
    },
    // Global mock mode — forces BOTH text and image to use mock data
    mockMode: process.env.AI_MOCK_MODE === 'true',
    // Granular control — auto-detected: if a key is missing, that service is mocked
    get textMockMode() {
      return process.env.AI_MOCK_MODE === 'true' || !process.env.AI_TEXT_API_KEY;
    },
    get imageMockMode() {
      return process.env.AI_MOCK_MODE === 'true' || !process.env.AI_IMAGE_API_KEY;
    },
  },

  // File Uploads
  upload: {
    provider: process.env.UPLOAD_PROVIDER || 'local',
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10,
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_REGION || '',
      bucket: process.env.AWS_S3_BUCKET || '',
    },
  },

  // Location / Geocoding
  location: {
    provider: process.env.GEOCODING_PROVIDER || 'none',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
};

module.exports = config;
