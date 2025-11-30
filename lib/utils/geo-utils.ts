/**
 * Geographic Utilities
 * Converts location names to coordinates for globe visualization
 */

import type { ThreatResult } from "@/types/intel";

/**
 * Major city coordinates by "Country,City" format
 */
const CITY_COORDINATES: Record<string, [number, number]> = {
  // Russia
  "Russia,Moscow": [55.7558, 37.6173],
  "Russia,St. Petersburg": [59.9343, 30.3351],
  "Russia,Novosibirsk": [55.0084, 82.9357],
  
  // United States
  "United States,New York": [40.7128, -74.006],
  "United States,Los Angeles": [34.0522, -118.2437],
  "United States,Chicago": [41.8781, -87.6298],
  "United States,Houston": [29.7604, -95.3698],
  "United States,Phoenix": [33.4484, -112.074],
  "United States,Philadelphia": [39.9526, -75.1652],
  "United States,San Antonio": [29.4241, -98.4936],
  "United States,San Diego": [32.7157, -117.1611],
  "United States,Dallas": [32.7767, -96.797],
  "United States,San Jose": [37.3382, -121.8863],
  "United States,Ashburn": [39.0438, -77.4874], // AWS Virginia
  "United States,Seattle": [47.6062, -122.3321],
  "United States,Denver": [39.7392, -104.9903],
  "United States,Washington": [38.9072, -77.0369],
  "United States,Boston": [42.3601, -71.0589],
  "United States,El Paso": [31.7619, -106.485],
  "United States,Detroit": [42.3314, -83.0458],
  "United States,Nashville": [36.1627, -86.7816],
  "United States,Portland": [45.5152, -122.6784],
  "United States,Oklahoma City": [35.4676, -97.5164],
  "United States,Las Vegas": [36.1699, -115.1398],
  "United States,Memphis": [35.1495, -90.049],
  "United States,Louisville": [38.2527, -85.7585],
  "United States,Baltimore": [39.2904, -76.6122],
  "United States,Milwaukee": [43.0389, -87.9065],
  "United States,Albuquerque": [35.0844, -106.6504],
  "United States,Tucson": [32.2226, -110.9747],
  "United States,Fresno": [36.7378, -119.7871],
  "United States,Sacramento": [38.5816, -121.4944],
  "United States,Kansas City": [39.0997, -94.5786],
  "United States,Mesa": [33.4152, -111.8315],
  "United States,Atlanta": [33.749, -84.388],
  "United States,Colorado Springs": [38.8339, -104.8214],
  "United States,Virginia Beach": [36.8529, -75.978],
  "United States,Raleigh": [35.7796, -78.6382],
  "United States,Omaha": [41.2565, -95.9345],
  "United States,Miami": [25.7617, -80.1918],
  "United States,Oakland": [37.8044, -122.2712],
  "United States,Minneapolis": [44.9778, -93.265],
  "United States,Tulsa": [36.154, -95.9928],
  "United States,Cleveland": [41.4993, -81.6944],
  "United States,Wichita": [37.6872, -97.3301],
  "United States,Arlington": [32.7357, -97.1081],
  
  // China
  "China,Beijing": [39.9042, 116.4074],
  "China,Shanghai": [31.2304, 121.4737],
  "China,Guangzhou": [23.1291, 113.2644],
  "China,Shenzhen": [22.5431, 114.0579],
  "China,Chengdu": [30.6624, 104.0633],
  "China,Hangzhou": [30.2741, 120.1551],
  "China,Wuhan": [30.5928, 114.3055],
  "China,Xi'an": [34.3416, 108.9398],
  
  // Australia
  "Australia,Sydney": [-33.8688, 151.2093],
  "Australia,Melbourne": [-37.8136, 144.9631],
  "Australia,Brisbane": [-27.4698, 153.0251],
  "Australia,Perth": [-31.9505, 115.8605],
  "Australia,Adelaide": [-34.9285, 138.6007],
  
  // Netherlands
  "Netherlands,Amsterdam": [52.3676, 4.9041],
  "Netherlands,Rotterdam": [51.9244, 4.4777],
  "Netherlands,The Hague": [52.0705, 4.3007],
  
  // Germany
  "Germany,Berlin": [52.52, 13.405],
  "Germany,Munich": [48.1351, 11.582],
  "Germany,Hamburg": [53.5511, 9.9937],
  "Germany,Frankfurt": [50.1109, 8.6821],
  "Germany,Cologne": [50.9375, 6.9603],
  
  // United Kingdom
  "United Kingdom,London": [51.5074, -0.1278],
  "United Kingdom,Manchester": [53.4808, -2.2426],
  "United Kingdom,Birmingham": [52.4862, -1.8904],
  "United Kingdom,Edinburgh": [55.9533, -3.1883],
  
  // France
  "France,Paris": [48.8566, 2.3522],
  "France,Lyon": [45.764, 4.8357],
  "France,Marseille": [43.2965, 5.3698],
  
  // Japan
  "Japan,Tokyo": [35.6762, 139.6503],
  "Japan,Osaka": [34.6937, 135.5023],
  "Japan,Yokohama": [35.4437, 139.638],
  "Japan,Kyoto": [35.0116, 135.7681],
  
  // South Korea
  "South Korea,Seoul": [37.5665, 126.978],
  "South Korea,Busan": [35.1796, 129.0756],
  
  // India
  "India,Mumbai": [19.076, 72.8777],
  "India,Delhi": [28.6139, 77.209],
  "India,Bangalore": [12.9716, 77.5946],
  "India,Hyderabad": [17.385, 78.4867],
  
  // Singapore
  "Singapore,Singapore": [1.3521, 103.8198],
  
  // Brazil
  "Brazil,São Paulo": [-23.5505, -46.6333],
  "Brazil,Rio de Janeiro": [-22.9068, -43.1729],
  
  // Canada
  "Canada,Toronto": [43.6532, -79.3832],
  "Canada,Vancouver": [49.2827, -123.1207],
  "Canada,Montreal": [45.5017, -73.5673],
  
  // Mexico
  "Mexico,Mexico City": [19.4326, -99.1332],
  
  // Argentina
  "Argentina,Buenos Aires": [-34.6037, -58.3816],
  
  // South Africa
  "South Africa,Cape Town": [-33.9249, 18.4241],
  "South Africa,Johannesburg": [-26.2041, 28.0473],
  
  // UAE
  "United Arab Emirates,Dubai": [25.2048, 55.2708],
  
  // Turkey
  "Turkey,Istanbul": [41.0082, 28.9784],
  "Turkey,Ankara": [39.9334, 32.8597],
  
  // Poland
  "Poland,Warsaw": [52.2297, 21.0122],
  
  // Italy
  "Italy,Rome": [41.9028, 12.4964],
  "Italy,Milan": [45.4642, 9.1901],
  
  // Spain
  "Spain,Madrid": [40.4168, -3.7038],
  "Spain,Barcelona": [41.3851, 2.1734],
  
  // Sweden
  "Sweden,Stockholm": [59.3293, 18.0686],
  
  // Norway
  "Norway,Oslo": [59.9139, 10.7522],
  
  // Denmark
  "Denmark,Copenhagen": [55.6761, 12.5683],
  
  // Switzerland
  "Switzerland,Zurich": [47.3769, 8.5417],
  
  // Ireland
  "Ireland,Dublin": [53.3498, -6.2603],
  
  // Czech Republic
  "Czech Republic,Prague": [50.0755, 14.4378],
  
  // Austria
  "Austria,Vienna": [48.2082, 16.3738],
  
  // Belgium
  "Belgium,Brussels": [50.8503, 4.3517],
  
  // Portugal
  "Portugal,Lisbon": [38.7223, -9.1393],
  
  // Greece
  "Greece,Athens": [37.9838, 23.7275],
  
  // Finland
  "Finland,Helsinki": [60.1699, 24.9384],
  
  // New Zealand
  "New Zealand,Auckland": [-36.8485, 174.7633],
  "New Zealand,Wellington": [-41.2865, 174.7762],
  
  // Indonesia
  "Indonesia,Jakarta": [-6.2088, 106.8456],
  
  // Thailand
  "Thailand,Bangkok": [13.7563, 100.5018],
  
  // Philippines
  "Philippines,Manila": [14.5995, 120.9842],
  
  // Vietnam
  "Vietnam,Hanoi": [21.0285, 105.8542],
  "Vietnam,Ho Chi Minh City": [10.8231, 106.6297],
  
  // Malaysia
  "Malaysia,Kuala Lumpur": [3.139, 101.6869],
  
  // Taiwan
  "Taiwan,Taipei": [25.033, 121.5654],
  
  // Hong Kong
  "Hong Kong,Hong Kong": [22.3193, 114.1694],
  
  // Israel
  "Israel,Tel Aviv": [32.0853, 34.7818],
  "Israel,Jerusalem": [31.7683, 35.2137],
  
  // Egypt
  "Egypt,Cairo": [30.0444, 31.2357],
  
  // Nigeria
  "Nigeria,Lagos": [6.5244, 3.3792],
  
  // Kenya
  "Kenya,Nairobi": [-1.2921, 36.8219],
  
  // Saudi Arabia
  "Saudi Arabia,Riyadh": [24.7136, 46.6753],
  
  // Chile
  "Chile,Santiago": [-33.4489, -70.6693],
  
  // Colombia
  "Colombia,Bogotá": [4.711, -74.0721],
  
  // Peru
  "Peru,Lima": [-12.0464, -77.0428],
};

