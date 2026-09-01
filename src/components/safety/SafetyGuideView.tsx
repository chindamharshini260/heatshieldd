/**
 * HeatShield AI - Page 9: Safety Guide
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. Title: "Heat Safety Guide"
 * 2. "DO THIS NOW": 3 Immediate Action Cards (Water, Shade, Cooling)
 * 3. 4 Large Illustrated Interactive Protocol Cards:
 *    - BEFORE GOING OUT
 *    - DURING HEAT EXPOSURE
 *    - AFTER OUTDOOR EXPOSURE
 *    - EMERGENCY PROCEDURES
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Droplets,
  Sun,
  Fan,
  Shirt,
  Umbrella,
  Home,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CompleteWeatherData } from '../../types/weather';

interface SafetyGuideViewProps {
  weatherData: CompleteWeatherData | null;
}

export const SafetyGuideView: React.FC<SafetyGuideViewProps> = ({ weatherData }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('before');

  const protocols = [
    {
      id: 'before',
      title: 'BEFORE GOING OUT (PREPARATION)',
      icon: Sun,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      summary: 'Pre-hydrate and prepare protective gear before sun exposure begins.',
      steps: [
        'Drink 500ml of water or coconut water at least 30 minutes before leaving indoor cooling.',
        'Apply broad-spectrum sunscreen (SPF 30+) to face, neck, and exposed arms.',
        'Wear loose, light-colored, breathable cotton clothing and UV-protective sunglasses.',
        'Carry a portable umbrella and an insulated water bottle with electrolyte fluid.',
      ],
    },
    {
      id: 'during',
      title: 'DURING HEAT EXPOSURE (ACTIVE DEFENSE)',
      icon: Umbrella,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      summary: 'Pace your physical energy and take mandatory cooling micro-breaks.',
      steps: [
        'Take a 10-minute shaded rest break for every 45 minutes of continuous walking or physical activity.',
        'Sip 200–250ml of fluids every 20 minutes; do not wait until thirst signals kick in.',
        'Stay on shaded sidewalk corridors and avoid walking directly over heat-radiating asphalt when possible.',
        'If feeling dizzy, stop immediately, sit down, and splash cool water on your face and wrists.',
      ],
    },
    {
      id: 'after',
      title: 'AFTER RETURNING INDOORS (RECOVERY)',
      icon: Home,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      summary: 'Rapidly drop core body temperature and replenish spent electrolytes.',
      steps: [
        'Remove heavy outdoor footwear and loosen collar/clothing immediately.',
        'Drink a glass of buttermilk (chaas) or lemon water with a pinch of black salt.',
        'Rest in front of a fan or in an air-conditioned room for at least 30 minutes.',
        'Take a lukewarm shower (avoid freezing cold ice baths immediately as they cause shivering).',
      ],
    },
    {
      id: 'emergency',
      title: 'EMERGENCY PROTOCOL (RAPID TRIAGE)',
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      summary: 'Immediate action for suspected heat exhaustion or fainting.',
      steps: [
        'Move the affected person into deep shade or an air-conditioned vehicle immediately.',
        'Lay them flat on their back and elevate their feet 12 inches to restore blood flow to the brain.',
        'Apply wet ice towels to high blood flow areas: neck, armpits, and groin.',
        'If conscious, give small sips of cool water. If vomiting or unconscious, call 108/112 immediately.',
      ],
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight">
            Heat Safety Guide
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Standard operating protocols and tactical guidelines to prevent heat illness
          </p>
        </div>
      </div>

      {/* DO THIS NOW: 3 IMMEDIATE ACTION CARDS */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#17233C]">Do This Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-2 hover:border-blue-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#17233C]">DRINK 250ML WATER NOW</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Maintain cellular hydration buffer before daytime heat exposure accelerates sweating.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-2 hover:border-amber-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#17233C]">BLOCK MIDDAY SUN</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Close south and west facing curtains or blinds to prevent solar heat absorption into rooms.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-2 hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Fan className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#17233C]">VENTILATE ROOM AIR</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Run ceiling fans and keep cross-ventilation open whenever outside air is cooler than room air.
            </p>
          </div>
        </div>
      </div>

      {/* 4 LARGE ILLUSTRATED INTERACTIVE PROTOCOL CARDS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#17233C]">Comprehensive Heat Defense Protocols</h2>
        <div className="space-y-4">
          {protocols.map((p) => {
            const Icon = p.icon;
            const isExpanded = expandedSection === p.id;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs transition-all"
              >
                <div
                  onClick={() => setExpandedSection(isExpanded ? null : p.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F7F9FC]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${p.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-[#17233C]">{p.title}</h3>
                      <p className="text-xs text-[#64748B] mt-0.5">{p.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                    <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Expand Protocol'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-[#E2E8F0] bg-[#F7F9FC]/60 space-y-3 animate-in fade-in duration-200">
                    <div className="space-y-2 pt-2">
                      {p.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#17233C]">
                          <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
