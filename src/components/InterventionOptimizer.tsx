import React, { useState, useMemo } from 'react';
import {
  Sliders,
  CheckCircle2,
  TrendingDown,
  Building,
  Truck,
  Users,
  Hospital,
  Zap,
  ArrowRight,
  Info,
  ShieldAlert
} from 'lucide-react';
import { CityData, ResourceConstraints, WardImpactProfile } from '../types';
import { optimize_resource_allocation } from '../utils/optimizationEngine';

interface InterventionOptimizerProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const InterventionOptimizer: React.FC<InterventionOptimizerProps> = ({
  city,
  wardProfiles
}) => {
  const [constraints, setConstraints] = useState<ResourceConstraints>({
    maxCoolingCenters: 8,
    maxMobileUnits: 6,
    maxWorkerTeams: 20,
    maxHospitalBeds: 50,
    budgetLakhsINR: 25
  });

  const allocations = useMemo(() => {
    return optimize_resource_allocation(wardProfiles, constraints);
  }, [wardProfiles, constraints]);

  const totalReached = useMemo(() => {
    return allocations.reduce((acc, a) => acc + a.expectedPopReached, 0);
  }, [allocations]);

  const totalHighVulnerability = useMemo(() => {
    return wardProfiles.reduce(
      (acc, p) => acc + p.ward.elderlyPopulation60Plus + p.ward.outdoorWorkerPopulation,
      0
    );
  }, [wardProfiles]);

  const coveragePercent = Math.min(
    100,
    Math.round((totalReached / Math.max(1, totalHighVulnerability)) * 100)
  );

  return (
    <div id="intervention-optimizer-view" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-rose-400 font-mono font-semibold uppercase tracking-wider mb-1">
          <Sliders className="w-3.5 h-3.5" />
          Mathematical Decision Optimization
        </div>
        <h2 className="text-xl font-bold text-slate-100">
          RESOURCE-CONSTRAINED INTERVENTION OPTIMIZER
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Solves the municipal resource allocation problem: Given finite cooling centers, misting vans, and healthcare teams, mathematically distribute assets across wards to maximize high-vulnerability population protection.
        </p>
      </div>

      {/* Constraints Sliders & Efficiency Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Resource Sliders */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              AVAILABLE MUNICIPAL BUDGET & ASSETS
            </h3>
            <span className="text-xs font-mono text-slate-400">Adjust limits in real-time</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cooling Centers */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-cyan-400" />
                  Air-Conditioned Cooling Centers:
                </span>
                <span className="font-mono text-cyan-400 font-bold text-sm">
                  {constraints.maxCoolingCenters} units
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={constraints.maxCoolingCenters}
                onChange={(e) =>
                  setConstraints((c) => ({ ...c, maxCoolingCenters: parseInt(e.target.value) || 0 }))
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Mobile Misting Units */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  Mobile Misting Tanker Vans:
                </span>
                <span className="font-mono text-amber-400 font-bold text-sm">
                  {constraints.maxMobileUnits} units
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={constraints.maxMobileUnits}
                onChange={(e) =>
                  setConstraints((c) => ({ ...c, maxMobileUnits: parseInt(e.target.value) || 0 }))
                }
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* ASHA Healthcare Teams */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  ASHA / Health Worker Teams:
                </span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {constraints.maxWorkerTeams} teams
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={constraints.maxWorkerTeams}
                onChange={(e) =>
                  setConstraints((c) => ({ ...c, maxWorkerTeams: parseInt(e.target.value) || 0 }))
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Hospital Beds */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Hospital className="w-3.5 h-3.5 text-rose-400" />
                  Dedicated Surge Triage Beds:
                </span>
                <span className="font-mono text-rose-400 font-bold text-sm">
                  {constraints.maxHospitalBeds} beds
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={constraints.maxHospitalBeds}
                onChange={(e) =>
                  setConstraints((c) => ({ ...c, maxHospitalBeds: parseInt(e.target.value) || 0 }))
                }
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Optimization Outcome KPI */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-mono text-emerald-400 uppercase font-semibold">
              OPTIMIZATION EFFICIENCY
            </div>
            <div className="text-3xl font-extrabold text-slate-100 font-mono">
              {totalReached.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">
              Vulnerable residents protected out of {totalHighVulnerability.toLocaleString()} total in {city.name}.
            </div>

            {/* Coverage Meter */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Protection Coverage:</span>
                <span className="text-emerald-400 font-bold">{coveragePercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${coveragePercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <span>
              Solver uses greedy marginal utility on Ward Priority Scores to maximize vulnerable coverage under asset caps.
            </span>
          </div>
        </div>
      </div>

      {/* Ward-by-Ward Optimal Allocation Plan */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-100">
            OPTIMIZED WARD DISPATCH DIRECTIVE
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Sorted by Marginal Health Impact Priority
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allocations.map((a) => (
            <div
              key={a.wardId}
              className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                    Rank #{a.priorityRank}
                  </span>
                  <h4 className="text-sm font-bold text-slate-100">{a.wardName}</h4>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  {a.expectedPopReached.toLocaleString()} people reached
                </span>
              </div>

              {/* Resource Allocation Grid */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                  <div className="font-bold text-cyan-400 font-mono text-sm">{a.allocatedCoolingCenters}</div>
                  <div className="text-[9px] text-slate-400">Cooling Ctr</div>
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                  <div className="font-bold text-amber-400 font-mono text-sm">{a.allocatedMobileUnits}</div>
                  <div className="text-[9px] text-slate-400">Mist Vans</div>
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                  <div className="font-bold text-emerald-400 font-mono text-sm">{a.allocatedWorkerTeams}</div>
                  <div className="text-[9px] text-slate-400">ASHA Teams</div>
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                  <div className="font-bold text-rose-400 font-mono text-sm">{a.allocatedHospitalBeds}</div>
                  <div className="text-[9px] text-slate-400">Surge Beds</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-mono leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                {a.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
