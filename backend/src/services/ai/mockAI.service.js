/**
 * @file mockAI.service.js
 * @description Returns realistic sample AI responses without calling any external API.
 *
 * USE CASE: Development, demos, and testing when AI API keys are not available.
 * Enable by setting AI_MOCK_MODE=true in your .env file.
 *
 * The mock data is designed to be realistic and demonstrate the full
 * frontend/backend flow for college demonstrations.
 */

const logger = require('../../utils/logger');

/**
 * Generates a realistic mock design specification.
 * @param {Object} params - Design input parameters
 * @returns {Object} - Mock design specification JSON
 */
const generateMockDesignSpec = (params) => {
  const {
    location = 'Airoli, Navi Mumbai',
    roomType = 'bedroom',
    areaSqFt = 400,
    occupants = 2,
    budget = 'medium',
    designStyle = 'modern_indian',
    requirements = [],
  } = params;

  logger.ai('Using mock AI mode — returning sample design specification.');

  const styleMap = {
    modern_indian: 'Modern Indian',
    traditional_indian: 'Traditional Indian',
    contemporary: 'Contemporary',
    minimalist: 'Minimalist',
    fusion: 'Fusion',
  };

  const styleDisplay = styleMap[designStyle] || 'Modern Indian';
  const roomDisplay = roomType.replace(/_/g, ' ');

  return {
    projectSummary: `A thoughtfully designed ${areaSqFt} sq ft ${roomDisplay} in ${location} for ${occupants} occupant(s). The design blends ${styleDisplay} aesthetics with traditional Vastu Shastra principles, optimized for the compact apartment lifestyle of Navi Mumbai. The layout prioritizes natural light, cross-ventilation, and practical space utilization while incorporating culturally significant directional placements.`,

    location: location,
    normalizedLocation: location.includes('Airoli') ? 'Airoli, Navi Mumbai' : location,
    roomType: roomType,

    dimensions: {
      areaSqFt: areaSqFt,
      length: Math.round(Math.sqrt(areaSqFt * 1.33)),
      width: Math.round(Math.sqrt(areaSqFt / 1.33)),
      shape: 'Rectangular (KNOWN — based on typical Navi Mumbai apartment layout)',
    },

    occupants: occupants,
    budget: budget,

    siteAnalysis: {
      shape: 'Rectangular room with standard Indian apartment proportions',
      estimatedEntranceDirection: 'Compass direction could not be reliably determined from the available information. A provisional North-facing entrance has been assumed for this Vastu analysis.',
      windows: [
        'Window 1: East-facing window (ASSUMED) — primary source of morning sunlight',
        'Window 2: North-facing window (ASSUMED) — consistent diffused daylight',
      ],
      naturalLight: 'Good natural light assumed from east-facing primary window. Morning sun enters the room providing healthy daylight in the first half of the day.',
      ventilation: 'Cross-ventilation is achievable with windows on two walls. Typical Navi Mumbai apartments in Airoli have corridor-facing and outer-facing windows enabling good air circulation.',
      existingFurniture: requirements.length ? ['Furniture details derived from user requirements'] : ['No existing furniture information provided'],
      knownInfo: [
        `Location: ${location}`,
        `Room area: ${areaSqFt} sq ft`,
        `Occupants: ${occupants}`,
        `Budget: ${budget}`,
        `Design style preference: ${styleDisplay}`,
        ...requirements.map((r) => `Requirement: ${r}`),
      ],
      estimatedInfo: [
        'Room shape estimated as rectangular based on typical Navi Mumbai residential layouts',
        'Ceiling height estimated at 9–10 feet (standard for this area)',
      ],
      assumptions: [
        'ASSUMED: North is used as the reference direction since compass orientation was not provided',
        'ASSUMED: Main door opens on the North or East wall (provisional Vastu analysis)',
        'ASSUMED: Standard apartment with reinforced concrete structure',
        'ASSUMED: Balcony/window access on at least one external wall',
        'ASSUMED: Standard electrical outlets along walls available',
      ],
    },

    vastuAnalysis: {
      entrance: {
        recommendation: 'Position the main entrance on the North or East wall where possible.',
        reason: 'According to traditional Vastu beliefs, the North and East directions are associated with positive energy flow, prosperity (governed by Kuber — deity of wealth) and the rising sun respectively. From a practical design perspective, an East-facing entrance also receives morning sunlight, creating a welcoming, naturally lit entry.',
        type: 'both',
      },
      bed: {
        recommendation: 'Place the bed with the headboard against the South or West wall. The sleeping position should ideally have the head pointing South or East.',
        reason: 'According to traditional Vastu beliefs, sleeping with the head toward South aligns the body\'s magnetic field with Earth\'s magnetic poles, which is said to promote restful sleep. From a practical perspective, positioning the bed against the South wall keeps the primary circulation path open on the North and East sides, improving room flow and access to windows.',
        type: 'both',
      },
      bathroom: {
        recommendation: 'Bathroom should be positioned in the Northwest or West portion of the room if an attached bathroom is included.',
        reason: 'According to traditional Vastu beliefs, the Northeast and Southwest corners are considered inauspicious for bathrooms. The Northwest placement aligns with the Vayu (air element) direction. From a practical perspective, keeping the bathroom away from the main sleeping and study zones improves privacy and functional zoning within the room.',
        type: 'both',
      },
      storage: {
        recommendation: 'Position heavy storage (wardrobes, almirahs) along the South or West walls.',
        reason: 'According to traditional Vastu beliefs, heavy objects should be placed in the South and West to provide stability. From a practical design perspective, placing tall wardrobes on the South or West wall prevents them from blocking natural light (which comes from East/North) and keeps the room perimeter functional.',
        type: 'both',
      },
      studyArea: {
        recommendation: 'Position the study desk near the East or North window. The person studying should face East or North.',
        reason: 'According to traditional Vastu beliefs, facing East while studying or working is considered auspicious as it aligns with the direction of sunrise and knowledge. From a practical standpoint, proximity to the East window provides excellent natural daylight for daytime study, reducing eye strain and dependency on artificial lighting.',
        type: 'both',
      },
      windows: {
        recommendation: 'Keep windows on the North and East walls unobstructed. Use sheer curtains to diffuse light without blocking it.',
        reason: 'According to traditional Vastu beliefs, North and East are directions of positive energy and light. From a practical perspective, maximizing east-facing morning light and north-facing consistent diffused light reduces artificial lighting requirements and improves the quality of the living environment.',
        type: 'both',
      },
      additionalNotes: 'The central area of the room (Brahmasthan) should be kept free of heavy furniture according to Vastu principles. Practically, keeping the center open also improves circulation and makes the room feel more spacious — particularly important in this compact Navi Mumbai apartment.',
    },

    spacePlan: {
      zones: [
        'Zone 1: Sleeping Area (South/Southwest) — Queen/King bed with headboard on South wall, bedside tables on both sides',
        'Zone 2: Storage Zone (West wall) — Full-height wardrobe spanning the West wall for maximum storage',
        'Zone 3: Study/Work Area (Northeast corner near East window) — Study desk, ergonomic chair, bookshelf',
        'Zone 4: Dressing Area (adjacent to wardrobe) — Mirror, small dresser or vanity unit',
        'Zone 5: Circulation Path — Clear 3-foot pathway around the bed and along the North wall',
      ],
      furniture: [
        'Queen-size bed (60"×75"): South wall with 18" on each side for bedside tables. Headboard against South wall per Vastu recommendation.',
        'Bedside tables (18"×18") × 2: Flanking the bed on both sides. Accommodate bedside lamps and personal items.',
        'Full-height wardrobe (72"H × 8ft W × 22"D): West wall. Floor-to-ceiling storage maximizing vertical space — critical for Mumbai apartments.',
        'Study desk (47"×24"): Northeast corner near East window. L-shaped preferred if space permits.',
        'Ergonomic study chair: At desk. Positioned to face East for study per Vastu and natural light considerations.',
        'Bookshelf/wall shelves: Above or beside desk. Vertical storage keeps floor space open.',
        'Dresser/Vanity (36"×18"): Adjacent to wardrobe on South wall. Mirror above.',
        'Pendant lights × 2: Above bedside tables. Warm 3000K LED for ambient bedside lighting.',
        'Ceiling fan with LED: Center of room. Essential for Mumbai\'s humid climate.',
        'Floor-to-ceiling sheer curtains: East and North windows. Diffuse natural light while maintaining privacy.',
      ],
      circulation: 'A clear 3-foot circulation path runs along the North wall from the entrance to the study area. A secondary path exists on the East side of the bed. The room\'s center (Brahmasthan) remains unobstructed per Vastu principles and practical circulation needs.',
      lighting:
        'Layered lighting plan: (1) Primary — LED ceiling light with fan fitting for ambient illumination. (2) Task — Warm pendant lights at bedside for reading. (3) Study — Cool-white LED desk lamp (5000K) near East window for work. (4) Accent — Warm LED strip lights behind wardrobe panels or headboard for ambient mood. (5) Natural — Morning sunlight from East window is the primary daytime light source.',
      ventilation:
        'Cross-ventilation achieved through East and North windows. Ceiling fan supports air circulation during non-monsoon months. Windows have mesh screens to allow ventilation while keeping insects out — essential in coastal Navi Mumbai.',
    },

    designStyle: {
      style: styleDisplay,
      colors: [
        'Warm White (#F8F4EF) — Walls',
        'Deep Teak Brown (#6B3A2A) — Furniture accents',
        'Saffron Gold (#C8860A) — Accent cushions and hardware',
        'Sage Green (#A8C5A0) — Plant accents and occasional textiles',
        'Off-White Linen (#EDE8DE) — Bedding and curtains',
      ],
      materials: [
        'Flooring: Premium Vitrified Tiles (600×1200mm, marble-look finish)',
        'Walls: Smooth plaster with premium emulsion in Warm White',
        'Wardrobe: Teak veneer or laminate with gold-tone handles',
        'Bed: Upholstered headboard in linen fabric, solid wood legs',
        'Study desk: Walnut laminate with powder-coated metal frame',
      ],
      lighting: [
        'Warm LED panels (3000K) for ambient lighting',
        'Adjustable bedside pendant lights',
        'Cool LED desk lamp (5000K) for study',
        'LED strip lights (2700K) for accent/mood',
        'Natural east-facing morning light as primary daytime source',
      ],
      furnitureStyle: `${styleDisplay} — clean geometric profiles with warm wood tones, minimal ornamentation, gold-tone metal accents, upholstered textiles in natural linen. Influenced by Indian craftsmanship with a contemporary sensibility appropriate for modern Navi Mumbai apartments.`,
      textures: [
        'Smooth marble-look floor tiles',
        'Textured fabric headboard',
        'Matte wood grain wardrobe surfaces',
        'Sheer linen curtains',
        'Jute or dhurrie accent rug at foot of bed',
      ],
    },

    recommendations: [
      '[Vastu Recommendation] Keep the Northeast corner of the room open and clutter-free. According to traditional Vastu beliefs, this corner (Ishaan Kona) is associated with divine energy and clarity of mind. Practically, keeping it open also allows light from the East window to reach deeper into the room.',
      '[Practical Recommendation] Install floor-to-ceiling wardrobes along the West wall. In compact Mumbai apartments, vertical storage utilization is essential. This approach provides significantly more storage than standard-height furniture while keeping the floor plan open.',
      '[Vastu + Practical Recommendation] Place the study desk near the East window with the chair facing East. Vastu tradition favors East-facing study positions for concentration. Practically, this provides the best natural daylight for daytime study sessions.',
      '[Practical Recommendation] Use a ceiling fan with LED lighting as the primary overhead fitting. Navi Mumbai\'s coastal humidity makes fans essential for comfort even with air conditioning. An integrated LED fitting reduces the need for a separate ceiling light.',
      '[Vastu Recommendation] Avoid placing mirrors directly opposite the bed. According to traditional Vastu beliefs, mirrors reflecting the sleeping person can disturb sleep. Position the dressing mirror on a side wall or inside the wardrobe door.',
      '[Practical Recommendation] Use light-filtering sheer curtains rather than heavy drapes. This maximizes natural light penetration while maintaining privacy — reducing the room\'s dependence on artificial lighting during daytime hours.',
      '[Vastu + Practical Recommendation] Keep the center of the room (Brahmasthan) free of furniture. Traditional Vastu reserves this central space for positive energy flow. From a design perspective, an open center makes the compact room feel more spacious and allows free movement.',
    ],

    colorPalette: {
      primary: '#F8F4EF',
      secondary: '#6B3A2A',
      accent: '#C8860A',
      neutral: '#EDE8DE',
      description: `The palette draws from Indian architectural heritage — warm whites reminiscent of Rajasthani marble, rich teak browns echoing traditional Indian timber craftsmanship, and saffron-gold accents inspired by temple architecture. The sage green introduces a fresh biophilic element suited to Navi Mumbai's proximity to nature.`,
    },

    imageGenerationPrompt: `Photorealistic architectural visualization of a ${areaSqFt} sq ft ${roomDisplay} in a modern Indian residential apartment in Navi Mumbai. ${styleDisplay} interior design style. 

Room features: Queen-size bed with upholstered linen headboard on South wall, matching bedside tables with warm pendant lights, full-height teak veneer wardrobe on West wall, study desk and ergonomic chair in Northeast corner near East window, dresser with mirror, ceiling fan with LED fitting, sheer linen curtains on East window.

Color palette: Warm white walls (#F8F4EF), teak brown furniture (#6B3A2A), saffron gold accents (#C8860A), marble-look floor tiles. Materials: premium vitrified tile flooring (600×1200mm marble finish), smooth plaster walls, teak veneer furniture, linen textiles. Lighting: warm 3000K LED ambient, pendant bedside lights, natural morning east-window light. Small indoor plant near window. Dhurrie accent rug at foot of bed. Clean, uncluttered center space.`,
  };
};

