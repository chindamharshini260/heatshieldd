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
  dayLabel: string; // 'TODAY' | 'DAY 2' | 'DAY 3' | 'DAY 4' | 'DAY 5'
  date: string;
  maxTemp: number;
  minTemp: number;
  utci: number;
  wbgt: number;
  heatIndex: number;
  thermalStressCategory: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  vulnerabilityLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  healthRiskScore: number; // 0 - 100
  mortalityRiskScore: number; // 0 - 100 (synonym for consistent consumption)
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
  const currentRh = weatherData.current?.relativeHumidity ?? 45;
  const currentWind = weatherData.current?.windSpeed ?? 8;
  const hourlyData = weatherData.hourly || [];

  // 1. Calculate Demographic & Urban Vulnerability Baseline (0 - 15 pts scale)
  let rawVulnScore = 4; // modest default baseline
  const vulnFactors: string[] = [];

  if (topRiskWard && topRiskWard.ward) {
    const ward = topRiskWard.ward;
    if (ward.elderlyRatio > 0.12) {
      rawVulnScore += 4;
      vulnFactors.push(`Elderly demographic (${Math.round(ward.elderlyRatio * 100)}% 60+)`);
    } else if (ward.elderlyRatio > 0.08) {
      rawVulnScore += 2;
      vulnFactors.push(`Elderly cohort (${Math.round(ward.elderlyRatio * 100)}% 60+)`);
    }

    if (ward.outdoorWorkerRatio > 0.22) {
      rawVulnScore += 4;
      vulnFactors.push(`Outdoor workforce (${Math.round(ward.outdoorWorkerRatio * 100)}% unshaded labor)`);
    } else if (ward.outdoorWorkerRatio > 0.14) {
      rawVulnScore += 2;
      vulnFactors.push(`Outdoor labor exposure (${Math.round(ward.outdoorWorkerRatio * 100)}%)`);
    }

    if (ward.populationDensity > 25000) {
      rawVulnScore += 3;
      vulnFactors.push(`High density (${ward.populationDensity.toLocaleString()}/km²)`);
    }

    if (ward.imperviousBuiltupRatio > 0.75) {
      rawVulnScore += 2;
      vulnFactors.push(`Urban Heat Island effect (+${topRiskWard.currentConditions?.uhiOffset || 2.0}°C)`);
    }
  } else if (activeCity) {
    rawVulnScore += 3;
    vulnFactors.push('Urban density & typical regional population exposure');
  } else {
    vulnFactors.push('Standard regional population baseline');
  }

  // Determine vulnerability qualitative level
  let vulnLevel: 'Low' | 'Moderate' | 'High' | 'Very High' = 'Low';
  if (rawVulnScore >= 13) vulnLevel = 'Very High';
  else if (rawVulnScore >= 9) vulnLevel = 'High';
  else if (rawVulnScore >= 5) vulnLevel = 'Moderate';
  else vulnLevel = 'Low';

  let consecutiveHotDays = 0;

  return dailyItems.map((day: DailyForecastItem, idx: number) => {
    const maxT = day.temperatureMax;
    const minT = day.temperatureMin;
    const isToday = idx === 0;
    const dayLabel = isToday ? 'TODAY' : `DAY ${idx + 1}`;

    // Extract day-specific hourly points if present
    const dayHourly = hourlyData.filter(
      (h) => h.time && (h.time.startsWith(day.date) || h.time.includes(day.date))
    );

    let dayRh = currentRh;
    let dayWind = currentWind;
    let daySolar = 650;

    if (dayHourly.length > 0) {
      const dayTemps = dayHourly.map((h) => h.temperature);
      const maxHourIdx = dayTemps.indexOf(Math.max(...dayTemps));
      if (maxHourIdx >= 0 && dayHourly[maxHourIdx]) {
        dayRh = dayHourly[maxHourIdx].relativeHumidity ?? currentRh;
      }
      const solarReadings = dayHourly
        .map((h) => h.solarRadiation)
        .filter((s): s is number => typeof s === 'number' && !isNaN(s) && s > 0);
      if (solarReadings.length > 0) {
        daySolar = Math.max(...solarReadings);
      } else {
        daySolar = day.weatherCode === 0 ? 750 : day.weatherCode <= 2 ? 550 : 320;
      }
    } else {
      // Realistic variance derived from weather code
      if (day.weatherCode === 0) {
        dayRh = Math.max(25, currentRh - 4);
        daySolar = 750;
      } else if (day.weatherCode <= 2) {
        dayRh = currentRh;
        daySolar = 550;
      } else {
        dayRh = Math.min(85, currentRh + 12);
        daySolar = 320;
      }
      dayWind = Math.max(5, currentWind + (idx % 2 === 0 ? 1 : -1));
    }

    // 2. Exact Biometeorological Model Calculations
    const utci = computeUTCI(maxT, dayRh, dayWind, daySolar);
    const wbgt = computeWBGT(maxT, dayRh, dayWind, daySolar);
    const heatIndex = computeHeatIndex(maxT, dayRh);

    // 3. Thermal Stress Categorization (Standard physiological definitions)
    let thermalStressCategory: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme' = 'Low';
    if (utci >= 46 || maxT >= 44.0 || wbgt >= 32.5) {
      thermalStressCategory = 'Extreme';
    } else if (utci >= 38 || maxT >= 40.0 || wbgt >= 29.5) {
      thermalStressCategory = 'Very High';
    } else if (utci >= 32 || maxT >= 35.5 || wbgt >= 26.5) {
      thermalStressCategory = 'High';
    } else if (utci >= 26 || maxT >= 30.0 || wbgt >= 22.5) {
      thermalStressCategory = 'Moderate';
    } else {
      thermalStressCategory = 'Low';
    }

    // 4. Primary Thermal Strain Score (0 - 62 pts)
    // Continuous, smooth curve from mild (20°C) to extreme heat (>46°C)
    let thermalStrainScore = 0;
    if (utci >= 46) {
      thermalStrainScore = 52 + Math.min(10, (utci - 46) * 1.5);
    } else if (utci >= 38) {
      thermalStrainScore = 38 + ((utci - 38) / 8) * 14;
    } else if (utci >= 32) {
      thermalStrainScore = 22 + ((utci - 32) / 6) * 16;
    } else if (utci >= 26) {
      thermalStrainScore = 10 + ((utci - 26) / 6) * 12;
    } else if (utci >= 20) {
      thermalStrainScore = Math.max(0, ((utci - 20) / 6) * 10);
    } else {
      thermalStrainScore = 0;
    }

    // Supplementary adjustment for high wet-bulb temperature or extreme Heat Index
    if (wbgt >= 31.0) thermalStrainScore += 4;
    else if (wbgt >= 28.5) thermalStrainScore += 2;

    if (heatIndex >= 44.0) thermalStrainScore += 3;
    else if (heatIndex >= 38.0) thermalStrainScore += 1.5;

    // 5. Nocturnal Non-Recovery Penalty (0 - 12 pts)
    // When nighttime minimum temperatures stay high, the body cannot shed daytime heat
    let nightPenalty = 0;
    if (minT >= 29.0) nightPenalty = 12;
    else if (minT >= 27.0) nightPenalty = 8;
    else if (minT >= 24.5) nightPenalty = 4;
    else if (minT >= 22.0) nightPenalty = 2;
    else nightPenalty = 0;

    // 6. Cumulative Heat Persistence (0 - 10 pts)
    if (maxT >= 37.5 || utci >= 37.0) {
      consecutiveHotDays += 1;
    } else if (maxT < 34.0) {
      consecutiveHotDays = Math.max(0, consecutiveHotDays - 2);
    }
    const persistencePenalty = Math.min(10, Math.max(0, consecutiveHotDays - 1) * 2.5);

    // 7. Modulated Vulnerability Contribution (0 - 16 pts)
    // Epidemiological principle: vulnerability only amplifies risk when thermal stress is present
    const thermalActivation = Math.min(1.0, Math.max(0.05, (utci - 22) / 16));
    const activeVulnContribution = rawVulnScore * thermalActivation;

    // 8. Total Multi-Factor Risk Score (0 - 100)
    const rawTotal = thermalStrainScore + nightPenalty + persistencePenalty + activeVulnContribution;
    const finalScore = Math.max(0, Math.min(100, Math.round(rawTotal)));

    // 9. Standardized, Consistent Category Mapping (0-25 Low, 26-50 Moderate, 51-75 High, 76-100 Very High)
    let riskCategory: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme' = 'Low';
    let color = '#16A34A'; // Green
    let badgeBg = '#F0FDF4';
    let badgeBorder = '#BBF7D0';

    if (finalScore >= 85) {
      riskCategory = 'Extreme';
      color = '#B91C1C'; // Dark Red
      badgeBg = '#FEF2F2';
      badgeBorder = '#FECACA';
    } else if (finalScore >= 76) {
      riskCategory = 'Very High';
      color = '#DC2626'; // Red
      badgeBg = '#FEF2F2';
      badgeBorder = '#FECACA';
    } else if (finalScore >= 51) {
      riskCategory = 'High';
      color = '#EA580C'; // Orange
      badgeBg = '#FFF7ED';
      badgeBorder = '#FED7AA';
    } else if (finalScore >= 26) {
      riskCategory = 'Moderate';
      color = '#D97706'; // Amber
      badgeBg = '#FFFBEB';
      badgeBorder = '#FDE68A';
    } else {
      riskCategory = 'Low';
      color = '#16A34A'; // Green
      badgeBg = '#F0FDF4';
      badgeBorder = '#BBF7D0';
    }

    // 10. Contextual, Scientifically Grounded Clinical Health Impact Text
    let expectedHealthImpact = '';
    if (finalScore >= 85) {
      expectedHealthImpact =
        'Critical heat emergency: steep rise in heat stroke, cardiovascular collapse, and acute hospital admissions for vulnerable populations.';
    } else if (finalScore >= 76) {
      expectedHealthImpact =
        'Severe physiological burden: high risk of heat exhaustion, dehydration in outdoor laborers, and cardiovascular strain in seniors.';
    } else if (finalScore >= 51) {
      expectedHealthImpact =
        'Elevated health risk: increased incidence of heat cramps, dizziness, syncope, and fatigue. Shaded rest intervals and hydration needed.';
    } else if (finalScore >= 26) {
      expectedHealthImpact =
        'Moderate physiological strain: mild thermal fatigue during unshaded peak hours. Routine hydration and sensible pacing advised.';
    } else {
      expectedHealthImpact =
        'Low health risk: comfortable thermal conditions with minimal thermoregulatory strain. Standard daily routines can proceed safely.';
    }

    return {
      dayIndex: idx,
      dayName: isToday ? 'Today' : day.dayName,
      dayLabel,
      date: day.date,
      maxTemp: Math.round(maxT),
      minTemp: Math.round(minT),
      utci: Math.round(utci),
      wbgt: Math.round(wbgt * 10) / 10,
      heatIndex: Math.round(heatIndex),
      thermalStressCategory,
      vulnerabilityLevel: vulnLevel,
      healthRiskScore: finalScore,
      mortalityRiskScore: finalScore,
      riskCategory,
      expectedHealthImpact,
      vulnerabilityFactors: vulnFactors,
      color,
      badgeBg,
      badgeBorder,
    };
  });
}


