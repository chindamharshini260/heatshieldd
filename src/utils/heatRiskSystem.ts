/**
 * HeatShield AI - Single Source of Truth for Heat Risk System
 * Standardized 0-100 Scale, Categories, Palette, and Physiological Impact
 * 
 * RISK PALETTE:
 * LOW (0-24): #16A34A
 * MODERATE (25-49): #F59E0B
 * HIGH (50-69): #F97316
 * VERY HIGH (70-84): #EF4444
 * EXTREME (85-100): #B91C1C
 */

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH' | 'EXTREME';

export interface RiskLevelInfo {
  level: RiskLevel;
  score: number; // 0 - 100
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  textColor: string;
  label: string;
  shortAdvice: string;
}

export function getRiskLevelInfo(score: number): RiskLevelInfo {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  if (clampedScore >= 85) {
    return {
      level: 'EXTREME',
      score: clampedScore,
      color: '#B91C1C',
      bgColor: '#FEF2F2',
      borderColor: '#FCA5A5',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-900',
      textColor: 'text-[#B91C1C]',
      label: 'EXTREME',
      shortAdvice: 'Dangerous physiological heat load. Avoid all unconditioned outdoor exposure.',
    };
  }
  if (clampedScore >= 70) {
    return {
      level: 'VERY HIGH',
      score: clampedScore,
      color: '#EF4444',
      bgColor: '#FEF2F2',
      borderColor: '#FECACA',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-900',
      textColor: 'text-[#EF4444]',
      label: 'VERY HIGH',
      shortAdvice: 'High risk of heat exhaustion. Rapid hydration and strict shade required.',
    };
  }
  if (clampedScore >= 50) {
    return {
      level: 'HIGH',
      score: clampedScore,
      color: '#F97316',
      bgColor: '#FFF7ED',
      borderColor: '#FED7AA',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-900',
      textColor: 'text-[#F97316]',
      label: 'HIGH',
      shortAdvice: 'Substantial thermal strain during outdoor exertion. Take frequent cooling breaks.',
    };
  }
  if (clampedScore >= 25) {
    return {
      level: 'MODERATE',
      score: clampedScore,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-900',
      textColor: 'text-[#D97706]',
      label: 'MODERATE',
      shortAdvice: 'Noticeable heat discomfort. Stay hydrated and monitor prolonged sun exposure.',
    };
  }
  return {
    level: 'LOW',
    score: clampedScore,
    color: '#16A34A',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    textColor: 'text-[#16A34A]',
    label: 'LOW',
    shortAdvice: 'Minimal physiological heat stress. Conditions are safe for standard outdoor activities.',
  };
}

export function computeUnifiedRiskScore(
  tempC: number,
  apparentTempC: number,
  humidity: number,
  windKmh: number = 8,
  radiationWm2: number = 0
): { score: number; info: RiskLevelInfo } {
  // Effective thermal strain blends dry-bulb and apparent (heat index)
  // Apparent temperature already integrates relative humidity & wind cooling in Open-Meteo
  const effectiveTemp = 0.6 * apparentTempC + 0.4 * tempC;

  let raw = 0;
  if (effectiveTemp <= 22) {
    // <= 22°C: Minimal or no heat stress (Score: 5 to 15)
    raw = Math.max(5, (effectiveTemp / 22) * 15);
  } else if (effectiveTemp <= 29) {
    // 22 to 29°C: Low stress / Normal comfort (Score: 15 to 28)
    raw = 15 + ((effectiveTemp - 22) / 7) * 13;
  } else if (effectiveTemp <= 35) {
    // 29 to 35°C: Moderate stress / Caution (Score: 28 to 49)
    raw = 28 + ((effectiveTemp - 29) / 6) * 21;
  } else if (effectiveTemp <= 40) {
    // 35 to 40°C: High stress / Extreme Caution (Score: 50 to 69)
    raw = 50 + ((effectiveTemp - 35) / 5) * 19;
  } else if (effectiveTemp <= 45) {
    // 40 to 45°C: Very High stress / Danger (Score: 70 to 84)
    raw = 70 + ((effectiveTemp - 40) / 5) * 14;
  } else {
    // > 45°C: Extreme stress / Extreme Danger (Score: 85 to 99)
    raw = 85 + Math.min(14, ((effectiveTemp - 45) / 6) * 14);
  }

  // Extreme humidity penalty only if ambient is already hot
  if (humidity > 75 && effectiveTemp >= 32) {
    raw += Math.min(5, ((humidity - 75) / 25) * 5);
  }

  // Direct strong sun adjustment (only during peak daytime high solar load)
  if (radiationWm2 > 650 && effectiveTemp >= 30) {
    raw += Math.min(4, ((radiationWm2 - 650) / 350) * 4);
  }

  // Active breeze cooling adjustment
  if (windKmh > 15 && effectiveTemp < 37) {
    raw = Math.max(5, raw - 3);
  }

  const score = Math.max(5, Math.min(99, Math.round(raw)));
  return { score, info: getRiskLevelInfo(score) };
}
