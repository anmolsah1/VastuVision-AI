/**
 * @file DesignVersion.js
 * @description Stores design revision history for the refinement/chat flow.
 * Each time a user modifies a design, a new version is saved here.
 */
const mongoose = require('mongoose');

const designVersionSchema = new mongoose.Schema(
  {
    // Reference to the parent Design
    designId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Design',
      required: true,
    },

    // Version number (increments with each refinement)
    version: {
      type: Number,
      required: true,
      default: 1,
    },

    // The user's refinement request that triggered this version
    changeRequest: {
      type: String,
      maxlength: 2000,
    },

    // The full design specification at this version (snapshot)
    designSpecification: {
      type: mongoose.Schema.Types.Mixed,
    },

    // The image prompt used for this version
    imagePrompt: {
      type: String,
    },

    // The generated image URL for this version
    imageUrl: {
      type: String,
    },

    // AI provider used
    aiProvider: {
      text: { type: String },
      image: { type: String },
    },

    // Flag for mock data (for demo)
    isMockData: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

designVersionSchema.index({ designId: 1, version: 1 });

module.exports = mongoose.model('DesignVersion', designVersionSchema);
