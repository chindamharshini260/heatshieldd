import React, { useState } from 'react';
import {
  Clock,
  Sun,
  Moon,
  Droplets,
  AlertTriangle,
  CheckCircle,
  Info,
  Shield,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface PublicTodaysHeatProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const PublicTodaysHeat: React.FC<PublicTodaysHeatProps> = ({
  city,
  wardProfiles
}) => {
  const [selectedHour, setSelectedHour] = useState<number>(14); // 2 PM default
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const topWard = wardProfiles[0];
  const peakTemp = topWard?.currentThermal?.heatIndex || 41;

  // Simple day stages
  const dayStages = [
    {
      period: 'Morning',
      time: '6:00 AM – 11:00 AM',
      temp: '31°C – 36°C',
      status: 'Moderate Caution',
      statusColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      advice: 'Safest time for outdoor errands, market visits, and morning exercise. Drink 2 glasses of water before leaving home.'
    },
    {
      period: 'Afternoon Peak Danger',
      time: '11:30 AM – 4:30 PM',
      temp: '39°C – 43°C',
      status: 'Very High / Dangerous',
      statusColor: 'bg-red-100 text-red-800 border-red-300 font-bold',
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      advice: 'Highest risk of heat exhaustion and heat stroke. Stay indoors under shade or fans. Avoid heavy physical work. Drink water or ORS every 20 minutes.'
    },
    {
      period: 'Evening',
      time: '5:00 PM – 8:00 PM',
      temp: '35°C – 38°C',
      status: 'High Caution',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: <Sun className="w-5 h-5 text-amber-600" />,
      advice: 'Heat begins to slowly ease, but concrete buildings and asphalt roads continue radiating trapped heat. Wear light cotton clothes.'
    },
    {
      period: 'Nighttime',
      time: '8:00 PM – 6:00 AM',
      temp: '29°C – 32°C',
      status: 'Warm Night Alert',
      statusColor: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: <Moon className="w-5 h-5 text-indigo-600" />,
      advice: 'Night temperature stays unusually high (>28°C). The body struggles to recover while sleeping. Keep windows open for cross-ventilation.'
    }
  ];

  // Hourly simplified timeline (8 AM to 8 PM)
  const hourlyData = [
    { hour: 8, label: '8 AM', temp: 31, feel: 'Warm', risk: 'Caution', bg: 'bg-yellow-50 text-yellow-700' },
    { hour: 10, label: '10 AM', temp: 35, feel: 'Hot', risk: 'High', bg: 'bg-amber-50 text-amber-700' },
    { hour: 12, label: '12 PM', temp: 39, feel: 'Very Hot', risk: 'Very High', bg: 'bg-rose-50 text-rose-700' },
    { hour: 14, label: '2 PM', temp: 42, feel: 'Extremely Hot', risk: 'Peak Danger', bg: 'bg-red-100 text-red-800' },
    { hour: 16, label: '4 PM', temp: 41, feel: 'Very Hot', risk: 'Very High', bg: 'bg-rose-50 text-rose-700' },
    { hour: 18, label: '6 PM', temp: 37, feel: 'Hot', risk: 'High', bg: 'bg-amber-50 text-amber-700' },
    { hour: 20, label: '8 PM', temp: 33, feel: 'Warm', risk: 'Caution', bg: 'bg-yellow-50 text-yellow-700' },
  ];

  const currentSelectedData = hourlyData.find(h => h.hour === selectedHour) || hourlyData[3];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              Hourly Guide for Today
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">
              Today's Heat Schedule & Safety Window
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Plan your outdoor travel and work around the safest hours in <strong>{city.name}</strong>.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Peak Day Temperature</div>
            <div className="text-3xl font-extrabold text-rose-600">{peakTemp}°C</div>
            <div className="text-[11px] text-slate-500">Expected around 2:30 PM</div>
          </div>
        </div>
      </div>

      {/* 4 Day Stages Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dayStages.map((stage, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  {stage.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{stage.period}</h3>
                  <div className="text-xs text-slate-500">{stage.time}</div>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${stage.statusColor}`}>
                {stage.status}
              </span>
            </div>

            <div className="text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              Expected Temperature: <strong className="text-slate-800">{stage.temp}</strong>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {stage.advice}
            </p>
          </div>
        ))}
      </div>

      {/* Interactive Hourly Explorer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          Click an hour to see safety guidance
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {hourlyData.map((h) => (
            <button
              key={h.hour}
              onClick={() => setSelectedHour(h.hour)}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                selectedHour === h.hour
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="text-xs font-bold text-slate-700">{h.label}</div>
              <div className="text-lg font-extrabold text-slate-900 my-0.5">{h.temp}°C</div>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${h.bg}`}>
                {h.risk}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Hour Details */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Guidance for {currentSelectedData.label}
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {currentSelectedData.hour >= 12 && currentSelectedData.hour <= 16
                ? '🔴 High Risk Window: Stay indoors if possible. Carry water with you.'
                : '🟡 Moderate Conditions: Take regular shade breaks and stay hydrated.'}
            </div>
          </div>
          <div className="text-xs text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200 font-medium">
            Feels Like: <strong>{currentSelectedData.feel}</strong>
          </div>
        </div>
      </div>

      {/* Hydration & Practical Advice Box */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 space-y-2">
        <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-emerald-600" />
          Today's Recommended Hydration Schedule
        </h3>
        <p className="text-xs text-emerald-900 leading-relaxed">
          Adults should aim for at least <strong>3 to 4 liters of clean water</strong> today. If you are sweating heavily outdoors, drink oral rehydration solution (ORS), lemonade with salt, or coconut water to replenish essential minerals.
        </p>
      </div>
    </div>
  );
};
