/**
 * Heat History Service
 * Persists real daily thermal observations locally to build genuine,
 * transparent heat tracking over time without fabricating any data.
 */

import { HeatRiskLevel } from '../types/heatHealth';

export interface DailyHeatRecord {
  id: string;
  date: string; // YYYY-MM-DD
  locationName: string;
  latitude: number;
  longitude: number;
  maxTemperature: number;
  minTemperature: number;
  maxApparentTemperature: number;
  riskLevel: HeatRiskLevel;
  recordedAt?: string; // ISO string
  notes?: string;
}

export type HeatRecordItem = DailyHeatRecord;

const STORAGE_KEY = 'heatshield_daily_history_v1';

export function getRecordedHeatHistory(): DailyHeatRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.error('Error reading heat history from storage:', err);
    return [];
  }
}

export const getStoredHeatRecords = getRecordedHeatHistory;

export function clearStoredHeatRecords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing heat history storage:', err);
  }
}

export function saveHeatRecord(record: Omit<DailyHeatRecord, 'id' | 'recordedAt'>): void {
  try {
    const current = getRecordedHeatHistory();
    const todayStr = record.date;

    // Check if record for this date + location already exists
    const existingIndex = current.findIndex(
      (r) =>
        r.date === todayStr &&
        Math.abs(r.latitude - record.latitude) < 0.05 &&
        Math.abs(r.longitude - record.longitude) < 0.05
    );

    const newEntry: DailyHeatRecord = {
      ...record,
      id: `${record.date}_${record.latitude.toFixed(2)}_${record.longitude.toFixed(2)}`,
      recordedAt: new Date().toISOString(),
    };

    let updated: DailyHeatRecord[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = newEntry;
    } else {
      updated = [newEntry, ...current].slice(0, 60); // Keep up to 60 days
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving heat record:', err);
  }
}
