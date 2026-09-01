/**
 * Location Setup & Change Location Modal
 * Visual Style: Clean Light Blue + White (#2563EB, #EFF6FF, #F7FAFC, #FFFFFF, #172033)
 */

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  Map,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { GeocodingResult, UserLocation } from '../../types/weather';
import { reverseGeocode, searchLocations } from '../../services/openMeteoService';
import { InteractiveLocationMap } from './InteractiveLocationMap';

interface LocationSetupModalProps {
  isOpen: boolean;
  isOnboarding?: boolean;
  currentLocation?: UserLocation | null;
  onLocationSelected: (location: UserLocation) => void;
  onClose?: () => void;
}

export const LocationSetupModal: React.FC<LocationSetupModalProps> = ({
  isOpen,
  isOnboarding = false,
  currentLocation,
  onLocationSelected,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'options' | 'search' | 'map'>(
    isOnboarding ? 'options' : 'search'
  );
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  // Handle GPS detection using browser Geolocation API
  const handleDetectGPS = () => {
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGPS(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const place = await reverseGeocode(lat, lng);

          const loc: UserLocation = {
            latitude: lat,
            longitude: lng,
            locationName: place.locationName,
            city: place.city,
            state: place.state,
            country: place.country,
            source: 'gps',
            timestamp: new Date().toISOString(),
          };

          setIsDetectingGPS(false);
          onLocationSelected(loc);
        } catch (err) {
          console.error('Error reverse geocoding GPS coordinates:', err);
          const loc: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            locationName: 'My Current Location',
            city: 'Detected City',
            country: 'India',
            source: 'gps',
            timestamp: new Date().toISOString(),
          };
          setIsDetectingGPS(false);
          onLocationSelected(loc);
        }
      },
      (error) => {
        setIsDetectingGPS(false);
        console.warn('Geolocation error:', error);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError("We couldn't access your location. Please choose manually.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsError('Location information is currently unavailable.');
        } else if (error.code === error.TIMEOUT) {
          setGpsError('Location request timed out. Please try searching manually.');
        } else {
          setGpsError("We couldn't access your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Force fresh coordinates from the device sensor
      }
    );
  };

  // Handle Search Execution
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (val.trim().length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchLocations(val);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectSearchResult = (item: GeocodingResult) => {
    const loc: UserLocation = {
      latitude: item.latitude,
      longitude: item.longitude,
      locationName: item.name,
      city: item.name,
      state: item.admin1,
      country: item.country || 'India',
      source: 'search',
      timestamp: new Date().toISOString(),
    };
    onLocationSelected(loc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-lg border border-[#DCE6F2] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#DCE6F2] flex items-start justify-between gap-3">
          <div>
            {isOnboarding ? (
              <>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-1.5 border border-blue-100">
                  <MapPin className="w-3.5 h-3.5" />
                  First Time Setup
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#172033]">
                  Where are you?
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5 font-normal">
                  We calculate real heat stress and thermal recovery for your exact location.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-[#172033]">Select Location</h2>
                <p className="text-xs text-[#64748B] mt-0.5 font-normal">
                  Choose an area to see live heat risk, peak periods, and recovery.
                </p>
              </>
            )}
          </div>

          {!isOnboarding && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#DCE6F2] bg-[#F7FAFC] p-1.5 gap-1">
          <button
            id="tab-location-gps"
            onClick={() => setActiveTab('options')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'options'
                ? 'bg-white text-[#172033] shadow-xs font-semibold'
                : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>GPS Auto</span>
          </button>

          <button
            id="tab-location-search"
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'search'
                ? 'bg-white text-[#172033] shadow-xs font-semibold'
                : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>Search Place</span>
          </button>

          <button
            id="tab-location-map"
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'map'
                ? 'bg-white text-[#172033] shadow-xs font-semibold'
                : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Map</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {/* OPTION 1: GPS Auto Detect */}
          {activeTab === 'options' && (
            <div className="space-y-4">
              <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-5 text-center space-y-3.5">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-xs border border-blue-200 mx-auto flex items-center justify-center text-blue-600">
                  <Navigation className={`w-6 h-6 ${isDetectingGPS ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#172033] text-sm sm:text-base">Use My Current Location</h3>
                  <p className="text-xs text-[#64748B] mt-1 max-w-xs mx-auto font-normal">
                    We will ask for browser location permission to detect your locality automatically.
                  </p>
                </div>

                <button
                  id="btn-use-my-location"
                  onClick={handleDetectGPS}
                  disabled={isDetectingGPS}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isDetectingGPS ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Detecting location...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Detect Location</span>
                    </>
                  )}
                </button>
              </div>

              {/* Permission Denied / GPS Error Message */}
              {gpsError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <div className="flex items-start gap-2 text-rose-700 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{gpsError}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="text-xs font-semibold text-rose-700 bg-white border border-rose-200 px-3 py-1 rounded-lg shadow-2xs hover:bg-rose-50 cursor-pointer"
                  >
                    Choose manually from list
                  </button>
                </div>
              )}

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#DCE6F2]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#64748B] font-medium text-[11px]">Or choose manually</span>
                </div>
              </div>

              {/* Secondary Option: Choose Manually */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setActiveTab('search')}
                  className="p-3 rounded-xl border border-[#DCE6F2] hover:bg-[#F7FAFC] transition-all text-left space-y-0.5 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-blue-600" />
                  <div className="font-semibold text-xs text-[#172033]">Search Place</div>
                  <div className="text-[11px] text-[#64748B] font-normal">City or district name</div>
                </button>

                <button
                  onClick={() => setActiveTab('map')}
                  className="p-3 rounded-xl border border-[#DCE6F2] hover:bg-[#F7FAFC] transition-all text-left space-y-0.5 cursor-pointer"
                >
                  <Map className="w-4 h-4 text-blue-600" />
                  <div className="font-semibold text-xs text-[#172033]">Choose on Map</div>
                  <div className="text-[11px] text-[#64748B] font-normal">Interactive live pin</div>
                </button>
              </div>
            </div>
          )}

          {/* OPTION 2: Search autocomplete */}
          {activeTab === 'search' && (
            <div className="space-y-3.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="location-search-main-input"
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search city, area or neighborhood (e.g. Hyderabad)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DCE6F2] bg-[#F7FAFC] text-xs font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                {isSearching && (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
                )}
              </div>

              {/* Suggestions List */}
              {searchResults.length > 0 ? (
                <div className="border border-[#DCE6F2] rounded-2xl overflow-hidden divide-y divide-[#DCE6F2] shadow-2xs bg-white">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-[#EFF6FF] flex items-start gap-2.5 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-[#172033] group-hover:text-blue-700">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[#64748B] font-normal truncate">
                          {item.display_name}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 self-center" />
                    </button>
                  ))}
                </div>
              ) : searchQuery.trim().length >= 2 && !isSearching ? (
                <div className="text-center py-6 text-slate-400 text-xs font-normal">
                  No places found matching "{searchQuery}". Try a broader city name.
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">
                    Popular Locations
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867 },
                      { name: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.209 },
                      { name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777 },
                      { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
                      { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
                      { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
                      { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
                      { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
                    ].map((place) => (
                      <button
                        key={place.name}
                        onClick={() =>
                          onLocationSelected({
                            latitude: place.lat,
                            longitude: place.lng,
                            locationName: `${place.name}, ${place.state}`,
                            city: place.name,
                            state: place.state,
                            country: 'India',
                            source: 'search',
                            timestamp: new Date().toISOString(),
                          })
                        }
                        className="p-2.5 rounded-xl border border-[#DCE6F2] hover:border-blue-300 hover:bg-[#EFF6FF] text-left transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-xs text-[#172033]">{place.name}</div>
                          <div className="text-[10px] text-[#64748B] font-normal">{place.state}</div>
                        </div>
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OPTION 3: Interactive Leaflet Map */}
          {activeTab === 'map' && (
            <div className="h-full">
              <InteractiveLocationMap
                initialLatitude={currentLocation?.latitude || 17.385}
                initialLongitude={currentLocation?.longitude || 78.4867}
                onLocationSelect={(loc) => onLocationSelected(loc)}
                onCancel={onClose}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
