/**
 * Saved Places View - Phase 1
 * Allows user to view bookmarked locations, switch active location instantly, and manage saved places
 */

import React from 'react';
import {
  Bookmark,
  MapPin,
  Trash2,
  ArrowRight,
  Plus,
  Compass,
} from 'lucide-react';
import { SavedLocationItem, UserLocation } from '../../types/weather';

interface SavedLocationsViewProps {
  savedLocations: SavedLocationItem[];
  activeLocation: UserLocation | null;
  onSelectSavedLocation: (location: SavedLocationItem) => void;
  onRemoveSavedLocation: (location: SavedLocationItem) => void;
  onAddNewLocation: () => void;
}

export const SavedLocationsView: React.FC<SavedLocationsViewProps> = ({
  savedLocations,
  activeLocation,
  onSelectSavedLocation,
  onRemoveSavedLocation,
  onAddNewLocation,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Saved Places
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            Quickly check heat conditions for home, workplace, or family areas.
          </p>
        </div>

        <button
          onClick={onAddNewLocation}
          className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location</span>
        </button>
      </div>

      {/* List of Saved Places */}
      {savedLocations.length > 0 ? (
        <div className="space-y-3">
          {savedLocations.map((item) => {
            const isCurrentlyActive =
              activeLocation &&
              Math.abs(activeLocation.latitude - item.latitude) < 0.01 &&
              Math.abs(activeLocation.longitude - item.longitude) < 0.01;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3 transition-all ${
                  isCurrentlyActive
                    ? 'border-rose-300 ring-2 ring-rose-500/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-3 rounded-xl shrink-0 ${
                      isCurrentlyActive
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                        {item.locationName}
                      </span>
                      {isCurrentlyActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium border border-rose-200">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-normal">
                      {item.state ? `${item.state}, ` : ''}{item.country || 'India'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isCurrentlyActive && (
                    <button
                      onClick={() => onSelectSavedLocation(item)}
                      className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Heat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => onRemoveSavedLocation(item)}
                    title="Remove from saved"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <Bookmark className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">No saved locations yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-normal">
              Save places you care about to quickly check the weather and heat index without searching every time.
            </p>
          </div>
          <button
            onClick={onAddNewLocation}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Saved Place</span>
          </button>
        </div>
      )}
    </div>
  );
};