/**
 * Library of architectural space definitions with AI prompts and curated fallback imagery.
 */
const SPACE_DEFINITIONS = {
  master_bedroom: {
    id: 'master_bedroom',
    label: 'Master Bedroom',
    title: 'Master Bedroom (Nairutya Zone)',
    prompt: 'luxury modern indian master bedroom interior design, king bed on south wall, warm teak wood fluting, backlit headboard, amber cove lighting, vastu shastra compliant, 8k architectural render, photorealistic',
    vastuPrinciple: 'Master bed placed along South/West wall; head towards East or South for peaceful sleep without overhead beams.',
    description: 'Luxurious modern Indian bedroom with fluted wooden acoustic panel, cove ceiling lighting, fitted wardrobe, and study nook.',
    fallbacks: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&h=800&fit=crop&auto=format',
      '/views/bedroom.png',
    ],
  },
  second_bedroom: {
    id: 'second_bedroom',
    label: 'Bed Room 2',
    title: 'Secondary Bedroom / Kids Room',
    prompt: 'modern vibrant secondary bedroom interior design with study desk and wardrobe, airy bright window, warm timber accents, vastu compliant, 8k architectural render',
    vastuPrinciple: 'Northwest or West zone ideal for children or guests; study desk oriented toward North/East.',
    description: 'Comfortable secondary bedroom with twin study setup, natural morning lighting, and built-in sliding closet.',
    fallbacks: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=800&fit=crop&auto=format',
    ],
  },
  living_room: {
    id: 'living_room',
    label: 'Living Room',
    title: 'Living Hall & Foyer',
    prompt: 'contemporary luxury indian living room interior, beige sectional sofa, fluted wood media console, marble floor, warm recessed lighting, indoor plants, vastu shastra, 8k render',
    vastuPrinciple: 'Living area in Northeast or North; heavy sofa placed against South/West wall; uncluttered central Brahmasthan.',
    description: 'Spacious open-concept living hall featuring low-profile sectional sofa, fluted wood media console, and subtle Indian accents.',
    fallbacks: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=800&fit=crop&auto=format',
    ],
  },
  kitchen: {
    id: 'kitchen',
    label: 'Modular Kitchen',
    title: 'Modular Kitchen (Agneya)',
    prompt: 'luxury modular kitchen interior, southeast agneya vastu orientation, quartz countertop, warm teak wood cabinets, sleek chimney, morning sunlight, 8k render',
    vastuPrinciple: 'Southeast (Agneya) ruled by Fire god; cook faces East; sink placed in Northeast corner away from the stove.',
    description: 'Modern modular kitchen with quartz countertop, soft-close teak veneer cabinets, and efficient triangular workflow.',
    fallbacks: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200&h=800&fit=crop&auto=format',
    ],
  },
  washroom: {
    id: 'washroom',
    label: 'Washroom',
    title: 'En-Suite Bathroom',
    prompt: 'modern luxury en-suite bathroom interior, gray marble stone texture, frameless glass shower cubicle, wall hung toilet, floating teak vanity, backlit led round mirror, 8k render',
    vastuPrinciple: 'Washroom placed in NW or West; slope and drainage towards North/East; mirrors mounted on North/East walls.',
    description: 'Sleek stone-textured bathroom with frameless glass shower cubicle, wall-hung WC, backlit LED mirror, and warm teak vanity.',
    fallbacks: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&h=800&fit=crop&auto=format',
      '/views/washroom.png',
    ],
  },
  temple: {
    id: 'temple',
    label: 'Temple',
    title: 'Pooja Room / Mandir',
    prompt: 'sacred indian pooja room mandir interior, ishan northeast corner, intricately carved teak wood arch, brass ganesha, backlit glowing om, brass diya oil lamps, peaceful sanctuary, 8k render',
    vastuPrinciple: 'Ishan Kon (Northeast) holy orientation; deities facing East/West; illuminated wooden jali and brass accessories.',
    description: 'Sacred Mandir sanctuary with intricately carved wooden arch, backlit glowing Om, brass Ganesha and diyas, and velvet prayer rug.',
    fallbacks: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop&auto=format',
      '/views/temple.png',
    ],
  },
  mini_balcony: {
    id: 'mini_balcony',
    label: 'Balcony Garden',
    title: 'Mini Balcony Garden',
    prompt: 'cozy modern apartment balcony garden sit out, vertical living green wall with lush plants, wooden deck floor tiles, comfortable outdoor armchairs, fairy string lights, sunset golden hour, 8k render',
    vastuPrinciple: 'North and East balconies capture auspicious morning sunlight and coastal ventilation; vertical herbal plants.',
    description: 'Cosy balcony sit-out with vertical garden wall, wooden decking tiles, weather-resistant armchairs, and warm fairy lights.',
    fallbacks: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1527030280862-64139fba04ca?w=1200&h=800&fit=crop&auto=format',
    ],
  },
  dining_room: {
    id: 'dining_room',
    label: 'Dining Space',
    title: 'Dining Area & Nook',
    prompt: 'modern indian dining room interior design, solid wooden 6 seater dining table, brass designer chandelier, warm lighting, crockery unit, vastu compliant, 8k render',
    vastuPrinciple: 'West or East zone, dining table placed so family faces East or North during meals.',
    description: 'Inviting dining area with contemporary wooden dining set, warm ambient pendant lights, and integrated storage sideboard.',
    fallbacks: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1200&h=800&fit=crop&auto=format',
    ],
  },
  front_view: {
    id: 'front_view',
    label: 'Front View',
    title: 'Front Elevation & Gate',
    prompt: 'modern indian residential home architectural front elevation exterior, wood battens, glass balconies, warm exterior ambient lighting, tropical landscaping, 8k render',
    vastuPrinciple: 'Main entrance gate aligned to favorable Northern/Eastern Pada; welcoming foyer with warm lighting.',
    description: 'Modern two-story elevation with natural wood battens, glass balconies, warm ambient wall washers, and clean boundary.',
    fallbacks: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop&auto=format',
      '/views/front_view.png',
    ],
  },
  rooftop: {
    id: 'rooftop',
    label: 'Roof Top View',
    title: 'Roof Top / Terrace View',
    prompt: 'architectural rooftop terrace garden view, wooden pergola, outdoor lounge seating, solar panels, potted plants, panoramic city skyline view, evening warm lighting, 8k render',
    vastuPrinciple: 'Terrace & Overhead Tank in SW / West; open airy deck in NE for positive solar energy flow.',
    description: 'Architectural isometric overview featuring solar panel setup, open terrace lounge, and perimeter greenery.',
    fallbacks: [
      'https://images.unsplash.com/photo-1533779283484-8da4c77d73c0?w=1200&h=800&fit=crop&auto=format',
      '/views/rooftop.png',
    ],
  },
  floor_plan_3d: {
    id: 'floor_plan_3d',
    label: '3D Floor Plan',
    title: 'Bird\'s Eye Isometric Layout',
    prompt: 'isometric 3d architectural floor plan render of modern indian apartment, top down perspective cutaway, furnished rooms, clear circulation, vastu layout, 8k render',
    vastuPrinciple: 'Brahmasthan clear at center; heavier furniture anchored to South/West zones; open airflow in North/East.',
    description: 'Detailed cutaway 3D floor plan illustrating clear circulation corridors and Vastu-compliant functional zoning.',
    fallbacks: [
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=1200&h=800&fit=crop&auto=format',
      '/views/demo_6views.png',
    ],
  },
};

