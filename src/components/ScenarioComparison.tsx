import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  TrendingDown,
  Building,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { CityData, SimulationOutcome, WardImpactProfile } from '../types';
import { simulate_intervention_outcomes } from '../utils/optimizationEngine';

interface ScenarioComparisonProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  city,
  wardProfiles
}) => {
  const [copied, setCopied] = useState(false);

  // Compute 5 standardized benchmark scenarios
  const scenarios: SimulationOutcome[] = useMemo(() => {
    // 1. Baseline
    const baseline = simulate_intervention_outcomes(
      wardProfiles,
      {
        coolingCentersActive: false,
        shiftWorkHoursActive: false,
        hydrationRestBreaksActive: false,
        targetedAlertsActive: false,
        elderlyWelfareChecksActive: false,
        hospitalPreparednessActive: false,
        mobileCoolingUnitsActive: false,
        coolRoofsSprinklingActive: false,
        fullHapActive: false
      },
      'Baseline (Do Nothing)'
    );

    // 2. Cooling Centers Only
    const coolingOnly = simulate_intervention_outcomes(
      wardProfiles,
      {
        coolingCentersActive: true,
        shiftWorkHoursActive: false,
        hydrationRestBreaksActive: false,
        targetedAlertsActive: false,
        elderlyWelfareChecksActive: false,
        hospitalPreparednessActive: false,
        mobileCoolingUnitsActive: false,
        coolRoofsSprinklingActive: false,
        fullHapActive: false
      },
      'Scenario A: Cooling Centers Only'
    );

    // 3. Work Shift Only
    const workShiftOnly = simulate_intervention_outcomes(
      wardProfiles,
      {
        coolingCentersActive: false,
        shiftWorkHoursActive: true,
        hydrationRestBreaksActive: true,
        targetedAlertsActive: false,
        elderlyWelfareChecksActive: false,
        hospitalPreparednessActive: false,
        mobileCoolingUnitsActive: false,
        coolRoofsSprinklingActive: false,
        fullHapActive: false
      },
      'Scenario B: Worker Protection Mandate'
    );

    // 4. Cooling + Worker
    const coolingAndWorker = simulate_intervention_outcomes(
      wardProfiles,
      {
        coolingCentersActive: true,
        shiftWorkHoursActive: true,
        hydrationRestBreaksActive: true,
        targetedAlertsActive: true,
        elderlyWelfareChecksActive: false,
        hospitalPreparednessActive: false,
        mobileCoolingUnitsActive: true,
        coolRoofsSprinklingActive: false,
        fullHapActive: false
      },
      'Scenario C: Cooling + Worker Strategy'
    );

    // 5. Full Heat Action Plan
    const fullHap = simulate_intervention_outcomes(
      wardProfiles,
      {
        coolingCentersActive: true,
        shiftWorkHoursActive: true,
        hydrationRestBreaksActive: true,
        targetedAlertsActive: true,
        elderlyWelfareChecksActive: true,
        hospitalPreparednessActive: true,
        mobileCoolingUnitsActive: true,
        coolRoofsSprinklingActive: true,
        fullHapActive: true
      },
      'Scenario D: Full NDMA Heat Action Plan'
    );

    return [baseline, coolingOnly, workShiftOnly, coolingAndWorker, fullHap];
  }, [wardProfiles]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(scenarios, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="scenario-comparison-view" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-mono font-semibold uppercase tracking-wider mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            Comparative Policy Evaluation
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            WHAT-IF SCENARIO BENCHMARK & COMPARISON
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Evaluate alternative municipal response packages against baseline inaction to determine optimal cost-benefit and surge reduction trade-offs.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Scenario JSON' : 'Export Comparison'}
        </button>
      </div>

      {/* Comparison Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {scenarios.map((sc, idx) => {
          const isBest = idx === scenarios.length - 1;
          const isBaseline = idx === 0;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border relative flex flex-col justify-between ${
                isBest
                  ? 'bg-emerald-950/20 border-emerald-500/50 shadow-xl shadow-emerald-950/30'
                  : isBaseline
                  ? 'bg-rose-950/20 border-rose-800/40'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      isBest
                        ? 'bg-emerald-500 text-slate-950'
                        : isBaseline
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isBaseline ? 'No Action' : isBest ? 'Maximum Impact' : `Package ${idx}`}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-100 mb-2 leading-snug">
                  {sc.scenarioName}
                </h4>

                <div className="space-y-2 text-xs pt-1">
                  <div>
                    <div className="text-[10px] text-slate-400">Risk Reduction</div>
                    <div
                      className={`text-lg font-bold font-mono ${
                        isBaseline ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {sc.overallRiskReductionPercent > 0 ? `-${sc.overallRiskReductionPercent}%` : '0% (None)'}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400">Exposure Mitigated</div>
                    <div className="text-sm font-semibold font-mono text-slate-200">
                      {sc.overallExposureReductionPercent > 0 ? `-${sc.overallExposureReductionPercent}%` : '0%'}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400">Hospital Surge</div>
                    <div className="text-xs font-mono text-slate-300">
                      {sc.hospitalizationSurgeBaseline} →{' '}
                      <span className={isBaseline ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {sc.hospitalizationSurgeMitigated} cases
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 mt-3 text-[10px] font-mono text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Cooling Centers:</span>
                  <span className="text-slate-200">{sc.resourceUtilization.coolingCentersUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mist Vans:</span>
                  <span className="text-slate-200">{sc.resourceUtilization.mobileUnitsUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health Teams:</span>
                  <span className="text-slate-200">{sc.resourceUtilization.workerTeamsDeployed}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Detailed Breakdown Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100">
          COMPREHENSIVE MULTI-CRITERIA EVALUATION
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase bg-slate-950/60">
                <th className="p-3">Policy Scenario</th>
                <th className="p-3">Thermal Exposure Delta</th>
                <th className="p-3">Health Risk Reduction</th>
                <th className="p-3">Hospital Load Shift</th>
                <th className="p-3">Cooling Assets</th>
                <th className="p-3">Labor Shift Mandate</th>
                <th className="p-3">Feasibility Speed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {scenarios.map((sc, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-100">{sc.scenarioName}</td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">
                    {sc.overallExposureReductionPercent > 0 ? `-${sc.overallExposureReductionPercent}%` : '0%'}
                  </td>
                  <td className="p-3 font-mono text-cyan-400 font-bold">
                    {sc.overallRiskReductionPercent > 0 ? `-${sc.overallRiskReductionPercent}%` : '0%'}
                  </td>
                  <td className="p-3 font-mono">
                    {sc.hospitalizationSurgeBaseline} → {sc.hospitalizationSurgeMitigated}
                  </td>
                  <td className="p-3 font-mono">
                    {sc.resourceUtilization.coolingCentersUsed} centers / {sc.resourceUtilization.mobileUnitsUsed} vans
                  </td>
                  <td className="p-3 font-mono">
                    {sc.activeInterventions.shiftWorkHoursActive ? (
                      <span className="text-emerald-400 font-semibold">Active (06:00-11:00)</span>
                    ) : (
                      <span className="text-slate-500">Unrestricted</span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-slate-400">
                    {i === 0 ? 'N/A' : i <= 2 ? 'Fast (<6h)' : 'Comprehensive (12-24h)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
