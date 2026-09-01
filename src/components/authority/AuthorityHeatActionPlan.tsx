import React, { useState } from 'react';
import {
  FileText,
  Building2,
  Users,
  Droplets,
  Heart,
  HardHat,
  CheckCircle2,
  Shield,
  Clock
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface AuthorityHeatActionPlanProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const AuthorityHeatActionPlan: React.FC<AuthorityHeatActionPlanProps> = ({
  city,
  wardProfiles
}) => {
  const [activeDept, setActiveDept] = useState<'health' | 'labor' | 'water' | 'transport'>('health');

  const departments = [
    {
      id: 'health',
      name: 'Health & Family Welfare Dept',
      icon: <Heart className="w-4 h-4 text-rose-600" />,
      sops: [
        'Designate heat stroke triage beds in all primary health centres and district hospitals.',
        'Equip all ambulances with ice packs, cold IV fluids, and oral rehydration salts.',
        'Instruct ASHA and ANM workers to complete daily home visits for vulnerable elderly citizens.',
        'Track and log all daily heat-related morbidity cases in the municipal health surveillance registry.'
      ]
    },
    {
      id: 'labor',
      name: 'Labour & Employment Dept',
      icon: <HardHat className="w-4 h-4 text-amber-600" />,
      sops: [
        'Enforce mandatory non-working hours between 11:30 AM and 4:30 PM for all outdoor construction projects.',
        'Inspect construction sites to verify provision of shaded rest sheds and continuous cold drinking water.',
        'Coordinate with street vendor associations to shift market operational hours to early morning and post-sunset.',
        'Protect wages during mandatory heat pauses under the state disaster relief provisions.'
      ]
    },
    {
      id: 'water',
      name: 'Water Supply & Municipal Works',
      icon: <Droplets className="w-4 h-4 text-blue-600" />,
      sops: [
        'Deploy dedicated water tankers along high-footfall intersections, bus stands, and slum clusters.',
        'Set up and refill free municipal drinking water booths (Piyavs) across high-heat wards.',
        'Operate mobile misting sprinkler trucks on dense road corridors during peak afternoon heat.',
        'Ensure 24/7 power backup for water pumping stations in vulnerable wards.'
      ]
    },
    {
      id: 'transport',
      name: 'Transport & Police Department',
      icon: <Building2 className="w-4 h-4 text-slate-600" />,
      sops: [
        'Provide shade umbrellas, sunglasses, and cool drinking water to traffic police personnel on duty.',
        'Broadcast real-time heat advisories across electronic bus route display boards.',
        'Keep air-conditioned waiting rooms at central bus stations open to the general public.',
        'Maintain priority green corridors for emergency 108 ambulances responding to heat emergencies.'
      ]
    }
  ];

  const currentDept = departments.find((d) => d.id === activeDept) || departments[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <FileText className="w-3.5 h-3.5" />
              Institutional Protocol
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Heat Action Plan (HAP) Standard Operating Procedures
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Inter-agency departmental responsibilities and mandatory protocols for <strong>{city.name}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Department Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setActiveDept(dept.id as any)}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
              activeDept === dept.id
                ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="p-2 rounded-lg bg-slate-50 w-fit">{dept.icon}</div>
            <div className="font-bold text-xs text-slate-900 leading-snug">{dept.name}</div>
          </button>
        ))}
      </div>

      {/* Selected Department SOPs Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            {currentDept.icon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{currentDept.name}</h2>
            <p className="text-xs text-slate-500">Official Municipal Heatwave Protocol Guidelines</p>
          </div>
        </div>

        <div className="space-y-3">
          {currentDept.sops.map((sop, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {sop}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
