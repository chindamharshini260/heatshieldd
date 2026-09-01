/**
 * TypeScript Interfaces for HeatShield AI
 * Scientific Human Heat-Health Impact Engine
 */

export type HeatRiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';

export type NightRecoveryStatus = 'Good' | 'Limited' | 'Poor';

export type CumulativeHeatTrend =
  | 'Heat is building'
  | 'Heat is easing'
  | 'Steady high heat'
  | 'Normal conditions';

export interface HeatFactorItem {
  name: string;
  rating: 'Low' | 'Moderate' | 'High' | 'Intense' | 'Short' | 'Long';
  valueDisplay: string;
  note: string;
}

export interface HeatSafetyAction {
  id: string;
  title: string;
  detail: string;
  iconType: 'drink' | 'shade' | 'clock' | 'home' | 'clothing' | 'check';
  priority: 'high' | 'medium' | 'general';
}

export interface HourlyHeatRiskPoint {
  time: string;
  displayTime: string;
  hour: number;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  windSpeed: number;
  solarRadiation: number;
  heatIndex: number;
  wbgt: number;
  utci: number;
  riskLevel: HeatRiskLevel;
  dotColor: string;
  badgeClass: string;
  isWorstPeriod: boolean;
  isNight: boolean;
  advice: string;
}

export interface DailyHeatRiskForecast {
  date: string;
  dayName: string;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  riskLevel: HeatRiskLevel;
  dotColor: string;
  badgeClass: string;
  worstTime: string;
  durationHours: number;
  simpleAdvice: string;
  nightRecovery: NightRecoveryStatus;
  weatherCode: number;
  weatherDescription: string;
}

export interface VulnerableGroupAdvice {
  id: string;
  group: string;
  riskDescription: string;
  keyAdvice: string;
}

export interface ScientificDetailsData {
  ambientTempC: number;
  apparentTempC: number;
  relativeHumidity: number;
  windSpeedKmh: number;
  solarRadiationWm2: number;
  heatIndexC: number;
  wbgtC: number;
  utciC: number;
  utciStressCategory: string;
  vaporPressureKPa: number;
  source: string;
  timestamp: string;
}

export interface HumanHeatAnalysis {
  riskLevel: HeatRiskLevel;
  riskScore: number; // 0 - 100
  badgeColor: string;
  badgeBg: string;
  borderColor: string;
  dotColor: string;
  headline: string;
  shortSummary: string;
  worstPeriod: string; // e.g. "12 PM – 4 PM"
  heatDurationHours: number; // e.g. 5
  temperature: number;
  apparentTemperature: number;
  factors: {
    temperature: HeatFactorItem;
    humidity: HeatFactorItem;
    sunExposure: HeatFactorItem;
    wind: HeatFactorItem;
    duration: HeatFactorItem;
    summaryExplanation: string;
  };
  actions: HeatSafetyAction[];
  hourlyTimeline: HourlyHeatRiskPoint[];
  next5Days: DailyHeatRiskForecast[];
  nightRecovery: {
    status: NightRecoveryStatus;
    nightMinTemp: number;
    nightMinApparentTemp: number;
    headline: string;
    explanation: string;
  };
  cumulativeHeat: {
    status: CumulativeHeatTrend;
    headline: string;
    explanation: string;
    avgMax3Days: number;
    avgMax5Days: number;
  };
  vulnerableCare: VulnerableGroupAdvice[];
  scientificDetails: ScientificDetailsData;
}
