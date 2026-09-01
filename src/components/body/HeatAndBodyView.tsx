/**
 * HeatShield AI - Page: Heat & Your Body
 * Visual Style: Healthcare-Focused, Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. Header: "Heat & Your Body" / "Understand how heat can affect your body."
 * 2. Main Visual & Interactive Body:
 *    - Professional, minimal, healthcare human-body vector illustration
 *    - Interactive selectable areas: BRAIN, HEART, MUSCLES, HYDRATION, BREATHING
 *    - Dynamic highlight on body illustration + info card ("HOW HEAT AFFECTS THIS AREA" & "WHAT YOU CAN DO")
 * 3. Early Warning Signs: 6 clean white cards (Headache, Dizziness, Weakness, Heavy Sweating, Nausea, Confusion)
 * 4. Hydration Section: Water-drop visual with simple practical guidance
 * 5. When to Get Help: Light-red warning card with clear dark text
 */

import React, { useState } from 'react';
import {
  Brain,
  Heart,
  Activity,
  Droplets,
  Wind,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Shield,
  PhoneCall,
  Sparkles,
  Info,
} from 'lucide-react';

interface HeatAndBodyViewProps {
  onNavigateToEmergency?: () => void;
}

type BodyArea = 'brain' | 'heart' | 'muscles' | 'hydration' | 'breathing';

type ConcernLevel = 'Good' | 'Caution' | 'High Stress';

interface AreaInfo {
  id: BodyArea;
  label: string;
  subLabel: string;
  icon: React.ElementType;
  hotspotY: number; // percentage on SVG
  hotspotX: number;
  concernLevel: ConcernLevel;
  concernColor: string;
  howHeatAffects: string;
  whatYouCanDo: string[];
}

