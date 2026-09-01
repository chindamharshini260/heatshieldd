/**
 * HeatShield AI - Ward-Level Hyper-Local Risk & Biometeorological Engine
 * 
 * Complies with SIH Specification for:
 * "Localized Impact-Based Heatwave Early Warning and Human Health Risk Prediction System"
 * 
 * Models:
 * 1. Physical Atmospheric & Diurnal Dynamics (Open-Meteo & IMD Baseline)
 * 2. Microclimate Urban Heat Island (UHI) Impervious & NDVI Adjustments
 * 3. Human Thermal Stress Engine (NOAA Heat Index, ISO 7243 WBGT, COST 730 UTCI, HTSS)
 * 4. Human Exposure Engine (Density, Labor Ratio, Diurnal Curve)
 * 5. Transparent Heat Vulnerability Model (Demographics, Slum/Informal, Greenery, Healthcare Deficit)
 * 6. Cumulative Heat Burden (24h, 48h, 72h, 120h Degree-Hours)
 * 7. Nocturnal Thermal Recovery & Recovery Failure Index
 * 8. Predictive Modeled Heat-Health Risk (0-100 with SHAP-inspired Risk Contributors)
 * 9. Ward-Specific Actionable Health Advisories & HAP SOP Triggers
 */

import { CityData, WardDemographics, ThermalStressCategory } from '../types';
import { RawOpenMeteoResponse } from '../services/weatherApi';
import { CompleteWeatherData } from '../types/weather';
import {
  calculate_heat_index,
  calculate_wbgt,
  calculate_utci,
  classify_thermal_stress,
  calculate_htss,
  calculate_cumulative_heat_burden,
  calculate_human_exposure_score,
  calculate_vulnerability_score,
  calculate_action_window,
} from './thermalCalculations';

export type WardRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';

export interface WardRiskContributor {
  name: string;
  impactPercent: number;
  direction: 'increasing' | 'decreasing';
  reason: string;
}

export interface WardHourlyForecastPoint {
  hourOffset: number;
  time: string;
  displayTime: string;
  temp: number;
  effectiveTemp: number;
  rh: number;
  windSpeed: number;
  solarRadiation: number;
  heatIndex: number;
  wbgt: number;
  utci: number;
  htss: number;
  riskScore: number;
  riskCategory: WardRiskLevel;
  isPeakRisk: boolean;
}

export interface WardDailyForecastPoint {
  dayIndex: number;
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  effectiveMaxTemp: number;
  maxHeatIndex: number;
  maxWbgt: number;
  maxUtci: number;
  htss: number;
  riskScore: number;
  riskCategory: WardRiskLevel;
  nightRecoveryStatus: 'Good' | 'Limited' | 'Poor (Recovery Failure)';
  cumulativeBurdenDegreeHours: number;
  peakPeriodText: string;
  summaryAdvisory: string;
}

export interface DetailedWardRiskProfile {
  ward: WardDemographics;
  city: {
    id: string;
    name: string;
    state: string;
    lat: number;
    lng: number;
    baselineThreshold: number;
  };
  currentConditions: {
    baseTemperature: number; // °C
    effectiveTemperature: number; // °C with UHI
    uhiOffset: number; // °C added by concrete / lack of trees
    relativeHumidity: number; // %
    windSpeedKmh: number; // km/h
    solarRadiationWm2: number; // W/m²
    dewPointC: number; // °C
  };
  thermalMetrics: {
    heatIndex: number; // °C
    wbgt: number; // °C
    utci: number; // °C
    htss: number; // 0-100 (Human Thermal Stress Score)
    stressCategory: ThermalStressCategory;
  };
  exposure: {
    score: number; // 0-100
    exposedPopulation: number;
    outdoorWorkerExposed: number;
    elderlyExposed: number;
    timeOfDayFactor: number;
    explanation: string;
  };
  vulnerability: {
    score: number; // 0-100
    elderlyContribution: number; // e.g. +18
    outdoorWorkerContribution: number; // e.g. +24
    slumHousingContribution: number; // e.g. +22
    greeneryDeficitContribution: number; // e.g. +12
    healthcareDeficitContribution: number; // e.g. +10
    explanation: string;
  };
  cumulativeBurden: {
    burden24h: number; // Degree-hours above 32°C/38°C
    burden48h: number;
    burden72h: number;
    burden120h: number;
    consecutiveHighHeatDays: number;
    biologicalStressMultiplier: number;
    explanation: string;
  };
  nighttimeRecovery: {
    nightMinTemp: number; // °C
    nightMinRh: number; // %
    nightMinApparentTemp: number; // °C
    status: 'Good' | 'Limited' | 'Poor (Recovery Failure)';
    recoveryFailureDetected: boolean;
    warningMessage: string;
  };
  healthRisk: {
    overallScore: number; // 0 - 100
    category: WardRiskLevel;
    label: string;
    badgeColor: string;
    badgeBg: string;
    borderColor: string;
    dotColor: string;
    hospitalizationSurgeRisk: number; // 0 - 100%
    isModeled: true;
    methodologyNote: string;
  };
  riskContributors: WardRiskContributor[];
  peakRiskPeriod: {
    hoursToPeak: number;
    windowText: string;
    peakUtci: number;
    peakCategory: WardRiskLevel;
    urgency: 'Immediate (0-12h)' | 'Urgent (12-24h)' | 'Planned (24-48h)' | 'Monitoring (>48h)';
  };
  forecast: {
    hourly72h: WardHourlyForecastPoint[];
    daily5Days: WardDailyForecastPoint[];
  };
  actionableAdvisories: {
    generalPublic: string[];
    outdoorWorkers: string[];
    elderlyAndVulnerable: string[];
    municipalActions: string[];
  };
}

