/**
 * Interactive Location Map Component
 * Powered by Leaflet + OpenStreetMap tiles
 * Allows panning, tapping/clicking anywhere to drop a pin, searching, and confirming active location
 */

import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import {
  MapPin,
  Navigation,
  Check,
  Search,
  Loader2,
  AlertCircle,
  Crosshair,
  Sparkles,
} from 'lucide-react';
import { GeocodingResult, UserLocation } from '../../types/weather';
import { reverseGeocode, searchLocations } from '../../services/openMeteoService';

interface InteractiveLocationMapProps {
  initialLatitude?: number;
  initialLongitude?: number;
  onLocationSelect: (location: UserLocation) => void;
  onCancel?: () => void;
}

export const InteractiveLocationMap: React.FC<InteractiveLocationMapProps> = ({
  initialLatitude = 17.385,
  initialLongitude = 78.4867, // Default Hyderabad coordinates
  onLocationSelect,
  onCancel,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLatitude,
    lng: initialLongitude,
  });
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<{
    locationName: string;
    city: string;
    state?: string;
    country?: string;
  }>({
    locationName: 'Locating place...',
    city: 'Selected Area',
    country: 'India',
  });
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Quick popular city shortcuts
  const popularPlaces = [
    { name: 'Hyderabad', lat: 17.385, lng: 78.4867, state: 'Telangana' },
    { name: 'Secunderabad', lat: 17.4399, lng: 78.4983, state: 'Telangana' },
    { name: 'Gachibowli', lat: 17.4401, lng: 78.3489, state: 'Telangana' },
    { name: 'Banjara Hills', lat: 17.4156, lng: 78.4357, state: 'Telangana' },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
    { name: 'Delhi', lat: 28.6139, lng: 77.209, state: 'Delhi' },
    { name: 'Mumbai', lat: 19.076, lng: 72.8777, state: 'Maharashtra' },
    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  ];

  // Helper to create custom pin HTML
  const createCustomPinIcon = () => {
    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position: relative; transform: translate(-50%, -100%);">
          <div style="
            background: linear-gradient(135deg, #e11d48, #f59e0b);
            width: 38px;
            height: 38px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(225, 29, 72, 0.4);
            border: 2.5px solid #ffffff;
          ">
            <div style="
              width: 14px;
              height: 14px;
              background-color: #ffffff;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
          <div style="
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 10px;
            height: 4px;
            background: rgba(0,0,0,0.25);
            border-radius: 50%;
            filter: blur(1px);
          "></div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });
  };

  // Perform reverse geocode when coordinates change
  const updateLocationDetails = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const place = await reverseGeocode(lat, lng);
      setSelectedPlaceInfo(place);
    } catch (e) {
      console.error('Reverse geocode error:', e);
      setSelectedPlaceInfo({
        locationName: `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`,
        city: 'Selected Location',
        country: 'India',
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentCoords.lat, currentCoords.lng],
        zoom: 12,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Clean OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const marker = L.marker([currentCoords.lat, currentCoords.lng], {
        icon: createCustomPinIcon(),
        draggable: true,
      }).addTo(map);

      markerRef.current = marker;

      // Handle map click to drop marker
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setCurrentCoords({ lat, lng });
        marker.setLatLng([lat, lng]);
        updateLocationDetails(lat, lng);
      });

      // Handle marker drag
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        setCurrentCoords({ lat: pos.lat, lng: pos.lng });
        updateLocationDetails(pos.lat, pos.lng);
      });

      mapInstanceRef.current = map;

      // Initial reverse geocode
      updateLocationDetails(currentCoords.lat, currentCoords.lng);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Search Execution
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        const results = await searchLocations(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const selectSearchResult = (item: GeocodingResult) => {
    setShowDropdown(false);
    setSearchQuery('');
    const lat = item.latitude;
    const lng = item.longitude;

    setCurrentCoords({ lat, lng });

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 13);
    }
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }

    setSelectedPlaceInfo({
      locationName: item.name,
      city: item.name,
      state: item.admin1,
      country: item.country || 'India',
    });
  };

  const selectPredefinedPlace = (place: { name: string; lat: number; lng: number; state: string }) => {
    setShowDropdown(false);
    setSearchQuery('');
    setCurrentCoords({ lat: place.lat, lng: place.lng });

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([place.lat, place.lng], 13);
    }
    if (markerRef.current) {
      markerRef.current.setLatLng([place.lat, place.lng]);
    }

    setSelectedPlaceInfo({
      locationName: place.name,
      city: place.name,
      state: place.state,
      country: 'India',
    });
  };

  // GPS Current Location helper inside map
  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentCoords({ lat, lng });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 14);
        }
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        }

        const place = await reverseGeocode(lat, lng);
        setSelectedPlaceInfo(place);
        setIsGeocoding(false);
      },
      (err) => {
        console.error('GPS error:', err);
        setIsGeocoding(false);
        alert('Could not access current location. Please tap on the map or search for your city.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Final Confirmation
  const handleConfirmLocation = () => {
    const finalLocation: UserLocation = {
      latitude: currentCoords.lat,
      longitude: currentCoords.lng,
      locationName: selectedPlaceInfo.locationName || `${currentCoords.lat.toFixed(3)}°N, ${currentCoords.lng.toFixed(3)}°E`,
      city: selectedPlaceInfo.city || 'Selected City',
      state: selectedPlaceInfo.state,
      country: selectedPlaceInfo.country || 'India',
      source: 'map',
      timestamp: new Date().toISOString(),
    };

    onLocationSelect(finalLocation);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Top Search Input */}
      <div className="relative z-30">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="map-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a city, area or place (e.g. Hyderabad, Banjara Hills)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
          />
          {isSearching && (
            <Loader2 className="w-4 h-4 text-slate-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg max-h-60 overflow-y-auto z-40 divide-y divide-slate-100">
            {searchResults.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => selectSearchResult(result)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-start gap-2.5 text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">{result.name}</div>
                  <div className="text-[11px] text-slate-500">{result.display_name}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick City Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Popular:</span>
        {popularPlaces.slice(0, 5).map((place) => (
          <button
            key={place.name}
            type="button"
            onClick={() => selectPredefinedPlace(place)}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap text-[11px] border border-slate-200 transition-colors cursor-pointer"
          >
            {place.name}
          </button>
        ))}
      </div>

      {/* Map Display Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-72 sm:h-80 w-full shadow-inner bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Float GPS button on top right of map */}
        <button
          type="button"
          onClick={handleUseCurrentGPS}
          title="Center to my current GPS location"
          className="absolute top-3 right-3 z-[1000] p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-md text-slate-700 hover:text-rose-600 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
        >
          <Crosshair className="w-4 h-4 text-rose-600" />
          <span className="hidden sm:inline">My GPS Location</span>
        </button>

        {/* Instruction pill at bottom center */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/85 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-[11px] font-medium pointer-events-none shadow-md flex items-center gap-1.5 whitespace-nowrap">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>Tap or drag the pin anywhere on the map</span>
        </div>
      </div>

      {/* Selected Location Summary & Confirm Button */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Selected Location
            </div>
            <div className="font-bold text-slate-900 text-sm sm:text-base truncate">
              {isGeocoding ? (
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Recognizing address...
                </span>
              ) : (
                selectedPlaceInfo.locationName
              )}
            </div>
            <div className="text-xs text-slate-500">
              {selectedPlaceInfo.state ? `${selectedPlaceInfo.state}, ` : ''}{selectedPlaceInfo.country || 'India'}
              <span className="text-slate-400 ml-1.5 font-mono text-[10px]">
                ({currentCoords.lat.toFixed(3)}°, {currentCoords.lng.toFixed(3)}°)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            id="btn-confirm-map-location"
            type="button"
            onClick={handleConfirmLocation}
            disabled={isGeocoding}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>Use this location</span>
          </button>
        </div>
      </div>
    </div>
  );
};
