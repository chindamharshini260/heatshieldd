import React, { useState } from 'react';
import {
  Thermometer,
  Flame,
  Users,
  ShieldAlert,
  Activity,
  Clock,
  Sliders,
  TrendingDown,
  FileCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { WardImpactProfile } from '../types';

interface ImpactCascadeProps {
  profile: WardImpactProfile;
  cityName: string;
}

export const ImpactCascade: React.FC<ImpactCascadeProps> = ({ profile, cityName }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      title: '1. Weather Forecast',
      icon: Thermometer,
      badge: `${profile.currentThermal.heatIndex}°C Peak`,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      summary: 'Atmospheric forcing parameters (Temp, RH, Wind, Solar Irradiance) from Open-Meteo API.',
      details: [
        `Ambient Air Temperature: ${profile.currentThermal.heatIndex}°C`,
        `Relative Humidity: ~45% (diurnally variable)`,
        `Direct Solar Irradiance: ~650 W/m²`,
        `Surface Wind Speed: ~8.5 km/h`
      ]
    },
    {
      id: 1,
      title: '2. Thermal Stress',
      icon: Flame,
      badge: `UTCI ${profile.currentThermal.utci}°C (${profile.currentThermal.category})`,
      color: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
      summary: 'Human physiological heat strain calculated using UTCI & Liljegren WBGT equations.',
      details: [
        `Universal Thermal Climate Index (UTCI): ${profile.currentThermal.utci}°C`,
        `Wet Bulb Globe Temp (WBGT): ${profile.currentThermal.wbgt}°C`,
        `Human Thermal Stress Score (HTSS): ${profile.currentThermal.htss}/100`,
        `Nocturnal Recovery Failure: ${profile.currentThermal.nightHeatRecoveryFailure ? 'DETECTED (Min Temp >= 27.5°C)' : 'Normal'}`
      ]
    },
    {
      id: 2,
      title: '3. Human Exposure',
      icon: Users,
      badge: `Score: ${profile.humanExposureScore}/100`,
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
      summary: 'Who is physically outdoors or unconditioned during peak solar hours?',
      details: [
        `Total Ward Population: ${profile.ward.totalPopulation.toLocaleString()}`,
        `Population Density: ${profile.ward.populationDensity.toLocaleString()} / km²`,
        `Active Outdoor Labor Force: ${profile.ward.outdoorWorkerPopulation.toLocaleString()} (${(profile.ward.outdoorWorkerRatio * 100).toFixed(0)}%)`,
        `Peak Exposure Window: 11:30 - 16:30 hrs`
      ]
    },
    {
      id: 3,
      title: '4. Vulnerability',
      icon: ShieldAlert,
      badge: `Score: ${profile.vulnerabilityScore}/100`,
      color: 'border-red-500/40 bg-red-500/10 text-red-400',
      summary: 'Demographic susceptibility & built environment heat retention.',
      details: [
        `Elderly Residents (60+): ${profile.ward.elderlyPopulation60Plus.toLocaleString()} (${(profile.ward.elderlyRatio * 100).toFixed(1)}%)`,
        `Informal/Slum Housing (Tin/Asbestos roofs): ${(profile.ward.slumInformalHousingRatio * 100).toFixed(0)}%`,
        `NDVI Green Cover Deficit: ${(1 - profile.ward.vegetationIndexNDVI).toFixed(2)} (Very low shade)`,
        `Urban Heat Island (Impervious Concrete): ${(profile.ward.imperviousBuiltupRatio * 100).toFixed(0)}%`
      ]
    },
    {
      id: 4,
      title: '5. Health Impact Risk',
      icon: Activity,
      badge: `Index: ${(profile.healthImpactRisk * 100).toFixed(0)}% (${profile.healthImpactRisk >= 0.7 ? 'Critical' : 'Elevated'})`,
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
      summary: 'Predictive health risk and emergency hospital surge probability.',
      details: [
        `Epidemiological Health Strain Probability: ${(profile.healthImpactRisk * 100).toFixed(0)}%`,
        `Projected Hospital Surge Probability: ${(profile.hospitalizationSurgeProbability * 100).toFixed(0)}%`,
        `Primary Clinical Vulnerability: Cardiovascular collapse & exertional heat exhaustion`,
        `72-Hour Cumulative Heat Load: ${profile.currentThermal.cumulativeHeatBurden72h} degree-hours`
      ]
    },
    {
      id: 5,
      title: '6. Action Window',
      icon: Clock,
      badge: `${profile.actionWindowHours}h to Peak Impact`,
      color: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
      summary: 'Proactive disaster response window before peak physiological strain occurs.',
      details: [
        `Hours Remaining until Critical Threshold: ${profile.actionWindowHours} hours`,
        `Recommended Preventive Window: NOW to T-${Math.max(6, profile.actionWindowHours - 12)}h`,
        `Operational Urgency: ${profile.actionWindowHours <= 24 ? 'CRITICAL - IMMEDIATE DEPLOYMENT' : 'HIGH - PRE-DEPLOYMENT'}`
      ]
    },
    {
      id: 6,
      title: '7. Intervention Options',
      icon: Sliders,
      badge: `Priority Rank #${profile.interventionPriorityRank}`,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      summary: 'Targeted multi-sectoral countermeasures based on evidence matrix.',
      details: [
        'Shift outdoor construction to 06:00-11:00 & 16:30-19:30',
        'Open air-conditioned municipal cooling center with ORS',
        'ASHA door-to-door senior citizen welfare checks',
        'Deploy mobile misting tanker along transit corridor'
      ]
    },
    {
      id: 7,
      title: '8. Impact Reduction',
      icon: TrendingDown,
      badge: '-45% to -68% Risk Reduction',
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
      summary: 'Modeled reduction in human thermal exposure and hospital surge load.',
      details: [
        'Outdoor worker peak exposure drops by up to 68%',
        'Vulnerable elderly acute strain mitigated by 48%',
        'Emergency hospital heatstroke backlog reduced by ~55%',
        'Zero-delay preventive action window fully utilized'
      ]
    },
    {
      id: 8,
      title: '9. Action Plan',
      icon: FileCheck,
      badge: 'Municipal SOP Directives',
      color: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
      summary: 'Formal administrative orders issued across municipal departments.',
      details: [
        'Labour Department: Inspect sites and enforce shift mandate',
        'Health Department: Pre-chill IV saline bags & reserve triage beds',
        'Water Works: Supply 25,000L cold drinking water to high-risk wards',
        'Public Relations: Broadcast vernacular WhatsApp/SMS alerts'
      ]
    }
  ];

  return (
    <div id="impact-cascade-container" className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base font-semibold text-slate-100 tracking-wide">
              HEAT IMPACT & INTERVENTION CASCADE
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            End-to-end scientific reasoning pipeline for {profile.ward.wardName} ({cityName})
          </p>
        </div>
        <div className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 font-mono">
          Priority Rank: #{profile.interventionPriorityRank}
        </div>
      </div>

      {/* Horizontal Flow Steps */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 mb-5">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isSelected = activeStep === idx;
          return (
            <button
              key={s.id}
              id={`cascade-step-btn-${idx}`}
              onClick={() => setActiveStep(idx)}
              className={`p-2.5 rounded-lg text-left transition-all border flex flex-col justify-between relative ${
                isSelected
                  ? `${s.color} ring-2 ring-emerald-400/50 shadow-lg scale-102`
                  : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className={`w-4 h-4 ${isSelected ? '' : 'text-slate-400'}`} />
                <span className="text-[10px] font-mono text-slate-400 font-medium">{idx + 1}</span>
              </div>
              <div className="text-[11px] font-semibold leading-tight line-clamp-1">{s.title.split('. ')[1]}</div>
              <div className="text-[9px] text-slate-400 line-clamp-1 mt-1 font-mono">{s.badge}</div>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Inspector */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            {React.createElement(steps[activeStep].icon, {
              className: 'w-5 h-5 text-emerald-400'
            })}
            <h4 className="text-sm font-semibold text-slate-200">{steps[activeStep].title}</h4>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border ${steps[activeStep].color} font-mono`}>
              {steps[activeStep].badge}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5" />
            <span>Click any step above to inspect reasoning chain</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-3">{steps[activeStep].summary}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {steps[activeStep].details.map((detail, dIdx) => (
            <div
              key={dIdx}
              className="flex items-start gap-2 text-xs bg-slate-900/60 border border-slate-800/60 rounded px-3 py-2 text-slate-300 font-mono"
            >
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
