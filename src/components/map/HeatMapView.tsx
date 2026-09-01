/**
 * HeatShield AI - Page 3: Ward-Level GIS Microclimate Heat Map
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. City & Ward Spatial Intelligence with Interactive Leaflet GIS Map
 * 2. Ward-Level Polygons & Microclimate Centroids with Live Risk Colors (🟢 Low, 🟡 Mod, 🟠 High, 🔴 Ext)
 * 3. Layer Toggles: Heat-Health Risk, Effective Temperature (+UHI), Tree Canopy (NDVI), Built-up Concrete
 * 4. Slide-in / Modal Ward Detail Panel with complete biometeorological & vulnerability decomposition
 * 5. Search / Filter Wards by Name, Zone, or Risk Level
 * 6. Direct Action Triggers for Public Advisories & Municipal Interventions
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as L from 'leaflet';
import {
  MapPin,
  Layers,
  Flame,
  Thermometer,
  Droplets,
  Wind,
  Search,
  CheckCircle2,
  Info,
  Navigation,
  Sparkles,
  ChevronRight,
  X,
  AlertTriangle,
  Users,
  HardHat,
  Heart,
  Trees,
  Building2,
  Clock,
  ShieldAlert,
  Send,
  Calendar,
} from 'lucide-react';
import { CompleteWeatherData, UserLocation } from '../../types/weather';
import { INDIAN_CITIES, findMatchingOrNearestCity } from '../../data/cityData';
import {
  calculateAllCityWardProfiles,
  DetailedWardRiskProfile,
  buildRawWeatherFromWeatherData,
} from '../../utils/wardRiskEngine';
import { RawOpenMeteoResponse } from '../../services/weatherApi';

interface HeatMapViewProps {
  weatherData: CompleteWeatherData | null;
  onSelectLocation?: (location: UserLocation) => void;
  onNavigateToForecast?: () => void;
  onNavigateToAlerts?: () => void;
}

type MapLayer = 'risk' | 'temp' | 'ndvi' | 'uhi';

export const HeatMapView: React.FC<HeatMapViewProps> = ({
  weatherData,
  onSelectLocation,
  onNavigateToForecast,
  onNavigateToAlerts,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Selected city state
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    return findMatchingOrNearestCity(weatherData?.location).id;
  });

  // Keep city in sync if user changes location in dashboard
  useEffect(() => {
    if (weatherData?.location) {
      const matched = findMatchingOrNearestCity(weatherData.location);
      setSelectedCityId(matched.id);
    }
  }, [weatherData?.location]);

  const [activeLayer, setActiveLayer] = useState<MapLayer>('risk');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [activeAdvisoryTab, setActiveAdvisoryTab] = useState<'public' | 'workers' | 'elderly' | 'muni'>('public');

  // Find active city object
  const currentCity = useMemo(() => {
    return INDIAN_CITIES.find((c) => c.id === selectedCityId) || INDIAN_CITIES[0];
  }, [selectedCityId]);

  // Construct real RawOpenMeteoResponse from weatherData
  const rawWeather = useMemo<RawOpenMeteoResponse>(() => {
    return buildRawWeatherFromWeatherData(weatherData, currentCity);
  }, [weatherData, currentCity]);

  // Current hour of day
  const currentHourIndex = useMemo(() => new Date().getHours(), []);

  // Compute detailed profiles for all wards in current city
  const wardProfiles = useMemo<DetailedWardRiskProfile[]>(() => {
    return calculateAllCityWardProfiles(currentCity, rawWeather, currentHourIndex);
  }, [currentCity, rawWeather, currentHourIndex]);

  // Selected ward profile
  const activeWardProfile = useMemo(() => {
    if (!selectedWardId) return wardProfiles[0] || null;
    return wardProfiles.find((p) => p.ward.wardId === selectedWardId) || wardProfiles[0] || null;
  }, [selectedWardId, wardProfiles]);

  // Filtered wards for sidebar search
  const filteredWards = useMemo(() => {
    if (!searchQuery.trim()) return wardProfiles;
    const q = searchQuery.toLowerCase();
    return wardProfiles.filter(
      (p) =>
        p.ward.wardName.toLowerCase().includes(q) ||
        p.ward.zone.toLowerCase().includes(q) ||
        p.healthRisk.category.toLowerCase().includes(q)
    );
  }, [wardProfiles, searchQuery]);

  // Leaflet Map Initialization & Rendering
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentCity.lat, currentCity.lng],
        zoom: 12,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Clean Light Voyager Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([currentCity.lat, currentCity.lng], 12);
    }

    // Render Ward Polygons / Micro-risk Zones
    if (layerGroupRef.current && mapInstanceRef.current) {
      layerGroupRef.current.clearLayers();

      wardProfiles.forEach((profile) => {
        const { ward, healthRisk, currentConditions } = profile;
        const isSelected = selectedWardId === ward.wardId;

        // Choose color based on active layer
        let fillColor = healthRisk.dotColor;
        let layerValue = `${healthRisk.overallScore}/100`;

        if (activeLayer === 'temp') {
          fillColor =
            currentConditions.effectiveTemperature >= 42
              ? '#B91C1C'
              : currentConditions.effectiveTemperature >= 39
              ? '#EA580C'
              : currentConditions.effectiveTemperature >= 36
              ? '#D97706'
              : '#16A34A';
          layerValue = `${currentConditions.effectiveTemperature}°C`;
        } else if (activeLayer === 'ndvi') {
          fillColor =
            ward.vegetationIndexNDVI < 0.12
              ? '#EF4444' // Very low green cover
              : ward.vegetationIndexNDVI < 0.22
              ? '#F59E0B'
              : '#16A34A';
          layerValue = `NDVI ${ward.vegetationIndexNDVI.toFixed(2)}`;
        } else if (activeLayer === 'uhi') {
          fillColor =
            ward.imperviousBuiltupRatio >= 0.9
              ? '#991B1B'
              : ward.imperviousBuiltupRatio >= 0.8
              ? '#EA580C'
              : '#3B82F6';
          layerValue = `+${currentConditions.uhiOffset}°C UHI`;
        }

        // Circular spatial microclimate buffer (radius proportional to area)
        const radiusMeters = Math.max(1400, Math.sqrt(ward.areaSqKm) * 900);

        const circle = L.circle([ward.coordinates.lat, ward.coordinates.lng], {
          radius: radiusMeters,
          color: isSelected ? '#1E40AF' : fillColor,
          weight: isSelected ? 3.5 : 1.8,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.35 : 0.22,
        }).addTo(layerGroupRef.current!);

        // Click handler opens detail modal
        circle.on('click', () => {
          setSelectedWardId(ward.wardId);
          setShowDetailModal(true);
        });

        // Hover tooltip
        circle.bindTooltip(
          `
          <div class="p-1.5 text-xs font-sans">
            <div class="font-bold text-slate-900">${ward.wardName}</div>
            <div class="text-[11px] text-slate-600">${ward.zone} • ${(ward.totalPopulation / 1000).toFixed(0)}k pop</div>
            <div class="mt-1 font-extrabold" style="color: ${fillColor}">
              ${activeLayer === 'risk' ? healthRisk.label : layerValue}
            </div>
            <div class="text-[10px] text-slate-500">Effective Temp: ${currentConditions.effectiveTemperature}°C</div>
          </div>
          `,
          { sticky: true, opacity: 0.95 }
        );

        // Centroid DivIcon Badge
        const badgeIcon = L.divIcon({
          className: 'ward-centroid-badge',
          html: `
            <div 
              style="background-color: ${fillColor}; color: white;" 
              class="px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-md whitespace-nowrap border ${
                isSelected ? 'border-white ring-2 ring-blue-600 scale-110' : 'border-white/80'
              } transition-transform flex items-center gap-1 cursor-pointer"
            >
              <span>${layerValue}</span>
            </div>
          `,
          iconSize: [40, 20],
          iconAnchor: [20, 10],
        });

        const marker = L.marker([ward.coordinates.lat, ward.coordinates.lng], { icon: badgeIcon }).addTo(
          layerGroupRef.current!
        );

        marker.on('click', () => {
          setSelectedWardId(ward.wardId);
          setShowDetailModal(true);
        });
      });

      // User's Location Pulsing Pin if matching current coordinates
      if (weatherData?.location) {
        const uLat = weatherData.location.latitude;
        const uLng = weatherData.location.longitude;
        const distFromCity = Math.sqrt(
          Math.pow(uLat - currentCity.lat, 2) + Math.pow(uLng - currentCity.lng, 2)
        );

        if (distFromCity < 0.35) {
          const userGpsIcon = L.divIcon({
            className: 'user-gps-marker',
            html: `
              <div class="relative flex items-center justify-center w-8 h-8">
                <div class="absolute w-8 h-8 rounded-full bg-blue-500/40 animate-ping"></div>
                <div class="relative w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-black text-[9px]">
                  YOU
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          L.marker([uLat, uLng], { icon: userGpsIcon })
            .addTo(layerGroupRef.current!)
            .bindPopup(`<b>Your GPS Location</b><br>${weatherData.location.locationName}`);
        }
      }
    }
  }, [currentCity, wardProfiles, selectedWardId, activeLayer, weatherData]);

  // Handle City Change
  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const newCity = INDIAN_CITIES.find((c) => c.id === cityId);
    if (newCity && onSelectLocation) {
      onSelectLocation({
        latitude: newCity.lat,
        longitude: newCity.lng,
        locationName: `${newCity.name}, ${newCity.state}, India`,
        city: newCity.name,
        state: newCity.state,
        country: 'India',
        source: 'search',
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. PAGE HEADER & CITY SELECTOR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5" />
            Hyper-Local Ward Risk GIS Platform
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight mt-1.5">
            Ward Heat-Health Risk Map: {currentCity.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Visualizing microclimate thermal stress, impervious concrete trapping, and vulnerable demographic hotspots.
          </p>
        </div>

        {/* City Selector & Layer Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] rounded-xl px-3 py-1.5 shadow-2xs">
            <span className="text-xs font-bold text-[#64748B]">City:</span>
            <select
              value={selectedCityId}
              onChange={(e) => handleCityChange(e.target.value)}
              aria-label="Select target city for ward heat risk map"
              className="text-xs font-extrabold text-[#17233C] bg-transparent outline-none cursor-pointer pr-2"
            >
              {INDIAN_CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.wards.length} Wards)
                </option>
              ))}
            </select>
          </div>

          {onNavigateToForecast && (
            <button
              onClick={onNavigateToForecast}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-xs font-semibold text-[#17233C] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>5-Day Outlook</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. MAP WRAPPER WITH INTERACTIVE CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Large Leaflet Map */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative rounded-2xl border border-[#E2E8F0] overflow-hidden bg-white shadow-xs">
            {/* Top-Right Layer Switcher Bar */}
            <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl p-1 border border-[#E2E8F0] shadow-md flex items-center gap-1 text-xs">
              <button
                onClick={() => setActiveLayer('risk')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeLayer === 'risk'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#17233C] hover:bg-slate-100'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Health Risk</span>
              </button>
              <button
                onClick={() => setActiveLayer('temp')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeLayer === 'temp'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#17233C] hover:bg-slate-100'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5" />
                <span>Temp + UHI</span>
              </button>
              <button
                onClick={() => setActiveLayer('ndvi')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeLayer === 'ndvi'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#17233C] hover:bg-slate-100'
                }`}
              >
                <Trees className="w-3.5 h-3.5" />
                <span>Tree Canopy (NDVI)</span>
              </button>
              <button
                onClick={() => setActiveLayer('uhi')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeLayer === 'uhi'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#17233C] hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Built-up Concrete</span>
              </button>
            </div>

            {/* Top-Left Active City Badge */}
            <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#E2E8F0] shadow-md space-y-1 max-w-[260px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                  Live Spatial Grid
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-[#17233C]">
                {currentCity.name}, {currentCity.state}
              </h3>
              <p className="text-[11px] text-[#64748B]">
                {wardProfiles.length} active municipal wards monitored • Click any ward to inspect
              </p>
            </div>

            {/* Leaflet Map DOM Element */}
            <div ref={mapContainerRef} className="w-full h-[540px] bg-slate-100 z-10" />

            {/* Standardized 4-Tier Risk Scale Legend (Bottom Left) */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl p-3 border border-[#E2E8F0] shadow-md text-xs space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-[#64748B] block">
                {activeLayer === 'risk'
                  ? 'Modeled Heat-Health Risk Scale'
                  : activeLayer === 'temp'
                  ? 'Effective Local Temperature'
                  : activeLayer === 'ndvi'
                  ? 'Vegetation NDVI Cover'
                  : 'Built-up Concrete Ratio'}
              </span>
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span className="flex items-center gap-1 text-[#16A34A]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span> Low (&lt;30)
                </span>
                <span className="flex items-center gap-1 text-[#D97706]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span> Mod (30-54)
                </span>
                <span className="flex items-center gap-1 text-[#EA580C]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]"></span> High (55-74)
                </span>
                <span className="flex items-center gap-1 text-[#E11D48]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]"></span> Extreme (75+)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-[#17233C]">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Hyper-Local Microclimate Divergence: </span>
              Wards with high impervious concrete (UHI &gt; 85%) and low tree canopy (NDVI &lt; 0.12) register effective physiological heat stress up to <strong>+2.2°C higher</strong> than rural baselines. Click any ward to inspect its specific exposure, vulnerability contributors, and health advisory.
            </div>
          </div>
        </div>

        {/* Right 1 Col: Ward Search & Ranking List */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
                Wards in {currentCity.name} ({wardProfiles.length})
              </h2>
              <span className="text-[11px] text-blue-600 font-bold">Sorted by Risk</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ward or zone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-[#17233C]"
              />
            </div>
          </div>

          {/* Ward List */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredWards.map((profile) => {
              const { ward, healthRisk, currentConditions } = profile;
              const isSelected = selectedWardId === ward.wardId;

              return (
                <div
                  key={ward.wardId}
                  onClick={() => {
                    setSelectedWardId(ward.wardId);
                    setShowDetailModal(true);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white border-[#E2E8F0] hover:border-blue-200 hover:bg-slate-50/50 shadow-2xs'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-[#17233C] line-clamp-1">{ward.wardName}</div>
                    <div className="text-[11px] text-[#64748B]">
                      {ward.zone} • {(ward.totalPopulation / 1000).toFixed(0)}k pop
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-slate-500">Effective: {currentConditions.effectiveTemperature}°C</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-rose-600 font-semibold">+{currentConditions.uhiOffset}°C UHI</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${healthRisk.badgeBg} ${healthRisk.badgeColor} ${healthRisk.borderColor}`}
                    >
                      {healthRisk.category}
                    </span>
                    <div className="text-xs font-black text-[#17233C] mt-1">
                      {healthRisk.overallScore}/100
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. DETAILED WARD IMPACT SLIDE-IN / MODAL CARD */}
      {showDetailModal && activeWardProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    {activeWardProfile.ward.zone}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${activeWardProfile.healthRisk.badgeBg} ${activeWardProfile.healthRisk.badgeColor} ${activeWardProfile.healthRisk.borderColor}`}
                  >
                    {activeWardProfile.healthRisk.label} ({activeWardProfile.healthRisk.overallScore}/100)
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#17233C] mt-2">
                  {activeWardProfile.ward.wardName}
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {activeWardProfile.city.name}, {activeWardProfile.city.state} • Population: {activeWardProfile.ward.totalPopulation.toLocaleString()} ({activeWardProfile.ward.populationDensity.toLocaleString()}/km²)
                </p>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Key Microclimate & Thermal Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] block">Effective Temp</span>
                <div className="text-lg font-black text-rose-600">
                  {activeWardProfile.currentConditions.effectiveTemperature}°C
                </div>
                <div className="text-[10px] text-slate-500">
                  Base {activeWardProfile.currentConditions.baseTemperature}°C + {activeWardProfile.currentConditions.uhiOffset}°C UHI
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] block">UTCI Stress</span>
                <div className="text-lg font-black text-[#17233C]">
                  {activeWardProfile.thermalMetrics.utci}°C
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  {activeWardProfile.thermalMetrics.stressCategory}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] block">WBGT (Outdoor)</span>
                <div className="text-lg font-black text-amber-600">
                  {activeWardProfile.thermalMetrics.wbgt}°C
                </div>
                <div className="text-[10px] text-slate-500">
                  Solar Rad: {activeWardProfile.currentConditions.solarRadiationWm2} W/m²
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] block">Heat Index (NOAA)</span>
                <div className="text-lg font-black text-orange-600">
                  {activeWardProfile.thermalMetrics.heatIndex}°C
                </div>
                <div className="text-[10px] text-slate-500">
                  Relative Humidity: {activeWardProfile.currentConditions.relativeHumidity}%
                </div>
              </div>
            </div>

            {/* Vulnerability & Exposure Decomposition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Exposure Box */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-extrabold uppercase text-[#17233C] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    Human Exposure Score
                  </span>
                  <span className="text-xs font-black text-blue-600">{activeWardProfile.exposure.score}/100</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Exposed Population:</span>
                    <strong className="text-[#17233C]">{activeWardProfile.exposure.exposedPopulation.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Outdoor Workers Exposed:</span>
                    <strong className="text-[#17233C]">{activeWardProfile.exposure.outdoorWorkerExposed.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Elderly Residents (60+):</span>
                    <strong className="text-[#17233C]">{activeWardProfile.exposure.elderlyExposed.toLocaleString()}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed pt-1 border-t border-slate-100">
                  {activeWardProfile.exposure.explanation}
                </p>
              </div>

              {/* Vulnerability Contributors */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-extrabold uppercase text-[#17233C] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    Heat Vulnerability Score
                  </span>
                  <span className="text-xs font-black text-rose-600">{activeWardProfile.vulnerability.score}/100</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Elderly Concentration:</span>
                    <strong className="text-rose-600">+{activeWardProfile.vulnerability.elderlyContribution} pts</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Outdoor Labor Ratio:</span>
                    <strong className="text-rose-600">+{activeWardProfile.vulnerability.outdoorWorkerContribution} pts</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Informal Tin-Roof Housing:</span>
                    <strong className="text-rose-600">+{activeWardProfile.vulnerability.slumHousingContribution} pts</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Lack of Trees (Low NDVI):</span>
                    <strong className="text-rose-600">+{activeWardProfile.vulnerability.greeneryDeficitContribution} pts</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Cumulative Burden & Nighttime Recovery Alert */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 space-y-2 text-xs">
                <span className="font-extrabold text-amber-900 uppercase block text-[11px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  Cumulative Heat Burden (Degree-Hours)
                </span>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="bg-white/80 rounded-xl p-2 border border-amber-200">
                    <div className="text-[10px] text-amber-700 font-bold">24 Hours</div>
                    <div className="text-sm font-black text-[#17233C]">{activeWardProfile.cumulativeBurden.burden24h}°C·h</div>
                  </div>
                  <div className="bg-white/80 rounded-xl p-2 border border-amber-200">
                    <div className="text-[10px] text-amber-700 font-bold">72 Hours</div>
                    <div className="text-sm font-black text-[#17233C]">{activeWardProfile.cumulativeBurden.burden72h}°C·h</div>
                  </div>
                  <div className="bg-white/80 rounded-xl p-2 border border-amber-200">
                    <div className="text-[10px] text-amber-700 font-bold">5 Days</div>
                    <div className="text-sm font-black text-[#17233C]">{activeWardProfile.cumulativeBurden.burden120h}°C·h</div>
                  </div>
                </div>
                <p className="text-[10px] text-amber-800 pt-1 leading-relaxed">
                  {activeWardProfile.cumulativeBurden.explanation}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                <span className="font-extrabold text-[#17233C] uppercase block text-[11px] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  Nighttime Thermal Recovery
                </span>
                <div className="flex items-center justify-between pt-1">
                  <span>Night Min Temperature:</span>
                  <strong className="text-[#17233C]">{activeWardProfile.nighttimeRecovery.nightMinTemp}°C</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Physiological Status:</span>
                  <span className="font-extrabold text-rose-600">{activeWardProfile.nighttimeRecovery.status}</span>
                </div>
                <p className="text-[10px] text-slate-600 pt-1 leading-relaxed border-t border-slate-200">
                  {activeWardProfile.nighttimeRecovery.warningMessage}
                </p>
              </div>
            </div>

            {/* SHAP-inspired ML Risk Contributors */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3">
              <span className="text-xs font-extrabold uppercase text-[#17233C] block">
                Model Explainability: Key Risk Contributors
              </span>
              <div className="space-y-2">
                {activeWardProfile.riskContributors.map((c, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs gap-3">
                    <div className="space-y-0.5 flex-1">
                      <div className="font-bold text-[#17233C] flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${c.direction === 'increasing' ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                        {c.name}
                      </div>
                      <div className="text-[11px] text-slate-500">{c.reason}</div>
                    </div>
                    <span className={`font-black text-xs shrink-0 ${c.direction === 'increasing' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {c.direction === 'increasing' ? `+${c.impactPercent}%` : `-${c.impactPercent}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Health Advisories Tab System */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-[#17233C]">
                  Actionable Ward Health Advisories
                </span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                  <button
                    onClick={() => setActiveAdvisoryTab('public')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeAdvisoryTab === 'public' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Public
                  </button>
                  <button
                    onClick={() => setActiveAdvisoryTab('workers')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeAdvisoryTab === 'workers' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Workers
                  </button>
                  <button
                    onClick={() => setActiveAdvisoryTab('elderly')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeAdvisoryTab === 'elderly' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Elderly
                  </button>
                  <button
                    onClick={() => setActiveAdvisoryTab('muni')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeAdvisoryTab === 'muni' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Municipal HAP
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs text-[#17233C]">
                {activeAdvisoryTab === 'public' && (
                  <ul className="space-y-1.5 list-disc list-inside">
                    {activeWardProfile.actionableAdvisories.generalPublic.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {activeAdvisoryTab === 'workers' && (
                  <ul className="space-y-1.5 list-disc list-inside">
                    {activeWardProfile.actionableAdvisories.outdoorWorkers.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {activeAdvisoryTab === 'elderly' && (
                  <ul className="space-y-1.5 list-disc list-inside">
                    {activeWardProfile.actionableAdvisories.elderlyAndVulnerable.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {activeAdvisoryTab === 'muni' && (
                  <ul className="space-y-1.5 list-disc list-inside font-semibold text-rose-900">
                    {activeWardProfile.actionableAdvisories.municipalActions.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-400">
                Modeled Heat-Health Risk • Continuous Biophysical Calculation
              </span>

              <div className="flex items-center gap-2">
                {onNavigateToAlerts && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      onNavigateToAlerts();
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Ward Alert</span>
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
