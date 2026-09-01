/**
 * Help & Public Heat Guide - Phase 1
 * Explains feels-like temperature, basic hydration tips, and emergency helplines
 */

import React from 'react';
import {
  HelpCircle,
  Thermometer,
  Droplets,
  Sun,
  PhoneCall,
  ShieldAlert,
  HeartPulse,
  Clock,
  Sparkles,
} from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Help & Heat Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Simple guidance on how to stay safe during hot weather and understanding heat measurements.
        </p>
      </div>

      {/* Emergency Helplines Card */}
      <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-3xl border border-rose-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <PhoneCall className="w-4 h-4 text-rose-600" />
          <span>Emergency Support Helplines</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-rose-100 shadow-sm text-center">
            <div className="text-2xl font-black text-rose-600">108</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">Emergency Ambulance</div>
            <div className="text-[11px] text-slate-500">For heat stroke & fainting</div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-rose-100 shadow-sm text-center">
            <div className="text-2xl font-black text-amber-600">1077</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">Disaster Management</div>
            <div className="text-[11px] text-slate-500">District emergency control</div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-rose-100 shadow-sm text-center">
            <div className="text-2xl font-black text-blue-600">14567</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">Senior Citizen Care</div>
            <div className="text-[11px] text-slate-500">National elder helpline</div>
          </div>
        </div>
      </div>

      {/* FAQ Questions */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
            <Thermometer className="w-4 h-4 text-rose-500" />
            <span>What does "Feels Like" temperature mean?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The <strong>Feels Like</strong> temperature (apparent temperature) reflects how hot the air actually feels to the human body. When humidity is high, sweat evaporates more slowly, making it feel much hotter and harder for your body to cool itself down compared to dry air.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>How much water should I drink on hot days?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Drink water frequently throughout the day, even before you feel thirsty. Aim for at least 2.5 to 3.5 liters of fluids daily. Carrying traditional fluids like lemon water (Nimbu Paani), coconut water, or buttermilk (Chaas) with a pinch of salt helps maintain electrolytes.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>What are the most dangerous hours of the day?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Direct solar radiation and heat peak between <strong>11:30 AM and 4:30 PM</strong>. Try to finish outdoor chores, market visits, or strenuous workouts in the early morning (before 10:00 AM) or after sunset.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            <span>Recognizing Heat Exhaustion vs Heat Stroke</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
              <div className="font-bold text-amber-900">Heat Exhaustion (Warning)</div>
              <ul className="list-disc list-inside text-amber-800 space-y-0.5">
                <li>Heavy sweating & cool, pale skin</li>
                <li>Dizziness or lightheadedness</li>
                <li>Fast, weak pulse & nausea</li>
                <li><strong>Action:</strong> Move to shade, drink water</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 space-y-1">
              <div className="font-bold text-rose-900">Heat Stroke (Medical Emergency!)</div>
              <ul className="list-disc list-inside text-rose-800 space-y-0.5">
                <li>Very high body temp (&gt;40°C)</li>
                <li>Red, hot, dry skin (no sweating)</li>
                <li>Confusion or loss of consciousness</li>
                <li><strong>Action:</strong> Call 108 immediately, apply ice</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
