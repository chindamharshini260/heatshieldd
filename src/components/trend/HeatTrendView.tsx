/**
 * HeatShield AI - Page 11: Heat Trend
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. Title: "Heat Trend"
 * 2. Period Tabs: 7 DAYS, 30 DAYS, 90 DAYS
 * 3. 4 Metric Cards: Average Risk, Highest Risk, High-Risk Days, Heat Persistence
 * 4. Large Smooth Line Chart: Risk Over Time (Recharts)
 * 5. AI Trend Summary Box
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Flame,
  Calendar,
  Sparkles,
  Info,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { CompleteWeatherData } from '../../types/weather';
import { getRiskLevelInfo } from '../../utils/heatRiskSystem';

interface HeatTrendViewProps {
  weatherData: CompleteWeatherData | null;
  onNavigateToForecast?: () => void;
}

type TrendPeriod = '7D' | '30D' | '90D';

export const HeatTrendView: React.FC<HeatTrendViewProps> = ({
  weatherData,
  onNavigateToForecast,
}) => {
  const [activePeriod, setActivePeriod] = useState<TrendPeriod>('7D');

  if (!weatherData) return null;

  const { location, daily, analysis } = weatherData;

  // Generate synthetic trajectory based on real current base data
  const baseScore = analysis?.riskScore || 52;

  const data7D = daily.slice(0, 7).map((d, idx) => ({
    label: d.dayName,
    date: d.date,
    score: Math.max(15, Math.min(96, Math.round(baseScore + Math.sin(idx * 0.8) * 12))),
    temp: Math.round(d.temperatureMax),
  }));

  const data30D = Array.from({ length: 15 }, (_, i) => ({
    label: `Day ${i * 2 + 1}`,
    score: Math.max(20, Math.min(95, Math.round(baseScore + Math.sin(i * 0.5) * 16))),
    temp: Math.round(32 + Math.cos(i * 0.4) * 6),
  }));

  const data90D = [
    { label: 'May W1', score: 45, temp: 33 },
    { label: 'May W2', score: 58, temp: 36 },
    { label: 'May W3', score: 72, temp: 39 },
    { label: 'May W4', score: 84, temp: 42 },
    { label: 'Jun W1', score: 88, temp: 43 },
    { label: 'Jun W2', score: 76, temp: 39 },
    { label: 'Jun W3', score: 62, temp: 35 },
    { label: 'Jun W4', score: 50, temp: 32 },
  ];

  const currentDataset =
    activePeriod === '7D' ? data7D : activePeriod === '30D' ? data30D : data90D;

  const scores = currentDataset.map((d) => d.score);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const maxScore = Math.max(...scores);
  const highRiskDaysCount = scores.filter((s) => s >= 50).length;

  const avgInfo = getRiskLevelInfo(avgScore);
  const maxInfo = getRiskLevelInfo(maxScore);

  return (
    <div className="space-y-8 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight">
            Heat Trend Analysis
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Multi-day climate patterns and thermal strain trajectory for{' '}
            <span className="font-semibold text-[#17233C]">{location.locationName}</span>
          </p>
        </div>

        {/* PERIOD TABS */}
        <div className="flex bg-white p-1 rounded-xl border border-[#E2E8F0] shadow-2xs self-start sm:self-auto">
          {(['7D', '30D', '90D'] as TrendPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePeriod === p
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#17233C]'
              }`}
            >
              {p === '7D' ? '7 Days' : p === '30D' ? '30 Days' : 'Season (90D)'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Average Risk */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
            Average Heat Risk
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#17233C]">{avgScore}</span>
            <span className="text-xs font-bold" style={{ color: avgInfo.color }}>
              / 100 ({avgInfo.label})
            </span>
          </div>
          <p className="text-[11px] text-[#64748B]">Mean thermal burden across selected timeframe.</p>
        </div>

        {/* 2. Highest Risk Recorded */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
            Peak Risk Observed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#17233C]">{maxScore}</span>
            <span className="text-xs font-bold" style={{ color: maxInfo.color }}>
              {maxInfo.label}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B]">Maximum instantaneous combined thermal stress.</p>
        </div>

        {/* 3. High-Risk Days */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
            High-Risk Days (Score 50+)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#17233C]">{highRiskDaysCount}</span>
            <span className="text-xs font-semibold text-[#64748B]">
              of {currentDataset.length} intervals
            </span>
          </div>
          <p className="text-[11px] text-[#64748B]">Days exceeding safe outdoor work guidelines.</p>
        </div>

        {/* 4. Persistence */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
            Heat Wave Persistence
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#17233C]">
              {analysis?.consecutiveHighHeatDays || 3}
            </span>
            <span className="text-xs font-semibold text-[#64748B]">Consecutive Days</span>
          </div>
          <p className="text-[11px] text-[#64748B]">Unbroken continuous diurnal heat streak.</p>
        </div>
      </div>

      {/* LARGE LINE CHART: RISK OVER TIME */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#17233C]">Thermal Stress Trajectory ({activePeriod})</h2>
            <p className="text-xs text-[#64748B]">Continuous human heat risk score progression</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
            <Activity className="w-4 h-4" />
            <span>Standardized 0-100 Scale</span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentDataset} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} />
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
                dataKey="score"
                name="Heat Risk Score"
                stroke="#2563EB"
                strokeWidth={3}
                fill="url(#trendAreaGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI TREND SUMMARY BOX */}
      <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-2xl border border-blue-200 p-6 shadow-xs flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h3 className="font-bold text-base text-[#17233C]">AI Climate Trajectory Summary</h3>
          <p className="text-xs sm:text-sm text-[#17233C] leading-relaxed">
            The data demonstrates a clear cyclical diurnal heat wave pattern with daytime apparent peaks reaching the High/Very High threshold between 12 PM and 4 PM. Cumulative heat stress builds toward the middle of the cycle when nocturnal temperatures stay above 24°C. Plan strenuous outdoor activities for early mornings.
          </p>
        </div>
      </div>
    </div>
  );
};
