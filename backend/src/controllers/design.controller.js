/**
 * @file design.controller.js
 * @description Controller for design CRUD operations.
 */

const {
  getDesignHistory,
  getDesignById,
  deleteDesign,
} = require('../services/design/design.service');
const logger = require('../utils/logger');

/**
 * GET /api/designs
 * Returns paginated design history for the current session.
 */
const listDesigns = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    if (!sessionId) {
      return res.status(200).json({
        success: true,
        data: { designs: [], total: 0, page: 1, totalPages: 0 },
      });
    }

    const result = await getDesignHistory({ sessionId }, { page, limit });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error(`List designs error: ${error.message}`);
    return res.status(500).json({ success: false, error: 'Failed to fetch designs.' });
  }
};

/**
 * GET /api/designs/:id
 * Returns a single design by ID.
 */
const getDesign = async (req, res) => {
  try {
    const design = await getDesignById(req.params.id);
    if (!design) {
      return res.status(404).json({ success: false, error: 'Design not found.' });
    }
    return res.status(200).json({ success: true, data: design });
  } catch (error) {
    logger.error(`Get design error: ${error.message}`);
    return res.status(500).json({ success: false, error: 'Failed to fetch design.' });
  }
};

/**
 * DELETE /api/designs/:id
 * Deletes a design and all its versions.
 */
const removeDesign = async (req, res) => {
  try {
    const deleted = await deleteDesign(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Design not found.' });
    }
    return res.status(200).json({ success: true, message: 'Design deleted successfully.' });
  } catch (error) {
    logger.error(`Delete design error: ${error.message}`);
    return res.status(500).json({ success: false, error: 'Failed to delete design.' });
  }
};

module.exports = { listDesigns, getDesign, removeDesign };
