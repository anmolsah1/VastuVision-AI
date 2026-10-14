/**
 * @file validation.middleware.js
 * @description Request validation middleware using express-validator.
 */

const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to check validation results and return errors.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed.',
      details: errors.array().map((e) => e.msg),
    });
  }
  next();
};

/**
 * Validation rules for creating a new design.
 */
const validateDesignRequest = [
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required.')
    .isLength({ min: 2, max: 200 }).withMessage('Location must be 2-200 characters.'),

  body('roomType')
    .notEmpty().withMessage('Room type is required.')
    .isIn([
      'bedroom', 'living_room', 'kitchen', 'bathroom',
      'office', 'studio', 'pooja_room', 'dining_room',
      'hall', 'guest_room',
    ]).withMessage('Invalid room type.'),

  body('areaSqFt')
    .notEmpty().withMessage('Room area is required.')
    .isFloat({ min: 50, max: 10000 }).withMessage('Area must be between 50 and 10,000 sq ft.'),

  body('occupants')
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage('Occupants must be between 1 and 20.'),

  body('budget')
    .optional()
    .isIn(['low', 'medium', 'high', 'luxury']).withMessage('Invalid budget option.'),

  body('designStyle')
    .optional()
    .isIn([
      'modern_indian', 'traditional_indian', 'contemporary',
      'minimalist', 'fusion', 'classic', 'bohemian', 'rustic',
    ]).withMessage('Invalid design style.'),

  handleValidationErrors,
];

/**
 * Validation rules for design refinement requests.
 */
const validateRefinementRequest = [
  param('id')
    .trim()
    .notEmpty().withMessage('Design ID is required.')
    .isLength({ min: 1, max: 100 }).withMessage('Invalid design ID.'),

  body('message')
    .trim()
    .notEmpty().withMessage('Refinement message is required.')
    .isLength({ min: 3, max: 2000 }).withMessage('Message must be 3-2000 characters.'),

  handleValidationErrors,
];

module.exports = {
  validateDesignRequest,
  validateRefinementRequest,
  handleValidationErrors,
};
