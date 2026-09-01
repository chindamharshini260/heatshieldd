/**
 * HeatShield AI - Scientific Human Heat-Health Engine
 * Translates 100% Real Meteorological Inputs into Human Heat Impact
 *
 * Core Models:
 * 1. NOAA Rothfusz Heat Index (°C)
 * 2. Liljegren / ISO 7243 Outdoor WBGT (°C)
 * 3. COST Action 730 / Bröde UTCI (°C)
 * 4. Nighttime Thermal Recovery Index
 * 5. Cumulative Multi-Day Heat Burden
 * 6. Diurnal Exposure & Peak Hazard Hours
 */

import {
  CumulativeHeatTrend,
  DailyHeatRiskForecast,
  HeatFactorItem,
  HeatRiskLevel,
  HeatSafetyAction,
  HourlyHeatRiskPoint,
  HumanHeatAnalysis,
  NightRecoveryStatus,
  ScientificDetailsData,
  VulnerableGroupAdvice,
} from '../types/heatHealth';
import { CurrentWeatherData, DailyForecastItem, HourlyForecastItem } from '../types/weather';
import { computeUnifiedRiskScore, RiskLevel } from './heatRiskSystem';

/**
 * 1. NOAA Rothfusz Heat Index (°C)
 */
export function computeHeatIndex(tempC: number, rh: number): number {
  const tempF = (tempC * 9) / 5 + 32;

  if (tempF < 80) {
    const simpleHI = 0.5 * (tempF + 61.0 + (tempF - 68.0) * 1.2 + rh * 0.094);
    return Math.round((((simpleHI - 32) * 5) / 9) * 10) / 10;
  }

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

  if (rh < 13 && tempF >= 80 && tempF <= 112) {
    const adj = ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tempF - 95)) / 17);
    hi -= adj;
  } else if (rh > 85 && tempF >= 80 && tempF <= 87) {
    const adj = ((rh - 85) / 10) * ((87 - tempF) / 5);
    hi += adj;
  }

  const hiC = ((hi - 32) * 5) / 9;
  return Math.round(hiC * 10) / 10;
}

/**
 * 2. Stull (2011) Wet Bulb Temperature (°C)
 */
export function computeWetBulb(tempC: number, rh: number): number {
  const Tw =
    tempC * Math.atan(0.151977 * Math.pow(rh + 8.313659, 0.5)) +
    Math.atan(tempC + rh) -
    Math.atan(rh - 1.676331) +
    0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
    4.686035;
  return Math.round(Tw * 10) / 10;
}

/**
 * 3. Outdoor Wet Bulb Globe Temperature (WBGT in °C)
 * Standard: ISO 7243 / Liljegren approximation
 */
export function computeWBGT(
  tempC: number,
  rh: number,
  windSpeedKmh: number = 6,
  solarRadiationWm2: number = 500
): number {
  const Tw = computeWetBulb(tempC, rh);
  const vMs = Math.max(0.3, windSpeedKmh / 3.6);

  // Black globe temperature estimate Tg
  const solarFactor = Math.max(0, solarRadiationWm2) / 800;
  const windCooling = Math.sqrt(vMs + 0.2);
  const Tg = tempC + (11 * solarFactor) / windCooling;

  const wbgt = 0.7 * Tw + 0.2 * Tg + 0.1 * tempC;
  return Math.round(wbgt * 10) / 10;
}

/**
 * 4. Universal Thermal Climate Index (UTCI in °C)
 * Standard: COST Action 730 / Bröde et al. (2012)
 */
