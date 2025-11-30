import { NextRequest, NextResponse } from "next/server";
import { getThreatIntel } from "@/lib/intel-service";

/**
 * API Route: /api/scan
 * Secure proxy for threat intelligence queries
 * Client NEVER calls external APIs directly - all requests go through here
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Validate query format (basic check for IP or domain)
    const isValidQuery = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$|^(\d{1,3}\.){3}\d{1,3}$/.test(query.trim());
    
    if (!isValidQuery) {
      return NextResponse.json(
        { error: "Invalid query format. Please provide a valid IP address or domain." },
        { status: 400 }
      );
    }

    // Call the service layer which handles mock-toggle logic
    const result = await getThreatIntel(query.trim());

    return NextResponse.json(result);
  } catch (error) {
    // Handle known errors
    if (error instanceof Error) {
      if (error.message === "MISSING_PROD_KEYS") {
        return NextResponse.json(
          { error: "MISSING_PROD_KEYS: Required API keys are not configured" },
          { status: 500 }
        );
      }

      // Generic error handling
      console.error("Threat intelligence fetch error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch threat intelligence" },
        { status: 500 }
      );
    }

    // Unknown error
    return NextResponse.json(
      { error: "Unknown error occurred while fetching threat intelligence" },
      { status: 500 }
    );
  }
}

