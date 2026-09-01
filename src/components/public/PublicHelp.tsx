import React from 'react';
import {
  Phone,
  AlertOctagon,
  Heart,
  Droplets,
  Building,
  ShieldAlert,
  HelpCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { CityData } from '../../types';

interface PublicHelpProps {
  city: CityData;
}

export const PublicHelp: React.FC<PublicHelpProps> = ({ city }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          Emergency Support & FAQs
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">
          Emergency Heat Assistance for {city.name}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Instant emergency contacts, life-saving first aid steps, and local cooling centers.
        </p>
      </div>

      {/* Emergency Helpline Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-rose-600 text-white rounded-2xl p-6 space-y-3 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-xs uppercase font-bold tracking-wider text-rose-200">
              National Emergency Ambulance
            </div>
            <div className="text-4xl font-black">108</div>
            <p className="text-xs text-rose-100 leading-snug">
              Toll-free 24/7 dispatch for heat stroke, fainting, seizures, or collapse.
            </p>
          </div>
          <a
            href="tel:108"
            className="w-full py-2.5 bg-white text-rose-700 font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1.5 shadow-sm hover:bg-rose-50"
          >
            <Phone className="w-3.5 h-3.5" /> Call 108 Now
          </a>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-3 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Disaster Management Helpline
            </div>
            <div className="text-4xl font-black">1077</div>
            <p className="text-xs text-slate-300 leading-snug">
              District Control Room for water shortage or cooling shelter inquiries.
            </p>
          </div>
          <a
            href="tel:1077"
            className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1.5 border border-slate-700 hover:bg-slate-700"
          >
            <Phone className="w-3.5 h-3.5" /> Call 1077
          </a>
        </div>

        <div className="bg-blue-700 text-white rounded-2xl p-6 space-y-3 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-xs uppercase font-bold tracking-wider text-blue-200">
              Senior Citizen Helpline
            </div>
            <div className="text-4xl font-black">14567</div>
            <p className="text-xs text-blue-100 leading-snug">
              Elder Line for medical check-in and vulnerable senior citizen assistance.
            </p>
          </div>
          <a
            href="tel:14567"
            className="w-full py-2.5 bg-white text-blue-800 font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1.5 shadow-sm hover:bg-blue-50"
          >
            <Phone className="w-3.5 h-3.5" /> Call 14567
          </a>
        </div>
      </div>

      {/* Immediate First Aid Guide for Heat Collapse */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          First Aid: What to do if someone collapses from heat
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-xs text-slate-900">Move to Shade</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Immediately carry the person out of direct sun into a shaded, well-ventilated room or tree shade.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-xs text-slate-900">Cool Rapidly</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Pour cool water over their body. Place wet towels or ice packs on neck, armpits, and groin.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-xs text-slate-900">Elevate Feet</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Lay them flat and raise their feet slightly to improve blood circulation back to the heart and brain.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="w-7 h-7 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center">
              4
            </div>
            <h3 className="font-bold text-xs text-slate-900">Call Ambulance</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Call <strong>108</strong> immediately. Do not force drinks if the person is unconscious or vomiting.
            </p>
          </div>
        </div>
      </div>

      {/* Municipal Cooling Centers and Kiosks */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          Municipal Cooling Shelters in {city.name}
        </h2>
        <p className="text-xs text-slate-500">
          Open daily from 11:00 AM to 5:30 PM with air coolers, ORS packets, and clean drinking water.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              Ward Community Bhavan & Urban Health Centre (East Zone)
            </div>
            <div className="text-[11px] text-slate-500">Bapunagar Main Road, Near Bus Terminus</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">● Open Today • Free Entry</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              Municipal Corporation Rain Basera & Relief Center (Central)
            </div>
            <div className="text-[11px] text-slate-500">Opposite Railway Station Plaza</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">● Open Today • Free Water & Shade</div>
          </div>
        </div>
      </div>
    </div>
  );
};
