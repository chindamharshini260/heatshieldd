/**
 * HeatShield AI - Page 1: Home (Command Center)
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. Header: "Your heat situation right now" with live atmospheric stream
 * 2. Executive SIH 6-Question Impact Summary (Where, What Risk, Why, When, Who, What To Do)
 * 3. Two-Column Hero:
 *    - Left: Large HEAT RISK card with SVG Donut Gauge (0-100 scale), big score, category badge
 *    - Right: "WHY THIS SCORE?" 7 Factor rows (Temp, Feels Like, Humidity, Wind, Solar, Persistence, Night Recovery)
 * 4. Ward-Level Vulnerability & Hotspots Summary for Active City
 * 5. "WHAT SHOULD YOU DO NOW?" 4 Action cards (Hydrate, Seek Shade, Shift Tasks, Light Clothing)
 * 6. TODAY'S SAFEST WINDOW & PEAK HEAT WINDOW
 * 7. HOURLY HEAT TIMELINE: Horizontal chart with NOW, BEST WINDOW, PEAK WINDOW badges
 * 8. HEATSHIELD AI: Transparent reasoning and predictive outlook
 */

import React, { useState, useMemo } from 'react';
import {
  Flame,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Moon,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  Shirt,
  Umbrella,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
  RefreshCw,
  MapPin,
  Layers,
  Users,
  Activity,
  Zap,
} from 'lucide-react';
import { CompleteWeatherData, UserLocation } from '../../types/weather';
import { getRiskLevelInfo } from '../../utils/heatRiskSystem';
import { INDIAN_CITIES, findMatchingOrNearestCity, findNearestWardForCoordinates } from '../../data/cityData';
import {
  calculateAllCityWardProfiles,
  DetailedWardRiskProfile,
  buildRawWeatherFromWeatherData,
  getHighestRiskWard,
} from '../../utils/wardRiskEngine';
import { RawOpenMeteoResponse } from '../../services/weatherApi';
import { HealthImpactMortalitySection } from './HealthImpactMortalitySection';
import { calculate5DayHealthImpactForecast } from '../../utils/mortalityRiskEngine';

interface HumanHeatHomeViewProps {
  weatherData: CompleteWeatherData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onRequestGps?: () => void;
  isLocatingGPS?: boolean;
  gpsStatusMessage?: string | null;
  onChangeLocation: () => void;
  onNavigateToForecast: () => void;
  onNavigateToMap: () => void;
  onNavigateToPlan?: () => void;
  onSaveLocationBookmark?: (location: UserLocation) => void;
  isBookmarked?: boolean;
  onOpenDataScience?: () => void;
}

