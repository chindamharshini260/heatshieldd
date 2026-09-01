import React from 'react';
import {
  ShieldAlert,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Building,
  Activity,
  Flame,
  AlertTriangle,
  Send
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface AuthorityOverviewProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
  onNavigate: (tab: string) => void;
  onSelectWard: (wardId: string) => void;
}

export const AuthorityOverview: React.FC<AuthorityOverviewProps> = ({
  city,
  wardProfiles,
  onNavigate,
  onSelectWard
}) => {
  if (!wardProfiles || wardProfiles.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        Loading Authority Executive Overview for {city.name}...
      </div>
    );
  }

  const topWard = wardProfiles[0];
  const maxTemp = Math.max(...wardProfiles.map((p) => p.currentThermal?.heatIndex || 40));
  const totalHighRisk = wardProfiles.reduce(
    (acc, p) => acc + (p.ward?.elderlyPopulation60Plus || 0) + (p.ward?.outdoorWorkerPopulation || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              Municipal Command & Dispatch
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Where does the city need help first?
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Targeted priority interventions for <strong>{city.name} Municipal Corporation</strong> based on real-time heat load and vulnerable population density.
            </p>
          </div>

          {/* Time to Act Pill */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 text-center sm:text-right min-w-[200px]">
            <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center justify-center sm:justify-end gap-1">
              <Clock className="w-3.5 h-3.5" /> Time to Act
            </div>
            <div className="text-2xl font-black mt-0.5">3 Hours Left</div>
            <div className="text-[11px] text-slate-300">Before peak afternoon surge (2 PM)</div>
          </div>
        </div>
      </div>

      {/* Key Executive Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Peak Heat Forecast</div>
          <div className="text-3xl font-black text-rose-600">{maxTemp}°C</div>
          <div className="text-xs text-slate-500">Very High / Red Alert Stage</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">People in Need of Care</div>
          <div className="text-3xl font-black text-slate-900">{totalHighRisk.toLocaleString()}</div>
          <div className="text-xs text-slate-500">Seniors (60+) & Outdoor Workers</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">High Risk Wards</div>
          <div className="text-3xl font-black text-amber-600">
            {wardProfiles.filter(p => (p.currentThermal?.heatIndex || 0) >= 40).length} of {wardProfiles.length}
          </div>
          <div className="text-xs text-slate-500">Require immediate cooling deployment</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Emergency Centers</div>
          <div className="text-3xl font-black text-emerald-600">
            {wardProfiles.reduce((acc, p) => acc + (p.ward.existingCoolingCenters || 0), 0)} Active
          </div>
          <div className="text-xs text-slate-500">Shelters providing water & air cooling</div>
        </div>
      </div>

      {/* Areas Needing Immediate Attention */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Areas Needing Immediate Attention Today
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by combined thermal burden and concentration of vulnerable residents.
            </p>
          </div>

          <button
            onClick={() => onNavigate('plan')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <span>Plan Your Response</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {wardProfiles.slice(0, 4).map((p, idx) => {
            const vulnerableCount = (p.ward.elderlyPopulation60Plus + p.ward.outdoorWorkerPopulation).toLocaleString();
            return (
              <div
                key={p.ward.wardId}
                className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">
                      {p.ward.wardName}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      Peak {p.currentThermal?.heatIndex || 42}°C
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                    <span><strong>Reason:</strong> Very High Heat & Concrete Trap</span>
                    <span>•</span>
                    <span><strong>People Affected:</strong> {vulnerableCount} residents</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                      Recommended: Open Cooling Center & Distribute ORS
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSelectWard(p.ward.wardId);
                      onNavigate('plan');
                    }}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer"
                    title="Simulate interventions for this ward"
                  >
                    Act →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fast Action Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('plan')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all text-left space-y-2 group cursor-pointer"
        >
          <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
            Plan Your Response
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-500">
            Test and simulate different municipal interventions before committing staff.
          </p>
        </button>

        <button
          onClick={() => onNavigate('compare')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all text-left space-y-2 group cursor-pointer"
        >
          <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
            Compare Plans
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-500">
            Compare "No Action" vs "Recommended Response" vs "Full HAP".
          </p>
        </button>

        <button
          onClick={() => onNavigate('science')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all text-left space-y-2 group cursor-pointer"
        >
          <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
            Data & Science
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-500">
            Inspect raw meteorological models, UTCI/WBGT algorithms, and evidence sources.
          </p>
        </button>
      </div>
    </div>
  );
};
