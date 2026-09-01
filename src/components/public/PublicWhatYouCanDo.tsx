import React from 'react';
import {
  CheckCircle2,
  Droplets,
  Home,
  Sun,
  AlertOctagon,
  ShieldCheck,
  PhoneCall,
  HeartPulse
} from 'lucide-react';
import { CityData } from '../../types';

interface PublicWhatYouCanDoProps {
  city: CityData;
}

export const PublicWhatYouCanDo: React.FC<PublicWhatYouCanDoProps> = ({ city }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Practical Public Guide
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">
          What You Can Do to Stay Safe in the Heat
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Simple daily actions to protect yourself, your family, and your neighbors in <strong>{city.name}</strong>.
        </p>
      </div>

      {/* 4 Pillars of Heat Safety */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pillar 1: Drink Right */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">1. Drink Water Frequently</h3>
              <p className="text-xs text-slate-500">Do not wait until you feel thirsty</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>
              <span>Drink 8 to 10 glasses of water per day. Drink more if sweating heavily.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>
              <span>Mix ORS packets, lemon water with a pinch of salt, or buttermilk (chaas) to replace lost electrolytes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
              <span>Avoid alcohol, strong coffee, or heavily sugary sodas, which dehydrate the body faster.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Keep Home Cool */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">2. Keep Your Home Cool</h3>
              <p className="text-xs text-slate-500">Easy ways to reduce indoor heat without AC</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5"></span>
              <span>Close curtains, blinds, and shutters on sun-facing windows during the day.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5"></span>
              <span>Hang damp sheets or khus mats near windows to cool the incoming breeze.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5"></span>
              <span>Open opposite windows at night to let trapped hot air escape (cross-ventilation).</span>
            </li>
          </ul>
        </div>

        {/* Pillar 3: Outdoor Protection */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">3. Protect Yourself Outdoors</h3>
              <p className="text-xs text-slate-500">When travel or outdoor work is necessary</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
              <span>Wear loose, light-colored cotton clothing that lets sweat evaporate.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
              <span>Use an umbrella, wide-brim hat, or cotton cloth (gamcha) to shade your head and neck.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
              <span>Take regular 10-minute rest breaks under shade or tree canopies.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 4: Care for Community */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">4. Check on Others</h3>
              <p className="text-xs text-slate-500">Look out for vulnerable people around you</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5"></span>
              <span>Visit or call elderly relatives and neighbors at least twice daily.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5"></span>
              <span>Offer clean drinking water to delivery agents, sanitation workers, and security guards.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5"></span>
              <span>Place shallow water pots on balconies or street corners for birds and animals.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Heat Exhaustion vs Heat Stroke Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-600" />
            Know the Difference: Heat Exhaustion vs Heat Stroke
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Recognizing early symptoms saves lives. Heat stroke is a medical emergency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Heat Exhaustion */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-950 text-sm">🟡 Heat Exhaustion (Warning)</h3>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                Needs Immediate Cooling
              </span>
            </div>
            <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside">
              <li>Heavy sweating and pale, cool skin</li>
              <li>Dizziness, lightheadedness, or weakness</li>
              <li>Nausea, vomiting, or muscle cramps</li>
              <li>Fast, weak pulse</li>
            </ul>
            <div className="bg-white/80 p-3 rounded-lg border border-amber-200 text-xs text-amber-950">
              <strong>What to do:</strong> Move to a cool shaded spot, loosen tight clothing, sip cool water or ORS, and apply wet cloths. If no improvement in 30 mins, call 108.
            </div>
          </div>

          {/* Heat Stroke */}
          <div className="bg-red-50/60 border border-red-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-red-950 text-sm">🔴 Heat Stroke (EMERGENCY)</h3>
              <span className="text-[11px] font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                Call 108 Immediately
              </span>
            </div>
            <ul className="text-xs text-red-900 space-y-1.5 list-disc list-inside">
              <li>Very high body temperature (above 39.5°C / 103°F)</li>
              <li>Hot, red, dry skin (NO sweating)</li>
              <li>Confusion, slurred speech, or loss of consciousness</li>
              <li>Seizures or rapid, strong pulse</li>
            </ul>
            <div className="bg-white/80 p-3 rounded-lg border border-red-200 text-xs text-red-950">
              <strong>Emergency Action:</strong> <strong>Call 108 ambulance immediately.</strong> While waiting, move person to shade and douse entire body with cold water or ice packs under armpits and neck.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
