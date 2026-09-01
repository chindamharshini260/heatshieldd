import React, { useState } from 'react';
import {
  Bookmark,
  MapPin,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Building,
  Heart
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface PublicSavedPlacesProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
  onSelectCity?: (cityId: string) => void;
  onSelectWard?: (wardId: string) => void;
}

interface SavedPlace {
  id: string;
  label: string;
  cityName: string;
  areaName: string;
  tag: 'Home' | 'Work' | 'Family' | 'Other';
  temp: number;
  risk: string;
  riskColor: string;
}

export const PublicSavedPlaces: React.FC<PublicSavedPlacesProps> = ({
  city,
  wardProfiles
}) => {
  const [places, setPlaces] = useState<SavedPlace[]>([
    {
      id: 'p1',
      label: 'My Home',
      cityName: city.name,
      areaName: wardProfiles[0]?.ward.wardName.split('-')[1]?.trim() || 'Central Zone',
      tag: 'Home',
      temp: 41,
      risk: 'Very High',
      riskColor: 'bg-rose-500 text-white'
    },
    {
      id: 'p2',
      label: "Parents' House",
      cityName: 'Jaipur',
      areaName: 'Civil Lines (High Density)',
      tag: 'Family',
      temp: 43,
      risk: 'Extreme',
      riskColor: 'bg-red-600 text-white'
    },
    {
      id: 'p3',
      label: 'Office / Workplace',
      cityName: city.name,
      areaName: wardProfiles[1]?.ward.wardName.split('-')[1]?.trim() || 'Commercial Hub',
      tag: 'Work',
      temp: 39,
      risk: 'High',
      riskColor: 'bg-amber-500 text-white'
    }
  ]);

  const [newLabel, setNewLabel] = useState('');
  const [newTag, setNewTag] = useState<'Home' | 'Work' | 'Family' | 'Other'>('Home');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newPlace: SavedPlace = {
      id: `p-${Date.now()}`,
      label: newLabel.trim(),
      cityName: city.name,
      areaName: wardProfiles[0]?.ward.wardName.split('-')[1]?.trim() || 'Neighborhood',
      tag: newTag,
      temp: 40,
      risk: 'High',
      riskColor: 'bg-amber-500 text-white'
    };

    setPlaces([...places, newPlace]);
    setNewLabel('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setPlaces(places.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <Bookmark className="w-3.5 h-3.5" />
              Quick Monitor
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">
              Your Saved Places
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Check daily heat risk for your home, workplace, and loved ones in one place.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? 'Cancel' : 'Add Current Location'}
          </button>
        </div>
      </div>

      {/* Add Place Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddPlace}
          className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-800">
            Save Current Area ({city.name} - {wardProfiles[0]?.ward.wardName.split('-')[1]?.trim() || 'Central'})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Custom Label (e.g. My Grandmother's Home)
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Enter a recognizable name"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Tag</label>
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Family">Family</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
            >
              Save Place
            </button>
          </div>
        </form>
      )}

      {/* Saved Places List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((place) => (
          <div
            key={place.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                  {place.tag}
                </span>
                <button
                  onClick={() => handleDelete(place.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                  title="Remove place"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{place.label}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {place.areaName}, {place.cityName}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xl font-extrabold text-slate-900">{place.temp}°C</div>
                <div className="text-[10px] text-slate-400">Peak Heat</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${place.riskColor}`}>
                {place.risk}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
