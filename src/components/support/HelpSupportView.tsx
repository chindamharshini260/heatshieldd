/**
 * HeatShield AI - Page 15: Help & Support
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. Title: "Help & Support"
 * 2. Emergency Notice Banner (Redirect to Emergency Protocol)
 * 3. FAQ Accordion (5 core thermal questions)
 * 4. Contact & Feedback Support Form
 */

import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  AlertOctagon,
  Send,
  CheckCircle2,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';

interface HelpSupportViewProps {
  onNavigateToEmergency?: () => void;
}

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({
  onNavigateToEmergency,
}) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const faqs = [
    {
      q: 'How does HeatShield AI calculate the Heat Risk Score (0-100)?',
      a: 'HeatShield utilizes a multi-factor physiological model combining dry-bulb ambient temperature, relative air humidity, solar radiation irradiance, wind speed, and nocturnal minimum temperatures. It computes Wet Bulb Globe Temperature (WBGT) and NOAA Heat Index equivalents to quantify physiological human strain rather than simple raw air heat.',
    },
    {
      q: 'What is the scientific difference between Temperature and "Feels Like"?',
      a: '"Temperature" is the actual kinetic energy of air molecules measured by a thermometer in the shade. "Feels Like" (Apparent Temperature) accounts for relative humidity. High humidity blocks sweat from evaporating into the air, preventing natural skin cooling and making the air feel substantially hotter and more dangerous to the human body.',
    },
    {
      q: 'How should I use the "Plan My Day" activity schedule?',
      a: 'The Plan My Day engine models the diurnal curve for your exact GPS location to identify when solar radiation and apparent heat are at their lowest (usually 5:30 AM – 8:30 AM and after 6:00 PM). Schedule heavy physical workouts, grocery trips, and transit during green windows, and rest indoors during red peak hours (11:30 AM – 4:30 PM).',
    },
    {
      q: 'Where does HeatShield fetch live atmospheric and forecast data?',
      a: 'Live meteorological observations and 7-day hourly forecasts are streamed in real time via the Open-Meteo High-Resolution Ensemble API, utilizing national weather service radars and ECMWF numerical weather prediction feeds.',
    },
    {
      q: 'What should I do when an "Extreme" (Score 85-100) alert is issued?',
      a: 'Cancel all non-essential outdoor physical activity immediately. Stay inside an air-conditioned room or municipal cooling shelter. Drink 500ml of electrolyte-rich fluids hourly, keep blinds drawn, and check on elderly neighbors and outdoor workers.',
    },
  ];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setFeedbackText('');
    setTimeout(() => setFeedbackSent(false), 3500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight">
            Help & Support
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Frequently asked questions, usage documentation, and technical support
          </p>
        </div>
      </div>

      {/* CRITICAL EMERGENCY BANNER */}
      <div className="bg-[#FEF2F2] rounded-2xl border border-rose-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-rose-950">Experiencing a medical heat emergency?</h3>
            <p className="text-xs text-rose-900">
              For loss of consciousness, confusion, seizures, or stopped sweating, call emergency services immediately.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:108"
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 108</span>
          </a>
          {onNavigateToEmergency && (
            <button
              onClick={onNavigateToEmergency}
              className="px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-800 text-xs font-bold hover:bg-rose-50 cursor-pointer"
            >
              Emergency Help
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FAQ ACCORDION (LEFT) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#17233C] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#E2E8F0] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#17233C] flex items-center justify-between gap-3 hover:bg-[#F7F9FC] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 bg-[#F7F9FC]/60 border-t border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FEEDBACK & CONTACT FORM (RIGHT) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#17233C] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Contact Support & Feedback</span>
            </h2>
            <p className="text-xs text-[#64748B]">
              Have a feature request or need help configuring station feeds? Send a note to our engineering team.
            </p>

            <form onSubmit={handleSendFeedback} className="space-y-3 pt-2">
              <textarea
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Describe your issue or suggest an improvement..."
                required
                className="w-full p-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs text-[#17233C] focus:outline-none focus:border-blue-500 resize-none"
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>

              {feedbackSent && (
                <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#14532D] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>Thank you! Your feedback has been received.</span>
                </div>
              )}
            </form>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs text-[#64748B] space-y-1">
            <span className="font-bold text-[#17233C] block">Direct Contact:</span>
            <div>Email: <strong className="text-blue-600">support@heatshield-ai.org</strong></div>
            <div>Disaster Management Helpline: <strong className="text-[#17233C]">1077 / 108</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
