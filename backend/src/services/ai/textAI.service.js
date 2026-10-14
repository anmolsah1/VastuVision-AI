/**
 * @file textAI.service.js
 * @description Modular Text/Reasoning AI service.
 *
 * This is the abstraction layer for text AI providers.
 * To switch providers, change AI_TEXT_PROVIDER in your .env file.
 *
 * Supported providers:
 *   - gemini  (Google Gemini API)
 *   - openai  (OpenAI ChatGPT API)
 *   - anthropic (Claude API)
 *   - mock    (returns sample data without calling any API)
 */

const axios = require('axios');
const config = require('../../config/env');
const logger = require('../../utils/logger');

// ── Provider Implementations ──────────────────────────────────────────────────

/**
 * Call the Google Gemini API.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const callGemini = async (prompt) => {
  const { apiKey, model } = config.ai.text;
  if (!apiKey) throw new Error('AI_TEXT_API_KEY is not set for Gemini.');

  const preferredModel = (!model || model === 'gemini-1.5-flash' || model === 'gemini-2.5-pro') ? 'gemini-2.5-flash' : model;
  const candidateModels = [
    preferredModel,
    'gemini-2.5-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-2.5-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-3.6-flash',
  ].filter((m, i, arr) => arr.indexOf(m) === i);

  const isJsonExpected = prompt.includes('JSON') || prompt.includes('json');

  let lastError = null;
  for (const m of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          ...(isJsonExpected ? { responseMimeType: 'application/json' } : {}),
        },
      };

      const response = await axios.post(url, payload, { timeout: 35000 });

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text;
      }
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || err.message;
      logger.warn(`Gemini model ${m} attempt failed: ${errMsg}`);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini model candidates failed.');
};

/**
 * Call the OpenAI ChatCompletion API.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const callOpenAI = async (prompt) => {
  const { apiKey, model } = config.ai.text;
  if (!apiKey) throw new Error('AI_TEXT_API_KEY is not set for OpenAI.');

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are Archie AI, an expert in architectural space planning, Indian Vastu Shastra principles, and modern interior design for residential spaces. Always respond with valid JSON when requested.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    },
    {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      timeout: 60000,
    }
  );

  return response.data.choices?.[0]?.message?.content || '';
};

/**
 * Call the Anthropic Claude API.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const callAnthropic = async (prompt) => {
  const { apiKey, model } = config.ai.text;
  if (!apiKey) throw new Error('AI_TEXT_API_KEY is not set for Anthropic.');

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: model || 'claude-3-haiku-20240307',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );

  return response.data.content?.[0]?.text || '';
};

// ── Public Interface ──────────────────────────────────────────────────────────

/**
 * Generate text/reasoning from the configured AI provider.
 * @param {string} prompt - The full prompt string
 * @returns {Promise<string>} - Raw text response from the AI
 */
const generateText = async (prompt) => {
  const provider = config.ai.text.provider.toLowerCase();
  logger.ai(`Text AI call via provider: ${provider}, model: ${config.ai.text.model}`);

  try {
    switch (provider) {
      case 'gemini':
        return await callGemini(prompt);
      case 'openai':
        return await callOpenAI(prompt);
      case 'anthropic':
        return await callAnthropic(prompt);
      default:
        throw new Error(`Unsupported text AI provider: "${provider}". Check AI_TEXT_PROVIDER.`);
    }
  } catch (error) {
    logger.error(`Text AI call failed: ${error.message}`);
    throw error;
  }
};

module.exports = { generateText };
