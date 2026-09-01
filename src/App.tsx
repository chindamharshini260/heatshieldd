/**
 * HeatShield AI - Human Heat-Health Application
 * Core Philosophy: "WEATHER IS THE INPUT. HUMAN HEALTH IMPACT IS THE PRODUCT."
 * 
 * Target User: General Public & Health Decision Makers
 * Visual Style: Clean Light Blue + White (#F7F9FC, #FFFFFF, #17233C)
 * Architecture: Unified 16-Page Navigation with 270px Sidebar & Sticky Top Header
 */

import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './lib/firebase';
import {
  CompleteWeatherData,
  SavedLocationItem,
  UserLocation,
  UserProfileData,
} from './types/weather';
import { fetchRealWeather, reverseGeocode } from './services/openMeteoService';
import {
  getUserProfile,
  initializeUserProfile,
  saveUserActiveLocation,
  addSavedLocation,
  removeSavedLocation,
} from './services/userService';
import { saveHeatRecord } from './services/historyService';

// Layout Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// 16 Redesigned Pages
import { HumanHeatHomeView } from './components/home/HumanHeatHomeView';
import { HeatForecastView } from './components/forecast/HeatForecastView';
import { HeatMapView } from './components/map/HeatMapView';
import { PlanMyDayView } from './components/plan/PlanMyDayView';
import { NearbyCoolingHelpView } from './components/nearby/NearbyCoolingHelpView';
import { HeatAlertsView } from './components/alerts/HeatAlertsView';
import { RealHeatInsightsView } from './components/insights/RealHeatInsightsView';
import { HeatAndBodyView } from './components/body/HeatAndBodyView';
import { SafetyGuideView } from './components/safety/SafetyGuideView';
import { WhoNeedsCareView } from './components/care/WhoNeedsCareView';
import { HeatTrendView } from './components/trend/HeatTrendView';
import { HeatHistoryView } from './components/history/HeatHistoryView';
import { MyHeatProfileView } from './components/profile/MyHeatProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { HelpSupportView } from './components/support/HelpSupportView';
import { EmergencyHelpView } from './components/emergency/EmergencyHelpView';
import { AuthorityHeatActionPlan } from './components/authority/AuthorityHeatActionPlan';
import { AuthorityDataScience } from './components/authority/AuthorityDataScience';
import { INDIAN_CITIES } from './data/cityData';

// Modals
import { LocationSetupModal } from './components/location/LocationSetupModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { X } from 'lucide-react';

