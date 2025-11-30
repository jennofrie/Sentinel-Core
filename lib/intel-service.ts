/**
 * Threat Intelligence Service Layer
 * Handles data retrieval with Mock-Toggle logic and Airbag Pattern error handling
 * 
 * CRITICAL: Client NEVER calls external APIs directly.
 * All API calls must go through Next.js API Routes.
 */

import type { ThreatResult } from "@/types/intel";
import { getMockDataForQuery } from "./mock-data";
import { fetchVirusTotalIP, fetchVirusTotalDomain } from "./adapters/virustotal";
import { fetchShodanData } from "./adapters/shodan";
import { fetchSafeBrowsingData } from "./adapters/safebrowsing";
import { fetchAbuseIPDBData } from "./adapters/abuseipdb";

/**
 * Retrieves threat intelligence for a given IOC (IP or Domain)
 * Uses Promise.allSettled to collect errors without failing completely
 * 
 * @param query - The IP address or domain to query
 * @returns Promise<ThreatResult> - Standardized threat intelligence data with error collection
 */
export async function getThreatIntel(query: string): Promise<ThreatResult> {
  // Mock-Toggle Logic: Check environment variable
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  // MOCK MODE: Return mock data based on query for varied testing results
  if (useMockData) {
    return getMockDataForQuery(query);
  }

  // PRODUCTION MODE: Real API calls with error collection
  const systemErrors: string[] = [];
  
  // Determine if query is IP or domain
  const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(query);

  // Run VirusTotal, Shodan, Safe Browsing, and AbuseIPDB in parallel using Promise.allSettled
  // This ensures we collect partial data even if one fails
  // Note: Safe Browsing works with domains/URLs, not IP addresses
  // AbuseIPDB works with IPs and can resolve domains to IPs
  const [virusTotalResult, shodanResult, safeBrowsingResult, abuseIPDBResult] = await Promise.allSettled([
    isIP ? fetchVirusTotalIP(query) : fetchVirusTotalDomain(query),
    isIP ? fetchShodanData(query) : Promise.resolve(null),
    !isIP ? fetchSafeBrowsingData(query) : Promise.resolve(null),
    fetchAbuseIPDBData(query), // Works with both IPs and domains
  ]);

  // Process VirusTotal result
  let virusTotalData: any = null;
  if (virusTotalResult.status === "fulfilled") {
    virusTotalData = virusTotalResult.value;
  } else {
    // VirusTotal failed - add to errors but continue
    const error = virusTotalResult.reason;
    const errorMessage = error instanceof Error 
      ? error.message 
      : "VirusTotal: Unknown error";
    systemErrors.push(errorMessage);
  }

  // Process Shodan result
  let shodanData: any = null;
  if (shodanResult.status === "fulfilled") {
    shodanData = shodanResult.value;
  } else {
    // Shodan failed - add to errors but continue
    const error = shodanResult.reason;
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Shodan: Unknown error";
    systemErrors.push(errorMessage);
  }

  // Process Safe Browsing result
  let safeBrowsingData: any = null;
  if (safeBrowsingResult.status === "fulfilled") {
    safeBrowsingData = safeBrowsingResult.value;
  } else {
    // Safe Browsing failed - add to errors but continue
    const error = safeBrowsingResult.reason;
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Google Safe Browsing: Unknown error";
    systemErrors.push(errorMessage);
  }

  // Process AbuseIPDB result
  let abuseIPDBData: any = null;
  if (abuseIPDBResult.status === "fulfilled") {
    abuseIPDBData = abuseIPDBResult.value;
  } else {
    // AbuseIPDB failed - add to errors but continue
    const error = abuseIPDBResult.reason;
    const errorMessage = error instanceof Error 
      ? error.message 
      : "AbuseIPDB: Unknown error";
    systemErrors.push(errorMessage);
  }

  // Calculate risk score from available data
  const riskScore = calculateRiskScore(virusTotalData, shodanData, safeBrowsingData, abuseIPDBData);

  // Determine verdict based on risk score
  const verdict: "SAFE" | "MALICIOUS" = riskScore >= 50 ? "MALICIOUS" : "SAFE";

  // Build result with new structure
  const result: ThreatResult = {
    ip: query,
    verdict,
    riskScore,
    data: {
      virusTotal: virusTotalData,
      shodan: shodanData,
      safeBrowsing: safeBrowsingData,
      abuseIPDB: abuseIPDBData,
    },
    systemErrors,
  };

  return result;
}

