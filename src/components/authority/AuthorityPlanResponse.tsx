import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Shield,
  Users,
  Building,
  CheckCircle2,
  TrendingDown,
  Info,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CityData, WardImpactProfile, ActiveInterventionConfig } from '../../types';
import { simulate_intervention_outcomes } from '../../utils/optimizationEngine';

interface AuthorityPlanResponseProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
  selectedWardId?: string;
  onSelectWard?: (wardId: string) => void;
  onNavigate?: (tab: string) => void;
}

export const AuthorityPlanResponse: React.FC<AuthorityPlanResponseProps> = ({
  city,
  wardProfiles,
  selectedWardId,
  onSelectWard,
  onNavigate
}) => {
  const [activeWardId, setActiveWardId] = useState<string>(
    selectedWardId || wardProfiles[0]?.ward.wardId || ''
  );

  // Intervention toggles state
  const [interventions, setInterventions] = useState<ActiveInterventionConfig>({
    coolingCentersActive: true,
    shiftWorkHoursActive: true,
    hydrationRestBreaksActive: true,
    targetedAlertsActive: true,
    elderlyWelfareChecksActive: false,
    hospitalPreparednessActive: true,
    mobileCoolingUnitsActive: false,
    coolRoofsSprinklingActive: false,
    fullHapActive: false
  });

  const selectedProfile = useMemo(() => {
    return wardProfiles.find((p) => p.ward.wardId === activeWardId) || wardProfiles[0];
  }, [wardProfiles, activeWardId]);

  // Run simulation based on active toggles
  const simulationResult = useMemo(() => {
    if (!selectedProfile) return null;
    return simulate_intervention_outcomes(selectedProfile, interventions);
  }, [selectedProfile, interventions]);

  const toggleIntervention = (key: keyof ActiveInterventionConfig) => {
    setInterventions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const setPreset = (preset: 'minimal' | 'recommended' | 'full') => {
    if (preset === 'minimal') {
      setInterventions({
        coolingCentersActive: false,
        shiftWorkHoursActive: true,
        hydrationRestBreaksActive: true,
        targetedAlertsActive: true,
        elderlyWelfareChecksActive: false,
        hospitalPreparednessActive: false,
        mobileCoolingUnitsActive: false,
        coolRoofsSprinklingActive: false,
        fullHapActive: false
      });
    } else if (preset === 'recommended') {
      setInterventions({
        coolingCentersActive: true,
        shiftWorkHoursActive: true,
        hydrationRestBreaksActive: true,
        targetedAlertsActive: true,
        elderlyWelfareChecksActive: true,
        hospitalPreparednessActive: true,
        mobileCoolingUnitsActive: false,
        coolRoofsSprinklingActive: false,
        fullHapActive: false
      });
    } else {
      setInterventions({
        coolingCentersActive: true,
        shiftWorkHoursActive: true,
        hydrationRestBreaksActive: true,
        targetedAlertsActive: true,
        elderlyWelfareChecksActive: true,
        hospitalPreparednessActive: true,
        mobileCoolingUnitsActive: true,
        coolRoofsSprinklingActive: true,
        fullHapActive: true
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <Sliders className="w-3.5 h-3.5" />
              Action Simulator
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Plan Your Response
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Test and simulate different municipal actions before deploying staff and budget in <strong>{city.name}</strong>.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setPreset('minimal')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white transition-all cursor-pointer"
            >
              Minimal
            </button>
            <button
              onClick={() => setPreset('recommended')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-blue-600 shadow-sm cursor-pointer"
            >
              Recommended Plan
            </button>
            <button
              onClick={() => setPreset('full')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white transition-all cursor-pointer"
            >
              Full Response Plan
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Target Area & Intervention Toggles */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Area Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Target Area for Action Simulation
            </label>
            <select
              value={activeWardId}
              onChange={(e) => {
                setActiveWardId(e.target.value);
                if (onSelectWard) onSelectWard(e.target.value);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {wardProfiles.map((p) => (
                <option key={p.ward.wardId} value={p.ward.wardId}>
                  {p.ward.wardName} (Peak {p.currentThermal?.heatIndex || 40}°C)
                </option>
              ))}
            </select>
          </div>

          {/* Intervention Checkbox List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Select Response Actions to Deploy
            </h2>

            <div className="space-y-3">
              {/* Option 1 */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={interventions.coolingCentersActive}
                  onChange={() => toggleIntervention('coolingCentersActive')}
                  className="w-4 h-4 rounded text-blue-600 mt-1 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-slate-900">
                    Open Public Cooling Centers & Hydration Kiosks
                  </div>
                  <div className="text-xs text-slate-500">
                    Equip community halls and temples with evaporative coolers, free water, and ORS packets.
                  </div>
                </div>
              </label>

              {/* Option 2 */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={interventions.shiftWorkHoursActive}
                  onChange={() => toggleIntervention('shiftWorkHoursActive')}
                  className="w-4 h-4 rounded text-blue-600 mt-1 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-slate-900">
                    Mandate Outdoor Work Hour Rescheduling
                  </div>
                  <div className="text-xs text-slate-500">
                    Enforce work stoppage for construction and street vendors between 11:30 AM and 4:30 PM.
                  </div>
                </div>
              </label>

              {/* Option 3 */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={interventions.elderlyWelfareChecksActive}
                  onChange={() => toggleIntervention('elderlyWelfareChecksActive')}
                  className="w-4 h-4 rounded text-blue-600 mt-1 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-slate-900">
                    Deploy ASHA & Community Health Workers for Elderly Checks
                  </div>
                  <div className="text-xs text-slate-500">
                    Door-to-door check-ins on senior citizens living alone or with chronic cardiovascular issues.
                  </div>
                </div>
              </label>

              {/* Option 4 */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={interventions.hospitalPreparednessActive}
                  onChange={() => toggleIntervention('hospitalPreparednessActive')}
                  className="w-4 h-4 rounded text-blue-600 mt-1 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-slate-900">
                    Prepare Hospital Emergency Heat Triage
                  </div>
                  <div className="text-xs text-slate-500">
                    Stock IV fluids, cold sponge packs, and reserve dedicated heat-stroke beds at Urban Health Centres.
                  </div>
                </div>
              </label>

              {/* Option 5 */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={interventions.mobileCoolingUnitsActive}
                  onChange={() => toggleIntervention('mobileCoolingUnitsActive')}
                  className="w-4 h-4 rounded text-blue-600 mt-1 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-slate-900">
                    Deploy Mobile Mist Sprinklers & Water Tankers
                  </div>
                  <div className="text-xs text-slate-500">
                    Sprinkle mist along dense market corridors and bus stations to suppress ambient surface heat.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Simulated Impact Results */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Expected Outcomes
            </h3>

            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-1">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  People Protected
                </div>
                <div className="text-3xl font-black text-emerald-900">
                  {simulationResult?.peopleProtectedCount.toLocaleString() || '18,400'}
                </div>
                <div className="text-xs text-emerald-700">
                  Estimated vulnerable citizens safely shielded from peak heat.
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-1">
                <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  Hospital Emergency Surge Reduction
                </div>
                <div className="text-3xl font-black text-blue-900">
                  {Math.round((simulationResult?.riskReductionRatio || 0.42) * 100)}%
                </div>
                <div className="text-xs text-blue-700">
                  Estimated reduction in heat exhaustion and dehydration emergency visits.
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Post-Intervention Heat Stress
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {simulationResult?.mitigatedUtci ? `${simulationResult.mitigatedUtci}°C` : '36.5°C'}
                </div>
                <div className="text-xs text-slate-500">
                  Effective reduction from base peak heat load.
                </div>
              </div>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('compare')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Compare With Other Plans</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
