import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Building,
  HardHat,
  Hospital,
  Droplets,
  Truck,
  GraduationCap,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../types';

interface HeatActionPlanViewProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const HeatActionPlanView: React.FC<HeatActionPlanViewProps> = ({
  city,
  wardProfiles
}) => {
  if (!wardProfiles || wardProfiles.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono">
        Loading Heat Action Plan protocols for {city.name}...
      </div>
    );
  }

  const topWard = wardProfiles[0];
  const [loadingAi, setLoadingAi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [planText, setPlanText] = useState<string>(`MUNICIPAL HEAT ACTION PLAN (HAP) DIRECTIVE
NATIONAL DISASTER MANAGEMENT AUTHORITY (NDMA) & ${city.name.toUpperCase()} MUNICIPAL CORPORATION
STATUS: RED ALERT ACTIVATION (CRITICAL HEAT EMERGENCY)

1. EXECUTIVE COMMAND DIRECTIVE & TIMELINE
- Critical Action Window: Peak thermal stress (UTCI ${topWard?.currentThermal?.utci || 44}°C) expected in ${topWard?.actionWindowHours || 3} hours.
- High-Priority Intervention Zones: ${wardProfiles.slice(0, 3).map((p) => p.ward?.wardName).filter(Boolean).join(', ')}.
- Immediate Task Force Mobilization: Deploy Municipal Emergency Operations Center (EOC) on 24/7 activation.

2. OCCUPATIONAL & LABOUR MANDATES
- Section 144 / Labour Code Enforcement: Mandatory cessation of all outdoor construction, road laying, and brick kiln labor between 11:30 AM and 16:30 PM.
- Hydration & Shaded Rest Stations: Employers must provide 5L potable water + ORS per worker with 15-minute shaded breaks every hour.
- Violation Penalties: Immediate site sealing and ₹25,000 fine for non-compliant contractors.

3. CLINICAL & HOSPITAL SURGE PROTOCOL
- Civil & District Hospitals: Pre-chill 150 bags of 0.9% IV normal saline to 4°C.
- Cold Water Immersion Tubs: Activate 12 rapid conductive cooling tubs in emergency triage wards.
- ASHA Worker Mobilization: 45 frontline health teams dispatched for active door-to-door welfare verification of elderly residents with chronic cardiovascular history.

4. MUNICIPAL WATER & CORRIDOR COOLING
- Water Supply Department: Deploy 14 mobile misting water tankers along key arterial transit hubs and slum corridors.
- Public Cooling Shelters: Keep all municipal library halls and community centers air-conditioned with free drinking water access from 09:00 to 19:00.`);

  const handleGenerateAiPlan = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/generate-action-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName: city.name,
          peakTemp: topWard.currentThermal.heatIndex,
          maxUtci: topWard.currentThermal.utci,
          topWards: wardProfiles.slice(0, 3).map((p) => p.ward.wardName),
          actionWindowHours: topWard.actionWindowHours
        })
      });
      const data = await res.json();
      if (data.plan) {
        setPlanText(data.plan);
      }
    } catch (err) {
      console.error('Failed to generate AI action plan', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(planText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="heat-action-plan-view" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-mono font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" />
            Standard Operating Procedures (SOP)
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            MUNICIPAL HEAT ACTION PLAN & INTER-AGENCY PROTOCOLS
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Departmental operational mandates aligned with the Ahmedabad Heat Action Plan (HAP) and National Disaster Management Authority (NDMA) national guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAiPlan}
            disabled={loadingAi}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {loadingAi ? 'Synthesizing Official SOP...' : 'AI Synthesize Custom SOP'}
          </button>
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied SOP' : 'Copy Text'}
          </button>
        </div>
      </div>

      {/* Alert Trigger Level Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 space-y-1.5">
          <div className="text-xs font-bold font-mono text-amber-400 uppercase">
            YELLOW WATCH (40.0°C – 42.9°C)
          </div>
          <div className="text-sm font-semibold text-slate-100">Advisory Alert</div>
          <p className="text-xs text-slate-400">
            Issue public media advisories. Instruct hospitals to stock ORS packets and monitor daytime labor conditions.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-orange-500/40 bg-orange-950/20 space-y-1.5">
          <div className="text-xs font-bold font-mono text-orange-400 uppercase">
            ORANGE ALERT (43.0°C – 44.9°C)
          </div>
          <div className="text-sm font-semibold text-slate-100">High Risk Warning</div>
          <p className="text-xs text-slate-400">
            Open municipal cooling shelters. Shift school timings to morning-only. Mobilize ASHA teams in slum wards.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/50 bg-rose-950/30 space-y-1.5 ring-1 ring-rose-500/40">
          <div className="text-xs font-bold font-mono text-rose-400 uppercase">
            RED ALERT (≥ 45.0°C or UTCI ≥ 46.0°C)
          </div>
          <div className="text-sm font-semibold text-slate-100">Critical Heat Emergency</div>
          <p className="text-xs text-slate-300">
            Enforce mandatory outdoor work stoppage (11:30-16:30). Deploy mobile mist tankers. Activate emergency cold saline triage beds.
          </p>
        </div>
      </div>

      {/* Official SOP Directives Output */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            OFFICIAL OPERATIONAL DIRECTIVE
          </h3>
          <span className="text-xs font-mono text-rose-400 font-bold">
            Executive Order - NDMA / Municipal Health Protocol
          </span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
          {planText}
        </div>
      </div>
    </div>
  );
};
