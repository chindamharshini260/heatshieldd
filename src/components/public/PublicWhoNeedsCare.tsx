import React, { useState } from 'react';
import {
  Users,
  Heart,
  Baby,
  HardHat,
  Home,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Shield
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface PublicWhoNeedsCareProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const PublicWhoNeedsCare: React.FC<PublicWhoNeedsCareProps> = ({
  city,
  wardProfiles
}) => {
  const [activeGroup, setActiveGroup] = useState<string>('elderly');

  const groups = [
    {
      id: 'elderly',
      title: 'Elderly People (60+ Years)',
      subtitle: 'Slower sweat response & cardiovascular stress',
      icon: <Heart className="w-5 h-5 text-rose-600" />,
      color: 'bg-rose-50 border-rose-200 text-rose-900',
      description:
        'As people age, the body takes longer to sense rising heat and produces less sweat. Existing heart or blood pressure medications can also speed up dehydration.',
      warningSigns: [
        'Sudden confusion, dizziness, or slurred speech',
        'Dry, hot skin without sweating',
        'Rapid, weak heartbeat or shortness of breath',
        'Extreme tiredness or fainting'
      ],
      actions: [
        'Check on elderly parents and neighbors at least twice a day.',
        'Wipe their forehead, neck, and arms with a cool damp cloth.',
        'Keep medicines stored below 30°C away from direct sunlight.',
        'Ensure they drink small sips of water every 30 minutes.'
      ]
    },
    {
      id: 'workers',
      title: 'Outdoor & Construction Workers',
      subtitle: 'Continuous direct sun exposure & physical exertion',
      icon: <HardHat className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      description:
        'Construction workers, street vendors, delivery agents, and sanitation staff generate intense internal muscle heat while absorbing external heat radiation.',
      warningSigns: [
        'Heavy sweating followed by sudden nausea',
        'Muscle cramps in legs or abdomen',
        'Clumsiness, disorientation, or headache',
        'Dark amber or brown urine (severe dehydration)'
      ],
      actions: [
        'Pause heavy physical tasks between 11:30 AM and 4:30 PM.',
        'Drink 1 glass of water or ORS every 20 minutes.',
        'Rest in shaded areas with moving air/fans.',
        'Wear wide-brim hats, cotton towels, and light clothing.'
      ]
    },
    {
      id: 'children',
      title: 'Infants & Young Children',
      subtitle: 'Body heats up 3 to 5 times faster than adults',
      icon: <Baby className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      description:
        'Children have a smaller body mass and lower sweat rate, making them heat up very quickly when playing outside or sitting in closed vehicles.',
      warningSigns: [
        'Unusual fussiness, extreme lethargy, or crying without tears',
        'Sunken eyes or dry tongue and lips',
        'High fever with no sweat',
        'Vomiting or refusal to drink liquids'
      ],
      actions: [
        'Never leave a child unattended inside a parked car, even with open windows.',
        'Dress babies in single-layer loose cotton garments.',
        'Offer breastmilk or clean water frequently throughout the day.',
        'Keep play sessions restricted to early morning before 9 AM.'
      ]
    },
    {
      id: 'health_conditions',
      title: 'People with Medical Conditions',
      subtitle: 'Heart, kidney, respiratory, or diabetes conditions',
      icon: <Users className="w-5 h-5 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      description:
        'Extreme heat forces the heart to pump twice as hard to push blood toward the skin for cooling, placing severe strain on weak hearts and kidneys.',
      warningSigns: [
        'Chest discomfort or palpitations',
        'Swollen ankles or severe breathlessness',
        'Extreme muscle weakness or low blood pressure'
      ],
      actions: [
        'Consult your doctor about water intake limits if you have kidney or heart issues.',
        'Never skip prescribed blood pressure or heart medications.',
        'Stay strictly in cool indoor environments during peak afternoon hours.'
      ]
    },
    {
      id: 'uninsulated_homes',
      title: 'Homes Without Cooling or Tin Roofs',
      subtitle: 'Indoor heat trap & nighttime recovery failure',
      icon: <Home className="w-5 h-5 text-teal-600" />,
      color: 'bg-teal-50 border-teal-200 text-teal-900',
      description:
        'Tin, asbestos, and uninsulated brick rooms can become 4°C to 7°C hotter inside than outside, especially in informal settlements.',
      warningSigns: [
        'Persistent indoor headaches and inability to sleep',
        'Suffocation sensation from trapped stagnant air'
      ],
      actions: [
        'Cover tin roofs with wet gunny bags or apply white lime paint.',
        'Open opposite windows at night to create cool cross-breeze.',
        'Visit neighborhood community halls or cooling centers during peak heat.'
      ]
    }
  ];

  const selected = groups.find((g) => g.id === activeGroup) || groups[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              High-Risk Groups
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">
              Who Needs Extra Care in Extreme Heat?
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Some people are affected by extreme heat much more quickly than others. Here is how you can protect them.
            </p>
          </div>
        </div>
      </div>

      {/* Group Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {groups.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGroup(g.id)}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
              activeGroup === g.id
                ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="p-2 rounded-lg bg-slate-50 w-fit">{g.icon}</div>
            <div className="font-bold text-xs text-slate-900 leading-snug">{g.title.split('(')[0]}</div>
            <div className="text-[10px] text-slate-500 line-clamp-1">{g.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Selected Group Deep Dive Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            {selected.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{selected.title}</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{selected.subtitle}</p>
          </div>
        </div>

        {/* Why they are vulnerable */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Why is this group at higher risk?
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {selected.description}
          </p>
        </div>

        {/* Two Columns: Warning Signs vs What You Can Do */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Warning Signs */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-rose-950 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Danger Signs to Watch For
            </h4>
            <ul className="space-y-2">
              {selected.warningSigns.map((sign, idx) => (
                <li key={idx} className="text-xs text-rose-900 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Checklist */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              What You Should Do
            </h4>
            <ul className="space-y-2">
              {selected.actions.map((act, idx) => (
                <li key={idx} className="text-xs text-emerald-900 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
