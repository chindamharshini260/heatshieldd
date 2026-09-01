/**
 * HeatShield AI - Page 16: Emergency Help
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C) with authoritative Red Emergency Accents
 * 
 * Features:
 * 1. Title: "Emergency Heat First Aid"
 * 2. Critical Red Banner: "HEAT STROKE IS A LIFE-THREATENING EMERGENCY"
 * 3. One-Tap Emergency Hotline Cards (108 Ambulance, 112 National, 1077 Disaster Management)
 * 4. Step-by-Step Rapid First Aid Protocol (5 actionable steps)
 * 5. Direct Navigation to Nearby Hospitals
 * 6. "WHAT NOT TO DO" Critical Safety Warnings
 */

import React from 'react';
import {
  PhoneCall,
  AlertOctagon,
  ShieldAlert,
  Hospital,
  Droplets,
  Wind,
  Home,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Navigation,
} from 'lucide-react';

interface EmergencyHelpViewProps {
  onNavigateToNearby?: () => void;
}

export const EmergencyHelpView: React.FC<EmergencyHelpViewProps> = ({
  onNavigateToNearby,
}) => {
  const hotlines = [
    {
      number: '108',
      name: 'Emergency Medical & Ambulance',
      desc: 'Immediate dispatch of paramedic ambulance with onboard life-support.',
      badge: 'Priority 1',
    },
    {
      number: '112',
      name: 'All-India National Emergency',
      desc: 'Unified emergency response support system (Police, Fire, Medical).',
      badge: '24/7 Unified',
    },
    {
      number: '1077',
      name: 'Disaster Management Helpline',
      desc: 'District heat disaster control room and cooling shelter coordination.',
      badge: 'Disaster Cell',
    },
  ];

  const firstAidSteps = [
    {
      step: 1,
      title: 'Move to Shade or Air-Conditioning Immediately',
      desc: 'Relocate the individual out of direct sunlight and into a cool, air-conditioned vehicle or shaded well-ventilated room.',
      icon: Home,
    },
    {
      step: 2,
      title: 'Rapid Body Cooling with Wet Towels & Ice',
      desc: 'Apply ice packs or cool, damp cloths to key major blood vessel areas: the neck, armpits, and groin.',
      icon: Droplets,
    },
    {
      step: 3,
      title: 'Elevate Legs 12 Inches (Shock Position)',
      desc: 'Lay the person flat on their back and elevate feet slightly to improve venous blood return to the brain and heart.',
      icon: ShieldAlert,
    },
    {
      step: 4,
      title: 'Fan Continuously & Loosen Clothing',
      desc: 'Remove tight outer layers of clothing and fan the skin vigorously while spraying cool water mist to facilitate evaporative cooling.',
      icon: Wind,
    },
    {
      step: 5,
      title: 'Hydrate Only If Fully Conscious',
      desc: 'Offer small sips of cool water or electrolyte fluid only if the person is alert and swallows safely. NEVER administer liquids to an unconscious or vomiting person.',
      icon: AlertOctagon,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight">
            Emergency Heat Help
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Immediate response protocols and one-tap emergency medical dispatch
          </p>
        </div>
      </div>

      {/* CRITICAL TOP BANNER */}
      <div className="bg-[#FEF2F2] rounded-2xl border border-rose-300 p-6 shadow-md shadow-rose-500/10 flex flex-col sm:flex-row items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 block">
            Immediate Life-Threatening Triage
          </span>
          <h2 className="text-xl font-black text-rose-950">
            HEAT STROKE IS A MEDICAL EMERGENCY
          </h2>
          <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
            If the victim has high body temperature (&gt;39.5°C), <strong>confusion, fainting, seizures, or hot dry skin</strong>, dial emergency hotlines immediately and begin aggressive cooling steps while waiting for paramedics.
          </p>
        </div>
      </div>

      {/* ONE-TAP EMERGENCY HOTLINES */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#17233C]">One-Tap Emergency Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hotlines.map((h) => (
            <div
              key={h.number}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-rose-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-rose-600">{h.number}</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700">
                    {h.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#17233C]">{h.name}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{h.desc}</p>
              </div>

              <a
                href={`tel:${h.number}`}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-500/20"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {h.number} Now</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* STEP-BY-STEP FIRST AID PROTOCOL */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-base font-bold text-[#17233C]">Step-by-Step Heat First Aid Protocol</h2>
            <p className="text-xs text-[#64748B]">Immediate tactical actions while awaiting professional medical arrival</p>
          </div>

          {onNavigateToNearby && (
            <button
              onClick={onNavigateToNearby}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-all shadow-xs"
            >
              <Hospital className="w-3.5 h-3.5" />
              <span>Locate Nearest Hospitals</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {firstAidSteps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 font-black text-sm shadow-xs">
                  {s.step}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#17233C]">{s.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WHAT NOT TO DO CRITICAL SAFETY WARNINGS */}
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-rose-600" />
          <h3 className="font-bold text-base text-[#17233C]">Critical Mistakes: What NOT To Do</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-xs space-y-1">
            <span className="font-bold text-rose-900 block">DO NOT Give Fluids to Unconscious Person</span>
            <p className="text-rose-800 text-[11px]">
              Liquid can enter the airway and lungs, causing acute choking and asphyxiation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-xs space-y-1">
            <span className="font-bold text-rose-900 block">DO NOT Plunge into Freezing Ice Baths</span>
            <p className="text-rose-800 text-[11px]">
              Extreme ice water causes intense shivering, which paradoxically raises core internal metabolic heat.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-xs space-y-1">
            <span className="font-bold text-rose-900 block">DO NOT Administer Fever Medications</span>
            <p className="text-rose-800 text-[11px]">
              Aspirin and paracetamol do not treat environmental heat stroke and can strain damaged liver and kidneys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
