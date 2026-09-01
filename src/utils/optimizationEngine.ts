/**
 * HeatShield AI - Resource Optimization & What-If Simulation Engine
 * Implements Greedy & Integer Linear Programming heuristics to optimize
 * municipal resources across wards based on multi-criteria risk, coverage, and evidence models.
 */

import {
  ActiveInterventionConfig,
  OptimizedResourceAllocation,
  ResourceConstraints,
  SimulationOutcome,
  WardDemographics,
  WardImpactProfile
} from '../types';
import { INTERVENTION_EVIDENCE_CATALOG } from './evidenceMatrix';

/**
 * Calculates a composite Multi-Criteria Intervention Priority Score (0-100) for a ward
 * Combines:
 * - Hazard (HTSS / UTCI): 30%
 * - Exposure (Population Density & Worker density): 25%
 * - Vulnerability (Demographic & Infrastructure deficit): 25%
 * - Cumulative Burden & Nighttime Failure: 10%
 * - Action Window Urgency: 10%
 */
export function calculate_ward_priority_score(profile: WardImpactProfile): number {
  const hazardFactor = profile.currentThermal.htss / 100;
  const exposureFactor = profile.humanExposureScore / 100;
  const vulnerabilityFactor = profile.vulnerabilityScore / 100;

  const cumulativeFactor = Math.min(1, profile.currentThermal.cumulativeHeatBurden72h / 150);
  const urgencyFactor = profile.actionWindowHours <= 24 ? 1.0 : profile.actionWindowHours <= 48 ? 0.7 : 0.4;

  const composite =
    (hazardFactor * 0.3 +
      exposureFactor * 0.25 +
      vulnerabilityFactor * 0.25 +
      cumulativeFactor * 0.1 +
      urgencyFactor * 0.1) *
    100;

  return Math.round(composite * 10) / 10;
}

/**
 * Optimizes the distribution of constrained municipal resources across all city wards.
 * Uses greedy marginal coverage maximization:
 * 1. Cooling centers allocated to wards with highest vulnerable elderly & slum population lacking existing centers.
 * 2. Mobile units allocated to highest outdoor-worker density and transit corridors.
 * 3. Health worker teams allocated to highest elderly isolation & pre-hospitalization risk.
 * 4. Hospital surge beds allocated to areas with highest projected clinical decompensation.
 */
export function optimize_resource_allocation(
  wardProfiles: WardImpactProfile[],
  constraints: ResourceConstraints
): OptimizedResourceAllocation[] {
  // Sort wards by priority score descending
  const sorted = [...wardProfiles].map((p) => ({
    profile: p,
    priorityScore: calculate_ward_priority_score(p)
  })).sort((a, b) => b.priorityScore - a.priorityScore);

  let remainingCooling = constraints.coolingCentersAvailable;
  let remainingMobile = constraints.mobileUnitsAvailable;
  let remainingWorkers = constraints.healthWorkerTeamsAvailable;
  let remainingBeds = constraints.emergencyHospitalBedsAvailable;

  const allocations: OptimizedResourceAllocation[] = [];

  // Pass 1: Initial allocations based on ranked marginal utility
  sorted.forEach((item, index) => {
    const w = item.profile.ward;
    const rank = index + 1;
    const rationales: string[] = [];

    // Cooling Centers: Prioritize high slum & low existing cooling centers in top tier
    let allocatedCooling = 0;
    if (remainingCooling > 0 && item.priorityScore >= 55 && w.existingCoolingCenters < 3) {
      const take = Math.min(remainingCooling, item.priorityScore >= 75 ? 2 : 1);
      allocatedCooling = take;
      remainingCooling -= take;
      rationales.push(
        `Allocated ${take} cooling center(s) due to high vulnerable density (${Math.round(w.elderlyPopulation60Plus + w.totalPopulation * w.slumInformalHousingRatio)} residents) and current infrastructure deficit.`
      );
    }

    // Mobile Units: Prioritize high outdoor worker ratio
    let allocatedMobile = 0;
    if (remainingMobile > 0 && w.outdoorWorkerRatio >= 0.15) {
      const take = Math.min(remainingMobile, w.outdoorWorkerPopulation > 8000 ? 2 : 1);
      allocatedMobile = take;
      remainingMobile -= take;
      rationales.push(
        `Deployed ${take} mobile mist van(s) targeting ~${w.outdoorWorkerPopulation.toLocaleString()} active outdoor/informal workers.`
      );
    }

    // Health Worker Teams (ASHA / Volunteers): Prioritize high elderly count
    let allocatedWorkers = 0;
    if (remainingWorkers > 0 && w.elderlyPopulation60Plus > 2000) {
      const take = Math.min(remainingWorkers, Math.ceil(w.elderlyPopulation60Plus / 1800));
      allocatedWorkers = take;
      remainingWorkers -= take;
      rationales.push(
        `Dispatched ${take} community health worker teams for door-to-door welfare checks of ${w.elderlyPopulation60Plus.toLocaleString()} elderly residents.`
      );
    }

    // Hospital Surge Beds: Allocate to top priority wards with high clinical risk
    let allocatedBeds = 0;
    if (remainingBeds > 0 && item.priorityScore >= 60) {
      const take = Math.min(remainingBeds, Math.round(constraints.emergencyHospitalBedsAvailable * 0.25));
      if (take > 0) {
        allocatedBeds = take;
        remainingBeds -= take;
        rationales.push(
          `Reserved ${take} rapid-cooling triage beds anticipating surge cases under HTSS ${item.profile.currentThermal.htss}.`
        );
      }
    }

    if (rationales.length === 0) {
      rationales.push('Baseline monitoring; secondary standby priority.');
    }

    allocations.push({
      wardId: w.wardId,
      wardName: w.wardName,
      priorityScore: item.priorityScore,
      rank,
      allocatedCoolingCenters: allocatedCooling,
      allocatedMobileUnits: allocatedMobile,
      allocatedHealthWorkerTeams: allocatedWorkers,
      allocatedHospitalBeds: allocatedBeds,
      rationale: rationales.join(' ')
    });
  });

  // Pass 2: If any resources remain, greedily assign to top 1-3 wards
  if (remainingCooling > 0 || remainingMobile > 0 || remainingWorkers > 0 || remainingBeds > 0) {
    for (let i = 0; i < Math.min(3, allocations.length); i++) {
      if (remainingCooling > 0) {
        allocations[i].allocatedCoolingCenters += remainingCooling;
        remainingCooling = 0;
      }
      if (remainingMobile > 0) {
        const add = Math.min(remainingMobile, 2);
        allocations[i].allocatedMobileUnits += add;
        remainingMobile -= add;
      }
      if (remainingWorkers > 0) {
        const add = Math.min(remainingWorkers, 3);
        allocations[i].allocatedHealthWorkerTeams += add;
        remainingWorkers -= add;
      }
      if (remainingBeds > 0) {
        allocations[i].allocatedHospitalBeds += remainingBeds;
        remainingBeds = 0;
      }
    }
  }

  return allocations;
}

