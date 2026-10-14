/**
 * @file aiPipeline.service.js
 * @description The main AI processing pipeline orchestrator.
 *
 * This service coordinates the full design generation flow:
 * 1. Validate input
 * 2. Build design reasoning prompt
 * 3. Call text AI (or mock)
 * 4. Parse and validate JSON response
 * 5. Build image generation prompt
 * 6. Call image AI (or mock)
 * 7. Return complete design result
 *
 * The pipeline is designed to be resilient — it handles AI failures,
 * invalid JSON responses, and implements retry logic.
 */

const { generateText } = require('./textAI.service');
const { generateImage } = require('./imageAI.service');
const { buildDesignPrompt, buildRefinementPrompt } = require('./prompt.service');
const { buildImagePrompt, buildRefinedImagePrompt } = require('./imagePrompt.service');
const { generateMockDesignSpec, generateMockImageUrl, generate6Views } = require('./mockAI.service');
const { validateDesignSpec } = require('../../utils/validators');
const config = require('../../config/env');
const logger = require('../../utils/logger');

// ── JSON Parsing Utilities ────────────────────────────────────────────────────

/**
 * Attempts to extract and parse JSON from an AI text response.
 * Handles cases where the AI wraps JSON in markdown code blocks.
 * @param {string} rawText
 * @returns {Object|null}
 */
