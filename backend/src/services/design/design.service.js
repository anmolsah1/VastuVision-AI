/**
 * @file design.service.js
 * @description Business logic for design CRUD operations.
 * Abstracts database operations from controllers.
 */

const mongoose = require('mongoose');
const Design = require('../../models/Design');
const DesignVersion = require('../../models/DesignVersion');
const logger = require('../../utils/logger');

// In-memory fallback cache when MongoDB is not running
const inMemoryDesigns = new Map();
const inMemoryVersions = new Map();
let memIdCounter = 1;

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Creates a new design record in the database or in-memory fallback.
 * @param {Object} params
 * @returns {Promise<Object>}
 */
const createDesign = async (params) => {
  const {
    sessionId,
    userId,
    location,
    normalizedLocation,
    roomType,
    dimensions,
    occupants,
    budget,
    designStyle,
    requirements,
    uploadedImages,
    designSpec,
    imageUrl,
    isMockData = false,
  } = params;

  const areaPart = dimensions?.areaSqFt ? `${dimensions.areaSqFt} sq ft ` : '';
  const stylePart = designStyle ? `${designStyle.replace(/_/g, ' ')} ` : '';
  const title = `${areaPart}${stylePart}${roomType?.replace(/_/g, ' ')} in ${normalizedLocation || location}`;
  const formattedTitle = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  if (!isDbConnected()) {
    const memId = `mem_${Date.now()}_${memIdCounter++}`;
    const memDoc = {
      _id: memId,
      id: memId,
      sessionId,
      userId,
      title: formattedTitle,
      location,
      normalizedLocation,
      roomType,
      dimensions: {
        areaSqFt: dimensions?.areaSqFt,
        length: dimensions?.length,
        width: dimensions?.width,
      },
      occupants,
      budget,
      designStyle,
      requirements,
      uploadedImages: uploadedImages || [],
      siteAnalysis: designSpec?.siteAnalysis,
      vastuAnalysis: designSpec?.vastuAnalysis,
      spacePlan: designSpec?.spacePlan,
      designStyleSpec: designSpec?.designStyle,
      projectSummary: designSpec?.projectSummary,
      recommendations: designSpec?.recommendations || [],
      assumptions: designSpec?.siteAnalysis?.assumptions || [],
      imagePrompt: designSpec?.imageGenerationPrompt,
      generatedImages: imageUrl
        ? [{ url: imageUrl, provider: 'ai', model: 'composite', version: 1 }]
        : [],
      status: 'completed',
      isMockData,
      version: 1,
      conversationHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryDesigns.set(memId, memDoc);
    logger.info(`Design stored in-memory: ${memId} (${formattedTitle})`);
    return memDoc;
  }

  const design = new Design({
    sessionId,
    userId,
    title: title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    location,
    normalizedLocation,
    roomType,
    dimensions: {
      areaSqFt: dimensions?.areaSqFt,
      length: dimensions?.length,
      width: dimensions?.width,
    },
    occupants,
    budget,
    designStyle,
    requirements,
    uploadedImages,

    // AI Results
    siteAnalysis: designSpec?.siteAnalysis,
    vastuAnalysis: designSpec?.vastuAnalysis,
    spacePlan: designSpec?.spacePlan,
    designStyleSpec: designSpec?.designStyle,
    projectSummary: designSpec?.projectSummary,
    recommendations: designSpec?.recommendations || [],
    assumptions: designSpec?.siteAnalysis?.assumptions || [],
    imagePrompt: designSpec?.imageGenerationPrompt,

    generatedImages: imageUrl
      ? [{ url: imageUrl, provider: 'ai', model: 'composite', version: 1 }]
      : [],

    status: 'completed',
    isMockData,
    version: 1,
  });

  await design.save();
  logger.info(`Design created: ${design._id} (${title})`);
  return design;
};

/**
 * Saves a design version snapshot after refinement.
 * @param {Object} params
 * @returns {Promise<DesignVersion>}
 */
const saveDesignVersion = async (params) => {
  const { designId, version, designSpecification, imageUrl, changeRequest, isMockData } = params;

  if (!isDbConnected()) {
    const versionDoc = {
      _id: `ver_${Date.now()}_${memIdCounter++}`,
      designId,
      version,
      changeRequest,
      designSpecification,
      imageUrl,
      isMockData,
      createdAt: new Date(),
    };
    inMemoryVersions.set(versionDoc._id, versionDoc);
    return versionDoc;
  }

  const versionDoc = new DesignVersion({
    designId,
    version,
    changeRequest,
    designSpecification,
    imageUrl,
    isMockData,
  });

  await versionDoc.save();
  return versionDoc;
};

/**
 * Gets paginated design history for a session or user.
 * @param {Object} filter - { sessionId } or { userId }
 * @param {Object} options - { page, limit }
 * @returns {Promise<{ designs: Design[], total: number }>}
 */
const getDesignHistory = async (filter, { page = 1, limit = 20 } = {}) => {
  if (!isDbConnected()) {
    let all = Array.from(inMemoryDesigns.values());
    if (filter.sessionId) {
      all = all.filter(d => d.sessionId === filter.sessionId);
    }
    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = all.length;
    const skip = (page - 1) * limit;
    const designs = all.slice(skip, skip + limit);
    return { designs, total, page, totalPages: Math.ceil(total / limit) || 1 };
  }

  const skip = (page - 1) * limit;

  const [designs, total] = await Promise.all([
    Design.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-imagePrompt -conversationHistory')
      .lean(),
    Design.countDocuments(filter),
  ]);

  return { designs, total, page, totalPages: Math.ceil(total / limit) };
};

/**
 * Gets a single design by ID.
 * @param {string} id
 * @returns {Promise<Design|null>}
 */
const getDesignById = async (id) => {
  if (!isDbConnected()) {
    return inMemoryDesigns.get(id) || null;
  }
  return Design.findById(id).lean();
};

/**
 * Deletes a design and all its versions.
 * @param {string} id
 * @returns {Promise<boolean>}
 */
const deleteDesign = async (id) => {
  if (!isDbConnected()) {
    const existed = inMemoryDesigns.delete(id);
    for (const [vId, v] of inMemoryVersions.entries()) {
      if (v.designId === id) inMemoryVersions.delete(vId);
    }
    return existed;
  }

  const design = await Design.findByIdAndDelete(id);
  if (design) {
    await DesignVersion.deleteMany({ designId: id });
    logger.info(`Design deleted: ${id}`);
    return true;
  }
  return false;
};

/**
 * Updates a design with refined data.
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Design>}
 */
const updateDesign = async (id, updates) => {
  if (!isDbConnected()) {
    const existing = inMemoryDesigns.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    inMemoryDesigns.set(id, updated);
    return updated;
  }

  const design = await Design.findByIdAndUpdate(id, { $set: updates }, { new: true });
  return design;
};

/**
 * Appends a message to the design's conversation history.
 * @param {string} designId
 * @param {{ role: string, content: string }} message
 */
const addToConversation = async (designId, message) => {
  if (!isDbConnected()) {
    const existing = inMemoryDesigns.get(designId);
    if (existing) {
      if (!existing.conversationHistory) existing.conversationHistory = [];
      existing.conversationHistory.push({ ...message, timestamp: new Date() });
    }
    return;
  }

  await Design.findByIdAndUpdate(designId, {
    $push: {
      conversationHistory: { ...message, timestamp: new Date() },
    },
  });
};

module.exports = {
  createDesign,
  saveDesignVersion,
  getDesignHistory,
  getDesignById,
  deleteDesign,
  updateDesign,
  addToConversation,
};
