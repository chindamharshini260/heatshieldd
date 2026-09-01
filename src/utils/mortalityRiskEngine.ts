/**
 * HeatShield AI - Health Impact & Estimated Mortality Risk Engine
 * Computes defensible, multi-factor health impact and heat-related health risk
 * from atmospheric variables (UTCI, WBGT, Heat Index), nocturnal non-recovery,
 * cumulative heat persistence, and local population vulnerability metrics.
 */

import { CompleteWeatherData, DailyForecastItem } from '../types/weather';
import { CityData } from '../types';
import { DetailedWardRiskProfile } from './wardRiskEngine';
import { computeUTCI, computeWBGT, computeHeatIndex } from './heatHealthEngine';

export interface DailyMortalityRiskItem {
  dayIndex: number;
  dayName: string;
  date: string;
  maxTemp: number;
  minTemp: number;
  utci: number;
  wbgt: number;
  heatIndex: number;
  thermalStressCategory: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  vulnerabilityLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  mortalityRiskScore: number; // 0 - 100
  riskCategory: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  expectedHealthImpact: string;
  vulnerabilityFactors: string[];
  color: string;
  badgeBg: string;
  badgeBorder: string;
}

export function calculate5DayHealthImpactForecast(
  weatherData: CompleteWeatherData | null,
  activeCity?: CityData,
  topRiskWard?: DetailedWardRiskProfile | null
): DailyMortalityRiskItem[] {
  if (!weatherData || !weatherData.daily || weatherData.daily.length === 0) {
    return [];
  }

  const dailyItems = weatherData.daily.slice(0, 5);
  const currentTemp = weatherData.current?.temperature || 38;
  const currentRh = weatherData.current?.relativeHumidity || 45;
  const currentWind = weatherData.current?.windSpeed || 8;
  const currentSolar = typeof weatherData.current?.solarRadiation === 'number'
    ? weatherData.current.solarRadiation
    : 650;

  // Derive demographic vulnerability factor
  let baseVulnScore = 15;
  let vulnLevel: 'Low' | 'Moderate' | 'High' | 'Very High' = 'Moderate';
  const vulnFactors: string[] = [];

  if (topRiskWard) {
    const ward = topRiskWard.ward;
    if (ward.elderlyRatio > 0.11) {
      baseVulnScore += 5;
      vulnFactors.push(`Elderly demographic (${Math.round(ward.elderlyRatio * 100)}% 60+)`);
    }
    if (ward.outdoorWorkerRatio > 0.20) {
      baseVulnScore += 6;
      vulnFactors.push(`Outdoor workforce (${Math.round(ward.outdoorWorkerRatio * 100)}% unshaded labor)`);
    }
    if (ward.populationDensity > 22000) {
      baseVulnScore += 4;
      vulnFactors.push(`High density (${ward.populationDensity.toLocaleString()}/km²)`);
    }
    if (ward.imperviousBuiltupRatio > 0.8) {
      baseVulnScore += 3;
      vulnFactors.push(`Urban Heat Island effect (+${topRiskWard.currentConditions?.uhiOffset || 2.4}°C)`);
    }
  } else if (activeCity) {
    baseVulnScore += 10;
    vulnFactors.push('Urban density & industrial heat exposure');
    vulnFactors.push('Elevated outdoor labor & transit exposure');
  } else {
    vulnFactors.push('Standard regional population baseline');
  }

  if (baseVulnScore >= 28) vulnLevel = 'Very High';
  else if (baseVulnScore >= 20) vulnLevel = 'High';
  else if (baseVulnScore >= 12) vulnLevel = 'Moderate';
  else vulnLevel = 'Low';

  let consecutiveHotDays = 0;

  return dailyItems.map((day: DailyForecastItem, idx: number) => {
    const maxT = day.temperatureMax;
    const minT = day.temperatureMin;
    const isToday = idx === 0;

    // Use daily weather code to estimate humidity and solar radiation
    const estRh = Math.max(25, Math.min(75, Math.round(currentRh + (idx > 0 ? (day.weatherCode > 0 ? 12 : -4) : 0))));
    const estWind = Math.max(5, Math.round(currentWind + (idx % 2 === 0 ? 1.5 : -1.0)));
    const estSolar = day.weatherCode === 0 ? 780 : day.weatherCode <= 2 ? 580 : 350;

    const utci = computeUTCI(maxT, estRh, estWind, estSolar);
    const wbgt = computeWBGT(maxT, estRh, estWind, estSolar);
    const heatIndex = computeHeatIndex(maxT, estRh);

    // Track cumulative heat persistence
    if (maxT >= 37.5 || utci >= 37.0) {
      consecutiveHotDays += 1;
    } else {
      consecutiveHotDays = Math.max(0, consecutiveHotDays - 1);
    }

    // 1. Determine Thermal Stress Category
    let thermalStressCategory: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme' = 'Low';
    if (utci >= 46 || maxT >= 44.5 || wbgt >= 32.5) {
      thermalStressCategory = 'Extreme';
    } else if (utci >= 38 || maxT >= 41.0 || wbgt >= 29.5) {
      thermalStressCategory = 'Very High';
    } else if (utci >= 32 || maxT >= 36.5 || wbgt >= 27.0) {
      thermalStressCategory = 'High';
    } else if (utci >= 26 || maxT >= 31.0 || wbgt >= 24.0) {
      thermalStressCategory = 'Moderate';
    } else {
      thermalStressCategory = 'Low';
    }

    // 2. Base Thermal Strain Score (0 - 55 pts)
    let thermalStrainScore = 0;
    if (utci >= 46) {
      thermalStrainScore = 48 + Math.min(7, (utci - 46) * 1.5);
    } else if (utci >= 38) {
      thermalStrainScore = 34 + ((utci - 38) / 8) * 14;
    } else if (utci >= 32) {
      thermalStrainScore = 20 + ((utci - 32) / 6) * 14;
    } else if (utci >= 26) {
      thermalStrainScore = 8 + ((utci - 26) / 6) * 12;
    } else {
      thermalStrainScore = Math.max(2, (utci / 26) * 8);
    }

    // 3. Nighttime Recovery Penalty (0 - 15 pts)
    let nightPenalty = 0;
    if (minT >= 28.5) nightPenalty = 14;
    else if (minT >= 26.0) nightPenalty = 9;
    else if (minT >= 23.5) nightPenalty = 4;

    // 4. Cumulative Heat Persistence Penalty (0 - 15 pts)
    const persistencePenalty = Math.min(15, consecutiveHotDays * 3.5);

    // 5. Aggregate Mortality Risk Score (0 - 100)
    // Derived from: Thermal Strain (50%) + Vulnerability (25%) + Night Strain & Persistence (25%)
    const rawTotal =
      thermalStrainScore * 0.95 +
      (baseVulnScore * 0.7) +
      nightPenalty * 0.75 +
      persistencePenalty * 0.6;

    const mortalityRiskScore = Math.max(5, Math.min(98, Math.round(rawTotal)));

    // 6. Category mapping
    let riskCategory: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme' = 'Low';
    let color = '#16A34A';
    let badgeBg = '#F0FDF4';
    let badgeBorder = '#BBF7D0';

    if (mortalityRiskScore >= 80) {
      riskCategory = 'Extreme';
      color = '#B91C1C';
      badgeBg = '#FEF2F2';
      badgeBorder = '#FECACA';
    } else if (mortalityRiskScore >= 60) {
      riskCategory = 'Very High';
      color = '#DC2626';
      badgeBg = '#FEF2F2';
      badgeBorder = '#FECACA';
    } else if (mortalityRiskScore >= 40) {
      riskCategory = 'High';
      color = '#EA580C';
      badgeBg = '#FFF7ED';
      badgeBorder = '#FED7AA';
    } else if (mortalityRiskScore >= 20) {
      riskCategory = 'Moderate';
      color = '#D97706';
      badgeBg = '#FFFBEB';
      badgeBorder = '#FDE68A';
    } else {
      riskCategory = 'Low';
      color = '#16A34A';
      badgeBg = '#F0FDF4';
      badgeBorder = '#BBF7D0';
    }

    // 7. Contextual Clinical & Health Impact
    let expectedHealthImpact = '';
    if (riskCategory === 'Extreme') {
      expectedHealthImpact =
        'Critical heat emergency: surge in severe heat stroke, acute kidney injury, cardiovascular collapse, and sharp spike in excess emergency hospitalizations.';
    } else if (riskCategory === 'Very High') {
      expectedHealthImpact =
        'Severe physiological strain: elevated heat exhaustion among outdoor workers, acute dehydration, and high risk of cardiovascular exacerbation in elderly residents.';
    } else if (riskCategory === 'High') {
      expectedHealthImpact =
        'Moderate-to-high health impact: noticeable spike in clinic admissions for heat cramps, dizziness, syncope, and respiratory distress in vulnerable groups.';
    } else if (riskCategory === 'Moderate') {
      expectedHealthImpact =
        'Mild-to-moderate strain: fatigue, mild dehydration, and reduced physical work capacity during peak unshaded sun hours.';
    } else {
      expectedHealthImpact =
        'Low physiological risk: baseline hydration and standard sun protection sufficient for normal daily activities.';
    }

    return {
      dayIndex: idx,
      dayName: isToday ? 'Today' : day.dayName,
      date: day.date,
      maxTemp: Math.round(maxT),
      minTemp: Math.round(minT),
      utci: Math.round(utci),
      wbgt: Math.round(wbgt * 10) / 10,
      heatIndex: Math.round(heatIndex),
      thermalStressCategory,
      vulnerabilityLevel: vulnLevel,
      mortalityRiskScore,
      riskCategory,
      expectedHealthImpact,
      vulnerabilityFactors: vulnFactors,
      color,
      badgeBg,
      badgeBorder,
    };
  });
}
