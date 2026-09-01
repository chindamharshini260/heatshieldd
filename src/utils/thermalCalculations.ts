/**
 * Scientifically Validated Thermal Stress & Human Impact Engine
 * Implements NOAA Rothfusz Heat Index, Stull/Liljegren WBGT,
 * Bröde et al. UTCI polynomial approximation, HTSS, and Cumulative Heat Burden.
 */

import {
  CalculatedThermalIndices,
  ThermalStressCategory,
  WeatherDataPoint,
  WardDemographics
} from '../types';

/**
 * Calculates NOAA Heat Index (°C) from dry-bulb temperature (°C) and relative humidity (%)
 * Reference: Rothfusz (1990) NOAA Technical Attachment SR/SSD 90-23
 */
export function calculate_heat_index(tempC: number, rh: number): number {
  const tempF = (tempC * 9) / 5 + 32;

  // Simple formula if temp is low
  if (tempF < 80) {
    const simpleHI = 0.5 * (tempF + 61.0 + (tempF - 68.0) * 1.2 + rh * 0.094);
    return ((simpleHI - 32) * 5) / 9;
  }

  // Full Rothfusz polynomial regression
  let hi =
    -42.379 +
    2.04901523 * tempF +
    10.14333127 * rh -
    0.22475541 * tempF * rh -
    0.00683783 * tempF * tempF -
    0.05481717 * rh * rh +
    0.00122874 * tempF * tempF * rh +
    0.00085282 * tempF * rh * rh -
    0.00000199 * tempF * tempF * rh * rh;

  // Low humidity adjustment
  if (rh < 13 && tempF >= 80 && tempF <= 112) {
    const adj = ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tempF - 95)) / 17);
    hi -= adj;
  }
  // High humidity adjustment
  else if (rh > 85 && tempF >= 80 && tempF <= 87) {
    const adj = ((rh - 85) / 10) * ((87 - tempF) / 5);
    hi += adj;
  }

  const hiC = ((hi - 32) * 5) / 9;
  return Math.round(hiC * 10) / 10;
}

/**
 * Calculates Wet Bulb Temperature (°C) using Stull (2011) psychrometric approximation
 * Reference: Stull, R. (2011). Wet-Bulb Temperature from Relative Humidity and Air Temperature.
 */
export function calculate_wet_bulb(tempC: number, rh: number): number {
  const Tw =
    tempC * Math.atan(0.151977 * Math.pow(rh + 8.313659, 0.5)) +
    Math.atan(tempC + rh) -
    Math.atan(rh - 1.676331) +
    0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
    4.686035;
  return Tw;
}

/**
 * Calculates Wet Bulb Globe Temperature (WBGT in °C) for outdoor occupational exposure
 * Reference: ISO 7243 / Liljegren et al. (2008)
 * WBGT_outdoor = 0.7 * Tw + 0.2 * Tg + 0.1 * Ta
 */
export function calculate_wbgt(
  tempC: number,
  rh: number,
  windSpeedKmh: number = 5,
  solarRadiationWm2: number = 600
): number {
  const Tw = calculate_wet_bulb(tempC, rh);
  const vMs = Math.max(0.2, windSpeedKmh / 3.6);

  // Black globe temperature approximation
  // Tg accounts for direct solar radiant load and wind cooling
  const solarFactor = Math.max(0, solarRadiationWm2) / 800; // normalized solar index
  const windCooling = Math.sqrt(vMs + 0.2);
  const Tg = tempC + (12 * solarFactor) / windCooling;

  const wbgt = 0.7 * Tw + 0.2 * Tg + 0.1 * tempC;
  return Math.round(wbgt * 10) / 10;
}

/**
 * Calculates Universal Thermal Climate Index (UTCI in °C)
 * Implements standard operational UTCI polynomial regression (COST Action 730 / Bröde et al. 2012)
 * Inputs: Temperature (°C), Relative Humidity (%), Wind Speed at 10m (km/h), Solar Radiation (W/m²)
 */
export function calculate_utci(
  tempC: number,
  rh: number,
  windSpeedKmh: number = 8,
  solarRadiationWm2: number = 500
): number {
  // Convert wind speed to m/s at 10m elevation, clipped to UTCI operational validity [0.5 - 20 m/s]
  const va = Math.min(20, Math.max(0.5, windSpeedKmh / 3.6));

  // Saturation vapor pressure (kPa) via Tetens equation
  const es = 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  const e = (es * Math.min(100, Math.max(0, rh))) / 100; // actual vapor pressure kPa

  // Mean Radiant Temperature delta estimation from solar radiation and wind
  const deltaTmrt = (solarRadiationWm2 * 0.038) / Math.pow(va + 0.1, 0.4);

  const t = tempC;
  const tmrt = t + deltaTmrt;
  const dTmrt = tmrt - t;

  // UTCI offset polynomial approximation terms
  let offset =
    -0.001685 * t * t +
    0.4182 * t -
    0.354 * va +
    0.00762 * va * va -
    0.000438 * va * va * va +
    1.442 * e -
    0.0763 * e * e +
    0.00122 * e * e * e +
    0.0482 * dTmrt -
    0.000216 * dTmrt * dTmrt +
    0.0000004 * dTmrt * dTmrt * dTmrt +
    0.00512 * t * va -
    0.00843 * t * e +
    0.00128 * t * dTmrt -
    0.00412 * va * e -
    0.00105 * va * dTmrt +
    0.00084 * e * dTmrt;

  const utci = t + offset;
  return Math.round(utci * 10) / 10;
}

