# 🛡️ SENTINEL - Blue Team Threat Intelligence Dashboard

> **A single-pane-of-glass threat intelligence aggregation platform for cybersecurity analysts**

[![Next.js](https://img.shields.io/badge/Next.js-16.0.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

**SENTINEL** is a production-ready threat intelligence dashboard that aggregates data from multiple security sources (VirusTotal, AbuseIPDB, Google Safe Browsing, Shodan) into a unified interface. Built for **blue team analysts** and **SOC teams** who need rapid IOC (Indicator of Compromise) analysis without context switching between tools.

---

## 🎯 Real-World Application

### Use Cases

- **SOC Operations**: Rapid triage of suspicious IPs/domains during incident response
- **Threat Hunting**: Investigate IOCs from threat intelligence feeds
- **Phishing Investigation**: Analyze malicious domains and URLs
- **Network Security**: Assess external IPs attempting to connect to your infrastructure
- **Malware Analysis**: Correlate indicators across multiple threat intelligence sources
- **Security Research**: Aggregate intelligence for threat actor attribution

### Key Benefits

✅ **Faster Analysis**: Single interface eliminates context switching between 4+ tools  
✅ **Risk Scoring**: Automated aggregation produces unified risk scores  
✅ **Geographic Visualization**: World map shows threat origins and attack paths  
✅ **Historical Tracking**: Maintain search history for pattern analysis  
✅ **Secure Architecture**: Server-side API proxy protects API keys  
✅ **Production Ready**: Robust error handling ensures partial data collection

---

## ✨ Features

### 🔍 Multi-Source Threat Intelligence

- **VirusTotal Integration**: Engine reputation, malicious detection rates, domain analysis
- **AbuseIPDB Integration**: Abuse confidence scores, user reports, geolocation data
- **Google Safe Browsing**: URL/domain threat classification (malware, phishing, unwanted software)
- **Shodan Integration**: Open ports, CVEs, service banners, honeypot detection

### 📊 Visual Analytics

- **Threat Radar Chart**: Multi-dimensional risk visualization (Malicious, Spam, Phishing, Vulnerability vectors)
- **World Map Visualization**: Geographic threat intelligence with animated connection paths
- **Risk-Based Color Coding**: Dynamic UI that reflects threat severity
- **Interactive Markers**: Origin and target location visualization

### 🔒 Security-First Architecture

- **Secure Proxy Pattern**: All external API calls routed through Next.js API routes
- **Server-Side Key Management**: API keys never exposed to client
- **Error Resilience**: "Airbag Pattern" ensures partial data collection even if sources fail
- **Mock Data Toggle**: Safe development/testing without consuming API quotas

### 📈 Operational Features

- **Search History**: Last 10 scans automatically stored in Supabase PostgreSQL
- **System Logging**: Comprehensive "Black Box Recorder" for audit trails
- **Module Status Monitoring**: Real-time visibility into threat intelligence source availability
- **Responsive Design**: Works on desktop, tablet, and mobile devices

---

## 🏗️ Architecture

### Security Design Principles

```
┌─────────────┐
│   Client    │ ← Never touches external APIs
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Next.js API    │ ← Secure Proxy (API keys server-side)
│  Route (/api)   │
└──────┬──────────┘
       │
       ├──► VirusTotal API
       ├──► AbuseIPDB API
       ├──► Google Safe Browsing API
       └──► Shodan API
```

### Key Architectural Decisions

1. **Client Isolation**: Frontend never directly calls external APIs, preventing API key exposure
2. **Parallel Processing**: Uses `Promise.allSettled()` to fetch from all sources simultaneously
3. **Error Collection**: "Airbag Pattern" collects errors without failing the entire request
4. **Type Safety**: Full TypeScript coverage ensures data integrity
5. **Database Persistence**: Supabase PostgreSQL for search history and monitored assets

---

## 🛠️ Tech Stack

### Core Technologies

- **Frontend Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 3.4 with custom "Cyber-Warfare" design system
- **Database**: Supabase (PostgreSQL) for data persistence
- **Visualization**: Recharts (radar charts) + react-simple-maps (geographic mapping)

### Threat Intelligence APIs

- VirusTotal API v3
- AbuseIPDB API v2
- Google Safe Browsing API v4
- Shodan InternetDB (free tier) + Shodan API

### Key Libraries

- `lucide-react` - Icon system
- `d3-geo` - Geographic projections
- `topojson-client` - Map topology processing
- `clsx` + `tailwind-merge` - Conditional styling

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for production features)
- API keys from:
  - VirusTotal (optional - free tier available)
  - AbuseIPDB (optional)
  - Google Safe Browsing (optional)
  - Shodan (optional - free InternetDB works without key)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/sentinel-core.git
cd sentinel-core
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# Mock Data Toggle (set to "false" for production API calls)
NEXT_PUBLIC_USE_MOCK_DATA=true

# Threat Intelligence API Keys (optional for production)
VIRUSTOTAL_API_KEY=your_virustotal_key_here
ABUSEIPDB_API_KEY=your_abuseipdb_key_here
GOOGLE_SAFEBROWSING_API_KEY=your_safebrowsing_key_here
SHODAN_API_KEY=your_shodan_key_here

# Supabase Configuration (optional for history features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start (Mock Mode)

By default, the application runs in **mock data mode**, which:
- Requires no API keys
- Returns realistic threat intelligence data
- Perfect for development and testing
- Simulates all threat intelligence sources

To switch to production mode, set `NEXT_PUBLIC_USE_MOCK_DATA=false` in your `.env.local`.

---

## 📖 Usage Guide

### Basic IOC Scanning

1. Navigate to the **Dashboard** page
2. Enter an IP address or domain in the IOC Scanner
3. Click **SCAN** or press Enter
4. Review the aggregated threat intelligence:
   - **Intel Card**: Detailed threat data from all sources
   - **Threat Radar**: Multi-dimensional risk visualization
   - **World Map**: Geographic visualization with connection paths

### Viewing Threat Radar

1. Perform a scan on the Dashboard
2. Navigate to **Threat Radar** in the sidebar
3. View the radar chart and world map visualization side-by-side

### Accessing Search History

1. Navigate to **History** in the sidebar
2. View your last 10 search results
3. Click any entry to view details

### System Logs

1. Navigate to **Settings** in the sidebar
2. View the **Log Terminal** for:
   - Scan initiation logs
   - API call results
   - Module status (ONLINE/OFFLINE)
   - System errors

---

## 🔐 Security Considerations

### API Key Management

- ✅ API keys stored server-side only (never in client code)
- ✅ Environment variables used for configuration
- ✅ Secure API routes prevent key exposure
- ✅ Client never makes direct external API calls

### Best Practices

1. **Never commit `.env.local`** to version control
2. **Use environment-specific keys** (dev/staging/prod)
3. **Rotate API keys** regularly
4. **Monitor API quotas** to prevent service disruption
5. **Use mock data mode** for development/testing

---

## 🎨 Design System

### Color Palette

- **Background**: Deep Slate (`slate-950` to `slate-900` radial gradient)
- **Safe**: Cyan (`#00F0FF`) - Low risk scores
- **Warning**: Amber (`#FFBF00`) - Medium risk scores
- **Threat**: Signal Red (`#FF0033`) - High risk scores

### Typography

- **Headers**: Rajdhani (Tech/Sci-Fi aesthetic)
- **Data/Monospace**: JetBrains Mono (Code aesthetic)

### UI Components

- **Glass Panel**: Frosted glass effect with backdrop blur
- **Cyber-Warfare Theme**: Dark, data-dense, tactical interface
- **Responsive Design**: Mobile-first approach

---

## 📁 Project Structure

```
sentinel-core/
├── app/
│   ├── api/scan/          # Secure API proxy route
│   ├── history/           # Search history page
│   ├── threat-radar/      # Threat visualization page
│   └── settings/          # System logs and settings
├── components/
│   ├── dashboard/         # Main dashboard components
│   ├── visuals/           # Charts and map visualizations
│   └── settings/          # Settings page components
├── lib/
│   ├── adapters/          # API integration adapters
│   ├── utils/             # Geographic utilities
│   └── intel-service.ts   # Core threat intelligence service
├── types/
│   └── intel.ts           # TypeScript type definitions
└── context/
    └── SystemLogContext.tsx  # Global logging system
```

---

## 🔧 Development

### Mock Data System

The application includes a sophisticated mock data system that:

- Returns varied results based on input (hash-based selection)
- Simulates all threat intelligence sources
- Includes realistic threat scenarios (High/Medium/Low/Clean risk)
- Supports both IP addresses and domain names

### Adding New Threat Intelligence Sources

1. Create an adapter in `lib/adapters/`
2. Add the adapter to `lib/intel-service.ts`
3. Update `types/intel.ts` with new data structure
4. Add mock data in `lib/mock-data.ts`
5. Update UI components to display new data

---

## 📊 Blue Team Skills Demonstrated

This project showcases the following cybersecurity competencies:

- ✅ **Threat Intelligence Analysis**: Multi-source IOC correlation
- ✅ **Secure Architecture Design**: API key protection, secure proxy patterns
- ✅ **Incident Response Tools**: Rapid IOC triage and analysis
- ✅ **Data Visualization**: Threat radar charts and geographic mapping
- ✅ **Logging & Monitoring**: Comprehensive system audit trails
- ✅ **Error Handling**: Resilient failure modes (Airbag Pattern)
- ✅ **Database Design**: PostgreSQL schema for threat intelligence storage
- ✅ **API Integration**: RESTful API consumption with error handling
- ✅ **Security Best Practices**: Server-side key management, input validation

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- VirusTotal for threat intelligence API
- AbuseIPDB for IP reputation data
- Google Safe Browsing for URL threat detection
- Shodan for internet-wide scanning data
- Supabase for PostgreSQL hosting

---

## 📧 Contact

For questions, suggestions, or security concerns, please open an issue on GitHub.

---

**Built with ❤️ for the cybersecurity community**

*Last updated: 2024*

