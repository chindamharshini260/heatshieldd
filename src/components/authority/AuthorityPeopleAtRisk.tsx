import React from 'react';
import {
  Users,
  HardHat,
  Heart,
  Baby,
  Home,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface AuthorityPeopleAtRiskProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
  onNavigate?: (tab: string) => void;
}

export const AuthorityPeopleAtRisk: React.FC<AuthorityPeopleAtRiskProps> = ({
  city,
  wardProfiles,
  onNavigate
}) => {
  const totalPop = wardProfiles.reduce((acc, p) => acc + (p.ward?.totalPopulation || 0), 0);
  const totalElderly = wardProfiles.reduce((acc, p) => acc + (p.ward?.elderlyPopulation60Plus || 0), 0);
  const totalWorkers = wardProfiles.reduce((acc, p) => acc + (p.ward?.outdoorWorkerPopulation || 0), 0);
  const totalSlum = wardProfiles.reduce((acc, p) => acc + (p.ward?.slumPopulation || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              Demographic Exposure Analysis
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              People at Risk in {city.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Census-calibrated vulnerable populations requiring prioritized municipal protection.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Total City Population</div>
            <div className="text-3xl font-extrabold text-slate-900">{(totalPop / 100000).toFixed(1)} Lakhs</div>
          </div>
        </div>
      </div>

      {/* 4 Vulnerability Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Senior Citizens (60+)</div>
            <div className="text-3xl font-black text-rose-600 mt-1">{totalElderly.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">
              Impaired thermoregulation and cardiovascular sensitivity. Require daily ASHA check-ins.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Outdoor & Daily Workers</div>
            <div className="text-3xl font-black text-amber-600 mt-1">{totalWorkers.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">
              Construction, street vendors, delivery, and sanitation workers facing direct solar radiation.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Informal & Tin-Roof Housing</div>
            <div className="text-3xl font-black text-purple-600 mt-1">{totalSlum.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">
              Severe nighttime heat trap where indoor room temperatures remain 4°C above outdoor ambient.
            </p>
          </div>
        </div>
      </div>

      {/* Ward Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Ward-Level Vulnerability Concentration
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase">
                <th className="pb-3">Ward Name</th>
                <th className="pb-3">Zone</th>
                <th className="pb-3 text-right">Senior Citizens</th>
                <th className="pb-3 text-right">Outdoor Workers</th>
                <th className="pb-3 text-right">Informal Housing</th>
                <th className="pb-3 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {wardProfiles.map((p) => (
                <tr key={p.ward.wardId} className="hover:bg-slate-50">
                  <td className="py-3.5 font-bold text-slate-900">{p.ward.wardName}</td>
                  <td className="py-3.5">{p.ward.zone}</td>
                  <td className="py-3.5 text-right font-medium">{p.ward.elderlyPopulation60Plus.toLocaleString()}</td>
                  <td className="py-3.5 text-right font-medium">{p.ward.outdoorWorkerPopulation.toLocaleString()}</td>
                  <td className="py-3.5 text-right font-medium">{p.ward.slumPopulation.toLocaleString()}</td>
                  <td className="py-3.5 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      {p.currentThermal?.heatIndex || 41}°C
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
