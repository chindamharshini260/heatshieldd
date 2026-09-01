/**
 * Personal Heat Profile Preferences
 * Allows public users to select general lifestyle routines (e.g. outdoor worker,
 * commuter, athlete, caring for toddlers or seniors) to tailor safety advice.
 * 
 * STRICT PRIVACY: NEVER asks for medical conditions, diagnoses, or sensitive health data.
 */

export type LifestyleRoutine =
  | 'outdoor_work'
  | 'outdoor_exercise'
  | 'commuter'
  | 'mostly_indoors'
  | 'caring_children'
  | 'caring_seniors';

export interface UserHeatProfilePreferences {
  routines: LifestyleRoutine[];
  coolingAccess: 'ac' | 'evaporative_cooler' | 'fan_only' | 'limited';
  hydrationRemindersEnabled: boolean;
  morningDigestEnabled: boolean;
}

const STORAGE_KEY = 'heatshield_user_preferences_v1';

const DEFAULT_PREFERENCES: UserHeatProfilePreferences = {
  routines: [],
  coolingAccess: 'fan_only',
  hydrationRemindersEnabled: true,
  morningDigestEnabled: true,
};

export function getUserHeatPreferences(): UserHeatProfilePreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch (err) {
    console.error('Error reading user preferences:', err);
    return DEFAULT_PREFERENCES;
  }
}

export function saveUserHeatPreferences(
  prefs: Partial<UserHeatProfilePreferences>
): UserHeatProfilePreferences {
  try {
    const current = getUserHeatPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving user preferences:', err);
    return DEFAULT_PREFERENCES;
  }
}
