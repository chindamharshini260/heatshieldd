import React from 'react';
import {
  Activity,
  ShieldCheck,
  AlertOctagon,
  TrendingUp,
  Brain,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Scale
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../types';

interface HealthImpactViewProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const HealthImpactView: React.FC<HealthImpactViewProps> = ({
  city,
  wardProfiles
}) => {
  if (!wardProfiles || wardProfiles.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono">
        Loading Predictive Health Intelligence for {city.name}...
      </div>
    );
  }

  const topWard = wardProfiles[0];

  return (
    <div id="health-impact-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-rose-400 font-mono font-semibold uppercase tracking-wider mb-1">
          <Activity className="w-3.5 h-3.5" />
          Predictive Health Intelligence & Explainable ML
        </div>
        <h2 className="text-xl font-bold text-slate-100">
          HEALTH IMPACT RISK FORECAST & ML EXPLAINABILITY (SHAP)
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Gradient-boosted time-aware epidemiological risk model integrating lagged atmospheric metrics (1d, 2d, 3d, 5d), cumulative heat burden, and demographic vulnerability.
        </p>
      </div>

      {/* Model Honesty & Scientific Integrity Declaration */}
      <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
            STRICT SCIENTIFIC INTEGRITY & HONESTY DECLARATION (RULE 10 & 30)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            HeatShield AI reports <strong>Epidemiological Health Strain Probability & Hospital Surge Indices</strong>. We strictly refuse to output fabricated death counts (e.g. &quot;Mortality will be 27&quot;) because precise point mortality requires continuous municipal vital statistics integration. All predictions are decision-support indices calibrated against published Ahmedabad HAP epidemiological relative risk curves.
          </p>
        </div>
      </div>

      {/* SHAP Feature Attribution (Why did the model predict this risk?) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              MODEL EXPLAINABILITY ENGINE (SHAP FEATURE ATTRIBUTION)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Attribution of contributing environmental and demographic drivers for {topWard.ward.wardName}.
            </p>
          </div>
          <div className="text-xs font-mono bg-purple-950/40 text-purple-300 border border-purple-800/50 px-3 py-1 rounded-lg">
            Model Output: {(topWard.healthImpactRisk * 100).toFixed(0)}% Health Risk Probability
          </div>
        </div>

        <div className="space-y-3">
          {topWard.shapAttribution.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">{item.feature}</span>
                <span className="font-mono text-rose-400 font-bold">
                  +{item.importance}% Contribution
                </span>
              </div>

              {/* Progress bar visual */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-rose-500 h-full rounded-full"
                  style={{ width: `${item.importance * 2.5}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Lagged Features & Time-Aware Validation Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
        <h3 className="text-base font-bold text-slate-100">
          TIME-AWARE LAGGED EPIDEMIOLOGICAL FEATURES
        </h3>
        <p className="text-xs text-slate-400">
          Physiological heat strain exhibits cumulative lag: today&apos;s hospitalizations reflect the thermal stress accumulated over the preceding 24h to 120h.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Lag 0d (Current Day)</div>
            <div className="text-base font-bold text-slate-100 font-mono mt-0.5">
              UTCI {topWard.currentThermal.utci}°C
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Acute heat exhaustion & syncope</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Lag 1d (24h Burden)</div>
            <div className="text-base font-bold text-orange-400 font-mono mt-0.5">
              {topWard.currentThermal.cumulativeHeatBurden24h} °C·h
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Initial electrolyte depletion</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Lag 3d (72h Burden)</div>
            <div className="text-base font-bold text-rose-400 font-mono mt-0.5">
              {topWard.currentThermal.cumulativeHeatBurden72h} °C·h
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Cardiovascular decompensation peak</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Lag 5d (120h Persistence)</div>
            <div className="text-base font-bold text-purple-400 font-mono mt-0.5">
              {topWard.currentThermal.cumulativeHeatBurden120h} °C·h
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Severe renal & multi-organ strain</div>
          </div>
        </div>
      </div>
    </div>
  );
};
