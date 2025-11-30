/**
 * Google Safe Browsing API Adapter
 * Checks URLs and domains against Google's Safe Browsing database
 * 
 * API Documentation: https://developers.google.com/safe-browsing/v4
 */

/**
 * Fetch Safe Browsing threat information for a domain/URL
 * Note: Safe Browsing primarily works with URLs/domains, not IP addresses
 * 
 * @param query - Domain name or URL to check
 * @returns Promise<any> - Safe Browsing API response or null if not found
 */
export async function fetchSafeBrowsingData(query: string): Promise<any> {
  const apiKey = process.env.GOOGLE_SAFEBROWSING_API_KEY;
  
  if (!apiKey) {
    throw new Error("Google Safe Browsing API key not configured");
  }

  // Safe Browsing works with URLs/domains, not IP addresses
  // Convert query to URL format if it's just a domain
  let urlToCheck = query.trim();
  if (!urlToCheck.startsWith("http://") && !urlToCheck.startsWith("https://")) {
    urlToCheck = `https://${urlToCheck}`;
  }

  const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

  try {
    const requestBody = {
      client: {
        clientId: "sentinel-core",
        clientVersion: "1.0.0",
      },
      threatInfo: {
        threatTypes: [
          "MALWARE",
          "SOCIAL_ENGINEERING",
          "UNWANTED_SOFTWARE",
          "POTENTIALLY_HARMFUL_APPLICATION",
        ],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [
          {
            url: urlToCheck,
          },
        ],
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Google Safe Browsing API: 400 Bad Request - Invalid query format");
      }
      if (response.status === 403) {
        throw new Error("Google Safe Browsing API: 403 Forbidden - Invalid API key or quota exceeded");
      }
      if (response.status === 429) {
        throw new Error("Google Safe Browsing API: 429 Too Many Requests - Rate limit exceeded");
      }
      throw new Error(`Google Safe Browsing API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // If no matches, return a success indicator (no threats found)
    if (!data.matches || data.matches.length === 0) {
      return {
        safe: true,
        matches: [],
        checkedUrl: urlToCheck,
      };
    }

    // Return threat matches
    return {
      safe: false,
      matches: data.matches,
      checkedUrl: urlToCheck,
      threatTypes: data.matches.map((match: any) => match.threatType),
      platformTypes: data.matches.map((match: any) => match.platformType),
    };
  } catch (error) {
    // Re-throw known errors
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Google Safe Browsing API: Failed to fetch data");
  }
}

