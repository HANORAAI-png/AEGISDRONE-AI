export type EnvironmentType = 
  | 'Airport' 
  | 'Government Facility' 
  | 'Industrial Facility' 
  | 'Stadium' 
  | 'Border/Remote Area' 
  | 'Critical Infrastructure';

export type TimeOfDay = 'Day' | 'Night' | 'Dawn' | 'Dusk';
export type WeatherType = 'Clear' | 'Rain' | 'Fog' | 'Windy';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type ScenarioObjective = 
  | 'Detection' 
  | 'Identification' 
  | 'Tracking' 
  | 'Threat Assessment' 
  | 'Multi-object Monitoring' 
  | 'Decision Making';

export type ContactStatus = 'UNKNOWN' | 'DETECTED' | 'TRACKED' | 'CLASSIFIED';
export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface DroneObject {
  id: string; // e.g. "OBJECT A-17"
  x: number; // canvas coordinates or normalized -100 to 100
  y: number;
  altitude: number; // in meters (e.g. 120m)
  speed: number; // in m/s (e.g. 18 m/s)
  heading: number; // 0 to 360 degrees
  distance: number; // in km (e.g. 1.8 km)
  trajectory: 'Inbound' | 'Tangential' | 'Outbound' | 'Orbiting' | 'Erratic';
  classification: 'Micro-UAV' | 'Multi-Rotor Drone' | 'Fixed-Wing Model' | 'Bird / Biologics' | 'Unknown Aerial Target';
  detectionConfidence: number; // 0 to 100
  classificationConfidence: number; // 0 to 100
  status: ContactStatus;
  threatLevel: ThreatLevel;
  threatScore: number; // 0 to 100
  inRestrictedZone: boolean;
  inWarningZone: boolean;
  anomalyFlags: string[];
  history: Array<{ x: number; y: number; time: number }>;
  isResolved?: boolean;
  operatorDecision?: string;
  decisionAccuracy?: number;
}

export interface SensorStatus {
  radar: { active: boolean; confidence: number; rangeKm: number };
  optical: { active: boolean; confidence: number; zoomLevel: number };
  rfSignal: { active: boolean; confidence: number; frequencyMhz: number };
}

export interface ScenarioConfig {
  id: string;
  codename: string;
  title: string;
  environment: EnvironmentType;
  time: TimeOfDay;
  weather: WeatherType;
  difficulty: DifficultyLevel;
  objectCount: number;
  objective: ScenarioObjective;
  description: string;
  visibilityKm: number;
  sensorDegradation: string;
  tacticalDirectives: string[];
  estimatedDurationMin: number;
}

export interface TraineeDecision {
  timestamp: string;
  objectId: string;
  assessment: 'Monitor' | 'Investigate' | 'Escalate' | 'Mark as Non-Threat';
  responseAction: string;
  reactionTimeSeconds: number;
  correctness: 'Optimal' | 'Sub-optimal' | 'Delayed';
  notes: string;
}

export interface SessionEvaluation {
  scenarioId: string;
  scenarioTitle: string;
  traineeId: string;
  traineeName: string;
  timestamp: string;
  durationSeconds: number;
  detectionAccuracy: number;
  identificationAccuracy: number;
  trackingAccuracy: number;
  decisionAccuracy: number;
  avgReactionTime: number;
  falseAlarms: number;
  missedTargets: number;
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  instructorQuotes: string[];
  primaryWeakness: string;
  adaptiveRecommendation?: {
    adaptiveLevel: number;
    recommendedTitle: string;
    rationale: string;
    environment: EnvironmentType;
    weather: WeatherType;
    time: TimeOfDay;
    objectCount: number;
    difficulty: DifficultyLevel;
    focusSkill: string;
  };
}

export interface TraineeProfile {
  id: string;
  name: string;
  callsign: string;
  role: string;
  avatar: string;
  sessionsCompleted: number;
  currentLevel: string;
  adaptiveLevelRating: number; // 1 to 5
  overallAccuracy: number;
  detectionAccuracy: number;
  trackingAccuracy: number;
  decisionAccuracy: number;
  avgReactionTime: number;
  strength: string;
  needsImprovement: string;
  sessionHistory: Array<{
    sessionId: string;
    date: string;
    scenario: string;
    score: number;
    status: 'Completed' | 'Needs Improvement' | 'Exceeded';
    durationMin: number;
    weakness: string;
  }>;
}
