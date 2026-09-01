import React, { useState } from 'react';
import {
  Calendar,
  Sun,
  Flame,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface AuthorityHeatForecastProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
  onNavigate?: (tab: string) => void;
}

export const AuthorityHeatForecast: React.FC<AuthorityHeatForecastProps> = ({
  city,
  wardProfiles,
  onNavigate
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const forecastDays = [
    {
      day: 'Day 1 (Today)',
      date: 'Wed, May 27',
      maxTemp: 41.5,
      minTemp: 29.2,
      peakWindow: '13:00 – 16:30',
      alertLevel: 'Orange Alert',
      alertColor: 'bg-amber-500 text-white',
      impactSummary: 'Rapid heat buildup across central and eastern industrial wards. High afternoon outdoor exposure.'
    },
    {
      day: 'Day 2 (Tomorrow)',
      date: 'Thu, May 28',
      maxTemp: 43.8,
      minTemp: 30.5,
      peakWindow: '11:30 – 17:00',
      alertLevel: 'Red Alert (Peak Surge)',
      alertColor: 'bg-red-600 text-white',
      impactSummary: 'Hottest day of the 5-day cycle. Universal severe heat stress. Night temperatures fail to drop below 30°C.'
    },
    {
      day: 'Day 3',
      date: 'Fri, May 29',
      maxTemp: 42.4,
      minTemp: 29.8,
      peakWindow: '12:30 – 16:30',
      alertLevel: 'Red Alert',
      alertColor: 'bg-red-600 text-white',
      impactSummary: 'Cumulative physiological stress index reaches weekly maximum. Elevated risk of hospitalizations.'
    },
    {
      day: 'Day 4',
      date: 'Sat, May 30',
      maxTemp: 39.6,
      minTemp: 27.5,
      peakWindow: '14:00 – 16:00',
      alertLevel: 'Orange Alert',
      alertColor: 'bg-amber-500 text-white',
      impactSummary: 'Slight moderating effect from western surface winds, but residual heat in informal settlements remains high.'
    },
    {
      day: 'Day 5',
      date: 'Sun, May 31',
      maxTemp: 38.2,
      minTemp: 26.4,
      peakWindow: '14:00 – 15:30',
      alertLevel: 'Yellow Watch',
      alertColor: 'bg-yellow-400 text-slate-900',
      impactSummary: 'Return towards seasonal baselines. Post-heat wave recovery and health monitoring phase.'
    }
  ];

  const active = forecastDays[selectedDay];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              5-Day Meteorological Projection
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Heat Forecast for {city.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Anticipate diurnal temperature curves, peak danger windows, and warm night recovery deficits.
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-right">
            <div className="text-xs font-bold text-rose-700">72-Hour Warning</div>
            <div className="text-xs text-rose-600">Peak expected Thursday (43.8°C)</div>
          </div>
        </div>
      </div>

      {/* 5-Day Card Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {forecastDays.map((f, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDay(idx)}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
              selectedDay === idx
                ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="text-xs font-bold text-slate-700">{f.day}</div>
            <div className="text-2xl font-black text-slate-900">{f.maxTemp}°C</div>
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${f.alertColor}`}>
              {f.alertLevel.split('(')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Detailed Selected Day Forecast */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Operational Outlook: {active.day} ({active.date})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Maximum Dry-Bulb: <strong>{active.maxTemp}°C</strong> | Night Minimum: <strong>{active.minTemp}°C</strong>
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${active.alertColor}`}>
            {active.alertLevel}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Meteorological Assessment
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {active.impactSummary}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              Peak Dangerous Exposure Window
            </div>
            <div className="text-xl font-extrabold text-rose-600">{active.peakWindow}</div>
            <p className="text-xs text-slate-500">
              Mandatory work stoppage and continuous public cooling recommended during this interval.
            </p>
          </div>
        </div>

        {/* Action button */}
        {onNavigate && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigate('plan')}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              <span>Simulate City Response for {active.day}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
