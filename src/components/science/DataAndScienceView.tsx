/**
 * Data & Science View
 * Technical & biometeorological transparency module detailing the
 * Open-Meteo meteorological stream, Rothfusz Heat Index, Liljegren WBGT (ISO 7243),
 * COST Action 730 UTCI, and physiological modeling assumptions.
 */

import React, { useMemo } from 'react';
import { CompleteWeatherData } from '../../types/weather';
import { findMatchingOrNearestCity, findNearestWardForCoordinates } from '../../data/cityData';
import {
  Cpu,
  Database,
  Layers,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface DataAndScienceViewProps {
  weatherData: CompleteWeatherData | null;
}

export function DataAndScienceView({ weatherData }: DataAndScienceViewProps) {
  const analysis = weatherData?.analysis;

  const activeCity = useMemo(() => {
    return findMatchingOrNearestCity(weatherData?.location);
  }, [weatherData?.location]);

  const detectedWard = useMemo(() => {
    if (!weatherData?.location) return null;
    return findNearestWardForCoordinates(
      activeCity,
      weatherData.location.latitude,
      weatherData.location.longitude,
      weatherData.location.locationName
    );
  }, [activeCity, weatherData?.location]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-2 border border-blue-100">
          <Cpu className="w-3.5 h-3.5" />
          <span>Biometeorological Methodology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          Data & Science Engine
        </h1>
        <p className="text-sm sm:text-base font-normal text-slate-500 mt-1">
          How HeatShield AI translates raw meteorological streams into accurate human physiological heat risk.
        </p>
      </div>

      {/* DEVELOPER / DEBUG VERIFICATION AREA */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-md space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-emerald-400 text-xs tracking-wider uppercase">
              Developer & GPS Verification Panel
            </span>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            Live Diagnostics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">GPS Latitude</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {weatherData?.location.latitude !== undefined ? `${weatherData.location.latitude.toFixed(6)}°` : 'N/A'}
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">GPS Longitude</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {weatherData?.location.longitude !== undefined ? `${weatherData.location.longitude.toFixed(6)}°` : 'N/A'}
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">Location Source</div>
            <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${weatherData?.location.source === 'gps' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span>{weatherData?.location.source === 'gps' ? 'Browser GPS' : weatherData?.location.source === 'fallback' ? 'Fallback' : 'Manual Search'}</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">Resolved Location</div>
            <div className="text-sm font-bold text-white mt-0.5 truncate">
              {weatherData?.location.locationName || 'Unresolved'}
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">Resolved City / Region</div>
            <div className="text-sm font-bold text-white mt-0.5 truncate">
              {activeCity?.name || 'Local Region'}
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">Detected Ward</div>
            <div className="text-sm font-bold text-white mt-0.5 truncate">
              {detectedWard ? detectedWard.wardName : 'Exact ward boundary data unavailable'}
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">Weather Coordinates</div>
            <div className="text-sm font-bold text-emerald-300 mt-0.5">
              {weatherData?.location.latitude !== undefined && weatherData?.location.longitude !== undefined
                ? `${weatherData.location.latitude.toFixed(4)}°N, ${weatherData.location.longitude.toFixed(4)}°E`
                : 'N/A'}
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 sm:col-span-2">
            <div className="text-slate-400 text-[11px]">Ward Data Source</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              {detectedWard
                ? `Municipal Spatial Boundary Grid & Microclimate Sensor Engine (${activeCity.name})`
                : 'Regional Meteorological Grid (Outside Municipal Detailed Ward Centroid)'}
            </div>
          </div>
        </div>
      </div>

      {/* Real Live Metrics Snapshot */}
      {analysis && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Live Stream Computations ({weatherData.location.locationName})
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 font-medium">Ambient Dry Bulb (T)</div>
              <div className="text-lg font-semibold text-slate-900 mt-0.5">
                {analysis.scientificDetails.ambientTempC}°C
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 font-medium">Relative Humidity (RH)</div>
              <div className="text-lg font-semibold text-slate-900 mt-0.5">
                {analysis.scientificDetails.relativeHumidity}%
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 font-medium">NOAA Heat Index (HI)</div>
              <div className="text-lg font-semibold text-slate-900 mt-0.5">
                {analysis.scientificDetails.heatIndexC}°C
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 font-medium">Liljegren WBGT (ISO)</div>
              <div className="text-lg font-semibold text-slate-900 mt-0.5">
                {analysis.scientificDetails.wbgtC}°C
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mathematical Indices Grid */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Primary Indices & Physiological Models
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <Thermometer className="w-4 h-4 text-blue-600" />
              <span>1. Steadman / Rothfusz Heat Index</span>
            </div>
            <p className="text-xs font-normal text-slate-600 leading-relaxed">
              Computes apparent temperature based on human skin surface vapor pressure and typical clothing thermal resistance. Validated for shading and calm wind conditions.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <Sun className="w-4 h-4 text-amber-600" />
              <span>2. Wet-Bulb Globe Temperature (WBGT)</span>
            </div>
            <p className="text-xs font-normal text-slate-600 leading-relaxed">
              International standard (ISO 7243) for occupational heat stress in direct sunlight. Integrates solar radiation, natural wet-bulb temperature, and dry-bulb ambient.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <Wind className="w-4 h-4 text-indigo-600" />
              <span>3. Universal Thermal Climate Index (UTCI)</span>
            </div>
            <p className="text-xs font-normal text-slate-600 leading-relaxed">
              State-of-the-art multi-node human thermoregulation model developed by COST Action 730, assessing whole-body energy balance and skin wetness.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>4. Open-Meteo High-Resolution Stream</span>
            </div>
            <p className="text-xs font-normal text-slate-600 leading-relaxed">
              Assimilation of ECMWF IFS, DWD ICON, and NOAA GFS numerical weather prediction models updated every 60 minutes with seamless worldwide coverage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
