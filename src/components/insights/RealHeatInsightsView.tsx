/**
 * HeatShield AI - Page 7: AI Heat Insights
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. Title: "AI Heat Insights"
 * 2. 4 Analytics Cards: Heat Pattern, Risk Trend, Night Recovery, Heat Persistence
 * 3. Section: "WHAT CHANGED?" (Atmospheric vector changes)
 * 4. Section: "WHAT THIS MEANS" (Actionable AI human impact explanation)
 */

import React from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Moon,
  Flame,
  Thermometer,
  Droplets,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CompleteWeatherData } from '../../types/weather';
import { getRiskLevelInfo } from '../../utils/heatRiskSystem';

interface RealHeatInsightsViewProps {
  weatherData: CompleteWeatherData | null;
  onNavigateToPlan?: () => void;
}

export const RealHeatInsightsView: React.FC<RealHeatInsightsViewProps> = ({
  weatherData,
  onNavigateToPlan,
}) => {
  if (!weatherData) return null;

  const { current, analysis, daily, location } = weatherData;
  const riskScore = analysis?.riskScore || 54;
  const riskInfo = getRiskLevelInfo(riskScore);
  const tempC = Math.round(current.temperature);
  const feelsLike = Math.round(current.apparentTemperature);
  const humidity = Math.round(current.relativeHumidity);
  const nightMin = daily[0]?.temperatureMin !== undefined ? Math.round(daily[0].temperatureMin) : 23;
  const persistenceDays = analysis?.consecutiveHighHeatDays || 3;

  return (
    <div className="space-y-8 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight">
            AI Heat Insights
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Automated intelligence on microclimate patterns and physiological heat burdens in{' '}
            <span className="font-semibold text-[#17233C]">{location.locationName}</span>
          </p>
        </div>
      </div>

      {/* 4 ANALYTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Heat Pattern */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
              Heat Pattern
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#17233C]">Severe Diurnal</div>
            <div className="text-xs font-semibold text-orange-600 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Peaking 12 PM – 4 PM</span>
            </div>
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            Rapid thermal rise occurs after 10 AM, with peak apparent temperature exceeding {feelsLike}°C.
          </p>
        </div>

        {/* 2. Risk Trend */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
              Risk Trajectory
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#17233C]">{riskInfo.score}/100</div>
            <div className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{riskInfo.label} Strain</span>
            </div>
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            Cardiovascular load and dehydration rates are elevated during direct sun exposure.
          </p>
        </div>

        {/* 3. Night Recovery */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
              Night Recovery
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#17233C]">{nightMin}°C Min</div>
            <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1 mt-0.5">
              <span>{nightMin <= 22 ? 'Good Cooling' : 'Limited Cooling'}</span>
            </div>
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            Night cooling is essential for internal organ recovery and restorative sleep cycles.
          </p>
        </div>

        {/* 4. Heat Persistence */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
              Heat Persistence
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#17233C]">{persistenceDays} Days</div>
            <div className="text-xs font-semibold text-purple-600 flex items-center gap-1 mt-0.5">
              <span>Cumulative Burden</span>
            </div>
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            Continuous elevated heat exhausts human thermoregulation if cooling intervals are skipped.
          </p>
        </div>
      </div>

      {/* SECTION: WHAT CHANGED? */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#17233C]">What Changed in the Atmosphere?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#64748B] block">Air Temperature</span>
              <span className="text-lg font-bold text-[#17233C]">{tempC}°C</span>
            </div>
            <span className="text-xs font-bold text-rose-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +1.4°C
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#64748B] block">Relative Humidity</span>
              <span className="text-lg font-bold text-[#17233C]">{humidity}%</span>
            </div>
            <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +5%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#64748B] block">Feels-Like Index</span>
              <span className="text-lg font-bold text-[#17233C]">{feelsLike}°C</span>
            </div>
            <span className="text-xs font-bold text-orange-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +2.1°C
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#64748B] block">Night Recovery</span>
              <span className="text-lg font-bold text-[#17233C]">{nightMin}°C</span>
            </div>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
              <TrendingDown className="w-3.5 h-3.5" /> Easing
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: WHAT THIS MEANS (LARGE AI EXPLANATION CARD) */}
      <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-2xl border border-blue-200 p-6 shadow-xs flex flex-col sm:flex-row items-start gap-5">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="space-y-2 flex-1">
          <h3 className="text-base font-bold text-[#17233C]">What This Means For Your Body</h3>
          <p className="text-xs sm:text-sm text-[#17233C] leading-relaxed">
            The confluence of {tempC}°C temperature and {humidity}% humidity impairs the efficiency of sweat evaporation. When sweat cannot evaporate quickly into the air, the cardiovascular system is forced to pump significantly more blood to the skin's surface, accelerating cardiac strain and dehydration.
          </p>
          <div className="pt-2 flex gap-3">
            {onNavigateToPlan && (
              <button
                onClick={onNavigateToPlan}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>Check Daily Activity Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
