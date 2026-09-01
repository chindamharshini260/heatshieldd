import React, { useState } from 'react';
import {
  Calendar,
  Sun,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Shield,
  Info,
  Droplets
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface PublicNext5DaysProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const PublicNext5Days: React.FC<PublicNext5DaysProps> = ({
  city,
  wardProfiles
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

  // Default 5-day simulated forecast dates
  const forecastDays = [
    {
      day: 'Today',
      date: 'Wed, May 27',
      maxTemp: 41,
      minTemp: 29,
      feelsLike: 'Very Hot',
      risk: 'Very High',
      riskColor: 'bg-rose-500 text-white',
      peakHours: '1:30 PM – 4:30 PM',
      summary: 'Extreme peak heat during the afternoon. Avoid intense physical work outside.',
      tips: ['Drink 1 glass of water every hour', 'Wear loose, light-colored cotton clothing', 'Check on elderly neighbors']
    },
    {
      day: 'Tomorrow',
      date: 'Thu, May 28',
      maxTemp: 43,
      minTemp: 30,
      feelsLike: 'Extremely Hot',
      risk: 'Extreme Danger',
      riskColor: 'bg-red-600 text-white',
      peakHours: '12:00 PM – 5:00 PM',
      summary: 'Hottest day of the week. Temperatures expected to cross 43°C with strong direct sunlight.',
      tips: ['Keep children and pets indoors', 'Close curtains during daytime to keep rooms cool', 'Use damp cloths on forehead if feeling dizzy']
    },
    {
      day: 'Day 3',
      date: 'Fri, May 29',
      maxTemp: 42,
      minTemp: 29,
      feelsLike: 'Very Hot',
      risk: 'Very High',
      riskColor: 'bg-rose-500 text-white',
      peakHours: '1:00 PM – 4:30 PM',
      summary: 'High temperatures continue. Warm night conditions mean limited body recovery.',
      tips: ['Eat light, fresh meals with high water content (cucumber, watermelon)', 'Avoid sugary or caffeinated drinks', 'Keep spray water bottle handy']
    },
    {
      day: 'Day 4',
      date: 'Sat, May 30',
      maxTemp: 39,
      minTemp: 27,
      feelsLike: 'Hot',
      risk: 'High',
      riskColor: 'bg-amber-500 text-white',
      peakHours: '2:00 PM – 4:00 PM',
      summary: 'Slight easing of peak temperature due to afternoon breeze, but caution still required.',
      tips: ['Shade breaks required during outdoor work', 'Carry ORS packets when traveling']
    },
    {
      day: 'Day 5',
      date: 'Sun, May 31',
      maxTemp: 38,
      minTemp: 26,
      feelsLike: 'Warm / Hot',
      risk: 'Moderate Caution',
      riskColor: 'bg-yellow-400 text-slate-900',
      peakHours: '2:00 PM – 3:30 PM',
      summary: 'Gradual normalization. Outdoor movement safer during early morning and late evening.',
      tips: ['Continue steady hydration', 'Good window for outdoor activities before 10 AM']
    }
  ];

  const activeDay = forecastDays[selectedDayIdx];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              5-Day Outlook
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">
              What Happens Over the Next 5 Days?
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Anticipate heat waves and plan your week safely in <strong>{city.name}</strong>.
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-right">
            <div className="text-xs font-bold text-rose-700">Peak Heat Alert</div>
            <div className="text-xs text-rose-600 mt-0.5">
              Thursday expected to be hottest (43°C)
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {forecastDays.map((f, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDayIdx(idx)}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2.5 ${
              selectedDayIdx === idx
                ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{f.day}</span>
              <span className="text-[10px] text-slate-400">{f.date}</span>
            </div>

            <div>
              <div className="text-2xl font-black text-slate-900">
                {f.maxTemp}°<span className="text-sm font-normal text-slate-400">/{f.minTemp}°</span>
              </div>
              <div className="text-[11px] text-slate-500">Feels {f.feelsLike}</div>
            </div>

            <div className="pt-1">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${f.riskColor}`}>
                {f.risk}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Day In-Depth Guidance Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Detailed Guide for {activeDay.day} ({activeDay.date})
              </h2>
              <p className="text-xs text-slate-500">
                Maximum Temperature: <strong className="text-slate-800">{activeDay.maxTemp}°C</strong> | Night Minimum: <strong className="text-slate-800">{activeDay.minTemp}°C</strong>
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeDay.riskColor}`}>
            {activeDay.risk} Risk
          </span>
        </div>

        {/* Overview & Peak hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Daily Heat Summary
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeDay.summary}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              Hours to Avoid Direct Sun
            </div>
            <div className="text-base font-bold text-rose-600">
              {activeDay.peakHours}
            </div>
            <p className="text-[11px] text-slate-500">
              Avoid strenuous exertion or unprotected outdoor exposure during this time window.
            </p>
          </div>
        </div>

        {/* Recommended Actions for the Day */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recommended Precautions for {activeDay.day}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeDay.tips.map((tip, idx) => (
              <div
                key={idx}
                className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-xs text-blue-950 flex items-start gap-2"
              >
                <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
