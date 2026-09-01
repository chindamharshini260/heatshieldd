import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Trees,
  Building2,
  Users,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface AuthorityRiskMapProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
  onSelectWard?: (wardId: string) => void;
  onNavigate?: (tab: string) => void;
}

export const AuthorityRiskMap: React.FC<AuthorityRiskMapProps> = ({
  city,
  wardProfiles,
  onSelectWard,
  onNavigate
}) => {
  const [selectedWardId, setSelectedWardId] = useState<string>(
    wardProfiles[0]?.ward.wardId || ''
  );
  const [activeLayer, setActiveLayer] = useState<'heat' | 'canopy' | 'density'>('heat');

  const selectedProfile =
    wardProfiles.find((p) => p.ward.wardId === selectedWardId) || wardProfiles[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              Spatial Microclimate Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              City Risk Map: {city.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Analyze ward-by-ward microclimate hotspots, concrete density traps, and tree cover deficits.
            </p>
          </div>

          {/* Layer Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveLayer('heat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLayer === 'heat' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Heat Stress Index
            </button>
            <button
              onClick={() => setActiveLayer('canopy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLayer === 'canopy' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tree Canopy Deficit
            </button>
            <button
              onClick={() => setActiveLayer('density')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLayer === 'density' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Built-up Density
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Ward list + Map View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ward list */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Wards in {city.name} ({wardProfiles.length})
          </h2>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {wardProfiles.map((p) => {
              const isSelected = p.ward.wardId === selectedWardId;
              const heat = p.currentThermal?.heatIndex || 40;
              return (
                <button
                  key={p.ward.wardId}
                  onClick={() => {
                    setSelectedWardId(p.ward.wardId);
                    if (onSelectWard) onSelectWard(p.ward.wardId);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-slate-900">{p.ward.wardName}</div>
                    <div className="text-xs text-slate-500">
                      {p.ward.zone} • {(p.ward.totalPopulation / 1000).toFixed(0)}k pop
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-rose-600">{heat}°C</div>
                    <span className="text-[10px] font-semibold text-slate-400">
                      NDVI: {p.ward.vegetationIndexNDVI.toFixed(2)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Ward Detail Card */}
        {selectedProfile && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <span className="text-xs font-semibold text-blue-600">{selectedProfile.ward.zone} Zone</span>
                <h2 className="text-xl font-bold text-slate-900">{selectedProfile.ward.wardName}</h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                Peak {selectedProfile.currentThermal?.heatIndex || 41}°C
              </span>
            </div>

            {/* Spatial Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Trees className="w-4 h-4 text-emerald-600" />
                  Vegetation Cover
                </div>
                <div className="text-xl font-extrabold text-slate-900">
                  {(selectedProfile.ward.vegetationIndexNDVI * 100).toFixed(0)}% Cover
                </div>
                <div className="text-[11px] text-slate-500">NDVI: {selectedProfile.ward.vegetationIndexNDVI}</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  Built-up Fraction
                </div>
                <div className="text-xl font-extrabold text-slate-900">
                  {(selectedProfile.ward.imperviousBuiltupRatio * 100).toFixed(0)}% Concrete
                </div>
                <div className="text-[11px] text-slate-500">Surface heat retention</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Users className="w-4 h-4 text-amber-600" />
                  High Risk Residents
                </div>
                <div className="text-xl font-extrabold text-slate-900">
                  {(selectedProfile.ward.elderlyPopulation60Plus + selectedProfile.ward.outdoorWorkerPopulation).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500">Seniors + Laborers</div>
              </div>
            </div>

            {/* Intervention recommendation */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-5 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-950">
                Recommended Spatial Interventions
              </h3>
              <p className="text-xs text-blue-900 leading-relaxed">
                Prioritize misting tankers along main transit arteries, open 2 additional shaded community centers, and apply white reflective paint on informal housing roofs in this ward.
              </p>
            </div>

            {onNavigate && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    if (onSelectWard) onSelectWard(selectedProfile.ward.wardId);
                    onNavigate('plan');
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  <span>Simulate Interventions for {selectedProfile.ward.wardName.split('-')[1]?.trim() || selectedProfile.ward.wardName}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