/**
 * Country center coordinates by ISO country code
 * Used as fallback when city coordinates are not available
 */
const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  RU: [61.524, 105.3188], // Russia
  US: [37.0902, -95.7129], // United States
  CN: [35.8617, 104.1954], // China
  AU: [-25.2744, 133.7751], // Australia
  NL: [52.1326, 5.2913], // Netherlands
  DE: [51.1657, 10.4515], // Germany
  GB: [55.3781, -3.436], // United Kingdom
  FR: [46.6034, 1.8883], // France
  JP: [36.2048, 138.2529], // Japan
  KR: [35.9078, 127.7669], // South Korea
  IN: [20.5937, 78.9629], // India
  SG: [1.3521, 103.8198], // Singapore
  BR: [-14.235, -51.9253], // Brazil
  CA: [56.1304, -106.3468], // Canada
  MX: [23.6345, -102.5528], // Mexico
  AR: [-38.4161, -63.6167], // Argentina
  ZA: [-30.5595, 22.9375], // South Africa
  AE: [23.4241, 53.8478], // UAE
  TR: [38.9637, 35.2433], // Turkey
  PL: [51.9194, 19.1451], // Poland
  IT: [41.8719, 12.5674], // Italy
  ES: [40.4637, -3.7492], // Spain
  SE: [60.1282, 18.6435], // Sweden
  NO: [60.472, 8.4689], // Norway
  DK: [56.2639, 9.5018], // Denmark
  CH: [46.8182, 8.2275], // Switzerland
  IE: [53.4129, -8.2439], // Ireland
  CZ: [49.8175, 15.473], // Czech Republic
  AT: [47.5162, 14.5501], // Austria
  BE: [50.5039, 4.4699], // Belgium
  PT: [39.3999, -8.2245], // Portugal
  GR: [39.0742, 21.8243], // Greece
  FI: [61.9241, 25.7482], // Finland
  NZ: [-40.9006, 174.886], // New Zealand
  ID: [-0.7893, 113.9213], // Indonesia
  TH: [15.87, 100.9925], // Thailand
  PH: [12.8797, 121.774], // Philippines
  VN: [14.0583, 108.2772], // Vietnam
  MY: [4.2105, 101.9758], // Malaysia
  TW: [23.6978, 120.9605], // Taiwan
  HK: [22.3193, 114.1694], // Hong Kong
  IL: [31.0461, 34.8516], // Israel
  EG: [26.0975, 31.2357], // Egypt
  NG: [9.082, 8.6753], // Nigeria
  KE: [-0.0236, 37.9062], // Kenya
  SA: [23.8859, 45.0792], // Saudi Arabia
  CL: [-35.6751, -71.543], // Chile
  CO: [4.5709, -74.2973], // Colombia
  PE: [-9.19, -75.0152], // Peru
  RO: [45.9432, 24.9668], // Romania
  HU: [47.1625, 19.5033], // Hungary
  SK: [48.669, 19.699], // Slovakia
  SI: [46.1512, 14.9955], // Slovenia
  HR: [45.1, 15.2], // Croatia
  BG: [42.7339, 25.4858], // Bulgaria
  RS: [44.0165, 21.0059], // Serbia
  UA: [48.3794, 31.1656], // Ukraine
  BY: [53.7098, 27.9534], // Belarus
  LT: [55.1694, 23.8813], // Lithuania
  LV: [56.8796, 24.6032], // Latvia
  EE: [58.5953, 25.0136], // Estonia
  IS: [64.9631, -19.0208], // Iceland
  LU: [49.8153, 6.1296], // Luxembourg
  MT: [35.9375, 14.3754], // Malta
  CY: [35.1264, 33.4299], // Cyprus
  TM: [38.9697, 59.5563], // Turkmenistan
  KZ: [48.0196, 66.9237], // Kazakhstan
  UZ: [41.3775, 64.5853], // Uzbekistan
  KG: [41.2044, 74.7661], // Kyrgyzstan
  TJ: [38.861, 71.2761], // Tajikistan
  PK: [30.3753, 69.3451], // Pakistan
  BD: [23.685, 90.3563], // Bangladesh
  LK: [7.8731, 80.7718], // Sri Lanka
  MM: [21.9162, 95.956], // Myanmar
  KH: [12.5657, 104.991], // Cambodia
  LA: [19.8563, 102.4955], // Laos
  MN: [46.8625, 103.8467], // Mongolia
  JO: [30.5852, 36.2384], // Jordan
  LB: [33.8547, 35.8623], // Lebanon
  IQ: [33.2232, 43.6793], // Iraq
  IR: [32.4279, 53.688], // Iran
  AF: [33.9391, 67.71], // Afghanistan
  DZ: [28.0339, 1.6596], // Algeria
  MA: [31.7917, -7.0926], // Morocco
  TN: [33.8869, 9.5375], // Tunisia
  LY: [26.3351, 17.2283], // Libya
  SD: [12.8628, 30.2176], // Sudan
  ET: [9.145, 38.7667], // Ethiopia
  GH: [7.9465, -1.0232], // Ghana
  SN: [14.4974, -14.4524], // Senegal
  CI: [7.54, -5.5471], // Côte d'Ivoire
  CM: [7.3697, 12.3547], // Cameroon
  UG: [1.3733, 32.2903], // Uganda
  TZ: [-6.369, 34.8888], // Tanzania
  ZW: [-19.0154, 29.1549], // Zimbabwe
  AO: [-11.2027, 17.8739], // Angola
  MZ: [-18.6657, 35.5296], // Mozambique
  VU: [-15.3767, 166.9592], // Vanuatu
  FJ: [-16.7784, 178.065], // Fiji
};

