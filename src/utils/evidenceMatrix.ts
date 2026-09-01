/**
 * Evidence-Based Intervention Matrix
 * Contains documented peer-reviewed literature, empirical Ahmedabad Heat Action Plan (HAP) benchmarks,
 * Lancet Countdown on Health and Climate Change, and WHO/WMO guidance parameters.
 */

import { InterventionDefinition, InterventionType } from '../types';

export const INTERVENTION_EVIDENCE_CATALOG: Record<InterventionType, InterventionDefinition> = {
  cooling_centers: {
    id: 'cooling_centers',
    title: 'Open Air-Conditioned / Misted Cooling Centers',
    category: 'Infrastructure',
    description:
      'Activate air-conditioned community halls, libraries, religious centers, and shaded misted shelters with drinking water and oral rehydration salts.',
    targetPopulation: 'Elderly, homeless individuals, slum dwellers, street vendors, delivery riders within 1.5 km radius.',
    expectedExposureReduction: 38, // 38% reduction in peak outdoor exposure for attendees
    expectedVulnerabilityReduction: 25,
    expectedHealthRiskReduction: 32,
    unitCostOrEffort: '₹12,000 / day per center (Electricity, ORS supplies, staffing)',
    evidenceSource:
      'Lancet Planetary Health (2021); Ahmedabad Heat Action Plan (2013-2023 Evaluation); CDC Cooling Center Guidance',
    confidence: 'High',
    assumptions: [
      'Each designated cooling facility accommodates 150-300 people concurrently.',
      'Effective catchment radius is 1.0 - 1.5 km in dense urban settlements.',
      'Public transit accessibility and clear multilingual signage increase uptake by 40%.'
    ]
  },
  shift_work_hours: {
    id: 'shift_work_hours',
    title: 'Shift Outdoor Work Hours (Mandatory Staggering)',
    category: 'Occupational',
    description:
      'Enforce municipal labour mandate shifting outdoor construction, masonry, sanitation, and street vending hours to early morning (06:00-11:00) and late afternoon (16:30-19:30).',
    targetPopulation: 'Construction laborers, agricultural workers, municipal sanitation staff, delivery gig workers.',
    expectedExposureReduction: 68, // 68% reduction in peak diurnal UTCI thermal exposure
    expectedVulnerabilityReduction: 30,
    expectedHealthRiskReduction: 55,
    unitCostOrEffort: 'Regulatory enforcement + municipal inspection patrols',
    evidenceSource:
      'ILO Working on a Warmer Planet (2019); National Disaster Management Authority (NDMA) Heat Guidelines 2022',
    confidence: 'High',
    assumptions: [
      'Employers provide shaded rest areas with cool drinking water during operating hours.',
      'Enforcement compliance in formal construction sites estimated at 80-90%; informal sector requires mobile verification.'
    ]
  },
  hydration_rest_breaks: {
    id: 'hydration_rest_breaks',
    title: 'Mandatory Hydration & 15-Min Hourly Rest Cycles',
    category: 'Occupational',
    description:
      'Institute mandatory 15-minute rest breaks in shade for every 45 minutes of physical labor under WBGT > 30°C, combined with electrolyte replenishment.',
    targetPopulation: 'Industrial workers, traffic police, brick kiln workers, delivery agents.',
    expectedExposureReduction: 28,
    expectedVulnerabilityReduction: 35,
    expectedHealthRiskReduction: 42,
    unitCostOrEffort: '₹15 / worker/day (ORS packets & water tankers)',
    evidenceSource:
      'NIOSH Occupational Exposure to Heat and Hot Environments; Kjellstrom et al. (2016) Occupational Environmental Medicine',
    confidence: 'High',
    assumptions: [
      'Frequent hydration prevents acute kidney injury (AKI) and exertional heat exhaustion.',
      'Shaded rest allows core body temperature to dissipate below the 38.0°C danger threshold.'
    ]
  },
  targeted_alerts: {
    id: 'targeted_alerts',
    title: 'Hyper-Local Geotargeted SMS & WhatsApp Alerts',
    category: 'Community',
    description:
      'Broadcast location-specific, vernacular warning alerts to mobile devices in high-risk wards 24-48 hours before peak thermal stress.',
    targetPopulation: 'General urban populace, informal workers, care home managers, school administrators.',
    expectedExposureReduction: 18,
    expectedVulnerabilityReduction: 22,
    expectedHealthRiskReduction: 20,
    unitCostOrEffort: '₹0.12 per SMS broadcast via State Disaster Management Portal',
    evidenceSource:
      'WMO Guidelines on Multi-hazard Early Warning Systems; Hess et al. (2018) Public Health Early Action Evaluation',
    confidence: 'Moderate',
    assumptions: [
      'Advisories prompt self-directed behavioral adaptation (staying indoors, closing west-facing blinds, increased fluid intake).',
      'Actionable checklist messages reduce panic and unnecessary ER overcrowding.'
    ]
  },
  elderly_welfare_checks: {
    id: 'elderly_welfare_checks',
    title: 'Door-to-Door Elderly & High-Risk Welfare Verification',
    category: 'Community',
    description:
      'Mobilize ASHA workers, Anganwadi staff, and community volunteers to visit isolated senior citizens, chronically ill patients, and bedridden residents.',
    targetPopulation: 'Residents aged 60+, cardiovascular & respiratory patients, isolated single-occupancy households.',
    expectedExposureReduction: 15,
    expectedVulnerabilityReduction: 48,
    expectedHealthRiskReduction: 50,
    unitCostOrEffort: '₹500 / team stipend / day (ASHA / volunteer deployment)',
    evidenceSource:
      'Bouchama et al. (2007) Prognostic Factors in Heatstroke; European Heat Health Action Plan Best Practices (WHO Europe)',
    confidence: 'High',
    assumptions: [
      'Early detection of delirium, dehydration, or pre-heatstroke symptoms allows home or sub-center rehydration before severe multiorgan failure.',
      'Active verification that cooling fans or cross-ventilation are functional.'
    ]
  },
  hospital_preparedness: {
    id: 'hospital_preparedness',
    title: 'Hospital Emergency Surge & Heatstroke Triage Protocol',
    category: 'Clinical',
    description:
      'Reserve dedicated emergency cooling beds with ice-water immersion tubs, pre-chill IV saline bags to 4°C, stock IV fluids/ORS, and cancel non-urgent elective admissions.',
    targetPopulation: 'Severe heat exhaustion, heat stroke, syncope, and acute cardiovascular decompensation cases.',
    expectedExposureReduction: 0, // Does not reduce environmental exposure, but drastically reduces case fatality
    expectedVulnerabilityReduction: 30,
    expectedHealthRiskReduction: 60,
    unitCostOrEffort: '₹45,000 / hospital ward activation (Ice supplies, rapid cooling tubs, fluid stock)',
    evidenceSource:
      'Indian Public Health Standards (IPHS) Heatwave Preparedness Guidelines 2023; Casa et al. (2015) Heat Stroke Prehospital Protocol',
    confidence: 'High',
    assumptions: [
      'Rapid immersion or evaporative cooling within the first 30 minutes lowers heatstroke mortality from >50% to <5%.',
      'Designated ambulance fast-lanes with onboard active cooling.'
    ]
  },
  mobile_cooling_units: {
    id: 'mobile_cooling_units',
    title: 'Deploy Mobile Misting Vans & Drinking Water Tankers',
    category: 'Infrastructure',
    description:
      'Station municipal water tankers with high-pressure evaporative misting canopies and free chilled ORS distribution at transit hubs, street markets, and slum clusters.',
    targetPopulation: 'Commuters, street vendors, rickshaw drivers, auto-rickshaw stands, open-air bus terminals.',
    expectedExposureReduction: 32,
    expectedVulnerabilityReduction: 20,
    expectedHealthRiskReduction: 28,
    unitCostOrEffort: '₹3,500 / day per mobile mist tanker',
    evidenceSource:
      'Ahmedabad Municipal Corporation Pilot Misting Stations (2018-2022); Tokyo Metropolitan Heat Island Mitigation Trials',
    confidence: 'Evidence-Based Model',
    assumptions: [
      'Misting provides an immediate microclimatic surface and air cooling of 2.0°C to 4.5°C within the canopy zone.',
      'High footfall locations capture transitory populations who cannot access fixed cooling centers.'
    ]
  },
  cool_roofs_sprinkling: {
    id: 'cool_roofs_sprinkling',
    title: 'High-Albedo Cool Roofs & Major Corridor Water Sprinkling',
    category: 'Infrastructure',
    description:
      'Deploy solar reflective lime/coating on tin and asbestos slum roofs and water mist tankers on asphalt arterials to suppress radiant urban heat island effect.',
    targetPopulation: 'Residents living in tin/asbestos sheet homes without ceiling insulation; pedestrians along asphalt roads.',
    expectedExposureReduction: 22,
    expectedVulnerabilityReduction: 25,
    expectedHealthRiskReduction: 24,
    unitCostOrEffort: '₹18 / sq. meter coating + municipal road sprinkler deployment',
    evidenceSource:
      'NRDC & IIPH-G Cool Roofs Program Assessment (2020); Garg et al. (2016) Building and Environment',
    confidence: 'High',
    assumptions: [
      'Reflective coatings drop indoor ceiling temperatures by 2°C to 5°C in low-income housing.',
      'Road wetting dampens sensible heat flux and fugitive dust.'
    ]
  },
  full_heat_action_plan: {
    id: 'full_heat_action_plan',
    title: 'Comprehensive Heat Action Plan (Full NDMA/IMD Red Alert Trigger)',
    category: 'Policy',
    description:
      'Simultaneous multi-sectoral mobilization: cooling centers + work shifts + hospital triage + ASHA checks + traffic signal cooling mists + inter-agency disaster cell coordination.',
    targetPopulation: 'Entire municipal population across all zones and demographic segments.',
    expectedExposureReduction: 52,
    expectedVulnerabilityReduction: 45,
    expectedHealthRiskReduction: 68,
    unitCostOrEffort: 'Comprehensive disaster fund allocation (₹1.5 - ₹3.5 Lakh / ward / 3-day wave)',
    evidenceSource:
      'Knowlton et al. (2014) Ahmedabad Heat Action Plan Avoided Mortality Evaluation (Estimated 1,190 avoided deaths/year)',
    confidence: 'High',
    assumptions: [
      'Coordinated synergies between health, labor, transport, and municipal water supply amplify individual intervention gains.',
      'Real-time central command dashboard ensures zero-latency resource reallocation.'
    ]
  }
};
