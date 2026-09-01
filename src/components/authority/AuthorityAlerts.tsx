import React, { useState } from 'react';
import {
  Send,
  Radio,
  Bell,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Users,
  HardHat,
  MessageSquare
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface AuthorityAlertsProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
}

export const AuthorityAlerts: React.FC<AuthorityAlertsProps> = ({
  city,
  wardProfiles
}) => {
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'workers' | 'elderly' | 'schools'>('all');
  const [channelSms, setChannelSms] = useState(true);
  const [channelWhatsapp, setChannelWhatsapp] = useState(true);
  const [channelSirens, setChannelSirens] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const topWard = wardProfiles[0];
  const peakTemp = topWard?.currentThermal?.heatIndex || 42;

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setDispatched(true);
    setTimeout(() => setDispatched(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5" />
              Multi-Channel Alert Dispatcher
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Broadcast Heat Advisories for {city.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Issue targeted SMS, WhatsApp alerts, and public transit announcements in regional languages.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Alert Composer */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900">
            Compose & Dispatch Public Heat Warning
          </h2>

          <form onSubmit={handleDispatch} className="space-y-4">
            {/* Target Audience */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5 uppercase">
                Target Audience Group
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setBroadcastTarget('all')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    broadcastTarget === 'all'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  All Citizens
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastTarget('workers')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    broadcastTarget === 'workers'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Outdoor Workers
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastTarget('elderly')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    broadcastTarget === 'elderly'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Senior Citizens
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastTarget('schools')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    broadcastTarget === 'schools'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Schools & Creches
                </button>
              </div>
            </div>

            {/* Channels Checkboxes */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-600 block uppercase">
                Broadcast Distribution Channels
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelSms}
                    onChange={(e) => setChannelSms(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Telecom Geotargeted SMS (Cell Broadcast)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelWhatsapp}
                    onChange={(e) => setChannelWhatsapp(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Municipal WhatsApp Group Channels</span>
                </label>
              </div>
            </div>

            {/* Message Preview */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-600 block uppercase">
                Message Preview (English & Hindi)
              </label>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs text-slate-800 font-mono">
                <p className="font-bold text-rose-700">
                  [HEAT RED ALERT - {city.name.toUpperCase()} DISASTER MANAGEMENT]
                </p>
                <p>
                  Extreme heat conditions ({peakTemp}°C) expected tomorrow 11:30 AM to 4:30 PM. Outdoor manual work must pause. Free drinking water and cooling shelters active at all Ward Health Centres. Emergency: Call 108.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={dispatched}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {dispatched ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Alert Successfully Broadcasted to 1.8M Subscribers</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch Verified Heat Warning</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Col: Dispatch Metrics */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Broadcast Reach</h3>
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-0.5">
                <div className="text-[11px] text-slate-500">Subscribed Citizens</div>
                <div className="text-xl font-bold text-slate-900">2,420,000 Numbers</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-0.5">
                <div className="text-[11px] text-slate-500">ASHA & Ward Volunteers</div>
                <div className="text-xl font-bold text-slate-900">1,240 Active Handsets</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-0.5">
                <div className="text-[11px] text-slate-500">Public Transit Bus Displays</div>
                <div className="text-xl font-bold text-slate-900">450 Electronic Screens</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
