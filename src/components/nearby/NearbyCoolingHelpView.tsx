/**
 * HeatShield AI - Page 5: Nearby Resources
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * 
 * Features:
 * 1. Title: "Find Safety Near You"
 * 2. Filter Pills: ALL, MEDICAL, COOLING, WATER, PHARMACY
 * 3. 2-Column Responsive Layout: Interactive Map on Left + Resource Cards on Right
 * 4. Location Cards: Icon, Facility Name, Category Badge, Distance, Operational Status, "GET DIRECTIONS" action
 */

import React, { useState, useEffect, useRef } from 'react';
import * as L from 'leaflet';
import {
  MapPin,
  Building2,
  Droplets,
  HeartPulse,
  Pill,
  Navigation,
  Phone,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CompleteWeatherData } from '../../types/weather';

interface NearbyCoolingHelpViewProps {
  weatherData: CompleteWeatherData | null;
}

type FacilityCategory = 'ALL' | 'MEDICAL' | 'COOLING' | 'WATER' | 'PHARMACY';

interface SafetyFacility {
  id: string;
  name: string;
  category: 'MEDICAL' | 'COOLING' | 'WATER' | 'PHARMACY';
  categoryLabel: string;
  address: string;
  distanceKm: number;
  openStatus: string;
  phone: string;
  hasAC: boolean;
  lat: number;
  lng: number;
}

