/**
 * @file ai.routes.js
 * @description Routes for AI operations.
 */
const express = require('express');
const router = express.Router();
const { handleUpload } = require('../middleware/upload.middleware');
const { validateDesignRequest, validateRefinementRequest } = require('../middleware/validation.middleware');
const { generateDesign, analyzeDesign, refineDesign } = require('../controllers/ai.controller');

// POST /api/ai/design — Full pipeline (upload + analyze + generate image)
router.post('/design', handleUpload, validateDesignRequest, generateDesign);

// POST /api/ai/analyze — Analysis only (no image generation)
router.post('/analyze', handleUpload, validateDesignRequest, analyzeDesign);

module.exports = router;
