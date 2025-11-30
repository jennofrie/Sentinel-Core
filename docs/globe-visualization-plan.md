# Globe Visualization Implementation Plan

## Overview
Implement a 3D interactive globe visualization showing an animated arc connection from Australia (Sydney) to the scanned IP's geographic location. The globe will be displayed side-by-side with the existing Threat Radar chart in the same panel on the Threat Radar page.

## Requirements
- 3D Interactive Globe using `react-globe.gl`
- Side-by-side layout with existing radar chart
- Animated arc that draws from Australia (-33.8688°S, 151.2093°E) to target location
- Cyber-warfare aesthetic (dark theme, neon colors matching existing design)
- Extract coordinates from VirusTotal (country/city) or AbuseIPDB (countryCode)
- Handle missing geo data gracefully with fallbacks
- Preserve all existing functionality

## Implementation Steps

### 1. Install Dependencies
Add required packages to `package.json`:
- `react-globe.gl` - 3D globe visualization library
- `three` - Three.js core (required by react-globe.gl)
- `@types/three` - TypeScript types for Three.js

```bash
npm install react-globe.gl three @types/three
```

### 2. Create Geographic Utilities Module
**File: `lib/utils/geo-utils.ts`**

Create utility functions to:
- Extract geographic information from ThreatResult
- Convert country/city names to latitude/longitude coordinates
- Provide fallback coordinates for common countries/cities
- Return Australia coordinates as origin point

Key functions:
- `extractGeoFromThreatResult(result: ThreatResult)`: Extract country/city from VirusTotal or AbuseIPDB data
- `getCoordinatesFromLocation(country: string, city?: string)`: Convert location names to [lat, lng] coordinates
- `getAustraliaCoordinates()`: Return Sydney coordinates as origin
- `getFallbackCoordinates(countryCode: string)`: Fallback to country center if city not found

Use a static mapping object for common locations:
```typescript
const LOCATION_COORDINATES: Record<string, [number, number]> = {
  // Major cities by "Country,City" key
  "Russia,Moscow": [55.7558, 37.6173],
  "United States,New York": [40.7128, -74.0060],
  "China,Beijing": [39.9042, 116.4074],
  // ... more cities
  // Country fallbacks
  "RU": [61.5240, 105.3188], // Russia center
  "US": [37.0902, -95.7129], // United States center
  // ... more countries
}
```

### 3. Create Globe Visualization Component
**File: `components/visuals/GlobeVisualization.tsx`**

Create a new component that:
- Accepts `ThreatResult` as prop
- Uses `react-globe.gl` to render 3D globe
- Shows animated arc from Australia to target location
- Matches cyber-warfare aesthetic:
  - Dark background/globe
  - Neon colors (cyan for safe, amber for medium, red for high risk)
  - Glass-panel styling
- Handles missing geo data with "Location Unknown" state
- Makes globe interactive (rotation, zoom)

Key features:
- Extract coordinates using `geo-utils.ts`
- Animate arc drawing on mount/update
- Color-code arc based on risk score (same logic as ThreatRadar)
- Show markers at origin (Australia) and destination (target IP)
- Responsive sizing to fit side-by-side layout

### 4. Update Threat Radar Component
**File: `components/visuals/ThreatRadar.tsx`**

Modify to support side-by-side layout:
- Split existing panel into two columns (grid layout)
- Left column: Existing radar chart (adjusted width)
- Right column: New globe visualization (same height)
- Maintain responsive design for mobile (stack vertically)
- Preserve all existing radar chart functionality

Changes:
```typescript
// Change from single panel to grid layout
<div className="glass-panel rounded-lg p-6">
  <h2 className="text-xl font-bold tracking-wide mb-6">THREAT RADAR</h2>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Existing Radar Chart */}
    <div className="h-[400px] w-full">
      <ResponsiveContainer>...</ResponsiveContainer>
    </div>
    {/* New Globe Visualization */}
    <div className="h-[400px] w-full">
      <GlobeVisualization data={data} />
    </div>
  </div>
</div>
```

### 5. Handle Edge Cases

**Missing Geo Data:**
- If no country/city found in VirusTotal or AbuseIPDB, show "Location Unknown" state
- Display empty globe with Australia marker only
- Show message: "Geographic data unavailable for this IP"

**Invalid Coordinates:**
- Validate lat/lng ranges (-90 to 90 for lat, -180 to 180 for lng)
- Fallback to country center if city coordinates invalid
- Fallback to [0, 0] if country also unknown (show error state)

**Component Loading:**
- Show loading state while globe initializes
- Handle Three.js initialization errors gracefully
- Ensure globe doesn't block page rendering

### 6. Styling Integration

Match existing design system:
- Use `glass-panel` class for container
- Use cyber color palette: `safe-cyan` (#00F0FF), `cyber-amber` (#FFBF00), `signal-red` (#FF0033)
- Use Rajdhani font for labels
- Match border and shadow styles

### 7. Testing Considerations

- Test with mock data (various countries/cities)
- Test with missing geo data
- Test responsive layout (mobile/tablet/desktop)
- Verify no performance issues (globe rendering is GPU-intensive)
- Ensure radar chart still works correctly

## File Structure Changes

```
components/
  visuals/
    ThreatRadar.tsx          # Modified: Side-by-side layout
    GlobeVisualization.tsx   # New: 3D globe component
lib/
  utils/
    geo-utils.ts            # New: Geographic utilities
package.json                 # Modified: Add dependencies
```

## Dependencies to Add

```json
{
  "dependencies": {
    "react-globe.gl": "^2.31.0",
    "three": "^0.169.0",
    "@types/three": "^0.169.0"
  }
}
```

## Estimated Implementation Time

- Dependency installation: 5 minutes
- Geo utilities: 30-45 minutes
- Globe component: 1-1.5 hours
- ThreatRadar integration: 30 minutes
- Styling & edge cases: 30 minutes
- Testing: 30 minutes

**Total: 2-3 hours**

## Potential Challenges

1. **Performance**: 3D globe rendering can be intensive - use React.memo and optimize re-renders
2. **Coordinate Accuracy**: Static mapping may not have all locations - consider using a geocoding service as enhancement
3. **Three.js Bundle Size**: Globe libraries can be large - ensure tree-shaking works
4. **Browser Compatibility**: Verify WebGL support (react-globe.gl requires WebGL)

## Success Criteria

- Globe displays correctly with animated arc on Threat Radar page
- Side-by-side layout works responsively
- Coordinates extracted from VirusTotal/AbuseIPDB data
- Missing geo data handled gracefully
- No existing functionality broken
- Performance acceptable (<100ms initial render, smooth animations)
- Matches cyber-warfare aesthetic

## Notes

- Globe will only render when scan data is available (same condition as ThreatRadar)
- Arc animation should complete within 1-2 seconds
- Consider adding tooltips showing location names on hover
- Future enhancement: Show multiple connection arcs for history scans