/**
 * Australia coordinates (Sydney) - origin point for connections
 */
export function getAustraliaCoordinates(): [number, number] {
  return [-33.8688, 151.2093]; // Sydney, Australia
}

/**
 * Extract geographic information from ThreatResult
 * Prioritizes VirusTotal data, falls back to AbuseIPDB
 */
export function extractGeoFromThreatResult(result: ThreatResult): {
  country: string | null;
  countryCode: string | null;
  city: string | null;
} {
  // Debug: Log raw data structure
  if (typeof window !== "undefined") {
    console.log("[Geo] Extracting from ThreatResult:", {
      hasVirusTotal: !!result.data.virusTotal,
      hasAbuseIPDB: !!result.data.abuseIPDB,
      virusTotalStructure: result.data.virusTotal ? {
        hasData: !!result.data.virusTotal.data,
        hasAttributes: !!result.data.virusTotal.data?.attributes,
        country: result.data.virusTotal.data?.attributes?.country,
        country_code: result.data.virusTotal.data?.attributes?.country_code,
        city: result.data.virusTotal.data?.attributes?.city,
      } : null,
      abuseIPDBStructure: result.data.abuseIPDB ? {
        countryName: result.data.abuseIPDB.countryName,
        countryCode: result.data.abuseIPDB.countryCode,
      } : null,
    });
  }

  // Try VirusTotal first
  const vtAttributes = result.data.virusTotal?.data?.attributes;
  if (vtAttributes && (vtAttributes.country || vtAttributes.country_code)) {
    let country = vtAttributes.country || null;
    let countryCode = vtAttributes.country_code ? String(vtAttributes.country_code).toUpperCase() : null;
    
    // If country looks like a country code (2-3 letter uppercase), treat it as such
    if (country && /^[A-Z]{2,3}$/.test(country.trim().toUpperCase())) {
      const possibleCode = country.trim().toUpperCase();
      // If we don't have a countryCode yet, use the country value as code
      if (!countryCode) {
        countryCode = possibleCode;
        country = null; // Clear country since it's actually a code
      } else if (countryCode === possibleCode) {
        // If countryCode already matches, clear country to avoid duplication
        country = null;
      }
    }
    
    const geo = {
      country: country,
      countryCode: countryCode,
      city: vtAttributes.city || null,
    };
    if (typeof window !== "undefined") {
      console.log("[Geo] Extracted from VirusTotal:", geo);
    }
    return geo;
  }

  // Fallback to AbuseIPDB
  const abuseData = result.data.abuseIPDB;
  if (abuseData && (abuseData.countryName || abuseData.countryCode)) {
    let country = abuseData.countryName || null;
    let countryCode = abuseData.countryCode ? String(abuseData.countryCode).toUpperCase() : null;
    
    // If countryName looks like a country code, treat it as such
    if (country && /^[A-Z]{2,3}$/.test(country.trim().toUpperCase())) {
      const possibleCode = country.trim().toUpperCase();
      if (!countryCode) {
        countryCode = possibleCode;
        country = null;
      } else if (countryCode === possibleCode) {
        country = null; // Avoid duplication when both are the same code
      }
    }
    
    const geo = {
      country: country,
      countryCode: countryCode,
      city: null, // AbuseIPDB doesn't provide city
    };
    if (typeof window !== "undefined") {
      console.log("[Geo] Extracted from AbuseIPDB:", geo);
    }
    return geo;
  }

  if (typeof window !== "undefined") {
    console.warn("[Geo] No geographic data found in VirusTotal or AbuseIPDB");
  }

  return {
    country: null,
    countryCode: null,
    city: null,
  };
}

