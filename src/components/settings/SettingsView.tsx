/**
 * HeatShield AI - Page 14: Settings
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. Title: "Settings"
 * 2. Sections:
 *    - Location & GPS Permissions
 *    - Units & Measurement Standards
 *    - Alerts & Emergency Notifications
 *    - Data Management & Local Storage
 *    - System Identity & Scientific Engine Information
 */

import React, { useState } from 'react';
import {
  Settings,
  MapPin,
  Compass,
  Bell,
  Volume2,
  Globe,
  Database,
  Trash2,
  Download,
  Info,
  CheckCircle2,
  Shield,
  Sparkles,
} from 'lucide-react';
import { clearStoredHeatRecords } from '../../services/historyService';

export const SettingsView: React.FC = () => {
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [windUnit, setWindUnit] = useState<'kmh' | 'ms'>('kmh');
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');
  const [autoGPS, setAutoGPS] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [dailyBriefing, setDailyBriefing] = useState(true);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear your local heat history logs?')) {
      clearStoredHeatRecords();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    }
  };

  const handleExportData = () => {
    const data = {
      app: 'HeatShield AI',
      timestamp: new Date().toISOString(),
      profile: localStorage.getItem('heatshield_user_profile'),
      history: localStorage.getItem('heatshield_history_records'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heatshield_data_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Configure units, alert behaviors, sensors, and privacy preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: UNITS & MEASUREMENT */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-base text-[#17233C] flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>Units & Standard Measurements</span>
          </h3>

          <div className="space-y-4">
            {/* Temperature Unit */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#17233C] block">Temperature Unit</span>
                <span className="text-[11px] text-[#64748B]">Celsius (°C) or Fahrenheit (°F)</span>
              </div>
              <div className="flex bg-[#F7F9FC] p-1 rounded-xl border border-[#E2E8F0]">
                <button
                  onClick={() => setTempUnit('C')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    tempUnit === 'C' ? 'bg-blue-600 text-white shadow-2xs' : 'text-[#64748B]'
                  }`}
                >
                  °C
                </button>
                <button
                  onClick={() => setTempUnit('F')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    tempUnit === 'F' ? 'bg-blue-600 text-white shadow-2xs' : 'text-[#64748B]'
                  }`}
                >
                  °F
                </button>
              </div>
            </div>

            {/* Wind Unit */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
              <div>
                <span className="text-xs font-bold text-[#17233C] block">Wind Velocity</span>
                <span className="text-[11px] text-[#64748B]">Kilometers per hour or Meters per second</span>
              </div>
              <div className="flex bg-[#F7F9FC] p-1 rounded-xl border border-[#E2E8F0]">
                <button
                  onClick={() => setWindUnit('kmh')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    windUnit === 'kmh' ? 'bg-blue-600 text-white shadow-2xs' : 'text-[#64748B]'
                  }`}
                >
                  km/h
                </button>
                <button
                  onClick={() => setWindUnit('ms')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    windUnit === 'ms' ? 'bg-blue-600 text-white shadow-2xs' : 'text-[#64748B]'
                  }`}
                >
                  m/s
                </button>
              </div>
            </div>

            {/* Time Format */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
              <div>
                <span className="text-xs font-bold text-[#17233C] block">Time Clock Format</span>
                <span className="text-[11px] text-[#64748B]">12-Hour AM/PM or 24-Hour Military</span>
              </div>
              <div className="flex bg-[#F7F9FC] p-1 rounded-xl border border-[#E2E8F0]">
                <button
                  onClick={() => setTimeFormat('12h')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    timeFormat === '12h' ? 'bg-blue-600 text-white shadow-2xs' : 'text-[#64748B]'
                  }`}
                >
                  12h
                </button>
                <button
                  onClick={() => setTimeFormat('24h')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    timeFormat === '24h' ? 'bg-blue-600 text-white shadow-2xs' : 'text-[#64748B]'
                  }`}
                >
                  24h
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ALERTS & SENSORS */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-base text-[#17233C] flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <span>Alerts & Location Sensors</span>
          </h3>

          <div className="space-y-4">
            {/* Auto GPS */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#17233C] block">Continuous GPS Auto-Detection</span>
                <span className="text-[11px] text-[#64748B]">Update weather station upon movement</span>
              </div>
              <input
                type="checkbox"
                checked={autoGPS}
                onChange={(e) => setAutoGPS(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
              <div>
                <span className="text-xs font-bold text-[#17233C] block">High Thermal Stress Push Alerts</span>
                <span className="text-[11px] text-[#64748B]">Notify when risk score crosses 70 (Very High)</span>
              </div>
              <input
                type="checkbox"
                checked={pushAlerts}
                onChange={(e) => setPushAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Daily Morning Briefing */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
              <div>
                <span className="text-xs font-bold text-[#17233C] block">7:00 AM Daily Thermal Briefing</span>
                <span className="text-[11px] text-[#64748B]">Send summary of upcoming peak heat hours</span>
              </div>
              <input
                type="checkbox"
                checked={dailyBriefing}
                onChange={(e) => setDailyBriefing(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: DATA & PRIVACY */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#17233C] flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>Data Storage & Export</span>
          </h3>
          <p className="text-xs text-[#64748B]">
            All heat journals, checklists, and sensitivity profiles are stored strictly on your local device.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-[#F7F9FC] hover:bg-slate-100 border border-[#E2E8F0] text-xs font-semibold text-[#17233C] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Data (JSON)</span>
            </button>

            <button
              onClick={handleClearData}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History Logs</span>
            </button>
          </div>

          {clearedNotice && (
            <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#14532D] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Local records cleared successfully.</span>
            </div>
          )}
        </div>

        {/* SECTION 4: ABOUT HEATSHIELD AI */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-[#17233C]">About HeatShield AI</h3>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">
            HeatShield AI is an intelligent climate-health decision support platform built for the Smart India Hackathon (SIH) challenge statement: <em>“Extreme Heatwave + Human Thermal Stress Prediction and Decision Support System”</em>.
          </p>
          <div className="pt-2 text-[11px] text-[#64748B] space-y-1">
            <div>Engine Version: <strong className="text-[#17233C]">v2.4.0-production</strong></div>
            <div>Weather Data: <strong className="text-[#17233C]">Open-Meteo High-Resolution Ensemble</strong></div>
            <div>Physiological Models: <strong className="text-[#17233C]">NOAA Heat Index • Wet Bulb WBGT • UTCI-approx</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
