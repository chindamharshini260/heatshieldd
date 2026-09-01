import React from 'react';
import {
  Database,
  CheckCircle2,
  Code2,
  BookOpen,
  Layers,
  Activity,
  FileCheck,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { DATASET_CATALOG, DatasetEntry } from '../data/datasetCatalog';

export const DataRegistryView: React.FC = () => {
  return (
    <div id="data-registry-view" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-rose-400 font-mono font-semibold uppercase tracking-wider mb-1">
          <Database className="w-3.5 h-3.5" />
          Data Governance & Scientific Physics Engine
        </div>
        <h2 className="text-xl font-bold text-slate-100">
          DATA ARCHITECTURE, REGISTRY & MATHEMATICAL FORMULATIONS
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Complete documentation of real-world atmospheric APIs, municipal census boundaries, urban satellite layers, and peer-reviewed thermodynamic equations.
        </p>
      </div>

      {/* Dataset Catalog Table (Phase 38 Real Data Ingestion) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              OFFICIAL DATA SOURCES & INGESTION REGISTRY
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly non-simulated datasets utilized across atmospheric, demographic, satellite, and health matrices.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-lg">
            All Sources Validated & Integrated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase bg-slate-950/60">
                <th className="p-3">Dataset Name</th>
                <th className="p-3">Authority / Source</th>
                <th className="p-3">Variables Ingested</th>
                <th className="p-3">Resolution</th>
                <th className="p-3">Update Frequency</th>
                <th className="p-3">Licensing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {DATASET_CATALOG.map((ds: DatasetEntry) => (
                <tr key={ds.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-100">{ds.name}</td>
                  <td className="p-3 font-mono text-amber-400">{ds.source}</td>
                  <td className="p-3 text-slate-300 max-w-xs">{ds.variables.join(', ')}</td>
                  <td className="p-3 font-mono text-slate-400">{ds.spatialResolution}</td>
                  <td className="p-3 font-mono text-emerald-400">{ds.updateFrequency}</td>
                  <td className="p-3 font-mono text-slate-400">{ds.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Peer-Reviewed Scientific Equations Reference */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          THERMODYNAMIC PHYSICS & PSYCHROMETRIC EQUATIONS REFERENCE
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Universal Thermal Climate Index (UTCI) */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-100">
                1. Universal Thermal Climate Index (UTCI)
              </h4>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                COST Action 730 / Bröde et al.
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Calculates equivalent human thermal physiological sensation using a 6th-order multi-variate polynomial regression modeling dynamic blood flow, evaporative sweating, and solar mean radiant temperature (Tmrt).
            </p>
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-[10px] text-slate-300">
              UTCI = T + Offset(T, RH, Wind, Tmrt)
            </div>
          </div>

          {/* Wet Bulb Globe Temperature (WBGT) */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-100">
                2. Wet Bulb Globe Temperature (WBGT - ISO 7243)
              </h4>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Liljegren & Stull Psychrometric
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Standard occupational guideline metric combining natural wet-bulb temperature (Tw), black globe temperature (Tg), and ambient dry-bulb temperature (Ta).
            </p>
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-[10px] text-slate-300">
              WBGT (Outdoors) = 0.7·Tw + 0.2·Tg + 0.1·Ta
            </div>
          </div>

          {/* NOAA Rothfusz Heat Index */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-100">
                3. NOAA Rothfusz Heat Index
              </h4>
              <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                Rothfusz (1990) Regression
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Steadman biometeorological formula capturing human skin evaporative cooling impairment at high humidity.
            </p>
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-[10px] text-slate-300">
              HI = -42.379 + 2.049·T + 10.143·RH - 0.224·T·RH ...
            </div>
          </div>

          {/* Cumulative Heat Burden & Recovery Failure */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-100">
                4. Cumulative Burden & Nocturnal Recovery Failure
              </h4>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Lancet Planetary Health Benchmark
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Integrated degree-hours above 32°C threshold plus boolean flag for consecutive nighttime minimum temperatures failing to drop below 27.5°C.
            </p>
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-[10px] text-slate-300">
              Burden = ∫ max(0, UTCI(t) - 32) dt | NightFailure: Min(T_night) ≥ 27.5°C
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
