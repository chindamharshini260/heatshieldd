import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  Calendar,
  Moon,
  Sun,
  Flame,
  AlertTriangle,
  Clock,
  TrendingUp,
  Info
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../types';

interface ForecastTimelineProps {
  city: CityData;
  wardProfile?: WardImpactProfile;
  rawAtmospheric?: any;
}

export const ForecastTimeline: React.FC<ForecastTimelineProps> = ({
  city,
  wardProfile,
  rawAtmospheric
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'thermal' | 'cumulative'>('thermal');

  // Build hourly chart points for next 72-120 hours
  const hourlyData = React.useMemo(() => {
    const times = rawAtmospheric?.hourlyTimes || rawAtmospheric?.time;
    if (!times || !Array.isArray(times) || times.length === 0) {
      // Fallback synthetic curve
      return Array.from({ length: 72 }).map((_, i) => {
        const hour = i % 24;
        const day = Math.floor(i / 24) + 1;
        const temp = 30 + Math.sin(((hour - 6) / 24) * 2 * Math.PI) * 12 + day * 0.8;
        const utci = temp + (hour >= 11 && hour <= 16 ? 4.5 : 1.2);
        const wbgt = temp - 6 + (hour >= 11 && hour <= 16 ? 3.0 : 0.5);
        const hi = temp + (hour >= 12 && hour <= 17 ? 3.8 : 0.8);
        return {
          time: `D${day} ${hour.toString().padStart(2, '0')}:00`,
          rawHour: hour,
          day,
          Temperature: Math.round(temp * 10) / 10,
          UTCI: Math.round(utci * 10) / 10,
          WBGT: Math.round(wbgt * 10) / 10,
          HeatIndex: Math.round(hi * 10) / 10,
          CumulativeBurden: Math.round(Math.max(0, utci - 32) * (i * 0.4) * 10) / 10
        };
      });
    }

    const temps = rawAtmospheric?.hourlyTemps || rawAtmospheric?.temperature_2m || [];
    const rhs = rawAtmospheric?.hourlyRh || rawAtmospheric?.relative_humidity_2m || [];
    const winds = rawAtmospheric?.hourlyWind || rawAtmospheric?.wind_speed_10m || [];
    const solars = rawAtmospheric?.hourlySolar || rawAtmospheric?.direct_normal_irradiance || rawAtmospheric?.surface_solar_radiation || [];

    let runningBurden = 0;
    return times.slice(0, 72).map((isoTime: string, i: number) => {
      const d = new Date(isoTime);
      const hour = isNaN(d.getHours()) ? (i % 24) : d.getHours();
      const dayNum = Math.floor(i / 24) + 1;
      const t = typeof temps[i] === 'number' ? temps[i] : 38;
      const rh = typeof rhs[i] === 'number' ? rhs[i] : 45;
      const w = typeof winds[i] === 'number' ? winds[i] : 8;
      const s = typeof solars[i] === 'number' ? solars[i] : 0;

      // Approximate UTCI / WBGT / HI
      const utci = Math.round((t + (s > 300 ? 4.2 : 1.0) + (rh > 50 ? 2.5 : 0)) * 10) / 10;
      const wbgt = Math.round((t - 6.5 + (rh / 100) * 5 + (s > 400 ? 2.8 : 0.5)) * 10) / 10;
      const hi = Math.round((t + (rh > 40 ? 3.2 : 0.8)) * 10) / 10;

      if (utci > 32) {
        runningBurden += utci > 38 ? (utci - 32) * 1.5 : utci - 32;
      }

      return {
        time: `D${dayNum} ${hour.toString().padStart(2, '0')}:00`,
        rawHour: hour,
        day: dayNum,
        Temperature: t,
        UTCI: utci,
        WBGT: wbgt,
        HeatIndex: hi,
        CumulativeBurden: Math.round(runningBurden * 10) / 10
      };
    });
  }, [rawAtmospheric]);

  const thermal = wardProfile?.currentThermal || {
    utci: 43.5,
    wbgt: 33.2,
    heatIndex: 44.8,
    htss: 78,
    stressCategory: 'Very Strong Heat Stress',
    nightHeatRecoveryFailure: true,
    cumulativeHeatBurden24h: 84.5,
    cumulativeHeatBurden72h: 242.0,
    cumulativeHeatBurden120h: 388.0
  };

  return (
    <div id="forecast-timeline-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-mono font-semibold uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5" />
            72–120 Hour Atmospheric Evolution
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            HEAT CRISIS TIMELINE & NOCTURNAL RECOVERY AUDIT
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hourly diurnal progression, cumulative degree-hours burden, and nighttime heat stress tracking for {city.name}.
          </p>
        </div>

        {/* Night Recovery Indicator Badge */}
        <div className={`px-3.5 py-2 rounded-xl border flex items-center gap-2.5 ${
          thermal.nightHeatRecoveryFailure
            ? 'bg-rose-950/40 border-rose-600/50 text-rose-300'
            : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300'
        }`}>
          <Moon className="w-5 h-5" />
          <div>
            <div className="text-[10px] uppercase font-mono font-bold">
              {thermal.nightHeatRecoveryFailure ? 'HEAT RECOVERY FAILURE' : 'NORMAL NIGHT COOLING'}
            </div>
            <div className="text-xs font-semibold">
              {thermal.nightHeatRecoveryFailure
                ? 'Night Min Temp >= 27.5°C (Physiological Stress Persists)'
                : 'Night temperatures allow physiological core cooling'}
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Risk Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {wardProfile.forecastThermalDaily.map((dayItem, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border relative flex flex-col justify-between ${
              dayItem.category === 'Extreme Heat Stress'
                ? 'bg-rose-950/30 border-rose-700/60 shadow-lg shadow-rose-950/20'
                : dayItem.category === 'Very Strong Heat Stress'
                ? 'bg-orange-950/30 border-orange-700/60'
                : 'bg-amber-950/30 border-amber-700/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-slate-200">
                  DAY {idx + 1} ({dayItem.day})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{dayItem.date.slice(5)}</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-100 font-mono">
                {dayItem.maxTemp}°C
              </div>
              <div className="text-xs text-slate-300 mt-1 flex items-center justify-between">
                <span>Min: {dayItem.minTemp}°C</span>
                <span className="text-orange-400 font-mono font-semibold">UTCI {dayItem.maxUtci}°C</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1 text-[10px] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Stress:</span>
                <span className="text-rose-400 font-semibold">{dayItem.category.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Night Min:</span>
                <span className={dayItem.nightRecoveryFailure ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {dayItem.nightRecoveryFailure ? 'Fail (>27.5°)' : 'Safe (<26°)'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hourly Charts Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              72-HOUR DIURNAL METEOROLOGICAL EVOLUTION
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison of Air Temperature, Universal Thermal Climate Index (UTCI), Wet Bulb Globe Temperature (WBGT), and Heat Index.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveChartTab('thermal')}
              className={`px-3 py-1 rounded font-medium transition-all ${
                activeChartTab === 'thermal'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Thermal Indices (°C)
            </button>
            <button
              onClick={() => setActiveChartTab('cumulative')}
              className={`px-3 py-1 rounded font-medium transition-all ${
                activeChartTab === 'cumulative'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cumulative Heat Burden
            </button>
          </div>
        </div>

        {/* Recharts Chart Area */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === 'thermal' ? (
              <LineChart data={hourlyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} interval={5} />
                <YAxis stroke="#64748b" domain={[22, 50]} tick={{ fontSize: 10 }} unit="°C" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="UTCI" stroke="#f43f5e" strokeWidth={2.5} dot={false} name="UTCI Thermal Stress (°C)" />
                <Line type="monotone" dataKey="Temperature" stroke="#f59e0b" strokeWidth={1.8} dot={false} name="Air Temperature (°C)" />
                <Line type="monotone" dataKey="HeatIndex" stroke="#ea580c" strokeWidth={1.8} dot={false} name="Heat Index (°C)" />
                <Line type="monotone" dataKey="WBGT" stroke="#38bdf8" strokeWidth={1.8} dot={false} name="WBGT (°C)" />
              </LineChart>
            ) : (
              <AreaChart data={hourlyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="burdenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} interval={5} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit=" °C·h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="CumulativeBurden"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#burdenGradient)"
                  name="Cumulative Degree-Hours above 32°C"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Scientific Explanation of Diurnal Failure */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-rose-400" />
            Biological Mechanism of Nighttime Heat Recovery Failure:
          </div>
          <p className="leading-relaxed">
            When nighttime ambient temperatures fail to drop below 27.5°C, the human autonomic nervous system remains under constant cardiovascular strain to pump blood to the skin for evaporative cooling. This cumulative load over 3+ consecutive days leads to severe physiological fatigue, electrolyte exhaustion, and sudden cardiovascular events among vulnerable populations.
          </p>
        </div>
      </div>
    </div>
  );
};
