import React, { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  Info,
  Trees,
  Building2,
  Users,
  Sun,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface PublicAreasAtRiskProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const PublicAreasAtRisk: React.FC<PublicAreasAtRiskProps> = ({
  city,
  wardProfiles
}) => {
  const [selectedWardId, setSelectedWardId] = useState<string>(
    wardProfiles[0]?.ward.wardId || ''
  );

  const selectedProfile =
    wardProfiles.find((p) => p.ward.wardId === selectedWardId) || wardProfiles[0];

  const getRiskDetails = (profile: WardImpactProfile) => {
    const temp = profile?.currentThermal?.heatIndex || 40;
    if (temp >= 44) {
      return {
        level: 'Extreme Risk',
        badge: 'bg-red-600 text-white',
        dot: 'bg-red-600',
        reasons: ['Extremely dense buildings with tin roofs', 'Very few trees or shade', 'High concentration of outdoor workers']
      };
    }
    if (temp >= 41) {
      return {
        level: 'Very High Risk',
        badge: 'bg-rose-500 text-white',
        dot: 'bg-rose-500',
        reasons: ['Heavy concrete built-up area trapping heat', 'Low green vegetation index', 'Dense population in informal housing']
      };
    }
    if (temp >= 37) {
      return {
        level: 'High Risk',
        badge: 'bg-amber-500 text-white',
        dot: 'bg-amber-500',
        reasons: ['Moderate tree cover deficit', 'Active commercial roads', 'Elderly residents requiring hydration checks']
      };
    }
    return {
      level: 'Moderate Caution',
      badge: 'bg-yellow-400 text-slate-900',
      dot: 'bg-yellow-400',
      reasons: ['Better tree shade and open ventilation', 'Moderate building density']
    };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              Neighborhood Heat Map
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">
              Where is the heat worst in {city.name}?
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Some neighborhoods get hotter because of concrete buildings, lack of trees, and dense living conditions.
            </p>
          </div>

          {/* Simple Legend */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-medium">
            <span className="text-slate-400 font-semibold text-[11px] mr-1">Risk Scale:</span>
            <span className="flex items-center gap-1 text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Comfortable</span>
            <span className="flex items-center gap-1 text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> Caution</span>
            <span className="flex items-center gap-1 text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High</span>
            <span className="flex items-center gap-1 text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Very High</span>
            <span className="flex items-center gap-1 text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Extreme</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Neighborhood List */}
        <div className="space-y-3 lg:col-span-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Select an area in {city.name}
          </h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {wardProfiles.map((p) => {
              const risk = getRiskDetails(p);
              const isSelected = selectedWardId === p.ward.wardId;
              return (
                <button
                  key={p.ward.wardId}
                  onClick={() => setSelectedWardId(p.ward.wardId)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${risk.dot}`}></span>
                      {p.ward.wardName.split('-')[1]?.trim() || p.ward.wardName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {p.ward.zone} • {(p.ward.totalPopulation / 1000).toFixed(0)}k people
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-slate-900">
                      {p.currentThermal?.heatIndex || 40}°C
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${risk.badge}`}>
                      {risk.level.replace(' Risk', '')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Area Why & Explanation Card */}
        {selectedProfile && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <div className="text-xs font-semibold text-blue-600">
                  {selectedProfile.ward.zone} • {city.name}
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedProfile.ward.wardName}
                </h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskDetails(selectedProfile).badge}`}>
                {getRiskDetails(selectedProfile).level}
              </span>
            </div>

            {/* Why is this area at risk? */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Why is this area at risk?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This area gets hotter than surrounding neighborhoods because dense concrete buildings trap the daytime sun, while fewer trees reduce natural evaporative cooling.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Trees className="w-4 h-4 text-emerald-600" />
                    Tree & Shade Cover
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {selectedProfile.ward.vegetationIndexNDVI < 0.15 ? 'Very Low Shade' : 'Moderate Shade'}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Fewer trees mean direct sunlight hits roads and roofs.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Building2 className="w-4 h-4 text-slate-600" />
                    Building Density
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {selectedProfile.ward.imperviousBuiltupRatio > 0.8 ? 'High Concrete Density' : 'Medium Density'}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Buildings trap heat and release it throughout the night.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Users className="w-4 h-4 text-amber-600" />
                    People Needing Care
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {(selectedProfile.ward.elderlyPopulation60Plus + selectedProfile.ward.outdoorWorkerPopulation).toLocaleString()} residents
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Seniors and daily-wage outdoor laborers in this area.
                  </p>
                </div>
              </div>
            </div>

            {/* Neighborhood Safety Tips */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950">
                Safety Advice for Residents in {selectedProfile.ward.wardName.split('-')[1]?.trim() || selectedProfile.ward.wardName}
              </h4>
              <ul className="text-xs text-blue-900 space-y-1.5 list-disc list-inside">
                <li>Visit local shaded community centers or ward health kiosks between 12 PM and 4 PM.</li>
                <li>Keep water bowls outside for stray animals and birds.</li>
                <li>Cover tin or asbestos roofs with wet jute sacks or white lime wash to reflect heat.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
