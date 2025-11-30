# SENTINEL - Blue Team Threat Intelligence Dashboard
## 1. Project Vision
A "Single-Pane-of-Glass" dashboard for Cybersecurity Analysts.
**Goal:** Input one IOC (IP/Domain) -> Receive aggregated intelligence from VirusTotal, AbuseIPDB, and Safe Browsing.
**Aesthetic:** High-end "Cyber-Warfare" interface. Dark, tabular, data-dense. No "AI Slop" (generic layouts).

## 2. Architecture: "The Secure Proxy"
* **Frontend:** Next.js (App Router) + Tailwind CSS + ShadCN UI.
* **Middleware (The Shield):** Next.js API Routes (`/api/scan`).
    * *Rule:* Client NEVER calls external APIs directly.
    * *Rule:* All API keys are stored server-side.
* **Database:** Supabase (PostgreSQL) for storing user history and "Monitored Assets".
* **Hosting:** Netlify (CI/CD).

## 3. Data Strategy: The "Mock-Toggle" (CRITICAL)
* **Mechanism:** strict use of `NEXT_PUBLIC_USE_MOCK_DATA` env variable.
    * `"true"` -> Serve local JSON from `lib/mock-data.ts`. (Development default).
    * `"false"` -> Call real external APIs. (Production only).
* **Sanity Check:** If in Production mode and keys are missing, the App MUST crash explicitly with a clear error message, not fail silently.

## 4. Design System & UX
* **Typography:** Headers: 'Rajdhani' (Tech/Sci-Fi). Data: 'JetBrains Mono' (Code).
* **Palette:**
    * Bg: Deep Slate (`slate-950` to `slate-900` radial).
    * Accents: Electric Amber (`#FFBF00`) for warnings, Signal Red (`#FF0033`) for threats, Cyan (`#00F0FF`) for safe.
* **Visualization:**
    * "Threat Radar": A Recharts RadarChart mapping different risk vectors.
    * Reactive UI: The entire border/theme glows Red if the Risk Score > 80.

## 5. Roadmap
* **Phase 1:** Layout Shell, Design System, Mock Data Engine. (NO REAL API).
* **Phase 2:** Service Layer, Type Definitions, Real API Integration (Server-side).
### Shodan Integration Strategy (Added to Phase 2)
* **API Limit Safety:**
    * We will prioritize the **InternetDB API** (`internetdb.shodan.io/{ip}`) for quick scans because it is free and requires no key (great fallback).
    * We will use the **Full Shodan API** (`api.shodan.io`) only when the user requests a "Deep Scan" to save credits.
* **Data Mapping:**
    * `ports` -> Mapped to `ThreatResult.openPorts` (Array).
    * `vulns` -> Mapped to `ThreatResult.vulnerabilities` (Object).
    * `honeyscore` -> Affects `ThreatResult.verdict`.


* **Phase 3:** Visualization (Radar Charts) & "Defang" Utilities.
* **Phase 4:** Supabase Integration (Auth/History).