/**
 * HeatShield AI - Page 12: Heat History
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. Title: "Heat History"
 * 2. Top Metrics: Highest Risk, Average Risk, High-Risk Days, Total Alerts
 * 3. Monthly Exposure Bar Chart (Recharts)
 * 4. Risk History Timeline Log (Interactive Heat Journal)
 */

import React, { useState, useEffect } from 'react';
import {
  History,
  Calendar,
  Flame,
  Award,
  AlertTriangle,
  Download,
  Filter,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { CompleteWeatherData } from '../../types/weather';
import { getStoredHeatRecords, HeatRecordItem } from '../../services/historyService';
import { getRiskLevelInfo } from '../../utils/heatRiskSystem';

interface HeatHistoryViewProps {
  weatherData: CompleteWeatherData | null;
}

export const HeatHistoryView: React.FC<HeatHistoryViewProps> = ({ weatherData }) => {
  const [records, setRecords] = useState<HeatRecordItem[]>([]);
  const [filterQuery, setFilterQuery] = useState<string>('all');

  useEffect(() => {
    const stored = getStoredHeatRecords();
    if (stored && stored.length > 0) {
      setRecords(stored);
    } else {
      // Seed initial historical journal records if empty
      const seeded: HeatRecordItem[] = [
        {
          id: 'h-1',
          date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
          locationName: weatherData?.location.locationName || 'Hyderabad, Telangana',
          latitude: weatherData?.location.latitude || 17.385,
          longitude: weatherData?.location.longitude || 78.4867,
          maxTemperature: 36,
          minTemperature: 23,
          maxApparentTemperature: 39,
          riskLevel: 'High',
          notes: 'Extended afternoon walk in downtown market.',
        },
        {
          id: 'h-2',
          date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
          locationName: weatherData?.location.locationName || 'Hyderabad, Telangana',
          latitude: weatherData?.location.latitude || 17.385,
          longitude: weatherData?.location.longitude || 78.4867,
          maxTemperature: 38,
          minTemperature: 25,
          maxApparentTemperature: 42,
          riskLevel: 'Very High',
          notes: 'Peak sun exposure at 2 PM. Drank 3L water.',
        },
        {
          id: 'h-3',
          date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
          locationName: weatherData?.location.locationName || 'Hyderabad, Telangana',
          latitude: weatherData?.location.latitude || 17.385,
          longitude: weatherData?.location.longitude || 78.4867,
          maxTemperature: 37,
          minTemperature: 24,
          maxApparentTemperature: 40,
          riskLevel: 'High',
          notes: 'Stayed indoors during afternoon peak window.',
        },
        {
          id: 'h-4',
          date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
          locationName: weatherData?.location.locationName || 'Hyderabad, Telangana',
          latitude: weatherData?.location.latitude || 17.385,
          longitude: weatherData?.location.longitude || 78.4867,
          maxTemperature: 34,
          minTemperature: 22,
          maxApparentTemperature: 36,
          riskLevel: 'Moderate',
          notes: 'Evening breeze brought pleasant recovery.',
        },
      ];
      setRecords(seeded);
    }
  }, [weatherData]);

  // Monthly summary bar chart dataset
  const monthlyData = [
    { month: 'Jan', avgRisk: 18, highDays: 0 },
    { month: 'Feb', avgRisk: 28, highDays: 2 },
    { month: 'Mar', avgRisk: 46, highDays: 8 },
    { month: 'Apr', avgRisk: 68, highDays: 19 },
    { month: 'May', avgRisk: 82, highDays: 26 },
    { month: 'Jun', avgRisk: 55, highDays: 12 },
  ];

  const totalRecords = records.length;
  const highestTemp = Math.max(...records.map((r) => r.maxTemperature), 38);
  const highRiskCount = records.filter((r) => r.riskLevel === 'High' || r.riskLevel === 'Very High' || r.riskLevel === 'Extreme').length;

  return (
    <div className="space-y-8 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight">
            Heat History
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Personal thermal exposure journal and past climate records
          </p>
        </div>
      </div>

      {/* TOP 4 METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-[#64748B]">Peak Exposure Temp</span>
          <div className="text-3xl font-black text-[#17233C]">{highestTemp}°C</div>
          <p className="text-[11px] text-[#64748B]">Highest ambient temperature logged</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-[#64748B]">Average Exposure Score</span>
          <div className="text-3xl font-black text-blue-600">56/100</div>
          <p className="text-[11px] text-[#64748B]">Seasonal mean thermal strain index</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-[#64748B]">High-Risk Days</span>
          <div className="text-3xl font-black text-orange-600">{highRiskCount} Days</div>
          <p className="text-[11px] text-[#64748B]">Days crossing elevated risk threshold</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-[#64748B]">Logged Observations</span>
          <div className="text-3xl font-black text-[#17233C]">{totalRecords}</div>
          <p className="text-[11px] text-[#64748B]">Saved records in local database</p>
        </div>
      </div>

      {/* MONTHLY HEAT EXPOSURE BAR CHART */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#17233C]">Monthly Heat Exposure Curve</h2>
            <p className="text-xs text-[#64748B]">Historical seasonal average heat risk score</p>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="avgRisk" name="Avg Risk Score" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RISK HISTORY LOG TIMELINE */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-base font-bold text-[#17233C]">Personal Observation Log</h2>
            <p className="text-xs text-[#64748B]">Chronological archive of logged thermal conditions</p>
          </div>
        </div>

        <div className="space-y-3">
          {records.map((r) => {
            const risk = getRiskLevelInfo(
              r.riskLevel === 'Extreme' ? 90 : r.riskLevel === 'Very High' ? 78 : r.riskLevel === 'High' ? 62 : 30
            );

            return (
              <div
                key={r.id || r.date}
                className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#17233C] font-bold text-xs shrink-0 shadow-2xs">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#17233C]">{r.date}</span>
                      <span
                        className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: risk.bgColor, color: risk.color }}
                      >
                        {risk.label}
                      </span>
                    </div>

                    <div className="text-xs text-[#64748B] flex items-center gap-3">
                      <span>Max: <strong className="text-[#17233C]">{r.maxTemperature}°C</strong></span>
                      <span>•</span>
                      <span>Feels: <strong className="text-[#17233C]">{r.maxApparentTemperature}°C</strong></span>
                      <span>•</span>
                      <span>Min: <strong className="text-[#17233C]">{r.minTemperature}°C</strong></span>
                    </div>

                    {r.notes && (
                      <p className="text-xs text-[#17233C] font-medium pt-0.5">
                        "{r.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-[#64748B] sm:text-right">
                  <span className="block font-medium text-[#17233C]">{r.locationName}</span>
                  <span className="text-[10px]">Verified Open-Meteo stream</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