/**
 * Get coordinates from location (country and optional city, with optional country code)
 * Returns [latitude, longitude] or null if not found
 */
export function getCoordinatesFromLocation(
  country: string | null,
  city: string | null | undefined,
  countryCode?: string | null
): [number, number] | null {
  if (typeof window !== "undefined") {
    console.log("[Geo] getCoordinatesFromLocation called with:", { country, city, countryCode });
  }
  
  if (!country && !countryCode) {
    if (typeof window !== "undefined") {
      console.warn("[Geo] No country or countryCode provided");
    }
    return null;
  }

  // Try to find city-specific coordinates first if we have both country and city
  if (country && city) {
    const cityKey = `${country},${city}`;
    if (CITY_COORDINATES[cityKey]) {
      if (typeof window !== "undefined") {
        console.log("[Geo] Found city coordinates:", CITY_COORDINATES[cityKey], "for key:", cityKey);
      }
      return CITY_COORDINATES[cityKey];
    } else {
      if (typeof window !== "undefined") {
        console.log("[Geo] City coordinates not found for key:", cityKey);
      }
    }
  }

  // Try country code directly if available (most reliable)
  if (countryCode) {
    const normalizedCode = countryCode.trim().toUpperCase();
    
    // Direct lookup
    if (COUNTRY_COORDINATES[normalizedCode]) {
      if (typeof window !== "undefined") {
        console.log("[Geo] ✓ Found country code coordinates:", COUNTRY_COORDINATES[normalizedCode], "for code:", normalizedCode);
      }
      return COUNTRY_COORDINATES[normalizedCode];
    }
    
    // If not found, provide detailed debugging info
    if (typeof window !== "undefined") {
      console.warn("[Geo] ✗ Country code coordinates not found for code:", normalizedCode);
      const allCodes = Object.keys(COUNTRY_COORDINATES).sort();
      console.log("[Geo] Total available country codes:", allCodes.length);
      
      // Check if code exists (case-insensitive)
      const exists = allCodes.find(code => code.toUpperCase() === normalizedCode);
      if (exists && exists !== normalizedCode) {
        console.warn("[Geo] ⚠ Code exists but with different case:", exists, "(looking for:", normalizedCode + ")");
        // Use the correct case version
        return COUNTRY_COORDINATES[exists];
      }
      
      // Show if it's close to any existing code
      const similarCodes = allCodes.filter(code => 
        code.startsWith(normalizedCode[0]) || 
        normalizedCode.startsWith(code[0])
      );
      if (similarCodes.length > 0) {
        console.log("[Geo] Similar codes found:", similarCodes.slice(0, 5));
      }
      
      // Check if TM specifically exists
      if (normalizedCode === "TM") {
        console.error("[Geo] DEBUG: TM lookup - Object has TM key?", "TM" in COUNTRY_COORDINATES);
        console.error("[Geo] DEBUG: TM value:", COUNTRY_COORDINATES["TM"]);
      }
    }
  }

  // Check if 'country' is actually a country code (2-3 letter uppercase string)
  // This handles cases where the data source puts the code in the country field
  if (country && /^[A-Z]{2,3}$/.test(country.trim().toUpperCase())) {
    const possibleCode = country.trim().toUpperCase();
    if (COUNTRY_COORDINATES[possibleCode]) {
      if (typeof window !== "undefined") {
        console.log("[Geo] Found coordinates - 'country' was actually a code:", COUNTRY_COORDINATES[possibleCode], "for code:", possibleCode);
      }
      return COUNTRY_COORDINATES[possibleCode];
    } else {
      if (typeof window !== "undefined") {
        console.warn("[Geo] 'country' looks like a code but not found in coordinates:", possibleCode);
      }
    }
  }

  // Fallback to country center using country name
  if (country) {
    const codeFromName = getCountryCode(country);
    if (codeFromName && COUNTRY_COORDINATES[codeFromName]) {
      if (typeof window !== "undefined") {
        console.log("[Geo] Found coordinates via country name:", COUNTRY_COORDINATES[codeFromName], "for country:", country, "-> code:", codeFromName);
      }
      return COUNTRY_COORDINATES[codeFromName];
    } else {
      if (typeof window !== "undefined") {
        console.warn("[Geo] Could not find coordinates for country name:", country, "resolved code:", codeFromName);
      }
    }
  }

  if (typeof window !== "undefined") {
    console.error("[Geo] Failed to find coordinates for:", { country, city, countryCode });
  }
  return null;
}

