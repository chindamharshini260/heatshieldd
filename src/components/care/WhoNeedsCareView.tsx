/**
 * HeatShield AI - Page 10: Who Needs Care?
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. Title: "Who Needs Extra Care?" / "Heat does not affect everyone equally."
 * 2. 5 Vulnerability Cards: Older Adults, Infants & Children, Pregnant Women, Outdoor Workers, Chronic Illness
 *    Each card includes: Demographic Title, Physiological "Why", Actionable "What To Do"
 * 3. Interactive Family & Neighbor Check-In Planner
 */

import React, { useState } from 'react';
import {
  HeartHandshake,
  Users,
  Baby,
  Heart,
  HardHat,
  Stethoscope,
  CheckCircle2,
  Plus,
  Trash2,
  Clock,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { CompleteWeatherData } from '../../types/weather';

interface WhoNeedsCareViewProps {
  weatherData: CompleteWeatherData | null;
}

interface CheckInPerson {
  id: string;
  name: string;
  relation: string;
  phone: string;
  time: string;
  completed: boolean;
}

export const WhoNeedsCareView: React.FC<WhoNeedsCareViewProps> = ({ weatherData }) => {
  const [checkIns, setCheckIns] = useState<CheckInPerson[]>([
    {
      id: 'c-1',
      name: 'Grandmother (Savitri Devi)',
      relation: 'Senior Family Member (Age 74)',
      phone: '+91 98765 43210',
      time: '12:00 PM Midday Check',
      completed: true,
    },
    {
      id: 'c-2',
      name: 'Ramesh (Building Security Guard)',
      relation: 'Outdoor Worker',
      phone: '+91 98765 11223',
      time: '2:30 PM Water Bottle & ORS refill',
      completed: false,
    },
    {
      id: 'c-3',
      name: 'Sister Anita',
      relation: 'Pregnant (3rd Trimester)',
      phone: '+91 98765 99887',
      time: '4:00 PM Hydration & Cooling check',
      completed: false,
    },
  ]);

  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newTime, setNewTime] = useState('1:00 PM');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: CheckInPerson = {
      id: `check-${Date.now()}`,
      name: newName,
      relation: newRelation || 'Family / Neighbor',
      phone: '',
      time: newTime,
      completed: false,
    };

    setCheckIns([...checkIns, newItem]);
    setNewName('');
    setNewRelation('');
    setShowAddForm(false);
  };

  const toggleCheck = (id: string) => {
    setCheckIns(
      checkIns.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  const deleteCheck = (id: string) => {
    setCheckIns(checkIns.filter((c) => c.id !== id));
  };

  const vulnerableGroups = [
    {
      title: 'OLDER ADULTS (65+ YEARS)',
      icon: Users,
      badge: 'High Sensitivity',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      why: 'Aging impairs thirst perception and reduces sweating capability. Blood vessel elasticity is lower, increasing heart strain under thermal loads.',
      whatToDo: 'Check in twice daily. Ensure indoor temperatures stay below 28°C and prompt them to drink water on a set schedule regardless of thirst.',
    },
    {
      title: 'INFANTS & YOUNG CHILDREN',
      icon: Baby,
      badge: 'Rapid Heat Absorption',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      why: 'Children produce more metabolic heat per kg of body weight and sweat less efficiently. Their core temperature rises 3 to 5 times faster than adults.',
      whatToDo: 'NEVER leave a child inside a parked car (even with windows open). Keep infants in cool rooms, dress lightly, and offer frequent breastfeeds or water.',
    },
    {
      title: 'PREGNANT WOMEN',
      icon: Heart,
      badge: 'Thermoregulatory Load',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      why: 'Pregnancy increases blood volume, resting metabolic heat, and dehydration risks. Hyperthermia during pregnancy is linked to preterm labour and fainting.',
      whatToDo: 'Avoid warm kitchens and direct midday outdoor exposure. Keep feet elevated when resting and consume chilled electrolyte fluids daily.',
    },
    {
      title: 'OUTDOOR LABOURERS & DRIVERS',
      icon: HardHat,
      badge: 'Occupational Strain',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      why: 'Physical exertion generates intense internal metabolic heat on top of ambient solar radiation and reflective ground surfaces (asphalt).',
      whatToDo: 'Mandate 15-minute shaded rests every 45 minutes. Provide cool potable water with salt/ORS and reschedule heavy work to early mornings.',
    },
    {
      title: 'PEOPLE WITH CHRONIC CONDITIONS',
      icon: Stethoscope,
      badge: 'Medical Vulnerability',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      why: 'Heart disease, diabetes, kidney conditions, and psychiatric medications (diuretics, beta-blockers, anticholinergics) disrupt natural sweating.',
      whatToDo: 'Review medication heat guidelines with a physician. Monitor daily blood pressure and maintain continuous indoor air-conditioning.',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight">
            Who Needs Extra Care?
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Heat does not affect everyone equally. Tailor safety measures for vulnerable groups.
          </p>
        </div>
      </div>

      {/* 5 VULNERABILITY CARDS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#17233C]">Vulnerable Groups & Health Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vulnerableGroups.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-sm text-[#17233C]">{g.title}</h3>
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${g.badgeColor}`}>
                      {g.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] block">
                      Why They Are At Risk:
                    </span>
                    <p className="text-xs text-[#64748B] leading-relaxed">{g.why}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#16A34A] block">
                    What You Should Do:
                  </span>
                  <p className="text-xs font-semibold text-[#14532D] leading-relaxed">
                    {g.whatToDo}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE CHECK-IN PLANNER */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-base font-bold text-[#17233C] flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-blue-600" />
              <span>Community & Family Heat Check-In Plan</span>
            </h2>
            <p className="text-xs text-[#64748B]">Track daily welfare calls and hydration reminders</p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Person</span>
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddCheckIn} className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] space-y-3 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Person's Name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#17233C] focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Relation (e.g. Senior Neighbor)"
                value={newRelation}
                onChange={(e) => setNewRelation(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#17233C] focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Target Time (e.g. 1:00 PM)"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#17233C] focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-[#64748B] hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
              >
                Save to Checklist
              </button>
            </div>
          </form>
        )}

        {/* Check-In Items List */}
        <div className="space-y-2.5">
          {checkIns.map((person) => (
            <div
              key={person.id}
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                person.completed
                  ? 'bg-[#F0FDF4]/70 border-[#BBF7D0]'
                  : 'bg-[#F7F9FC] border-[#E2E8F0]'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleCheck(person.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    person.completed
                      ? 'bg-[#16A34A] text-white'
                      : 'bg-white border border-[#E2E8F0] text-transparent hover:border-blue-500'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div>
                  <h4 className={`font-bold text-xs sm:text-sm ${person.completed ? 'line-through text-[#64748B]' : 'text-[#17233C]'}`}>
                    {person.name}
                  </h4>
                  <span className="text-[11px] text-[#64748B] block">
                    {person.relation} • Scheduled: {person.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {person.phone && (
                  <a
                    href={`tel:${person.phone}`}
                    className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-blue-600 hover:bg-blue-50 text-xs"
                    title="Call Now"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => deleteCheck(person.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
