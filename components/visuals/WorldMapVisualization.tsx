"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";
import type { ThreatResult } from "@/types/intel";
import {
  getTargetCoordinates,
  getAustraliaCoordinates,
  isValidCoordinates,
  extractGeoFromThreatResult,
  getCountryNameFromCode,
} from "@/lib/utils/geo-utils";
import { AlertCircle } from "lucide-react";

// World map topology
const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapVisualizationProps {
  data: ThreatResult;
}


export default function WorldMapVisualization({
  data,
}: WorldMapVisualizationProps) {
  const [connectionProgress, setConnectionProgress] = useState(0);

  // Extract coordinates
  const originCoords = getAustraliaCoordinates();
  
  const geo = extractGeoFromThreatResult(data);
  const targetCoords = getTargetCoordinates(data);
  
  const hasValidCoordinates = isValidCoordinates(targetCoords);

  // Get risk-based colors (matching ThreatRadar logic)
  const getRiskColor = (score: number) => {
    if (score > 80) return "#FF0033"; // signal-red
    if (score < 50) return "#00F0FF"; // safe-cyan
    return "#FFBF00"; // cyber-amber
  };

  const connectionColor = getRiskColor(data.riskScore);
  const markerColor = getRiskColor(data.riskScore);

  // Prepare coordinates for markers and line (react-simple-maps uses [lng, lat])
  const originMapCoords: [number, number] = useMemo(
    () => [originCoords[1], originCoords[0]],
    [originCoords]
  );

  const targetMapCoords: [number, number] | null = useMemo(() => {
    if (!hasValidCoordinates || !targetCoords) return null;
    return [targetCoords[1], targetCoords[0]];
  }, [targetCoords, hasValidCoordinates]);

  // Generate intermediate points for smooth arc (simplified great circle approximation)
  const arcPoints: Array<[number, number]> = useMemo(() => {
    if (!targetMapCoords) return [];

    const [startLng, startLat] = originMapCoords;
    const [endLng, endLat] = targetMapCoords;
    const points: Array<[number, number]> = [];
    const numPoints = 50;

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      
      // Simple linear interpolation with arc height for visual effect
      const lat = startLat + (endLat - startLat) * t;
      let lng = startLng + (endLng - startLng) * t;

      // Handle crossing the dateline
      if (Math.abs(endLng - startLng) > 180) {
        if (startLng < 0) {
          lng = lng > 0 ? lng - 360 : lng;
        } else {
          lng = lng < 0 ? lng + 360 : lng;
        }
      }

      // Add slight arc curvature
      const arcHeight = Math.sin(Math.PI * t) * 15;
      points.push([lng, lat + arcHeight]);
    }

    return points;
  }, [originMapCoords, targetMapCoords]);

  // Animate connection line drawing
  useEffect(() => {
    if (!hasValidCoordinates) return;

    setConnectionProgress(0);
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out animation
      const eased = 1 - Math.pow(1 - progress, 3);
      setConnectionProgress(eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasValidCoordinates, targetCoords]);

  // Render error state if coordinates unavailable
      if (!hasValidCoordinates) {
        return (
          <div className="h-full w-full flex flex-col items-center justify-center border border-white/10 rounded-lg bg-slate-900/50 p-6">
            <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-bold mb-2 text-slate-300">Location Unknown</h3>
            <p className="text-sm text-slate-400 font-mono text-center">
              Geographic data unavailable for this IP
            </p>
            {geo.country && (
              <p className="text-xs text-slate-500 font-mono mt-2">
                Country: {geo.country}
              </p>
            )}
            {geo.countryCode && (
              <p className="text-xs text-slate-500 font-mono">
                Code: {geo.countryCode}
              </p>
            )}
            <div className="mt-4 p-2 bg-black/50 rounded text-xs font-mono text-slate-400">
              <div>VT: {data.data?.virusTotal ? 'YES' : 'NO'}</div>
              <div>AbuseIPDB: {data.data?.abuseIPDB ? 'YES' : 'NO'}</div>
              <div>Target Coords: {targetCoords ? `${targetCoords[0]}, ${targetCoords[1]}` : 'NULL'}</div>
            </div>
          </div>
        );
      }


  return (
    <div className="h-full w-full relative bg-slate-950 rounded-lg overflow-hidden">
      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{
          scale: 130,
          center: [0, -15],
        }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* World Map Background */}
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1e293b"
                stroke="#334155"
                strokeWidth={0.5}
                style={{
                  default: {
                    fill: "#1e293b",
                    outline: "none",
                  },
                  hover: {
                    fill: "#334155",
                    outline: "none",
                  },
                  pressed: {
                    fill: "#475569",
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>

        {/* Continent Labels */}
        <Marker coordinates={[-100, 45]}>
          <text
            textAnchor="middle"
            fill="#475569"
            fontSize={10}
            fontFamily="Rajdhani"
            fontWeight="bold"
          >
            NORTH AMERICA
          </text>
        </Marker>
        <Marker coordinates={[-60, -15]}>
          <text
            textAnchor="middle"
            fill="#475569"
            fontSize={10}
            fontFamily="Rajdhani"
            fontWeight="bold"
          >
            SOUTH AMERICA
          </text>
        </Marker>
        <Marker coordinates={[15, 10]}>
          <text
            textAnchor="middle"
            fill="#475569"
            fontSize={10}
            fontFamily="Rajdhani"
            fontWeight="bold"
          >
            AFRICA
          </text>
        </Marker>
        <Marker coordinates={[10, 50]}>
          <text
            textAnchor="middle"
            fill="#475569"
            fontSize={10}
            fontFamily="Rajdhani"
            fontWeight="bold"
          >
            EUROPE
          </text>
        </Marker>
        <Marker coordinates={[90, 45]}>
          <text
            textAnchor="middle"
            fill="#475569"
            fontSize={10}
            fontFamily="Rajdhani"
            fontWeight="bold"
          >
            ASIA
          </text>
        </Marker>
        <Marker coordinates={[135, -25]}>
          <text
            textAnchor="middle"
            fill="#475569"
            fontSize={10}
            fontFamily="Rajdhani"
            fontWeight="bold"
          >
            AUSTRALIA
          </text>
        </Marker>
        <Marker coordinates={[0, -75]}>
          <text
            textAnchor="middle"
            fill="#475569"
            fontSize={10}
            fontFamily="Rajdhani"
            fontWeight="bold"
          >
            ANTARCTICA
          </text>
        </Marker>

        {/* Connection Line - animated arc */}
        {arcPoints.length > 0 && targetMapCoords && (
          <Line
            coordinates={arcPoints.slice(0, Math.max(2, Math.floor(arcPoints.length * connectionProgress)))}
            stroke={connectionColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="5,5"
            opacity={0.8}
            style={{
              filter: `drop-shadow(0 0 3px ${connectionColor})`,
            }}
          />
        )}

        {/* Origin Marker (Australia) */}
        <Marker coordinates={originMapCoords}>
          <circle
            r={6}
            fill="#00F0FF"
            stroke="#00F0FF"
            strokeWidth={2}
            opacity={0.9}
          >
            <animate
              attributeName="r"
              values="6;8;6"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.9;0.6;0.9"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r={3} fill="#00F0FF" />
        </Marker>

        {/* Target Marker */}
        {targetMapCoords && (
          <Marker coordinates={targetMapCoords}>
            <circle
              r={8}
              fill={markerColor}
              stroke={markerColor}
              strokeWidth={2}
              opacity={0.9}
            >
              <animate
                attributeName="r"
                values="8;10;8"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.9;0.6;0.9"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r={4} fill={markerColor} />
          </Marker>
        )}
      </ComposableMap>

      {/* Overlay info */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-10">
        <div className="glass-panel rounded-lg p-3 backdrop-blur-md bg-slate-900/80 border border-white/10">
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#00F0FF" }}
              />
              <span className="text-slate-400">Origin: Australia</span>
            </div>
            {targetCoords && (
              <>
                <div className="text-slate-600">|</div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: markerColor }}
                  />
                  <span className="text-slate-400">
                    Target: {geo.city ? `${geo.city}, ` : ""}
                    {geo.country || getCountryNameFromCode(geo.countryCode) || geo.countryCode || "Unknown"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