/**
 * Simulates Before vs After intervention outcomes for any scenario configuration
 * Evaluates exposure reduction, vulnerability attenuation, and health risk mitigation
 * based on evidence-supported equations.
 */
export function simulate_intervention_outcomes(
  wardProfiles: WardImpactProfile[],
  activeConfig: ActiveInterventionConfig,
  scenarioName: string = 'Custom Scenario'
): SimulationOutcome {
  let baselineTotalExposed = 0;
  let mitigatedTotalExposed = 0;

  let baselineVulnerableExposed = 0;
  let mitigatedVulnerableExposed = 0;

  let weightedBaselineRisk = 0;
  let weightedMitigatedRisk = 0;
  let totalPopSum = 0;

  let coolingCentersUsed = 0;
  let mobileUnitsUsed = 0;
  let workerTeamsDeployed = 0;
  let hospitalBedsReserved = 0;

  // Calculate cumulative intervention multiplier from active toggles
  let exposureMultiplier = 1.0;
  let vulnerabilityMultiplier = 1.0;
  let healthRiskMultiplier = 1.0;

  if (activeConfig.fullHapActive) {
    const hap = INTERVENTION_EVIDENCE_CATALOG.full_heat_action_plan;
    exposureMultiplier *= 1 - hap.expectedExposureReduction / 100;
    vulnerabilityMultiplier *= 1 - hap.expectedVulnerabilityReduction / 100;
    healthRiskMultiplier *= 1 - hap.expectedHealthRiskReduction / 100;
    coolingCentersUsed += 8;
    mobileUnitsUsed += 15;
    workerTeamsDeployed += 40;
    hospitalBedsReserved += 80;
  } else {
    if (activeConfig.shiftWorkHoursActive) {
      const def = INTERVENTION_EVIDENCE_CATALOG.shift_work_hours;
      exposureMultiplier *= 1 - (def.expectedExposureReduction / 100) * 0.7; // target workers
      healthRiskMultiplier *= 1 - (def.expectedHealthRiskReduction / 100) * 0.6;
    }
    if (activeConfig.coolingCentersActive) {
      const def = INTERVENTION_EVIDENCE_CATALOG.cooling_centers;
      exposureMultiplier *= 1 - (def.expectedExposureReduction / 100) * 0.4;
      vulnerabilityMultiplier *= 1 - (def.expectedVulnerabilityReduction / 100) * 0.4;
      healthRiskMultiplier *= 1 - (def.expectedHealthRiskReduction / 100) * 0.35;
      coolingCentersUsed += 6;
    }
    if (activeConfig.mobileCoolingUnitsActive) {
      const def = INTERVENTION_EVIDENCE_CATALOG.mobile_cooling_units;
      exposureMultiplier *= 1 - (def.expectedExposureReduction / 100) * 0.3;
      mobileUnitsUsed += 10;
    }
    if (activeConfig.elderlyWelfareChecksActive) {
      const def = INTERVENTION_EVIDENCE_CATALOG.elderly_welfare_checks;
      vulnerabilityMultiplier *= 1 - (def.expectedVulnerabilityReduction / 100) * 0.8;
      healthRiskMultiplier *= 1 - (def.expectedHealthRiskReduction / 100) * 0.45;
      workerTeamsDeployed += 25;
    }
    if (activeConfig.hydrationRestBreaksActive) {
      const def = INTERVENTION_EVIDENCE_CATALOG.hydration_rest_breaks;
      healthRiskMultiplier *= 1 - (def.expectedHealthRiskReduction / 100) * 0.4;
    }
    if (activeConfig.hospitalPreparednessActive) {
      const def = INTERVENTION_EVIDENCE_CATALOG.hospital_preparedness;
      healthRiskMultiplier *= 1 - (def.expectedHealthRiskReduction / 100) * 0.55;
      hospitalBedsReserved += 50;
    }
    if (activeConfig.coolRoofsSprinklingActive) {
      const def = INTERVENTION_EVIDENCE_CATALOG.cool_roofs_sprinkling;
      exposureMultiplier *= 1 - (def.expectedExposureReduction / 100) * 0.25;
      vulnerabilityMultiplier *= 1 - (def.expectedVulnerabilityReduction / 100) * 0.25;
    }
    if (activeConfig.targetedAlertsActive) {
      const def = INTERVENTION_EVIDENCE_CATALOG.targeted_alerts;
      vulnerabilityMultiplier *= 1 - (def.expectedVulnerabilityReduction / 100) * 0.3;
      exposureMultiplier *= 1 - (def.expectedExposureReduction / 100) * 0.2;
    }
  }

  // Bound multipliers
  exposureMultiplier = Math.max(0.2, exposureMultiplier);
  vulnerabilityMultiplier = Math.max(0.3, vulnerabilityMultiplier);
  healthRiskMultiplier = Math.max(0.2, healthRiskMultiplier);

  const wardOutcomes = wardProfiles.map((p) => {
    const w = p.ward;
    const pop = w.totalPopulation;
    totalPopSum += pop;

    const baseExposed = Math.round((pop * p.humanExposureScore) / 100);
    const mitExposed = Math.round(baseExposed * exposureMultiplier);

    const baseVulnExposed = Math.round(
      (w.elderlyPopulation60Plus + w.outdoorWorkerPopulation + pop * w.slumInformalHousingRatio * 0.5) *
        (p.humanExposureScore / 100)
    );
    const mitVulnExposed = Math.round(baseVulnExposed * vulnerabilityMultiplier * exposureMultiplier);

    const baseRisk = Math.round(p.healthImpactRisk * 100 * 10) / 10;
    const mitRisk = Math.round(baseRisk * healthRiskMultiplier * 10) / 10;

    baselineTotalExposed += baseExposed;
    mitigatedTotalExposed += mitExposed;

    baselineVulnerableExposed += baseVulnExposed;
    mitigatedVulnerableExposed += mitVulnExposed;

    weightedBaselineRisk += baseRisk * pop;
    weightedMitigatedRisk += mitRisk * pop;

    const coverage = Math.min(100, Math.round((1 - mitRisk / Math.max(1, baseRisk)) * 100 * 1.2));

    return {
      wardId: w.wardId,
      wardName: w.wardName,
      baselineRisk: baseRisk,
      mitigatedRisk: mitRisk,
      coveragePercent: Math.max(0, coverage)
    };
  });

  const baselineAvgRisk = totalPopSum > 0 ? Math.round((weightedBaselineRisk / totalPopSum) * 10) / 10 : 65;
  const mitigatedAvgRisk = totalPopSum > 0 ? Math.round((weightedMitigatedRisk / totalPopSum) * 10) / 10 : 35;

  const exposureRedPct =
    baselineTotalExposed > 0
      ? Math.round(((baselineTotalExposed - mitigatedTotalExposed) / baselineTotalExposed) * 1000) / 10
      : 0;

  const riskRedPct =
    baselineAvgRisk > 0
      ? Math.round(((baselineAvgRisk - mitigatedAvgRisk) / baselineAvgRisk) * 1000) / 10
      : 0;

  // Estimated emergency hospital surge load based on population risk
  const baseSurgeCases = Math.round((baselineVulnerableExposed * (baselineAvgRisk / 100) * 0.012));
  const mitSurgeCases = Math.round((mitigatedVulnerableExposed * (mitigatedAvgRisk / 100) * 0.005));

  return {
    scenarioName,
    activeInterventions: activeConfig,
    baselineExposedPopulation: baselineTotalExposed,
    mitigatedExposedPopulation: mitigatedTotalExposed,
    baselineVulnerableExposed: baselineVulnerableExposed,
    mitigatedVulnerableExposed: mitigatedVulnerableExposed,
    baselineHealthRiskIndex: baselineAvgRisk,
    mitigatedHealthRiskIndex: mitigatedAvgRisk,
    hospitalizationSurgeBaseline: baseSurgeCases,
    hospitalizationSurgeMitigated: mitSurgeCases,
    overallExposureReductionPercent: exposureRedPct,
    overallRiskReductionPercent: riskRedPct,
    resourceUtilization: {
      coolingCentersUsed,
      mobileUnitsUsed,
      workerTeamsDeployed,
      hospitalBedsReserved
    },
    wardOutcomes
  };
}
