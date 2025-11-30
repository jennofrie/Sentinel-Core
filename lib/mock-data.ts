/**
 * Mock Threat Intelligence Data
 * Multiple mock entries for testing different scenarios
 * Selection based on IP hash for consistent but varied results
 */

import type { ThreatResult } from "@/types/intel";

/**
 * Mock Data 1: HIGH RISK - Malicious Tor Exit Node (85/100)
 * Based on the scan result from the screenshot
 */
const mockHighRisk: ThreatResult = {
  ip: "",
  verdict: "MALICIOUS",
  riskScore: 85,
  data: {
    virusTotal: {
      data: {
        attributes: {
          as_owner: "TheHost LLC",
          country: "Russia",
          country_code: "RU",
          region: "Moscow",
          city: "Moscow",
          last_analysis_stats: {
            harmless: 42,
            malicious: 12,
            suspicious: 5,
            undetected: 9,
          },
          reputation: -92,
          last_https_certificate: {
            extensions: {
              subject_alternative_name: [
                "annamariepiratesdm.com",
              ],
            },
          },
        },
      },
    },
    shodan: {
      source: "internetdb",
      ports: [22, 80, 443],
      vulns: [
        "CVE-2024-39476", "CVE-2024-38473", "CVE-2024-42364", "CVE-2024-38476",
        "CVE-2024-24187", "CVE-2024-24795", "CVE-2024-44098", "CVE-2009-3249",
        "CVE-2025-19612", "CVE-2024-29937", "CVE-2009-0796", "CVE-2024-36673",
        "CVE-2013-4362", "CVE-2024-36476", "CVE-2013-4286", "CVE-2013-1862",
        "CVE-2011-3192", "CVE-2022-22720", "CVE-2017-9798", "CVE-2024-24786",
        "CVE-2017-3167", "CVE-2024-58472", "CVE-2025-33648", "CVE-2013-2249",
        "CVE-2021-40438", "CVE-2017-3941", "CVE-2013-4541", "CVE-2024-47252",
        "CVE-2011-8912", "CVE-2022-23943", "CVE-2022-26377", "CVE-2021-26691",
      ],
      honeyscore: 0.92,
    },
    safeBrowsing: {
      safe: false,
      checkedUrl: "https://annamariepiratesdm.com",
      matches: [
        {
          threatType: "MALWARE",
          platformType: "ANY_PLATFORM",
        },
        {
          threatType: "SOCIAL_ENGINEERING",
          platformType: "ANY_PLATFORM",
        },
      ],
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
      platformTypes: ["ANY_PLATFORM", "ANY_PLATFORM"],
    },
    abuseIPDB: {
      ipAddress: "185.220.101.47",
      isPublic: true,
      ipVersion: 4,
      isWhitelisted: false,
      abuseConfidenceScore: 92,
      countryCode: "RU",
      usageType: "hosting",
      isp: "TheHost LLC",
      domain: "thehost.ru",
      numDistinctUsers: 47,
      totalReports: 156,
      lastReportedAt: new Date().toISOString(),
    },
  },
  systemErrors: [],
};

/**
 * Mock Data 2: MEDIUM RISK - Suspicious Server (58/100)
 */
const mockMediumRisk: ThreatResult = {
  ip: "",
  verdict: "MALICIOUS",
  riskScore: 58,
  data: {
    virusTotal: {
      data: {
        attributes: {
          as_owner: "DigitalOcean LLC",
          country: "United States",
          country_code: "US",
          region: "New York",
          city: "New York",
          last_analysis_stats: {
            harmless: 58,
            malicious: 4,
            suspicious: 2,
            undetected: 4,
          },
          reputation: -45,
          last_https_certificate: {
            extensions: {
              subject_alternative_name: [
                "suspicious-proxy.net",
                "crypto-miner-pool.io",
              ],
            },
          },
        },
      },
    },
    shodan: {
      source: "internetdb",
      ports: [22, 80, 443, 8080, 3306],
      vulns: [
        "CVE-2023-44487", "CVE-2022-22965", "CVE-2021-44228",
        "CVE-2020-1938", "CVE-2019-0708",
      ],
      honeyscore: 0.35,
    },
    safeBrowsing: {
      safe: false,
      checkedUrl: "https://suspicious-proxy.net",
      matches: [
        {
          threatType: "UNWANTED_SOFTWARE",
          platformType: "ANY_PLATFORM",
        },
      ],
      threatTypes: ["UNWANTED_SOFTWARE"],
      platformTypes: ["ANY_PLATFORM"],
    },
    abuseIPDB: {
      ipAddress: "159.89.123.45",
      isPublic: true,
      ipVersion: 4,
      isWhitelisted: false,
      abuseConfidenceScore: 45,
      countryCode: "US",
      usageType: "hosting",
      isp: "DigitalOcean LLC",
      domain: "digitalocean.com",
      numDistinctUsers: 12,
      totalReports: 23,
      lastReportedAt: new Date().toISOString(),
    },
  },
  systemErrors: [],
};