const extractJSON = (rawText) => {
  if (!rawText) return null;

  const tryParse = (str) => {
    try {
      return JSON.parse(str);
    } catch (_) {
      return null;
    }
  };

  // 1. Direct parse
  let result = tryParse(rawText.trim());
  if (result) return result;

  // 2. Extract from markdown code fences
  const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    result = tryParse(fenceMatch[1].trim());
    if (result) return result;
  }

  // 3. Extract substring between first '{' and last '}'
  const start = rawText.indexOf('{');
  const end = rawText.lastIndexOf('}');
  if (start !== -1 && end > start) {
    let candidate = rawText.substring(start, end + 1);

    result = tryParse(candidate);
    if (result) return result;

    // Clean common LLM formatting issues:
    // a. Remove single-line comments
    candidate = candidate.replace(/\/\/[^\n\r]*/g, '');

    // b. Remove trailing commas before closing braces/brackets
    candidate = candidate.replace(/,(\s*[}\]])/g, '$1');

    result = tryParse(candidate);
    if (result) return result;

    // c. Replace unescaped control characters in string values
    const sanitized = candidate.replace(/[\x00-\x1F\x7F]/g, (c) => {
      if (c === '\n') return '\\n';
      if (c === '\r') return '\\r';
      if (c === '\t') return '\\t';
      return '';
    });

    result = tryParse(sanitized);
    if (result) return result;
  }

  // 4. Bracket auto-closure if response was truncated mid-JSON
  if (start !== -1) {
    let truncated = rawText.substring(start);
    truncated = truncated.replace(/```[\s\S]*$/, '').trim();

    let openBraces = 0, openBrackets = 0;
    let inString = false, escape = false;

    for (let i = 0; i < truncated.length; i++) {
      const c = truncated[i];
      if (escape) { escape = false; continue; }
      if (c === '\\') { escape = true; continue; }
      if (c === '"') { inString = !inString; continue; }
      if (!inString) {
        if (c === '{') openBraces++;
        if (c === '}') openBraces--;
        if (c === '[') openBrackets++;
        if (c === ']') openBrackets--;
      }
    }

    if (inString) truncated += '"';
    truncated = truncated.replace(/,\s*$/, '');
    while (openBrackets > 0) { truncated += ']'; openBrackets--; }
    while (openBraces > 0) { truncated += '}'; openBraces--; }

    result = tryParse(truncated);
    if (result) return result;
  }

  return null;
};

// ── Pipeline Stages ───────────────────────────────────────────────────────────

/**
 * Stage 1: Run the design reasoning AI to produce a structured design spec.
 * @param {Object} inputParams
 * @param {Function} onProgress - Callback for progress updates
 * @returns {Promise<Object>} - Validated design specification
 */
const runDesignAnalysis = async (inputParams, onProgress = () => {}) => {
  const MAX_RETRIES = 2;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      onProgress({ stage: 'analyzing', message: 'Analyzing your space and requirements...' });

      // Use mock if global mock mode OR no API key set
      if (config.ai.textMockMode) {
        logger.ai('Text AI: using mock mode (no API key or AI_MOCK_MODE=true)');
        return generateMockDesignSpec(inputParams);
      }

      logger.ai(`Design analysis attempt ${attempt}/${MAX_RETRIES} via ${config.ai.text.provider}`);
      onProgress({ stage: 'vastu', message: 'Applying Vastu Shastra considerations...' });

      const prompt = buildDesignPrompt(inputParams);
      const rawResponse = await generateText(prompt);

      onProgress({ stage: 'planning', message: 'Planning furniture and spatial layout...' });

      const parsed = extractJSON(rawResponse);
      if (!parsed) {
        throw new Error(`AI returned invalid JSON (attempt ${attempt}). Raw response length: ${rawResponse?.length}`);
      }

      const { isValid, errors } = validateDesignSpec(parsed);
      if (!isValid) {
        logger.warn(`Design spec validation failed: ${errors.join(', ')}`);
        // For partial failures, merge with defaults rather than retrying
        return { ...generateMockDesignSpec(inputParams), ...parsed };
      }

      return parsed;
    } catch (error) {
      lastError = error;
      logger.error(`Design analysis attempt ${attempt} failed: ${error.message}`);

      if (attempt < MAX_RETRIES) {
        logger.info(`Retrying design analysis in 2s...`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  // If all retries fail, fall back to mock data with a warning
  logger.warn('All design analysis attempts failed. Returning mock design for resilience.');
  const mockSpec = generateMockDesignSpec(inputParams);
  mockSpec._fallback = true;
  mockSpec._fallbackReason = lastError?.message;
  return mockSpec;
};

/**
 * Stage 2: Generate the composite room visualization image.
 * @param {Object} designSpec - The validated design specification
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<string>} - Image URL
 */
const runImageGeneration = async (designSpec, onProgress = () => {}) => {
  try {
    onProgress({ stage: 'image', message: 'Creating 6-view visual concept...' });

    // Use mock image if no image API key or global mock mode
    if (config.ai.imageMockMode) {
      logger.ai('Image AI: using mock mode (no API key or AI_MOCK_MODE=true)');
      // Simulate brief delay so progress bar feels real
      await new Promise((r) => setTimeout(r, 800));
      return generateMockImageUrl(designSpec.roomType, designSpec);
    }

    const imagePrompt = buildImagePrompt(designSpec);
    logger.ai(`Generating composite image (${imagePrompt.length} chars prompt)...`);

    const imageUrl = await generateImage(imagePrompt);
    return imageUrl;
  } catch (error) {
    logger.error(`Image generation failed: ${error.message}`);
    return generateMockImageUrl(designSpec.roomType || 'bedroom', designSpec);
  }
};

// ── Public Pipeline Functions ─────────────────────────────────────────────────

/**
 * Run the complete design generation pipeline.
 * @param {Object} inputParams - Validated user input
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<{ designSpec: Object, imageUrl: string }>}
 */
const runFullPipeline = async (inputParams, onProgress = () => {}) => {
  logger.ai('Starting full Archie AI pipeline...');
  const startTime = Date.now();

  onProgress({ stage: 'start', message: 'Starting AI analysis...', percent: 0 });

  // Stage 1: Design Analysis
  onProgress({ stage: 'analyzing', message: 'Understanding your space...', percent: 10 });
  const designSpec = await runDesignAnalysis(inputParams, onProgress);

  onProgress({ stage: 'planning', message: 'Preparing visualization...', percent: 70 });

  // Stage 2: Image Generation
  const imageUrl = await runImageGeneration(designSpec, onProgress);
  designSpec.heroImageUrl = imageUrl;
  const views = generate6Views(designSpec.roomType, designSpec.requirements, designSpec);
  designSpec.views = views;

  onProgress({ stage: 'complete', message: 'Design ready!', percent: 100 });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  logger.ai(`Pipeline completed in ${elapsed}s. Mock mode: ${config.ai.mockMode}`);

  return {
    designSpec,
    imageUrl: imageUrl || '/views/demo_6views.png',
    views,
    isMockData: config.ai.textMockMode || designSpec._fallback || false,
    isImageMock: config.ai.imageMockMode,
    processingTimeSeconds: parseFloat(elapsed),
  };
};

/**
 * Run the refinement pipeline for chat-based design modifications.
 * @param {Object} params - { changeRequest, existingDesign, conversationHistory }
 * @param {Function} onProgress
 * @returns {Promise<{ designSpec: Object, imageUrl: string }>}
 */
const runRefinementPipeline = async (params, onProgress = () => {}) => {
  const { changeRequest, existingDesign, conversationHistory = [] } = params;
  logger.ai(`Running refinement pipeline: "${changeRequest}"`);

  onProgress({ stage: 'refining', message: 'Understanding your change request...' });

  let updatedSpec;

  if (config.ai.mockMode || !config.ai.text.apiKey) {
    // In mock mode, simulate a modification by updating the summary
    updatedSpec = {
      ...existingDesign,
      projectSummary: `${existingDesign.projectSummary} [Refined: ${changeRequest}]`,
      _refined: true,
      _refinementRequest: changeRequest,
    };
  } else {
    const prompt = buildRefinementPrompt({
      changeRequest,
      existingDesign,
      conversationHistory,
    });

    const rawResponse = await generateText(prompt);
    const parsed = extractJSON(rawResponse);

    if (!parsed) {
      logger.warn('Refinement AI returned invalid JSON. Using existing spec with summary update.');
      updatedSpec = {
        ...existingDesign,
        projectSummary: `${existingDesign.projectSummary} [Updated: ${changeRequest}]`,
      };
    } else {
      updatedSpec = parsed;
    }
  }

  onProgress({ stage: 'image', message: 'Regenerating visualization...' });

  // Generate a new image for the updated spec
  let imageUrl;
  if (config.ai.mockMode || !config.ai.image.apiKey) {
    imageUrl = generateMockImageUrl(updatedSpec.roomType || 'bedroom');
  } else {
    const imagePrompt = buildRefinedImagePrompt(updatedSpec, changeRequest);
    imageUrl = await generateImage(imagePrompt);
  }

  const views = generate6Views(updatedSpec.roomType || 'bedroom', updatedSpec.requirements || [], updatedSpec);
  updatedSpec.views = views;

  return {
    designSpec: updatedSpec,
    imageUrl: imageUrl || '/views/demo_6views.png',
    views,
    isMockData: config.ai.mockMode || !config.ai.text.apiKey,
  };
};

module.exports = { runFullPipeline, runRefinementPipeline, extractJSON };
