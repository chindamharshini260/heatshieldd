/**
 * User Profile Screen - HeatShield AI
 * Account info, active location metadata, Data & Science info, and secure sign out
 */

import React from 'react';
import {
  User,
  Mail,
  MapPin,
  LogOut,
  Shield,
  Activity,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { UserLocation, UserProfileData } from '../../types/weather';

interface UserProfileViewProps {
  userProfile: UserProfileData | null;
  activeLocation: UserLocation | null;
  onSignOut: () => void;
  onChangeLocation: () => void;
  onOpenDataScience?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  userProfile,
  activeLocation,
  onSignOut,
  onChangeLocation,
  onOpenDataScience,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          My Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          Manage your account profile and active location preferences.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 flex items-center justify-center shadow-xs">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-slate-800">
              <User className="w-8 h-8 text-slate-700" />
            </div>
          </div>
          <div>
            <div className="font-semibold text-lg text-slate-900">
              {userProfile?.displayName || 'Public User'}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-normal">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{userProfile?.email || 'Registered User'}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5 space-y-4">
          {/* Active Location */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Active Location
                </div>
                <div className="font-semibold text-sm text-slate-900">
                  {activeLocation?.locationName || 'No location set'}
                </div>
                {activeLocation && (
                  <div className="text-xs text-slate-500 font-normal">
                    Source: {activeLocation.source === 'gps' ? 'Device GPS' : 'Manual Selection'}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onChangeLocation}
              className="py-2 px-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
            >
              Change
            </button>
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-medium block text-[11px]">User ID</span>
              <span className="font-mono text-slate-700 truncate block mt-0.5 text-xs font-normal">
                {userProfile?.uid || 'Active Session'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-medium block text-[11px]">Account Type</span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                General Public
              </span>
            </div>
          </div>
        </div>

        {/* Data & Science Section */}
        {onOpenDataScience && (
          <div className="border-t border-slate-100 pt-5">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-indigo-950">Data & Scientific Methodology</div>
                  <div className="text-xs text-indigo-800/80 font-normal">UTCI, WBGT, Rothfusz Heat Index & Open-Meteo</div>
                </div>
              </div>

              <button
                onClick={onOpenDataScience}
                className="py-1.5 px-3 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Read</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <div className="border-t border-slate-100 pt-5">
          <button
            id="btn-profile-signout"
            onClick={onSignOut}
            className="w-full py-3 px-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