/**
 * Mock Data 3: LOW RISK - Minor Concerns (28/100)
 */
const mockLowRisk: ThreatResult = {
  ip: "",
  verdict: "SAFE",
  riskScore: 28,
  data: {
    virusTotal: {
      data: {
        attributes: {
          as_owner: "Amazon Web Services",
          country: "United States",
          country_code: "US",
          region: "Virginia",
          city: "Ashburn",
          last_analysis_stats: {
            harmless: 62,
            malicious: 1,
            suspicious: 1,
            undetected: 4,
          },
          reputation: 15,
          last_https_certificate: {
            extensions: {
              subject_alternative_name: [
                "api.example-service.com",
                "cdn.example-service.com",
              ],
            },
          },
        },
      },
    },
    shodan: {
      source: "internetdb",
      ports: [443, 80],
      vulns: [],
      honeyscore: 0.05,
    },
    safeBrowsing: {
      safe: true,
      checkedUrl: "https://api.example-service.com",
      matches: [],
      threatTypes: [],
      platformTypes: [],
    },
    abuseIPDB: {
      ipAddress: "52.1.2.3",
      isPublic: true,
      ipVersion: 4,
      isWhitelisted: false,
      abuseConfidenceScore: 15,
      countryCode: "US",
      usageType: "hosting",
      isp: "Amazon Web Services",
      domain: "amazonaws.com",
      numDistinctUsers: 2,
      totalReports: 3,
      lastReportedAt: new Date().toISOString(),
    },
  },
  systemErrors: [
    "Shodan InternetDB: 429 Too Many Requests - Rate limit exceeded",
  ],
};

/**
 * Mock Data 4: CLEAN - Safe IP (8/100)
 */
const mockClean: ThreatResult = {
  ip: "",
  verdict: "SAFE",
  riskScore: 8,
  data: {
    virusTotal: {
      data: {
        attributes: {
          as_owner: "Google LLC",
          country: "United States",
          country_code: "US",
          region: "California",
          city: "Mountain View",
          last_analysis_stats: {
            harmless: 67,
            malicious: 0,
            suspicious: 0,
            undetected: 1,
          },
          reputation: 85,
          last_https_certificate: {
            extensions: {
              subject_alternative_name: [
                "*.google.com",
                "google.com",
                "*.googleapis.com",
              ],
            },
          },
        },
      },
    },
    shodan: {
      source: "internetdb",
      ports: [443, 80],
      vulns: [],
      honeyscore: 0.0,
    },
    safeBrowsing: {
      safe: true,
      checkedUrl: "https://google.com",
      matches: [],
      threatTypes: [],
      platformTypes: [],
    },
    abuseIPDB: {
      ipAddress: "172.217.164.110",
      isPublic: true,
      ipVersion: 4,
      isWhitelisted: true,
      abuseConfidenceScore: 0,
      countryCode: "US",
      usageType: "hosting",
      isp: "Google LLC",
      domain: "google.com",
      numDistinctUsers: 0,
      totalReports: 0,
      lastReportedAt: null,
    },
  },
  systemErrors: [],
};

/**
 * Simple hash function to get consistent index from IP/domain
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * AbuseIPDB Mock Data Scenarios
 * 5 different scenarios for varied testing based on IP hash
 */

// 1. Very High Risk - Malicious Tor Exit Node / Botnet C&C
const abuseIPDBVeryHighRisk = {
  isPublic: true,
  ipVersion: 4,
  isWhitelisted: false,
  abuseConfidenceScore: 95,
  countryCode: "RU",
  countryName: "Russia",
  usageType: "hosting",
  isp: "DarkNet Provider LLC",
  domain: null,
  numDistinctUsers: 85,
  totalReports: 234,
  lastReportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
};