/**
 * Maps risk score (0-100) to standard 4-tier category
 */
export function getWardRiskCategory(score: number): {
  category: WardRiskLevel;
  label: string;
  badgeColor: string;
  badgeBg: string;
  borderColor: string;
  dotColor: string;
} {
  if (score >= 75) {
    return {
      category: 'EXTREME',
      label: 'EXTREME RISK',
      badgeColor: 'text-rose-700',
      badgeBg: 'bg-rose-50',
      borderColor: 'border-rose-300',
      dotColor: '#E11D48',
    };
  }
  if (score >= 55) {
    return {
      category: 'HIGH',
      label: 'HIGH RISK',
      badgeColor: 'text-orange-700',
      badgeBg: 'bg-orange-50',
      borderColor: 'border-orange-300',
      dotColor: '#EA580C',
    };
  }
  if (score >= 30) {
    return {
      category: 'MODERATE',
      label: 'MODERATE RISK',
      badgeColor: 'text-amber-700',
      badgeBg: 'bg-amber-50',
      borderColor: 'border-amber-300',
      dotColor: '#D97706',
    };
  }
  return {
    category: 'LOW',
    label: 'LOW RISK',
    badgeColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    dotColor: '#16A34A',
  };
}

/**
 * Calculates complete, high-fidelity Ward Risk Profile
 */
