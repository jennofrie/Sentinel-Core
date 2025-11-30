/**
 * Threat Intelligence Data Contract
 * Standardized interface for aggregated threat intelligence results
 */

export type ThreatVerdict = "SAFE" | "MALICIOUS";

export interface ThreatResult {
  /** The queried IP address or domain */
  ip: string;
  /** Overall verdict based on risk assessment */
  verdict: ThreatVerdict;
  /** Overall risk score (0-100) */
  riskScore: number;
  /** Raw data from various intelligence sources */
  data: {
    /** VirusTotal API response data (can be null if failed) */
    virusTotal: any;
    /** Shodan API response data (can be null if failed) */
    shodan: any;
    /** Google Safe Browsing API response data (can be null if failed) */
    safeBrowsing: any;
    /** AbuseIPDB API response data (can be null if failed) */
    abuseIPDB: any;
  };
  /** System errors encountered during data collection (Black Box Recorder) */
  systemErrors: string[];
}

