/**
 * @file ai.controller.js
 * @description Controller for AI-related endpoints.
 * Handles the full design generation pipeline and image generation.
 */

const { runFullPipeline, runRefinementPipeline } = require('../services/ai/aiPipeline.service');
const { normalizeLocation } = require('../services/location/location.service');
const { processUploads } = require('../services/upload/upload.service');
const {
  createDesign,
  getDesignById,
  updateDesign,
  saveDesignVersion,
  addToConversation,
} = require('../services/design/design.service');
const config = require('../config/env');
const logger = require('../utils/logger');

/**
 * POST /api/ai/design
 * Runs the full AI design generation pipeline.
 * Accepts multipart/form-data with optional image uploads.
 */
const generateDesign = async (req, res) => {
  try {
    const {
      location,
      roomType,
      areaSqFt,
      length,
      width,
      occupants = 2,
      budget = 'medium',
      designStyle = 'modern_indian',
      requirements = [],
      sessionId,
    } = req.body;

    // Parse requirements (may come as JSON string or array)
    const parsedRequirements = Array.isArray(requirements)
      ? requirements
      : typeof requirements === 'string'
      ? JSON.parse(requirements || '[]')
      : [];

    // Normalize location
    const normalizedLocation = normalizeLocation(location);

    // Process uploaded photos
    const uploadedImages = req.files ? await processUploads(req.files) : [];

    logger.info(`Design request: ${roomType} in ${normalizedLocation} (${areaSqFt} sqft, ${occupants} occupants)`);
    logger.info(`Mock mode: ${config.ai.mockMode} | Photos: ${uploadedImages.length}`);

    // Build pipeline input
    const pipelineInput = {
      location,
      normalizedLocation,
      roomType,
      areaSqFt: parseFloat(areaSqFt),
      length: length ? parseFloat(length) : null,
      width: width ? parseFloat(width) : null,
      occupants: parseInt(occupants, 10),
      budget,
      designStyle,
      requirements: parsedRequirements,
      uploadedImages,
    };

    // Run the full AI pipeline
    const { designSpec, imageUrl, isMockData, processingTimeSeconds } = await runFullPipeline(
      pipelineInput,
      (progress) => {
        // Progress is tracked in the pipeline — for SSE or WebSocket you'd emit here
        logger.ai(`Pipeline stage: ${progress.stage} — ${progress.message}`);
      }
    );

    // Save to database (non-blocking if DB is not available)
    let savedDesign = null;
    try {
      savedDesign = await createDesign({
        sessionId: sessionId || req.headers['x-session-id'],
        location,
        normalizedLocation,
        roomType,
        dimensions: {
          areaSqFt: parseFloat(areaSqFt),
          length: length ? parseFloat(length) : designSpec?.dimensions?.length,
          width: width ? parseFloat(width) : designSpec?.dimensions?.width,
        },
        occupants: parseInt(occupants, 10),
        budget,
        designStyle,
        requirements: parsedRequirements,
        uploadedImages,
        designSpec,
        imageUrl,
        isMockData,
      });
    } catch (dbErr) {
      logger.error(`DB save failed (non-fatal): ${dbErr.message}`);
    }

    // Build response
    return res.status(200).json({
      success: true,
      data: {
        designId: savedDesign?._id || null,
        designSpec,
        imageUrl,
        views: designSpec?.views || [],
        isMockData,
        processingTimeSeconds,
        mockModeEnabled: config.ai.mockMode,
      },
    });
  } catch (error) {
    logger.error(`Design generation error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong while generating your design. Please try again.',
      details: config.isDevelopment ? error.message : undefined,
    });
  }
};

/**
 * POST /api/ai/analyze
 * Runs only the design analysis step (without image generation).
 */
const analyzeDesign = async (req, res) => {
  try {
    const { location, roomType, areaSqFt, occupants, budget, designStyle, requirements } = req.body;
    const normalizedLocation = normalizeLocation(location);

    const { designSpec } = await runFullPipeline({
      location,
      normalizedLocation,
      roomType,
      areaSqFt: parseFloat(areaSqFt),
      occupants: parseInt(occupants || 2, 10),
      budget,
      designStyle,
      requirements: requirements || [],
    });

    return res.status(200).json({ success: true, data: { designSpec } });
  } catch (error) {
    logger.error(`Analyze error: ${error.message}`);
    return res.status(500).json({ success: false, error: 'Analysis failed. Please try again.' });
  }
};

/**
 * POST /api/designs/:id/refine
 * Refines an existing design based on a user chat message.
 */
const refineDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    // Get the existing design
    const existingDesign = await getDesignById(id);
    if (!existingDesign) {
      return res.status(404).json({ success: false, error: 'Design not found.' });
    }

    logger.info(`Refining design ${id}: "${message}"`);

    // Run refinement pipeline
    const { designSpec, imageUrl, isMockData } = await runRefinementPipeline(
      {
        changeRequest: message,
        existingDesign: existingDesign.designSpec || existingDesign,
        conversationHistory: existingDesign.conversationHistory || [],
      },
      (progress) => logger.ai(`Refinement stage: ${progress.stage}`)
    );

    const newVersion = (existingDesign.version || 1) + 1;

    // Save new version
    await saveDesignVersion({
      designId: id,
      version: newVersion,
      designSpecification: designSpec,
      imageUrl,
      changeRequest: message,
      isMockData,
    });

    // Update the main design
    await updateDesign(id, {
      siteAnalysis: designSpec.siteAnalysis,
      vastuAnalysis: designSpec.vastuAnalysis,
      spacePlan: designSpec.spacePlan,
      designStyleSpec: designSpec.designStyle,
      projectSummary: designSpec.projectSummary,
      imagePrompt: designSpec.imageGenerationPrompt,
      $push: { generatedImages: { url: imageUrl, version: newVersion } },
      version: newVersion,
    });

    // Add messages to conversation history
    await addToConversation(id, { role: 'user', content: message });
    await addToConversation(id, {
      role: 'assistant',
      content: `Design updated: ${designSpec.projectSummary?.substring(0, 200)}...`,
    });

    return res.status(200).json({
      success: true,
      data: {
        designId: id,
        version: newVersion,
        designSpec,
        imageUrl,
        isMockData,
      },
    });
  } catch (error) {
    logger.error(`Refinement error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong while refining your design. Please try again.',
    });
  }
};

module.exports = { generateDesign, analyzeDesign, refineDesign };
