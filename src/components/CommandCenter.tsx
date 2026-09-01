import React from 'react';
import {
  Flame,
  Thermometer,
  Wind,
  Sun,
  Droplets,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity,
  Sliders,
  MapPin,
  FileText
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../types';
import { ImpactCascade } from './ImpactCascade';

interface CommandCenterProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
  onNavigateTab: (tab: string) => void;
  onSelectWard: (wardId: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  city,
  wardProfiles,
  onNavigateTab,
  onSelectWard
}) => {
  if (!wardProfiles || wardProfiles.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono">
        Loading Command Center telemetry for {city.name}...
      </div>
    );
  }

  const topWard = wardProfiles[0];
  const maxTemp = wardProfiles.length
    ? Math.max(...wardProfiles.map((p) => p.currentThermal?.heatIndex || 40))
    : 40;
  const maxUtci = wardProfiles.length
    ? Math.max(...wardProfiles.map((p) => p.currentThermal?.utci || 42))
    : 42;
  const totalHighRisk = wardProfiles.reduce(
    (acc, p) => acc + (p.ward?.elderlyPopulation60Plus || 0) + (p.ward?.outdoorWorkerPopulation || 0),
    0
  );

  return (
    <div id="command-center-view" className="space-y-6">
      {/* Alert Status Banner */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border border-rose-600/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              IMD / NDMA RED ALERT ACTIVATED - {city.name.toUpperCase()}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              HEAT EMERGENCY FORECAST & INTERVENTION DIRECTIVE
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Forecast peak heat stress reaching <strong className="text-rose-400">UTCI {maxUtci}°C</strong> (Ambient {maxTemp}°C). Critical action window: <strong className="text-amber-300">{topWard.actionWindowHours} hours</strong> before peak hospital and occupational health surge.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('simulator')}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Launch What-If Simulator
            </button>
          </div>
        </div>
      </div>

      {/* Atmospheric vs Thermal Stress KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Air Temp</div>
          <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">{maxTemp}°C</div>
          <div className="text-[9px] text-slate-400">Ambient Peak</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Humidity</div>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-0.5">42%</div>
          <div className="text-[9px] text-slate-400">Relative Humidity</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Wind Speed</div>
          <div className="text-xl font-bold text-slate-200 font-mono mt-0.5">8.4 km/h</div>
          <div className="text-[9px] text-slate-400">Surface 10m</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Solar Rad</div>
          <div className="text-xl font-bold text-amber-300 font-mono mt-0.5">740 W/m²</div>
          <div className="text-[9px] text-slate-400">Direct Irradiance</div>
        </div>

        <div className="bg-slate-900/90 border border-orange-900/40 rounded-xl p-3 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Heat Index</div>
          <div className="text-xl font-bold text-orange-400 font-mono mt-0.5">
            {topWard.currentThermal.heatIndex}°C
          </div>
          <div className="text-[9px] text-orange-400">Rothfusz NOAA</div>
        </div>

        <div className="bg-slate-900/90 border border-amber-900/40 rounded-xl p-3 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-mono">WBGT Index</div>
          <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">
            {topWard.currentThermal.wbgt}°C
          </div>
          <div className="text-[9px] text-amber-400">ISO 7243 Labor</div>
        </div>

        <div className="bg-slate-900/90 border border-rose-600/50 rounded-xl p-3 text-center ring-1 ring-rose-500/40">
          <div className="text-[10px] text-rose-300 uppercase font-mono font-bold">UTCI Stress</div>
          <div className="text-xl font-extrabold text-rose-400 font-mono mt-0.5">{maxUtci}°C</div>
          <div className="text-[9px] text-rose-400 font-bold">Extreme Stress</div>
        </div>

        <div className="bg-slate-900/90 border border-purple-900/40 rounded-xl p-3 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-mono">HTSS Score</div>
          <div className="text-xl font-bold text-purple-400 font-mono mt-0.5">
            {topWard.currentThermal.htss}/100
          </div>
          <div className="text-[9px] text-purple-400">Cumulative Load</div>
        </div>
      </div>

      {/* Impact Cascade Reasoning Pipeline */}
      <ImpactCascade profile={topWard} cityName={city.name} />

      {/* Prioritized Action Ranks & Fast Dispatch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 3 Prioritized Wards */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                TOP INTERVENTION PRIORITY WARDS ({city.name})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated by combining thermal load, outdoor worker density, elderly demographics, and slum ratios.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('gis')}
              className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 font-semibold"
            >
              View Full GIS Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {wardProfiles.slice(0, 3).map((p) => (
              <div
                key={p.ward.wardId}
                className="p-3.5 bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-wrap items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                      Rank #{p.interventionPriorityRank}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">{p.ward.wardName}</h4>
                    <span className="text-xs text-slate-400">({p.ward.zone})</span>
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 font-mono">
                    <span>Pop: {p.ward.totalPopulation.toLocaleString()}</span>
                    <span>Labor: {p.ward.outdoorWorkerPopulation.toLocaleString()}</span>
                    <span>Elderly: {p.ward.elderlyPopulation60Plus.toLocaleString()}</span>
                    <span className="text-rose-400 font-bold">Risk: {(p.healthImpactRisk * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectWard(p.ward.wardId);
                      onNavigateTab('simulator');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    Simulate
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-3">
              MUNICIPAL DECISION SUITE
            </h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigateTab('optimizer')}
                className="w-full p-3 bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 rounded-lg text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-slate-200 group-hover:text-emerald-300">
                      Resource Allocation Optimizer
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Distribute cooling centers, mist vans & ASHA teams
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigateTab('scenarios')}
                className="w-full p-3 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-lg text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-slate-200 group-hover:text-cyan-300">
                      What-If Scenario Benchmark
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Compare 5 policy packages side-by-side
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigateTab('hap')}
                className="w-full p-3 bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 rounded-lg text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-semibold text-slate-200 group-hover:text-indigo-300">
                      Heat Action Plan (HAP) SOP
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Generate official NDMA inter-agency directives
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>High Vulnerability Pop:</span>
            <span className="text-rose-400 font-bold">{totalHighRisk.toLocaleString()} residents</span>
          </div>
        </div>
      </div>
    </div>
  );
};
