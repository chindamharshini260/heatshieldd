/**
 * User Profile & Location Storage Service
 * Manages Firestore user document persistence for locations and bookmarks
 */

import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SavedLocationItem, UserLocation, UserProfileData } from '../types/weather';

const USERS_COLLECTION = 'users';

/**
 * Loads user profile including last selected location and saved locations from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfileData | null> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const snapshot = await getDoc(userDocRef);

    if (snapshot.exists()) {
      return snapshot.data() as UserProfileData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile from Firestore:', error);
    return null;
  }
}

/**
 * Initializes or updates user basic profile on login
 */
export async function initializeUserProfile(
  uid: string,
  email: string | null,
  displayName?: string | null
): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
      const newProfile: UserProfileData = {
        uid,
        email,
        displayName: displayName || null,
        selectedLocation: null,
        savedLocations: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, newProfile);
    } else {
      await updateDoc(userDocRef, {
        updatedAt: new Date().toISOString(),
        ...(email ? { email } : {}),
      });
    }
  } catch (error) {
    console.error('Error initializing user profile:', error);
  }
}

/**
 * Saves or updates user's active selected location in Firestore
 */
export async function saveUserActiveLocation(
  uid: string,
  location: UserLocation
): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(
      userDocRef,
      {
        selectedLocation: location,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving user active location to Firestore:', error);
    throw error;
  }
}

/**
 * Adds a place to user's saved locations list
 */
export async function addSavedLocation(
  uid: string,
  locationItem: SavedLocationItem
): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userDocRef, {
      savedLocations: arrayUnion(locationItem),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error adding saved location:', error);
    // If document doesn't exist yet, set it
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(
      userDocRef,
      {
        savedLocations: [locationItem],
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }
}

/**
 * Removes a place from user's saved locations list
 */
export async function removeSavedLocation(
  uid: string,
  locationItem: SavedLocationItem
): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userDocRef, {
      savedLocations: arrayRemove(locationItem),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error removing saved location:', error);
  }
}