/**
 * Convert country name to ISO country code
 * Simple mapping for common countries
 */
function getCountryCode(country: string): string | null {
  const countryMap: Record<string, string> = {
    "Russia": "RU",
    "United States": "US",
    "China": "CN",
    "Australia": "AU",
    "Netherlands": "NL",
    "Germany": "DE",
    "United Kingdom": "GB",
    "France": "FR",
    "Japan": "JP",
    "South Korea": "KR",
    "India": "IN",
    "Singapore": "SG",
    "Brazil": "BR",
    "Canada": "CA",
    "Mexico": "MX",
    "Argentina": "AR",
    "South Africa": "ZA",
    "United Arab Emirates": "AE",
    "Turkey": "TR",
    "Poland": "PL",
    "Italy": "IT",
    "Spain": "ES",
    "Sweden": "SE",
    "Norway": "NO",
    "Denmark": "DK",
    "Switzerland": "CH",
    "Ireland": "IE",
    "Czech Republic": "CZ",
    "Austria": "AT",
    "Belgium": "BE",
    "Portugal": "PT",
    "Greece": "GR",
    "Finland": "FI",
    "New Zealand": "NZ",
    "Indonesia": "ID",
    "Thailand": "TH",
    "Philippines": "PH",
    "Vietnam": "VN",
    "Malaysia": "MY",
    "Taiwan": "TW",
    "Hong Kong": "HK",
    "Israel": "IL",
    "Egypt": "EG",
    "Nigeria": "NG",
    "Kenya": "KE",
    "Saudi Arabia": "SA",
    "Chile": "CL",
    "Colombia": "CO",
    "Peru": "PE",
  };

  return countryMap[country] || null;
}

