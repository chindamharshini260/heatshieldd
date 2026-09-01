import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Users,
  HardHat,
  Heart,
  Baby,
  Globe,
  Share2,
  Check,
  Volume2
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface PublicAlertsProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const PublicAlerts: React.FC<PublicAlertsProps> = ({
  city,
  wardProfiles
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'regional'>('en');
  const [selectedPersona, setSelectedPersona] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const topWard = wardProfiles[0];
  const peakTemp = topWard?.currentThermal?.heatIndex || 42;

  const alerts = [
    {
      id: 'alert-1',
      severity: 'extreme',
      title: {
        en: `🔴 Very High Heat Warning for ${city.name}`,
        hi: `🔴 ${city.name} के लिए अत्यधिक गर्मी की चेतावनी`,
        regional: `🔴 ${city.name} కోసం తీవ్రమైన వేడి హెచ్చరిక`
      },
      time: 'Tomorrow, 11:30 AM – 4:30 PM',
      badge: 'Red Alert',
      badgeColor: 'bg-red-600 text-white',
      persona: 'all',
      content: {
        en: `Outdoor conditions will become dangerous tomorrow between 11:30 AM and 4:30 PM as temperatures reach ${peakTemp}°C. Stay indoors under fans, drink water or ORS every 20 minutes, and avoid direct sun.`,
        hi: `कल सुबह 11:30 से शाम 4:30 बजे तक तापमान ${peakTemp}°C तक पहुंचने के कारण बाहर रहना खतरनाक हो सकता है। पंखे या छांव में रहें, हर 20 मिनट में पानी या ओआरएस पिएं।`,
        regional: `రేపు ఉదయం 11:30 నుండి సాయంత్రం 4:30 వరకు బయట ఉండటం ప్రమాదకరం. ప్రతి 20 నిమిషాలకు నీరు లేదా ఓఆర్ఎస్ త్రాగండి.`
      }
    },
    {
      id: 'alert-2',
      severity: 'high',
      title: {
        en: `🟠 Mandatory Work Shift Caution for Outdoor Workers`,
        hi: `🟠 निर्माण और बाहरी श्रमिकों के लिए कार्य समय में बदलाव की सलाह`,
        regional: `🟠 బయట పనిచేసే కార్మికులకు విశ్రాంతి సూచన`
      },
      time: 'Daily Peak Hours (12 PM – 4 PM)',
      badge: 'Orange Advisory',
      badgeColor: 'bg-amber-500 text-white',
      persona: 'workers',
      content: {
        en: `All employers, contractors, and outdoor workers in ${city.name} are advised to adjust heavy physical work shifts to early morning (6 AM – 11 AM) and late evening. Shaded rest areas and free drinking water must be provided on site.`,
        hi: `सभी ठेकेदारों और श्रमिकों को सलाह दी जाती है कि वे भारी शारीरिक कार्य सुबह 6 से 11 बजे और शाम को करें। कार्यस्थल पर छाया और पानी की व्यवस्था अनिवार्य है।`,
        regional: `ఎండ ఎక్కువగా ఉండే సమయంలో శారీరక శ్రమ చేయవద్దు. ఉదయం మరియు సాయంత్రం వేళల్లో పని చేయండి.`
      }
    },
    {
      id: 'alert-3',
      severity: 'high',
      title: {
        en: `⚠️ Senior Citizen & High-Risk Health Advisory`,
        hi: `⚠️ वरिष्ठ नागरिकों और हृदय रोगियों के लिए स्वास्थ्य चेतावनी`,
        regional: `⚠️ వృద్ధుల ఆరోగ్య సూచన`
      },
      time: 'Continuous 48-Hour Watch',
      badge: 'Health Advisory',
      badgeColor: 'bg-rose-500 text-white',
      persona: 'elderly',
      content: {
        en: `Warm night temperatures (>28°C) are preventing natural body cooling. Family members must check on senior citizens twice daily. Ensure indoor rooms are well-ventilated and sponge with cool water if feverish.`,
        hi: `रात का तापमान अधिक रहने के कारण शरीर पूरी तरह ठंडा नहीं हो पा रहा है। बुजुर्गों के कमरे में ताजी हवा आने दें और नियमित पानी पीने का ध्यान रखें।`,
        regional: `రాత్రిపూట కూడా వేడి ఎక్కువగా ఉంటుంది. ఇంట్లోనే ఉండి చల్లటి నీటితో శరీరాన్ని తుడుచుకోండి.`
      }
    },
    {
      id: 'alert-4',
      severity: 'moderate',
      title: {
        en: `🟡 Safe Hydration & School Sports Advisory`,
        hi: `🟡 बच्चों और स्कूली गतिविधियों के लिए दिशा-निर्देश`,
        regional: `🟡 పాఠశాల పిల్లలకు ఎండ సూచనలు`
      },
      time: 'School & Afternoon Hours',
      badge: 'Yellow Notice',
      badgeColor: 'bg-yellow-500 text-slate-900',
      persona: 'children',
      content: {
        en: `Schools and daycare centers should avoid outdoor physical training or sports after 10:30 AM. Ensure water bottles are refilled regularly and children remain inside shaded classrooms.`,
        hi: `स्कूलों में सुबह 10:30 के बाद बच्चों को धूप में खेलकूद न कराएं। बच्चों को समय-समय पर पानी पिलाएं।`,
        regional: `ఉదయం 10:30 తర్వాత పిల్లలను ఎండలో ఆడనివ్వవద్దు. తరచుగా నీరు త్రాగించాలి.`
      }
    }
  ];

  const filteredAlerts = alerts.filter(
    (a) => selectedPersona === 'all' || a.persona === selectedPersona || a.persona === 'all'
  );

  const copyAlert = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
              <Bell className="w-3.5 h-3.5" />
              Public Heat Advisories
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">
              Official Heat Alerts for {city.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Verified public health warnings and actionable precautions in plain language.
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLanguage('hi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'hi' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              onClick={() => setSelectedLanguage('regional')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'regional' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Regional (తెలుగు / ગુજરાતી)
            </button>
          </div>
        </div>
      </div>

      {/* Filter by audience */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
          Filter by:
        </span>
        <button
          onClick={() => setSelectedPersona('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            selectedPersona === 'all'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          All Alerts
        </button>
        <button
          onClick={() => setSelectedPersona('workers')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            selectedPersona === 'workers'
              ? 'bg-amber-600 text-white border-amber-600'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <HardHat className="w-3.5 h-3.5" />
          Outdoor Workers
        </button>
        <button
          onClick={() => setSelectedPersona('elderly')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            selectedPersona === 'elderly'
              ? 'bg-rose-600 text-white border-rose-600'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          Senior Citizens
        </button>
        <button
          onClick={() => setSelectedPersona('children')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            selectedPersona === 'children'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Baby className="w-3.5 h-3.5" />
          Children & Schools
        </button>
      </div>

      {/* Alerts Cards List */}
      <div className="space-y-4">
        {filteredAlerts.map((a) => {
          const alertTitle = a.title[selectedLanguage];
          const alertBody = a.content[selectedLanguage];
          const isCopied = copiedId === a.id;

          return (
            <div
              key={a.id}
              className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-3 relative overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${a.badgeColor}`}>
                  {a.badge}
                </span>
                <span className="text-xs font-medium text-slate-500">{a.time}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900">{alertTitle}</h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {alertBody}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  Issued by Municipal Disaster Management Cell
                </span>

                <button
                  onClick={() => copyAlert(a.id, `${alertTitle}\n\n${alertBody}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied message</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Share alert on WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
