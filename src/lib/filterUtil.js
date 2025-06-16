// Cache for host ratings to avoid recalculating
let hostRatingsCache = null;
let lastPropertiesHash = null;

/**
 * Calculate host ratings efficiently with caching
 * @param {Array} properties - Array of all properties
 * @return {Map} - Map of hostId to average rating
 */
function calculateHostRatings(properties) {
  // Create a simple hash of the properties array to detect changes
  const propertiesHash = properties.length + properties.reduce((sum, p) => sum + p.hostId + p.stars, 0);
  
  // Return cached result if properties haven't changed
  if (hostRatingsCache && lastPropertiesHash === propertiesHash) {
    return hostRatingsCache;
  }

  const hostStats = new Map();
  
  // Single pass through properties to calculate host statistics
  properties.forEach(property => {
    const { hostId, stars } = property;
    if (!hostStats.has(hostId)) {
      hostStats.set(hostId, { totalStars: 0, propertyCount: 0 });
    }
    const stats = hostStats.get(hostId);
    stats.totalStars += stars;
    stats.propertyCount += 1;
  });

  // Calculate average ratings
  const hostRatings = new Map();
  hostStats.forEach((stats, hostId) => {
    hostRatings.set(hostId, stats.totalStars / stats.propertyCount);
  });

  // Cache the results
  hostRatingsCache = hostRatings;
  lastPropertiesHash = propertiesHash;
  
  return hostRatings;
}

/**
 * Filter properties based on filter criteria
 * @param  {Array} properties - Array of all properties
 * @param  {Object} filters - The filters being applied to the properties
 * @return {Array} - Array of properties that match the given filters
 */
export const filterProperties = (properties, filters) => {
  if (!properties || !properties.length) {
    return [];
  }

  const {
    locationFilter,
    rateFilter,
    starsFilter,
    houseTypeFilter,
    placeTypeFilter,
    superHostFilter,
  } = filters;
  
  const houseTypeSet = new Set(houseTypeFilter);
  const placeTypeSet = new Set(placeTypeFilter);

  // Calculate host ratings once if super host filter is enabled
  const hostRatings = superHostFilter ? calculateHostRatings(properties) : null;

  const failsRangeCheck = (range, field) => range && (range[0] > field || range[1] < field);
  const failsSetCheck = (set, field) => set.size > 0 && !set.has(field);

  return properties.filter((property) => {
    if (locationFilter && locationFilter !== property.country) {
      return false;
    }

    if (superHostFilter && !isSuperHost(property, hostRatings)) {
      return false;
    }

    if (
      failsRangeCheck(rateFilter, property.rate) ||
      failsRangeCheck(starsFilter, property.stars)
    ) {
      return false;
    }

    if (
      failsSetCheck(houseTypeSet, property.houseType) ||
      failsSetCheck(placeTypeSet, property.placeType)
    ) {
      return false;
    }

    return true;
  });
};

/**
 * Determine if the host of the specified `property` is a "Super Host". A Super Host is a host with an average start
 * rating of 4 or more across all of their properties.
 * @param {Object} property - The property currently being checked for "Super Host" status
 * @param {Map} hostRatings - Pre-calculated map of hostId to average rating
 * @return {Boolean} - true if the host of `property` is a "Super Host". Otherwise false.
 */
function isSuperHost(property, hostRatings) {
  if (!hostRatings) {
    return false;
  }
  
  const averageRating = hostRatings.get(property.hostId);
  return averageRating >= 4;
}

export const RATE_FILTER_META = {
  MIN: 0,
  MAX: 2000,
};

export const STAR_FILTER_META = {
  MIN: 0,
  MAX: 5,
};

export const DEFAULT_FILTERS = {
  locationFilter: null,
  placeTypeFilter: [],
  houseTypeFilter: [],
  superHostFilter: false,
  rateFilter: [RATE_FILTER_META.MIN, RATE_FILTER_META.MAX],
  starsFilter: [STAR_FILTER_META.MIN, STAR_FILTER_META.MAX],
};