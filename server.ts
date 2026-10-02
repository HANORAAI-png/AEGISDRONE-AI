import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Google GenAI if key available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'operational',
    aiEnabled: Boolean(ai && process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 1. AI Scenario Generator
app.post('/api/ai/scenario', async (req: Request, res: Response) => {
  const { environment, time, weather, difficulty, objectCount, objective } = req.body;

  if (ai) {
    try {
      const prompt = `You are the Lead Tactical Training Instructor for AegisDrone AI, a software-only training and simulation platform for security and defence operators.
Generate a realistic, immersive simulation scenario briefing for a training session.
Context parameters:
- Environment: ${environment || 'Airport Perimeter'}
- Time of Day: ${time || 'Night'}
- Weather: ${weather || 'Foggy'}
- Difficulty Level: ${difficulty || 'Advanced'}
- Number of simulated aerial targets: ${objectCount || 3}
- Primary Training Objective: ${objective || 'Multi-object Monitoring'}

Requirements:
1. Provide a scenario title, tactical codename, scenario ID, and detailed 3-sentence operational context.
2. Provide key surveillance challenges caused by the environment and weather.
3. List primary training objectives for the trainee.
4. Keep all responses strictly safe and abstract: focused purely on observation, radar/optical sensor fusion, restricted airspace compliance, and security reporting. No weaponization, no jamming, no interception, no real-world destructive instructions.

Respond strictly in valid JSON format:
{
  "scenarioId": "SCN-...",
  "codename": "...",
  "title": "...",
  "description": "...",
  "visibilityKm": 1.2,
  "sensorDegradation": "Moderate RF clutter and optical obscuration",
  "tacticalDirectives": ["Directive 1", "Directive 2", "Directive 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, source: 'gemini-ai' });
      }
    } catch (err) {
      console.warn('Gemini scenario generation fallback:', err);
    }
  }

  // Fallback generation
  const randNum = Math.floor(100 + Math.random() * 900);
  const fallbackScenario = {
    scenarioId: `SCN-${environment?.substring(0, 3).toUpperCase() || 'AIR'}-${randNum}`,
    codename: `OPERATION VANGUARD-${randNum}`,
    title: `${environment || 'Airport Perimeter'} - ${difficulty || 'Advanced'} Surveillance`,
    description: `Tactical radar sensors indicate potential unauthorized low-RCS micro aerial systems navigating towards the ${environment || 'facility'} boundary under ${weather || 'foggy'} conditions at ${time || 'night'}. Trainee must calibrate multi-sensor correlation, track vectors, and execute standard security protocols without false alarms.`,
    visibilityKm: weather === 'Fog' ? 0.8 : weather === 'Rain' ? 2.5 : 8.0,
    sensorDegradation: weather === 'Fog' ? 'High optical diffusion; radar range reduced by 15%' : 'Nominal multi-spectrum fidelity',
    tacticalDirectives: [
      `Maintain continuous radar contact on approach corridor`,
      `Verify identification through simulated optical zoom before zone boundary crossing`,
      `Log telemetry vectors and escalate high-threat anomalies to training supervisor`,
    ],
  };

  return res.json({ success: true, data: fallbackScenario, source: 'simulation-engine' });
});

// 2. AI Threat Assessment
app.post('/api/ai/threat-assess', async (req: Request, res: Response) => {
  const { objectData, environment } = req.body;

  if (ai && objectData) {
    try {
      const prompt = `You are the Tactical AI Co-Pilot for AegisDrone AI counter-drone trainer.
Analyze the following simulated aerial contact and produce an automated threat assessment:
Contact Data:
- ID: ${objectData.id}
- Altitude: ${objectData.altitude} meters
- Speed: ${objectData.speed} m/s
- Distance to facility center: ${objectData.distance} km
- Trajectory: ${objectData.trajectory || 'Inbound'}
- Classification: ${objectData.classification || 'Unknown'}
- Proximity to Restricted Zone: ${objectData.inRestrictedZone ? 'INSIDE RESTRICTED AIRSPACE' : 'Approaching Restricted Boundary'}
- Facility Type: ${environment || 'Critical Infrastructure'}

Provide:
1. Threat Level (strictly one of: "LOW", "MEDIUM", "HIGH")
2. Confidence score (0-100)
3. Bulleted tactical reasons for the threat rating
4. Recommended safe abstract operator response (e.g., Continue monitoring, Request sensor verification, Notify supervisor, Initiate simulated security protocol)

Format response in valid JSON:
{
  "threatLevel": "HIGH",
  "threatScore": 88,
  "reasons": ["Entering restricted training zone", "Persistent high-speed inbound vector", "Unregistered transponder signal"],
  "recommendedAction": "Initiate simulated security protocol"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, source: 'gemini-ai' });
      }
    } catch (err) {
      console.warn('Gemini threat assess fallback:', err);
    }
  }

  // Fallback rule-based threat assessment
  const dist = objectData?.distance || 1.5;
  const inZone = objectData?.inRestrictedZone;
  let level = 'LOW';
  let score = 35;
  const reasons: string[] = [];

  if (inZone || dist < 0.8) {
    level = 'HIGH';
    score = 88;
    reasons.push('Entering restricted training zone boundary');
    reasons.push('Persistent trajectory directly toward primary asset');
    reasons.push('Zero voluntary transponder broadcast');
  } else if (dist < 1.5) {
    level = 'MEDIUM';
    score = 64;
    reasons.push('Approaching outer perimeter buffer zone');
    reasons.push('Erratic flight pattern anomaly detected');
  } else {
    level = 'LOW';
    score = 28;
    reasons.push('Operating outside active warning threshold');
    reasons.push('Constant tangential vector away from asset center');
  }

  return res.json({
    success: true,
    data: {
      threatLevel: level,
      threatScore: score,
      reasons,
      recommendedAction: level === 'HIGH' ? 'Initiate simulated security protocol' : level === 'MEDIUM' ? 'Request additional simulated sensor data' : 'Continue monitoring',
    },
    source: 'rule-engine',
  });
});

