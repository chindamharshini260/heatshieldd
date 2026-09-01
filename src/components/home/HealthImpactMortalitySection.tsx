import React, { useState } from 'react';
import {
  HeartPulse,
  Info,
  ChevronDown,
  ChevronUp,
  Shield,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { DailyMortalityRiskItem } from '../../utils/mortalityRiskEngine';

interface HealthImpactMortalitySectionProps {
  forecastItems: DailyMortalityRiskItem[];
  locationName: string;
  cityName?: string;
}

export const HealthImpactMortalitySection: React.FC<HealthImpactMortalitySectionProps> = ({
  forecastItems,
  locationName,
  cityName,
}) => {
  const [showMethodology, setShowMethodology] = useState<boolean>(false);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

  if (!forecastItems || forecastItems.length === 0) return null;

  const selectedDay = forecastItems[selectedDayIdx] || forecastItems[0];

  return (
    <div id="health-impact-mortality-section" className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-100">
            <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
            <span>ESTIMATED HEAT-RELATED HEALTH RISK</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#17233C] tracking-tight mt-1.5">
            HEALTH IMPACT & MORTALITY RISK FORECAST
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Estimated 5-day heat-related health risk and projected community physiological burden for{' '}
            <span className="font-semibold text-[#17233C]">{cityName || locationName}</span>
          </p>
        </div>

        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-[#E2E8F0] text-xs font-semibold cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>How is this calculated?</span>
          {showMethodology ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Required Scientific Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-amber-950">Model-Derived Health Estimation</p>
          <p className="text-amber-800 text-[11.5px] leading-relaxed">
            Model-derived estimate based on thermal stress and population vulnerability. It is not a clinical diagnosis or observed mortality count.
          </p>
        </div>
      </div>

      {/* Methodology Accordion */}
      {showMethodology && (
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 text-xs space-y-3">
          <div className="flex items-center gap-2 text-[#17233C] font-bold">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Risk Calculation Methodology & Scientific Pipeline</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
            <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">Step 1</span>
              <span className="font-bold text-[#17233C] mt-0.5">Weather Inputs</span>
              <span className="text-[11px] text-[#64748B] mt-1 leading-snug">
                Temp, Humidity, Wind & Solar Irradiance
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">Step 2</span>
              <span className="font-bold text-[#17233C] mt-0.5">Thermal Indices</span>
              <span className="text-[11px] text-[#64748B] mt-1 leading-snug">
                UTCI, WBGT & Rothfusz Heat Index
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">Step 3</span>
              <span className="font-bold text-[#17233C] mt-0.5">Thermal Stress</span>
              <span className="text-[11px] text-[#64748B] mt-1 leading-snug">
                Human heat load, night recovery & duration
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">Step 4</span>
              <span className="font-bold text-[#17233C] mt-0.5">Vulnerability</span>
              <span className="text-[11px] text-[#64748B] mt-1 leading-snug">
                Elderly %, outdoor workers, density & UHI
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-rose-200 bg-rose-50/40 flex flex-col">
              <span className="text-[10px] font-bold uppercase text-rose-500">Output</span>
              <span className="font-bold text-rose-900 mt-0.5">Health Risk</span>
              <span className="text-[11px] text-rose-700 mt-1 leading-snug">
                Estimated Health & Mortality Risk (0-100)
              </span>
            </div>
          </div>

          {/* Standardized Threshold Reference */}
          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-[#E2E8F0] text-[11px] text-slate-600">
            <span className="font-bold text-slate-700">Risk Scale:</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <strong>0–25</strong> Low
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <strong>26–50</strong> Moderate
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <strong>51–75</strong> High
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <strong>76–100</strong> Very High
            </span>
          </div>
        </div>
      )}

      {/* 5-Day Forecast Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100">
        {forecastItems.map((item, idx) => {
          const isSelected = idx === selectedDayIdx;
          return (
            <button
              key={`tab-${item.date}`}
              onClick={() => setSelectedDayIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#17233C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{item.dayLabel || (idx === 0 ? 'TODAY' : `DAY ${idx + 1}`)}</span>
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: item.color }}
              />
            </button>
          );
        })}
      </div>

      {/* 5-Day Forecast Table (Desktop) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E2E8F0]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
              <th className="py-3 px-4">Timeline</th>
              <th className="py-3 px-4">Thermal Stress</th>
              <th className="py-3 px-4">Vulnerability</th>
              <th className="py-3 px-4">Health Risk / Mortality Score</th>
              <th className="py-3 px-4">Risk Category</th>
              <th className="py-3 px-4">Expected Health Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-[#17233C]">
            {forecastItems.map((item, idx) => {
              const isSelected = idx === selectedDayIdx;
              return (
                <tr
                  key={item.date}
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`transition-colors cursor-pointer hover:bg-slate-50 ${
                    isSelected ? 'bg-blue-50/40 font-medium' : ''
                  }`}
                >
                  {/* Timeline (TODAY | DAY 2 | etc.) */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#17233C]">
                      {item.dayLabel || (idx === 0 ? 'TODAY' : `DAY ${idx + 1}`)}
                    </div>
                    <div className="text-[11px] text-[#64748B] font-normal">
                      {item.dayName} ({item.date})
                    </div>
                  </td>

                  {/* Thermal Stress */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#17233C]">{item.thermalStressCategory}</div>
                    <div className="text-[11px] text-[#64748B] font-normal">
                      Max {item.maxTemp}°C • UTCI {item.utci}°C
                    </div>
                  </td>

                  {/* Vulnerability */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {item.vulnerabilityLevel}
                    </span>
                    <div className="text-[10px] text-[#64748B] mt-0.5 max-w-[140px] truncate" title={item.vulnerabilityFactors.join(', ')}>
                      {item.vulnerabilityFactors[0] || 'Standard baseline'}
                    </div>
                  </td>

                  {/* Health Risk / Estimated Mortality Risk Score */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#17233C] tabular-nums">
                        {item.healthRiskScore}/100
                      </span>
                      <div className="w-16 bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.healthRiskScore}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      Estimated Mortality Risk
                    </div>
                  </td>

                  {/* Risk Category */}
                  <td className="py-3.5 px-4">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border tracking-wide"
                      style={{
                        backgroundColor: item.badgeBg,
                        color: item.color,
                        borderColor: item.badgeBorder,
                      }}
                    >
                      {item.riskCategory}
                    </span>
                  </td>

                  {/* Expected Health Impact */}
                  <td className="py-3.5 px-4 max-w-xs text-[11px] text-[#475569] leading-relaxed">
                    {item.expectedHealthImpact}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 5-Day Cards (Mobile View) */}
      <div className="md:hidden space-y-3">
        {forecastItems.map((item, idx) => {
          const isSelected = idx === selectedDayIdx;
          return (
            <div
              key={item.date}
              onClick={() => setSelectedDayIdx(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-300 bg-blue-50/30 shadow-2xs'
                  : 'border-[#E2E8F0] bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">
                    {item.dayLabel || (idx === 0 ? 'TODAY' : `DAY ${idx + 1}`)}
                  </span>
                  <span className="text-sm font-bold text-[#17233C]">{item.dayName}</span>
                  <span className="text-xs text-[#64748B] ml-1.5">({item.date})</span>
                </div>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                  style={{
                    backgroundColor: item.badgeBg,
                    color: item.color,
                    borderColor: item.badgeBorder,
                  }}
                >
                  {item.riskCategory}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 my-2.5 pt-2 border-t border-[#E2E8F0] text-xs">
                <div>
                  <div className="text-[10px] text-[#64748B]">Thermal Stress</div>
                  <div className="font-semibold text-[#17233C]">{item.thermalStressCategory}</div>
                  <div className="text-[10px] text-slate-500">{item.maxTemp}°C • UTCI {item.utci}°C</div>
                </div>

                <div>
                  <div className="text-[10px] text-[#64748B]">Vulnerability</div>
                  <div className="font-semibold text-[#17233C]">{item.vulnerabilityLevel}</div>
                </div>

                <div>
                  <div className="text-[10px] text-[#64748B]">Health / Mortality Risk</div>
                  <div className="font-bold text-[#17233C] tabular-nums">
                    {item.healthRiskScore}/100
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed pt-2 border-t border-[#E2E8F0]">
                {item.expectedHealthImpact}
              </p>
            </div>
          );
        })}
      </div>

      {/* Selected Day Clinical Focus Callout */}
      {selectedDay && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/40 border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-600" />
              <span className="font-bold text-[#17233C]">
                {selectedDay.dayLabel || (selectedDayIdx === 0 ? 'TODAY' : `DAY ${selectedDayIdx + 1}`)} Focus Summary ({selectedDay.dayName}, {selectedDay.date})
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: selectedDay.badgeBg,
                  color: selectedDay.color,
                  borderColor: selectedDay.badgeBorder,
                }}
              >
                Estimated Health Risk: {selectedDay.healthRiskScore}/100
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-2xl">
              <strong>Key Exposure Drivers: </strong>
              {selectedDay.vulnerabilityFactors.join(' • ')} • UTCI: {selectedDay.utci}°C • WBGT: {selectedDay.wbgt}°C.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