export const HeatAndBodyView: React.FC<HeatAndBodyViewProps> = ({
  onNavigateToEmergency,
}) => {
  const [selectedArea, setSelectedArea] = useState<BodyArea>('heart');

  const bodyAreas: Record<BodyArea, AreaInfo> = {
    brain: {
      id: 'brain',
      label: 'BRAIN',
      subLabel: 'Central Nervous System',
      icon: Brain,
      hotspotX: 50,
      hotspotY: 12,
      concernLevel: 'High Stress',
      concernColor: '#EF4444',
      howHeatAffects:
        'When core body temperature rises, blood flow is redirected toward the skin to release heat. This can temporarily reduce blood flow to the brain, causing dizziness, headaches, slower thinking, and irritability.',
      whatYouCanDo: [
        'Move to a shaded or air-conditioned room immediately.',
        'Apply a cool, damp cloth to your forehead and the back of your neck.',
        'Rest with your head supported and sip cool water slowly.',
      ],
    },
    breathing: {
      id: 'breathing',
      label: 'BREATHING',
      subLabel: 'Respiratory System & Lungs',
      icon: Wind,
      hotspotX: 50,
      hotspotY: 30,
      concernLevel: 'Caution',
      concernColor: '#F97316',
      howHeatAffects:
        'Hot, humid air requires more effort to breathe. The body increases its breathing rate to release warm air and moisture, which can make you feel breathless and dry out airway passages.',
      whatYouCanDo: [
        'Slow down physical exertion and sit upright in well-ventilated shade.',
        'Take slow, deep breaths through your nose to humidify inhaled air.',
        'Avoid outdoor exercise during the hottest hours of the afternoon.',
      ],
    },
    heart: {
      id: 'heart',
      label: 'HEART',
      subLabel: 'Cardiovascular System',
      icon: Heart,
      hotspotX: 47,
      hotspotY: 36,
      concernLevel: 'High Stress',
      concernColor: '#EF4444',
      howHeatAffects:
        'Your heart works significantly harder in high heat. Blood vessels near the skin expand to dissipate heat, causing your pulse to race as the heart pumps extra blood to keep your temperature safe.',
      whatYouCanDo: [
        'Sit or lie down in a cool space to take immediate workload off your heart.',
        'Drink cool water to maintain proper blood volume and steady circulation.',
        'Loosen tight clothing to encourage natural heat release.',
      ],
    },
    hydration: {
      id: 'hydration',
      label: 'HYDRATION',
      subLabel: 'Fluid & Kidney Balance',
      icon: Droplets,
      hotspotX: 50,
      hotspotY: 50,
      concernLevel: 'Caution',
      concernColor: '#F97316',
      howHeatAffects:
        'Sweating expels essential water and electrolytes (salt and potassium). If lost fluids are not replenished quickly, dehydration sets in, placing stress on the kidneys and causing fatigue.',
      whatYouCanDo: [
        'Drink water regularly in small sips throughout the day before feeling thirsty.',
        'Add coconut water, salted lemonade, or ORS to replace lost electrolytes.',
        'Check urine color: pale yellow indicates healthy hydration.',
      ],
    },
    muscles: {
      id: 'muscles',
      label: 'MUSCLES',
      subLabel: 'Skeletal Muscle Groups',
      icon: Activity,
      hotspotX: 50,
      hotspotY: 72,
      concernLevel: 'Caution',
      concernColor: '#F97316',
      howHeatAffects:
        'Loss of sodium and potassium through sweat can cause painful, involuntary muscle spasms (heat cramps), commonly affecting calves, thighs, and abdominal muscles during activity.',
      whatYouCanDo: [
        'Stop all strenuous activity immediately and rest in a cool place.',
        'Gently stretch and massage the affected muscle group.',
        'Drink water containing electrolytes or a light pinch of salt.',
      ],
    },
  };

  const currentArea = bodyAreas[selectedArea];

  // 6 Early Warning Signs cards
  const warningSigns = [
    {
      title: 'Headache',
      icon: Brain,
      description: 'A dull or throbbing ache caused by dehydration and expanded blood vessels.',
    },
    {
      title: 'Dizziness',
      icon: Activity,
      description: 'Feeling lightheaded when standing, due to blood pooling near the skin surface.',
    },
    {
      title: 'Weakness',
      icon: Shield,
      description: 'Sudden heavy fatigue as your body expends energy trying to keep core temperature down.',
    },
    {
      title: 'Heavy Sweating',
      icon: Droplets,
      description: 'Your body’s cooling mechanism working at maximum capacity to shed excess heat.',
    },
    {
      title: 'Nausea',
      icon: Wind,
      description: 'Stomach queasiness or loss of appetite as blood flow shifts away from digestion.',
    },
    {
      title: 'Confusion',
      icon: AlertTriangle,
      description: 'Difficulty concentrating or mild brain fog when heat stress starts affecting your nervous system.',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEAT & BODY HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight">
            Heat & Your Body
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Understand how heat can affect your body.
          </p>
        </div>
      </div>

      {/* 2. MAIN VISUAL & INTERACTIVE BODY SECTION */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-6 lg:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: Human Body Vector Illustration with Interactive Hotspots */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0]">
            
            {/* Visual Legend Header */}
            <div className="w-full flex items-center justify-between mb-4 px-2">
              <span className="text-xs font-semibold text-[#475569] tracking-wide uppercase">
                HUMAN THERMAL RESPONSE
              </span>
              <div className="flex items-center gap-3 text-xs font-normal">
                <span className="flex items-center gap-1 text-[#334155]">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0"></span>
                  Good
                </span>
                <span className="flex items-center gap-1 text-[#334155]">
                  <span className="w-2 h-2 rounded-full bg-[#F97316] shrink-0"></span>
                  Caution
                </span>
                <span className="flex items-center gap-1 text-[#334155]">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0"></span>
                  High Stress
                </span>
              </div>
            </div>

            {/* Medical-style Clean Vector Human Body Illustration */}
            <div className="relative w-64 h-[380px] flex items-center justify-center">
              <svg
                viewBox="0 0 200 400"
                className="w-full h-full drop-shadow-xs select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Defs for subtle gradients */}
                <defs>
                  <linearGradient id="bodyBaseGrad" x1="100" y1="20" x2="100" y2="380" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#E0EDFD" />
                    <stop offset="35%" stopColor="#DBEAFE" />
                    <stop offset="70%" stopColor="#E2E8F0" />
                    <stop offset="100%" stopColor="#E0EDFD" />
                  </linearGradient>

                  <linearGradient id="headGrad" x1="100" y1="25" x2="100" y2="75" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={selectedArea === 'brain' ? '#FEE2E2' : '#EFF6FF'} />
                    <stop offset="100%" stopColor={selectedArea === 'brain' ? '#FECACA' : '#DBEAFE'} />
                  </linearGradient>

                  <linearGradient id="chestGrad" x1="100" y1="95" x2="100" y2="175" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={selectedArea === 'heart' || selectedArea === 'breathing' ? '#FFEDD5' : '#EFF6FF'} />
                    <stop offset="100%" stopColor={selectedArea === 'heart' || selectedArea === 'breathing' ? '#FED7AA' : '#DBEAFE'} />
                  </linearGradient>

                  <linearGradient id="coreGrad" x1="100" y1="175" x2="100" y2="230" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={selectedArea === 'hydration' ? '#FFEDD5' : '#EFF6FF'} />
                    <stop offset="100%" stopColor={selectedArea === 'hydration' ? '#FED7AA' : '#DBEAFE'} />
                  </linearGradient>

                  <filter id="softGaze" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* --- Anatomical Outline Silhouettes --- */}

                {/* Head */}
                <path
                  d="M100 25 C84 25 72 38 72 55 C72 70 82 82 93 86 L93 96 L107 96 L107 86 C118 82 128 70 128 55 C128 38 116 25 100 25 Z"
                  fill="url(#headGrad)"
                  stroke={selectedArea === 'brain' ? '#EF4444' : '#93C5FD'}
                  strokeWidth={selectedArea === 'brain' ? '2.5' : '1.5'}
                  className="transition-all duration-300"
                />

                {/* Torso / Upper Chest */}
                <path
                  d="M93 96 C78 98 62 108 55 125 L40 185 C38 193 43 200 50 200 C56 200 61 195 63 189 L72 148 L72 225 L128 225 L128 148 L137 189 C139 195 144 200 150 200 C157 200 162 193 160 185 L145 125 C138 108 122 98 107 96 Z"
                  fill="url(#chestGrad)"
                  stroke={
                    selectedArea === 'heart' || selectedArea === 'breathing'
                      ? '#F97316'
                      : '#93C5FD'
                  }
                  strokeWidth={selectedArea === 'heart' || selectedArea === 'breathing' ? '2.5' : '1.5'}
                  className="transition-all duration-300"
                />

                {/* Abdomen / Pelvis Core */}
                <path
                  d="M72 225 L72 245 C72 258 82 268 96 270 L96 272 L104 272 L104 270 C118 268 128 258 128 245 L128 225 Z"
                  fill="url(#coreGrad)"
                  stroke={selectedArea === 'hydration' ? '#F97316' : '#93C5FD'}
                  strokeWidth={selectedArea === 'hydration' ? '2.5' : '1.5'}
                  className="transition-all duration-300"
                />

                {/* Left Leg */}
                <path
                  d="M74 250 L68 320 C67 332 70 348 70 365 L66 376 C65 379 67 382 71 382 L84 382 C88 382 90 378 88 375 L84 362 C85 348 88 332 88 320 L94 270 Z"
                  fill="#EFF6FF"
                  stroke={selectedArea === 'muscles' ? '#F97316' : '#93C5FD'}
                  strokeWidth={selectedArea === 'muscles' ? '2.5' : '1.5'}
                  className="transition-all duration-300"
                />

                {/* Right Leg */}
                <path
                  d="M126 250 L132 320 C133 332 130 348 130 365 L134 376 C135 379 133 382 129 382 L116 382 C112 382 110 378 112 375 L116 362 C115 348 112 332 112 320 L106 270 Z"
                  fill="#EFF6FF"
                  stroke={selectedArea === 'muscles' ? '#F97316' : '#93C5FD'}
                  strokeWidth={selectedArea === 'muscles' ? '2.5' : '1.5'}
                  className="transition-all duration-300"
                />

                {/* --- Internal Organ Subtle Visual Indicators --- */}

                {/* Brain Graphic */}
                <circle
                  cx="100"
                  cy="50"
                  r="14"
                  fill={selectedArea === 'brain' ? '#FCA5A5' : '#BFDBFE'}
                  opacity="0.85"
                />

                {/* Lungs Graphic */}
                <ellipse
                  cx="88"
                  cy="125"
                  rx="9"
                  ry="14"
                  fill={selectedArea === 'breathing' ? '#FDBA74' : '#BFDBFE'}
                  opacity="0.8"
                />
                <ellipse
                  cx="112"
                  cy="125"
                  rx="9"
                  ry="14"
                  fill={selectedArea === 'breathing' ? '#FDBA74' : '#BFDBFE'}
                  opacity="0.8"
                />

                {/* Heart Graphic */}
                <circle
                  cx="95"
                  cy="140"
                  r="10"
                  fill={selectedArea === 'heart' ? '#EF4444' : '#F87171'}
                  opacity={selectedArea === 'heart' ? '1' : '0.75'}
                  className={selectedArea === 'heart' ? 'animate-pulse' : ''}
                />

                {/* Hydration / Kidneys */}
                <ellipse
                  cx="86"
                  cy="195"
                  rx="6"
                  ry="9"
                  fill={selectedArea === 'hydration' ? '#FB923C' : '#93C5FD'}
                  opacity="0.85"
                />
                <ellipse
                  cx="114"
                  cy="195"
                  rx="6"
                  ry="9"
                  fill={selectedArea === 'hydration' ? '#FB923C' : '#93C5FD'}
                  opacity="0.85"
                />

                {/* Muscle Bands on Legs */}
                <path
                  d="M72 300 Q80 305 88 300 M112 300 Q120 305 128 300"
                  stroke={selectedArea === 'muscles' ? '#F97316' : '#93C5FD'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.85"
                />

                {/* Interactive Hotspot Targets with Click Rings */}
                {/* 1. Brain (y: 50) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedArea('brain')}
                >
                  <circle cx="100" cy="50" r="16" fill="transparent" />
                  {selectedArea === 'brain' && (
                    <circle cx="100" cy="50" r="22" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" className="animate-spin" />
                  )}
                  <circle cx="100" cy="50" r="5" fill="#EF4444" />
                </g>

                {/* 2. Breathing (y: 122) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedArea('breathing')}
                >
                  <circle cx="100" cy="122" r="16" fill="transparent" />
                  {selectedArea === 'breathing' && (
                    <circle cx="100" cy="122" r="20" stroke="#F97316" strokeWidth="2" strokeDasharray="3 3" className="animate-spin" />
                  )}
                  <circle cx="100" cy="122" r="5" fill="#F97316" />
                </g>

                {/* 3. Heart (y: 142) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedArea('heart')}
                >
                  <circle cx="95" cy="142" r="16" fill="transparent" />
                  {selectedArea === 'heart' && (
                    <circle cx="95" cy="142" r="22" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" className="animate-spin" />
                  )}
                  <circle cx="95" cy="142" r="5" fill="#EF4444" />
                </g>

                {/* 4. Hydration (y: 195) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedArea('hydration')}
                >
                  <circle cx="100" cy="195" r="16" fill="transparent" />
                  {selectedArea === 'hydration' && (
                    <circle cx="100" cy="195" r="20" stroke="#F97316" strokeWidth="2" strokeDasharray="3 3" className="animate-spin" />
                  )}
                  <circle cx="100" cy="195" r="5" fill="#F97316" />
                </g>

                {/* 5. Muscles (y: 295) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedArea('muscles')}
                >
                  <circle cx="100" cy="295" r="22" fill="transparent" />
                  {selectedArea === 'muscles' && (
                    <circle cx="100" cy="295" r="24" stroke="#F97316" strokeWidth="2" strokeDasharray="3 3" className="animate-spin" />
                  )}
                  <circle cx="100" cy="295" r="5" fill="#F97316" />
                </g>
              </svg>
            </div>

            <p className="text-xs text-[#64748B] font-normal mt-2 text-center">
              Select a hotspot to understand how heat may affect the body.
            </p>
          </div>

          {/* RIGHT: Interactive Selectors & Detail Card */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Area Selection Buttons */}
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-[#64748B] block mb-2.5">
                Select Body Area to Inspect
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {(Object.keys(bodyAreas) as BodyArea[]).map((key) => {
                  const item = bodyAreas[key];
                  const Icon = item.icon;
                  const isSelected = selectedArea === key;

                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedArea(key)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] shadow-xs'
                          : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#17233C] hover:border-slate-300'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mb-1.5 ${
                          isSelected ? 'text-[#2563EB]' : 'text-[#64748B]'
                        }`}
                      />
                      <span className="text-xs font-medium tracking-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Area Dynamic Info Card */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 space-y-5">
              
              {/* Header of the info card */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] shadow-2xs">
                    <currentArea.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#17233C]">
                      {currentArea.label}
                    </h3>
                    <p className="text-xs text-[#64748B] font-normal">{currentArea.subLabel}</p>
                  </div>
                </div>

                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                    currentArea.concernLevel === 'High Stress'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : currentArea.concernLevel === 'Caution'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {currentArea.concernLevel}
                </span>
              </div>

              {/* 1. HOW HEAT AFFECTS THIS AREA */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
                  HOW HEAT AFFECTS THIS AREA
                </span>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed font-normal">
                  {currentArea.howHeatAffects}
                </p>
              </div>

              {/* 2. WHAT YOU CAN DO */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#16A34A]">
                  WHAT YOU CAN DO
                </span>
                <div className="space-y-1.5">
                  {currentArea.whatYouCanDo.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-[#334155]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                      <span className="font-normal">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. EARLY WARNING SIGNS */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#17233C]">
            EARLY WARNING SIGNS
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Recognize the early bodily cues of heat-related illness before they escalate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {warningSigns.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex items-start gap-3.5 hover:border-blue-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-bold text-[#17233C]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. HYDRATION SECTION */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 shadow-2xs">
              <Droplets className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-[#17233C]">
                Hydration Guidance
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] max-w-xl leading-relaxed">
                Drink water steadily throughout the day. In high outdoor temperatures, aim for small frequent sips rather than large quantities all at once. Replace electrolytes if sweating continuously.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#F7F9FC] px-4 py-3 rounded-xl border border-[#E2E8F0] shrink-0">
            <Info className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span className="text-xs text-[#17233C] font-medium">
              Tip: Pale, clear urine is the easiest sign of healthy hydration.
            </span>
          </div>
        </div>
      </div>

      {/* 5. WHEN TO GET HELP (LIGHT RED CARD) */}
      <div className="bg-[#FEF2F2] rounded-2xl border border-[#FECACA] p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-200 text-[#EF4444] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#EF4444]">
              EMERGENCY GUIDANCE
            </span>
            <h2 className="text-lg font-black text-[#17233C]">
              WHEN TO GET HELP
            </h2>
            <p className="text-xs sm:text-sm text-[#17233C] leading-relaxed">
              If someone develops hot, dry skin (or stops sweating altogether), experiences severe confusion, vomiting, slurred speech, or loses consciousness, this is a medical emergency.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="bg-white/90 rounded-xl p-3 border border-red-100 text-xs text-[#17233C] flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0" />
            <span>Call local emergency medical services immediately (e.g. 108 / 112 / 911).</span>
          </div>
          <div className="bg-white/90 rounded-xl p-3 border border-red-100 text-xs text-[#17233C] flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0" />
            <span>Move them to shade, apply ice or cool water to armpits and neck while waiting.</span>
          </div>
        </div>

        {onNavigateToEmergency && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={onNavigateToEmergency}
              className="px-4 py-2 rounded-xl bg-[#EF4444] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Open Emergency Assistance</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