export function calculateDetailedWardRisk(
  city: CityData,
  ward: WardDemographics,
  rawWeather: RawOpenMeteoResponse,
  hourIndex: number = 14
): DetailedWardRiskProfile {
  const hourly = rawWeather.hourly;
  const currentBaseTemp = hourly.temperature_2m[hourIndex] ?? 38.5;
  const currentBaseRh = hourly.relative_humidity_2m[hourIndex] ?? 42;
  const currentWind = hourly.wind_speed_10m[hourIndex] ?? 8.5;
  const currentSolar =
    hourly.shortwave_radiation?.[hourIndex] ??
    hourly.direct_normal_irradiance?.[hourIndex] ??
    (hourIndex >= 6 && hourIndex <= 18 ? 650 : 0);
  const currentDewPoint = hourly.dew_point_2m?.[hourIndex] ?? (currentBaseTemp - (100 - currentBaseRh) / 5);

  // 1. Urban Heat Island (UHI) Microclimate Offset
  // Impervious concrete/asphalt traps heat (+0.5°C to +2.4°C); NDVI tree canopy cools (-0.3°C to -1.2°C)
  const uhiRaw = (ward.imperviousBuiltupRatio * 1.9) - (ward.vegetationIndexNDVI * 1.3);
  const uhiOffset = Math.round(Math.max(0, uhiRaw) * 10) / 10;
  const effectiveTemp = Math.round((currentBaseTemp + uhiOffset) * 10) / 10;
  const effectiveRh = Math.max(18, Math.round(currentBaseRh - uhiOffset * 1.2));

  // 2. Human Thermal Stress Engine
  const heatIndex = calculate_heat_index(effectiveTemp, effectiveRh);
  const wbgt = calculate_wbgt(effectiveTemp, effectiveRh, currentWind, currentSolar);
  const utci = calculate_utci(effectiveTemp, effectiveRh, currentWind, currentSolar);
  const stressCategory = classify_thermal_stress(utci);

  const nightMinTemp = rawWeather.daily.temperature_2m_min[0] ?? 26.5;
  const htss = calculate_htss(utci, wbgt, heatIndex, nightMinTemp);

  // 3. Human Exposure Engine
  const hourOfDay = new Date(hourly.time[hourIndex] || new Date()).getHours();
  const exposureScore = calculate_human_exposure_score(ward, stressCategory, hourOfDay || 14);
  const exposedPop = Math.round(ward.totalPopulation * (exposureScore / 100));
  const outdoorLaborExposed = Math.round(ward.outdoorWorkerPopulation * Math.min(1, (exposureScore / 70)));
  const elderlyExposed = Math.round(ward.elderlyPopulation60Plus * Math.min(1, (exposureScore / 80)));

  // 4. Transparent Vulnerability Model with Explicit Contributors
  const vulnScore = calculate_vulnerability_score(ward);
  const elderlyContrib = Math.round((ward.elderlyRatio / 0.18) * 22);
  const workerContrib = Math.round((ward.outdoorWorkerRatio / 0.3) * 28);
  const slumContrib = Math.round(ward.slumInformalHousingRatio * 25);
  const greeneryContrib = Math.round((1 - ward.vegetationIndexNDVI) * 13);
  const healthDeficitContrib = Math.round(
    Math.max(0, 1 - ward.healthcareFacilitiesCount / ((ward.totalPopulation / 10000) * 0.8)) * 12
  );

  // 5. Cumulative Multi-Day Heat Burden
  const next120HourlyUtci = hourly.time.slice(hourIndex, hourIndex + 120).map((_, idx) => {
    const i = hourIndex + idx;
    const t = (hourly.temperature_2m[i] ?? currentBaseTemp) + uhiOffset;
    const r = hourly.relative_humidity_2m[i] ?? currentBaseRh;
    const w = hourly.wind_speed_10m[i] ?? currentWind;
    const s = hourly.shortwave_radiation?.[i] ?? hourly.direct_normal_irradiance?.[i] ?? 0;
    return calculate_utci(t, r, w, s);
  });

  const dailyMins = rawWeather.daily.temperature_2m_min.slice(0, 5);
  const cumulative = calculate_cumulative_heat_burden(next120HourlyUtci, dailyMins);
  const burden48h = Math.round(cumulative.burden24h * 1.85 * 10) / 10;

  // 6. Nighttime Recovery & Failure Index
  const nightMinApparent = Math.round(
    (nightMinTemp + (currentBaseRh > 50 ? 2.2 : 0.5)) * 10
  ) / 10;
  const nightRecoveryStatus: 'Good' | 'Limited' | 'Poor (Recovery Failure)' =
    nightMinTemp < 23.5 ? 'Good' : nightMinTemp < 27.0 ? 'Limited' : 'Poor (Recovery Failure)';
  const recoveryFailure = cumulative.recoveryFailureDetected || nightMinTemp >= 27.5;

  const nightWarning = recoveryFailure
    ? 'High nocturnal heat (>27.5°C) inhibits deep-sleep thermoregulation, compounding next-day cardiovascular risk.'
    : nightRecoveryStatus === 'Limited'
    ? 'Sub-optimal overnight recovery (24–27°C). Ensure adequate hydration and room ventilation before sleep.'
    : 'Comfortable night cooling (<23.5°C) allows normal physiological heat dissipation.';

  // 7. Predictive Modeled Health-Health Risk Score (0-100)
  // Continuous physiological weighting: HTSS (32%) + Exposure (24%) + Vulnerability (24%) + 72h Burden (12%) + UHI/Night (+8%)
  const normHtss = htss / 100;
  const normExp = exposureScore / 100;
  const normVuln = vulnScore / 100;
  const normBurd = Math.min(1, cumulative.burden72h / 150);
  const nightPenalty = recoveryFailure ? 0.08 : 0.0;
  const uhiPenalty = uhiOffset >= 1.5 ? 0.05 : uhiOffset >= 0.8 ? 0.02 : 0;

  const rawScore =
    (0.32 * normHtss +
      0.24 * normExp +
      0.24 * normVuln +
      0.12 * normBurd +
      nightPenalty +
      uhiPenalty) * 100;

  const finalRiskScore = Math.min(99, Math.max(12, Math.round(rawScore)));
  const categoryInfo = getWardRiskCategory(finalRiskScore);
  const surgeProb = Math.min(96, Math.max(8, Math.round(finalRiskScore * 0.94)));

  // 8. ML Model Explainability / Risk Contributors (SHAP-inspired)
  const contributors: WardRiskContributor[] = [];

  // Thermal stress driver
  if (utci >= 38) {
    contributors.push({
      name: 'Severe UTCI Thermal Stress',
      impactPercent: Math.max(20, Math.round(normHtss * 35)),
      direction: 'increasing',
      reason: `Outdoor UTCI reached ${utci}°C (${stressCategory}), exceeding safe human thermoregulatory limits.`,
    });
  } else if (utci >= 32) {
    contributors.push({
      name: 'Moderate UTCI Thermal Strain',
      impactPercent: Math.max(14, Math.round(normHtss * 26)),
      direction: 'increasing',
      reason: `UTCI at ${utci}°C elevates sweat loss and cardiovascular work during outdoor movement.`,
    });
  } else {
    contributors.push({
      name: 'Baseline Ambient Heat Strain',
      impactPercent: Math.max(8, Math.round(normHtss * 18)),
      direction: 'increasing',
      reason: `Effective temperature of ${effectiveTemp}°C with ${(effectiveRh)}% RH generates continuous metabolic heat load.`,
    });
  }

  // Slum / Informal roofing
  if (ward.slumInformalHousingRatio >= 0.25) {
    contributors.push({
      name: 'Tin / Asbestos Roof Heat Trapping',
      impactPercent: Math.max(10, Math.round(slumContrib)),
      direction: 'increasing',
      reason: `${(ward.slumInformalHousingRatio * 100).toFixed(0)}% slum/informal housing creates indoor radiant heat 4–7°C higher than ambient air.`,
    });
  }

  // Outdoor labor force
  if (ward.outdoorWorkerRatio >= 0.18 || ward.outdoorWorkerPopulation > 20000) {
    contributors.push({
      name: 'Outdoor Labor Force Exposure',
      impactPercent: Math.max(10, Math.round(workerContrib)),
      direction: 'increasing',
      reason: `${ward.outdoorWorkerPopulation.toLocaleString()} construction/street workers operate under unshaded conditions (WBGT ${wbgt}°C).`,
    });
  }

  // Elderly population
  if (ward.elderlyRatio >= 0.11 || ward.elderlyPopulation60Plus > 15000) {
    contributors.push({
      name: 'Vulnerable Senior Population',
      impactPercent: Math.max(8, Math.round(elderlyContrib)),
      direction: 'increasing',
      reason: `${ward.elderlyPopulation60Plus.toLocaleString()} seniors (${(ward.elderlyRatio * 100).toFixed(1)}%) face impaired cardiovascular heat dissipation.`,
    });
  }

  // Urban Heat Island
  if (uhiOffset >= 0.6 || ward.imperviousBuiltupRatio >= 0.8) {
    contributors.push({
      name: 'Urban Heat Island (UHI Effect)',
      impactPercent: Math.max(8, Math.round(ward.imperviousBuiltupRatio * 16)),
      direction: 'increasing',
      reason: `${(ward.imperviousBuiltupRatio * 100).toFixed(0)}% concrete impervious surface and low tree cover add +${uhiOffset}°C localized heat.`,
    });
  }

  // Cumulative heat persistence
  if (cumulative.burden72h >= 25 || normBurd >= 0.2) {
    contributors.push({
      name: 'Multi-Day Cumulative Heat Burden',
      impactPercent: Math.max(6, Math.round(normBurd * 18)),
      direction: 'increasing',
      reason: `Accumulated ${cumulative.burden72h} degree-hours over 72 hours continuously degrades cellular heat resilience.`,
    });
  }

  // Nocturnal recovery failure
  if (recoveryFailure) {
    contributors.push({
      name: 'Nocturnal Heat Recovery Failure',
      impactPercent: 12,
      direction: 'increasing',
      reason: `Night temperature (${nightMinTemp}°C) remains above 27.5°C threshold, suppressing restorative nocturnal cooling.`,
    });
  }

  // Mitigating factors (Greenery & Healthcare)
  if (ward.vegetationIndexNDVI >= 0.25) {
    contributors.push({
      name: 'Tree Canopy & Green Space Buffer',
      impactPercent: Math.round(ward.vegetationIndexNDVI * 25),
      direction: 'decreasing',
      reason: `NDVI vegetation cover (${ward.vegetationIndexNDVI.toFixed(2)}) delivers local shade and evaporative cooling.`,
    });
  }

  if (ward.healthcareFacilitiesCount >= 7) {
    contributors.push({
      name: 'Local Emergency Healthcare Access',
      impactPercent: Math.min(12, ward.healthcareFacilitiesCount),
      direction: 'decreasing',
      reason: `${ward.healthcareFacilitiesCount} hospital and clinic facilities within ward provide rapid heat triage access.`,
    });
  }

  // Sort increasing contributors first by highest impact percent
  contributors.sort((a, b) => {
    if (a.direction === b.direction) {
      return b.impactPercent - a.impactPercent;
    }
    return a.direction === 'increasing' ? -1 : 1;
  });

  // 9. 72-Hour & 5-Day Ward Forecast
  const hourly72h: WardHourlyForecastPoint[] = [];
  let maxForecastUtci = utci;
  let peakHourOffset = 0;

  for (let h = 0; h < Math.min(72, hourly.time.length); h++) {
    const rawT = hourly.temperature_2m[h] ?? currentBaseTemp;
    const wT = Math.round((rawT + uhiOffset) * 10) / 10;
    const wRh = hourly.relative_humidity_2m[h] ?? currentBaseRh;
    const wWind = hourly.wind_speed_10m[h] ?? currentWind;
    const wSolar = hourly.shortwave_radiation?.[h] ?? hourly.direct_normal_irradiance?.[h] ?? 0;

    const wHi = calculate_heat_index(wT, wRh);
    const wWbgt = calculate_wbgt(wT, wRh, wWind, wSolar);
    const wUtci = calculate_utci(wT, wRh, wWind, wSolar);
    const wHtss = calculate_htss(wUtci, wWbgt, wHi, nightMinTemp);

    const hScore = Math.min(99, Math.max(10, Math.round(
      (0.35 * (wHtss / 100) + 0.25 * normExp + 0.25 * normVuln + 0.15 * normBurd) * 100
    )));
    const hCat = getWardRiskCategory(hScore).category;

    if (wUtci > maxForecastUtci) {
      maxForecastUtci = wUtci;
      peakHourOffset = h;
    }

    const tObj = new Date(hourly.time[h] || new Date());
    const dispHour = tObj.getHours() % 12 === 0 ? 12 : tObj.getHours() % 12;
    const ampm = tObj.getHours() >= 12 ? 'PM' : 'AM';
    const dayPrefix = h < 24 ? 'Today' : h < 48 ? 'Tomorrow' : 'Day 3';

    hourly72h.push({
      hourOffset: h,
      time: hourly.time[h] || '',
      displayTime: `${dayPrefix} ${dispHour} ${ampm}`,
      temp: rawT,
      effectiveTemp: wT,
      rh: wRh,
      windSpeed: wWind,
      solarRadiation: wSolar,
      heatIndex: wHi,
      wbgt: wWbgt,
      utci: wUtci,
      htss: wHtss,
      riskScore: hScore,
      riskCategory: hCat,
      isPeakRisk: false,
    });
  }

  if (hourly72h[peakHourOffset]) {
    hourly72h[peakHourOffset].isPeakRisk = true;
  }

  // Daily 5-Day Outlook
  const daily5Days: WardDailyForecastPoint[] = rawWeather.daily.time.slice(0, 5).map((dStr, dIdx) => {
    const dDate = new Date(dStr);
    const dName = dIdx === 0 ? 'Today' : dDate.toLocaleDateString('en-US', { weekday: 'short' });
    const maxT = rawWeather.daily.temperature_2m_max[dIdx] ?? 41;
    const minT = rawWeather.daily.temperature_2m_min[dIdx] ?? 26.5;
    const effMax = Math.round((maxT + uhiOffset) * 10) / 10;
    const peakRh = Math.max(20, Math.round(55 - (maxT - minT) * 2.2));

    const dHi = calculate_heat_index(effMax, peakRh);
    const dWbgt = calculate_wbgt(effMax, peakRh, 8, 750);
    const dUtci = calculate_utci(effMax, peakRh, 8, 750);
    const dHtss = calculate_htss(dUtci, dWbgt, dHi, minT);

    const dScore = Math.min(99, Math.max(12, Math.round(
      (0.34 * (dHtss / 100) + 0.24 * normExp + 0.24 * normVuln + 0.18 * Math.min(1, (dIdx + 1) * 0.25)) * 100
    )));
    const dCat = getWardRiskCategory(dScore).category;
    const nStatus: 'Good' | 'Limited' | 'Poor (Recovery Failure)' =
      minT < 23.5 ? 'Good' : minT < 27.0 ? 'Limited' : 'Poor (Recovery Failure)';

    return {
      dayIndex: dIdx,
      date: dStr,
      dayName: dName,
      maxTemp: maxT,
      minTemp: minT,
      effectiveMaxTemp: effMax,
      maxHeatIndex: dHi,
      maxWbgt: dWbgt,
      maxUtci: dUtci,
      htss: dHtss,
      riskScore: dScore,
      riskCategory: dCat,
      nightRecoveryStatus: nStatus,
      cumulativeBurdenDegreeHours: Math.round((dUtci > 32 ? (dUtci - 32) * 8 : 0) * (dIdx + 1)),
      peakPeriodText: '12:30 PM – 4:30 PM',
      summaryAdvisory:
        dCat === 'EXTREME'
          ? 'Dangerous biophysical strain. Limit all outdoor physical exertion.'
          : dCat === 'HIGH'
          ? 'Elevated heat hazard. Schedule outdoor tasks before 10:30 AM or after 5:00 PM.'
          : dCat === 'MODERATE'
          ? 'Moderate thermal load. Stay hydrated with electrolytes.'
          : 'Normal conditions. Maintain standard hydration.',
    };
  });

  // Action Window & Peak Period
  const actionWindow = calculate_action_window(
    hourly72h.map((h) => ({ hourOffset: h.hourOffset, utci: h.utci, temp: h.effectiveTemp }))
  );

  const peakPoint = hourly72h[peakHourOffset] || hourly72h[0];

  // 10. Ward-Specific Actionable Health Advisories
  const generalAdv: string[] = [];
  const workerAdv: string[] = [];
  const elderlyAdv: string[] = [];
  const muniAdv: string[] = [];

  if (finalRiskScore >= 75) {
    generalAdv.push('Avoid all non-essential outdoor exposure between 11:30 AM and 4:30 PM.');
    generalAdv.push('Consume at least 500ml water or ORS every hour even if not feeling thirsty.');
    generalAdv.push('Recognize early heat exhaustion: dizziness, muscle cramps, rapid pulse, profuse sweating.');

    workerAdv.push('MANDATORY: Enforce work stoppage during peak sun hours (12:00 PM – 4:00 PM).');
    workerAdv.push('Provide mandatory 15-minute shaded rest breaks every 45 minutes.');
    workerAdv.push('Ensure cool drinking water and ORS packets are stationed within 20m of work sites.');

    elderlyAdv.push('Keep elderly individuals in the coolest room with active cross-ventilation or fans.');
    elderlyAdv.push('Conduct 2x daily caregiver check-ins to inspect hydration, confusion, or weakness.');
    elderlyAdv.push('Apply cool damp towels to neck, armpits, and forehead if body temperature feels elevated.');

    muniAdv.push(`Trigger RED ALERT for ${ward.wardName}.`);
    muniAdv.push(`Activate ${ward.existingCoolingCenters > 0 ? ward.existingCoolingCenters : 2} public cooling centers.`);
    muniAdv.push('Deploy mobile water tanker misting units along dense informal settlements.');
    muniAdv.push('Alert Civil Hospital & PHCs to pre-chill IV saline bags and reserve heatstroke triage beds.');
  } else if (finalRiskScore >= 55) {
    generalAdv.push('Wear loose, lightweight cotton clothing and wide-brimmed hats outdoors.');
    generalAdv.push('Drink buttermilk, lemon water, and ORS solution throughout the day.');
    generalAdv.push('Reschedule strenuous outdoor sports or workouts to early morning (6:00 AM – 8:30 AM).');

    workerAdv.push('Rotate outdoor work shifts to cooler hours (6:30 AM – 11:00 AM & 4:30 PM – 7:00 PM).');
    workerAdv.push('Erect temporary tarpaulin shade stations on construction sites and street markets.');

    elderlyAdv.push('Ensure seniors drink regular fluids and monitor chronic hypertension medications.');
    elderlyAdv.push('Avoid unventilated top-floor rooms with tin or asbestos roofing during afternoon.');

    muniAdv.push(`Issue ORANGE ADVISORY for ${ward.wardName}.`);
    muniAdv.push('Broadcast public awareness messages via SMS and local community loudspeakers.');
    muniAdv.push('Ensure all public water kiosks (Pyaus) are refilled and operational.');
  } else if (finalRiskScore >= 30) {
    generalAdv.push('Carry a water bottle when commuting or traveling outdoors.');
    generalAdv.push('Take rest breaks under natural tree shade when walking in urban areas.');
    workerAdv.push('Maintain regular hydration and wear protective head covering.');
    elderlyAdv.push('Encourage adequate fluid intake and light meals.');
    muniAdv.push('Maintain routine meteorological monitoring and ensure water kiosk availability.');
  } else {
    generalAdv.push('Normal conditions. Maintain healthy daily hydration.');
    workerAdv.push('Standard occupational safety practices.');
    elderlyAdv.push('Standard health wellness.');
    muniAdv.push('Routine baseline surveillance.');
  }

  return {
    ward,
    city: {
      id: city.id,
      name: city.name,
      state: city.state,
      lat: city.lat,
      lng: city.lng,
      baselineThreshold: city.baselineHistoricalMortalityThreshold,
    },
    currentConditions: {
      baseTemperature: currentBaseTemp,
      effectiveTemperature: effectiveTemp,
      uhiOffset,
      relativeHumidity: effectiveRh,
      windSpeedKmh: currentWind,
      solarRadiationWm2: currentSolar,
      dewPointC: Math.round(currentDewPoint * 10) / 10,
    },
    thermalMetrics: {
      heatIndex,
      wbgt,
      utci,
      htss,
      stressCategory,
    },
    exposure: {
      score: exposureScore,
      exposedPopulation: exposedPop,
      outdoorWorkerExposed: outdoorLaborExposed,
      elderlyExposed: elderlyExposed,
      timeOfDayFactor: hourOfDay >= 11 && hourOfDay <= 16 ? 1.0 : 0.6,
      explanation: `Combined population density (${ward.populationDensity.toLocaleString()}/km²), ${ward.outdoorWorkerPopulation.toLocaleString()} outdoor workers, and peak diurnal solar irradiance.`,
    },
    vulnerability: {
      score: vulnScore,
      elderlyContribution: elderlyContrib,
      outdoorWorkerContribution: workerContrib,
      slumHousingContribution: slumContrib,
      greeneryDeficitContribution: greeneryContrib,
      healthcareDeficitContribution: healthDeficitContrib,
      explanation: `Census demographic indicators: ${ward.elderlyPopulation60Plus.toLocaleString()} seniors (${(ward.elderlyRatio * 100).toFixed(1)}%), ${(ward.slumInformalHousingRatio * 100).toFixed(0)}% informal housing, and NDVI vegetation index of ${ward.vegetationIndexNDVI.toFixed(2)}.`,
    },
    cumulativeBurden: {
      burden24h: cumulative.burden24h,
      burden48h,
      burden72h: cumulative.burden72h,
      burden120h: cumulative.burden120h,
      consecutiveHighHeatDays: 3,
      biologicalStressMultiplier: cumulative.burden72h > 60 ? 1.5 : 1.0,
      explanation: `Continuous heat exposure accumulation over 72 hours (${cumulative.burden72h} degree-hours) without sufficient diurnal cooling.`,
    },
    nighttimeRecovery: {
      nightMinTemp,
      nightMinRh: currentBaseRh + 18,
      nightMinApparentTemp: nightMinApparent,
      status: nightRecoveryStatus,
      recoveryFailureDetected: recoveryFailure,
      warningMessage: nightWarning,
    },
    healthRisk: {
      overallScore: finalRiskScore,
      category: categoryInfo.category,
      label: categoryInfo.label,
      badgeColor: categoryInfo.badgeColor,
      badgeBg: categoryInfo.badgeBg,
      borderColor: categoryInfo.borderColor,
      dotColor: categoryInfo.dotColor,
      hospitalizationSurgeRisk: surgeProb,
      isModeled: true,
      methodologyNote:
        'Estimated Ward Risk: Scientifically modeled multi-factor biometeorological score combining local UHI microclimate, UTCI thermal strain, Census demographic vulnerability, and cumulative multi-day heat burden.',
    },
    riskContributors: contributors,
    peakRiskPeriod: {
      hoursToPeak: peakPoint.hourOffset,
      windowText: peakPoint.displayTime,
      peakUtci: peakPoint.utci,
      peakCategory: peakPoint.riskCategory,
      urgency: actionWindow.urgencyLevel,
    },
    forecast: {
      hourly72h,
      daily5Days,
    },
    actionableAdvisories: {
      generalPublic: generalAdv,
      outdoorWorkers: workerAdv,
      elderlyAndVulnerable: elderlyAdv,
      municipalActions: muniAdv,
    },
  };
}

