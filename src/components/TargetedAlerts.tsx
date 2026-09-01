import React, { useState } from 'react';
import {
  Bell,
  Languages,
  Send,
  Sparkles,
  Users,
  HardHat,
  HeartPulse,
  GraduationCap,
  MessageSquare,
  Copy,
  Check,
  Building
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../types';

interface TargetedAlertsProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const TargetedAlerts: React.FC<TargetedAlertsProps> = ({
  city,
  wardProfiles
}) => {
  if (!wardProfiles || wardProfiles.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono">
        Loading Targeted Alerts for {city.name}...
      </div>
    );
  }

  const topWard = wardProfiles[0];
  const [selectedPersona, setSelectedPersona] = useState<string>('outdoor_workers');
  const [activeLang, setActiveLang] = useState<'en' | 'hi' | 'regional'>('en');
  const [copied, setCopied] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAlerts, setAiAlerts] = useState<Record<string, { en: string; hi: string; regional: string }>>({
    outdoor_workers: {
      en: `🔴 URGENT HEAT WARNING (${city.name} - ${topWard?.ward?.wardName || 'Central Zone'}): Peak thermal stress (UTCI ${topWard?.currentThermal?.utci || 44}°C). Work shift restrictions active: Stop heavy outdoor exertion between 11:30 AM – 4:30 PM. Drink 1 cup water/ORS every 20 mins. Cooling center open at Ward Bhavan.`,
      hi: `🔴 अत्यधिक गर्मी की चेतावनी (${city.name} - ${topWard?.ward?.wardName || 'Central Zone'}): दोपहर 11:30 से 4:30 बजे के बीच भारी काम रोकें। हर 20 मिनट में ओआरएस/पानी पिएं। वार्ड भवन में शीतल केंद्र खुला है।`,
      regional: `🔴 అత్యవసర వేడి హెచ్చరిక (${city.name}): మధ్యాహ్నం 11:30 నుండి 4:30 వరకు బయట పని చేయవద్దు. ప్రతి 20 నిమిషాలకు ఓఆర్ఎస్ లేదా నీరు త్రాగండి.`
    },
    elderly: {
      en: `⚠️ SENIOR CITIZEN HEALTH ALERT (${topWard?.ward?.wardName || 'Central Zone'}): Night recovery failure detected (min temp >27.5°C). Keep indoor curtains closed, use cool damp cloths on forehead/neck. Call 108 immediately if confusion or shortness of breath occurs.`,
      hi: `⚠️ वरिष्ठ नागरिक स्वास्थ्य चेतावनी: रात का तापमान अधिक रहने के कारण हृदय पर दबाव बढ़ सकता है। घर के अंदर रहें, गीले कपड़े से शरीर पोछें। सांस लेने में तकलीफ हो तो तुरंत 108 पर संपर्क करें।`,
      regional: `⚠️ వృద్ధుల ఆరోగ్య హెచ్చరిక: ఇంట్లోనే చల్లని ప్రదేశంలో ఉండండి. తడి గుడ్డతో శరీరాన్ని తుడుచుకోండి. అత్యవసరమైతే 108కి కాల్ చేయండి.`
    },
    hospitals: {
      en: `🏥 CLINICAL SURGE DIRECTIVE (${city.name} Civil & District Hospitals): Heat emergency Red Alert. Pre-chill 100 bags of IV normal saline. Activate 15 cold immersion cooling tubs in emergency triage. Monitor elderly for silent heat stroke.`,
      hi: `🏥 अस्पताल आपातकालीन निर्देश: 100 आईवी सलाइन बैग प्री-चिल करें। आपातकालीन वार्ड में 15 कूलिंग टब सक्रिय करें। हीटस्ट्रोक के मरीजों के लिए अलग ट्राइएज बेड आरक्षित रखें।`,
      regional: `🏥 ఆసుపత్రి అత్యవసర ఆదేశం: 100 ఐవీ సెలైన్ బ్యాగులను చల్లబరచండి. ఎమర్జెన్సీ వార్డులో శీతలీకరణ టబ్‌లను సిద్ధం చేయండి.`
    }
  });

  const personas = [
    { id: 'outdoor_workers', label: 'Outdoor Laborers & Vendors', icon: HardHat },
    { id: 'elderly', label: 'Elderly & Chronic Patients', icon: HeartPulse },
    { id: 'hospitals', label: 'Hospital Emergency Triage', icon: Building }
  ];

  const handleGenerateAiAlert = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/generate-targeted-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName: city.name,
          wardName: topWard.ward.wardName,
          persona: personas.find((p) => p.id === selectedPersona)?.label,
          utci: topWard.currentThermal.utci,
          maxTemp: topWard.currentThermal.heatIndex,
          actionWindowText: `${topWard.actionWindowHours} hours`
        })
      });
      const data = await res.json();
      if (data.en) {
        setAiAlerts((prev) => ({
          ...prev,
          [selectedPersona]: {
            en: data.en,
            hi: data.hi,
            regional: data.regional
          }
        }));
      }
    } catch (err) {
      console.error('Failed to fetch AI alert', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const currentMessage = aiAlerts[selectedPersona]?.[activeLang] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="targeted-alerts-view" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-mono font-semibold uppercase tracking-wider mb-1">
            <Bell className="w-3.5 h-3.5" />
            Hyper-Local Public Warning Engine
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            TARGETED MULTILINGUAL SMART ADVISORIES
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Culturally resonant, persona-segmented heat health warnings generated in Hindi, regional vernaculars, and English for immediate municipal SMS/WhatsApp broadcast.
          </p>
        </div>

        <button
          onClick={handleGenerateAiAlert}
          disabled={loadingAi}
          className="px-4 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-lg transition-all"
        >
          <Sparkles className="w-4 h-4" />
          {loadingAi ? 'Synthesizing AI Alert...' : 'Generate New AI Advisory'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Persona Selector Column */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2 shadow-xl">
          <h3 className="text-xs font-mono uppercase font-bold text-slate-400 mb-2">
            Target Audience Segment
          </h3>
          {personas.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p.id)}
                className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 transition-all ${
                  isSelected
                    ? 'bg-rose-500/20 border-rose-500/50 text-slate-100 shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold">{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Advisory Broadcast Preview */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100">
                DISPATCH PREVIEW: {personas.find((p) => p.id === selectedPersona)?.label}
              </h3>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveLang('en')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeLang === 'en' ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveLang('hi')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeLang === 'hi' ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                हिन्दी (Hindi)
              </button>
              <button
                onClick={() => setActiveLang('regional')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeLang === 'regional' ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                Regional
              </button>
            </div>
          </div>

          {/* Broadcast Message Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-sans text-sm text-slate-200 leading-relaxed shadow-inner">
            {currentMessage}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 font-mono">
              Ready for NDMA / Municipal Broadcast Gateway
            </span>
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Alert' : 'Copy Advisory'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