// 2. High Risk - Known Malicious IP / Phishing Host
const abuseIPDBHighRisk = {
  isPublic: true,
  ipVersion: 4,
  isWhitelisted: false,
  abuseConfidenceScore: 78,
  countryCode: "CN",
  countryName: "China",
  usageType: "hosting",
  isp: "Tencent Cloud Computing",
  domain: null,
  numDistinctUsers: 52,
  totalReports: 127,
  lastReportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
};

// 3. Medium Risk - Suspicious Activity / Proxy Server
const abuseIPDBMediumRisk = {
  isPublic: true,
  ipVersion: 4,
  isWhitelisted: false,
  abuseConfidenceScore: 42,
  countryCode: "NL",
  countryName: "Netherlands",
  usageType: "hosting",
  isp: "DigitalOcean LLC",
  domain: null,
  numDistinctUsers: 18,
  totalReports: 48,
  lastReportedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
};

// 4. Low Risk - Minor Concerns / Unusual Activity
const abuseIPDBLowRisk = {
  isPublic: true,
  ipVersion: 4,
  isWhitelisted: false,
  abuseConfidenceScore: 12,
  countryCode: "US",
  countryName: "United States",
  usageType: "hosting",
  isp: "Amazon Web Services",
  domain: null,
  numDistinctUsers: 3,
  totalReports: 6,
  lastReportedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
};

// 5. Clean - Whitelisted / Safe IP
const abuseIPDBClean = {
  isPublic: true,
  ipVersion: 4,
  isWhitelisted: true,
  abuseConfidenceScore: 0,
  countryCode: "US",
  countryName: "United States",
  usageType: "hosting",
  isp: "Google LLC",
  domain: "google.com",
  numDistinctUsers: 0,
  totalReports: 0,
  lastReportedAt: null,
};

/**
 * All AbuseIPDB mock data entries (5 scenarios)
 */
const abuseIPDBMockEntries = [
  abuseIPDBVeryHighRisk,
  abuseIPDBHighRisk,
  abuseIPDBMediumRisk,
  abuseIPDBLowRisk,
  abuseIPDBClean,
];

/**
 * Get AbuseIPDB mock data based on query hash
 * Returns one of 5 scenarios consistently based on IP/domain
 */
function getAbuseIPDBMockData(query: string): any {
  const hash = hashString(query);
  const index = hash % abuseIPDBMockEntries.length;
  const selected = abuseIPDBMockEntries[index];
  
  const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(query);
  
  if (isIP) {
    return {
      ...selected,
      ipAddress: query,
    };
  } else {
    // For domains, simulate resolved IP and add domain info
    const cleanDomain = query.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    // Generate a consistent fake IP based on domain hash
    const domainHash = hashString(cleanDomain);
    const fakeIP = `192.168.${(domainHash % 254) + 1}.${((domainHash * 7) % 254) + 1}`;
    
    return {
      ...selected,
      ipAddress: fakeIP,
      originalDomain: cleanDomain,
      resolvedIP: fakeIP,
    };
  }
}

/**
 * All mock data entries
 */
const mockDataEntries: ThreatResult[] = [
  mockHighRisk,
  mockMediumRisk,
  mockLowRisk,
  mockClean,
];

/**
 * Get mock data based on query string
 * Same query always returns same mock data for consistency
 */
export function getMockDataForQuery(query: string): ThreatResult {
  const hash = hashString(query);
  const index = hash % mockDataEntries.length;
  const selectedMock = mockDataEntries[index];
  
  // Update URLs in Safe Browsing mock data to match the query
  let safeBrowsingData = selectedMock.data.safeBrowsing;
  if (safeBrowsingData) {
    safeBrowsingData = {
      ...safeBrowsingData,
      checkedUrl: query.includes("http://") || query.includes("https://") 
        ? query 
        : `https://${query}`,
    };
  }

  // Get AbuseIPDB mock data (one of 5 scenarios based on query hash)
  const abuseIPDBData = getAbuseIPDBMockData(query);

  return {
    ...selectedMock,
    ip: query,
    data: {
      ...selectedMock.data,
      shodan: selectedMock.data.shodan ? {
        ...selectedMock.data.shodan,
        ip: query,
      } : null,
      safeBrowsing: safeBrowsingData,
      abuseIPDB: abuseIPDBData,
    },
  };
}

// Legacy export for backwards compatibility
export const mockThreatData = mockHighRisk;
