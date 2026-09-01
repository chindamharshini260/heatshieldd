/**
 * HeatShield AI - Unified 16-Page Navigation Sidebar
 * Visual Style: Premium Dark Navy (#17233C) with Clean Outlined Lucide Icons
 * 
 * 5 Navigation Groups:
 * 1. MAIN: Home, Heat Forecast, Heat Map, Plan My Day, Nearby, Alerts, Insights
 * 2. HEALTH: Health & Heat, Safety Guide, Who Needs Care?
 * 3. ANALYTICS: Heat Trend, Heat History, My Heat Profile
 * 4. SYSTEM: Settings, Help & Support
 * 5. EMERGENCY: Emergency Help
 */

import React from 'react';
import {
  Shield,
  Sun,
  Flame,
  Calendar,
  Compass,
  Clock,
  MapPin,
  Bell,
  Sparkles,
  Activity,
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
  History,
  User,
  Settings,
  HelpCircle,
  AlertOctagon,
  X,
  Building2,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  alertCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  isEmergency?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  alertCount = 0,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navGroups: NavGroup[] = [
    {
      title: 'MAIN',
      items: [
        { id: 'home', label: 'Home', icon: Flame },
        { id: 'forecast', label: 'Heat Forecast', icon: Calendar },
        { id: 'map', label: 'Heat Map', icon: Compass },
        { id: 'plan', label: 'Plan My Day', icon: Clock },
        { id: 'nearby', label: 'Nearby', icon: MapPin },
        { id: 'alerts', label: 'Alerts', icon: Bell, badge: alertCount },
        { id: 'insights', label: 'Insights', icon: Sparkles },
      ],
    },
    {
      title: 'HEALTH',
      items: [
        { id: 'body', label: 'Health & Heat', icon: Activity },
        { id: 'safety', label: 'Safety Guide', icon: ShieldCheck },
        { id: 'care', label: 'Who Needs Care?', icon: HeartHandshake },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        { id: 'trend', label: 'Heat Trend', icon: TrendingUp },
        { id: 'history', label: 'Heat History', icon: History },
        { id: 'my-profile', label: 'My Heat Profile', icon: User },
      ],
    },
    {
      title: 'MUNICIPAL & SCIENCE',
      items: [
        { id: 'hap', label: 'Heat Action Plan (HAP)', icon: Building2 },
        { id: 'datascience', label: 'Science & Transparency', icon: BookOpen },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
      ],
    },
    {
      title: 'EMERGENCY',
      items: [
        { id: 'emergency', label: 'Emergency Help', icon: AlertOctagon, isEmergency: true },
      ],
    },
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-[#FFFFFF] text-[#17233C] w-[270px] select-none border-r border-[#E2E8F0]">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
        <div
          onClick={() => handleItemClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-6 h-6 text-white" />
            <Sun className="w-3 h-3 text-amber-300 absolute inset-0 m-auto" />
          </div>
          <div>
            <div className="font-bold text-base tracking-wider text-[#17233C] flex items-center gap-1.5">
              <span>HEATSHIELD</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                AI
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-normal mt-0.5">
              Know the heat. Stay safe.
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#17233C] hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold border border-blue-200/50'
                        : item.isEmergency
                        ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
                        : 'text-[#17233C] hover:bg-[#F7F9FC] hover:text-[#2563EB]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? 'text-[#2563EB]'
                            : item.isEmergency
                            ? 'text-rose-600'
                            : 'text-[#64748B] group-hover:text-[#2563EB]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {/* Alerts Badge */}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                        {item.badge}
                      </span>
                    )}

                    {item.isEmergency && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3.5 border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center justify-between bg-[#F7F9FC]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Open-Meteo Live</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono">v2.5 Pro</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30 w-[270px] shadow-lg">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-[270px] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