// 3. AI Performance Evaluation & Instructor Feedback
app.post('/api/ai/evaluate', async (req: Request, res: Response) => {
  const { sessionStats, traineeName, scenarioName } = req.body;

  if (ai) {
    try {
      const prompt = `You are a Senior Defence Simulation Instructor evaluating a trainee on the AegisDrone AI trainer.
Session data for trainee ${traineeName || 'Operator 001'}:
- Scenario: ${scenarioName || 'Airport Perimeter - Advanced'}
- Detection Accuracy: ${sessionStats?.detectionAccuracy || 88}%
- Identification Accuracy: ${sessionStats?.identificationAccuracy || 82}%
- Tracking Accuracy: ${sessionStats?.trackingAccuracy || 79}%
- Decision Accuracy: ${sessionStats?.decisionAccuracy || 85}%
- Average Reaction Time: ${sessionStats?.avgReactionTime || 3.4} seconds
- False Alarms: ${sessionStats?.falseAlarms || 0}
- Missed Targets: ${sessionStats?.missedTargets || 0}

Provide:
1. Overall simulated performance score (0-100)
2. 3 Specific Strengths
3. 2 Concrete Areas for Improvement
4. 3 Dynamic Instructor Feedback quotes (concise, tactical, realistic tone)
5. Primary Identified Weakness

Respond strictly in valid JSON:
{
  "overallScore": 86,
  "strengths": ["Rapid initial radar acquisition", "High precision on classification", "Zero false escalations"],
  "areasForImprovement": ["Multi-target prioritization during simultaneous ingress", "Latency in issuing supervisor notifications"],
  "instructorQuotes": [
    "You acquired the lead target quickly, maintaining steady track through RF clutter.",
    "Decisions conformed accurately with standard perimeter rules of engagement.",
    "Your response latency improved by 14% compared to previous baseline."
  ],
  "primaryWeakness": "Multi-object Tracking Under Clutter"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, source: 'gemini-ai' });
      }
    } catch (err) {
      console.warn('Gemini evaluation fallback:', err);
    }
  }

  // Fallback evaluation
  const overall = Math.round(
    ((sessionStats?.detectionAccuracy || 88) * 0.25) +
    ((sessionStats?.identificationAccuracy || 82) * 0.2) +
    ((sessionStats?.trackingAccuracy || 79) * 0.25) +
    ((sessionStats?.decisionAccuracy || 85) * 0.3)
  );

  return res.json({
    success: true,
    data: {
      overallScore: overall,
      strengths: [
        'Rapid initial target radar acquisition',
        'Accurate threat severity categorization',
        'Disciplined avoidance of false alarms',
      ],
      areasForImprovement: [
        'Multi-object tracking under simultaneous azimuth incursions',
        'Reaction speed when transitioning between radar and optical sensors',
      ],
      instructorQuotes: [
        'You detected the primary target rapidly, though initial classification had a minor delay.',
        'Your response decisions were appropriate given the simulated sensor evidence.',
        'Response consistency improved notably over the second half of the exercise.',
      ],
      primaryWeakness: 'Multi-Object Tracking Under Time Pressure',
    },
    source: 'simulation-engine',
  });
});

// 4. Adaptive Training Recommendation
app.post('/api/ai/recommend', async (req: Request, res: Response) => {
  const { currentScore, weakness, currentLevel } = req.body;

  if (ai) {
    try {
      const prompt = `You are the Adaptive Training Engine of AegisDrone AI.
A trainee just completed a training cycle:
- Latest Score: ${currentScore || 82}%
- Identified Weakness: ${weakness || 'Multi-object Prioritization'}
- Current Level: ${currentLevel || 'Intermediate (3/5)'}

Recommend the next calibrated training exercise to address this specific weakness.
If score >= 80%, recommend increasing complexity (more objects, adverse weather, tighter timing).
If score < 80%, recommend targeted reinforcement practice with focused cues.

Return JSON:
{
  "adaptiveLevel": 4,
  "recommendedTitle": "Nighttime Airport - Multi-Object Detection",
  "rationale": "To overcome target fixation and improve vector tracking under low optical contrast.",
  "recommendedEnvironment": "Airport",
  "recommendedWeather": "Fog",
  "recommendedTime": "Night",
  "recommendedObjectCount": 5,
  "difficulty": "Advanced",
  "focusSkill": "Multi-target scanning & rapid classification"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, source: 'gemini-ai' });
      }
    } catch (err) {
      console.warn('Gemini recommend fallback:', err);
    }
  }

  // Fallback recommendation
  const score = currentScore || 82;
  const nextLevel = score >= 85 ? 4 : score >= 70 ? 3 : 2;

  return res.json({
    success: true,
    data: {
      adaptiveLevel: nextLevel,
      recommendedTitle: score >= 80 ? 'Nighttime Airport – Multi-Object Detection' : 'Industrial Facility – Single Target Vector Mastery',
      rationale: score >= 80
        ? 'High baseline accuracy achieved; advancing to multi-azimuth incursions under adverse optical visibility.'
        : 'Focusing on foundational vector confirmation and speed of threat verification.',
      recommendedEnvironment: score >= 80 ? 'Airport' : 'Industrial Facility',
      recommendedWeather: score >= 80 ? 'Fog' : 'Clear',
      recommendedTime: score >= 80 ? 'Night' : 'Dusk',
      recommendedObjectCount: score >= 80 ? 5 : 2,
      difficulty: score >= 80 ? 'Advanced' : 'Intermediate',
      focusSkill: 'Decision-Making Under Multiple-Object Conditions',
    },
    source: 'simulation-engine',
  });
});

// Serve frontend in dev or prod
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AegisDrone AI Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
