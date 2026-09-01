import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { INDIAN_CITIES } from './src/data/cityData';
import { fetchLiveCityWeather, processCityWardImpactProfiles } from './src/services/weatherApi';
import { optimize_resource_allocation, simulate_intervention_outcomes } from './src/utils/optimizationEngine';
import { ActiveInterventionConfig, ResourceConstraints } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini API Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'HeatShield AI Operational Server',
    timestamp: new Date().toISOString(),
    citiesAvailable: INDIAN_CITIES.map((c) => ({ id: c.id, name: c.name, state: c.state }))
  });
});

// 2. Live Weather & Ward Impact Profiles for a selected city
app.get('/api/weather/city-impact', async (req, res) => {
  try {
    const cityId = (req.query.city as string) || 'ahmedabad';
    const city = INDIAN_CITIES.find((c) => c.id.toLowerCase() === cityId.toLowerCase()) || INDIAN_CITIES[0];

    const rawWeather = await fetchLiveCityWeather(city);
    const wardProfiles = processCityWardImpactProfiles(city, rawWeather);

    res.json({
      city: {
        id: city.id,
        name: city.name,
        state: city.state,
        lat: city.lat,
        lng: city.lng,
        baselineHistoricalMortalityThreshold: city.baselineHistoricalMortalityThreshold
      },
      rawAtmospheric: {
        hourlyTimes: rawWeather.hourly.time.slice(0, 120),
        hourlyTemps: rawWeather.hourly.temperature_2m.slice(0, 120),
        hourlyRh: rawWeather.hourly.relative_humidity_2m.slice(0, 120),
        hourlyWind: rawWeather.hourly.wind_speed_10m.slice(0, 120),
        hourlySolar: rawWeather.hourly.direct_normal_irradiance?.slice(0, 120) || []
      },
      dailyForecast: rawWeather.daily,
      wardProfiles
    });
  } catch (error) {
    console.error('Error calculating city impact:', error);
    res.status(500).json({ error: 'Failed to process city impact profiles' });
  }
});

// 3. Resource Optimization Endpoint
app.post('/api/optimize-resources', (req, res) => {
  try {
    const { wardProfiles, constraints }: { wardProfiles: any[]; constraints: ResourceConstraints } = req.body;
    if (!wardProfiles || !constraints) {
      return res.status(400).json({ error: 'Missing wardProfiles or constraints in body' });
    }

    const allocations = optimize_resource_allocation(wardProfiles, constraints);
    res.json({ allocations });
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ error: 'Failed to run resource optimization' });
  }
});

// 4. Scenario Simulation Endpoint
app.post('/api/simulate-scenario', (req, res) => {
  try {
    const {
      wardProfiles,
      activeConfig,
      scenarioName
    }: {
      wardProfiles: any[];
      activeConfig: ActiveInterventionConfig;
      scenarioName?: string;
    } = req.body;

    if (!wardProfiles || !activeConfig) {
      return res.status(400).json({ error: 'Missing wardProfiles or activeConfig in body' });
    }

    const outcome = simulate_intervention_outcomes(wardProfiles, activeConfig, scenarioName || 'Custom Simulation');
    res.json({ outcome });
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: 'Failed to simulate scenario' });
  }
});

