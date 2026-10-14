/**
 * @file imagePrompt.service.js
 * @description Converts the structured design specification JSON into
 * an optimized image generation prompt for creating 6-view composite images.
 *
 * The prompt is carefully engineered to:
 * 1. Request ONE composite image with 6 clearly labeled panels
 * 2. Maintain architectural consistency across all panels
 * 3. Reflect Indian residential design aesthetics
 * 4. Specify photorealistic rendering style
 */

/**
 * Generates the 6-view descriptions based on room type.
 * @param {string} roomType
 * @returns {string[]} Array of 6 view descriptions
 */
const getViewsForRoomType = (roomType) => {
  const views = {
    bedroom: [
      'VIEW 1 (TOP-LEFT): Bird\'s eye top-down floor plan view showing room layout and furniture arrangement',
      'VIEW 2 (TOP-CENTER): Main entrance perspective looking into the room from the doorway',
      'VIEW 3 (TOP-RIGHT): Bed and sleeping area — headboard wall, bedside tables, lighting',
      'VIEW 4 (BOTTOM-LEFT): Wardrobe and storage wall — full-height wardrobes, dresser',
      'VIEW 5 (BOTTOM-CENTER): Study and work area — desk, chair, shelving, task lighting',
      'VIEW 6 (BOTTOM-RIGHT): Overall room perspective from corner — shows full spatial flow',
    ],
    living_room: [
      'VIEW 1 (TOP-LEFT): Bird\'s eye top-down floor plan view showing furniture arrangement',
      'VIEW 2 (TOP-CENTER): Main seating area — sofa, coffee table, entertainment unit',
      'VIEW 3 (TOP-RIGHT): Feature wall — TV wall, artwork, decorative elements',
      'VIEW 4 (BOTTOM-LEFT): Window/balcony side — natural light, curtains, side tables',
      'VIEW 5 (BOTTOM-CENTER): Dining and multi-purpose zone if applicable',
      'VIEW 6 (BOTTOM-RIGHT): Overall room perspective from main entrance',
    ],
    kitchen: [
      'VIEW 1 (TOP-LEFT): Bird\'s eye top-down floor plan view of kitchen layout',
      'VIEW 2 (TOP-CENTER): Main cooking area — hob, chimney, counter workspace',
      'VIEW 3 (TOP-RIGHT): Storage wall — upper and lower cabinets, pantry',
      'VIEW 4 (BOTTOM-LEFT): Sink and preparation area with natural light',
      'VIEW 5 (BOTTOM-CENTER): Kitchen entrance and overall flow',
      'VIEW 6 (BOTTOM-RIGHT): Full kitchen perspective showing all elements together',
    ],
    office: [
      'VIEW 1 (TOP-LEFT): Bird\'s eye top-down floor plan of office layout',
      'VIEW 2 (TOP-CENTER): Primary workstation — desk, monitor, task lighting',
      'VIEW 3 (TOP-RIGHT): Storage and bookshelf wall',
      'VIEW 4 (BOTTOM-LEFT): Meeting or focus area if present',
      'VIEW 5 (BOTTOM-CENTER): Window and natural light utilization',
      'VIEW 6 (BOTTOM-RIGHT): Overall office perspective from entrance',
    ],
  };

  return views[roomType] || views.bedroom;
};

/**
 * Builds an optimized image generation prompt from the design specification.
 * @param {Object} designSpec - The parsed JSON from the text AI
 * @returns {string} - The image generation prompt
 */
const buildImagePrompt = (designSpec) => {
  const {
    roomType = 'bedroom',
    dimensions = {},
    designStyle = {},
    spacePlan = {},
    vastuAnalysis = {},
    colorPalette = {},
    normalizedLocation = 'Navi Mumbai',
    occupants = 2,
  } = designSpec;

  const views = getViewsForRoomType(roomType);
  const viewsText = views.join('\n');

  const colors = designStyle.colors?.join(', ') || 'warm whites, earthy tones, gold accents';
  const materials = designStyle.materials?.join(', ') || 'natural wood, marble, fabric';
  const furniture = spacePlan.furniture?.slice(0, 5).join('; ') || 'bed, wardrobe, study desk, side tables';
  const style = designStyle.style || 'Modern Indian';
  const lighting = designStyle.lighting?.join(', ') || 'warm LED, pendant lights, task lighting';

  const primaryColor = colorPalette.primary || '#F5E6C8';
  const accentColor = colorPalette.accent || '#C8860A';

  const prompt = `Create a single professional architectural visualization board showing a ${dimensions.areaSqFt || 400} sq ft ${roomType.replace(/_/g, ' ')} in ${normalizedLocation}, India.

CRITICAL: This MUST be ONE single composite image divided into a 3-column × 2-row grid showing EXACTLY 6 panels. Each panel has a clear label. All 6 panels show the SAME room with consistent architecture, furniture, and styling.

ROOM SPECIFICATIONS:
- Room Type: ${roomType.replace(/_/g, ' ')} for ${occupants} person(s)
- Area: ${dimensions.areaSqFt || 400} sq ft, approx ${dimensions.length || 20}ft × ${dimensions.width || 20}ft
- Style: ${style} interior design
- Primary colors: ${colors}
- Primary color hex: ${primaryColor}, Accent color hex: ${accentColor}
- Materials: ${materials}
- Lighting: ${lighting}
- Furniture: ${furniture}

LAYOUT CONSISTENCY RULES:
- SAME room dimensions and proportions in ALL panels
- SAME furniture placement (do not move furniture between panels)
- SAME color palette, materials, and finishes throughout
- SAME architectural features (windows, doors, ceiling height ~9ft)
- SAME Indian residential design aesthetic throughout
- No impossible geometry or floating furniture

ARCHITECTURAL DETAILS:
- Indian residential apartment setting
- Modern ${style} aesthetic — clean lines with warm Indian touches
- Warm LED lighting with layered light sources
- Large windows with sheer curtains for natural light
- Polished marble or premium vitrified tile flooring
- Textured accent wall with subtle Indian motif or solid color
- Wooden furniture with warm tones
- Plants/greenery as accent elements

THE 6 PANELS (3 columns × 2 rows):
${viewsText}

RENDERING STYLE:
- Photorealistic architectural visualization
- Professional interior design presentation quality
- Soft, warm lighting atmosphere
- High detail level — crisp edges, realistic shadows and reflections
- Style similar to luxury real estate visualization
- Each panel labeled with its view name in clean, minimal typography
- Clean white dividers separating the 6 panels
- Overall board has a professional layout with "Archie AI" watermark in corner

AVOID:
- Random furniture changes between panels
- Mismatched colors or materials
- Cartoon or sketch style
- Blurry or low-quality rendering
- Empty panels
- Inconsistent room proportions

${designSpec.imageGenerationPrompt || ''}`;

  return prompt;
};

/**
 * Builds a refined image prompt incorporating changes from the refinement flow.
 * @param {Object} updatedSpec - Updated design spec
 * @param {string} changeRequest - What the user asked to change
 * @returns {string}
 */
const buildRefinedImagePrompt = (updatedSpec, changeRequest) => {
  const basePrompt = buildImagePrompt(updatedSpec);
  return `${basePrompt}

REFINEMENT CHANGE:
The user requested: "${changeRequest}"
Apply this change consistently across ALL 6 panels.`;
};

module.exports = { buildImagePrompt, buildRefinedImagePrompt, getViewsForRoomType };
