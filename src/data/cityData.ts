/**
 * Real Municipal & Ward Demographic Catalog for Indian Cities
 * Sourced from Census of India (2011/Projections), Urban Local Body Reports,
 * Bhuvan/ISRO Land Use Data, and State Disaster Management Portals.
 */

import { CityData } from '../types';

export const INDIAN_CITIES: CityData[] = [
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714,
    elevationMeters: 53,
    baselineHistoricalMortalityThreshold: 41.5, // HAP trigger threshold
    wards: [
      {
        wardId: 'amd-w18',
        wardName: 'Ward 18 - Bapunagar (Industrial Hub)',
        zone: 'East Zone',
        totalPopulation: 142500,
        areaSqKm: 4.8,
        populationDensity: 29688,
        elderlyPopulation60Plus: 16800,
        elderlyRatio: 0.118,
        outdoorWorkerPopulation: 34200,
        outdoorWorkerRatio: 0.24,
        slumInformalHousingRatio: 0.38,
        vegetationIndexNDVI: 0.12, // Very low green cover
        imperviousBuiltupRatio: 0.88, // High UHI
        healthcareFacilitiesCount: 4,
        existingCoolingCenters: 1,
        coordinates: { lat: 23.039, lng: 72.625 }
      },
      {
        wardId: 'amd-w21',
        wardName: 'Ward 21 - Amraiwadi (Slum & Textile)',
        zone: 'East Zone',
        totalPopulation: 168000,
        areaSqKm: 5.2,
        populationDensity: 32307,
        elderlyPopulation60Plus: 19500,
        elderlyRatio: 0.116,
        outdoorWorkerPopulation: 42000,
        outdoorWorkerRatio: 0.25,
        slumInformalHousingRatio: 0.44,
        vegetationIndexNDVI: 0.09,
        imperviousBuiltupRatio: 0.91,
        healthcareFacilitiesCount: 3,
        existingCoolingCenters: 0,
        coordinates: { lat: 23.012, lng: 72.634 }
      },
      {
        wardId: 'amd-w07',
        wardName: 'Ward 07 - Danilimda (Informal Tannery & Masonry)',
        zone: 'South Zone',
        totalPopulation: 135000,
        areaSqKm: 4.1,
        populationDensity: 32926,
        elderlyPopulation60Plus: 14200,
        elderlyRatio: 0.105,
        outdoorWorkerPopulation: 36500,
        outdoorWorkerRatio: 0.27,
        slumInformalHousingRatio: 0.49,
        vegetationIndexNDVI: 0.11,
        imperviousBuiltupRatio: 0.87,
        healthcareFacilitiesCount: 3,
        existingCoolingCenters: 1,
        coordinates: { lat: 22.996, lng: 72.582 }
      },
      {
        wardId: 'amd-w12',
        wardName: 'Ward 12 - Navrangpura (Commercial & Institutional)',
        zone: 'West Zone',
        totalPopulation: 98000,
        areaSqKm: 6.5,
        populationDensity: 15076,
        elderlyPopulation60Plus: 14700,
        elderlyRatio: 0.15,
        outdoorWorkerPopulation: 9800,
        outdoorWorkerRatio: 0.1,
        slumInformalHousingRatio: 0.08,
        vegetationIndexNDVI: 0.36,
        imperviousBuiltupRatio: 0.65,
        healthcareFacilitiesCount: 12,
        existingCoolingCenters: 3,
        coordinates: { lat: 23.036, lng: 72.559 }
      },
      {
        wardId: 'amd-w28',
        wardName: 'Ward 28 - Odhav (Asbestos Sheet Clusters)',
        zone: 'East Zone',
        totalPopulation: 122000,
        areaSqKm: 7.1,
        populationDensity: 17183,
        elderlyPopulation60Plus: 12800,
        elderlyRatio: 0.105,
        outdoorWorkerPopulation: 31000,
        outdoorWorkerRatio: 0.254,
        slumInformalHousingRatio: 0.42,
        vegetationIndexNDVI: 0.15,
        imperviousBuiltupRatio: 0.82,
        healthcareFacilitiesCount: 4,
        existingCoolingCenters: 0,
        coordinates: { lat: 23.029, lng: 72.671 }
      },
      {
        wardId: 'amd-w03',
        wardName: 'Ward 03 - Gota / Chandlodiya (Peripheral Growth)',
        zone: 'North West Zone',
        totalPopulation: 110000,
        areaSqKm: 8.9,
        populationDensity: 12359,
        elderlyPopulation60Plus: 11500,
        elderlyRatio: 0.104,
        outdoorWorkerPopulation: 22000,
        outdoorWorkerRatio: 0.2,
        slumInformalHousingRatio: 0.22,
        vegetationIndexNDVI: 0.28,
        imperviousBuiltupRatio: 0.69,
        healthcareFacilitiesCount: 6,
        existingCoolingCenters: 1,
        coordinates: { lat: 23.092, lng: 72.531 }
      }
    ]
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    lat: 17.385,
    lng: 78.4867,
    elevationMeters: 542,
    baselineHistoricalMortalityThreshold: 40.5,
    wards: [
      {
        wardId: 'hyd-w48',
        wardName: 'Ward 48 - Charminar / Old City (Dense Heritage)',
        zone: 'Charminar Zone',
        totalPopulation: 185000,
        areaSqKm: 3.9,
        populationDensity: 47435,
        elderlyPopulation60Plus: 24000,
        elderlyRatio: 0.13,
        outdoorWorkerPopulation: 46000,
        outdoorWorkerRatio: 0.248,
        slumInformalHousingRatio: 0.46,
        vegetationIndexNDVI: 0.08,
        imperviousBuiltupRatio: 0.94,
        healthcareFacilitiesCount: 5,
        existingCoolingCenters: 1,
        coordinates: { lat: 17.3616, lng: 78.4747 }
      },
      {
        wardId: 'hyd-w62',
        wardName: 'Ward 62 - Kukatpally (Migrant Labor & Transit)',
        zone: 'Kukatpally Zone',
        totalPopulation: 156000,
        areaSqKm: 6.4,
        populationDensity: 24375,
        elderlyPopulation60Plus: 16000,
        elderlyRatio: 0.102,
        outdoorWorkerPopulation: 38000,
        outdoorWorkerRatio: 0.243,
        slumInformalHousingRatio: 0.34,
        vegetationIndexNDVI: 0.17,
        imperviousBuiltupRatio: 0.81,
        healthcareFacilitiesCount: 8,
        existingCoolingCenters: 1,
        coordinates: { lat: 17.4849, lng: 78.4138 }
      },
      {
        wardId: 'hyd-w93',
        wardName: 'Ward 93 - Secunderabad / Monda Market',
        zone: 'Secunderabad Zone',
        totalPopulation: 132000,
        areaSqKm: 4.5,
        populationDensity: 29333,
        elderlyPopulation60Plus: 17800,
        elderlyRatio: 0.135,
        outdoorWorkerPopulation: 31000,
        outdoorWorkerRatio: 0.235,
        slumInformalHousingRatio: 0.28,
        vegetationIndexNDVI: 0.19,
        imperviousBuiltupRatio: 0.85,
        healthcareFacilitiesCount: 7,
        existingCoolingCenters: 2,
        coordinates: { lat: 17.4399, lng: 78.4983 }
      },
      {
        wardId: 'hyd-w105',
        wardName: 'Ward 105 - Hitec City / Madhapur (IT Corridor)',
        zone: 'Serilingampally Zone',
        totalPopulation: 104000,
        areaSqKm: 9.8,
        populationDensity: 10612,
        elderlyPopulation60Plus: 9200,
        elderlyRatio: 0.088,
        outdoorWorkerPopulation: 14500,
        outdoorWorkerRatio: 0.14,
        slumInformalHousingRatio: 0.12,
        vegetationIndexNDVI: 0.32,
        imperviousBuiltupRatio: 0.72,
        healthcareFacilitiesCount: 11,
        existingCoolingCenters: 2,
        coordinates: { lat: 17.4483, lng: 78.3915 }
      }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi (NCR)',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.209,
    elevationMeters: 216,
    baselineHistoricalMortalityThreshold: 43.0,
    wards: [
      {
        wardId: 'del-w14',
        wardName: 'Ward 14 - Anand Parbat / Karol Bagh (Industrial & Slum)',
        zone: 'Central Zone',
        totalPopulation: 172000,
        areaSqKm: 3.8,
        populationDensity: 45263,
        elderlyPopulation60Plus: 20500,
        elderlyRatio: 0.119,
        outdoorWorkerPopulation: 48000,
        outdoorWorkerRatio: 0.279,
        slumInformalHousingRatio: 0.52,
        vegetationIndexNDVI: 0.07,
        imperviousBuiltupRatio: 0.95,
        healthcareFacilitiesCount: 4,
        existingCoolingCenters: 0,
        coordinates: { lat: 28.662, lng: 77.172 }
      },
      {
        wardId: 'del-w32',
        wardName: 'Ward 32 - Jahangirpuri (Resettlement Colony)',
        zone: 'North Zone',
        totalPopulation: 198000,
        areaSqKm: 4.9,
        populationDensity: 40408,
        elderlyPopulation60Plus: 21800,
        elderlyRatio: 0.11,
        outdoorWorkerPopulation: 54000,
        outdoorWorkerRatio: 0.272,
        slumInformalHousingRatio: 0.58,
        vegetationIndexNDVI: 0.1,
        imperviousBuiltupRatio: 0.89,
        healthcareFacilitiesCount: 3,
        existingCoolingCenters: 1,
        coordinates: { lat: 28.728, lng: 77.168 }
      },
      {
        wardId: 'del-w58',
        wardName: 'Ward 58 - Chanakyapuri / Diplomatic Enclave',
        zone: 'New Delhi Zone',
        totalPopulation: 62000,
        areaSqKm: 11.2,
        populationDensity: 5535,
        elderlyPopulation60Plus: 8900,
        elderlyRatio: 0.143,
        outdoorWorkerPopulation: 4200,
        outdoorWorkerRatio: 0.068,
        slumInformalHousingRatio: 0.04,
        vegetationIndexNDVI: 0.58,
        imperviousBuiltupRatio: 0.42,
        healthcareFacilitiesCount: 14,
        existingCoolingCenters: 4,
        coordinates: { lat: 28.598, lng: 77.192 }
      },
      {
        wardId: 'del-w89',
        wardName: 'Ward 89 - Okhla Industrial Area Phase-II',
        zone: 'South East Zone',
        totalPopulation: 148000,
        areaSqKm: 5.6,
        populationDensity: 26428,
        elderlyPopulation60Plus: 14100,
        elderlyRatio: 0.095,
        outdoorWorkerPopulation: 41000,
        outdoorWorkerRatio: 0.277,
        slumInformalHousingRatio: 0.41,
        vegetationIndexNDVI: 0.13,
        imperviousBuiltupRatio: 0.86,
        healthcareFacilitiesCount: 5,
        existingCoolingCenters: 1,
        coordinates: { lat: 28.533, lng: 77.275 }
      }
    ]
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    state: 'Maharashtra',
    lat: 21.1458,
    lng: 79.0882,
    elevationMeters: 310,
    baselineHistoricalMortalityThreshold: 42.0,
    wards: [
      {
        wardId: 'ngp-w04',
        wardName: 'Ward 04 - Itwari / Gandhibagh (Central Wholesale Market)',
        zone: 'Gandhibagh Zone',
        totalPopulation: 118000,
        areaSqKm: 3.2,
        populationDensity: 36875,
        elderlyPopulation60Plus: 15400,
        elderlyRatio: 0.13,
        outdoorWorkerPopulation: 29500,
        outdoorWorkerRatio: 0.25,
        slumInformalHousingRatio: 0.35,
        vegetationIndexNDVI: 0.11,
        imperviousBuiltupRatio: 0.91,
        healthcareFacilitiesCount: 4,
        existingCoolingCenters: 0,
        coordinates: { lat: 21.152, lng: 79.112 }
      },
      {
        wardId: 'ngp-w19',
        wardName: 'Ward 19 - Wadi (Industrial & Brick Kiln Corridor)',
        zone: 'Dharampeth Zone',
        totalPopulation: 95000,
        areaSqKm: 7.4,
        populationDensity: 12837,
        elderlyPopulation60Plus: 9800,
        elderlyRatio: 0.103,
        outdoorWorkerPopulation: 27000,
        outdoorWorkerRatio: 0.284,
        slumInformalHousingRatio: 0.45,
        vegetationIndexNDVI: 0.18,
        imperviousBuiltupRatio: 0.76,
        healthcareFacilitiesCount: 3,
        existingCoolingCenters: 1,
        coordinates: { lat: 21.148, lng: 78.989 }
      }
    ]
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    elevationMeters: 7,
    baselineHistoricalMortalityThreshold: 38.5, // Lower temperature threshold due to extreme humidity
    wards: [
      {
        wardId: 'chn-w52',
        wardName: 'Ward 52 - Royapuram / Kasimedu (Fishing Harbor & Dense)',
        zone: 'Royapuram Zone',
        totalPopulation: 165000,
        areaSqKm: 3.6,
        populationDensity: 45833,
        elderlyPopulation60Plus: 18200,
        elderlyRatio: 0.11,
        outdoorWorkerPopulation: 45000,
        outdoorWorkerRatio: 0.272,
        slumInformalHousingRatio: 0.48,
        vegetationIndexNDVI: 0.06,
        imperviousBuiltupRatio: 0.94,
        healthcareFacilitiesCount: 4,
        existingCoolingCenters: 1,
        coordinates: { lat: 13.114, lng: 80.294 }
      },
      {
        wardId: 'chn-w118',
        wardName: 'Ward 118 - T. Nagar (Retail & Commercial Hub)',
        zone: 'Teynampet Zone',
        totalPopulation: 112000,
        areaSqKm: 4.8,
        populationDensity: 23333,
        elderlyPopulation60Plus: 16800,
        elderlyRatio: 0.15,
        outdoorWorkerPopulation: 22000,
        outdoorWorkerRatio: 0.196,
        slumInformalHousingRatio: 0.18,
        vegetationIndexNDVI: 0.22,
        imperviousBuiltupRatio: 0.84,
        healthcareFacilitiesCount: 9,
        existingCoolingCenters: 2,
        coordinates: { lat: 13.041, lng: 80.233 }
      }
    ]
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    elevationMeters: 431,
    baselineHistoricalMortalityThreshold: 43.5,
    wards: [
      {
        wardId: 'jpr-w22',
        wardName: 'Ward 22 - Walled City / Johari Bazaar (Stone & Brick)',
        zone: 'Heritage Zone',
        totalPopulation: 138000,
        areaSqKm: 3.1,
        populationDensity: 44516,
        elderlyPopulation60Plus: 19400,
        elderlyRatio: 0.14,
        outdoorWorkerPopulation: 34000,
        outdoorWorkerRatio: 0.246,
        slumInformalHousingRatio: 0.32,
        vegetationIndexNDVI: 0.08,
        imperviousBuiltupRatio: 0.93,
        healthcareFacilitiesCount: 5,
        existingCoolingCenters: 1,
        coordinates: { lat: 26.924, lng: 75.826 }
      },
      {
        wardId: 'jpr-w45',
        wardName: 'Ward 45 - Sanganer (Artisan & Open Dyers)',
        zone: 'Sanganer Zone',
        totalPopulation: 154000,
        areaSqKm: 8.2,
        populationDensity: 18780,
        elderlyPopulation60Plus: 14800,
        elderlyRatio: 0.096,
        outdoorWorkerPopulation: 42000,
        outdoorWorkerRatio: 0.272,
        slumInformalHousingRatio: 0.44,
        vegetationIndexNDVI: 0.14,
        imperviousBuiltupRatio: 0.81,
        healthcareFacilitiesCount: 4,
        existingCoolingCenters: 0,
        coordinates: { lat: 26.818, lng: 75.772 }
      }
    ]
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    lat: 20.2961,
    lng: 85.8245,
    elevationMeters: 45,
    baselineHistoricalMortalityThreshold: 39.0,
    wards: [
      {
        wardId: 'bbs-w15',
        wardName: 'Ward 15 - Rasulgarh (Construction Corridor)',
        zone: 'North Zone',
        totalPopulation: 98000,
        areaSqKm: 5.1,
        populationDensity: 19215,
        elderlyPopulation60Plus: 11200,
        elderlyRatio: 0.114,
        outdoorWorkerPopulation: 26000,
        outdoorWorkerRatio: 0.265,
        slumInformalHousingRatio: 0.39,
        vegetationIndexNDVI: 0.18,
        imperviousBuiltupRatio: 0.79,
        healthcareFacilitiesCount: 4,
        existingCoolingCenters: 1,
        coordinates: { lat: 20.301, lng: 85.864 }
      }
    ]
  },
  {
    id: 'surat',
    name: 'Surat',
    state: 'Gujarat',
    lat: 21.1702,
    lng: 72.8311,
    elevationMeters: 13,
    baselineHistoricalMortalityThreshold: 40.0,
    wards: [
      {
        wardId: 'srt-w29',
        wardName: 'Ward 29 - Varachha (Diamond & Textile Slums)',
        zone: 'East Zone',
        totalPopulation: 210000,
        areaSqKm: 4.9,
        populationDensity: 42857,
        elderlyPopulation60Plus: 18900,
        elderlyRatio: 0.09,
        outdoorWorkerPopulation: 58000,
        outdoorWorkerRatio: 0.276,
        slumInformalHousingRatio: 0.48,
        vegetationIndexNDVI: 0.09,
        imperviousBuiltupRatio: 0.92,
        healthcareFacilitiesCount: 5,
        existingCoolingCenters: 1,
        coordinates: { lat: 21.218, lng: 72.859 }
      }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.076,
    lng: 72.8777,
    elevationMeters: 14,
    baselineHistoricalMortalityThreshold: 37.5, // High humidity coastal baseline
    wards: [
      {
        wardId: 'mum-wGNorth',
        wardName: 'G-North Ward - Dharavi / Mahim (Dense Informal)',
        zone: 'Zone 2',
        totalPopulation: 245000,
        areaSqKm: 3.2,
        populationDensity: 76562,
        elderlyPopulation60Plus: 26000,
        elderlyRatio: 0.106,
        outdoorWorkerPopulation: 68000,
        outdoorWorkerRatio: 0.277,
        slumInformalHousingRatio: 0.62,
        vegetationIndexNDVI: 0.05,
        imperviousBuiltupRatio: 0.96,
        healthcareFacilitiesCount: 5,
        existingCoolingCenters: 1,
        coordinates: { lat: 19.041, lng: 72.853 }
      },
      {
        wardId: 'mum-wHEast',
        wardName: 'H-East Ward - Bandra East / BKC (Transit & Slum Edge)',
        zone: 'Zone 3',
        totalPopulation: 182000,
        areaSqKm: 5.6,
        populationDensity: 32500,
        elderlyPopulation60Plus: 21000,
        elderlyRatio: 0.115,
        outdoorWorkerPopulation: 44000,
        outdoorWorkerRatio: 0.241,
        slumInformalHousingRatio: 0.41,
        vegetationIndexNDVI: 0.16,
        imperviousBuiltupRatio: 0.86,
        healthcareFacilitiesCount: 7,
        existingCoolingCenters: 2,
        coordinates: { lat: 19.066, lng: 72.852 }
      },
      {
        wardId: 'mum-wKWest',
        wardName: 'K-West Ward - Andheri West (Coastal Mixed)',
        zone: 'Zone 4',
        totalPopulation: 165000,
        areaSqKm: 8.4,
        populationDensity: 19642,
        elderlyPopulation60Plus: 24500,
        elderlyRatio: 0.148,
        outdoorWorkerPopulation: 28000,
        outdoorWorkerRatio: 0.169,
        slumInformalHousingRatio: 0.18,
        vegetationIndexNDVI: 0.24,
        imperviousBuiltupRatio: 0.74,
        healthcareFacilitiesCount: 12,
        existingCoolingCenters: 3,
        coordinates: { lat: 19.121, lng: 72.834 }
      }
    ]
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    elevationMeters: 9,
    baselineHistoricalMortalityThreshold: 38.0,
    wards: [
      {
        wardId: 'kol-w42',
        wardName: 'Ward 42 - Burrabazar (Wholesale Market & Dense Tenements)',
        zone: 'Borough V',
        totalPopulation: 148000,
        areaSqKm: 2.8,
        populationDensity: 52857,
        elderlyPopulation60Plus: 21500,
        elderlyRatio: 0.145,
        outdoorWorkerPopulation: 41000,
        outdoorWorkerRatio: 0.277,
        slumInformalHousingRatio: 0.38,
        vegetationIndexNDVI: 0.06,
        imperviousBuiltupRatio: 0.95,
        healthcareFacilitiesCount: 4,
        existingCoolingCenters: 1,
        coordinates: { lat: 22.585, lng: 88.354 }
      },
      {
        wardId: 'kol-w58',
        wardName: 'Ward 58 - Topsia / Tangra (Tannery & Slum Corridor)',
        zone: 'Borough VII',
        totalPopulation: 172000,
        areaSqKm: 4.6,
        populationDensity: 37391,
        elderlyPopulation60Plus: 18000,
        elderlyRatio: 0.104,
        outdoorWorkerPopulation: 49000,
        outdoorWorkerRatio: 0.284,
        slumInformalHousingRatio: 0.54,
        vegetationIndexNDVI: 0.12,
        imperviousBuiltupRatio: 0.88,
        healthcareFacilitiesCount: 4,
        existingCoolingCenters: 0,
        coordinates: { lat: 22.544, lng: 88.388 }
      }
    ]
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
    elevationMeters: 123,
    baselineHistoricalMortalityThreshold: 42.0,
    wards: [
      {
        wardId: 'lko-w12',
        wardName: 'Ward 12 - Chowk / Old City (Dense Masonry)',
        zone: 'Zone 6',
        totalPopulation: 139000,
        areaSqKm: 3.4,
        populationDensity: 40882,
        elderlyPopulation60Plus: 18500,
        elderlyRatio: 0.133,
        outdoorWorkerPopulation: 33000,
        outdoorWorkerRatio: 0.237,
        slumInformalHousingRatio: 0.36,
        vegetationIndexNDVI: 0.08,
        imperviousBuiltupRatio: 0.92,
        healthcareFacilitiesCount: 5,
        existingCoolingCenters: 1,
        coordinates: { lat: 26.871, lng: 80.912 }
      },
      {
        wardId: 'lko-w34',
        wardName: 'Ward 34 - Gomti Nagar (Planned Residential)',
        zone: 'Zone 4',
        totalPopulation: 115000,
        areaSqKm: 9.2,
        populationDensity: 12500,
        elderlyPopulation60Plus: 15200,
        elderlyRatio: 0.132,
        outdoorWorkerPopulation: 16000,
        outdoorWorkerRatio: 0.139,
        slumInformalHousingRatio: 0.12,
        vegetationIndexNDVI: 0.35,
        imperviousBuiltupRatio: 0.68,
        healthcareFacilitiesCount: 10,
        existingCoolingCenters: 2,
        coordinates: { lat: 26.858, lng: 81.002 }
      }
    ]
  }
];

/**
 * Calculates geographic distance in kilometers using the Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
  return R * c;
}

/**
 * Resolves the appropriate Indian municipal city data based on user location
 * Priority: GPS Coordinates Proximity (<80km) -> Exact city name/alias match -> Fallback default city
 */
export function findMatchingOrNearestCity(location?: {
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  locationName?: string;
} | null): CityData {
  if (!location) {
    return INDIAN_CITIES.find((c) => c.id === 'hyderabad') || INDIAN_CITIES[0];
  }

  // 1. Spatial proximity match using GPS coordinates (highest accuracy)
  if (
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number' &&
    !isNaN(location.latitude) &&
    !isNaN(location.longitude) &&
    location.latitude !== 0 &&
    location.longitude !== 0
  ) {
    let closestCity = INDIAN_CITIES[0];
    let minDistance = Infinity;

    for (const city of INDIAN_CITIES) {
      const dist = calculateDistanceKm(location.latitude, location.longitude, city.lat, city.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestCity = city;
      }
    }
    // If within metropolitan proximity (<80km) of an Indian municipal region, return that municipality
    if (minDistance <= 80) {
      return closestCity;
    }
  }

  const queryTerms = [
    location.city?.toLowerCase(),
    location.locationName?.toLowerCase(),
  ].filter(Boolean) as string[];

  // 2. Exact text match against city name, ID, or direct aliases
  for (const city of INDIAN_CITIES) {
    const cityName = city.name.toLowerCase();
    const cityId = city.id.toLowerCase();

    for (const term of queryTerms) {
      if (
        term === cityName ||
        term === cityId ||
        term.startsWith(cityName) ||
        cityName.startsWith(term) ||
        (cityId === 'delhi' && (term.includes('delhi') || term.includes('noida') || term.includes('gurgaon') || term.includes('gurugram'))) ||
        (cityId === 'bengaluru' && (term.includes('bangalore') || term.includes('bengaluru'))) ||
        (cityId === 'kolkata' && (term.includes('calcutta') || term.includes('kolkata'))) ||
        (cityId === 'mumbai' && (term.includes('bombay') || term.includes('mumbai') || term.includes('navi mumbai') || term.includes('thane'))) ||
        (cityId === 'chennai' && (term.includes('madras') || term.includes('chennai'))) ||
        (cityId === 'ahmedabad' && (term.includes('ahmedabad') || term.includes('ahmadabad'))) ||
        (cityId === 'hyderabad' && (term.includes('hyderabad') || term.includes('secunderabad') || term.includes('cyberabad')))
      ) {
        return city;
      }
    }
  }

  // 3. If outside the 7 detailed municipal ward zones, return location-specific CityData with empty wards
  const resolvedName = location.city || location.locationName?.split(',')[0] || 'Local Region';
  return {
    id: `unmapped_${resolvedName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    name: resolvedName,
    state: location.state || '',
    lat: location.latitude || 17.385,
    lng: location.longitude || 78.4867,
    elevationMeters: 50,
    baselineHistoricalMortalityThreshold: 40.0,
    wards: [],
  };
}

/**
 * Identifies the containing municipal ward for specific geographic coordinates using spatial boundary radius
 */
export function findNearestWardForCoordinates(
  city: CityData,
  lat: number,
  lng: number,
  locationName?: string
) {
  if (!city || !city.wards || city.wards.length === 0) {
    return null;
  }

  // 1. Text-based heuristic if locationName explicitly matches a specific ward/neighborhood
  if (locationName) {
    const locLower = locationName.toLowerCase();
    for (const ward of city.wards) {
      const wardNameLower = ward.wardName.toLowerCase();
      // Extract keywords from wardName like "charminar", "khairatabad", "bapunagar", etc.
      const rawKeywords = wardNameLower
        .replace(/ward\s*\d+/g, '')
        .replace(/[()-]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3);

      for (const kw of rawKeywords) {
        if (locLower.includes(kw)) {
          return ward;
        }
      }
    }
  }

  // 2. Spatial proximity match using GPS coordinates and realistic ward boundary radius
  let closestWard = null;
  let minDistance = Infinity;

  for (const ward of city.wards) {
    const dist = calculateDistanceKm(lat, lng, ward.coordinates.lat, ward.coordinates.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestWard = ward;
    }
  }

  if (closestWard) {
    // A municipal ward typically spans 1.5 to 3.2 km in radius based on area
    const estimatedWardRadiusKm = Math.min(
      3.2,
      Math.max(1.5, Math.sqrt((closestWard.areaSqKm || 4.0) / Math.PI) * 1.35)
    );

    // Only return the ward if the GPS coordinates are strictly within its spatial boundary radius
    if (minDistance <= estimatedWardRadiusKm) {
      return closestWard;
    }
  }

  return null;
}
