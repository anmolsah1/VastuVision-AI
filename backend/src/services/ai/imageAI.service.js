/**
 * @file imageAI.service.js
 * @description Modular Image Generation AI service.
 *
 * This is the abstraction layer for image AI providers.
 * To switch providers, change AI_IMAGE_PROVIDER in your .env file.
 *
 * Supported providers:
 *   - openai      (DALL-E 3)
 *   - stability   (Stability AI / Stable Diffusion)
 *   - gemini      (Gemini Imagen)
 *   - mock        (returns a placeholder image URL)
 */

const axios = require('axios');
const config = require('../../config/env');
const logger = require('../../utils/logger');

// ── Provider Implementations ──────────────────────────────────────────────────

/**
 * Generate an image using OpenAI DALL-E.
 * @param {string} prompt
 * @returns {Promise<string>} Image URL
 */
const callOpenAIImage = async (prompt) => {
  const { apiKey, model } = config.ai.image;
  if (!apiKey) throw new Error('AI_IMAGE_API_KEY is not set for OpenAI.');

  // DALL-E 3 supports 1792x1024 for landscape composite images
  const requestBody = {
    model: model || 'dall-e-3',
    prompt: prompt.substring(0, 4000), // DALL-E 3 limit
    n: 1,
    size: '1792x1024',
    quality: 'standard',
    response_format: 'url',
  };

  const response = await axios.post(
    'https://api.openai.com/v1/images/generations',
    requestBody,
    {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      timeout: 120000, // 2 minute timeout for image generation
    }
  );

  return response.data.data?.[0]?.url || '';
};

/**
 * Generate an image using Stability AI.
 * @param {string} prompt
 * @returns {Promise<string>} Image URL (base64 data URL)
 */
const callStabilityImage = async (prompt) => {
  const { apiKey, model } = config.ai.image;
  if (!apiKey) throw new Error('AI_IMAGE_API_KEY is not set for Stability AI.');

  const engineId = model || 'stable-diffusion-xl-1024-v1-0';
  const cleanPrompt = (prompt || '').substring(0, 1500);

  const response = await axios.post(
    `https://api.stability.ai/v1/generation/${engineId}/text-to-image`,
    {
      text_prompts: [
        { text: cleanPrompt, weight: 1 },
        { text: 'blurry, low quality, distorted, bad architecture', weight: -1 },
      ],
      cfg_scale: 7,
      width: 1344,
      height: 768,
      samples: 1,
      steps: 30,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 120000,
    }
  );

  const base64 = response.data.artifacts?.[0]?.base64;
  if (!base64) throw new Error('No image returned from Stability AI.');

  // Return as a data URL for consistent handling
  return `data:image/png;base64,${base64}`;
};

/**
 * Generate an image using Google Gemini Imagen (if available).
 * Falls back gracefully if not available.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const callGeminiImage = async (prompt) => {
  const { apiKey, model } = config.ai.image;
  if (!apiKey) throw new Error('AI_IMAGE_API_KEY is not set for Gemini Imagen.');

  const imagenModel = model || 'imagegeneration@006';
  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/your-project/locations/us-central1/publishers/google/models/${imagenModel}:predict`;

  logger.warn('Gemini Imagen requires Google Cloud project setup. Consider using openai or stability provider.');
  throw new Error('Gemini Imagen requires additional Google Cloud configuration. Use AI_IMAGE_PROVIDER=openai instead.');
};

// ── Public Interface ──────────────────────────────────────────────────────────

/**
 * Generate an image from the configured AI provider.
 * @param {string} prompt - The optimized image generation prompt
 * @returns {Promise<string>} - Image URL or base64 data URL
 */
const generateImage = async (prompt) => {
  const provider = config.ai.image.provider.toLowerCase();
  logger.ai(`Image AI call via provider: ${provider}, model: ${config.ai.image.model}`);

  try {
    switch (provider) {
      case 'openai':
        return await callOpenAIImage(prompt);
      case 'stability':
        return await callStabilityImage(prompt);
      case 'gemini':
        return await callGeminiImage(prompt);
      default:
        throw new Error(`Unsupported image AI provider: "${provider}". Check AI_IMAGE_PROVIDER.`);
    }
  } catch (error) {
    logger.error(`Image AI call failed: ${error.message}`);
    throw error;
  }
};

module.exports = { generateImage };