/**
 * Convert ISO country code to country name
 * Reverse mapping of getCountryCode
 */
export function getCountryNameFromCode(countryCode: string | null): string | null {
  if (!countryCode) return null;
  
  const codeToNameMap: Record<string, string> = {
    "RU": "Russia",
    "US": "United States",
    "CN": "China",
    "AU": "Australia",
    "NL": "Netherlands",
    "DE": "Germany",
    "GB": "United Kingdom",
    "FR": "France",
    "JP": "Japan",
    "KR": "South Korea",
    "IN": "India",
    "SG": "Singapore",
    "BR": "Brazil",
    "CA": "Canada",
    "MX": "Mexico",
    "AR": "Argentina",
    "ZA": "South Africa",
    "AE": "United Arab Emirates",
    "TR": "Turkey",
    "PL": "Poland",
    "IT": "Italy",
    "ES": "Spain",
    "SE": "Sweden",
    "NO": "Norway",
    "DK": "Denmark",
    "CH": "Switzerland",
    "IE": "Ireland",
    "CZ": "Czech Republic",
    "AT": "Austria",
    "BE": "Belgium",
    "PT": "Portugal",
    "GR": "Greece",
    "FI": "Finland",
    "NZ": "New Zealand",
    "ID": "Indonesia",
    "TH": "Thailand",
    "PH": "Philippines",
    "VN": "Vietnam",
    "MY": "Malaysia",
    "TW": "Taiwan",
    "HK": "Hong Kong",
    "IL": "Israel",
    "EG": "Egypt",
    "NG": "Nigeria",
    "KE": "Kenya",
    "SA": "Saudi Arabia",
    "CL": "Chile",
    "CO": "Colombia",
    "PE": "Peru",
    "RO": "Romania",
    "HU": "Hungary",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "HR": "Croatia",
    "BG": "Bulgaria",
    "RS": "Serbia",
    "UA": "Ukraine",
    "BY": "Belarus",
    "LT": "Lithuania",
    "LV": "Latvia",
    "EE": "Estonia",
    "IS": "Iceland",
    "LU": "Luxembourg",
    "MT": "Malta",
    "CY": "Cyprus",
    "TM": "Turkmenistan",
    "KZ": "Kazakhstan",
    "UZ": "Uzbekistan",
    "KG": "Kyrgyzstan",
    "TJ": "Tajikistan",
    "PK": "Pakistan",
    "BD": "Bangladesh",
    "LK": "Sri Lanka",
    "MM": "Myanmar",
    "KH": "Cambodia",
    "LA": "Laos",
    "MN": "Mongolia",
    "JO": "Jordan",
    "LB": "Lebanon",
    "IQ": "Iraq",
    "IR": "Iran",
    "AF": "Afghanistan",
    "DZ": "Algeria",
    "MA": "Morocco",
    "TN": "Tunisia",
    "LY": "Libya",
    "SD": "Sudan",
    "ET": "Ethiopia",
    "GH": "Ghana",
    "SN": "Senegal",
    "CI": "Côte d'Ivoire",
    "CM": "Cameroon",
    "UG": "Uganda",
    "TZ": "Tanzania",
    "ZW": "Zimbabwe",
    "AO": "Angola",
    "MZ": "Mozambique",
    "VU": "Vanuatu",
    "FJ": "Fiji",
  };
  
  return codeToNameMap[countryCode.toUpperCase()] || null;
}

/**
 * Get target coordinates from ThreatResult
 * Returns coordinates or null if unavailable
 */
export function getTargetCoordinates(result: ThreatResult): [number, number] | null {
  const geo = extractGeoFromThreatResult(result);
  const coords = getCoordinatesFromLocation(geo.country, geo.city, geo.countryCode);
  
  if (typeof window !== "undefined") {
    console.log("[Geo] Coordinate lookup:", {
      input: { country: geo.country, city: geo.city, countryCode: geo.countryCode },
      result: coords,
      found: !!coords,
    });
  }
  
  return coords;
}

/**
 * Validate coordinates (lat must be -90 to 90, lng must be -180 to 180)
 */
export function isValidCoordinates(coords: [number, number] | null): boolean {
  if (!coords) return false;
  const [lat, lng] = coords;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

