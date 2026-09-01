import React, { useState } from 'react';
import {
  FileText,
  Activity,
  Layers,
  Database,
  ExternalLink,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface AuthorityDataScienceProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const AuthorityDataScience: React.FC<AuthorityDataScienceProps> = ({
  city,
  wardProfiles
}) => {
  const [activeTab, setActiveTab] = useState<'meteorology' | 'biometeorology' | 'demographics' | 'validation'>('meteorology');

  const topWard = wardProfiles[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              Methodology & Technical Specifications
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Data & Science Documentation
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Transparent review of computational models, meteorological sources, and biophysical algorithms powering HeatShield AI.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('meteorology')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'meteorology'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          1. Meteorological Pipelines & APIs
        </button>

        <button
          onClick={() => setActiveTab('biometeorology')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'biometeorology'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          2. Thermal Stress Indices (UTCI / WBGT / HI)
        </button>

        <button
          onClick={() => setActiveTab('demographics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'demographics'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          3. Ward Demographics & Satellite Layers
        </button>

        <button
          onClick={() => setActiveTab('validation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'validation'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          4. Epidemiological Validation & Benchmarks
        </button>
      </div>

      {/* Tab 1: Meteorology */}
      {activeTab === 'meteorology' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Meteorological Pipeline Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 text-sm">Real-Time Numerical Weather Prediction</div>
              <p className="leading-relaxed">
                Aggregates global high-resolution forecasts from <strong>ECMWF IFS (0.25°)</strong>, <strong>NOAA GFS (0.25°)</strong>, and <strong>DWD ICON (11km)</strong> via Open-Meteo API.
              </p>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                Variables: 2m Dry-Bulb Temp, Relative Humidity, 10m Wind Speed, Direct Solar Radiation, Surface Temperature.
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 text-sm">Microclimate Urban Heat Island (UHI) Adjustment</div>
              <p className="leading-relaxed">
                Applies empirical microclimate modifiers per municipal ward using surface imperviousness fraction (<span className="font-mono">IBUR</span>) and normalized vegetation index (<span className="font-mono">NDVI</span>).
              </p>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                Peak UHI Delta: +1.8°C to +3.6°C above ambient rural airport baselines.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Biometeorology */}
      {activeTab === 'biometeorology' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Biophysical Equations & Human Thermal Models</h2>
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 text-sm">
                1. Universal Thermal Climate Index (UTCI)
              </div>
              <p className="leading-relaxed">
                Based on the multi-node Fiala human thermoregulation model (COST Action 730). Computes equivalent temperature from dry-bulb temperature, mean radiant temperature (Tmrt), 10m wind speed (v10m), and water vapor pressure (ea).
              </p>
              <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px] text-slate-800">
                UTCI = f(T_air, T_mrt, v_10m, e_a) via 6th-order polynomial regression (104 regression coefficients)
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 text-sm">
                2. Wet Bulb Globe Temperature (Liljegren ISO 7243)
              </div>
              <p className="leading-relaxed">
                Calculates environmental work safety thresholds by balancing solar radiation absorption against convective cooling and evaporative sweat dissipation.
              </p>
              <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px] text-slate-800">
                WBGT = 0.7 × T_nwb (Natural Wet Bulb) + 0.2 × T_g (Black Globe) + 0.1 × T_db (Dry Bulb)
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 text-sm">
                3. NOAA Rothfusz Heat Index
              </div>
              <p className="leading-relaxed">
                Multivariate polynomial modeling perceived temperature based on Steadman's human skin vapor pressure transfer equations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Demographics */}
      {activeTab === 'demographics' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Demographic & Satellite Ground Truth Layers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 text-sm">Census of India (Ward-level)</div>
              <p>
                Total population, senior citizen ratios (60+), daily wage/outdoor labor fractions, and informal housing density.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 text-sm">ISRO Bhuvan & Landsat 8/9</div>
              <p>
                30m resolution Normalized Difference Vegetation Index (NDVI) and Land Surface Temperature (LST) thermal infrared calibration.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 text-sm">State Disaster Management Portals</div>
              <p>
                Ahmedabad Heat Action Plan historical mortality baseline (41.5°C threshold), IMD heat wave triggers, and Urban Local Body cooling center registries.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Validation */}
      {activeTab === 'validation' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Peer-Reviewed Epidemiological Validation</h2>
          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-900">1. Ahmedabad Heat Action Plan (HAP) Evidence Baseline</div>
              <p className="mt-1 text-slate-600">
                Evaluation by Hess et al. (2018) and Knowlton et al. (2014) in <em>The Lancet Planetary Health</em> demonstrated that coordinated early warnings and cooling center deployments avoid an estimated <strong>1,190 excess heat-related deaths annually</strong> in Ahmedabad alone.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-900">2. Occupational Exertional Heat Thresholds (ILO / WHO)</div>
              <p className="mt-1 text-slate-600">
                International Labour Organization guidelines indicate that when WBGT exceeds 32°C, work capacity drops by 50% for unacclimatized laborers, and risk of acute kidney injury from rhabdomyolysis rises threefold without 20-minute hydration intervals.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
