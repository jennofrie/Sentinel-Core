/**
 * VirusTotal API Adapter
 * Handles communication with VirusTotal API
 * Throws descriptive errors for service layer error collection
 */

interface VirusTotalResponse {
  data?: {
    attributes?: {
      as_owner?: string;
      country?: string;
      country_code?: string;
      region?: string;
      city?: string;
      last_analysis_stats?: {
        harmless: number;
        malicious: number;
        suspicious: number;
        undetected: number;
      };
      last_https_certificate?: {
        extensions?: {
          subject_alternative_name?: string[];
        };
      };
      reputation?: number;
    };
  };
}

/**
 * Fetches IP address intelligence from VirusTotal
 */
export async function fetchVirusTotalIP(ip: string): Promise<any> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  
  if (!apiKey) {
    throw new Error("VirusTotal API: API key not configured");
  }

  const endpoint = `https://www.virustotal.com/api/v3/ip_addresses/${ip}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        "x-apikey": apiKey,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Resource not found - not an error, just no data
      }
      if (response.status === 403) {
        throw new Error(`VirusTotal API: 403 Forbidden - Invalid API key or rate limit exceeded`);
      }
      if (response.status === 429) {
        throw new Error(`VirusTotal API: 429 Too Many Requests - Rate limit exceeded`);
      }
      throw new Error(`VirusTotal API: ${response.status} ${response.statusText}`);
    }

    const data: VirusTotalResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with VirusTotal prefix for better error tracking
      throw new Error(`VirusTotal API: ${error.message}`);
    }
    throw new Error("VirusTotal API: Unknown error occurred");
  }
}

/**
 * Fetches domain intelligence from VirusTotal
 */
export async function fetchVirusTotalDomain(domain: string): Promise<any> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  
  if (!apiKey) {
    throw new Error("VirusTotal API: API key not configured");
  }

  const endpoint = `https://www.virustotal.com/api/v3/domains/${domain}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        "x-apikey": apiKey,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Resource not found - not an error, just no data
      }
      if (response.status === 403) {
        throw new Error(`VirusTotal API: 403 Forbidden - Invalid API key or rate limit exceeded`);
      }
      if (response.status === 429) {
        throw new Error(`VirusTotal API: 429 Too Many Requests - Rate limit exceeded`);
      }
      throw new Error(`VirusTotal API: ${response.status} ${response.statusText}`);
    }

    const data: VirusTotalResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`VirusTotal API: ${error.message}`);
    }
    throw new Error("VirusTotal API: Unknown error occurred");
  }
}

