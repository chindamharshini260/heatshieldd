/**
 * HeatShield AI - Page 13: My Heat Profile
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. Title: "My Heat Profile"
 * 2. Header Card: YOUR PERSONALIZED HEAT VULNERABILITY SCORE (Updates dynamically)
 * 3. Interactive Profile Form:
 *    - Age Group
 *    - Occupation / Work Environment
 *    - Daily Commute Type
 *    - Living Space / Home Cooling
 *    - Pregnancy Status
 *    - Chronic Health Conditions (Checkboxes)
 * 4. Real-Time Personalized Recommendations Card
 * 5. Local Storage Persistence & Save Confirmation
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Heart,
  Briefcase,
  Home,
  Car,
  Save,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
} from 'lucide-react';
import { CompleteWeatherData } from '../../types/weather';
import { getRiskLevelInfo } from '../../utils/heatRiskSystem';

interface MyHeatProfileViewProps {
  weatherData: CompleteWeatherData | null;
}

interface ProfileState {
  ageGroup: 'child' | 'young_adult' | 'adult' | 'senior';
  occupation: 'ac_indoor' | 'fan_indoor' | 'outdoor_worker' | 'driver_delivery';
  commute: 'ac_vehicle' | 'public_transit' | 'two_wheeler_walk';
  livingSpace: 'ac_home' | 'cooler_fan' | 'tin_roof_top_floor';
  isPregnant: boolean;
  hasHeartCondition: boolean;
  hasDiabetes: boolean;
  hasKidneyCondition: boolean;
  hasRespiratoryCondition: boolean;
  hasHypertension: boolean;
}

export const MyHeatProfileView: React.FC<MyHeatProfileViewProps> = ({ weatherData }) => {
  const [profile, setProfile] = useState<ProfileState>({
    ageGroup: 'adult',
    occupation: 'fan_indoor',
    commute: 'two_wheeler_walk',
    livingSpace: 'cooler_fan',
    isPregnant: false,
    hasHeartCondition: false,
    hasDiabetes: false,
    hasKidneyCondition: false,
    hasRespiratoryCondition: false,
    hasHypertension: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('heatshield_user_profile');
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Calculate dynamic vulnerability score (0-100)
  const calculatePersonalScore = () => {
    let score = weatherData?.analysis?.riskScore || 45;

    // Age adjustment
    if (profile.ageGroup === 'senior') score += 18;
    else if (profile.ageGroup === 'child') score += 14;

    // Occupation adjustment
    if (profile.occupation === 'outdoor_worker') score += 25;
    else if (profile.occupation === 'driver_delivery') score += 20;
    else if (profile.occupation === 'fan_indoor') score += 8;
    else if (profile.occupation === 'ac_indoor') score -= 10;

    // Commute adjustment
    if (profile.commute === 'two_wheeler_walk') score += 10;
    else if (profile.commute === 'public_transit') score += 5;
    else if (profile.commute === 'ac_vehicle') score -= 5;

    // Living space adjustment
    if (profile.livingSpace === 'tin_roof_top_floor') score += 15;
    else if (profile.livingSpace === 'cooler_fan') score += 5;
    else if (profile.livingSpace === 'ac_home') score -= 10;

    // Health factors
    if (profile.isPregnant) score += 15;
    if (profile.hasHeartCondition) score += 15;
    if (profile.hasKidneyCondition) score += 14;
    if (profile.hasDiabetes) score += 8;
    if (profile.hasRespiratoryCondition) score += 8;
    if (profile.hasHypertension) score += 8;

    return Math.min(99, Math.max(10, score));
  };

  const personalScore = calculatePersonalScore();
  const riskInfo = getRiskLevelInfo(personalScore);

  const handleSave = () => {
    try {
      localStorage.setItem('heatshield_user_profile', JSON.stringify(profile));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight">
            My Heat Profile
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Personalize physiological heat sensitivity models to your daily lifestyle and health profile
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save My Profile</span>
            </>
          )}
        </button>
      </div>

      {/* DYNAMIC PERSONAL RISK SCORE BANNER */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black text-white shadow-md shrink-0"
            style={{ backgroundColor: riskInfo.color }}
          >
            <span className="text-2xl leading-none">{personalScore}</span>
            <span className="text-[9px] uppercase tracking-wider opacity-90">/ 100</span>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
              Your Calculated Personal Heat Risk
            </span>
            <h2 className="text-xl font-black text-[#17233C]">
              {riskInfo.label} Thermal Vulnerability
            </h2>
            <p className="text-xs text-[#64748B]">{riskInfo.shortAdvice}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs text-[#17233C] max-w-sm space-y-1">
          <span className="font-bold block text-blue-600">Personalized Adjustment Active</span>
          <p className="text-[#64748B] text-[11px]">
            Your baseline risk is dynamically adjusted based on your selected age, workplace conditions, and health status.
          </p>
        </div>
      </div>

      {/* PROFILE FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: LIFESTYLE & ENVIRONMENT */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-base text-[#17233C] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span>Lifestyle & Exposure Environment</span>
          </h3>

          {/* Age Group */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17233C]">Age Group</label>
            <select
              value={profile.ageGroup}
              onChange={(e) => setProfile({ ...profile, ageGroup: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-medium text-[#17233C] focus:outline-none focus:border-blue-500"
            >
              <option value="child">Child / Youth (Under 16 years)</option>
              <option value="young_adult">Young Adult (16–29 years)</option>
              <option value="adult">Adult (30–59 years)</option>
              <option value="senior">Senior Citizen (60+ years)</option>
            </select>
          </div>

          {/* Occupation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17233C]">Workplace Environment</label>
            <select
              value={profile.occupation}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-medium text-[#17233C] focus:outline-none focus:border-blue-500"
            >
              <option value="ac_indoor">Air-Conditioned Indoor Office</option>
              <option value="fan_indoor">Naturally Ventilated / Fan-Cooled Indoors</option>
              <option value="driver_delivery">Delivery Courier / Auto / Taxi Driver</option>
              <option value="outdoor_worker">Outdoor Construction / Agricultural Labour</option>
            </select>
          </div>

          {/* Commute */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17233C]">Primary Daily Commute</label>
            <select
              value={profile.commute}
              onChange={(e) => setProfile({ ...profile, commute: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-medium text-[#17233C] focus:outline-none focus:border-blue-500"
            >
              <option value="ac_vehicle">AC Car or Metro Rail</option>
              <option value="public_transit">Public Bus / Shared Van</option>
              <option value="two_wheeler_walk">Two-Wheeler (Motorcycle/Scooter) or Walking</option>
            </select>
          </div>

          {/* Living Space */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#17233C]">Home Cooling & Architecture</label>
            <select
              value={profile.livingSpace}
              onChange={(e) => setProfile({ ...profile, livingSpace: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-medium text-[#17233C] focus:outline-none focus:border-blue-500"
            >
              <option value="ac_home">Air-Conditioned Apartment / House</option>
              <option value="cooler_fan">Desert Air Cooler / Ceiling Fans</option>
              <option value="tin_roof_top_floor">Top Floor / Tin / Asbestos Sheet Roof</option>
            </select>
          </div>
        </div>

        {/* SECTION 2: HEALTH & VULNERABILITY */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-base text-[#17233C] flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600" />
            <span>Health & Physiological Vulnerabilities</span>
          </h3>

          <div className="space-y-3">
            {/* Pregnancy Checkbox */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] cursor-pointer hover:border-blue-200">
              <span className="text-xs font-semibold text-[#17233C]">Currently Pregnant</span>
              <input
                type="checkbox"
                checked={profile.isPregnant}
                onChange={(e) => setProfile({ ...profile, isPregnant: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </label>

            {/* Heart */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] cursor-pointer hover:border-blue-200">
              <span className="text-xs font-semibold text-[#17233C]">Cardiovascular / Heart Condition</span>
              <input
                type="checkbox"
                checked={profile.hasHeartCondition}
                onChange={(e) => setProfile({ ...profile, hasHeartCondition: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </label>

            {/* Hypertension */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] cursor-pointer hover:border-blue-200">
              <span className="text-xs font-semibold text-[#17233C]">High Blood Pressure (Hypertension)</span>
              <input
                type="checkbox"
                checked={profile.hasHypertension}
                onChange={(e) => setProfile({ ...profile, hasHypertension: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </label>

            {/* Diabetes */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] cursor-pointer hover:border-blue-200">
              <span className="text-xs font-semibold text-[#17233C]">Diabetes</span>
              <input
                type="checkbox"
                checked={profile.hasDiabetes}
                onChange={(e) => setProfile({ ...profile, hasDiabetes: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </label>

            {/* Kidney */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] cursor-pointer hover:border-blue-200">
              <span className="text-xs font-semibold text-[#17233C]">Kidney Illness / Reduced Renal Function</span>
              <input
                type="checkbox"
                checked={profile.hasKidneyCondition}
                onChange={(e) => setProfile({ ...profile, hasKidneyCondition: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </label>

            {/* Respiratory */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] cursor-pointer hover:border-blue-200">
              <span className="text-xs font-semibold text-[#17233C]">Asthma / Respiratory Conditions</span>
              <input
                type="checkbox"
                checked={profile.hasRespiratoryCondition}
                onChange={(e) => setProfile({ ...profile, hasRespiratoryCondition: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* REAL-TIME PERSONALIZED RECOMMENDATIONS */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#17233C] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span>Tailored Recommendations for Your Profile</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-[#16A34A] block">
              Target Hydration Intake
            </span>
            <span className="text-sm font-bold text-[#14532D] block">
              {profile.occupation === 'outdoor_worker' ? '4.0 – 4.5 Litres/Day' : '2.5 – 3.2 Litres/Day'}
            </span>
            <p className="text-[11px] text-[#166534]">Includes water, ORS, lemon water, and buttermilk.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-[#EA580C] block">
              Exposure Threshold
            </span>
            <span className="text-sm font-bold text-[#9A3412] block">
              {profile.ageGroup === 'senior' || profile.isPregnant ? 'Max 20 mins midday' : 'Max 45 mins midday'}
            </span>
            <p className="text-[11px] text-[#9A3412]">Mandatory shaded rest intervals between exposure.</p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-blue-700 block">
              Indoor Cooling Priority
            </span>
            <span className="text-sm font-bold text-blue-950 block">
              {profile.livingSpace === 'tin_roof_top_floor' ? 'Seek AC Community Shelter' : 'Fans + Cross Ventilation'}
            </span>
            <p className="text-[11px] text-blue-800">Prevent indoor heat accumulation during peak afternoon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
