/**
 * Personal Heat Profile View
 * Allows users to choose optional lifestyle routines (e.g. outdoor work,
 * athlete, commuting, caring for children/seniors) to customize safety advice.
 * 
 * STRICT PRIVACY: NEVER asks for medical conditions or diagnoses.
 */

import React, { useState } from 'react';
import {
  getUserHeatPreferences,
  saveUserHeatPreferences,
  LifestyleRoutine,
  UserHeatProfilePreferences,
} from '../../services/profilePreferences';
import {
  User,
  Briefcase,
  Activity,
  Car,
  Home,
  Baby,
  Users,
  CheckCircle2,
  Bell,
  Sparkles,
  ShieldCheck,
  Save,
} from 'lucide-react';

interface PersonalHeatProfileViewProps {
  onSavedToast?: () => void;
}

export function PersonalHeatProfileView({ onSavedToast }: PersonalHeatProfileViewProps) {
  const [preferences, setPreferences] = useState<UserHeatProfilePreferences>(
    getUserHeatPreferences()
  );
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const routineOptions: {
    id: LifestyleRoutine;
    label: string;
    description: string;
    icon: any;
  }[] = [
    {
      id: 'outdoor_work',
      label: 'Outdoor Work & Field Operations',
      description: 'Construction, delivery, field engineering, agriculture, security.',
      icon: Briefcase,
    },
    {
      id: 'outdoor_exercise',
      label: 'Outdoor Athletics & Running',
      description: 'Jogging, cycling, outdoor sports, high-exertion training.',
      icon: Activity,
    },
    {
      id: 'commuter',
      label: 'Daily Commute & Travel',
      description: 'Public transit, walking between bus stops, two-wheeler rides.',
      icon: Car,
    },
    {
      id: 'mostly_indoors',
      label: 'Mostly Indoors / Desk Work',
      description: 'Home office, air-conditioned workspaces, indoor activities.',
      icon: Home,
    },
    {
      id: 'caring_children',
      label: 'Caring for Young Children',
      description: 'Parent, guardian, or daycare provider for infants and toddlers.',
      icon: Baby,
    },
    {
      id: 'caring_seniors',
      label: 'Caring for Older Family Members',
      description: 'Looking after parents or elderly relatives living with or near you.',
      icon: Users,
    },
  ];

  const toggleRoutine = (id: LifestyleRoutine) => {
    const exists = preferences.routines.includes(id);
    const updated = exists
      ? preferences.routines.filter((r) => r !== id)
      : [...preferences.routines, id];

    const newPrefs = saveUserHeatPreferences({ routines: updated });
    setPreferences(newPrefs);
    triggerSaved();
  };

  const updateCooling = (cooling: UserHeatProfilePreferences['coolingAccess']) => {
    const newPrefs = saveUserHeatPreferences({ coolingAccess: cooling });
    setPreferences(newPrefs);
    triggerSaved();
  };

  const toggleHydration = () => {
    const newPrefs = saveUserHeatPreferences({
      hydrationRemindersEnabled: !preferences.hydrationRemindersEnabled,
    });
    setPreferences(newPrefs);
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    if (onSavedToast) onSavedToast();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-2 border border-blue-100">
            <User className="w-3.5 h-3.5" />
            <span>Lifestyle Customization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            My Heat Profile
          </h1>
          <p className="text-sm sm:text-base font-normal text-slate-500 mt-1">
            Select your daily routine preferences so HeatShield AI can tailor relevant safety advice for your day.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      {/* Privacy Guarantee Box */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-normal leading-relaxed flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-slate-800">Your Privacy Comes First:</strong> We never ask for medical diagnoses, health records, or sensitive personal data. These routine selections simply highlight practical tips (like rest intervals for outdoor workers or early hydration alerts).
        </div>
      </div>

      {/* Daily Routine Options */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Select Your Daily Routines (Select all that apply)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {routineOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = preferences.routines.includes(opt.id);

            return (
              <button
                key={opt.id}
                onClick={() => toggleRoutine(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/10 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900">
                      {opt.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs font-normal text-slate-500 mt-1 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Cooling Access */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Primary Home Cooling Access
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { id: 'ac', label: 'Air Conditioning' },
            { id: 'evaporative_cooler', label: 'Evaporative Cooler' },
            { id: 'fan_only', label: 'Ceiling / Table Fan' },
            { id: 'limited', label: 'Natural Ventilation' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => updateCooling(c.id as any)}
              className={`p-3 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                preferences.coolingAccess === c.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
