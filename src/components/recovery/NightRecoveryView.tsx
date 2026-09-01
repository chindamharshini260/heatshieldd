/**
 * Night Recovery View
 * Analyzes nocturnal temperatures and humidity to determine if the body
 * will achieve cardiovascular decompression and restful sleep.
 * 
 * 100% Real Meteorological Nocturnal Calculations.
 */

import React from 'react';
import { CompleteWeatherData } from '../../types/weather';
import {
  Moon,
  Heart,
  Thermometer,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface NightRecoveryViewProps {
  weatherData: CompleteWeatherData | null;
}

export function NightRecoveryView({ weatherData }: NightRecoveryViewProps) {
  if (!weatherData || !weatherData.analysis) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 font-normal">
        Loading night recovery analysis...
      </div>
    );
  }

  const { nightRecovery } = weatherData.analysis;
  const location = weatherData.location;

  const isGood = nightRecovery.status === 'Good';
  const isLimited = nightRecovery.status === 'Limited';
  const isPoor = nightRecovery.status === 'Poor';

  const badgeBg = isGood
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
    : isLimited
    ? 'bg-amber-50 text-amber-800 border-amber-200'
    : 'bg-rose-50 text-rose-800 border-rose-200';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-2 border border-blue-100">
          <Moon className="w-3.5 h-3.5" />
          <span>Sleep & Cardiovascular Reset</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          Night Recovery
        </h1>
        <p className="text-sm sm:text-base font-normal text-slate-500 mt-1">
          Will your body get a thermal break tonight in {location.locationName}?
        </p>
      </div>

      {/* Main Night Status Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${badgeBg}`}>
                {nightRecovery.status} Recovery
              </span>
              <h2 className="text-xl font-semibold text-slate-900 mt-1">
                {nightRecovery.headline}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 font-normal">Expected Night Low</div>
            <div className="text-2xl font-semibold text-slate-900">
              {nightRecovery.nightMinTemp}°C
            </div>
          </div>
        </div>

        <p className="text-sm font-normal text-slate-600 leading-relaxed">
          {nightRecovery.explanation}
        </p>
      </div>

      {/* Why Night Temp Matters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-900 font-semibold text-sm">
            <Heart className="w-4 h-4 text-indigo-600" />
            <span>Cardiovascular Decompression</span>
          </div>
          <p className="text-xs font-normal text-slate-600 leading-relaxed">
            During deep sleep, the heart rate drops and skin blood vessels constrict as core temperature cools. When ambient night temperatures exceed 25°C, the heart must continue pumping hard to shed heat, leading to morning fatigue.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
            <Wind className="w-4 h-4 text-blue-600" />
            <span>Optimal Sleep Tips Tonight</span>
          </div>
          <p className="text-xs font-normal text-slate-600 leading-relaxed">
            {isGood
              ? 'Open windows for refreshing cross-ventilation after 9 PM. Turn off heavy appliances.'
              : 'Keep fans circulating air across the bed. Place a damp cloth on pulse points before sleeping and drink a small glass of water.'}
          </p>
        </div>
      </div>
    </div>
  );
}
