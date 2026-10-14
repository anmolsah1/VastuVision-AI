/**
 * @file location.service.js
 * @description Location normalization and context service.
 *
 * Currently focused on Mumbai and Navi Mumbai. Designed as an abstraction
 * so that a full geocoding API (Google Maps, etc.) can be plugged in later.
 *
 * To add geocoding: Set GEOCODING_PROVIDER=google and GOOGLE_MAPS_API_KEY in .env.
 */

const config = require('../../config/env');
const logger = require('../../utils/logger');

// ── Location Database ─────────────────────────────────────────────────────────

/**
 * Known Mumbai / Navi Mumbai localities with normalization rules.
 * Key: lowercase keyword to match → Value: canonical display name
 */
const LOCATION_MAP = {
  // Navi Mumbai
  airoli: 'Airoli, Navi Mumbai',
  vashi: 'Vashi, Navi Mumbai',
  nerul: 'Nerul, Navi Mumbai',
  belapur: 'CBD Belapur, Navi Mumbai',
  'cbd belapur': 'CBD Belapur, Navi Mumbai',
  kharghar: 'Kharghar, Navi Mumbai',
  panvel: 'Panvel, Navi Mumbai',
  kamothe: 'Kamothe, Navi Mumbai',
  kalamboli: 'Kalamboli, Navi Mumbai',
  ulwe: 'Ulwe, Navi Mumbai',
  dronagiri: 'Dronagiri, Navi Mumbai',
  seawoods: 'Seawoods, Navi Mumbai',
  sanpada: 'Sanpada, Navi Mumbai',
  koparkhairane: 'Kopar Khairane, Navi Mumbai',
  ghansoli: 'Ghansoli, Navi Mumbai',
  turbhe: 'Turbhe, Navi Mumbai',
  juinagar: 'Juinagar, Navi Mumbai',
  rabale: 'Rabale, Navi Mumbai',
  mahape: 'Mahape, Navi Mumbai',
  'navi mumbai': 'Navi Mumbai',

  // Mumbai
  andheri: 'Andheri, Mumbai',
  bandra: 'Bandra, Mumbai',
  powai: 'Powai, Mumbai',
  thane: 'Thane',
  borivali: 'Borivali, Mumbai',
  dadar: 'Dadar, Mumbai',
  kurla: 'Kurla, Mumbai',
  ghatkopar: 'Ghatkopar, Mumbai',
  mulund: 'Mulund, Mumbai',
  malad: 'Malad, Mumbai',
  goregaon: 'Goregaon, Mumbai',
  kandivali: 'Kandivali, Mumbai',
  vikhroli: 'Vikhroli, Mumbai',
  chembur: 'Chembur, Mumbai',
  worli: 'Worli, Mumbai',
  parel: 'Parel, Mumbai',
  colaba: 'Colaba, Mumbai',
  nariman: 'Nariman Point, Mumbai',
  fort: 'Fort, Mumbai',
  'lower parel': 'Lower Parel, Mumbai',
  mumbai: 'Mumbai',
};

/**
 * Provides contextual information about a location for the AI prompt.
 * @param {string} normalizedLocation
 * @returns {Object}
 */
const getLocationContext = (normalizedLocation) => {
  const loc = normalizedLocation.toLowerCase();

  const isNaviMumbai = loc.includes('navi mumbai') || 
    ['airoli', 'vashi', 'nerul', 'belapur', 'kharghar'].some(n => loc.includes(n));

  const isMumbaiSuburb = loc.includes('andheri') || loc.includes('bandra') || 
    loc.includes('powai') || loc.includes('goregaon') || loc.includes('borivali');

  const isThane = loc.includes('thane');

  let context = {
    city: isNaviMumbai ? 'Navi Mumbai' : isThane ? 'Thane' : 'Mumbai',
    region: 'Mumbai Metropolitan Region, Maharashtra, India',
    climate: 'Tropical wet and dry / humid subtropical',
    typicalApartmentType: 'Modern high-rise or mid-rise residential apartment',
    architecturalContext: 'Contemporary Indian residential with compact layouts',
    ventilationConsideration: 'High humidity coastal climate — cross-ventilation essential',
    spaceConstraint: 'High-density urban residential — space optimization is critical',
  };

  if (isNaviMumbai) {
    context = {
      ...context,
      areaType: 'Planned satellite city with organized sector layout',
      greenery: 'Better greenery than Mumbai proper — some buildings near creek/hills',
      typicalLayout: 'Well-planned apartment societies with standard flat layouts',
      notes: 'Navi Mumbai flats typically have uniform layouts by CIDCO planning standards',
    };
  }

  return context;
};

// ── Public Functions ──────────────────────────────────────────────────────────

/**
 * Normalizes a location string to a canonical display name.
 * Handles common variations like "Airoli Navi Mumbai", "airoli", "airoli, navi mumbai".
 * @param {string} rawLocation
 * @returns {string} - Normalized location string
 */
const normalizeLocation = (rawLocation) => {
  if (!rawLocation || typeof rawLocation !== 'string') {
    return 'Mumbai Metropolitan Region';
  }

  const cleaned = rawLocation.trim().toLowerCase();

  // Direct match
  if (LOCATION_MAP[cleaned]) {
    return LOCATION_MAP[cleaned];
  }

  // Partial match (check if any key is contained in the input)
  const sortedKeys = Object.keys(LOCATION_MAP).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (cleaned.includes(key)) {
      logger.debug(`Location "${rawLocation}" normalized to "${LOCATION_MAP[key]}" via partial match.`);
      return LOCATION_MAP[key];
    }
  }

  // Could not normalize — return cleaned version with proper casing
  logger.warn(`Could not normalize location: "${rawLocation}". Using as-is.`);
  return rawLocation
    .trim()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Gets the full location context for inclusion in AI prompts.
 * @param {string} normalizedLocation
 * @returns {Object}
 */
const getLocationInfo = (normalizedLocation) => {
  return getLocationContext(normalizedLocation);
};

/**
 * Placeholder for future geocoding API integration.
 * When GEOCODING_PROVIDER=google, this will return real coordinates.
 * @param {string} location
 * @returns {Promise<Object|null>}
 */
const geocodeLocation = async (location) => {
  if (config.location.provider === 'google' && config.location.googleMapsApiKey) {
    // TODO: Implement Google Maps Geocoding API integration
    logger.info('Google Maps geocoding not yet implemented. Returning null coordinates.');
  }

  // Return null for now — the AI analysis does not require exact GPS coordinates
  return null;
};

module.exports = { normalizeLocation, getLocationInfo, geocodeLocation };
