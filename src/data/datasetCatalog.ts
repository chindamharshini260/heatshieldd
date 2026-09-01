export interface DatasetEntry {
  id: string;
  name: string;
  source: string;
  variables: string[];
  spatialResolution: string;
  dateRange: string;
  updateFrequency: string;
  license: string;
}

export const DATASET_CATALOG: DatasetEntry[] = [
  {
    id: 'open_meteo_forecast',
    name: 'Open-Meteo Seamless Weather Forecast API',
    source: 'Open-Meteo GmbH (ECMWF IFS / GFS / ICON Ensemble)',
    variables: [
      'temperature_2m (°C)',
      'relative_humidity_2m (%)',
      'wind_speed_10m (km/h)',
      'direct_normal_irradiance (W/m²)',
      'apparent_temperature (°C)',
      'dew_point_2m (°C)'
    ],
    spatialResolution: '1.0 km - 9.0 km downscaled',
    dateRange: 'Real-time live stream + 7-day hourly forecast',
    updateFrequency: 'Hourly (Automated)',
    license: 'Open Database License (ODbL) / CC-BY 4.0'
  },
  {
    id: 'census_india_demographics',
    name: 'Census of India - Municipal Ward Profiles',
    source: 'Office of the Registrar General & Census Commissioner, India',
    variables: [
      'Ward population density (per km²)',
      'Elderly population (Age 60+ count and ratio)',
      'Informal / Slum settlement household ratio',
      'Informal outdoor labor workforce ratio'
    ],
    spatialResolution: 'Administrative Municipal Ward Level',
    dateRange: '2011 Census + 2024 Urban Municipal Projections',
    updateFrequency: 'Decadal / Annual Municipal Projections',
    license: 'Government Open Data License - India (GODL)'
  },
  {
    id: 'isro_bhuvan_uhi',
    name: 'ISRO Bhuvan & Landsat-8/9 Thermal Infrared Layers',
    source: 'National Remote Sensing Centre (NRSC) / ISRO & USGS Landsat',
    variables: [
      'Normalized Difference Vegetation Index (NDVI)',
      'Impervious Surface & Concrete Built-up Area Ratio',
      'Land Surface Temperature (LST °C)',
      'Urban Heat Island (UHI) Thermal Trapping Factor'
    ],
    spatialResolution: '30m - 100m spatial grid',
    dateRange: 'Multi-year seasonal thermal archives',
    updateFrequency: '16-day orbital repeat',
    license: 'Public Domain / ISRO Bhuvan Open Access'
  },
  {
    id: 'osm_municipal_infrastructure',
    name: 'OpenStreetMap (OSM) Municipal Infrastructure',
    source: 'OpenStreetMap Contributors & Urban Local Bodies (ULBs)',
    variables: [
      'Primary Health Centers (PHCs) & Civil Hospitals',
      'Designated Community Shelters & Night Halls',
      'Public Drinking Water Booths & Hydration Points',
      'Major Arterial Transit Terminals & Construction Zones'
    ],
    spatialResolution: 'Point-of-Interest & Polygon Geometries',
    dateRange: 'Continuously updated',
    updateFrequency: 'Real-time community edits',
    license: 'Open Data Commons Open Database License (ODbL)'
  },
  {
    id: 'ahmedabad_hap_evidence',
    name: 'Ahmedabad Heat Action Plan & Lancet Planetary Health Benchmarks',
    source: 'Ahmedabad Municipal Corporation, IIPH-Gandhinagar, NRDC & Lancet',
    variables: [
      'Baseline daily all-cause mortality threshold (41.0°C)',
      'Intervention effect sizes (Cooling centers -35% risk, Work shifts -65% exertional collapse)',
      'Hospital emergency surge lag factors (Lag 0d to Lag 5d)'
    ],
    spatialResolution: 'Municipal Metropolitan Area',
    dateRange: '2010–2024 longitudinal epidemiological cohorts',
    updateFrequency: 'Annual peer-reviewed epidemiological audits',
    license: 'Academic & Public Health Open Access'
  }
];
