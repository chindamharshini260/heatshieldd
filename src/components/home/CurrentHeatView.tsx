/**
 * Main Home Screen - Phase 1
 * Primary Question: "How is the heat around you?"
 * Displays 100% real Open-Meteo meteorological data in clear, simple terms.
 */

import React, { useState } from 'react';
import {
  MapPin,
  RefreshCw,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { CompleteWeatherData, UserLocation } from '../../types/weather';

interface CurrentHeatViewProps {
  weatherData: CompleteWeatherData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onChangeLocation: () => void;
  onSaveLocationBookmark?: (location: UserLocation) => void;
  isBookmarked?: boolean;
}

export const CurrentHeatView: React.FC<CurrentHeatViewProps> = ({
  weatherData,
  isLoading,
  isRefreshing,
  error,
  onRefresh,
  onChangeLocation,
  onSaveLocationBookmark,
  isBookmarked = false,
}) => {
  const [bookmarkSaved, setBookmarkSaved] = useState(false);

  // Weather Icon helper
  const renderWeatherIcon = (code: number, isDay: boolean, sizeClass: string = 'w-6 h-6') => {
    if (code === 0) {
      return <Sun className={`${sizeClass} text-amber-500`} />;
    } else if (code <= 2) {
      return <CloudSun className={`${sizeClass} text-amber-500`} />;
    } else if (code === 3 || code === 45 || code === 48) {
      return <Cloud className={`${sizeClass} text-slate-400`} />;
    } else if (code >= 51 && code <= 82) {
      return <CloudRain className={`${sizeClass} text-blue-500`} />;
    } else if (code >= 95) {
      return <CloudLightning className={`${sizeClass} text-purple-500`} />;
    }
    return <Sun className={`${sizeClass} text-amber-500`} />;
  };

  // Simple, human-friendly heat advisory based purely on apparent temperature
  const getSimpleHeatGuidance = (temp: number, apparentTemp: number) => {
    const effective = Math.max(temp, apparentTemp);
    if (effective >= 42) {
      return {
        level: 'Extreme Heat Danger',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        cardBg: 'bg-rose-50/70 border-rose-200',
        advice: 'Very high heat outside. Avoid direct afternoon sun, stay in shaded or cooled rooms, and drink plenty of water.',
      };
    } else if (effective >= 38) {
      return {
        level: 'High Heat Warning',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        cardBg: 'bg-amber-50/60 border-amber-200',
        advice: 'Intense heat conditions. Drink water regularly and take frequent breaks if you need to be outdoors.',
      };
    } else if (effective >= 33) {
      return {
        level: 'Moderate Warmth',
        badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        cardBg: 'bg-yellow-50/50 border-yellow-200',
        advice: 'Warm outdoor weather. Carry a water bottle and keep yourself hydrated throughout the day.',
      };
    } else {
      return {
        level: 'Comfortable',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        cardBg: 'bg-emerald-50/50 border-emerald-200',
        advice: 'Comfortable thermal conditions. Good for outdoor activities.',
      };
    }
  };

  const handleBookmarkClick = () => {
    if (weatherData?.location && onSaveLocationBookmark) {
      onSaveLocationBookmark(weatherData.location);
      setBookmarkSaved(true);
      setTimeout(() => setBookmarkSaved(false), 2500);
    }
  };

  if (isLoading && !weatherData) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
        <RefreshCw className="w-10 h-10 text-rose-500 animate-spin" />
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 text-base">Checking live heat conditions...</h3>
          <p className="text-xs text-slate-500">Retrieving real meteorological measurements from Open-Meteo</p>
        </div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-rose-200 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">Weather information is temporarily unavailable.</h3>
          <p className="text-xs text-slate-600 mt-1">Please try again or check your internet connection.</p>
        </div>
        <div className="pt-2 flex gap-3 justify-center">
          <button
            onClick={onRefresh}
            className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <button
            onClick={onChangeLocation}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Change Location
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const current = weatherData.current;
  const location = weatherData.location;
  const guidance = getSimpleHeatGuidance(current.temperature, current.apparentTemperature);

  // Format updated timestamp
  const formatUpdateTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Main Heading */}
      <div className="text-center sm:text-left space-y-2 pt-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          How is the heat around you?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Live, verified outdoor heat metrics for your selected locality.
        </p>
      </div>

      {/* Location Badge & Controls Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-slate-900">
                {location.locationName}
              </span>
              {location.state && (
                <span className="text-xs text-slate-500 font-medium">
                  {location.state}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
              {location.source === 'gps' ? (
                <span className="text-blue-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Using your current location
                </span>
              ) : (
                <span className="text-slate-500">Selected location</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onSaveLocationBookmark && (
            <button
              onClick={handleBookmarkClick}
              title="Save to My Places"
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isBookmarked || bookmarkSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isBookmarked || bookmarkSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-amber-600" />
                  <span className="hidden sm:inline">Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline">Save</span>
                </>
              )}
            </button>
          )}

          <button
            id="btn-change-location-header"
            onClick={onChangeLocation}
            className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Change Location</span>
          </button>
        </div>
      </div>

      {/* Main Current Heat Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Top bar of card: "Right now" & Weather Condition */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Right now
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${guidance.badgeColor}`}>
              {guidance.level}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {renderWeatherIcon(current.weatherCode, current.isDay, 'w-5 h-5')}
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {current.weatherDescription}
            </span>
          </div>
        </div>

        {/* Big Temperature Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Air Temperature
            </div>
            <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight flex items-baseline">
              <span>{Math.round(current.temperature)}</span>
              <span className="text-3xl text-rose-500 font-bold ml-1">°C</span>
            </div>
            <p className="text-xs text-slate-500">Measured in shaded ambient conditions</p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-1">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-600" />
              Feels Like
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-950">
              {Math.round(current.apparentTemperature)}°C
            </div>
            <p className="text-xs text-amber-800/80 leading-snug">
              Accounts for sunlight, moisture and humidity on your body.
            </p>
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Temperature */}
          <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Temperature</span>
              <Thermometer className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">
              {current.temperature}°C
            </div>
            <div className="text-[10px] text-slate-400">Actual ambient</div>
          </div>

          {/* Feels Like */}
          <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Feels Like</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">
              {current.apparentTemperature}°C
            </div>
            <div className="text-[10px] text-slate-400">Body perception</div>
          </div>

          {/* Humidity */}
          <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Humidity</span>
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">
              {current.relativeHumidity}%
            </div>
            <div className="text-[10px] text-slate-400">Moisture in air</div>
          </div>

          {/* Wind */}
          <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Wind</span>
              <Wind className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">
              {current.windSpeed} <span className="text-xs font-normal">km/h</span>
            </div>
            <div className="text-[10px] text-slate-400">Surface breeze</div>
          </div>
        </div>

        {/* Simple Practical Guidance Banner */}
        <div className={`p-4 rounded-2xl border ${guidance.cardBg} flex items-start gap-3`}>
          <ShieldCheck className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {guidance.advice}
          </div>
        </div>
      </div>

      {/* Hourly Timeline - Next 24 Hours */}
      {weatherData.hourly && weatherData.hourly.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Heat Through the Day (Next 24 Hours)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Hourly forecast</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
            {weatherData.hourly.slice(0, 16).map((item, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-20 p-3 rounded-2xl text-center space-y-2 border transition-all ${
                  idx === 0
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold text-slate-600">{item.displayTime}</div>
                <div className="flex justify-center py-0.5">
                  {renderWeatherIcon(item.weatherCode, item.isDay, 'w-5 h-5')}
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  {Math.round(item.temperature)}°
                </div>
                <div className="text-[10px] text-amber-700 font-semibold bg-amber-100/70 px-1.5 py-0.5 rounded-full">
                  FL {Math.round(item.apparentTemperature)}°
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5-Day Simple Daily Forecast */}
      {weatherData.daily && weatherData.daily.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Next 5 Days Forecast
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">High / Low</span>
          </div>

          <div className="divide-y divide-slate-100">
            {weatherData.daily.map((day, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="w-24 font-bold text-slate-800">{day.dayName}</div>
                <div className="flex items-center gap-2 flex-1 justify-start">
                  {renderWeatherIcon(day.weatherCode, true, 'w-4 h-4')}
                  <span className="text-slate-600 text-xs hidden sm:inline">
                    {day.weatherDescription}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-semibold">
                  <span className="text-rose-600 font-bold">{day.temperatureMax}°</span>
                  <span className="text-slate-400 font-normal">/</span>
                  <span className="text-slate-500">{day.temperatureMin}°C</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Attribution & Refresh Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="space-y-0.5">
          <div className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span>Weather source:</span>
            <span className="font-bold text-blue-600">{weatherData.rawSource}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Updated: {formatUpdateTime(current.updatedAt)}
          </div>
        </div>

        <button
          id="btn-refresh-weather"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="py-2 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Updating...' : 'Refresh Weather'}</span>
        </button>
      </div>
    </div>
  );
};