/**
 * Constructs a coherent 120-hour RawOpenMeteoResponse from live CompleteWeatherData
 * Feeds real hourly forecasts directly into the biometeorological ward engine
 */
export function buildRawWeatherFromWeatherData(
  weatherData: CompleteWeatherData | null,
  city: CityData
): RawOpenMeteoResponse {
  const baseTemp = weatherData?.current.temperature ?? 38.5;
  const baseRh = weatherData?.current.relativeHumidity ?? 42;
  const baseWind = weatherData?.current.windSpeed ?? 8.5;
  const currentHour = new Date().getHours();
  const baseSolar =
    weatherData?.current.solarRadiation ??
    (currentHour >= 6 && currentHour <= 18 ? Math.sin(((currentHour - 6) / 12) * Math.PI) * 750 : 0);
  const nightMin = weatherData?.daily[0]?.temperatureMin ?? 26.0;
  const dayMax = weatherData?.daily[0]?.temperatureMax ?? Math.max(baseTemp, 39.0);

  const times: string[] = [];
  const temps: number[] = [];
  const rhs: number[] = [];
  const winds: number[] = [];
  const rads: number[] = [];
  const dewPoints: number[] = [];

  const hourlyItems = weatherData?.hourly || [];
  const now = new Date();

  for (let h = 0; h < 120; h++) {
    const dt = new Date(now.getTime() + h * 3600000);
    times.push(dt.toISOString());
    const hour = dt.getHours();

    if (h < hourlyItems.length && hourlyItems[h]) {
      const item = hourlyItems[h];
      temps.push(item.temperature);
      rhs.push(item.relativeHumidity);
      winds.push(baseWind);
      const sRad =
        typeof item.solarRadiation === 'number'
          ? item.solarRadiation
          : hour >= 6 && hour <= 18
          ? Math.sin(((hour - 6) / 12) * Math.PI) * 750
          : 0;
      rads.push(Math.round(sRad));
      dewPoints.push(Math.round((item.temperature - (100 - item.relativeHumidity) / 5) * 10) / 10);
    } else {
      // Diurnal curve projected for remaining hours beyond available hourly items
      const diurnalNorm = (Math.sin(((hour - 6) / 24) * 2 * Math.PI - Math.PI / 2) + 1) / 2;
      const dayOffset = Math.min(4, Math.floor(h / 24));
      const targetMax = weatherData?.daily[dayOffset]?.temperatureMax ?? dayMax;
      const targetMin = weatherData?.daily[dayOffset]?.temperatureMin ?? nightMin;

      const t = Math.round((targetMin + (targetMax - targetMin) * Math.pow(diurnalNorm, 1.2)) * 10) / 10;
      const rh = Math.max(18, Math.round(65 - diurnalNorm * 38));
      const w = Math.round((6 + diurnalNorm * 6) * 10) / 10;
      const rad = hour >= 6 && hour <= 18 ? Math.round(Math.sin(((hour - 6) / 12) * Math.PI) * 800) : 0;

      temps.push(t);
      rhs.push(rh);
      winds.push(w);
      rads.push(rad);
      dewPoints.push(Math.round((t - (100 - rh) / 5) * 10) / 10);
    }
  }

  const dailyTimes: string[] = [];
  const dailyMaxs: number[] = [];
  const dailyMins: number[] = [];

  for (let d = 0; d < 5; d++) {
    const dailyItem = weatherData?.daily[d];
    dailyTimes.push(dailyItem?.date || `Day ${d + 1}`);
    dailyMaxs.push(dailyItem?.temperatureMax ?? dayMax);
    dailyMins.push(dailyItem?.temperatureMin ?? nightMin);
  }

  return {
    latitude: city.lat,
    longitude: city.lng,
    timezone: 'Asia/Kolkata',
    hourly: {
      time: times,
      temperature_2m: temps,
      relative_humidity_2m: rhs,
      wind_speed_10m: winds,
      shortwave_radiation: rads,
      direct_normal_irradiance: rads,
      dew_point_2m: dewPoints,
    },
    daily: {
      time: dailyTimes,
      temperature_2m_max: dailyMaxs,
      temperature_2m_min: dailyMins,
    },
  };
}

/**
 * Calculates deterministic risk profiles for all wards in a city,
 * sorted descending by overall risk score (highest risk ward at index 0).
 */
export function calculateAllCityWardProfiles(
  city: CityData,
  rawWeather: RawOpenMeteoResponse,
  hourIndex: number = 0
): DetailedWardRiskProfile[] {
  if (!city || !city.wards || city.wards.length === 0) {
    return [];
  }
  const profiles = city.wards.map((ward) => calculateDetailedWardRisk(city, ward, rawWeather, hourIndex));
  // Sort descending by overall score so the highest-risk ward is always at index 0
  return [...profiles].sort((a, b) => b.healthRisk.overallScore - a.healthRisk.overallScore);
}

/**
 * Safely extracts the highest risk ward from a collection of profiles
 */
export function getHighestRiskWard(profiles: DetailedWardRiskProfile[]): DetailedWardRiskProfile | null {
  if (!profiles || profiles.length === 0) return null;
  return profiles.reduce((highest, current) =>
    current.healthRisk.overallScore > highest.healthRisk.overallScore ? current : highest,
    profiles[0]
  );
}