export const HumanHeatHomeView: React.FC<HumanHeatHomeViewProps> = ({
  weatherData,
  isLoading,
  isRefreshing,
  error,
  onRefresh,
  onRequestGps,
  isLocatingGPS = false,
  gpsStatusMessage,
  onChangeLocation,
  onNavigateToForecast,
  onNavigateToMap,
  onNavigateToPlan,
}) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  // Match active city based on current location GPS or selection
  const activeCity = useMemo(() => {
    return findMatchingOrNearestCity(weatherData?.location);
  }, [weatherData?.location]);

  // Construct raw weather response using live Open-Meteo data
  const rawWeather = useMemo<RawOpenMeteoResponse>(() => {
    return buildRawWeatherFromWeatherData(weatherData, activeCity);
  }, [weatherData, activeCity]);

  // Current hour of the day for biometeorological evaluation
  const currentHourIndex = useMemo(() => new Date().getHours(), []);

  // Compute ward risk profiles dynamically for ALL wards in the city
  const wardProfiles = useMemo<DetailedWardRiskProfile[]>(() => {
    return calculateAllCityWardProfiles(activeCity, rawWeather, currentHourIndex);
  }, [activeCity, rawWeather, currentHourIndex]);

  // Dynamically extract the ward with the absolute highest risk score
  const topRiskWard = useMemo<DetailedWardRiskProfile | null>(() => {
    return getHighestRiskWard(wardProfiles) || (wardProfiles.length > 0 ? wardProfiles[0] : null);
  }, [wardProfiles]);

  // Identify user's containing or nearest ward based on user's exact GPS coordinates
  const detectedUserWard = useMemo(() => {
    if (!weatherData?.location) return null;
    return findNearestWardForCoordinates(
      activeCity,
      weatherData.location.latitude,
      weatherData.location.longitude,
      weatherData.location.locationName
    );
  }, [activeCity, weatherData?.location]);

  // Compute 5-day health & mortality risk forecast
  const mortalityForecast = useMemo(() => {
    return calculate5DayHealthImpactForecast(weatherData, activeCity, topRiskWard);
  }, [weatherData, activeCity, topRiskWard]);

  if (isLoading && !weatherData) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          <Flame className="w-7 h-7 text-blue-600 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-[#17233C] text-lg">Calculating Real Human Heat Stress...</h3>
          <p className="text-xs text-[#64748B] max-w-sm">
            Fetching Open-Meteo atmospheric streams and computing physiological thermal strain.
          </p>
        </div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-[#E2E8F0] text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-[#17233C] text-base">Weather Stream Unavailable</h3>
          <p className="text-xs text-[#64748B] mt-1">Please check your internet connection or choose another location.</p>
        </div>
        <div className="pt-2 flex gap-3 justify-center">
          <button
            onClick={onRefresh}
            className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <button
            onClick={onChangeLocation}
            className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#17233C] text-xs font-semibold cursor-pointer"
          >
            Change Location
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const { current, location, analysis, hourly, daily } = weatherData;
  const riskScore = analysis?.riskScore ?? 45;
  const riskInfo = getRiskLevelInfo(riskScore);

  // Key factors
  const tempC = Math.round(current.temperature);
  const feelsLikeC = Math.round(current.apparentTemperature);
  const humidity = Math.round(current.relativeHumidity);
  const windKmh = Math.round(current.windSpeed);

  // Safe solar exposure calculation: never NaN or undefined
  const rawSolar = current.solarRadiation ?? analysis?.scientificDetails?.solarRadiationWm2;
  const hasValidSolar = typeof rawSolar === 'number' && !isNaN(rawSolar) && isFinite(rawSolar) && rawSolar >= 0;
  const solarRadiation = hasValidSolar ? Math.round(rawSolar) : null;

  const nightMinTemp = daily[0]?.temperatureMin !== undefined ? Math.round(daily[0].temperatureMin) : 22;
  const persistenceDays = analysis?.consecutiveHighHeatDays || 2;

  // Donut Gauge calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  // Determine Safe & Peak Windows
  const morningSafe = '6:00 AM – 9:30 AM';
  const eveningSafe = '6:00 PM – 8:30 PM';
  const peakWindow = analysis?.worstPeriod || '12:00 PM – 4:00 PM';

  // Hourly timeline slices
  const timelineHours = hourly.slice(0, 16);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            <Activity className="w-3.5 h-3.5" />
            Localized Impact-Based Heat Early Warning
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight mt-1.5">
            Your Heat Situation Right Now
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Real-time human thermal stress assessment for{' '}
            <span className="font-semibold text-[#17233C]">{location.locationName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onNavigateToMap}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#17233C] flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Ward Risk Map</span>
          </button>
        </div>
      </div>

      {/* GPS Status Message if present */}
      {gpsStatusMessage && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{gpsStatusMessage}</span>
          </div>
        </div>
      )}

      {/* 1.1 LOCATION & RISK HIERARCHY RIBBON */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#475569]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 font-medium text-[#17233C]">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{location.source === 'gps' ? 'Live GPS Location' : 'Using selected fallback location'}:</span>
            <span className="font-bold text-blue-700">{location.locationName.split(',')[0]}</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">City / Region:</span>
            <span className="font-semibold text-[#17233C]">{activeCity.name}</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Weather:</span>
            <span className="font-semibold text-[#17233C]">{tempC}°C ({current.weatherDescription})</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Thermal Stress:</span>
            <span className="font-semibold text-[#17233C]">
              {analysis?.scientificDetails?.utciStressCategory || 'Strong'} (UTCI {Math.round(analysis?.scientificDetails?.utciC || tempC)}°C)
            </span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Personal Risk:</span>
            <span
              className="font-bold px-1.5 py-0.5 rounded text-[11px]"
              style={{ color: riskInfo.color, backgroundColor: riskInfo.bgColor }}
            >
              {riskScore}/100 {riskInfo.label}
            </span>
          </div>
        </div>

        {onRequestGps && location.source !== 'gps' && (
          <button
            onClick={onRequestGps}
            disabled={isLocatingGPS}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <MapPin className="w-3 h-3 text-emerald-600" />
            <span>{isLocatingGPS ? 'Acquiring GPS...' : 'Switch to Live GPS'}</span>
          </button>
        )}
      </div>

      {/* 3. 2-COLUMN HERO: LEFT (YOUR CURRENT RISK) + RIGHT (WHY THIS SCORE?) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Large YOUR CURRENT RISK CARD */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block truncate">
                {location.source === 'gps' ? 'PERSONAL RISK — YOUR LIVE GPS LOCATION' : 'PERSONAL RISK — SELECTED FALLBACK LOCATION'}
              </span>
              <div className="text-[11px] text-[#64748B] font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="truncate">
                  Detected Ward:{' '}
                  <strong className="text-[#17233C] font-semibold">
                    {detectedUserWard ? detectedUserWard.wardName : 'Exact ward boundary data unavailable'}
                  </strong>
                </span>
              </div>
            </div>
            <span
              className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full border tracking-wide shrink-0"
              style={{
                backgroundColor: riskInfo.bgColor,
                color: riskInfo.color,
                borderColor: riskInfo.borderColor,
              }}
            >
              {riskInfo.label} RISK
            </span>
          </div>

          {/* SVG Donut Gauge with big score */}
          <div className="my-6 flex flex-col items-center justify-center relative">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth="14"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={riskInfo.color}
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">YOUR RISK</span>
                <span className="text-5xl font-black text-[#17233C] tracking-tight">
                  {riskScore}
                </span>
                <span className="text-xs font-bold text-[#64748B] mt-0.5">/ 100</span>
                <span
                  className="text-xs font-bold uppercase mt-1 px-2 py-0.5 rounded-md"
                  style={{ color: riskInfo.color, backgroundColor: riskInfo.bgColor }}
                >
                  {riskInfo.label}
                </span>
              </div>
            </div>

            {/* Risk Scale Legend Bars */}
            <div className="w-full max-w-xs mt-4 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] font-semibold text-[#64748B]">
              <span className="text-[#16A34A]">0-24 Low</span>
              <span className="text-[#F59E0B]">25-49 Mod</span>
              <span className="text-[#F97316]">50-69 High</span>
              <span className="text-[#EF4444]">70-84 V.High</span>
              <span className="text-[#B91C1C]">85-100 Ext</span>
            </div>
          </div>

          <div className="bg-[#F7F9FC] rounded-xl p-3 border border-[#E2E8F0] text-xs text-[#17233C] flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-normal">{riskInfo.shortAdvice}</p>
          </div>
        </div>

        {/* RIGHT COLUMN: WHY THIS SCORE? FACTOR BREAKDOWN */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#17233C] flex items-center gap-2">
                <span>Why this score?</span>
                <span className="text-xs font-normal text-[#64748B]">(Atmospheric & biophysical factors)</span>
              </h2>
              <button
                onClick={onNavigateToForecast}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>5-Day Outlook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 7 Factor Rows */}
            <div className="space-y-3">
              {/* 1. Temperature */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2.5 min-w-[130px]">
                  <Thermometer className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-xs font-medium text-[#17233C]">Air Temperature</span>
                </div>
                <div className="flex-1 mx-4 hidden sm:block">
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (tempC / 48) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-[#17233C] tabular-nums">{tempC}°C</span>
              </div>

              {/* 2. Feels Like (Apparent) */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2.5 min-w-[130px]">
                  <Flame className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="text-xs font-medium text-[#17233C]">Feels Like</span>
                </div>
                <div className="flex-1 mx-4 hidden sm:block">
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (feelsLikeC / 50) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-[#17233C] tabular-nums">{feelsLikeC}°C</span>
              </div>

              {/* 3. Humidity */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2.5 min-w-[130px]">
                  <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-xs font-medium text-[#17233C]">Humidity</span>
                </div>
                <div className="flex-1 mx-4 hidden sm:block">
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${humidity}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-[#17233C] tabular-nums">{humidity}%</span>
              </div>

              {/* 4. Wind Speed */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2.5 min-w-[130px]">
                  <Wind className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-xs font-medium text-[#17233C]">Wind Relief</span>
                </div>
                <div className="flex-1 mx-4 hidden sm:block">
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (windKmh / 35) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-[#17233C] tabular-nums">{windKmh} km/h</span>
              </div>

              {/* 5. Solar Exposure (Graceful handling of numeric or unavailable) */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2.5 min-w-[130px]">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-medium text-[#17233C]">Solar Exposure</span>
                </div>
                <div className="flex-1 mx-4 hidden sm:block">
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{
                        width: `${solarRadiation !== null ? Math.min(100, (solarRadiation / 900) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-[#17233C] tabular-nums">
                  {solarRadiation !== null ? `${solarRadiation} W/m²` : 'Data unavailable'}
                </span>
              </div>

              {/* 6. Heat Persistence */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2.5 min-w-[130px]">
                  <TrendingUp className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="text-xs font-medium text-[#17233C]">Heat Persistence</span>
                </div>
                <div className="flex-1 mx-4 hidden sm:block">
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (persistenceDays / 6) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-[#17233C]">Day {persistenceDays} of elevated heat</span>
              </div>

              {/* 7. Night Recovery */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2.5 min-w-[130px]">
                  <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-xs font-medium text-[#17233C]">Night Recovery</span>
                </div>
                <div className="flex-1 mx-4 hidden sm:block">
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, Math.max(10, ((30 - nightMinTemp) / 15) * 100))}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-[#17233C] tabular-nums">
                  Min {nightMinTemp}°C ({nightMinTemp <= 22 ? 'Good' : nightMinTemp <= 26 ? 'Moderate' : 'Poor'})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. WHAT SHOULD YOU DO NOW? 4 ACTION CARDS */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#17233C]">What should you do now?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-blue-300 transition-all space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#17233C]">HYDRATE REGULARLY</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Drink 250–500ml of water or buttermilk every hour. Do not wait until you feel thirsty.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-amber-300 transition-all space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Umbrella className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#17233C]">SEEK SHADE & COOLING</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Avoid direct sunlight during peak hours. Use umbrellas, wide-brim hats, or tree canopy.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-orange-300 transition-all space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#17233C]">SHIFT OUTDOOR TASKS</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Schedule strenuous workouts, shopping, and field tasks before 10 AM or after 6 PM.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-emerald-300 transition-all space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shirt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#17233C]">WEAR LIGHT FABRICS</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Choose loose-fitting, light-colored cotton or linen to allow rapid sweat evaporation.
            </p>
          </div>
        </div>
      </div>

      {/* 5. HIGHLIGHTED WINDOWS: SAFEST WINDOW vs PEAK HEAT WINDOW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] p-6 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#16A34A]">
              Recommended Safe Window
            </span>
            <h3 className="text-xl font-black text-[#14532D]">
              {morningSafe} & {eveningSafe}
            </h3>
            <p className="text-xs text-[#166534] leading-relaxed">
              Solar radiation is lower and atmospheric temperatures are optimal for exercise, errands, and outdoor labour.
            </p>
          </div>
        </div>

        <div className="bg-[#FFF7ED] rounded-2xl border border-[#FED7AA] p-6 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#EA580C]">
              Peak Heat Exposure Window
            </span>
            <h3 className="text-xl font-black text-[#9A3412]">
              {peakWindow}
            </h3>
            <p className="text-xs text-[#C2410C] leading-relaxed">
              Maximum combined thermal load and UV index. Stay in well-ventilated or air-conditioned indoor spaces.
            </p>
          </div>
        </div>
      </div>

      {/* 5.5 HEALTH IMPACT & MORTALITY RISK (5-DAY EPIDEMIOLOGICAL FORECAST) */}
      <HealthImpactMortalitySection
        forecastItems={mortalityForecast}
        locationName={location.locationName}
        cityName={activeCity.name}
      />

      {/* 6. HOURLY HEAT TIMELINE */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#17233C]">Today's Hourly Heat Trajectory</h2>
            <p className="text-xs text-[#64748B]">Real-time hourly heat stress and thermal comfort curve</p>
          </div>
          {onNavigateToPlan && (
            <button
              onClick={onNavigateToPlan}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Plan My Day</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="flex gap-3 min-w-[700px]">
            {timelineHours.map((item, idx) => {
              const hourNum = new Date(item.time).getHours();
              const isNow = idx === 0;
              const isPeak = hourNum >= 12 && hourNum <= 16;
              const isSafe = hourNum <= 9 || hourNum >= 18;
              const itemRisk = getRiskLevelInfo(
                item.apparentTemperature >= 38 ? 75 : item.apparentTemperature >= 32 ? 55 : 20
              );

              return (
                <div
                  key={item.time}
                  onClick={() => setSelectedHour(hourNum)}
                  className={`flex-1 min-w-[90px] p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedHour === hourNum
                      ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                      : 'border-[#E2E8F0] bg-[#F7F9FC] hover:border-blue-200'
                  }`}
                >
                  <div className="mb-2 h-5 flex items-center justify-center">
                    {isNow && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold">
                        NOW
                      </span>
                    )}
                    {!isNow && isPeak && (
                      <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 text-[9px] font-bold">
                        PEAK
                      </span>
                    )}
                    {!isNow && isSafe && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                        SAFE
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-[#64748B] block">
                    {item.displayTime}
                  </span>

                  <span className="text-base font-bold text-[#17233C] block my-1">
                    {Math.round(item.temperature)}°C
                  </span>

                  <span className="text-[10px] text-[#64748B] block">
                    Feels {Math.round(item.apparentTemperature)}°C
                  </span>

                  <div className="mt-2.5">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: itemRisk.color }}
                      title={`Risk: ${itemRisk.label}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7. HEATSHIELD AI REASONING CARD */}
      <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/60 rounded-2xl border border-blue-200 p-6 shadow-xs flex flex-col sm:flex-row items-start gap-5">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#17233C]">HeatShield AI Assessment</h3>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              Personalized Insights
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#17233C] leading-relaxed">
            {analysis?.shortSummary ||
              `With ambient temperatures reaching ${tempC}°C and humidity at ${humidity}%, your body's evaporative sweating mechanism is operating at ${feelsLikeC >= 38 ? 'strained capacity' : 'moderate load'}. Sustained multi-day heat without nocturnal cooling below 22°C compounds fatigue. Prioritize morning hydration and protect vulnerable family members.`}
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={onNavigateToForecast}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>View Full 5-Day Trend</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onNavigateToMap}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-blue-200 text-blue-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Open Ward Heat Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