// 5. Gemini AI synthesis: Municipal Heat Action Plan & Official SOP Directives
app.post('/api/gemini/generate-action-plan', async (req, res) => {
  try {
    const { cityName, peakTemp, maxUtci, topWards, actionWindowHours } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Deterministic evidence-based fallback if API key is not configured
      return res.json({
        plan: `MUNICIPAL HEAT ACTION PLAN (RED ALERT PROTOCOL) - ${cityName.toUpperCase()}
1. EXECUTIVE DIRECTIVE: Critical thermal stress (UTCI ${maxUtci}°C, Peak ${peakTemp}°C) expected in ${actionWindowHours} hours.
2. PRIORITY WARDS: ${topWards.join(', ')}.
3. OPERATIONAL ORDERS:
   - Municipal Labour Dept: Enforce mandatory cessation of outdoor construction between 11:30 and 16:30.
   - Public Health Dept: Pre-chill IV saline bags, reserve dedicated heatstroke triage beds at Civil Hospital.
   - Water Works: Station 12 mobile water mist tankers at transit hubs and slum clusters.
   - Community Welfare: Mobilize ASHA worker door-to-door welfare verification for senior citizens.`
      });
    }

    const prompt = `You are the Principal Disaster Risk Management Consultant for the National Disaster Management Authority (NDMA) and ${cityName} Municipal Corporation.
Given the following real-time predictive heat impact data:
- City: ${cityName}
- Forecast Peak Temperature: ${peakTemp}°C
- Forecast Universal Thermal Climate Index (UTCI): ${maxUtci}°C (Extreme Physiological Heat Stress)
- Critical Action Window: ${actionWindowHours} hours remaining until peak stress
- Top Vulnerable Wards: ${topWards.join(', ')}

Synthesize a strict, actionable, evidence-based Heat Action Plan (HAP) Standard Operating Procedure (SOP) with 4 key sections:
1. EXECUTIVE COMMAND DIRECTIVE & TIMELINE
2. OCCUPATIONAL & LABOUR MANDATES (Specific work shift hours and penalties)
3. CLINICAL & HOSPITAL EMERGENCY PREPAREDNESS (Specific triage and cooling tub protocols)
4. VULNERABLE POPULATION & SLUM CORRIDOR INTERVENTIONS (Cooling centers, misting vans, ASHA door checks)

Keep it formal, highly operational, and concise.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt
    });

    res.json({ plan: response.text });
  } catch (error) {
    console.error('Gemini Action Plan Generation error:', error);
    res.status(500).json({ error: 'Failed to generate AI action plan' });
  }
});

// 6. Gemini AI synthesis: Multilingual Persona-Targeted Emergency Alert
app.post('/api/gemini/generate-targeted-alert', async (req, res) => {
  try {
    const { cityName, wardName, persona, utci, maxTemp, actionWindowText } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        en: `URGENT HEAT WARNING (${cityName} - ${wardName}): Extreme thermal stress (UTCI ${utci}°C, ${maxTemp}°C). ${persona} must avoid direct sun between 11 AM - 4 PM. Drink ORS/buttermilk frequently. Action window: ${actionWindowText}.`,
        hi: `अत्यधिक गर्मी की चेतावनी (${cityName} - ${wardName}): तापमान ${maxTemp}°C और अत्यधिक लू का प्रकोप। ${persona} दोपहर 11 से 4 बजे के बीच सीधे धूप में न निकलें। भरपूर पानी और ओआरएस पिएं।`,
        regional: `అత్యవసర వేడి హెచ్చరిక (${cityName} - ${wardName}): అత్యధిక ఉష్ణోగ్రత (${maxTemp}°C). ఉదయం 11 నుండి సాయంత్రం 4 గంటల వరకు ఎండలో తిరగవద్దు. పుష్కలంగా నీరు, ఓఆర్ఎస్ త్రాగండి.`
      });
    }

    const prompt = `Generate an urgent, compassionate, and actionable public emergency heat alert tailored specifically for:
Target Persona: ${persona}
Location: ${wardName}, ${cityName}
Current UTCI: ${utci}°C
Max Temperature: ${maxTemp}°C
Action Window: ${actionWindowText}

Return a JSON object with 3 keys:
- "en": English message under 45 words with clear actionable bullet points.
- "hi": Hindi translation (Devanagari script) under 45 words.
- "regional": Vernacular translation (Hindi / Telugu / Gujarati / Tamil appropriate for ${cityName}) under 45 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error) {
    console.error('Gemini Targeted Alert error:', error);
    res.status(500).json({ error: 'Failed to generate targeted alert' });
  }
});

// In-memory alert registry for active session broadcasts
interface ActiveAlertRecord {
  id: string;
  wardId: string;
  wardName: string;
  cityName: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  headline: string;
  channels: ('sms' | 'whatsapp' | 'siren' | 'app')[];
  targetGroup: string;
  dispatchedAt: string;
  recipientCount: number;
  deliveryStatus: 'delivered' | 'broadcasting' | 'queued';
  languages: {
    en: string;
    hi: string;
    regional: string;
  };
}