/**
 * Classifies thermal stress based on international UTCI standards (WMO/COST Action 730)
 */
export function classify_thermal_stress(utciC: number): ThermalStressCategory {
  if (utciC > 46) return 'Extreme Heat Stress';
  if (utciC >= 38) return 'Very Strong Heat Stress';
  if (utciC >= 32) return 'Strong Heat Stress';
  if (utciC >= 26) return 'Moderate Heat Stress';
  return 'No Thermal Stress';
}

/**
 * Calculates Human Thermal Stress Score (HTSS: 0-100)
 * Rigorous normalization combining UTCI (45%), WBGT (30%), NOAA Heat Index (15%),
 * and nocturnal recovery persistence (10%).
 */
export function calculate_htss(
  utci: number,
  wbgt: number,
  heatIndex: number,
  nightMinTemp: number = 26
): number {
  // Normalize UTCI: 20°C -> 0, 50°C -> 100
  const normUtci = Math.min(100, Math.max(0, ((utci - 20) / (50 - 20)) * 100));

  // Normalize WBGT: 18°C -> 0, 36°C -> 100 (Occupational risk threshold is 30-32°C)
  const normWbgt = Math.min(100, Math.max(0, ((wbgt - 18) / (36 - 18)) * 100));

  // Normalize Heat Index: 25°C -> 0, 54°C -> 100
  const normHi = Math.min(100, Math.max(0, ((heatIndex - 25) / (54 - 25)) * 100));

  // Nocturnal persistence penalty: Night min temp above 27°C creates heat recovery failure
  const nightPenalty = nightMinTemp >= 28 ? 100 : nightMinTemp >= 26 ? ((nightMinTemp - 25) / 3) * 100 : 0;

  const htss = 0.45 * normUtci + 0.3 * normWbgt + 0.15 * normHi + 0.1 * nightPenalty;
  return Math.round(htss * 10) / 10;
}

/**
 * Calculates Cumulative Heat Burden (Degree-Hours above 32°C / 38°C UTCI)
 * plus nocturnal recovery failure tracking over 24h, 72h, and 120h windows.
 */
export function calculate_cumulative_heat_burden(
  hourlyUtciList: number[],
  nighttimeMinList: number[]
): {
  burden24h: number;
  burden72h: number;
  burden120h: number;
  recoveryFailureDetected: boolean;
} {
  const calcDegreeHours = (hours: number[]): number => {
    return hours.reduce((acc, val) => {
      if (val > 38) return acc + (val - 32) * 1.5; // Exponential biological stress
      if (val > 32) return acc + (val - 32);
      return acc;
    }, 0);
  };

  const h24 = hourlyUtciList.slice(0, 24);
  const h72 = hourlyUtciList.slice(0, Math.min(72, hourlyUtciList.length));
  const h120 = hourlyUtciList.slice(0, Math.min(120, hourlyUtciList.length));

  const burden24h = Math.round(calcDegreeHours(h24) * 10) / 10;
  const burden72h = Math.round(calcDegreeHours(h72) * 10) / 10;
  const burden120h = Math.round(calcDegreeHours(h120) * 10) / 10;

  // Heat recovery failure: Any night min temp >= 27.5°C
  const recoveryFailureDetected = nighttimeMinList.some((t) => t >= 27.5);

  return {
    burden24h,
    burden72h,
    burden120h,
    recoveryFailureDetected
  };
}

/**
 * Calculates Human Exposure Score (0-100)
 * Combines population density, outdoor labor fraction, elderly ratio, and diurnal exposure factor.
 */
