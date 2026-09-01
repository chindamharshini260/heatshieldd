/**
 * Data & Science Modal / Screen - HeatShield AI
 * Transparent, peer-reviewed scientific methodology documentation
 */

import React from 'react';
import {
  X,
  Activity,
  Shield,
  Sun,
  Droplets,
  Wind,
  Moon,
  Clock,
  ExternalLink,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

interface DataAndScienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataAndScienceModal: React.FC<DataAndScienceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Data & Scientific Methodology
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                How HeatShield AI turns meteorological measurements into human health intelligence.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* 1. Core Principle */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
            <h3 className="font-semibold text-sm text-rose-900">
              Core Principle: Weather is the Input. Human Health is the Product.
            </h3>
            <p className="text-xs leading-relaxed font-normal">
              Standard weather applications report shade temperature from weather stations. HeatShield AI calculates the biological thermal strain on the human body by combining ambient temperature with humidity, solar radiation, wind convective cooling, and duration of exposure.
            </p>
          </div>

          {/* 2. Meteorological Source */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Real Meteorological Data Source</span>
            </h4>
            <p className="text-xs text-slate-600 font-normal">
              All atmospheric measurements (temperature, relative humidity, wind speed, solar irradiance, precipitation probability) are retrieved live from <strong className="font-semibold text-slate-800">Open-Meteo</strong> numerical weather prediction models. We never generate artificial or hardcoded weather figures.
            </p>
          </div>

          {/* 3. Scientific Models */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Scientific Indices Used</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-semibold text-xs text-slate-900">1. NOAA Rothfusz Heat Index</div>
                <p className="text-xs text-slate-600 font-normal">
                  Measures apparent temperature based on temperature and relative humidity, accounting for impaired sweat evaporation in high moisture.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-semibold text-xs text-slate-900">2. Outdoor WBGT (ISO 7243)</div>
                <p className="text-xs text-slate-600 font-normal">
                  Liljegren Wet Bulb Globe Temperature incorporating solar radiation, ambient temperature, and wind speed.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-semibold text-xs text-slate-900">3. COST Action 730 UTCI</div>
                <p className="text-xs text-slate-600 font-normal">
                  Universal Thermal Climate Index based on a multi-node dynamic model of human thermoregulation (Bröde et al., 2012).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-semibold text-xs text-slate-900">4. Nighttime Thermal Recovery</div>
                <p className="text-xs text-slate-600 font-normal">
                  Assesses minimum night temperatures (&gt;25°C threshold) that prevent cardiovascular system decompression during sleep.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Limitations & Validation Roadmap */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
              Future Validation & Clinical Roadmap
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              HeatShield AI provides environmental health advisories based on biometeorological standards. Individual health responses depend on age, pre-existing cardiovascular conditions, medication, and hydration. Clinical trial validation with wearable physiological monitors and hospital admission data is planned for Phase 2.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
