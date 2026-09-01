/**
 * HeatShield AI - Unified Top Header
 * Visual Style: Clean White (#FFFFFF), Border #E2E8F0, Text #17233C
 * 
 * Header Components:
 * Left: Location Pin, Current Locality, "● Live GPS" badge, Updated timestamp, Change button
 * Right: Temperature, Feels Like, Risk Score Pill, Refresh button, Notifications/Alerts, User Profile/Auth
 */

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  RefreshCw,
  Bell,
  User,
  Menu,
  ChevronRight,
  ShieldAlert,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserLocation, CompleteWeatherData } from '../../types/weather';
import { getRiskLevelInfo } from '../../utils/heatRiskSystem';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  activeLocation: UserLocation | null;
  weatherData: CompleteWeatherData | null;
  onChangeLocationClick: () => void;
  onRefreshClick?: () => void;
  isRefreshing?: boolean;
  alertCount?: number;
  currentUser?: FirebaseUser | null;
  onOpenAuth?: () => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  activeLocation,
  weatherData,
  onChangeLocationClick,
  onRefreshClick,
  isRefreshing = false,
  alertCount = 0,
  currentUser,
  onOpenAuth,
  onToggleMobileSidebar,
}) => {
  const [timeAgo, setTimeAgo] = useState<string>('Just now');

  useEffect(() => {
    if (!weatherData?.sourceTimestamp) return;

    const updateLabel = () => {
      const diffMs = Date.now() - new Date(weatherData.sourceTimestamp).getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) {
        setTimeAgo('Just now');
      } else if (diffMin === 1) {
        setTimeAgo('1m ago');
      } else {
        setTimeAgo(`${diffMin}m ago`);
      }
    };

    updateLabel();
    const interval = setInterval(updateLabel, 30000);
    return () => clearInterval(interval);
  }, [weatherData?.sourceTimestamp]);

  const riskScore = weatherData?.analysis?.riskScore ?? 45;
  const riskInfo = getRiskLevelInfo(riskScore);
  const currentTemp = weatherData?.current?.temperature !== undefined ? Math.round(weatherData.current.temperature) : '--';
  const feelsLike = weatherData?.current?.apparentTemperature !== undefined ? Math.round(weatherData.current.apparentTemperature) : '--';

  return (
    <header className="sticky top-0 z-20 h-[72px] bg-white border-b border-[#E2E8F0] px-4 sm:px-8 flex items-center justify-between shadow-2xs">
      {/* LEFT SECTION: Hamburger + Location & GPS Status */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Menu Toggle Button */}
        <button
          id="btn-mobile-menu-toggle"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Location & GPS Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="hidden sm:flex w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 items-center justify-center text-blue-600 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-[#17233C] truncate">
                {activeLocation?.city || activeLocation?.locationName?.split(',')[0] || 'Detected Location'}
              </span>

              {/* Live GPS badge or Selected badge */}
              {activeLocation?.source === 'gps' ? (
                <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live GPS</span>
                </span>
              ) : (
                <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200 shrink-0">
                  <span>Selected City</span>
                </span>
              )}

              {/* Change location button */}
              <button
                onClick={onChangeLocationClick}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer ml-0.5 shrink-0"
              >
                Change
              </button>
            </div>

            <div className="text-[11px] text-[#64748B] flex items-center gap-2 font-normal">
              <span className="truncate hidden sm:inline">
                {activeLocation?.state ? `${activeLocation.state}, ` : ''}{activeLocation?.country || 'India'}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span>Updated {timeAgo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Weather Metrics, Risk Badge, Controls, Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Temperature & Feels Like Pill (Desktop) */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#17233C]">
            <span className="text-base">{currentTemp}°C</span>
          </div>
          <div className="w-px h-4 bg-[#E2E8F0]"></div>
          <div className="text-[#64748B] font-medium">
            Feels <span className="font-bold text-[#17233C]">{feelsLike}°C</span>
          </div>
        </div>

        {/* Unified Risk Score Pill */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-transform hover:scale-[1.02] cursor-pointer shadow-2xs"
          style={{
            backgroundColor: riskInfo.bgColor,
            color: riskInfo.color,
            borderColor: riskInfo.borderColor,
            borderWidth: '1px',
          }}
          title="View Current Risk"
        >
          <Flame className="w-3.5 h-3.5 shrink-0" />
          <span className="tabular-nums">{riskInfo.score}/100</span>
          <span className="hidden sm:inline uppercase text-[10px] tracking-wider font-extrabold">{riskInfo.label}</span>
        </button>

        {/* Refresh Button */}
        {onRefreshClick && (
          <button
            id="btn-header-refresh"
            onClick={onRefreshClick}
            disabled={isRefreshing}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#17233C] hover:bg-[#F7F9FC] border border-transparent hover:border-[#E2E8F0] transition-all cursor-pointer disabled:opacity-50"
            title="Refresh live weather stream"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        )}

        {/* Notification / Alerts Icon */}
        <button
          id="btn-header-alerts"
          onClick={() => onSelectTab('alerts')}
          className="relative p-2 rounded-xl text-[#64748B] hover:text-[#17233C] hover:bg-[#F7F9FC] border border-transparent hover:border-[#E2E8F0] transition-all cursor-pointer"
          title="Heat Alerts"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
              {alertCount}
            </span>
          )}
        </button>

        {/* User Profile / Auth Button */}
        {currentUser ? (
          <button
            onClick={() => onSelectTab('my-profile')}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition-all cursor-pointer"
            title="My Heat Profile"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
              {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden sm:inline max-w-[90px] truncate">
              {currentUser.displayName || currentUser.email?.split('@')[0] || 'Profile'}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
