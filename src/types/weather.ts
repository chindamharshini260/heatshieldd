/**
 * Types for HeatShield AI
 */

import { HumanHeatAnalysis } from './heatHealth';

export interface UserLocation {
  latitude: number;
  longitude: number;
  locationName: string;
  city?: string;
  state?: string;
  country?: string;
  source: 'gps' | 'search' | 'map' | 'saved' | 'fallback';
  timestamp: string; // ISO string
}

export interface SavedLocationItem {
  id: string;
  latitude: number;
  longitude: number;
  locationName: string;
  city?: string;
  state?: string;
  country?: string;
  addedAt: string;
}

export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName?: string | null;
  selectedLocation?: UserLocation | null;
  savedLocations?: SavedLocationItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GeocodingResult {
  id: number | string;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string; // State / Province
  admin2?: string; // District
  country?: string;
  display_name?: string;
}

export interface CurrentWeatherData {
  temperature: number; // °C
  apparentTemperature: number; // Feels like °C
  relativeHumidity: number; // %
  windSpeed: number; // km/h
  solarRadiation?: number; // W/m² (direct / global solar irradiance)
  weatherCode: number; // WMO weather code
  weatherDescription: string;
  precipitation: number; // mm
  isDay: boolean;
  time: string; // ISO / UTC string from API
  updatedAt: Date;
}

export interface HourlyForecastItem {
  time: string; // ISO string
  displayTime: string; // e.g. "2 PM", "3 PM"
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  solarRadiation?: number; // W/m²
  precipitationProbability: number;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string; // "2026-08-26"
  dayName: string; // "Today", "Thu", "Fri"
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  precipitationProbabilityMax: number;
  weatherCode: number;
  weatherDescription: string;
}

export interface CompleteWeatherData {
  location: UserLocation;
  current: CurrentWeatherData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  rawSource: string; // "Open-Meteo"
  sourceTimestamp: string;
  analysis: HumanHeatAnalysis;
}
