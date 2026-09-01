import React, { useState } from 'react';
import {
  Sun,
  Droplets,
  Wind,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  Users,
  Heart,
  Calendar,
  MapPin,
  CheckCircle2,
  Info,
  Thermometer
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface PublicHomeProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
  onNavigate: (tab: string) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  city,
  wardProfiles,
  onNavigate
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const topWard = wardProfiles[0];
  const maxTemp = wardProfiles.length
    ? Math.max(...wardProfiles.map((p) => p.currentThermal?.heatIndex || 39))
    : 39;
  const currentTemp = topWard ? Math.round(topWard.currentThermal?.wbgt ? topWard.currentThermal.wbgt + 6 : 39) : 39;

  // Derive human friendly risk
  const getRiskLabel = (temp: number) => {
    if (temp >= 44) return { label: 'Extreme', color: 'bg-red-600 text-white', icon: '🟥' };
    if (temp >= 40) return { label: 'Very High', color: 'bg-rose-500 text-white', icon: '🔴' };
    if (temp >= 36) return { label: 'High', color: 'bg-amber-500 text-white', icon: '🟠' };
    if (temp >= 32) return { label: 'Moderate Caution', color: 'bg-yellow-400 text-slate-900', icon: '🟡' };
    return { label: 'Comfortable', color: 'bg-emerald-500 text-white', icon: '🟢' };
  };

  const risk = getRiskLabel(maxTemp);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Question Header */}
      <div className="text-center pt-2 pb-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          How safe is it outside today?
        </h1>
        <p className="text-sm text-slate-500 mt-1 flex items-center justify-center gap-1.5 font-medium">
          <MapPin className="w-4 h-4 text-rose-500" />
          Showing heat conditions for <strong className="text-slate-700">{city.name}, {city.state}</strong>
        </p>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-slate-100 pb-6">
          {/* Temperature */}
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Right Now
            </div>
            <div className="text-5xl sm:text-6xl font-black text-slate-900 flex items-baseline justify-center md:justify-start gap-1">
              {currentTemp}°<span className="text-2xl font-bold text-slate-500">C</span>
            </div>
            <div className="text-xs text-slate-500">
              Peak expected: <span className="font-semibold text-slate-700">{maxTemp}°C</span>
            </div>
          </div>

          {/* Feels Like */}
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Feels Like
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800">
              {maxTemp >= 42 ? 'Very Hot' : maxTemp >= 38 ? 'Hot' : 'Warm'}
            </div>
            <div className="text-xs text-slate-500">
              Due to strong sunlight & humidity
            </div>
          </div>

          {/* Heat Risk Level */}
          <div className="space-y-2 text-center md:text-left">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Heat Risk
            </div>
            <div className="inline-flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-sm ${risk.color}`}>
                {risk.icon} {risk.label}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Worst hours: <strong className="text-slate-700">Today 2:00 PM – 5:00 PM</strong>
            </div>
          </div>
        </div>

        {/* Plain English Explanation */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-left">
            <h2 className="text-sm font-bold text-amber-950">
              Summary for today in {city.name}
            </h2>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              The heat may put extra stress on your body today. Drink water regularly even if you do not feel thirsty, stay in the shade, and avoid heavy outdoor activity during the hottest hours between 12:00 PM and 4:30 PM.
            </p>
          </div>
        </div>

        {/* Why does it feel this hot? (Accordion) */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-4 py-3 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100/70 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              Why does it feel this hot?
            </span>
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              {showDetails ? 'Hide details' : 'See heat details'}
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>

          {showDetails && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                  <div className="text-[11px] text-slate-500 font-medium">Temperature</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">{maxTemp}°C</div>
                  <div className="text-[10px] text-slate-400">Peak Air Temp</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                  <div className="text-[11px] text-slate-500 font-medium">Humidity</div>
                  <div className="text-lg font-bold text-blue-600 mt-0.5">42%</div>
                  <div className="text-[10px] text-slate-400">Slows body cooling</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                  <div className="text-[11px] text-slate-500 font-medium">Wind</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">12 km/h</div>
                  <div className="text-[10px] text-slate-400">Light Breeze</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                  <div className="text-[11px] text-slate-500 font-medium">Sunlight</div>
                  <div className="text-lg font-bold text-amber-600 mt-0.5">High</div>
                  <div className="text-[10px] text-slate-400">Strong Radiation</div>
                </div>
              </div>

              {/* Advanced Measurements Toggle */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  {showAdvanced ? 'Hide advanced measurements' : 'View advanced heat measurements (Scientific)'}
                </button>

                {showAdvanced && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800">
                        Heat Index: <span className="text-rose-600">{topWard?.currentThermal?.heatIndex || 44}°C</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        How hot the air feels because of temperature and humidity combined.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-slate-800">
                        WBGT: <span className="text-amber-600">{topWard?.currentThermal?.wbgt || 33}°C</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        How stressful the heat is for outdoor physical activity and work.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-slate-800">
                        UTCI: <span className="text-purple-600">{topWard?.currentThermal?.utci || 43}°C</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        How much the weather as a whole stresses the human body.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation Cards for Common Questions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next 5 Days */}
        <button
          onClick={() => onNavigate('next5days')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left space-y-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
              Next 5 Days
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              See how hot it will be throughout this week.
            </p>
          </div>
        </button>

        {/* Areas at Risk */}
        <button
          onClick={() => onNavigate('areas')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left space-y-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-rose-600 flex items-center justify-between">
              Areas at Risk
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Find out which neighborhoods are hottest today.
            </p>
          </div>
        </button>

        {/* Who Needs Extra Care? */}
        <button
          onClick={() => onNavigate('who')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left space-y-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 flex items-center justify-between">
              Who Needs Extra Care?
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Precautions for seniors, children, & outdoor workers.
            </p>
          </div>
        </button>

        {/* What You Can Do */}
        <button
          onClick={() => onNavigate('actions')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left space-y-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 flex items-center justify-between">
              What You Can Do
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Practical checklist to stay cool and safe.
            </p>
          </div>
        </button>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
            108
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
              National Emergency Ambulance
            </div>
            <div className="text-xs text-slate-300">
              Call 108 immediately if anyone feels dizzy, faints, or has trouble breathing in the heat.
            </div>
          </div>
        </div>
        <button
          onClick={() => onNavigate('help')}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors"
        >
          View Emergency Help Guide
        </button>
      </div>
    </div>
  );
};
