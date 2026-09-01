/**
 * HeatShield AI - Page 2: 3–5 Day Ward & City Heat Forecast Engine
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. City & Ward Level Forecast Selector (72–120 Hour Granular Horizon)
 * 2. Peak-Risk Period Highlighting Banner (Time, UTCI, WBGT, Urgency)
 * 3. 5-Day Interactive Day Cards with Thermal Stress & Modeled Risk Scores
 * 4. Hourly 72-Hour Micro-Trajectory Chart (UTCI, Heat Index, WBGT, Temp)
 * 5. Cumulative Multi-Day Heat Burden Tracker (24h, 48h, 72h, 120h Degree-Hours)
 * 6. Nighttime Recovery & Failure Surveillance with Biological Explanations
 * 7. Ward-Specific Actionable Health Advisories & Mitigation SOPs
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Thermometer,
  Flame,
  Moon,
  TrendingUp,
  AlertTriangle,
  Info,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Clock,
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { CompleteWeatherData } from '../../types/weather';
import { INDIAN_CITIES, findMatchingOrNearestCity } from '../../data/cityData';
import {
  calculateAllCityWardProfiles,
  DetailedWardRiskProfile,
  buildRawWeatherFromWeatherData,
} from '../../utils/wardRiskEngine';
import { RawOpenMeteoResponse } from '../../services/weatherApi';

interface HeatForecastViewProps {
  weatherData: CompleteWeatherData | null;
  onChangeLocation: () => void;
}

export const HeatForecastView: React.FC<HeatForecastViewProps> = ({
  weatherData,
  onChangeLocation,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    return findMatchingOrNearestCity(weatherData?.location).id;
  });

  // Keep city in sync if user changes location in dashboard
  useEffect(() => {
    if (weatherData?.location) {
      const matched = findMatchingOrNearestCity(weatherData.location);
      setSelectedCityId(matched.id);
    }
  }, [weatherData?.location]);

  const [selectedWardId, setSelectedWardId] = useState<string>('all');
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [activeMetricTab, setActiveMetricTab] = useState<'utci' | 'wbgt' | 'hi' | 'risk'>('utci');

  const currentCity = useMemo(() => {
    return INDIAN_CITIES.find((c) => c.id === selectedCityId) || INDIAN_CITIES[0];
  }, [selectedCityId]);

  // Construct real RawOpenMeteoResponse from weatherData
  const rawWeather = useMemo<RawOpenMeteoResponse>(() => {
    return buildRawWeatherFromWeatherData(weatherData, currentCity);
  }, [weatherData, currentCity]);

  // Current hour of day
  const currentHourIndex = useMemo(() => new Date().getHours(), []);

  // Compute all ward profiles for this city
  const allWardProfiles = useMemo<DetailedWardRiskProfile[]>(() => {
    return calculateAllCityWardProfiles(currentCity, rawWeather, currentHourIndex);
  }, [currentCity, rawWeather, currentHourIndex]);

  // Active target profile (selected ward or aggregate city profile)
  const activeProfile = useMemo<DetailedWardRiskProfile>(() => {
    if (selectedWardId !== 'all') {
      const found = allWardProfiles.find((p) => p.ward.wardId === selectedWardId);
      if (found) return found;
    }
    return allWardProfiles[0];
  }, [selectedWardId, allWardProfiles]);

  const dailyPoints = activeProfile.forecast.daily5Days;
  const currentDay = dailyPoints[selectedDayIdx] || dailyPoints[0];

  // 72h Hourly chart data
  const hourlyChartData = useMemo(() => {
    return activeProfile.forecast.hourly72h.slice(0, 48).map((h, i) => ({
      name: i === 0 ? 'Now' : h.displayTime.replace('Today ', '').replace('Tomorrow ', 'Tmrw '),
      fullTime: h.displayTime,
      UTCI: h.utci,
      WBGT: h.wbgt,
      HeatIndex: h.heatIndex,
      AirTemp: h.effectiveTemp,
      RiskScore: h.riskScore,
    }));
  }, [activeProfile]);

  // 5-Day chart data
  const dailyChartData = useMemo(() => {
    return dailyPoints.map((d) => ({
      name: d.dayName,
      RiskScore: d.riskScore,
      MaxUTCI: d.maxUtci,
      MaxWBGT: d.maxWbgt,
      MaxHeatIndex: d.maxHeatIndex,
      EffectiveMaxTemp: d.effectiveMaxTemp,
      MinTemp: d.minTemp,
      Burden: d.cumulativeBurdenDegreeHours,
    }));
  }, [dailyPoints]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. PAGE HEADER & WARD SELECTOR BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5" />
            72–120 Hour Predictive Biometeorological Forecast
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight mt-1.5">
            Heatwave & Human Strain Outlook: {currentCity.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Continuous modeling of Universal Thermal Climate Index (UTCI), Wet Bulb Globe Temperature (WBGT), and nocturnal recovery.
          </p>
        </div>

        {/* Dropdowns for City and Ward Selection */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* City Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] rounded-xl px-3 py-1.5 shadow-2xs">
            <span className="text-xs font-bold text-[#64748B]">City:</span>
            <select
              value={selectedCityId}
              onChange={(e) => {
                setSelectedCityId(e.target.value);
                setSelectedWardId('all');
              }}
              aria-label="Select target city for heat forecast"
              className="text-xs font-extrabold text-[#17233C] bg-transparent outline-none cursor-pointer pr-2"
            >
              {INDIAN_CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>

          {/* Ward Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] rounded-xl px-3 py-1.5 shadow-2xs">
            <span className="text-xs font-bold text-rose-600">Ward:</span>
            <select
              value={selectedWardId}
              onChange={(e) => setSelectedWardId(e.target.value)}
              aria-label="Select specific municipal ward for microclimate forecast"
              className="text-xs font-extrabold text-[#17233C] bg-transparent outline-none cursor-pointer pr-2"
            >
              <option value="all">Citywide Average / Primary Zone</option>
              {allWardProfiles.map((p) => (
                <option key={p.ward.wardId} value={p.ward.wardId}>
                  {p.ward.wardName} ({p.healthRisk.category})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. PEAK-RISK PERIOD HIGHLIGHT BANNER */}
      <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50/90 via-orange-50/80 to-amber-50/60 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Flame className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-800">
                Peak Hazard Alert Window
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-2xs">
                {activeProfile.peakRiskPeriod.urgency}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#17233C]">
              {activeProfile.ward.wardName}: Peak thermal strain expected{' '}
              <span className="text-rose-700 underline decoration-rose-400 underline-offset-2">
                {activeProfile.peakRiskPeriod.windowText}
              </span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Peak UTCI: <strong className="text-[#17233C]">{activeProfile.peakRiskPeriod.peakUtci}°C</strong> (Category: {activeProfile.peakRiskPeriod.peakCategory}) • High heatstroke risk for outdoor laborers & seniors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <span className="text-xs font-bold text-rose-800 bg-white/80 px-3 py-1.5 rounded-xl border border-rose-200 shadow-2xs">
            Effective Max: {activeProfile.currentConditions.effectiveTemperature}°C
          </span>
        </div>
      </div>

      {/* 3. 5-DAY INTERACTIVE HORIZONTAL CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#17233C] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            5-Day Microclimate Assessment for {activeProfile.ward.wardName}
          </h2>
          <span className="text-xs text-[#64748B]">Select day to inspect hourly details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {dailyPoints.map((day) => {
            const isSelected = day.dayIndex === selectedDayIdx;
            const isExtreme = day.riskCategory === 'EXTREME';
            const isHigh = day.riskCategory === 'HIGH';

            return (
              <div
                key={day.date}
                onClick={() => setSelectedDayIdx(day.dayIndex)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : isExtreme
                    ? 'bg-rose-50/40 border-rose-300 hover:border-rose-400'
                    : isHigh
                    ? 'bg-orange-50/30 border-orange-200 hover:border-orange-300'
                    : 'bg-white border-[#E2E8F0] hover:border-blue-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-[#17233C]">{day.dayName}</span>
                    <span className="text-[10px] text-[#64748B]">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="my-2.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-[#17233C]">{day.effectiveMaxTemp}°</span>
                      <span className="text-xs text-[#64748B]">/ {day.minTemp}°C</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                      <span>UTCI: <strong>{day.maxUtci}°C</strong></span>
                      <span>WBGT: <strong>{day.maxWbgt}°C</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      day.riskCategory === 'EXTREME'
                        ? 'bg-rose-100 text-rose-800'
                        : day.riskCategory === 'HIGH'
                        ? 'bg-orange-100 text-orange-800'
                        : day.riskCategory === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {day.riskCategory}
                  </span>
                  <span className="text-xs font-black text-[#17233C]">{day.riskScore}/100</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. HOURLY 72-HOUR BIOMETEOROLOGICAL TRAJECTORY CHART */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#17233C] flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              48-Hour Microclimate Thermal Stress Curve ({activeProfile.ward.wardName})
            </h3>
            <p className="text-xs text-[#64748B]">
              Diurnal hourly variation showing physiological strain (UTCI, WBGT, Heat Index, Air Temp)
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveMetricTab('utci')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeMetricTab === 'utci' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              UTCI Stress
            </button>
            <button
              onClick={() => setActiveMetricTab('wbgt')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeMetricTab === 'wbgt' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              WBGT (Labor)
            </button>
            <button
              onClick={() => setActiveMetricTab('hi')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeMetricTab === 'hi' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Heat Index
            </button>
            <button
              onClick={() => setActiveMetricTab('risk')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeMetricTab === 'risk' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Risk (0-100)
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} interval={3} />
              <YAxis
                domain={
                  activeMetricTab === 'risk'
                    ? [0, 100]
                    : ['dataMin - 2', 'dataMax + 2']
                }
                tick={{ fill: '#64748B', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              {activeMetricTab === 'utci' && (
                <Area
                  type="monotone"
                  dataKey="UTCI"
                  name="UTCI (°C)"
                  stroke="#E11D48"
                  strokeWidth={3}
                  fill="url(#curveGrad)"
                />
              )}
              {activeMetricTab === 'wbgt' && (
                <Area
                  type="monotone"
                  dataKey="WBGT"
                  name="WBGT (°C)"
                  stroke="#D97706"
                  strokeWidth={3}
                  fill="url(#curveGrad)"
                />
              )}
              {activeMetricTab === 'hi' && (
                <Area
                  type="monotone"
                  dataKey="HeatIndex"
                  name="Heat Index (°C)"
                  stroke="#EA580C"
                  strokeWidth={3}
                  fill="url(#curveGrad)"
                />
              )}
              {activeMetricTab === 'risk' && (
                <Area
                  type="monotone"
                  dataKey="RiskScore"
                  name="Risk Score (0-100)"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fill="url(#curveGrad)"
                />
              )}
              <Line
                type="monotone"
                dataKey="AirTemp"
                name="Effective Air Temp (°C)"
                stroke="#64748B"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. CUMULATIVE MULTI-DAY HEAT BURDEN & NIGHT RECOVERY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cumulative Heat Burden Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                Biophysical Accumulation
              </span>
              <h3 className="font-bold text-sm text-[#17233C]">Cumulative Heat Burden Progression</h3>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-500 font-bold">24 Hours</div>
              <div className="text-base font-black text-[#17233C] mt-0.5">
                {activeProfile.cumulativeBurden.burden24h}°C·h
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-500 font-bold">48 Hours</div>
              <div className="text-base font-black text-[#17233C] mt-0.5">
                {activeProfile.cumulativeBurden.burden48h}°C·h
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-2.5">
              <div className="text-[10px] text-purple-700 font-bold">72 Hours</div>
              <div className="text-base font-black text-purple-900 mt-0.5">
                {activeProfile.cumulativeBurden.burden72h}°C·h
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-2.5">
              <div className="text-[10px] text-purple-700 font-bold">5 Days</div>
              <div className="text-base font-black text-purple-900 mt-0.5">
                {activeProfile.cumulativeBurden.burden120h}°C·h
              </div>
            </div>
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed">
            Multi-day accumulated thermal degree-hours over 32°C exhaust cellular heat-shock proteins (HSP70). Prolonged exposure triggers progressive microvascular permeability and kidney strain.
          </p>
        </div>

        {/* Nighttime Recovery & Failure Surveillance Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                  Nocturnal Physiology
                </span>
                <h3 className="font-bold text-sm text-[#17233C]">Nighttime Thermal Recovery</h3>
              </div>
            </div>

            <span
              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                activeProfile.nighttimeRecovery.recoveryFailureDetected
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : activeProfile.nighttimeRecovery.status === 'Good'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}
            >
              {activeProfile.nighttimeRecovery.status}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#17233C]">
              {activeProfile.nighttimeRecovery.nightMinTemp}°C
            </span>
            <span className="text-xs text-[#64748B]">
              Overnight Minimum Temperature (Apparent: {activeProfile.nighttimeRecovery.nightMinApparentTemp}°C)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#17233C] leading-relaxed">
            <span className="font-bold text-rose-700">Medical Warning: </span>
            {activeProfile.nighttimeRecovery.warningMessage}
          </div>
        </div>
      </div>

      {/* 6. DAY SUMMARY & DIRECT MITIGATION PROTOCOLS */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-sm text-[#17233C]">
              Recommended Actions for {currentDay.dayName} ({currentDay.date})
            </h3>
          </div>
          <span className="text-xs font-bold text-blue-600">{currentDay.peakPeriodText}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <strong className="text-[#17233C] block font-bold">Public Health:</strong>
            <p className="text-slate-600">{currentDay.summaryAdvisory}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <strong className="text-[#17233C] block font-bold">Labour Safety:</strong>
            <p className="text-slate-600">
              {currentDay.riskCategory === 'EXTREME'
                ? 'Mandatory afternoon work stoppage (12:00 PM – 4:00 PM).'
                : '15-min shaded rest breaks per 45 min manual labour.'}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <strong className="text-[#17233C] block font-bold">Municipal SOP:</strong>
            <p className="text-slate-600">
              {currentDay.riskCategory === 'EXTREME'
                ? 'Activate public cooling shelters and mobile water misting tankers.'
                : 'Maintain emergency hospital hydration readiness.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