const inMemoryAlerts: ActiveAlertRecord[] = [
  {
    id: 'alt-init-1',
    wardId: 'amd-w18',
    wardName: 'Ward 18 - Bapunagar (Industrial Hub)',
    cityName: 'Ahmedabad',
    severity: 'EXTREME',
    headline: 'Red Alert: Extreme UTCI Thermal Strain Predicted (44.8°C)',
    channels: ['sms', 'whatsapp'],
    targetGroup: 'Outdoor Workers & Construction Sites',
    dispatchedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    recipientCount: 34200,
    deliveryStatus: 'delivered',
    languages: {
      en: 'RED ALERT: Cease outdoor labour between 11:30 AM - 4:30 PM. Drink 500ml water/ORS hourly. Emergency cooling centers active.',
      hi: 'रेड अलर्ट: दोपहर 11:30 से 4:30 के बीच खुले में काम बंद करें। हर घंटे पानी/ओआरएस पिएं। आपातकालीन कूलिंग केंद्र सक्रिय हैं।',
      regional: 'લાલ ચેતવણી: બપોરે ૧૧:૩૦ થી ૪:૩૦ વચ્ચે બહાર કામ બંધ કરો. દર કલાકે પાણી/ORS પીવો.'
    }
  }
];

// Alert API Endpoints
app.get('/api/alerts', (req, res) => {
  const cityName = req.query.city as string;
  const wardId = req.query.ward as string;

  let filtered = [...inMemoryAlerts];
  if (cityName) {
    filtered = filtered.filter((a) => a.cityName.toLowerCase() === cityName.toLowerCase());
  }
  if (wardId) {
    filtered = filtered.filter((a) => a.wardId.toLowerCase() === wardId.toLowerCase());
  }

  res.json({ alerts: filtered, total: filtered.length });
});

app.post('/api/alerts/create', (req, res) => {
  try {
    const alertData = req.body;
    const newAlert: ActiveAlertRecord = {
      id: `alt-${Date.now()}`,
      wardId: alertData.wardId || 'all-wards',
      wardName: alertData.wardName || 'Citywide',
      cityName: alertData.cityName || 'Ahmedabad',
      severity: alertData.severity || 'HIGH',
      headline: alertData.headline || 'Urgent Heat Health Advisory',
      channels: alertData.channels || ['sms', 'whatsapp'],
      targetGroup: alertData.targetGroup || 'All Citizens',
      dispatchedAt: new Date().toISOString(),
      recipientCount: alertData.recipientCount || 25000,
      deliveryStatus: 'delivered',
      languages: alertData.languages || {
        en: alertData.messageEn || 'Heat advisory in effect.',
        hi: alertData.messageHi || 'गर्मी की चेतावनी जारी।',
        regional: alertData.messageRegional || 'ગરમીની ચેતવણી.'
      }
    };

    inMemoryAlerts.unshift(newAlert);
    res.json({ status: 'ok', alert: newAlert });
  } catch (err) {
    console.error('Alert creation error:', err);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

app.post('/api/alerts/send', (req, res) => {
  try {
    const { alertId, channels, recipientsCount } = req.body;
    const existing = inMemoryAlerts.find((a) => a.id === alertId);
    if (existing) {
      existing.deliveryStatus = 'delivered';
      existing.dispatchedAt = new Date().toISOString();
    }
    res.json({
      status: 'success',
      message: 'Multi-channel heat alert dispatched to gateway',
      channelsBroadcast: channels || ['sms', 'whatsapp'],
      estimatedRecipientsReached: recipientsCount || 42000,
      timestamp: new Date().toISOString(),
      mode: 'Demonstration / Operational Gateway Ready'
    });
  } catch (err) {
    console.error('Alert dispatch error:', err);
    res.status(500).json({ error: 'Failed to dispatch alert' });
  }
});

// Setup Vite or Static File Serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HeatShield AI Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
