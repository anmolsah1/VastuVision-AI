/**
 * @file upload.middleware.js
 * @description Multer configuration for handling multipart/form-data file uploads.
 * Validates file type and size before files reach the controller.
 */

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/env');
const { ALLOWED_MIME_TYPES, MAX_SIZE_BYTES } = require('../services/upload/upload.service');

// ── Storage Engine ─────────────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to prevent collisions
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

// ── File Filter ───────────────────────────────────────────────────────────────

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      `Invalid file type: ${file.mimetype}. Only JPG, JPEG, PNG, and WEBP are allowed.`
    );
    error.status = 400;
    cb(error, false);
  }
};

// ── Multer Instance ───────────────────────────────────────────────────────────

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_BYTES,
    files: 10, // Maximum 10 images per design
  },
});

/**
 * Middleware for uploading multiple site photographs.
 * Field name: 'photos'
 */
const uploadPhotos = upload.array('photos', 10);

/**
 * Wrapper to handle multer errors gracefully in Express.
 */
const handleUpload = (req, res, next) => {
  uploadPhotos(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed.',
      });
    }
    next();
  });
};

module.exports = { handleUpload, upload };
