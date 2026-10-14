/**
 * @file design.routes.js
 * @description Routes for design CRUD and refinement.
 */
const express = require('express');
const router = express.Router();
const { validateRefinementRequest } = require('../middleware/validation.middleware');
const { listDesigns, getDesign, removeDesign } = require('../controllers/design.controller');
const { refineDesign } = require('../controllers/ai.controller');

// GET /api/designs — List design history
router.get('/', listDesigns);

// GET /api/designs/:id — Get single design
router.get('/:id', getDesign);

// DELETE /api/designs/:id — Delete design
router.delete('/:id', removeDesign);

// POST /api/designs/:id/refine — Chat refinement
router.post('/:id/refine', validateRefinementRequest, refineDesign);

module.exports = router;
