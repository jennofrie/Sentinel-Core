import { supabase } from "./supabase";
import type { ThreatResult } from "@/types/intel";

export interface HistoryEntry {
  id: string;
  ip: string;
  risk_score: number;
  verdict: string;
  created_at: string;
  details: ThreatResult;
}

/**
 * Serialize ThreatResult to ensure it's JSON-compatible
 * Converts Date objects to ISO strings and removes any circular references
 */
function serializeThreatResult(result: ThreatResult): any {
  try {
    // Convert to JSON and back to ensure serializability
    const serialized = JSON.parse(JSON.stringify(result, (key, value) => {
      // Handle Date objects
      if (value instanceof Date) {
        return value.toISOString();
      }
      // Handle any other non-serializable values
      if (typeof value === 'undefined') {
        return null;
      }
      return value;
    }));
    return serialized;
  } catch (error) {
    console.error("Error serializing ThreatResult:", error);
    // Fallback: create a minimal serializable version
    return {
      ip: result.ip,
      verdict: result.verdict,
      riskScore: result.riskScore,
      data: {},
      systemErrors: result.systemErrors || [],
    };
  }
}

/**
 * Add a search result to history
 * The database trigger 'enforce_search_limit' automatically keeps only the latest 10
 */
export async function addToHistory(result: ThreatResult) {
  // Check if we're in browser environment
  if (typeof window === "undefined") {
    console.warn("addToHistory called on server side, skipping.");
    return { error: null };
  }

  // Check environment variables (client-side)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase not configured, skipping history save.");
    return { error: { message: "Supabase not configured" } };
  }

  // Validate required fields
  if (!result || !result.ip) {
    console.error("Invalid result object:", result);
    return { error: { message: "Invalid result: missing IP address" } };
  }

  try {
    // Serialize the result to ensure JSONB compatibility
    const serializedDetails = serializeThreatResult(result);

    // Prepare insert data
    const insertData = {
      ip: result.ip,
      risk_score: typeof result.riskScore === 'number' ? result.riskScore : 0,
      verdict: typeof result.verdict === 'string' ? result.verdict : 'UNKNOWN',
      details: serializedDetails,
    };

    console.log("Attempting to insert into search_history:", {
      ip: insertData.ip,
      risk_score: insertData.risk_score,
      verdict: insertData.verdict,
    });

    const { data, error } = await supabase
      .from("search_history")
      .insert(insertData)
      .select();

    if (error) {
      console.error("Supabase Insert Error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return { error };
    }
    
    console.log("History saved successfully");
    return { error: null, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to save history exception:", errorMessage, error);
    return { 
      error: {
        message: errorMessage,
        original: error,
      }
    };
  }
}

/**
 * Get the latest 10 search history entries
 */
export async function getHistory() {
  // Check if we're in browser environment
  if (typeof window === "undefined") {
    console.warn("getHistory called on server side, returning empty.");
    return { data: [], error: null };
  }

  // Check environment variables (client-side)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase not configured, returning empty history.");
    return { data: [], error: { message: "Supabase not configured" } };
  }

  try {
    console.log("Fetching from search_history...");
    const { data, error } = await supabase
      .from("search_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Supabase Select Error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return { data: [], error };
    }
    
    console.log("History fetched successfully, count:", data?.length || 0);

    // Cast the details field back to ThreatResult
    const historyData = (data || []).map(entry => ({
      ...entry,
      details: entry.details as ThreatResult
    })) as HistoryEntry[];

    return { data: historyData, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch history exception:", errorMessage, error);
    return { 
      data: [], 
      error: {
        message: errorMessage,
        original: error,
      }
    };
  }
}
