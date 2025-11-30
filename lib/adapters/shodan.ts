/**
 * Shodan API Adapter
 * Handles communication with Shodan API and InternetDB
 * Throws descriptive errors for service layer error collection
 */

/**
 * Fetches IP intelligence from Shodan InternetDB (free, no key required)
 * Falls back to full Shodan API if key is available
 */
export async function fetchShodanData(ip: string): Promise<any> {
  // First, try InternetDB (free, no key required)
  try {
    const internetDBResponse = await fetch(
      `https://internetdb.shodan.io/${ip}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!internetDBResponse.ok) {
      if (internetDBResponse.status === 404) {
        // IP not found in InternetDB - not necessarily an error
        // Try full Shodan API if key is available
        return await fetchFullShodanAPI(ip);
      }
      throw new Error(`Shodan InternetDB: ${internetDBResponse.status} ${internetDBResponse.statusText}`);
    }

    const data = await internetDBResponse.json();
    return {
      source: "internetdb",
      ...data,
    };
  } catch (error) {
    // If InternetDB fails, try full Shodan API
    if (error instanceof Error && !error.message.includes("InternetDB")) {
      // Network error - try full API
      return await fetchFullShodanAPI(ip);
    }
    
    // InternetDB specific error - try full API as fallback
    try {
      return await fetchFullShodanAPI(ip);
    } catch (fullAPIError) {
      // If both fail, throw InternetDB error (more descriptive)
      if (error instanceof Error) {
        throw new Error(`Shodan InternetDB: ${error.message}`);
      }
      throw new Error("Shodan InternetDB: Failed to fetch data");
    }
  }
}

/**
 * Fetches full Shodan API data (requires API key)
 */
async function fetchFullShodanAPI(ip: string): Promise<any> {
  const apiKey = process.env.SHODAN_API_KEY;

  if (!apiKey) {
    // No key available - this is expected, don't throw error
    // Let the service layer know InternetDB is the only option
    return null;
  }

  const endpoint = `https://api.shodan.io/shodan/host/${ip}?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(`Shodan API: 403 Forbidden - Invalid API key or insufficient credits`);
      }
      if (response.status === 429) {
        throw new Error(`Shodan API: 429 Too Many Requests - Rate limit exceeded`);
      }
      if (response.status === 404) {
        return null; // IP not found - not an error
      }
      throw new Error(`Shodan API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      source: "full_api",
      ...data,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Shodan API: ${error.message}`);
    }
    throw new Error("Shodan API: Unknown error occurred");
  }
}

