import React, { useState, useMemo } from 'react';
import {
  Flame,
  Shield,
  Users,
  Building,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  Info,
  RefreshCw,
  AlertTriangle,
  Zap,
  Sliders,
  Check,
  Download
} from 'lucide-react';
import {
  ActiveInterventionConfig,
  CityData,
  WardImpactProfile
} from '../types';
import { INTERVENTION_EVIDENCE_CATALOG } from '../utils/evidenceMatrix';
import { simulate_intervention_outcomes } from '../utils/optimizationEngine';

interface HeatImpactSimulatorProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
  onSelectWard?: (wardId: string) => void;
}

export const HeatImpactSimulator: React.FC<HeatImpactSimulatorProps> = ({
  city,
  wardProfiles,
  onSelectWard
}) => {
  const [selectedWardId, setSelectedWardId] = useState<string>(
    wardProfiles[0]?.ward.wardId || city.wards[0]?.wardId || ''
  );
  const [forecastPeriod, setForecastPeriod] = useState<'24h' | '48h' | '72h' | '120h'>('72h');

  // Intervention toggles state
  const [interventions, setInterventions] = useState<ActiveInterventionConfig>({
    coolingCentersActive: true,
    shiftWorkHoursActive: true,
    hydrationRestBreaksActive: false,
    targetedAlertsActive: true,
    elderlyWelfareChecksActive: true,
    hospitalPreparednessActive: true,
    mobileCoolingUnitsActive: false,
    coolRoofsSprinklingActive: false,
    fullHapActive: false
  });

  const selectedProfile = useMemo(() => {
    return wardProfiles.find((p) => p.ward.wardId === selectedWardId) || wardProfiles[0];
  }, [wardProfiles, selectedWardId]);

  // Run simulation on active interventions
  const simulation = useMemo(() => {
    return simulate_intervention_outcomes(wardProfiles, interventions, 'Simulation Scenario');
  }, [wardProfiles, interventions]);

  const toggleIntervention = (key: keyof ActiveInterventionConfig) => {
    if (key === 'fullHapActive') {
      const nextVal = !interventions.fullHapActive;
      setInterventions({
        coolingCentersActive: nextVal,
        shiftWorkHoursActive: nextVal,
        hydrationRestBreaksActive: nextVal,
        targetedAlertsActive: nextVal,
        elderlyWelfareChecksActive: nextVal,
        hospitalPreparednessActive: nextVal,
        mobileCoolingUnitsActive: nextVal,
        coolRoofsSprinklingActive: nextVal,
        fullHapActive: nextVal
      });
    } else {
      setInterventions((prev) => ({
        ...prev,
        [key]: !prev[key],
        fullHapActive: false
      }));
    }
  };

  const selectedWardOutcome = useMemo(() => {
    return (
      simulation.wardOutcomes.find((w) => w.wardId === selectedProfile?.ward.wardId) || {
        baselineRisk: Math.round((selectedProfile?.healthImpactRisk || 0.6) * 100),
        mitigatedRisk: Math.round((selectedProfile?.healthImpactRisk || 0.6) * 60),
        coveragePercent: 65
      }
    );
  }, [simulation, selectedProfile]);

  if (!selectedProfile) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading Ward Impact Profiles...
      </div>
    );
  }

  const ward = selectedProfile.ward;
  const thermal = selectedProfile.currentThermal;

  return (
    <div id="heat-impact-simulator-view" className="space-y-6">
      {/* Simulator Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              Primary Decision Engine
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              HEAT IMPACT & INTERVENTION SIMULATOR
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Simulate the next 72–120 hours, identify vulnerable populations, test intervention combinations, and measure expected impact reduction before the heat hits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Ward Selector */}
            <div className="flex flex-col">
              <label htmlFor="ward-select" className="text-[11px] text-slate-400 font-medium mb-1">
                Target Zone / Ward
              </label>
              <select
                id="ward-select"
                value={selectedWardId}
                onChange={(e) => {
                  setSelectedWardId(e.target.value);
                  if (onSelectWard) onSelectWard(e.target.value);
                }}
                className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {wardProfiles.map((p) => (
                  <option key={p.ward.wardId} value={p.ward.wardId}>
                    {p.ward.wardName} (Priority #{p.interventionPriorityRank})
                  </option>
                ))}
              </select>
            </div>

            {/* Forecast Window Selector */}
            <div className="flex flex-col">
              <label className="text-[11px] text-slate-400 font-medium mb-1">
                Forecast Period
              </label>
              <div className="inline-flex rounded-lg border border-slate-700 bg-slate-950 p-1">
                {(['24h', '48h', '72h', '120h'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setForecastPeriod(p)}
                    className={`px-2.5 py-1 text-xs font-mono rounded font-medium transition-all ${
                      forecastPeriod === p
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Window & Urgency Banner */}
      <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Clock className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase font-semibold">
              CRITICAL ACTION WINDOW: {selectedProfile.actionWindowHours} HOURS REMAINING
            </div>
            <div className="text-sm font-bold text-slate-100">
              Peak Thermal Stress (UTCI {thermal.utci}°C) expected in {selectedProfile.actionWindowHours}h. Recommended municipal activation window: <span className="text-amber-300">NOW to T-12h</span>.
            </div>
          </div>
        </div>
        <div className="text-xs bg-slate-900 text-slate-300 px-3.5 py-2 rounded-lg border border-slate-700 font-mono">
          Priority Status: <span className="text-rose-400 font-bold">Rank #{selectedProfile.interventionPriorityRank}</span> of {wardProfiles.length} Wards
        </div>
      </div>

      {/* BEFORE INTERVENTION vs AFTER INTERVENTION (Side-by-Side Comparison) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: BEFORE INTERVENTION (Do Nothing Scenario) */}
        <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <h3 className="text-sm font-bold text-slate-100 tracking-wide">
                BEFORE INTERVENTION (BASELINE / DO NOTHING)
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Unmitigated Heat Crisis
            </span>
          </div>

          {/* Meteorological & Thermal Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 uppercase font-medium">Ambient Peak</div>
              <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">
                {thermal.heatIndex}°C
              </div>
              <div className="text-[9px] text-slate-400">Heat Index</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 uppercase font-medium">UTCI Stress</div>
              <div className="text-lg font-bold text-orange-400 font-mono mt-0.5">
                {thermal.utci}°C
              </div>
              <div className="text-[9px] text-orange-400 truncate">{thermal.category}</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 uppercase font-medium">WBGT Index</div>
              <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                {thermal.wbgt}°C
              </div>
              <div className="text-[9px] text-slate-400">Liljegren ISO 7243</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 uppercase font-medium">HTSS Score</div>
              <div className="text-lg font-bold text-red-400 font-mono mt-0.5">
                {thermal.htss}/100
              </div>
              <div className="text-[9px] text-slate-400">Combined Stress</div>
            </div>
          </div>

          {/* Human Impact Breakdown */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2.5">
            <div className="text-xs font-semibold text-slate-300">Human Population Impact (Real Demographic Calculation)</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Total Population:</span>
                <span className="text-slate-200 font-mono font-semibold">{ward.totalPopulation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Population Density:</span>
                <span className="text-slate-200 font-mono">{ward.populationDensity.toLocaleString()} /km²</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-rose-950/30 border border-rose-900/40">
                <span className="text-rose-300 font-medium">Exposed Population:</span>
                <span className="text-rose-200 font-mono font-bold">
                  {Math.round((ward.totalPopulation * selectedProfile.humanExposureScore) / 100).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-red-950/30 border border-red-900/40">
                <span className="text-red-300 font-medium">High-Vulnerability Pop:</span>
                <span className="text-red-200 font-mono font-bold">
                  {(ward.elderlyPopulation60Plus + ward.outdoorWorkerPopulation).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Outdoor Laborers:</span>
                <span className="text-slate-200 font-mono font-semibold">{ward.outdoorWorkerPopulation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Elderly (60+):</span>
                <span className="text-slate-200 font-mono font-semibold">{ward.elderlyPopulation60Plus.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 5-Day Risk Progression ("What happens if we do nothing?") */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">5-Day Heat Progression (No Action)</span>
              <span className="text-rose-400 font-mono text-[10px]">Cumulative Stress Rising</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {selectedProfile.forecastThermalDaily.map((d, i) => (
                <div
                  key={i}
                  className={`p-2 rounded border text-center ${
                    d.category === 'Extreme Heat Stress'
                      ? 'bg-rose-950/40 border-rose-700/60'
                      : d.category === 'Very Strong Heat Stress'
                      ? 'bg-orange-950/40 border-orange-700/60'
                      : 'bg-amber-950/40 border-amber-700/60'
                  }`}
                >
                  <div className="text-[10px] font-bold text-slate-300 font-mono">{d.day}</div>
                  <div className="text-xs font-bold text-slate-100 font-mono mt-0.5">{d.maxTemp}°C</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">UTCI {d.maxUtci}°</div>
                  <div className="text-[8px] uppercase tracking-tighter mt-1 font-mono text-rose-400">
                    {d.category.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Risk & Hospital Surge Probability */}
          <div className="p-3 bg-red-950/20 border border-red-800/40 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">Modeled Health Impact Risk Index</div>
              <div className="text-[11px] text-slate-400">
                Epidemiological surge probability under unmitigated exposure
              </div>
            </div>
            <div className="text-xl font-bold font-mono text-rose-400">
              {selectedWardOutcome.baselineRisk}%
            </div>
          </div>
        </div>

        {/* RIGHT: AFTER INTERVENTION (Simulated Countermeasures) */}
        <div className="bg-slate-900/90 border border-emerald-900/40 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-100 tracking-wide">
                AFTER INTERVENTION (SIMULATED RESPONSE)
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active Countermeasures
            </span>
          </div>

          {/* Expected Mitigation Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-slate-950/70 border border-emerald-900/30 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 uppercase font-medium">Exposure Reduction</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                -{simulation.overallExposureReductionPercent}%
              </div>
              <div className="text-[9px] text-slate-400">Modeled Thermal Load</div>
            </div>
            <div className="bg-slate-950/70 border border-emerald-900/30 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 uppercase font-medium">Health Risk Reduction</div>
              <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5 flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                -{simulation.overallRiskReductionPercent}%
              </div>
              <div className="text-[9px] text-slate-400">Epidemiological Risk</div>
            </div>
            <div className="bg-slate-950/70 border border-emerald-900/30 rounded-lg p-2.5 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400 uppercase font-medium">Hospital Load Delta</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                {simulation.hospitalizationSurgeBaseline} → {simulation.hospitalizationSurgeMitigated}
              </div>
              <div className="text-[9px] text-slate-400">Projected Surge Cases</div>
            </div>
          </div>

          {/* Mitigated Population Metrics */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2.5">
            <div className="text-xs font-semibold text-slate-300">Remaining Population at Risk</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Remaining Exposed:</span>
                <span className="text-emerald-300 font-mono font-bold">
                  {Math.round(
                    ((ward.totalPopulation * selectedProfile.humanExposureScore) / 100) *
                      (1 - simulation.overallExposureReductionPercent / 100)
                  ).toLocaleString()}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Protected Workers:</span>
                <span className="text-emerald-300 font-mono font-bold">
                  {interventions.shiftWorkHoursActive
                    ? Math.round(ward.outdoorWorkerPopulation * 0.7).toLocaleString()
                    : '0'}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Seniors Checked:</span>
                <span className="text-emerald-300 font-mono font-bold">
                  {interventions.elderlyWelfareChecksActive
                    ? Math.round(ward.elderlyPopulation60Plus * 0.85).toLocaleString()
                    : '0'}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Cooling Center Coverage:</span>
                <span className="text-emerald-300 font-mono font-bold">
                  {interventions.coolingCentersActive ? '1,500 people/day' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Resources Mobilized for Selected Scenario */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="text-xs font-semibold text-slate-300">Municipal Resources Mobilized</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                <div className="text-base font-bold text-slate-100 font-mono">
                  {simulation.resourceUtilization.coolingCentersUsed}
                </div>
                <div className="text-[10px] text-slate-400">Cooling Centers</div>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                <div className="text-base font-bold text-slate-100 font-mono">
                  {simulation.resourceUtilization.mobileUnitsUsed}
                </div>
                <div className="text-[10px] text-slate-400">Mobile Vans</div>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                <div className="text-base font-bold text-slate-100 font-mono">
                  {simulation.resourceUtilization.workerTeamsDeployed}
                </div>
                <div className="text-[10px] text-slate-400">ASHA Teams</div>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                <div className="text-base font-bold text-slate-100 font-mono">
                  {simulation.resourceUtilization.hospitalBedsReserved}
                </div>
                <div className="text-[10px] text-slate-400">Surge Beds</div>
              </div>
            </div>
          </div>

          {/* Post-Mitigation Risk Index */}
          <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">Mitigated Health Risk Index</div>
              <div className="text-[11px] text-slate-400">
                Remaining risk level under active interventions
              </div>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {selectedWardOutcome.mitigatedRisk}%
            </div>
          </div>
        </div>
      </div>

      {/* INTERVENTION CONTROL MATRIX (Interactive What-If Toggles) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" />
              INTERVENTION CONTROL MATRIX (WHAT-IF ENGINE)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Toggle specific interventions below to dynamically recalculate exposed population and expected mitigation.
            </p>
          </div>

          {/* Fast Preset Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="reset-interventions-btn"
              onClick={() => {
                setInterventions({
                  coolingCentersActive: false,
                  shiftWorkHoursActive: false,
                  hydrationRestBreaksActive: false,
                  targetedAlertsActive: false,
                  elderlyWelfareChecksActive: false,
                  hospitalPreparednessActive: false,
                  mobileCoolingUnitsActive: false,
                  coolRoofsSprinklingActive: false,
                  fullHapActive: false
                });
              }}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Clear All (Baseline)
            </button>
            <button
              id="full-hap-preset-btn"
              onClick={() => toggleIntervention('fullHapActive')}
              className={`px-3.5 py-1.5 text-xs rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                interventions.fullHapActive
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              {interventions.fullHapActive ? 'Full HAP Active' : 'Activate Full HAP Protocol'}
            </button>
          </div>
        </div>

        {/* 9 Intervention Toggles Grid with Evidence Popovers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {Object.values(INTERVENTION_EVIDENCE_CATALOG).map((item) => {
            const keyMap: Record<string, keyof ActiveInterventionConfig> = {
              cooling_centers: 'coolingCentersActive',
              shift_work_hours: 'shiftWorkHoursActive',
              hydration_rest_breaks: 'hydrationRestBreaksActive',
              targeted_alerts: 'targetedAlertsActive',
              elderly_welfare_checks: 'elderlyWelfareChecksActive',
              hospital_preparedness: 'hospitalPreparednessActive',
              mobile_cooling_units: 'mobileCoolingUnitsActive',
              cool_roofs_sprinkling: 'coolRoofsSprinklingActive',
              full_heat_action_plan: 'fullHapActive'
            };

            const stateKey = keyMap[item.id];
            const isActive = stateKey ? interventions[stateKey] : false;

            return (
              <div
                key={item.id}
                id={`intervention-card-${item.id}`}
                onClick={() => stateKey && toggleIntervention(stateKey)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none relative flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-950 border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {item.category}
                    </span>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        isActive
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isActive && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-100 mb-1 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px] font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Target:</span>
                    <span className="text-slate-400 truncate max-w-[150px]">{item.targetPopulation.split(',')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Modeled Reduction:</span>
                    <span className="text-emerald-400 font-bold">-{item.expectedHealthRiskReduction}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scientific Evidence & Honesty Disclaimer */}
        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg flex items-start gap-2.5 text-xs text-slate-400">
          <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-slate-300">Scientific Evidence & Honesty Declaration: </span>
            Simulated intervention impacts are calculated using empirical parameters from the Ahmedabad Heat Action Plan evaluation (Knowlton et al.), NIOSH occupational guidelines, and WHO/WMO early warning frameworks. They represent decision-support exposure models, not guaranteed clinical outcomes.
          </div>
        </div>
      </div>
    </div>
  );
};
