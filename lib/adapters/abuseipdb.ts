/**
 * AbuseIPDB API Adapter
 * Checks IP addresses and domains against AbuseIPDB's abuse database
 * 
 * API Documentation: https://www.abuseipdb.com/api.html
 * Note: AbuseIPDB primarily works with IP addresses. For domains, we resolve them to IPs first.
 */


/**
 * Fetch AbuseIPDB data for an IP address
 * 
 * @param ip - IP address to check
 * @returns Promise<any> - AbuseIPDB API response
 */
async function fetchAbuseIPDBDataForIP(ip: string): Promise<any> {
  const apiKey = process.env.ABUSEIPDB_API_KEY;
  
  if (!apiKey) {
    throw new Error("AbuseIPDB API key not configured");
  }

  // AbuseIPDB API v2 endpoint
  const apiUrl = `https://api.abuseipdb.com/api/v2/check`;

  try {
    // AbuseIPDB API v2 requires API key as query parameter, not header
    const params = new URLSearchParams({
      key: apiKey, // API key must be in query parameters
      ipAddress: ip,
      maxAgeInDays: "90", // Check reports from last 90 days
      verbose: "", // Empty string enables verbose mode
    });

    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("AbuseIPDB API: 401 Unauthorized - Invalid API key");
      }
      if (response.status === 403) {
        throw new Error("AbuseIPDB API: 403 Forbidden - API key lacks required permissions");
      }
      if (response.status === 429) {
        throw new Error("AbuseIPDB API: 429 Too Many Requests - Rate limit exceeded");
      }
      if (response.status === 422) {
        throw new Error("AbuseIPDB API: 422 Unprocessable Entity - Invalid IP address format");
      }
      throw new Error(`AbuseIPDB API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`AbuseIPDB API: ${JSON.stringify(data.errors)}`);
    }

    return data.data;
  } catch (error) {
    // Re-throw known errors
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("AbuseIPDB API: Failed to fetch data");
  }
}

/**
 * Resolve domain to IP addresses using Node.js DNS (server-side only)
 */
async function resolveDomainToIP(domain: string): Promise<string | null> {
  try {
    // Remove protocol if present
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    // Use Node.js dns module for server-side DNS resolution
    // This works in Next.js API routes which run on the server
    // Use dynamic import to handle both CommonJS and ESM
    const dnsModule = await import('dns');
    const dns = dnsModule.promises || dnsModule.default?.promises;
    
    if (!dns) {
      throw new Error("DNS module not available");
    }
    
    try {
      // Try to resolve to IPv4 addresses
      const addresses = await dns.resolve4(cleanDomain);
      if (addresses && addresses.length > 0) {
        // Return the first (primary) IP address
        return addresses[0];
      }
    } catch (resolveError) {
      // If IPv4 resolution fails, try IPv6 or return null
      try {
        const ipv6Addresses = await dns.resolve6(cleanDomain);
        if (ipv6Addresses && ipv6Addresses.length > 0) {
          // Note: AbuseIPDB primarily supports IPv4, but we return it anyway
          // The API will handle if it doesn't support IPv6
          return ipv6Addresses[0];
        }
      } catch (ipv6Error) {
        // Both IPv4 and IPv6 resolution failed
        return null;
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch AbuseIPDB data for a domain
 * Resolves the domain to IP addresses and checks the primary IP
 * 
 * @param domain - Domain name to check
 * @returns Promise<any> - AbuseIPDB API response for the domain's primary IP
 */
async function fetchAbuseIPDBDataForDomain(domain: string): Promise<any> {
  try {
    // Remove protocol if present
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    // Resolve domain to IP
    const resolvedIP = await resolveDomainToIP(cleanDomain);
    
    if (!resolvedIP) {
      throw new Error(`AbuseIPDB: Failed to resolve domain ${cleanDomain} to IP address`);
    }
    
    // Check the resolved IP address with AbuseIPDB
    const result = await fetchAbuseIPDBDataForIP(resolvedIP);
    
    // Add domain information to the result
    return {
      ...result,
      originalDomain: cleanDomain,
      resolvedIP: resolvedIP,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("AbuseIPDB: Failed to check domain");
  }
}

/**
 * Fetch AbuseIPDB threat intelligence for a given query (IP or Domain)
 * 
 * @param query - IP address or domain name to check
 * @returns Promise<any> - AbuseIPDB API response
 */
export async function fetchAbuseIPDBData(query: string): Promise<any> {
  const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(query.trim());
  
  if (isIP) {
    return await fetchAbuseIPDBDataForIP(query.trim());
  } else {
    return await fetchAbuseIPDBDataForDomain(query.trim());
  }
}

