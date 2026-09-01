import React from 'react';
import {
  Activity,
  HeartPulse,
  AlertTriangle,
  Building2,
  TrendingUp,
  Droplets,
  ArrowRight
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface AuthorityHealthImpactProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
  onNavigate?: (tab: string) => void;
}

export const AuthorityHealthImpact: React.FC<AuthorityHealthImpactProps> = ({
  city,
  wardProfiles,
  onNavigate
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5" />
              Public Health Surveillance
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Health Impact & Hospital Surge Forecast
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Epidemiological heat morbidity forecasts calibrated for municipal hospital readiness in <strong>{city.name}</strong>.
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-right">
            <div className="text-xs font-bold text-rose-700">Projected ER Surge</div>
            <div className="text-2xl font-black text-rose-600">+48% Influx</div>
          </div>
        </div>
      </div>

      {/* Health Impact Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Heat Stroke & Collapse Risk
          </div>
          <div className="text-3xl font-black text-rose-600">High Risk</div>
          <p className="text-xs text-slate-500">
            Estimated 140–180 acute exertional cases during peak hours without work shifts.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Dehydration & Renal Strain
          </div>
          <div className="text-3xl font-black text-amber-600">Severe</div>
          <p className="text-xs text-slate-500">
            Sweat loss rate exceeds 1.2 L/hr for outdoor manual laborers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Cardiovascular Exacerbation
          </div>
          <div className="text-3xl font-black text-purple-600">Elevated</div>
          <p className="text-xs text-slate-500">
            Senior citizen cardiac stress elevated due to elevated night temperatures (&gt;29°C).
          </p>
        </div>
      </div>

      {/* Recommended Hospital Readiness Directives */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-blue-600" />
          Mandatory Hospital & Health Center Actions
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Establish Dedicated Cooling Wards with Air Conditioning
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Designate at least 10–15 beds at each Urban Health Centre with continuous cooling, ice packs, immersion tanks, and core temperature monitoring.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Pre-Stock IV Fluids (Normal Saline & Ringer's Lactate) and ORS
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Ensure 1,500+ packets of oral rehydration salts and 400+ units of cooled IV fluids are available per ward health kiosk.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                108 Ambulance Heat Priority Routing
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Station emergency ambulances near major construction clusters and open markets during 11:30 AM – 4:30 PM.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
