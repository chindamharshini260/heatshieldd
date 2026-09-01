/**
 * Real Nearby Amenities Service
 * Queries verified OpenStreetMap Overpass API for real hospitals, clinics,
 * pharmacies, shaded parks/gardens, drinking water points, and public shelters.
 * 
 * 100% Real Geographic Data — No fabricated places.
 */

export interface NearbyPlace {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'park' | 'drinking_water' | 'shelter';
  categoryLabel: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  address?: string;
  openingHours?: string;
  phone?: string;
}

/**
 * Calculates Haversine distance in kilometers between two lat/lon points
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Fetches real nearby amenities from OpenStreetMap Overpass API
 */
export async function fetchRealNearbyPlaces(
  lat: number,
  lon: number,
  radiusMeters: number = 5000
): Promise<NearbyPlace[]> {
  const overpassQuery = `[out:json][timeout:15];
(
  node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
  node["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
  node["healthcare"="centre"](around:${radiusMeters},${lat},${lon});
  node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
  node["amenity"="drinking_water"](around:${radiusMeters},${lat},${lon});
  node["amenity"="shelter"](around:${radiusMeters},${lat},${lon});
  node["amenity"="community_centre"](around:${radiusMeters},${lat},${lon});
  node["leisure"="park"](around:${radiusMeters},${lat},${lon});
  way["leisure"="park"](around:${radiusMeters},${lat},${lon});
  way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
);
out center 30;`;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    overpassQuery
  )}`;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) {
      throw new Error(`Overpass service returned HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.elements)) {
      return [];
    }

    const places: NearbyPlace[] = [];

    for (const elem of data.elements) {
      const placeLat = elem.lat ?? elem.center?.lat;
      const placeLon = elem.lon ?? elem.center?.lon;
      if (!placeLat || !placeLon) continue;

      const tags = elem.tags || {};
      let type: NearbyPlace['type'] = 'shelter';
      let categoryLabel = 'Public Space';

      if (tags.amenity === 'hospital') {
        type = 'hospital';
        categoryLabel = 'Hospital';
      } else if (tags.amenity === 'clinic' || tags.healthcare === 'centre') {
        type = 'clinic';
        categoryLabel = 'Clinic & Health Center';
      } else if (tags.amenity === 'pharmacy') {
        type = 'pharmacy';
        categoryLabel = 'Pharmacy';
      } else if (tags.leisure === 'park' || tags.leisure === 'garden') {
        type = 'park';
        categoryLabel = 'Shaded Park / Green Space';
      } else if (tags.amenity === 'drinking_water') {
        type = 'drinking_water';
        categoryLabel = 'Drinking Water Point';
      } else if (tags.amenity === 'shelter' || tags.amenity === 'community_centre') {
        type = 'shelter';
        categoryLabel = 'Public Shelter & Cooling Space';
      }

      const name =
        tags.name ||
        tags['name:en'] ||
        tags.operator ||
        `${categoryLabel} (Local Facility)`;

      const address = [
        tags['addr:street'],
        tags['addr:suburb'],
        tags['addr:city'],
      ]
        .filter(Boolean)
        .join(', ');

      const dist = calculateDistanceKm(lat, lon, placeLat, placeLon);

      places.push({
        id: `osm_${elem.type}_${elem.id}`,
        name,
        type,
        categoryLabel,
        latitude: placeLat,
        longitude: placeLon,
        distanceKm: dist,
        address: address || undefined,
        openingHours: tags.opening_hours,
        phone: tags.phone || tags['contact:phone'],
      });
    }

    // Sort by nearest distance
    return places.sort((a, b) => a.distanceKm - b.distanceKm);
  } catch (err) {
    console.warn('Real Overpass API fetch error or timeout:', err);
    return [];
  }
}
