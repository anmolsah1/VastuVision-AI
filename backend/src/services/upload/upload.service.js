/**
 * @file upload.service.js
 * @description File upload and storage abstraction.
 *
 * Currently supports local storage. Designed for easy extension to:
 * - Cloudinary (set UPLOAD_PROVIDER=cloudinary)
 * - AWS S3 (set UPLOAD_PROVIDER=s3)
 *
 * Validates file type, size, and generates accessible URLs.
 */

const path = require('path');
const fs = require('fs');
const config = require('../../config/env');
const logger = require('../../utils/logger');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = config.upload.maxFileSizeMb * 1024 * 1024;

// ── Local Storage ─────────────────────────────────────────────────────────────

/**
 * Saves a file to the local uploads directory and returns metadata.
 * @param {Object} file - Multer file object
 * @returns {Object} - File metadata with accessible URL
 */
const saveLocally = (file) => {
  const relativePath = `/uploads/${file.filename}`;
  const absoluteUrl = `http://localhost:${config.port}${relativePath}`;

  return {
    filename: file.filename,
    originalName: file.originalname,
    url: absoluteUrl,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    provider: 'local',
  };
};

// ── Cloudinary (Placeholder) ──────────────────────────────────────────────────

/**
 * Uploads a file to Cloudinary.
 * Requires: UPLOAD_PROVIDER=cloudinary and Cloudinary credentials in .env
 * @param {Object} file - Multer file object
 * @returns {Promise<Object>}
 */
const uploadToCloudinary = async (file) => {
  // TODO: Install cloudinary package and implement:
  // const cloudinary = require('cloudinary').v2;
  // cloudinary.config({ ... });
  // const result = await cloudinary.uploader.upload(file.path);
  throw new Error('Cloudinary upload not yet configured. Set UPLOAD_PROVIDER=local or add Cloudinary credentials.');
};

// ── AWS S3 (Placeholder) ──────────────────────────────────────────────────────

/**
 * Uploads a file to AWS S3.
 * Requires: UPLOAD_PROVIDER=s3 and AWS credentials in .env
 * @param {Object} file - Multer file object
 * @returns {Promise<Object>}
 */
const uploadToS3 = async (file) => {
  // TODO: Install @aws-sdk/client-s3 and implement
  throw new Error('S3 upload not yet configured. Set UPLOAD_PROVIDER=local or add AWS credentials.');
};

// ── Public Interface ──────────────────────────────────────────────────────────

/**
 * Validates a file before upload.
 * @param {Object} file - Multer file object
 * @returns {{ isValid: boolean, error: string|null }}
 */
const validateFile = (file) => {
  if (!file) return { isValid: false, error: 'No file provided.' };

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return {
      isValid: false,
      error: `Invalid file type: ${file.mimetype}. Allowed types: JPG, JPEG, PNG, WEBP.`,
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: ${config.upload.maxFileSizeMb}MB.`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Processes uploaded files using the configured provider.
 * @param {Object[]} files - Array of Multer file objects
 * @returns {Promise<Object[]>} - Array of file metadata objects
 */
const processUploads = async (files) => {
  if (!files || files.length === 0) return [];

  const provider = config.upload.provider.toLowerCase();
  const results = [];

  for (const file of files) {
    const { isValid, error } = validateFile(file);
    if (!isValid) {
      logger.warn(`File validation failed for ${file.originalname}: ${error}`);
      continue;
    }

    try {
      let metadata;
      switch (provider) {
        case 'cloudinary':
          metadata = await uploadToCloudinary(file);
          break;
        case 's3':
          metadata = await uploadToS3(file);
          break;
        case 'local':
        default:
          metadata = saveLocally(file);
          break;
      }
      results.push(metadata);
      logger.info(`File uploaded: ${file.originalname} → ${metadata.url}`);
    } catch (error) {
      logger.error(`Upload failed for ${file.originalname}: ${error.message}`);
    }
  }

  return results;
};

/**
 * Deletes a locally uploaded file.
 * @param {string} filename
 */
const deleteLocalFile = (filename) => {
  const filePath = path.join(__dirname, '../../../uploads', filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    logger.info(`Deleted local file: ${filename}`);
  }
};

module.exports = { processUploads, validateFile, deleteLocalFile, ALLOWED_MIME_TYPES, MAX_SIZE_BYTES };