/**
 * Calculate overall risk score from available intelligence sources
 * Returns 0-100 score based on data quality and threat indicators
 */
function calculateRiskScore(virusTotalData: any, shodanData: any, safeBrowsingData: any, abuseIPDBData: any): number {
  let scores: number[] = [];

  // Calculate from VirusTotal data
  if (virusTotalData?.data?.attributes) {
    const stats = virusTotalData.data.attributes.last_analysis_stats || {};
    const totalEngines = (stats.harmless || 0) + (stats.malicious || 0) + 
                        (stats.suspicious || 0) + (stats.undetected || 0);
    
    if (totalEngines > 0) {
      const maliciousCount = stats.malicious || 0;
      const suspiciousCount = stats.suspicious || 0;
      const vtScore = Math.round(((maliciousCount * 2 + suspiciousCount) / totalEngines) * 100);
      scores.push(vtScore);
    }

    // Reputation score (inverted - lower reputation = higher risk)
    const reputation = virusTotalData.data.attributes.reputation || 0;
    if (reputation !== 0) {
      // Reputation is -100 to 100, convert to 0-100 risk score
      const repScore = Math.max(0, Math.min(100, 100 - reputation));
      scores.push(repScore);
    }
  }

  // Calculate from Shodan data
  if (shodanData) {
    // If Shodan has vulnerability data, increase risk
    if (shodanData.vulns && Array.isArray(shodanData.vulns) && shodanData.vulns.length > 0) {
      const vulnScore = Math.min(100, shodanData.vulns.length * 15); // 15 points per vuln
      scores.push(vulnScore);
    }

    // Honeypot score (if available) - higher honeypot score = higher risk
    if (shodanData.honeyscore !== undefined) {
      const honeyscore = parseFloat(shodanData.honeyscore) || 0;
      scores.push(honeyscore * 100);
    }
  }

  // Calculate from Safe Browsing data
  if (safeBrowsingData) {
    // If Safe Browsing found threats, significantly increase risk
    if (!safeBrowsingData.safe && safeBrowsingData.matches && safeBrowsingData.matches.length > 0) {
      // Each threat type adds risk
      const threatTypes = safeBrowsingData.threatTypes || [];
      let safeBrowsingScore = 0;
      
      // Different threat types have different severity
      threatTypes.forEach((threatType: string) => {
        if (threatType === "MALWARE") {
          safeBrowsingScore = Math.max(safeBrowsingScore, 90); // Very high risk
        } else if (threatType === "SOCIAL_ENGINEERING") {
          safeBrowsingScore = Math.max(safeBrowsingScore, 85); // High risk
        } else if (threatType === "UNWANTED_SOFTWARE") {
          safeBrowsingScore = Math.max(safeBrowsingScore, 60); // Medium-high risk
        } else if (threatType === "POTENTIALLY_HARMFUL_APPLICATION") {
          safeBrowsingScore = Math.max(safeBrowsingScore, 50); // Medium risk
        }
      });
      
      if (safeBrowsingScore > 0) {
        scores.push(safeBrowsingScore);
      }
    }
  }

  // Calculate from AbuseIPDB data
  if (abuseIPDBData) {
    // AbuseIPDB provides abuseConfidenceScore (0-100) and isWhitelisted flag
    const abuseConfidence = abuseIPDBData.abuseConfidenceScore || 0;
    const isWhitelisted = abuseIPDBData.isWhitelisted || false;
    const usageType = abuseIPDBData.usageType || "";
    
    // If whitelisted, reduce risk significantly
    if (isWhitelisted) {
      scores.push(0); // Whitelisted = safe
    } else if (abuseConfidence > 0) {
      // Higher abuse confidence = higher risk
      // AbuseIPDB scores are 0-100, so we can use them directly
      scores.push(abuseConfidence);
      
      // Additional risk based on number of reports
      const reportCount = abuseIPDBData.numDistinctUsers || 0;
      if (reportCount > 10) {
        scores.push(Math.min(100, abuseConfidence + 10)); // Boost for high report count
      }
    }
    
    // Check usage type - some types are inherently more risky
    if (usageType === "hosting" || usageType === "hosting; vpn") {
      // Hosting providers can be riskier
      scores.push(Math.min(100, (abuseConfidence || 0) + 5));
    }
  }

  // If no scores available, default to 0 (safe)
  if (scores.length === 0) {
    return 0;
  }

  // Weighted average: 70% max score, 30% average
  const maxScore = Math.max(...scores);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  return Math.round(maxScore * 0.7 + avgScore * 0.3);
}