const DEFAULT_FALLBACK_LOCATION: UserLocation = {
  latitude: 17.385,
  longitude: 78.4867,
  locationName: 'Hyderabad, Telangana, India',
  city: 'Hyderabad',
  state: 'Telangana',
  country: 'India',
  source: 'fallback',
  timestamp: new Date().toISOString(),
};

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // User Profile & Location State
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [activeLocation, setActiveLocation] = useState<UserLocation>(() => {
    try {
      const cached = localStorage.getItem('heatshield_active_loc');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return DEFAULT_FALLBACK_LOCATION;
  });
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);

  const [savedLocations, setSavedLocations] = useState<SavedLocationItem[]>(() => {
    try {
      const cached = localStorage.getItem('heatshield_saved_places');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [];
  });

  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [isOnboardingLocation, setIsOnboardingLocation] = useState<boolean>(false);

  // Weather Data State (100% Real Open-Meteo Data)
  const [weatherData, setWeatherData] = useState<CompleteWeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [isRefreshingWeather, setIsRefreshingWeather] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Function to request and acquire real browser GPS coordinates
  const handleRequestBrowserGps = useCallback(async (isManualTrigger = false) => {
    if (!navigator.geolocation) {
      if (isManualTrigger) {
        setGpsStatusMessage('Geolocation is not supported by your browser.');
      }
      return;
    }

    setIsLocatingGPS(true);
    setGpsStatusMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Reverse geocode the exact coordinates returned by the browser GPS
          const place = await reverseGeocode(lat, lng);

          const liveGpsLocation: UserLocation = {
            latitude: lat,
            longitude: lng,
            locationName: place.locationName,
            city: place.city,
            state: place.state,
            country: place.country,
            source: 'gps',
            timestamp: new Date().toISOString(),
          };

          setActiveLocation(liveGpsLocation);
          try {
            localStorage.setItem('heatshield_active_loc', JSON.stringify(liveGpsLocation));
          } catch (e) {}

          setGpsStatusMessage('Live GPS acquired successfully.');
          setTimeout(() => setGpsStatusMessage(null), 3000);
        } catch (err) {
          console.error('Error reverse geocoding real GPS coordinates:', err);
          const liveGpsLocation: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            locationName: `${position.coords.latitude.toFixed(4)}°N, ${position.coords.longitude.toFixed(4)}°E`,
            city: 'Current Location',
            country: 'India',
            source: 'gps',
            timestamp: new Date().toISOString(),
          };
          setActiveLocation(liveGpsLocation);
        } finally {
          setIsLocatingGPS(false);
        }
      },
      (error) => {
        setIsLocatingGPS(false);
        console.warn('GPS location access error:', error.message);
        if (isManualTrigger) {
          if (error.code === error.PERMISSION_DENIED) {
            setGpsStatusMessage('GPS permission denied. Using fallback location.');
          } else if (error.code === error.TIMEOUT) {
            setGpsStatusMessage('GPS request timed out. Using fallback location.');
          } else {
            setGpsStatusMessage('GPS unavailable. Using fallback location.');
          }
          setTimeout(() => setGpsStatusMessage(null), 4000);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Force fresh coordinates, bypass stale browser cache
      }
    );
  }, []);

  // Request real GPS coordinates on initial launch
  useEffect(() => {
    handleRequestBrowserGps(false);
  }, [handleRequestBrowserGps]);

  // 1. Listen for Firebase Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          let profile = await getUserProfile(user.uid);
          if (!profile) {
            await initializeUserProfile(user.uid, user.email);
            profile = await getUserProfile(user.uid);
          }
          setUserProfile(profile);

          if (profile?.selectedLocation) {
            setActiveLocation(profile.selectedLocation);
            localStorage.setItem('heatshield_active_loc', JSON.stringify(profile.selectedLocation));
          }
          if (profile?.savedLocations) {
            setSavedLocations(profile.savedLocations);
            localStorage.setItem('heatshield_saved_places', JSON.stringify(profile.savedLocations));
          }
        } catch (err) {
          console.error('Error loading user profile on auth change:', err);
        }
      } else {
        setUserProfile(null);
      }
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Fetch Real Weather Data whenever activeLocation changes
  const loadWeatherData = useCallback(
    async (loc: UserLocation, isManualRefresh = false) => {
      if (isManualRefresh) {
        setIsRefreshingWeather(true);
      } else {
        setIsLoadingWeather(true);
      }
      setWeatherError(null);

      try {
        const data = await fetchRealWeather(loc.latitude, loc.longitude, loc);
        setWeatherData(data);

        // Record real daily observation to history
        if (data.analysis && data.daily.length > 0) {
          saveHeatRecord({
            date: data.daily[0].date,
            locationName: loc.locationName,
            latitude: loc.latitude,
            longitude: loc.longitude,
            maxTemperature: data.daily[0].temperatureMax,
            minTemperature: data.daily[0].temperatureMin,
            maxApparentTemperature: data.daily[0].apparentTemperatureMax,
            riskLevel: data.analysis.riskLevel,
          });
        }
      } catch (err: any) {
        console.error('Open-Meteo Weather Fetch Error:', err);
        setWeatherError('Weather information is temporarily unavailable. Please try again.');
      } finally {
        setIsLoadingWeather(false);
        setIsRefreshingWeather(false);
      }
    },
    []
  );

  useEffect(() => {
    if (activeLocation) {
      loadWeatherData(activeLocation);
    }
  }, [activeLocation, loadWeatherData]);

  // 3. Auto-refresh weather every 15 minutes
  useEffect(() => {
    if (!activeLocation) return;
    const interval = setInterval(() => {
      loadWeatherData(activeLocation, true);
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [activeLocation, loadWeatherData]);

  // 4. Handle Location Selection
  const handleLocationSelected = async (newLocation: UserLocation) => {
    setActiveLocation(newLocation);
    try {
      localStorage.setItem('heatshield_active_loc', JSON.stringify(newLocation));
    } catch (e) {}
    setShowLocationModal(false);
    setIsOnboardingLocation(false);

    if (currentUser) {
      try {
        await saveUserActiveLocation(currentUser.uid, newLocation);
      } catch (err) {
        console.error('Failed to persist location to Firestore:', err);
      }
    }
  };

  // 5. Handle Bookmarking Places
  const handleSaveLocationBookmark = async (loc: UserLocation) => {
    const newItem: SavedLocationItem = {
      id: `${loc.latitude.toFixed(4)}_${loc.longitude.toFixed(4)}_${Date.now()}`,
      latitude: loc.latitude,
      longitude: loc.longitude,
      locationName: loc.locationName,
      city: loc.city,
      state: loc.state,
      country: loc.country,
      addedAt: new Date().toISOString(),
    };

    const exists = savedLocations.some(
      (s) => Math.abs(s.latitude - loc.latitude) < 0.01 && Math.abs(s.longitude - loc.longitude) < 0.01
    );
    if (!exists) {
      const updated = [...savedLocations, newItem];
      setSavedLocations(updated);
      try {
        localStorage.setItem('heatshield_saved_places', JSON.stringify(updated));
      } catch (e) {}
      if (currentUser) {
        await addSavedLocation(currentUser.uid, newItem);
      }
    }
  };

  const isCurrentLocationBookmarked =
    activeLocation &&
    savedLocations.some(
      (s) =>
        Math.abs(s.latitude - activeLocation.latitude) < 0.01 &&
        Math.abs(s.longitude - activeLocation.longitude) < 0.01
    );

  const alertCount =
    weatherData?.analysis?.riskLevel === 'Extreme' ||
    weatherData?.analysis?.riskLevel === 'Very High' ||
    weatherData?.analysis?.riskLevel === 'High'
      ? 1
      : 0;

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#17233C] font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. PERSISTENT SIDEBAR (Desktop 270px + Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        alertCount={alertCount}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. MAIN FLUID CONTENT CONTAINER (Offset 270px on Desktop) */}
      <div className="lg:pl-[270px] flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <Header
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          activeLocation={activeLocation}
          weatherData={weatherData}
          onChangeLocationClick={() => {
            setIsOnboardingLocation(false);
            setShowLocationModal(true);
          }}
          onRequestGps={() => handleRequestBrowserGps(true)}
          isLocatingGPS={isLocatingGPS}
          onRefreshClick={() => loadWeatherData(activeLocation, true)}
          isRefreshing={isRefreshingWeather}
          alertCount={alertCount}
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Dynamic Page View Router */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
          {/* Page 1: Home */}
          {activeTab === 'home' && (
            <HumanHeatHomeView
              weatherData={weatherData}
              isLoading={isLoadingWeather}
              isRefreshing={isRefreshingWeather}
              error={weatherError}
              onRefresh={() => loadWeatherData(activeLocation, true)}
              onRequestGps={() => handleRequestBrowserGps(true)}
              isLocatingGPS={isLocatingGPS}
              gpsStatusMessage={gpsStatusMessage}
              onChangeLocation={() => {
                setIsOnboardingLocation(false);
                setShowLocationModal(true);
              }}
              onNavigateToForecast={() => setActiveTab('forecast')}
              onNavigateToMap={() => setActiveTab('map')}
              onSaveLocationBookmark={handleSaveLocationBookmark}
              isBookmarked={!!isCurrentLocationBookmarked}
            />
          )}

          {/* Page 2: Heat Forecast */}
          {activeTab === 'forecast' && (
            <HeatForecastView
              weatherData={weatherData}
              onChangeLocation={() => {
                setIsOnboardingLocation(false);
                setShowLocationModal(true);
              }}
            />
          )}

          {/* Page 3: Heat Map */}
          {activeTab === 'map' && (
            <HeatMapView
              weatherData={weatherData}
              onSelectLocation={handleLocationSelected}
            />
          )}

          {/* Page 4: Plan My Day */}
          {activeTab === 'plan' && (
            <PlanMyDayView
              weatherData={weatherData}
              onNavigateToForecast={() => setActiveTab('forecast')}
              onNavigateToSafety={() => setActiveTab('safety')}
            />
          )}

          {/* Page 5: Nearby Cooling & Help */}
          {activeTab === 'nearby' && (
            <NearbyCoolingHelpView weatherData={weatherData} />
          )}

          {/* Page 6: Alerts */}
          {activeTab === 'alerts' && (
            <HeatAlertsView weatherData={weatherData} />
          )}

          {/* Page 7: AI Heat Insights */}
          {activeTab === 'insights' && (
            <RealHeatInsightsView
              weatherData={weatherData}
              onNavigateToPlan={() => setActiveTab('plan')}
            />
          )}

          {/* Page 8: Health & Heat (Heat & Your Body) */}
          {activeTab === 'body' && (
            <HeatAndBodyView
              onNavigateToEmergency={() => setActiveTab('emergency')}
            />
          )}

          {/* Page 9: Safety Guide */}
          {activeTab === 'safety' && (
            <SafetyGuideView weatherData={weatherData} />
          )}

          {/* Page 10: Who Needs Care? */}
          {activeTab === 'care' && (
            <WhoNeedsCareView weatherData={weatherData} />
          )}

          {/* Page 11: Heat Trend */}
          {activeTab === 'trend' && (
            <HeatTrendView
              weatherData={weatherData}
              onNavigateToForecast={() => setActiveTab('forecast')}
            />
          )}

          {/* Page 12: Heat History */}
          {activeTab === 'history' && (
            <HeatHistoryView weatherData={weatherData} />
          )}

          {/* Page 13: My Heat Profile */}
          {activeTab === 'my-profile' && (
            <MyHeatProfileView weatherData={weatherData} />
          )}

          {/* Page 14: Settings */}
          {activeTab === 'settings' && (
            <SettingsView />
          )}

          {/* Page 15: Help & Support */}
          {activeTab === 'help' && (
            <HelpSupportView
              onNavigateToEmergency={() => setActiveTab('emergency')}
            />
          )}

          {/* Page 16: Emergency Help */}
          {activeTab === 'emergency' && (
            <EmergencyHelpView
              onNavigateToNearby={() => setActiveTab('nearby')}
            />
          )}

          {/* Municipal Authority Heat Action Plan (HAP) */}
          {activeTab === 'hap' && (
            <AuthorityHeatActionPlan
              city={
                INDIAN_CITIES.find(
                  (c) =>
                    c.name.toLowerCase() === weatherData?.location.city?.toLowerCase() ||
                    c.id.toLowerCase() === weatherData?.location.city?.toLowerCase()
                ) || INDIAN_CITIES[0]
              }
              wardProfiles={[]}
            />
          )}

          {/* Data Science & Methodology Transparency */}
          {activeTab === 'datascience' && (
            <AuthorityDataScience
              city={
                INDIAN_CITIES.find(
                  (c) =>
                    c.name.toLowerCase() === weatherData?.location.city?.toLowerCase() ||
                    c.id.toLowerCase() === weatherData?.location.city?.toLowerCase()
                ) || INDIAN_CITIES[0]
              }
              wardProfiles={[]}
            />
          )}
        </main>

        {/* Unified Application Footer */}
        <footer className="border-t border-[#E2E8F0] bg-white py-6 px-6 text-center text-xs text-[#64748B] space-y-1 mt-auto">
          <div className="font-semibold text-[#17233C]">
            HeatShield AI — Know the heat. Stay safe.
          </div>
          <div className="text-[11px] text-[#64748B]">
            Extreme Heatwave & Human Thermal Stress Prediction System • Powered by Open-Meteo Ensemble & OpenStreetMap
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <AuthScreen
              onAuthSuccess={() => setShowAuthModal(false)}
              onSkip={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}

      {/* Location Setup / Change Location Modal */}
      <LocationSetupModal
        isOpen={showLocationModal}
        isOnboarding={isOnboardingLocation}
        currentLocation={activeLocation}
        onLocationSelected={handleLocationSelected}
        onClose={() => {
          if (activeLocation) {
            setShowLocationModal(false);
          }
        }}
      />
    </div>
  );
}

export default App;