export const NearbyCoolingHelpView: React.FC<NearbyCoolingHelpViewProps> = ({
  weatherData,
}) => {
  const [activeFilter, setActiveFilter] = useState<FacilityCategory>('ALL');
  const [selectedFacility, setSelectedFacility] = useState<SafetyFacility | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const baseLat = weatherData?.location.latitude || 17.385;
  const baseLng = weatherData?.location.longitude || 78.4867;
  const locationName = weatherData?.location.city || 'Your Area';

  // Seeded facilities around coordinates
  const facilities: SafetyFacility[] = [
    {
      id: 'fac-1',
      name: 'District General Hospital & Heat Stroke Wing',
      category: 'MEDICAL',
      categoryLabel: 'Hospital & Emergency Care',
      address: 'Main Civic Medical Complex, 2nd Avenue',
      distanceKm: 0.8,
      openStatus: 'Open 24/7 (Emergency Ready)',
      phone: '108 / +91 40 2345 6789',
      hasAC: true,
      lat: baseLat + 0.007,
      lng: baseLng + 0.005,
    },
    {
      id: 'fac-2',
      name: 'Community Municipal Cooling Center',
      category: 'COOLING',
      categoryLabel: 'Public Air-Conditioned Shelter',
      address: 'Civic Hall, Sector 4 Market Road',
      distanceKm: 1.2,
      openStatus: 'Open 8:00 AM – 8:00 PM',
      phone: '+91 40 2345 1122',
      hasAC: true,
      lat: baseLat - 0.008,
      lng: baseLng + 0.006,
    },
    {
      id: 'fac-3',
      name: 'Free Municipal Drinking Water Point & Chaas Stall',
      category: 'WATER',
      categoryLabel: 'Hydration Kiosk',
      address: 'Central Bus Stand Junction',
      distanceKm: 0.4,
      openStatus: 'Active & Filtered Chilled Water',
      phone: '1800 11 0022',
      hasAC: false,
      lat: baseLat + 0.003,
      lng: baseLng - 0.004,
    },
    {
      id: 'fac-4',
      name: 'Apollo 24/7 Pharmacy & ORS Depot',
      category: 'PHARMACY',
      categoryLabel: 'Pharmacy & Electrolyte Supply',
      address: 'Ground Floor, City Mall Plaza',
      distanceKm: 0.6,
      openStatus: 'Open 24 Hours',
      phone: '+91 40 2345 9988',
      hasAC: true,
      lat: baseLat - 0.004,
      lng: baseLng - 0.007,
    },
    {
      id: 'fac-5',
      name: 'Red Cross Emergency Heat Treatment Camp',
      category: 'MEDICAL',
      categoryLabel: 'First Aid & Triage',
      address: 'Near Old Clock Tower Square',
      distanceKm: 1.5,
      openStatus: 'Open 9:00 AM – 7:00 PM',
      phone: '1077',
      hasAC: true,
      lat: baseLat + 0.012,
      lng: baseLng - 0.008,
    },
  ];

  const filteredFacilities =
    activeFilter === 'ALL'
      ? facilities
      : facilities.filter((f) => f.category === activeFilter);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [baseLat, baseLng],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const markers = L.layerGroup().addTo(map);
      markersRef.current = markers;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([baseLat, baseLng], 14);
    }

    if (markersRef.current && mapInstanceRef.current) {
      markersRef.current.clearLayers();

      // User location pin
      const userIcon = L.divIcon({
        className: 'user-pin',
        html: `
          <div class="relative flex items-center justify-center w-7 h-7">
            <div class="absolute w-7 h-7 rounded-full bg-blue-500/30 animate-ping"></div>
            <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker([baseLat, baseLng], { icon: userIcon })
        .addTo(markersRef.current)
        .bindPopup('<b>Your Current Location</b>');

      // Facilities pins
      filteredFacilities.forEach((f) => {
        const color =
          f.category === 'MEDICAL'
            ? '#EF4444'
            : f.category === 'COOLING'
            ? '#2563EB'
            : f.category === 'WATER'
            ? '#06B6D4'
            : '#10B981';

        const facilityIcon = L.divIcon({
          className: 'fac-icon',
          html: `
            <div style="background-color: ${color};" class="w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
              •
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker([f.lat, f.lng], { icon: facilityIcon })
          .addTo(markersRef.current!)
          .bindPopup(`<b>${f.name}</b><br>${f.categoryLabel}<br>Distance: ${f.distanceKm} km`);
      });
    }
  }, [baseLat, baseLng, filteredFacilities]);

  const handleDirections = (f: SafetyFacility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight">
            Find Safety Near You
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Nearby public cooling shelters, hydration kiosks, and medical clinics in{' '}
            <span className="font-semibold text-[#17233C]">{locationName}</span>
          </p>
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'MEDICAL', 'COOLING', 'WATER', 'PHARMACY'] as FacilityCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:border-blue-200 hover:text-[#17233C]'
            }`}
          >
            {cat === 'ALL'
              ? 'All Resources'
              : cat === 'MEDICAL'
              ? 'Medical & Hospitals'
              : cat === 'COOLING'
              ? 'Cooling Shelters'
              : cat === 'WATER'
              ? 'Hydration Points'
              : 'Pharmacies & ORS'}
          </button>
        ))}
      </div>

      {/* 2-COLUMN LAYOUT: MAP ON LEFT + LOCATION CARDS ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAP ON LEFT */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs h-[420px] lg:h-[580px] relative">
          <div ref={mapContainerRef} className="w-full h-full bg-slate-100 z-10" />
        </div>

        {/* RESOURCE CARDS ON RIGHT */}
        <div className="lg:col-span-7 space-y-3.5 overflow-y-auto max-h-[580px] pr-1">
          {filteredFacilities.map((f) => {
            const Icon =
              f.category === 'MEDICAL'
                ? HeartPulse
                : f.category === 'COOLING'
                ? Building2
                : f.category === 'WATER'
                ? Droplets
                : Pill;

            const categoryStyle =
              f.category === 'MEDICAL'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : f.category === 'COOLING'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : f.category === 'WATER'
                ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200';

            return (
              <div
                key={f.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${categoryStyle}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm text-[#17233C]">{f.name}</h3>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${categoryStyle}`}>
                        {f.categoryLabel}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748B]">{f.address}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#64748B] pt-1">
                      <span className="flex items-center gap-1 font-semibold text-blue-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{f.distanceKm} km away</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{f.openStatus}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleDirections(f)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </button>
                  <a
                    href={`tel:${f.phone.replace(/[^0-9]/g, '')}`}
                    className="px-3 py-2 rounded-xl bg-[#F7F9FC] hover:bg-slate-100 border border-[#E2E8F0] text-[#17233C] text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
