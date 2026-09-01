import React from 'react';
import {
  Users,
  Flame,
  ShieldAlert,
  Activity,
  TreePine,
  Building2,
  HardHat,
  HeartPulse,
  Info,
  Clock
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../types';

interface HumanExposureViewProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const HumanExposureView: React.FC<HumanExposureViewProps> = ({
  city,
  wardProfiles
}) => {
  if (!wardProfiles || wardProfiles.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono">
        Loading Human Exposure & Vulnerability matrix for {city.name}...
      </div>
    );
  }

  const maxCityUtci = wardProfiles.length
    ? Math.max(...wardProfiles.map((p) => p.currentThermal?.utci || 42))
    : 42;
  const avgHealthRisk = wardProfiles.length
    ? (wardProfiles.reduce((acc, p) => acc + (p.healthImpactRisk || 0), 0) / wardProfiles.length) * 100
    : 60;

  return (
    <div id="human-exposure-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-rose-400 font-mono font-semibold uppercase tracking-wider mb-1">
          <Users className="w-3.5 h-3.5" />
          Demographic & Exposure Science Engine
        </div>
        <h2 className="text-xl font-bold text-slate-100">
          HUMAN EXPOSURE & HEAT VULNERABILITY ARCHITECTURE
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          HeatShield AI strictly differentiates between physical atmospheric heat (Hazard), the population placed in harm&apos;s way (Exposure), demographic susceptibility (Vulnerability), and the resultant health consequences (Impact).
        </p>
      </div>

      {/* 4 Pillars of Climate Risk (Hazard vs Exposure vs Vulnerability vs Impact) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* HAZARD */}
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 font-mono uppercase">1. HAZARD</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-semibold text-slate-100">How severe is the thermal stress?</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Universal Thermal Climate Index (UTCI), Liljegren WBGT, peak temperature, solar irradiance, and diurnal persistence.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-amber-300">
            Current City Peak: {maxCityUtci}°C UTCI
          </div>
        </div>

        {/* EXPOSURE */}
        <div className="bg-slate-900/90 border border-orange-500/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-400 font-mono uppercase">2. EXPOSURE</span>
            <Users className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-sm font-semibold text-slate-100">Who is physically in harm&apos;s way?</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Population density, active outdoor workers (construction, vendors, transit), and time-of-day exposure curves.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-orange-300">
            Total Exposed: {wardProfiles.reduce((acc, p) => acc + Math.round((p.ward.totalPopulation * p.humanExposureScore) / 100), 0).toLocaleString()} people
          </div>
        </div>

        {/* VULNERABILITY */}
        <div className="bg-slate-900/90 border border-rose-500/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 font-mono uppercase">3. VULNERABILITY</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-sm font-semibold text-slate-100">How susceptible are those people?</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Elderly (60+), slum/tin-sheet housing, lack of tree shade (NDVI deficit), and distance to emergency cooling facilities.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-rose-300">
            High-Risk Seniors: {wardProfiles.reduce((acc, p) => acc + p.ward.elderlyPopulation60Plus, 0).toLocaleString()} residents
          </div>
        </div>

        {/* IMPACT */}
        <div className="bg-slate-900/90 border border-purple-500/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 font-mono uppercase">4. IMPACT</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm font-semibold text-slate-100">What health consequences occur?</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Emergency hospital triage surges, heat exhaustion cases, acute cardiovascular collapse, and lost labor productivity.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-purple-300">
            Avg City Health Risk: {(wardProfiles.reduce((acc, p) => acc + p.healthImpactRisk, 0) / wardProfiles.length * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Ward Demographic & Vulnerability Matrix Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              WARD-LEVEL EXPOSURE & VULNERABILITY CENSUS MATRIX
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical demographic weights sourced from Census of India and ISRO/Bhuvan Land-Use datasets.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            {wardProfiles.length} Municipal Wards Evaluated
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase bg-slate-950/60">
                <th className="p-3">Rank / Ward</th>
                <th className="p-3">Total Pop</th>
                <th className="p-3">Density (/km²)</th>
                <th className="p-3">Outdoor Labor</th>
                <th className="p-3">Elderly (60+)</th>
                <th className="p-3">Slum Ratio</th>
                <th className="p-3">NDVI Shade</th>
                <th className="p-3">UHI Built-Up</th>
                <th className="p-3">Exposure</th>
                <th className="p-3">Vulnerability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {wardProfiles.map((p) => {
                const w = p.ward;
                return (
                  <tr key={w.wardId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-rose-400 font-bold">#{p.interventionPriorityRank}</span>
                        <span>{w.wardName}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono">{w.totalPopulation.toLocaleString()}</td>
                    <td className="p-3 font-mono">{w.populationDensity.toLocaleString()}</td>
                    <td className="p-3 font-mono text-amber-400">
                      {w.outdoorWorkerPopulation.toLocaleString()} ({(w.outdoorWorkerRatio * 100).toFixed(0)}%)
                    </td>
                    <td className="p-3 font-mono text-rose-400">
                      {w.elderlyPopulation60Plus.toLocaleString()} ({(w.elderlyRatio * 100).toFixed(1)}%)
                    </td>
                    <td className="p-3 font-mono">{(w.slumInformalHousingRatio * 100).toFixed(0)}%</td>
                    <td className="p-3 font-mono">{w.vegetationIndexNDVI}</td>
                    <td className="p-3 font-mono">{(w.imperviousBuiltupRatio * 100).toFixed(0)}%</td>
                    <td className="p-3 font-mono font-bold text-orange-400">
                      {p.humanExposureScore}/100
                    </td>
                    <td className="p-3 font-mono font-bold text-rose-400">
                      {p.vulnerabilityScore}/100
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