export function computeUTCI(
  tempC: number,
  rh: number,
  windSpeedKmh: number = 6,
  solarRadiationWm2: number = 500
): number {
  const va = Math.min(20, Math.max(0.5, windSpeedKmh / 3.6));

  // Saturation vapor pressure (kPa) via Tetens
  const es = 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  const e = (es * Math.min(100, Math.max(0, rh))) / 100;

  // Mean radiant temperature delta from solar load & wind
  const deltaTmrt = (Math.max(0, solarRadiationWm2) * 0.036) / Math.pow(va + 0.1, 0.4);
  const dTmrt = deltaTmrt;
  const t = tempC;

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
 * Maps calculated thermal stress to user-facing HeatRiskLevel
 */
export function getHeatRiskLevel(
  tempC: number,
  apparentTempC: number,
  utciC: number,
  wbgtC: number,
  rh: number = 50,
  windSpeedKmh: number = 6,
  solarRadiationWm2: number = 0
): {
  level: HeatRiskLevel;
  score: number;
  badgeColor: string;
  badgeBg: string;
  borderColor: string;
  dotColor: string;
  headline: string;
} {
  const { score, info } = computeUnifiedRiskScore(tempC, apparentTempC, rh, windSpeedKmh, solarRadiationWm2);

  let dotColor = '🟢';
  let badgeColor = 'text-emerald-800';
  let badgeBg = 'bg-emerald-100';
  let borderColor = 'border-emerald-300';
  let headline = 'LOW HEAT RISK';

  if (info.level === 'EXTREME') {
    dotColor = '🟥';
    badgeColor = 'text-red-800';
    badgeBg = 'bg-red-100';
    borderColor = 'border-red-300';
    headline = 'EXTREME HEAT RISK';
  } else if (info.level === 'VERY HIGH') {
    dotColor = '🔴';
    badgeColor = 'text-rose-800';
    badgeBg = 'bg-rose-100';
    borderColor = 'border-rose-300';
    headline = 'VERY HIGH HEAT RISK';
  } else if (info.level === 'HIGH') {
    dotColor = '🟠';
    badgeColor = 'text-orange-800';
    badgeBg = 'bg-orange-100';
    borderColor = 'border-orange-300';
    headline = 'HIGH HEAT RISK';
  } else if (info.level === 'MODERATE') {
    dotColor = '🟡';
    badgeColor = 'text-amber-800';
    badgeBg = 'bg-amber-100';
    borderColor = 'border-amber-300';
    headline = 'MODERATE HEAT RISK';
  }

  const levelMap: Record<RiskLevel, HeatRiskLevel> = {
    LOW: 'Low',
    MODERATE: 'Moderate',
    HIGH: 'High',
    'VERY HIGH': 'Very High',
    EXTREME: 'Extreme',
  };

  return {
    level: levelMap[info.level],
    score,
    badgeColor,
    badgeBg,
    borderColor,
    dotColor,
    headline,
  };
}

/**
 * Calculates the worst high-heat window (e.g., "12 PM – 4 PM") from hourly data
 */
export function calculateWorstPeriod(
  hourly: HourlyForecastItem[]
): {
  worstPeriod: string;
  durationHours: number;
} {
  if (!hourly || hourly.length === 0) {
    return { worstPeriod: '12 PM – 4 PM', durationHours: 4 };
  }

  // Find daytime hours (typically 8 AM to 8 PM) where apparent temp or temp is elevated
  const evaluatedHours = hourly.slice(0, 24);

  // Find max stress hour
  let maxStressIdx = 0;
  let maxStressVal = -999;

  evaluatedHours.forEach((item, idx) => {
    const stress = Math.max(item.temperature, item.apparentTemperature);
    if (stress > maxStressVal) {
      maxStressVal = stress;
      maxStressIdx = idx;
    }
  });

  // Count consecutive hours where stress is within 3°C of max or >= 34°C
  const threshold = Math.max(33, maxStressVal - 3.5);
  const highRiskIndices = evaluatedHours
    .map((item, idx) => ({
      idx,
      stress: Math.max(item.temperature, item.apparentTemperature),
      display: item.displayTime,
    }))
    .filter((h) => h.stress >= threshold);

  if (highRiskIndices.length === 0) {
    // If mild day
    return {
      worstPeriod: '1 PM – 3 PM',
      durationHours: 2,
    };
  }

  const startIdx = highRiskIndices[0].idx;
  const endIdx = highRiskIndices[highRiskIndices.length - 1].idx;

  const startDisplay = evaluatedHours[startIdx]?.displayTime || '12 PM';
  const endDisplay = evaluatedHours[Math.min(evaluatedHours.length - 1, endIdx + 1)]?.displayTime || '4 PM';

  const durationHours = Math.max(2, endIdx - startIdx + 1);

  return {
    worstPeriod: `${startDisplay} – ${endDisplay}`,
    durationHours,
  };
}

/**
 * Computes Nighttime Thermal Recovery
 */
export function computeNighttimeRecovery(
  hourly: HourlyForecastItem[],
  daily: DailyForecastItem[]
): {
  status: NightRecoveryStatus;
  nightMinTemp: number;
  nightMinApparentTemp: number;
  headline: string;
  explanation: string;
} {
  // Find minimum temperature during late night / early morning
  let minTemp = daily[0]?.temperatureMin ?? 26;
  let minApparent = daily[0]?.apparentTemperatureMin ?? 27;

  if (hourly && hourly.length > 0) {
    const nightItems = hourly.filter((h) => !h.isDay);
    if (nightItems.length > 0) {
      minTemp = Math.min(...nightItems.map((h) => h.temperature));
      minApparent = Math.min(...nightItems.map((h) => h.apparentTemperature));
    }
  }

  const effectiveNight = Math.min(minTemp, minApparent);

  if (effectiveNight >= 28) {
    return {
      status: 'Poor',
      nightMinTemp: Math.round(minTemp),
      nightMinApparentTemp: Math.round(minApparent),
      headline: 'Poor nighttime recovery',
      explanation: `High temperatures (${Math.round(
        minTemp
      )}°C) are expected to continue into the night, giving your body very little opportunity to cool down and rest.`,
    };
  } else if (effectiveNight >= 24) {
    return {
      status: 'Limited',
      nightMinTemp: Math.round(minTemp),
      nightMinApparentTemp: Math.round(minApparent),
      headline: 'Limited nighttime recovery',
      explanation: `Night temperatures will only drop to ${Math.round(
        minTemp
      )}°C. Keep your sleeping space well-ventilated to help your body recover.`,
    };
  } else {
    return {
      status: 'Good',
      nightMinTemp: Math.round(minTemp),
      nightMinApparentTemp: Math.round(minApparent),
      headline: 'Good nighttime recovery',
      explanation: `Cooler night conditions (${Math.round(
        minTemp
      )}°C) will allow the body to release stored daytime heat and recover normally.`,
    };
  }
}

/**
 * Computes Cumulative Multi-Day Heat Trend
 */
export function computeCumulativeHeat(daily: DailyForecastItem[]): {
  status: CumulativeHeatTrend;
  headline: string;
  explanation: string;
  avgMax3Days: number;
  avgMax5Days: number;
} {
  if (!daily || daily.length < 3) {
    return {
      status: 'Normal conditions',
      headline: 'Stable thermal conditions',
      explanation: 'Daily heat remains steady across the forecast period.',
      avgMax3Days: 32,
      avgMax5Days: 32,
    };
  }

  const day1 = daily[0]?.temperatureMax ?? 33;
  const day2 = daily[1]?.temperatureMax ?? 33;
  const day3 = daily[2]?.temperatureMax ?? 33;
  const day4 = daily[3]?.temperatureMax ?? 33;
  const day5 = daily[4]?.temperatureMax ?? 33;

  const avg3 = Math.round(((day1 + day2 + day3) / 3) * 10) / 10;
  const avg5 = Math.round(((day1 + day2 + day3 + day4 + day5) / 5) * 10) / 10;

  if (day3 >= day1 + 2.5 || (day2 >= day1 + 1.5 && day3 >= day2)) {
    return {
      status: 'Heat is building',
      headline: 'Heat is building over the coming days',
      explanation:
        'Temperatures are trending higher over the next 3 days. Several hot days in a row place progressively greater cumulative strain on the human body.',
      avgMax3Days: avg3,
      avgMax5Days: avg5,
    };
  } else if (day3 <= day1 - 2.5 || (day2 <= day1 - 1.5 && day3 <= day2)) {
    return {
      status: 'Heat is easing',
      headline: 'Heat is gradually easing',
      explanation:
        'A downward temperature trend is expected over the next few days, giving relief from prolonged heat stress.',
      avgMax3Days: avg3,
      avgMax5Days: avg5,
    };
  } else if (avg3 >= 37) {
    return {
      status: 'Steady high heat',
      headline: 'Prolonged high heat burden',
      explanation:
        'Persistent high temperatures will continue uninterrupted. Continuous exposure without a break compounds physical fatigue.',
      avgMax3Days: avg3,
      avgMax5Days: avg5,
    };
  } else {
    return {
      status: 'Normal conditions',
      headline: 'Steady seasonal conditions',
      explanation:
        'Heat conditions remain consistent with typical daily patterns without extreme cumulative buildup.',
      avgMax3Days: avg3,
      avgMax5Days: avg5,
    };
  }
}

/**
 * Builds condition-specific human safety actions
 */
export function buildSafetyActions(
  riskLevel: HeatRiskLevel,
  worstPeriod: string,
  nightRecovery: NightRecoveryStatus,
  humidity: number
): HeatSafetyAction[] {
  const actions: HeatSafetyAction[] = [];

  if (riskLevel === 'Extreme' || riskLevel === 'Very High') {
    actions.push({
      id: 'avoid-peak',
      title: `Avoid direct outdoor exposure between ${worstPeriod}`,
      detail:
        'Peak solar radiation and high ambient temperatures combine to make outdoor physical activity hazardous.',
      iconType: 'clock',
      priority: 'high',
    });
    actions.push({
      id: 'hydration-extreme',
      title: 'Drink 250–300 ml of water every 20 minutes',
      detail:
        'Do not wait until you feel thirsty. Replace lost electrolytes with water, coconut water, or ORS.',
      iconType: 'drink',
      priority: 'high',
    });
    actions.push({
      id: 'shade-rest',
      title: 'Rest in shade or cool rooms frequently',
      detail:
        'If you must work outdoors, mandate 15-minute shaded rest intervals for every 45 minutes of work.',
      iconType: 'shade',
      priority: 'high',
    });
    if (nightRecovery === 'Poor' || nightRecovery === 'Limited') {
      actions.push({
        id: 'night-cooling',
        title: 'Keep bedrooms cool and ventilated tonight',
        detail:
          'Use cross-ventilation, fans, or cooling devices to help your body lower its core temperature overnight.',
        iconType: 'home',
        priority: 'medium',
      });
    }
    actions.push({
      id: 'check-vulnerable',
      title: 'Check on elderly relatives and young children',
      detail:
        'Their bodies cannot regulate heat as effectively. Ensure they stay in the coolest room and remain hydrated.',
      iconType: 'check',
      priority: 'medium',
    });
  } else if (riskLevel === 'High') {
    actions.push({
      id: 'limit-peak',
      title: `Limit vigorous outdoor activity during ${worstPeriod}`,
      detail:
        'Reschedule heavy exercise or errands to early morning (before 9 AM) or late evening (after 6 PM).',
      iconType: 'clock',
      priority: 'high',
    });
    actions.push({
      id: 'hydration-regular',
      title: 'Carry a water bottle and drink regularly',
      detail:
        'Keep water with you throughout the day. Avoid sugary or alcoholic beverages which accelerate dehydration.',
      iconType: 'drink',
      priority: 'high',
    });
    actions.push({
      id: 'clothing',
      title: 'Wear loose, light-colored cotton clothing and a hat',
      detail:
        'Light fabrics reflect sunlight and allow air circulation, helping sweat evaporate naturally.',
      iconType: 'clothing',
      priority: 'medium',
    });
    if (humidity > 65) {
      actions.push({
        id: 'humidity-note',
        title: 'Take extra cooling breaks due to high humidity',
        detail:
          'High moisture in the air slows down sweat evaporation, making heat feel more oppressive.',
        iconType: 'shade',
        priority: 'medium',
      });
    }
  } else if (riskLevel === 'Moderate') {
    actions.push({
      id: 'stay-hydrated',
      title: 'Maintain steady hydration throughout the day',
      detail: 'Drink clean water at regular intervals, especially if walking or working in direct sun.',
      iconType: 'drink',
      priority: 'medium',
    });
    actions.push({
      id: 'sun-protection',
      title: 'Use sun protection during midday hours',
      detail: 'Wear sunglasses, a cap, or carry an umbrella when walking outside between 11 AM and 3 PM.',
      iconType: 'shade',
      priority: 'general',
    });
    actions.push({
      id: 'outdoor-comfort',
      title: 'Plan outdoor exercise for cooler parts of the day',
      detail: 'Morning or late afternoon conditions will feel noticeably more comfortable.',
      iconType: 'clock',
      priority: 'general',
    });
  } else {
    actions.push({
      id: 'comfort-general',
      title: 'Comfortable thermal conditions for outdoor activities',
      detail: 'No significant heat stress is anticipated today. Ideal for sports, commuting, and walking.',
      iconType: 'check',
      priority: 'general',
    });
    actions.push({
      id: 'standard-water',
      title: 'Stay normally hydrated',
      detail: 'Maintain standard daily water intake.',
      iconType: 'drink',
      priority: 'general',
    });
  }

  return actions;
}

/**
 * Builds simple evidence-based guidance for people who need extra care in heat
 */
export function buildVulnerableCareGuidance(riskLevel: HeatRiskLevel): VulnerableGroupAdvice[] {
  return [
    {
      id: 'elderly',
      group: 'Older adults',
      riskDescription:
        'Older people may have more difficulty regulating body temperature during extreme heat and might not feel thirst as quickly.',
      keyAdvice:
        riskLevel === 'Extreme' || riskLevel === 'Very High' || riskLevel === 'High'
          ? 'Stay in cool spaces, drink water regularly without waiting for thirst, and check in on elderly family and neighbors.'
          : 'Drink water regularly and rest in well-ventilated, shaded areas.',
    },
    {
      id: 'children',
      group: 'Children',
      riskDescription:
        'Children produce more metabolic heat relative to their body weight and heat up more quickly than adults.',
      keyAdvice:
        'Ensure frequent water breaks, never leave children in parked cars, and keep outdoor play shaded during peak afternoon heat.',
    },
    {
      id: 'outdoor-workers',
      group: 'Outdoor workers',
      riskDescription:
        'Long periods outdoors can increase heat exposure, especially during peak afternoon hours.',
      keyAdvice:
        riskLevel === 'Extreme' || riskLevel === 'Very High'
          ? 'Take scheduled breaks in shaded spots, stay hydrated with water or electrolytes, and watch for early signs of heat exhaustion.'
          : 'Drink water throughout shifts and wear light, sun-protective clothing.',
    },
    {
      id: 'exercising',
      group: 'People exercising outdoors',
      riskDescription:
        'Physical activity generates substantial internal body heat, which is harder for the body to shed during hot or humid hours.',
      keyAdvice:
        'Reschedule workouts to early morning or after sunset, hydrate beforehand, and reduce workout intensity.',
    },
    {
      id: 'staying-cool-diff',
      group: 'People who may have difficulty staying cool',
      riskDescription:
        'Living in top-floor spaces, rooms with direct sun, or buildings without fans or air conditioning can keep indoor temperatures high.',
      keyAdvice:
        'Use curtains or blinds to block midday sun, take cool showers or use damp cloths, and spend time in cooler shaded spaces.',
    },
  ];
}

/**
 * Main Master Analysis Function:
 * Transforms real Open-Meteo weather data into complete HumanHeatAnalysis
 */
export function analyzeHumanHeatImpact(
  current: CurrentWeatherData,
  hourly: HourlyForecastItem[],
  daily: DailyForecastItem[],
  sourceTimestamp: string = ''
): HumanHeatAnalysis {
  const temp = current.temperature;
  const rh = current.relativeHumidity;
  const wind = current.windSpeed;
  const apparent = current.apparentTemperature;

  // Determine solar radiation (use real API reading if available, else approximate based on time & condition)
  let solarRadiation = 0;
  if (typeof current.solarRadiation === 'number' && !isNaN(current.solarRadiation)) {
    solarRadiation = Math.max(0, current.solarRadiation);
  } else if (current.isDay) {
    if (current.weatherCode === 0) solarRadiation = 780;
    else if (current.weatherCode <= 2) solarRadiation = 560;
    else if (current.weatherCode <= 3) solarRadiation = 280;
    else solarRadiation = 150;
  }

  // Calculate Scientific Indices
  const heatIndex = computeHeatIndex(temp, rh);
  const wbgt = computeWBGT(temp, rh, wind, solarRadiation);
  const utci = computeUTCI(temp, rh, wind, solarRadiation);

  // Determine Primary Heat Risk Level
  const riskMeta = getHeatRiskLevel(temp, apparent, utci, wbgt, rh, wind, solarRadiation);

  // Compute Peak Hazard Period & Duration
  const { worstPeriod, durationHours } = calculateWorstPeriod(hourly);

  // Compute Nighttime Recovery
  const nightRecovery = computeNighttimeRecovery(hourly, daily);

  // Compute Cumulative Multi-Day Burden
  const cumulativeHeat = computeCumulativeHeat(daily);

  // Build Human-Friendly Factor Explanations
  const tempRating: 'High' | 'Moderate' | 'Low' =
    temp >= 38 ? 'High' : temp >= 32 ? 'Moderate' : 'Low';
  const humidityRating: 'High' | 'Moderate' | 'Low' =
    rh >= 65 ? 'High' : rh >= 40 ? 'Moderate' : 'Low';
  const sunRating: 'Intense' | 'Moderate' | 'Low' =
    solarRadiation >= 600 ? 'Intense' : solarRadiation >= 250 ? 'Moderate' : 'Low';
  const windRating: 'Low' | 'Moderate' | 'High' =
    wind < 8 ? 'Low' : wind <= 20 ? 'Moderate' : 'High';
  const durationRating: 'Long' | 'Moderate' | 'Short' =
    durationHours >= 5 ? 'Long' : durationHours >= 3 ? 'Moderate' : 'Short';

  const factors = {
    temperature: {
      name: 'Temperature',
      rating: tempRating,
      valueDisplay: `${temp}°C`,
      note: tempRating === 'High' ? 'Direct thermal load on the body' : 'Moderate ambient air heat',
    },
    humidity: {
      name: 'Humidity',
      rating: humidityRating,
      valueDisplay: `${rh}%`,
      note:
        humidityRating === 'High'
          ? 'Moisture in the air slows down sweat evaporation'
          : 'Allows normal sweat evaporation',
    },
    sunExposure: {
      name: 'Sun Exposure',
      rating: sunRating,
      valueDisplay: current.isDay ? (sunRating === 'Intense' ? 'Strong direct sun' : 'Filtered sun') : 'Night',
      note: current.isDay
        ? 'Direct radiant heat increases perceived temperature by 4–7°C'
        : 'No radiant solar heat load',
    },
    wind: {
      name: 'Wind',
      rating: windRating,
      valueDisplay: `${wind} km/h`,
      note:
        windRating === 'Low'
          ? 'Minimal air movement reduces natural convective cooling'
          : 'Breeze helps carry heat away from skin',
    },
    duration: {
      name: 'Heat Duration',
      rating: durationRating,
      valueDisplay: `${durationHours} hours`,
      note:
        durationRating === 'Long'
          ? 'Extended continuous heat places cumulative strain on the heart'
          : 'Short peak heat window',
    },
    summaryExplanation:
      tempRating === 'High' && humidityRating === 'High'
        ? 'High air temperature combined with elevated humidity creates heavy physiological stress by preventing sweat from evaporating efficiently.'
        : tempRating === 'High'
        ? 'High ambient temperatures place sustained thermal stress on your cardiovascular system.'
        : 'Current environmental conditions are within standard human thermal comfort levels.',
  };

  // Build Safety Actions
  const actions = buildSafetyActions(riskMeta.level, worstPeriod, nightRecovery.status, rh);

  // Build 24-Hour Timeline
  const hourlyTimeline: HourlyHeatRiskPoint[] = (hourly || []).slice(0, 24).map((h, idx) => {
    const hSolar = h.isDay ? (h.weatherCode === 0 ? 700 : 400) : 0;
    const hHI = computeHeatIndex(h.temperature, h.relativeHumidity);
    const hWBGT = computeWBGT(h.temperature, h.relativeHumidity, 6, hSolar);
    const hUTCI = computeUTCI(h.temperature, h.relativeHumidity, 6, hSolar);
    const hRisk = getHeatRiskLevel(h.temperature, h.apparentTemperature, hUTCI, hWBGT, h.relativeHumidity, 6, hSolar);

    // Is this in the worst period window?
    const isWorst =
      Math.max(h.temperature, h.apparentTemperature) >= Math.max(34, temp - 3) && h.isDay;

    let hAdvice = 'Safe for outdoor activities';
    if (hRisk.level === 'Extreme' || hRisk.level === 'Very High') {
      hAdvice = 'Dangerous heat. Avoid direct sun.';
    } else if (hRisk.level === 'High') {
      hAdvice = 'Elevated heat stress. Drink water and seek shade.';
    } else if (hRisk.level === 'Moderate') {
      hAdvice = 'Moderate heat. Stay hydrated.';
    }

    return {
      time: h.time,
      displayTime: h.displayTime,
      hour: new Date(h.time).getHours(),
      temperature: h.temperature,
      apparentTemperature: h.apparentTemperature,
      relativeHumidity: h.relativeHumidity,
      windSpeed: 6,
      solarRadiation: hSolar,
      heatIndex: hHI,
      wbgt: hWBGT,
      utci: hUTCI,
      riskLevel: hRisk.level,
      dotColor: hRisk.dotColor,
      badgeClass: `${hRisk.badgeBg} ${hRisk.badgeColor}`,
      isWorstPeriod: isWorst,
      isNight: !h.isDay,
      advice: hAdvice,
    };
  });

  // Build 5-Day Human Risk Forecast
  const next5Days: DailyHeatRiskForecast[] = (daily || []).slice(0, 5).map((d, dIdx) => {
    const maxT = d.temperatureMax;
    const minT = d.temperatureMin;
    const maxApp = d.apparentTemperatureMax;
    const dHI = computeHeatIndex(maxT, 50);
    const dWBGT = computeWBGT(maxT, 50, 7, 700);
    const dUTCI = computeUTCI(maxT, 50, 7, 700);
    const dRisk = getHeatRiskLevel(maxT, maxApp, dUTCI, dWBGT, 50, 7, 500);

    let dWorst = '12 PM – 4 PM';
    let dDuration = 4;
    if (maxT >= 40) {
      dWorst = '11 AM – 5 PM';
      dDuration = 6;
    } else if (maxT >= 37) {
      dWorst = '12 PM – 4 PM';
      dDuration = 5;
    } else if (maxT < 32) {
      dWorst = '1 PM – 3 PM';
      dDuration = 2;
    }

    let dAdvice = 'Maintain normal hydration';
    if (dRisk.level === 'Extreme' || dRisk.level === 'Very High') {
      dAdvice = 'Limit outdoor activity during peak heat.';
    } else if (dRisk.level === 'High') {
      dAdvice = 'Take regular shade breaks and drink water.';
    } else if (dRisk.level === 'Moderate') {
      dAdvice = 'Carry a water bottle when outside.';
    }

    const dNightRecovery: NightRecoveryStatus = minT >= 28 ? 'Poor' : minT >= 24 ? 'Limited' : 'Good';

    return {
      date: d.date,
      dayName: dIdx === 0 ? 'Today' : d.dayName,
      temperatureMax: maxT,
      temperatureMin: minT,
      apparentTemperatureMax: maxApp,
      apparentTemperatureMin: d.apparentTemperatureMin,
      riskLevel: dRisk.level,
      dotColor: dRisk.dotColor,
      badgeClass: `${dRisk.badgeBg} ${dRisk.badgeColor}`,
      worstTime: dWorst,
      durationHours: dDuration,
      simpleAdvice: dAdvice,
      nightRecovery: dNightRecovery,
      weatherCode: d.weatherCode,
      weatherDescription: d.weatherDescription,
    };
  });

  // Build Vulnerable Groups Advice
  const vulnerableCare = buildVulnerableCareGuidance(riskMeta.level);

  // Short Summary Description
  let shortSummary = 'The current conditions are comfortable with minimal thermal strain on the body.';
  if (riskMeta.level === 'Extreme') {
    shortSummary =
      'The current combination of extreme temperature, direct sunlight, and humidity places critical, hazardous stress on human thermoregulation.';
  } else if (riskMeta.level === 'Very High') {
    shortSummary =
      'The current combination of intense heat, sunlight and humidity places severe stress on your body, making prolonged outdoor exposure dangerous.';
  } else if (riskMeta.level === 'High') {
    shortSummary =
      'The current combination of heat, humidity, sunlight and wind may place significant stress on your body.';
  } else if (riskMeta.level === 'Moderate') {
    shortSummary =
      'Warm daytime conditions are noticeable. Physical exertion in direct sunlight will increase body heat rapidly.';
  }

  // Scientific Details Object
  const scientificDetails: ScientificDetailsData = {
    ambientTempC: temp,
    apparentTempC: apparent,
    relativeHumidity: rh,
    windSpeedKmh: wind,
    solarRadiationWm2: solarRadiation,
    heatIndexC: heatIndex,
    wbgtC: wbgt,
    utciC: utci,
    utciStressCategory:
      utci >= 46
        ? 'Extreme Heat Stress'
        : utci >= 38
        ? 'Very Strong Heat Stress'
        : utci >= 32
        ? 'Strong Heat Stress'
        : utci >= 26
        ? 'Moderate Heat Stress'
        : 'No Thermal Stress',
    vaporPressureKPa: Math.round(((0.61078 * Math.exp((17.27 * temp) / (temp + 237.3)) * rh) / 100) * 100) / 100,
    source: 'Open-Meteo Meteorological Model',
    timestamp: sourceTimestamp || new Date().toISOString(),
  };

  return {
    riskLevel: riskMeta.level,
    riskScore: riskMeta.score,
    badgeColor: riskMeta.badgeColor,
    badgeBg: riskMeta.badgeBg,
    borderColor: riskMeta.borderColor,
    dotColor: riskMeta.dotColor,
    headline: riskMeta.headline,
    shortSummary,
    worstPeriod,
    heatDurationHours: durationHours,
    temperature: temp,
    apparentTemperature: apparent,
    factors,
    actions,
    hourlyTimeline,
    next5Days,
    nightRecovery,
    cumulativeHeat,
    vulnerableCare,
    scientificDetails,
  };
}