/**
 * Returns 6 architectural views dynamically matched to the user's specific inputs,
 * rooms, and requirements (e.g. balcony, temple, bedrooms, washrooms).
 * Each view is generated with an AI render URL (Pollinations AI) and seed-based rotation,
 * ensuring new visual variations on every generation.
 *
 * @param {string} roomType
 * @param {string[]} requirements
 * @param {Object} [spec]
 * @returns {Array<Object>}
 */
const generate6Views = (roomType = 'bedroom', requirements = [], spec = {}) => {
  const reqStr = (Array.isArray(requirements) ? requirements.join(' ') : String(requirements)).toLowerCase();
  const hasBalcony = reqStr.includes('balcony') || reqStr.includes('garden');
  const hasTemple = reqStr.includes('temple') || reqStr.includes('pooja') || reqStr.includes('mandir');
  const hasWashroom = reqStr.includes('toilet') || reqStr.includes('washroom') || reqStr.includes('bath');
  const hasMultipleBedrooms = reqStr.includes('2 bedroom') || reqStr.includes('3 bedroom') || reqStr.includes('2bhk') || reqStr.includes('3bhk');
  const hasKitchen = reqStr.includes('kitchen') || roomType === 'kitchen';
  const hasLiving = reqStr.includes('living') || roomType === 'living_room';
  const hasDining = reqStr.includes('dining') || roomType === 'dining_room';

  // Seed changes per call so each generation produces distinct images
  const baseSeed = Math.floor(Math.random() * 900000) + 100000;

  // Decide the 6 space keys based on selected rooms and preferences
  let chosenKeys = [];

  if (roomType === 'kitchen') {
    chosenKeys = ['kitchen', 'dining_room', hasBalcony ? 'mini_balcony' : 'living_room', 'washroom', hasTemple ? 'temple' : 'floor_plan_3d', 'front_view'];
  } else if (roomType === 'living_room') {
    chosenKeys = ['living_room', hasBalcony ? 'mini_balcony' : 'dining_room', 'master_bedroom', hasKitchen ? 'kitchen' : 'washroom', hasTemple ? 'temple' : 'front_view', 'floor_plan_3d'];
  } else if (hasMultipleBedrooms) {
    chosenKeys = ['master_bedroom', 'second_bedroom', hasBalcony ? 'mini_balcony' : 'living_room', 'washroom', hasTemple ? 'temple' : 'kitchen', 'front_view'];
  } else {
    // Default bedroom or whole home layout
    chosenKeys = [
      'master_bedroom',
      hasBalcony ? 'mini_balcony' : (hasLiving ? 'living_room' : 'front_view'),
      'washroom',
      hasTemple ? 'temple' : (hasKitchen ? 'kitchen' : 'second_bedroom'),
      hasBalcony && !chosenKeys.includes('mini_balcony') ? 'mini_balcony' : 'rooftop',
      'floor_plan_3d',
    ];
  }

  // Deduplicate and fill to exactly 6
  chosenKeys = [...new Set(chosenKeys)];
  const fallbackList = ['master_bedroom', 'living_room', 'washroom', 'temple', 'mini_balcony', 'kitchen', 'front_view', 'rooftop', 'floor_plan_3d'];
  for (const key of fallbackList) {
    if (chosenKeys.length >= 6) break;
    if (!chosenKeys.includes(key)) chosenKeys.push(key);
  }
  chosenKeys = chosenKeys.slice(0, 6);

  // Construct view objects with live Pollinations AI render URL + fallback URL
  return chosenKeys.map((key, index) => {
    const def = SPACE_DEFINITIONS[key] || SPACE_DEFINITIONS.master_bedroom;
    const seed = baseSeed + index * 17;
    const fallbackIdx = seed % (def.fallbacks?.length || 1);
    const fallbackUrl = def.fallbacks?.[fallbackIdx] || def.fallbacks?.[0] || '/views/demo_6views.png';

    // Build Pollinations prompt with design style and area
    const styleName = spec?.designStyle?.style || 'Modern Indian';
    const enhancedPrompt = `${def.prompt}, ${styleName} design style, architectural photography`;
    const aiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1024&height=768&nologo=true&seed=${seed}`;

    // If a dedicated AI image was generated for the hero view, use it for the primary panel
    const finalUrl = (index === 0 && spec?.heroImageUrl) ? spec.heroImageUrl : aiUrl;

    return {
      id: def.id,
      label: def.label,
      title: def.title,
      url: finalUrl,
      fallbackUrl: fallbackUrl,
      vastuPrinciple: def.vastuPrinciple,
      description: def.description,
    };
  });
};

/**
 * Returns a curated interior design image URL matched to the room type.
 * @param {string} roomType
 * @param {Object} [spec]
 * @returns {string}
 */
const generateMockImageUrl = (roomType = 'bedroom', spec = null) => {
  const ROOM_HERO = {
    bedroom: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1792&h=1024&fit=crop&auto=format',
    living_room: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1792&h=1024&fit=crop&auto=format',
    kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1792&h=1024&fit=crop&auto=format',
    office: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1792&h=1024&fit=crop&auto=format',
    dining_room: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1792&h=1024&fit=crop&auto=format',
    pooja_room: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1792&h=1024&fit=crop&auto=format',
    bathroom: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1792&h=1024&fit=crop&auto=format',
  };

  if (spec?.dimensions?.areaSqFt > 500) {
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1792&h=1024&fit=crop&auto=format';
  }

  return ROOM_HERO[roomType] || '/views/demo_6views.png';
};

module.exports = { generateMockDesignSpec, generateMockImageUrl, generate6Views };
