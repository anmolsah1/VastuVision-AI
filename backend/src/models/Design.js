/**
 * @file Design.js
 * @description Mongoose model for an Archie AI design.
 * Stores the full design lifecycle from user input → AI analysis → generated image.
 */
const mongoose = require('mongoose');

// ── Sub-schemas ───────────────────────────────────────────────────────────────

const dimensionsSchema = new mongoose.Schema({
  areaSqFt: { type: Number },
  length: { type: Number },
  width: { type: Number },
}, { _id: false });

const vastuItemSchema = new mongoose.Schema({
  recommendation: { type: String },
  reason: { type: String },
  type: { type: String, enum: ['vastu', 'practical', 'both'], default: 'both' },
}, { _id: false });

const vastuAnalysisSchema = new mongoose.Schema({
  entrance: vastuItemSchema,
  bed: vastuItemSchema,
  bathroom: vastuItemSchema,
  storage: vastuItemSchema,
  studyArea: vastuItemSchema,
  kitchen: vastuItemSchema,
  windows: vastuItemSchema,
  additionalNotes: { type: String },
}, { _id: false });

const siteAnalysisSchema = new mongoose.Schema({
  shape: { type: String },
  estimatedEntranceDirection: { type: String },
  windows: [{ type: String }],
  naturalLight: { type: String },
  ventilation: { type: String },
  existingFurniture: [{ type: String }],
  assumptions: [{ type: String }],
  knownInfo: [{ type: String }],
  estimatedInfo: [{ type: String }],
}, { _id: false });

const spacePlanSchema = new mongoose.Schema({
  zones: [{ type: String }],
  furniture: [{ type: String }],
  circulation: { type: String },
  lighting: { type: String },
  ventilation: { type: String },
}, { _id: false });

const designStyleSchema = new mongoose.Schema({
  style: { type: String },
  colors: [{ type: String }],
  materials: [{ type: String }],
  lighting: [{ type: String }],
  furnitureStyle: { type: String },
  textures: [{ type: String }],
}, { _id: false });

// ── Main Design Schema ────────────────────────────────────────────────────────

const designSchema = new mongoose.Schema(
  {
    // Ownership — userId OR sessionId for guest users
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    sessionId: {
      type: String,
      required: false,
    },

    // Display
    title: {
      type: String,
      default: 'Untitled Design',
      maxlength: 200,
    },

    // User Inputs
    location: {
      type: String,
      required: true,
      trim: true,
    },
    normalizedLocation: {
      type: String,
      trim: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    dimensions: dimensionsSchema,
    occupants: {
      type: Number,
      min: 1,
    },
    budget: {
      type: String,
      enum: ['low', 'medium', 'high', 'luxury'],
      default: 'medium',
    },
    designStyle: {
      type: String,
      default: 'modern_indian',
    },
    requirements: [{ type: String }],

    // Uploaded photos metadata
    uploadedImages: [
      {
        filename: String,
        originalName: String,
        url: String,
        mimeType: String,
        sizeBytes: Number,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // AI Pipeline Results
    siteAnalysis: siteAnalysisSchema,
    vastuAnalysis: vastuAnalysisSchema,
    spacePlan: spacePlanSchema,
    designStyleSpec: designStyleSchema,
    projectSummary: { type: String },
    recommendations: [{ type: String }],
    assumptions: [{ type: String }],

    // Image Generation
    imagePrompt: { type: String },
    generatedImages: [
      {
        url: String,
        provider: String,
        model: String,
        generatedAt: { type: Date, default: Date.now },
        version: { type: Number, default: 1 },
      },
    ],

    // Chat refinement state
    conversationHistory: [
      {
        role: { type: String, enum: ['user', 'assistant'] },
        content: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // Versioning
    version: { type: Number, default: 1 },

    // Status tracking
    status: {
      type: String,
      enum: ['pending', 'analyzing', 'generating', 'completed', 'failed'],
      default: 'pending',
    },
    errorMessage: { type: String },

    // Mock mode flag (for college demo)
    isMockData: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Index for fast user/session lookup
designSchema.index({ userId: 1, createdAt: -1 });
designSchema.index({ sessionId: 1, createdAt: -1 });

module.exports = mongoose.model('Design', designSchema);