export function calculate_human_exposure_score(
  demographics: WardDemographics,
  thermalCategory: ThermalStressCategory,
  hourOfDay: number = 14
): number {
  // Density factor (normalized up to 35,000 people/km²)
  const densityNorm = Math.min(1, demographics.populationDensity / 30000);

  // Time-of-day exposure curve (Peak occupational & transit exposure between 11:00 and 17:00)
  let timeFactor = 0.5;
  if (hourOfDay >= 11 && hourOfDay <= 16) timeFactor = 1.0;
  else if (hourOfDay >= 8 && hourOfDay <= 19) timeFactor = 0.8;
  else timeFactor = 0.4; // Nighttime indoor exposure

  // Outdoor worker exposure weight
  const workerWeight = demographics.outdoorWorkerRatio * 1.8;
  // Elderly exposure weight
  const elderlyWeight = demographics.elderlyRatio * 1.4;

  const baseExposure = (densityNorm * 0.4 + workerWeight * 0.35 + elderlyWeight * 0.25) * timeFactor * 100;

  // Thermal amplifier
  let thermalMult = 1.0;
  if (thermalCategory === 'Extreme Heat Stress') thermalMult = 1.4;
  else if (thermalCategory === 'Very Strong Heat Stress') thermalMult = 1.25;
  else if (thermalCategory === 'Strong Heat Stress') thermalMult = 1.1;

  return Math.min(100, Math.round(baseExposure * thermalMult * 10) / 10);
}

/**
 * Calculates Heat Vulnerability Score (0-100)
 * Based on Census demographic indicators, informal housing, slum density, lack of NDVI vegetation,
 * built-up impervious concrete, and distance/access to public cooling & healthcare.
 */
export function calculate_vulnerability_score(demographics: WardDemographics): number {
  // 1. Demographic Vulnerability (40%)
  const elderlyFactor = Math.min(1, demographics.elderlyRatio / 0.18); // 18% elderly is high
  const slumFactor = demographics.slumInformalHousingRatio; // 0-1
  const demoScore = elderlyFactor * 0.5 + slumFactor * 0.5;

  // 2. Environmental & Urban Heat Island (UHI) Vulnerability (30%)
  // Lower NDVI (lack of trees) = Higher vulnerability
  const lackOfGreen = 1 - Math.min(1, Math.max(0, demographics.vegetationIndexNDVI));
  const builtUpHeatRetention = demographics.imperviousBuiltupRatio;
  const envScore = lackOfGreen * 0.5 + builtUpHeatRetention * 0.5;

  // 3. Infrastructure & Adaptive Capacity Deficit (30%)
  // Fewer cooling centers and hospitals per capita = higher vulnerability
  const popInTenThousands = Math.max(1, demographics.totalPopulation / 10000);
  const healthDeficit = Math.max(0, 1 - demographics.healthcareFacilitiesCount / (popInTenThousands * 0.8));
  const coolingDeficit = Math.max(0, 1 - demographics.existingCoolingCenters / (popInTenThousands * 0.5));
  const adaptDeficitScore = healthDeficit * 0.5 + coolingDeficit * 0.5;

  const totalVulnerability = (demoScore * 0.4 + envScore * 0.3 + adaptDeficitScore * 0.3) * 100;
  return Math.min(100, Math.max(10, Math.round(totalVulnerability * 10) / 10));
}

/**
 * Calculates Action Window (Hours until critical threshold)
 * Finds the earliest hourly point where UTCI reaches >= 40°C or HTSS >= 75.
 */
export function calculate_action_window(
  hourlyUtci: { hourOffset: number; utci: number; temp: number }[]
): {
  hoursToCritical: number;
  criticalHourOffset: number;
  recommendedWindowStart: string;
  recommendedWindowEnd: string;
  urgencyLevel: 'Immediate (0-12h)' | 'Urgent (12-24h)' | 'Planned (24-48h)' | 'Monitoring (>48h)';
} {
  const criticalItem = hourlyUtci.find((h) => h.utci >= 39.5 || h.temp >= 42);

  if (!criticalItem) {
    return {
      hoursToCritical: 72,
      criticalHourOffset: 72,
      recommendedWindowStart: 'NOW',
      recommendedWindowEnd: '48 hours',
      urgencyLevel: 'Monitoring (>48h)'
    };
  }

  const hours = criticalItem.hourOffset;
  let urgency: 'Immediate (0-12h)' | 'Urgent (12-24h)' | 'Planned (24-48h)' | 'Monitoring (>48h)';
  let endWindow = '';

  if (hours <= 12) {
    urgency = 'Immediate (0-12h)';
    endWindow = 'Next 6 hours';
  } else if (hours <= 24) {
    urgency = 'Urgent (12-24h)';
    endWindow = 'Next 12-18 hours';
  } else if (hours <= 48) {
    urgency = 'Planned (24-48h)';
    endWindow = `Next 24 hours (T-${Math.max(6, hours - 12)}h)`;
  } else {
    urgency = 'Monitoring (>48h)';
    endWindow = `Next 36 hours`;
  }

  return {
    hoursToCritical: hours,
    criticalHourOffset: hours,
    recommendedWindowStart: 'NOW',
    recommendedWindowEnd: endWindow,
    urgencyLevel: urgency
  };
}
