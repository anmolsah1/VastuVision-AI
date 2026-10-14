/**
 * @file validators.js
 * @description Input validation helpers and design spec validators.
 */

const ALLOWED_ROOM_TYPES = [
  'bedroom', 'living_room', 'kitchen', 'bathroom',
  'office', 'studio', 'pooja_room', 'dining_room',
  'hall', 'guest_room',
];

const ALLOWED_DESIGN_STYLES = [
  'modern_indian', 'traditional_indian', 'contemporary',
  'minimalist', 'fusion', 'classic', 'bohemian', 'rustic',
];

const ALLOWED_BUDGETS = ['low', 'medium', 'high', 'luxury'];

/**
 * Validates design input from the request body.
 * @param {Object} body - The request body
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateDesignInput = (body) => {
  const errors = [];

  if (!body.location || typeof body.location !== 'string' || body.location.trim().length < 2) {
    errors.push('Location must be a valid string (minimum 2 characters).');
  }

  if (!body.roomType || !ALLOWED_ROOM_TYPES.includes(body.roomType)) {
    errors.push(`roomType must be one of: ${ALLOWED_ROOM_TYPES.join(', ')}.`);
  }

  const areaSqFt = parseFloat(body.areaSqFt);
  if (isNaN(areaSqFt) || areaSqFt < 50 || areaSqFt > 10000) {
    errors.push('areaSqFt must be a number between 50 and 10000.');
  }

  const occupants = parseInt(body.occupants, 10);
  if (isNaN(occupants) || occupants < 1 || occupants > 20) {
    errors.push('occupants must be a number between 1 and 20.');
  }

  if (body.budget && !ALLOWED_BUDGETS.includes(body.budget)) {
    errors.push(`budget must be one of: ${ALLOWED_BUDGETS.join(', ')}.`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates that an AI design specification JSON has the required fields.
 * @param {Object} spec - The parsed JSON from the AI
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateDesignSpec = (spec) => {
  const errors = [];
  const required = ['projectSummary', 'vastuAnalysis', 'spacePlan', 'designStyle', 'imageGenerationPrompt'];
  
  required.forEach((key) => {
    if (!spec[key]) {
      errors.push(`Missing required field: ${key}`);
    }
  });

  return { isValid: errors.length === 0, errors };
};

/**
 * Sanitizes a string to prevent injection attacks.
 * @param {string} input
 * @returns {string}
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[<>]/g, '').substring(0, 2000);
};

module.exports = {
  validateDesignInput,
  validateDesignSpec,
  sanitizeString,
  ALLOWED_ROOM_TYPES,
  ALLOWED_DESIGN_STYLES,
  ALLOWED_BUDGETS,
};
