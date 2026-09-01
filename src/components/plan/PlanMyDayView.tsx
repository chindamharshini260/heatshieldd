/**
 * HeatShield AI - Page 4: Plan My Day
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. Title: "Plan My Day" / "Plan your activities around safer heat windows."
 * 2. 24-Hour Diurnal Heat Stress Curve with Risk Shading
 * 3. 5 Activity Cards: Walking, Workout, Shopping, Travel, Outdoor Work with BEST TIME & AVOID TIME
 * 4. YOUR AI DAILY PLAN: Structured Vertical Timeline (Morning, Afternoon, Evening, Night)
 */

import React from 'react';
import {
  Clock,
  Sun,
  Moon,
  Footprints,
  Dumbbell,
  ShoppingBag,
  Car,
  HardHat,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { CompleteWeatherData } from '../../types/weather';
import { getRiskLevelInfo } from '../../utils/heatRiskSystem';

interface PlanMyDayViewProps {
  weatherData: CompleteWeatherData | null;
  onNavigateToForecast?: () => void;
  onNavigateToSafety?: () => void;
}

export const PlanMyDayView: React.FC<PlanMyDayViewProps> = ({
  weatherData,
  onNavigateToForecast,
  onNavigateToSafety,
}) => {
  if (!weatherData) return null;

  const { hourly, location } = weatherData;

  // Process 24 hours of data
  const day24Hours = hourly.slice(0, 24).map((h) => {
    const hourNum = new Date(h.time).getHours();
    const temp = Math.round(h.temperature);
    const feels = Math.round(h.apparentTemperature);
    const riskScore = Math.min(99, Math.max(10, Math.round((feels - 20) * 3.5 + 15)));

    return {
      time: h.displayTime,
      hour: hourNum,
      Temp: temp,
      FeelsLike: feels,
      RiskScore: riskScore,
    };
  });

  const activityGuides = [
    {
      id: 'walking',
      title: 'WALKING & COMMUTE',
      icon: Footprints,
      bestTime: '6:00 AM – 8:30 AM & 6:30 PM – 9:00 PM',
      avoidTime: '11:30 AM – 4:30 PM',
      tip: 'Take shaded sidewalks, carry an umbrella for sun blocking, and hydrate prior to walking.',
    },
    {
      id: 'workout',
      title: 'OUTDOOR WORKOUT & RUNNING',
      icon: Dumbbell,
      bestTime: '5:30 AM – 7:30 AM',
      avoidTime: '10:00 AM – 6:00 PM',
      tip: 'High exertion elevates internal metabolic heat. Keep intense cardio to dawn or indoor gyms.',
    },
    {
      id: 'shopping',
      title: 'MARKET & SHOPPING',
      icon: ShoppingBag,
      bestTime: '8:00 AM – 10:00 AM & 6:00 PM – 8:30 PM',
      avoidTime: '12:00 PM – 4:00 PM',
      tip: 'Avoid crowded open-air bazaars at midday where ambient heat and asphalt radiation compound.',
    },
    {
      id: 'travel',
      title: 'TRANSIT & DRIVING',
      icon: Car,
      bestTime: 'Before 11:00 AM & After 5:30 PM',
      avoidTime: '1:00 PM – 4:00 PM',
      tip: 'Vehicles parked in sun reach 60°C within 15 mins. Ventilate AC before driving.',
    },
    {
      id: 'work',
      title: 'OUTDOOR LABOUR & CONSTRUCTION',
      icon: HardHat,
      bestTime: '6:00 AM – 10:30 AM',
      avoidTime: '11:30 AM – 4:00 PM (Mandatory Rest)',
      tip: 'Follow the 45-min work / 15-min shaded rest ratio when wet bulb temperature exceeds 28°C.',
    },
  ];

  const dailySchedule = [
    {
      phase: 'MORNING (6:00 AM – 11:00 AM)',
      status: 'Optimal Activity Window',
      statusColor: 'text-[#16A34A] bg-[#F0FDF4] border-[#BBF7D0]',
      icon: Sun,
      items: [
        'Complete morning jogs, physical exercise, and garden chores before 8:30 AM.',
        'Finish outdoor grocery visits and market supply runs.',
        'Pre-hydrate with 500ml of water and electrolyte fluid before daytime heat rises.',
      ],
    },
    {
      phase: 'AFTERNOON (12:00 PM – 4:30 PM)',
      status: 'Peak Thermal Danger',
      statusColor: 'text-[#EA580C] bg-[#FFF7ED] border-[#FED7AA]',
      icon: Flame,
      items: [
        'Stay indoors in cooled or well-ventilated spaces with blinds drawn.',
        'Avoid strenuous outdoor physical labor and direct midday solar radiation.',
        'Drink water or buttermilk (chaas) regularly even if not actively thirsty.',
      ],
    },
    {
      phase: 'EVENING (5:00 PM – 8:30 PM)',
      status: 'Secondary Safe Window',
      statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
      icon: Clock,
      items: [
        'Resume casual walking, social outings, and errands as solar radiation subsides.',
        'Open windows for cross-ventilation once outside air cools below indoor room temperature.',
        'Check on elderly family members or neighbors regarding their hydration and comfort.',
      ],
    },
    {
      phase: 'NIGHT (9:00 PM – Dawn)',
      status: 'Rest & Recovery Phase',
      statusColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      icon: Moon,
      items: [
        'Ensure bedroom has adequate air circulation (fans or cooling).',
        'Take a cool or lukewarm shower before sleep to lower core body temperature.',
        'Keep a water bottle on the nightstand for hydration if waking up during the night.',
      ],
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight">
            Plan My Day
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Schedule your daily lifestyle and work routines around safer heat windows in{' '}
            <span className="font-semibold text-[#17233C]">{location.locationName}</span>
          </p>
        </div>
      </div>

      {/* 24-HOUR DIURNAL HEAT CURVE */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#17233C]">24-Hour Diurnal Heat Stress Curve</h2>
            <p className="text-xs text-[#64748B]">Hourly thermal stress progression throughout the day</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-semibold text-rose-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Feels-Like (°C)
            </span>
            <span className="flex items-center gap-1 font-semibold text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Risk Index (0-100)
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={day24Hours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis domain={[15, 50]} tick={{ fill: '#64748B', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="FeelsLike"
                stroke="#EA580C"
                strokeWidth={3}
                fill="url(#curveGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BEST TIME FOR ACTIVITIES CARDS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#17233C]">Best Time For Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activityGuides.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-xs uppercase tracking-wide text-[#17233C]">{act.title}</h3>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed pt-1">{act.tip}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#E2E8F0]">
                  <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
                    <span className="text-[10px] font-extrabold uppercase text-[#16A34A] block">
                      Recommended Best Time
                    </span>
                    <span className="text-xs font-bold text-[#14532D] block mt-0.5">
                      {act.bestTime}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FFF7ED] border border-[#FED7AA]">
                    <span className="text-[10px] font-extrabold uppercase text-[#EA580C] block">
                      Hazardous Peak Avoid Time
                    </span>
                    <span className="text-xs font-bold text-[#9A3412] block mt-0.5">
                      {act.avoidTime}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* YOUR AI DAILY PLAN (VERTICAL TIMELINE) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-[#17233C]">Your AI Daily Schedule</h2>
        </div>

        <div className="space-y-6 relative before:absolute before:left-4 sm:before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
          {dailySchedule.map((phase) => {
            const Icon = phase.icon;
            return (
              <div key={phase.phase} className="relative flex items-start gap-4 sm:gap-6 pl-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 z-10 shadow-xs">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <div className="flex-1 bg-[#F7F9FC] rounded-2xl p-5 border border-[#E2E8F0] space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-bold text-sm text-[#17233C]">{phase.phase}</h3>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border self-start sm:self-auto ${phase.statusColor}`}>
                      {phase.status}
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-[#17233C]">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
