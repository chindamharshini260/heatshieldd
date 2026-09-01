import React, { useState, useMemo } from 'react';
import {
  Layers,
  MapPin,
  Flame,
  Shield,
  Hospital,
  Droplets,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  ChevronRight,
  TrendingDown,
  Building,
  Users
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../types';

interface GISImpactMapProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
  selectedWardId?: string;
  onSelectWard: (wardId: string) => void;
}

export type GISMapLayer =
  | 'utci'
  | 'temp'
  | 'wbgt'
  | 'heatIndex'
  | 'htss'
  | 'exposure'
  | 'vulnerability'
  | 'healthRisk'
  | 'priority';

export const GISImpactMap: React.FC<GISImpactMapProps> = ({
  city,
  wardProfiles,
  selectedWardId,
  onSelectWard
}) => {
  const [activeLayer, setActiveLayer] = useState<GISMapLayer>('healthRisk');
  const [showHospitals, setShowHospitals] = useState<boolean>(true);
  const [showCoolingCenters, setShowCoolingCenters] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredWard, setHoveredWard] = useState<WardImpactProfile | null>(null);

  const selectedProfile = useMemo(() => {
    return wardProfiles.find((p) => p.ward.wardId === selectedWardId) || wardProfiles[0];
  }, [wardProfiles, selectedWardId]);

  // Compute map bounding coordinates to normalize SVG canvas projection
  const { minLat, maxLat, minLng, maxLng } = useMemo(() => {
    let minLat = 90,
      maxLat = -90,
      minLng = 180,
      maxLng = -180;
    city.wards.forEach((w) => {
      if (w.coordinates.lat < minLat) minLat = w.coordinates.lat;
      if (w.coordinates.lat > maxLat) maxLat = w.coordinates.lat;
      if (w.coordinates.lng < minLng) minLng = w.coordinates.lng;
      if (w.coordinates.lng > maxLng) maxLng = w.coordinates.lng;
    });
    // Add margin
    const latSpan = Math.max(0.04, maxLat - minLat);
    const lngSpan = Math.max(0.04, maxLng - minLng);
    return {
      minLat: minLat - latSpan * 0.25,
      maxLat: maxLat + latSpan * 0.25,
      minLng: minLng - lngSpan * 0.25,
      maxLng: maxLng + lngSpan * 0.25
    };
  }, [city]);

  // Projects geo coordinate (lat, lng) to SVG viewBox [0..600, 0..420]
  const projectCoord = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 540 + 30;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 360 + 30;
    return { x, y };
  };

  // Determines color for a ward based on the active GIS layer
  const getWardLayerColor = (profile: WardImpactProfile) => {
    switch (activeLayer) {
      case 'utci': {
        const u = profile.currentThermal.utci;
        if (u >= 46) return '#e11d48'; // extreme rose
        if (u >= 42) return '#f97316'; // very strong orange
        if (u >= 38) return '#f59e0b'; // strong amber
        if (u >= 32) return '#eab308'; // moderate yellow
        return '#10b981'; // green
      }
      case 'wbgt': {
        const w = profile.currentThermal.wbgt;
        if (w >= 32) return '#e11d48';
        if (w >= 30) return '#ea580c';
        if (w >= 28) return '#f59e0b';
        return '#3b82f6';
      }
      case 'temp': {
        const t = profile.currentThermal.heatIndex;
        if (t >= 44) return '#991b1b';
        if (t >= 41) return '#dc2626';
        if (t >= 38) return '#ea580c';
        return '#f59e0b';
      }
      case 'htss': {
        const h = profile.currentThermal.htss;
        if (h >= 80) return '#be123c';
        if (h >= 65) return '#ea580c';
        if (h >= 50) return '#f59e0b';
        return '#10b981';
      }
      case 'exposure': {
        const e = profile.humanExposureScore;
        if (e >= 75) return '#e11d48';
        if (e >= 55) return '#f97316';
        if (e >= 35) return '#f59e0b';
        return '#3b82f6';
      }
      case 'vulnerability': {
        const v = profile.vulnerabilityScore;
        if (v >= 75) return '#dc2626';
        if (v >= 55) return '#ea580c';
        if (v >= 35) return '#f59e0b';
        return '#10b981';
      }
      case 'priority': {
        const r = profile.interventionPriorityRank;
        if (r === 1) return '#e11d48';
        if (r <= 3) return '#f97316';
        if (r <= 5) return '#f59e0b';
        return '#3b82f6';
      }
      case 'healthRisk':
      default: {
        const r = profile.healthImpactRisk;
        if (r >= 0.75) return '#e11d48'; // Critical Red
        if (r >= 0.6) return '#ea580c'; // High Orange
        if (r >= 0.45) return '#f59e0b'; // Moderate Amber
        return '#10b981'; // Low Green
      }
    }
  };

  const layerOptions: { id: GISMapLayer; label: string; unit: string }[] = [
    { id: 'healthRisk', label: 'Health Impact Risk', unit: 'Probability (0-1)' },
    { id: 'priority', label: 'Intervention Priority', unit: 'Rank 1-N' },
    { id: 'utci', label: 'UTCI Thermal Stress', unit: '°C' },
    { id: 'wbgt', label: 'WBGT Occupational', unit: '°C' },
    { id: 'htss', label: 'HTSS Stress Score', unit: '0-100' },
    { id: 'exposure', label: 'Human Exposure', unit: 'Score (0-100)' },
    { id: 'vulnerability', label: 'Heat Vulnerability', unit: 'Index (0-100)' },
    { id: 'temp', label: 'Ambient Heat Index', unit: '°C' }
  ];

  return (
    <div id="gis-impact-map-view" className="space-y-4">
      {/* Map Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              GIS COMMAND CENTER: {city.name.toUpperCase()}
            </h2>
            <p className="text-xs text-slate-400">
              Interactive spatial heat risk, vulnerability, and municipal infrastructure overlay
            </p>
          </div>
        </div>

        {/* Layer Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {layerOptions.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                activeLayer === l.id
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Overlay toggles & Zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCoolingCenters(!showCoolingCenters)}
            className={`px-2.5 py-1 text-xs rounded border flex items-center gap-1 font-mono transition-colors ${
              showCoolingCenters
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            Cooling Centers
          </button>
          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-2.5 py-1 text-xs rounded border flex items-center gap-1 font-mono transition-colors ${
              showHospitals
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <Hospital className="w-3.5 h-3.5" />
            Hospitals
          </button>
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-1">{zoomLevel.toFixed(1)}x</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vector SVG GIS Map Stage */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[440px]">
          {/* Spatial Map Header */}
          <div className="flex items-center justify-between mb-2 z-10">
            <div className="text-xs font-mono text-slate-400">
              ACTIVE LAYER:{' '}
              <span className="text-rose-400 font-bold uppercase">
                {layerOptions.find((l) => l.id === activeLayer)?.label}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Coordinates: {city.lat.toFixed(4)}° N, {city.lng.toFixed(4)}° E
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="w-full flex-1 flex items-center justify-center relative">
            <svg
              viewBox="0 0 600 420"
              className="w-full h-full max-h-[460px] select-none transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Background Grid Pattern */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                <radialGradient id="uhiGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="600" height="420" fill="url(#grid)" />

              {/* Urban Heat Island Ambient Heatfield Ambient */}
              <circle cx="300" cy="210" r="180" fill="url(#uhiGlow)" />

              {/* Render Wards as Polygons / Circles */}
              {wardProfiles.map((p) => {
                const { x, y } = projectCoord(p.ward.coordinates.lat, p.ward.coordinates.lng);
                const isSelected = selectedProfile?.ward.wardId === p.ward.wardId;
                const isHovered = hoveredWard?.ward.wardId === p.ward.wardId;
                const fillColor = getWardLayerColor(p);
                const radius = Math.max(35, Math.sqrt(p.ward.totalPopulation) / 7.5);

                return (
                  <g
                    key={p.ward.wardId}
                    id={`map-ward-node-${p.ward.wardId}`}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => onSelectWard(p.ward.wardId)}
                    onMouseEnter={() => setHoveredWard(p)}
                    onMouseLeave={() => setHoveredWard(null)}
                  >
                    {/* Ward Halo */}
                    <circle
                      cx={x}
                      cy={y}
                      r={radius + 6}
                      fill={fillColor}
                      fillOpacity={isSelected ? 0.35 : isHovered ? 0.25 : 0.1}
                      stroke={fillColor}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeDasharray={isSelected ? '4 2' : 'none'}
                    />

                    {/* Ward Base Node */}
                    <circle
                      cx={x}
                      cy={y}
                      r={radius}
                      fill={fillColor}
                      fillOpacity={0.82}
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="hover:scale-105 transition-transform"
                    />

                    {/* Priority Badge Indicator */}
                    <circle
                      cx={x + radius * 0.7}
                      cy={y - radius * 0.7}
                      r="10"
                      fill="#0f172a"
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                    />
                    <text
                      x={x + radius * 0.7}
                      y={y - radius * 0.7 + 3.5}
                      textAnchor="middle"
                      fill="#f43f5e"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      #{p.interventionPriorityRank}
                    </text>

                    {/* Ward Label */}
                    <text
                      x={x}
                      y={y - 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      className="drop-shadow"
                    >
                      {p.ward.wardName.split(' - ')[0]}
                    </text>
                    <text
                      x={x}
                      y={y + 9}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      {activeLayer === 'utci'
                        ? `${p.currentThermal.utci}°C`
                        : activeLayer === 'healthRisk'
                        ? `${(p.healthImpactRisk * 100).toFixed(0)}% Risk`
                        : `${p.ward.totalPopulation.toLocaleString()} pop`}
                    </text>

                    {/* Infrastructure Icons */}
                    {showCoolingCenters && p.ward.existingCoolingCenters > 0 && (
                      <g transform={`translate(${x - 18}, ${y + radius * 0.5})`}>
                        <circle cx="6" cy="6" r="7" fill="#0284c7" stroke="#0f172a" strokeWidth="1" />
                        <text x="6" y="9" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                          ❄
                        </text>
                      </g>
                    )}

                    {showHospitals && p.ward.healthcareFacilitiesCount > 0 && (
                      <g transform={`translate(${x + 6}, ${y + radius * 0.5})`}>
                        <circle cx="6" cy="6" r="7" fill="#059669" stroke="#0f172a" strokeWidth="1" />
                        <text x="6" y="9" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                          +
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-300">Legend:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-600" />
                <span className="text-slate-400">Critical / Rank #1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-slate-400">High Risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-400">Moderate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-400">Lower Watch</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Click ward node to open full impact dossier
            </div>
          </div>
        </div>

        {/* Ward Impact Profile Inspector Drawer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-slate-100">WARD IMPACT PROFILE</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Priority Rank #{selectedProfile.interventionPriorityRank}
              </span>
            </div>

            <div className="mt-3">
              <h4 className="text-base font-bold text-slate-100">{selectedProfile.ward.wardName}</h4>
              <p className="text-xs text-slate-400">{selectedProfile.ward.zone}, {city.name}</p>
            </div>

            {/* Core Thermal Indices in Selected Ward */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">UTCI Stress</div>
                <div className="text-base font-bold text-orange-400 font-mono">
                  {selectedProfile.currentThermal.utci}°C
                </div>
                <div className="text-[9px] text-slate-400 truncate">{selectedProfile.currentThermal.category}</div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">Health Impact Risk</div>
                <div className="text-base font-bold text-rose-400 font-mono">
                  {(selectedProfile.healthImpactRisk * 100).toFixed(0)}%
                </div>
                <div className="text-[9px] text-slate-400">Hospital Surge: {(selectedProfile.hospitalizationSurgeProbability * 100).toFixed(0)}%</div>
              </div>
            </div>

            {/* Demographics & Built Environment */}
            <div className="mt-3.5 bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
              <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wide">
                Census Demographic & Exposure Indicators
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Population:</span>
                  <span className="font-mono">{selectedProfile.ward.totalPopulation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Population Density:</span>
                  <span className="font-mono">{selectedProfile.ward.populationDensity.toLocaleString()} /km²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Elderly (60+):</span>
                  <span className="font-mono text-amber-400">
                    {selectedProfile.ward.elderlyPopulation60Plus.toLocaleString()} ({(selectedProfile.ward.elderlyRatio * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Outdoor Labor Force:</span>
                  <span className="font-mono text-rose-400">
                    {selectedProfile.ward.outdoorWorkerPopulation.toLocaleString()} ({(selectedProfile.ward.outdoorWorkerRatio * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Informal Slum Ratio:</span>
                  <span className="font-mono">{(selectedProfile.ward.slumInformalHousingRatio * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">NDVI Green Index:</span>
                  <span className="font-mono">{selectedProfile.ward.vegetationIndexNDVI} (Low shade)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Built-Up Concrete UHI:</span>
                  <span className="font-mono">{(selectedProfile.ward.imperviousBuiltupRatio * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Priority Rationale & Action Window */}
            <div className="mt-3 p-2.5 bg-amber-950/20 border border-amber-800/40 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-amber-300">Intervention Rationale:</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {selectedProfile.priorityReason}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectWard(selectedProfile.ward.wardId)}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow transition-colors"
            >
              Open What-If Simulator for this Ward
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
