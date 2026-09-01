/**
 * HeatShield AI - Core Type Definitions & Data Contracts
 * Built for Smart India Hackathon: AI-Powered Heat Impact & Intervention Simulator
 */

export type ThermalStressCategory =
  | 'No Thermal Stress'
  | 'Moderate Heat Stress'
  | 'Strong Heat Stress'
  | 'Very Strong Heat Stress'
  | 'Extreme Heat Stress';

export type AlertLevel = 'Green (Normal)' | 'Yellow (Watch)' | 'Orange (Alert)' | 'Red (Warning - Critical)';

export type PersonaType = 'Outdoor Workers' | 'Elderly & High-Risk' | 'General Public' | 'Hospital Administration' | 'Municipal Authorities';

export interface WeatherDataPoint {
  time: string; // ISO string
  temperature: number; // °C
  relativeHumidity: number; // %
  windSpeed: number; // km/h or m/s
  solarRadiation: number; // W/m²
  dewPoint?: number; // °C
  apparentTemperature?: number; // °C
  surfaceTemperature?: number; // °C
}

export interface CalculatedThermalIndices {
  heatIndex: number; // °C
  wbgt: number; // °C (Wet Bulb Globe Temp)
  utci: number; // °C (Universal Thermal Climate Index)
  htss: number; // 0-100 (Human Thermal Stress Score)
  category: ThermalStressCategory;
  nightHeatRecoveryFailure: boolean; // true if nighttime min temp >= 27°C
  consecutiveHotDays: number;
  cumulativeHeatBurden24h: number;
  cumulativeHeatBurden72h: number;
  cumulativeHeatBurden120h: number;
}

export interface WardDemographics {
  wardId: string;
  wardName: string;
  zone: string;
  totalPopulation: number;
  areaSqKm: number;
  populationDensity: number; // people per sq km
  elderlyPopulation60Plus: number; // count
  elderlyRatio: number; // 0-1
  outdoorWorkerPopulation: number; // count
  outdoorWorkerRatio: number; // 0-1
  slumInformalHousingRatio: number; // 0-1
  vegetationIndexNDVI: number; // 0-1 (lower = less green, more concrete)
  imperviousBuiltupRatio: number; // 0-1 (Urban Heat Island factor)
  healthcareFacilitiesCount: number;
  existingCoolingCenters: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  boundaryGeoJson?: [number, number][]; // Polygon vertices
}

export interface WardImpactProfile {
  ward: WardDemographics;
  currentThermal: CalculatedThermalIndices;
  forecastThermalDaily: {
    day: string;
    date: string;
    maxTemp: number;
    minTemp: number;
    maxUtci: number;
    maxWbgt: number;
    htss: number;
    category: ThermalStressCategory;
    nightRecoveryFailure: boolean;
    cumulativeBurden: number;
  }[];
  humanExposureScore: number; // 0-100
  vulnerabilityScore: number; // 0-100
  healthImpactRisk: number; // 0-1 (model probability / hazard index)
  hospitalizationSurgeProbability: number; // 0-1
  actionWindowHours: number; // Hours until critical threshold
  interventionPriorityRank: number; // 1 = highest
  priorityReason: string;
  shapAttribution: {
    feature: string;
    importance: number; // relative contribution
    impact: 'increasing' | 'decreasing';
    description: string;
  }[];
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  elevationMeters: number;
  baselineHistoricalMortalityThreshold: number; // °C UTCI trigger
  wards: WardDemographics[];
}

export type InterventionType =
  | 'cooling_centers'
  | 'shift_work_hours'
  | 'hydration_rest_breaks'
  | 'targeted_alerts'
  | 'elderly_welfare_checks'
  | 'hospital_preparedness'
  | 'mobile_cooling_units'
  | 'cool_roofs_sprinkling'
  | 'full_heat_action_plan';

export interface InterventionDefinition {
  id: InterventionType;
  title: string;
  category: 'Infrastructure' | 'Occupational' | 'Community' | 'Clinical' | 'Policy';
  description: string;
  targetPopulation: string;
  expectedExposureReduction: number; // percentage (e.g. 35%)
  expectedVulnerabilityReduction: number; // percentage (e.g. 20%)
  expectedHealthRiskReduction: number; // percentage (e.g. 25%)
  unitCostOrEffort: string;
  evidenceSource: string;
  confidence: 'High' | 'Moderate' | 'Evidence-Based Model';
  assumptions: string[];
}

export interface ActiveInterventionConfig {
  coolingCentersActive: boolean;
  shiftWorkHoursActive: boolean;
  hydrationRestBreaksActive: boolean;
  targetedAlertsActive: boolean;
  elderlyWelfareChecksActive: boolean;
  hospitalPreparednessActive: boolean;
  mobileCoolingUnitsActive: boolean;
  coolRoofsSprinklingActive: boolean;
  fullHapActive: boolean;
}

export interface ResourceConstraints {
  coolingCentersAvailable: number;
  mobileUnitsAvailable: number;
  healthWorkerTeamsAvailable: number;
  emergencyHospitalBedsAvailable: number;
}

export interface OptimizedResourceAllocation {
  wardId: string;
  wardName: string;
  priorityScore: number;
  rank: number;
  allocatedCoolingCenters: number;
  allocatedMobileUnits: number;
  allocatedHealthWorkerTeams: number;
  allocatedHospitalBeds: number;
  rationale: string;
}

export interface SimulationOutcome {
  scenarioName: string;
  activeInterventions: ActiveInterventionConfig;
  baselineExposedPopulation: number;
  mitigatedExposedPopulation: number;
  baselineVulnerableExposed: number;
  mitigatedVulnerableExposed: number;
  baselineHealthRiskIndex: number; // 0-100
  mitigatedHealthRiskIndex: number; // 0-100
  hospitalizationSurgeBaseline: number; // estimated cases or index
  hospitalizationSurgeMitigated: number;
  overallExposureReductionPercent: number;
  overallRiskReductionPercent: number;
  resourceUtilization: {
    coolingCentersUsed: number;
    mobileUnitsUsed: number;
    workerTeamsDeployed: number;
    hospitalBedsReserved: number;
  };
  wardOutcomes: {
    wardId: string;
    wardName: string;
    baselineRisk: number;
    mitigatedRisk: number;
    coveragePercent: number;
  }[];
}

export interface DatasetMeta {
  name: string;
  source: string;
  variables: string[];
  geographicResolution: string;
  temporalResolution: string;
  dateRange: string;
  updateFrequency: string;
  license: string;
  limitations: string;
  status: 'Connected (Live)' | 'Calibrated (Public Data)' | 'Operational';
}

export interface TargetedAlertMessage {
  id: string;
  wardId: string;
  wardName: string;
  cityName: string;
  recipientPersona: PersonaType;
  severity: AlertLevel;
  actionWindowText: string;
  headline: string;
  body: string;
  actionChecklist: string[];
  timestamp: string;
  languages: {
    en: string;
    hi: string;
    local: string;
    localLangName: string;
  };
}
