import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Radio, 
  Camera, 
  Wifi, 
  ShieldAlert, 
  CheckCircle, 
  Maximize2, 
  Volume2, 
  VolumeX,
  Compass,
  Layers,
  Sparkles,
  Award,
  ChevronRight,
  Target
} from 'lucide-react';
import { 
  ScenarioConfig, 
  DroneObject, 
  SensorStatus, 
  TraineeDecision, 
  SessionEvaluation,
  TraineeProfile
} from '../../types';
import { ThreatAssessmentPanel } from './ThreatAssessmentPanel';
import { DecisionPanel } from './DecisionPanel';
import { InstructorPanel } from './InstructorPanel';
import { generateInitialObjects } from '../../data/mockData';
import { playRadarPing, playAlertChime, playTacticalClick, isAudioEnabled, setAudioEnabled } from '../../utils/audio';

interface DroneSimulatorProps {
  scenario: ScenarioConfig;
  activeOperator: TraineeProfile;
  onCompleteSession: (evaluation: SessionEvaluation) => void;
  onSelectNewScenario: () => void;
}

export const DroneSimulator: React.FC<DroneSimulatorProps> = ({
  scenario,
  activeOperator,
  onCompleteSession,
  onSelectNewScenario,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation play state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [audioMuted, setAudioMuted] = useState<boolean>(!isAudioEnabled());

  // Tactical Objects & Sensors
  const [objects, setObjects] = useState<DroneObject[]>(() => generateInitialObjects(scenario));
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<TraineeDecision[]>([]);
  const [alerts, setAlerts] = useState<Array<{ id: string; time: string; message: string; type: 'info' | 'warning' | 'alert' }>>([
    { id: '1', time: '00:01', message: `Scenario initialized: ${scenario.title}`, type: 'info' },
    { id: '2', time: '00:03', message: 'Radar horizon online. Scanning 360° azimuth.', type: 'info' },
  ]);

  // Sensor System Toggles
  const [sensors, setSensors] = useState<SensorStatus>({
    radar: { active: true, confidence: 94, rangeKm: 2.5 },
    optical: { active: true, confidence: scenario.weather === 'Fog' ? 62 : 88, zoomLevel: 4 },
    rfSignal: { active: true, confidence: 81, frequencyMhz: 2450 },
  });

  // Track sweep angle for radar rendering
  const sweepAngleRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(Date.now());

  // Optical zoom view modal toggle
  const [showOpticalModal, setShowOpticalModal] = useState<boolean>(false);

  // Initialize objects when scenario changes
  useEffect(() => {
    const initObjs = generateInitialObjects(scenario);
    setObjects(initObjs);
    setSelectedObjectId(initObjs[0]?.id || null);
    setElapsedTime(0);
    setDecisions([]);
    setAlerts([
      { id: 'init-1', time: '00:01', message: `Sector calibrated: ${scenario.environment} (${scenario.weather})`, type: 'info' },
      { id: 'init-2', time: '00:02', message: `${initObjs.length} aerial track file(s) assigned.`, type: 'info' },
    ]);
  }, [scenario.id]);

  // Selected object accessor
  const selectedObject = objects.find((o) => o.id === selectedObjectId) || null;

  // Sound toggle helper
  const handleToggleSound = () => {
    const next = !audioMuted;
    setAudioMuted(next);
    setAudioEnabled(!next);
    if (!next) playTacticalClick();
  };

  // Add an alert message
  const pushAlert = (msg: string, type: 'info' | 'warning' | 'alert' = 'info') => {
    const mins = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const secs = (elapsedTime % 60).toString().padStart(2, '0');
    setAlerts((prev) => [
      { id: String(Date.now()), time: `${mins}:${secs}`, message: msg, type },
      ...prev.slice(0, 19),
    ]);
  };

  // Spawn additional drone object
  const handleSpawnObject = () => {
    playTacticalClick();
    const angle = Math.random() * Math.PI * 2;
    const startDist = 1.8 + Math.random() * 0.4;
    const x = Math.cos(angle) * startDist * 95;
    const y = Math.sin(angle) * startDist * 95;
    const targetAngle = Math.atan2(-y, -x) + (Math.random() - 0.5) * 0.5;
    const headingDeg = Math.round(((targetAngle * 180) / Math.PI + 360) % 360);
    const newId = `OBJECT X-${Math.floor(10 + Math.random() * 89)}`;

    const newObj: DroneObject = {
      id: newId,
      x,
      y,
      altitude: Math.round(80 + Math.random() * 150),
      speed: Math.round(15 + Math.random() * 14),
      heading: headingDeg,
      distance: Number(startDist.toFixed(2)),
      trajectory: 'Inbound',
      classification: Math.random() > 0.4 ? 'Multi-Rotor Drone' : 'Micro-UAV',
      detectionConfidence: 65,
      classificationConfidence: 50,
      status: 'DETECTED',
      threatLevel: 'MEDIUM',
      threatScore: 65,
      inRestrictedZone: false,
      inWarningZone: false,
      anomalyFlags: ['Sudden vector incursion'],
      history: [{ x, y, time: Date.now() }],
    };

    setObjects((prev) => [...prev, newObj]);
    pushAlert(`New aerial contact detected: ${newId}`, 'warning');
    playAlertChime('MEDIUM');
  };

  // Reset simulation
  const handleReset = () => {
    playTacticalClick();
    setObjects(generateInitialObjects(scenario));
    setElapsedTime(0);
    setDecisions([]);
    pushAlert('Simulation parameters reset to initial state.', 'info');
  };

  // Trainee submitted decision handler
  const handleDecisionSubmit = (decision: TraineeDecision) => {
    setDecisions((prev) => [...prev, decision]);
    pushAlert(`Operator logged decision for ${decision.objectId}: [${decision.assessment}] - ${decision.responseAction}`, 'info');

    // Update object status
    setObjects((prev) =>
      prev.map((obj) => {
        if (obj.id === decision.objectId) {
          return {
            ...obj,
            status: 'CLASSIFIED',
            classificationConfidence: Math.min(99, obj.classificationConfidence + 25),
            isResolved: decision.assessment === 'Mark as Non-Threat' || decision.responseAction === 'Mark as resolved',
            operatorDecision: decision.assessment,
            decisionAccuracy: decision.correctness === 'Optimal' ? 100 : 70,
          };
        }
        return obj;
      })
    );
  };

  // Complete exercise & evaluate
  const handleCompleteSession = async () => {
    playTacticalClick();
    setIsPlaying(false);

    // Calculate baseline accuracies
    const totalContacts = objects.length;
    const evaluatedCount = decisions.length;
    const optimalCount = decisions.filter((d) => d.correctness === 'Optimal').length;

    const detectionAcc = Math.min(98, Math.max(70, Math.round(75 + (sensors.radar.active ? 15 : 0) + (sensors.optical.active ? 8 : 0))));
    const identificationAcc = Math.min(96, Math.max(65, Math.round(70 + (sensors.optical.active ? 20 : 0))));
    const trackingAcc = Math.min(95, Math.max(60, Math.round(72 + (sensors.rfSignal.active ? 18 : 0))));
    const decisionAcc = evaluatedCount > 0 ? Math.round((optimalCount / evaluatedCount) * 100) : 75;

    const avgReact = decisions.length > 0 
      ? Number((decisions.reduce((acc, d) => acc + d.reactionTimeSeconds, 0) / decisions.length).toFixed(1))
      : 3.8;

    const sessionStats = {
      detectionAccuracy: detectionAcc,
      identificationAccuracy: identificationAcc,
      trackingAccuracy: trackingAcc,
      decisionAccuracy: decisionAcc,
      avgReactionTime: avgReact,
      falseAlarms: decisions.filter((d) => d.assessment === 'Escalate' && objects.find((o) => o.id === d.objectId)?.threatLevel === 'LOW').length,
      missedTargets: Math.max(0, totalContacts - evaluatedCount),
    };

    try {
      // Call AI evaluation API
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionStats,
          traineeName: activeOperator.name,
          scenarioName: scenario.title,
        }),
      });
      const data = await res.json();
      const evalData = data.data;

      // Call adaptive recommendation API
      const recRes = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentScore: evalData.overallScore,
          weakness: evalData.primaryWeakness,
          currentLevel: activeOperator.currentLevel,
        }),
      });
      const recData = await recRes.json();

      const evaluation: SessionEvaluation = {
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        traineeId: activeOperator.id,
        traineeName: activeOperator.name,
        timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        durationSeconds: elapsedTime,
        detectionAccuracy: sessionStats.detectionAccuracy,
        identificationAccuracy: sessionStats.identificationAccuracy,
        trackingAccuracy: sessionStats.trackingAccuracy,
        decisionAccuracy: sessionStats.decisionAccuracy,
        avgReactionTime: sessionStats.avgReactionTime,
        falseAlarms: sessionStats.falseAlarms,
        missedTargets: sessionStats.missedTargets,
        overallScore: evalData.overallScore,
        strengths: evalData.strengths,
        areasForImprovement: evalData.areasForImprovement,
        instructorQuotes: evalData.instructorQuotes,
        primaryWeakness: evalData.primaryWeakness,
        adaptiveRecommendation: recData.data,
      };

      onCompleteSession(evaluation);
    } catch {
      // Fallback evaluation object
      const overall = Math.round((detectionAcc * 0.25) + (identificationAcc * 0.2) + (trackingAcc * 0.25) + (decisionAcc * 0.3));
      const fallbackEval: SessionEvaluation = {
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        traineeId: activeOperator.id,
        traineeName: activeOperator.name,
        timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        durationSeconds: elapsedTime,
        detectionAccuracy: detectionAcc,
        identificationAccuracy: identificationAcc,
        trackingAccuracy: trackingAcc,
        decisionAccuracy: decisionAcc,
        avgReactionTime: avgReact,
        falseAlarms: 0,
        missedTargets: Math.max(0, totalContacts - evaluatedCount),
        overallScore: overall,
        strengths: [
          'Rapid initial target radar acquisition',
          'Disciplined avoidance of false alarms',
          'Good multi-sensor correlation',
        ],
        areasForImprovement: [
          'Multi-target prioritization during simultaneous ingress',
          'Decision latency on high-threat restricted zone incursions',
        ],
        instructorQuotes: [
          'You acquired the primary target promptly and maintained track.',
          'Your decisions conformed accurately with standard perimeter protocols.',
          'Response latency improved compared to baseline.',
        ],
        primaryWeakness: 'Multi-Object Tracking Under Clutter',
        adaptiveRecommendation: {
          adaptiveLevel: 4,
          recommendedTitle: 'Nighttime Airport – Multi-Object Detection',
          rationale: 'Calibrated to challenge multi-target prioritization under low optical contrast.',
          environment: 'Airport',
          weather: 'Fog',
          time: 'Night',
          objectCount: 5,
          difficulty: 'Advanced',
          focusSkill: 'Decision-Making Under Multiple-Object Conditions',
        },
      };
      onCompleteSession(fallbackEval);
    }
  };

  // Main Simulation Loop: Object movement & Canvas Render
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlaying) {
        // Advance elapsed time
        setElapsedTime((prev) => prev + 1 * (simSpeed > 1 ? 0.25 : 0.05));

        // Advance radar sweep angle
        sweepAngleRef.current = (sweepAngleRef.current + 1.8 * simSpeed * (Math.PI / 180)) % (Math.PI * 2);

        // Move aerial objects
        setObjects((prevObjs) => {
          return prevObjs.map((obj) => {
            const rad = (obj.heading * Math.PI) / 180;
            // Speed scale: speed m/s converted to pixel delta
            const moveStep = (obj.speed * 0.12 * simSpeed * dt);
            let nextX = obj.x + Math.sin(rad) * moveStep;
            let nextY = obj.y - Math.cos(rad) * moveStep;

            // Distance from center (0,0) in km (95 px = 1.0 km)
            const distPx = Math.sqrt(nextX * nextX + nextY * nextY);
            const distKm = Number((distPx / 95).toFixed(2));

            // Zone checks
            const inRestricted = distKm <= 0.5; // Inner 500m
            const inWarning = distKm <= 1.2 && !inRestricted; // Buffer 1200m

            // Boundary alerts trigger once
            if (inRestricted && !obj.inRestrictedZone) {
              pushAlert(`CRITICAL ALERT: Target ${obj.id} entered restricted zone (500m)!`, 'alert');
              playAlertChime('HIGH');
            } else if (inWarning && !obj.inWarningZone && !obj.inRestrictedZone) {
              pushAlert(`WARNING: Target ${obj.id} crossed 1200m buffer zone.`, 'warning');
              playAlertChime('MEDIUM');
            }

            // Update trajectory and status transition based on sensor coverage
            let nextStatus = obj.status;
            let nextDetConf = obj.detectionConfidence;
            let nextClassConf = obj.classificationConfidence;

            if (sensors.radar.active) {
              if (distKm <= sensors.radar.rangeKm) {
                if (nextStatus === 'UNKNOWN') nextStatus = 'DETECTED';
                if (distKm <= 1.5 && nextStatus === 'DETECTED') nextStatus = 'TRACKED';
                nextDetConf = Math.min(99, nextDetConf + 0.1);
              }
            } else {
              nextDetConf = Math.max(20, nextDetConf - 0.2);
            }

            if (sensors.optical.active && distKm <= 1.2) {
              nextClassConf = Math.min(98, nextClassConf + 0.15);
              if (nextClassConf > 75 && nextStatus === 'TRACKED') {
                nextStatus = 'CLASSIFIED';
              }
            }

            // History breadcrumbs
            const newHistory = [...obj.history, { x: nextX, y: nextY, time: now }].slice(-16);

            return {
              ...obj,
              x: nextX,
              y: nextY,
              distance: distKm,
              inRestrictedZone: inRestricted,
              inWarningZone: inWarning,
              status: nextStatus,
              detectionConfidence: Math.round(nextDetConf),
              classificationConfidence: Math.round(nextClassConf),
              history: newHistory,
            };
          });
        });
      }

      // Render Canvas
      drawCanvas();
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, simSpeed, sensors]);

  // Tactical Canvas Drawing Function
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    // Clear background
    ctx.fillStyle = '#060910';
    ctx.fillRect(0, 0, w, h);

    // 1. Draw coordinate grid lines (100px cells)
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 2. Azimuth radial lines (0, 45, 90, 135, 180, 225, 270, 315)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.lineWidth = 1;
    for (let a = 0; a < 360; a += 45) {
      const rad = (a * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(rad) * 260, cy + Math.sin(rad) * 260);
      ctx.stroke();
    }

    // 3. Distance Concentric Rings: 500m (48px), 1000m (95px), 1500m (142px), 2000m (190px)
    const rings = [
      { r: 48, label: '500m RESTRICTED', color: 'rgba(239, 68, 68, 0.45)', dashed: true },
      { r: 114, label: '1200m BUFFER', color: 'rgba(245, 158, 11, 0.35)', dashed: true },
      { r: 190, label: '2000m HORIZON', color: 'rgba(6, 182, 212, 0.25)', dashed: false },
    ];

    rings.forEach((ring) => {
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 1;
      if (ring.dashed) {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
      ctx.stroke();

      // Ring label
      ctx.fillStyle = ring.color;
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(ring.label, cx + 4, cy - ring.r + 11);
    });
    ctx.setLineDash([]);

    // 4. Center Protected Facility (Airport runways / building footprint)
    ctx.save();
    ctx.translate(cx, cy);

    // Facility center circle & crosshair
    ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();

    // Runway polygons if Airport, or central asset
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-28, -8);
    ctx.lineTo(28, 8);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, 20);
    ctx.lineTo(16, -20);
    ctx.stroke();

    // Operator Monitoring Point / TOC
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Radar Sweep Line & Phosphor Glow
    if (sensors.radar.active) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sweepAngleRef.current);

      // Gradient sweep cone
      const sweepGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 200);
      sweepGrad.addColorStop(0, 'rgba(6, 182, 212, 0.28)');
      sweepGrad.addColorStop(0.8, 'rgba(6, 182, 212, 0.04)');
      sweepGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 200, 0, Math.PI / 5);
      ctx.closePath();
      ctx.fill();

      // Sharp sweep leading edge
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(200, 0);
      ctx.stroke();
      ctx.restore();
    }

    // 6. Draw Moving Aerial Drone Objects
    objects.forEach((obj) => {
      const ox = cx + obj.x;
      const oy = cy + obj.y;

      const isSelected = obj.id === selectedObjectId;
      const threatColor = 
        obj.threatLevel === 'HIGH' ? '#f43f5e' : obj.threatLevel === 'MEDIUM' ? '#f59e0b' : '#06b6d4';

      // Trajectory History Breadcrumbs
      if (obj.history.length > 1) {
        ctx.strokeStyle = `${threatColor}40`;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        obj.history.forEach((pt, i) => {
          const hx = cx + pt.x;
          const hy = cy + pt.y;
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Heading Vector Direction Arrow (length: 18px)
      const headingRad = (obj.heading * Math.PI) / 180;
      const arrowTipX = ox + Math.sin(headingRad) * 18;
      const arrowTipY = oy - Math.cos(headingRad) * 18;

      ctx.strokeStyle = threatColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(arrowTipX, arrowTipY);
      ctx.stroke();

      // Neutral Target Marker (Diamond or Square based on classification)
      ctx.fillStyle = threatColor;
      ctx.beginPath();
      ctx.arc(ox, oy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Selected Target Halo & Pulsing Reticle
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ox, oy, 11, 0, Math.PI * 2);
        ctx.stroke();

        // 4 corner reticle brackets
        const b = 15;
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1;

        // Top-left bracket
        ctx.beginPath();
        ctx.moveTo(ox - b, oy - b + 5);
        ctx.lineTo(ox - b, oy - b);
        ctx.lineTo(ox - b + 5, oy - b);
        ctx.stroke();

        // Bottom-right bracket
        ctx.beginPath();
        ctx.moveTo(ox + b, oy + b - 5);
        ctx.lineTo(ox + b, oy + b);
        ctx.lineTo(ox + b - 5, oy + b);
        ctx.stroke();
      }

      // Overlaid Telemetry Label Box
      ctx.fillStyle = '#0a101cdd';
      ctx.strokeStyle = `${threatColor}80`;
      ctx.lineWidth = 1;
      const labelW = 86;
      const labelH = 28;
      const lx = ox + 12;
      const ly = oy - 14;

      ctx.fillRect(lx, ly, labelW, labelH);
      ctx.strokeRect(lx, ly, labelW, labelH);

      // Text inside label
      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(obj.id, lx + 4, ly + 10);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillText(`${obj.altitude}m · ${obj.speed}m/s`, lx + 4, ly + 21);
    });

    // 7. Compass Cardinal Markings
    ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.font = 'bold 10px "Chakra Petch", sans-serif';
    ctx.fillText('N 000°', cx - 18, 16);
    ctx.fillText('S 180°', cx - 18, h - 8);
    ctx.fillText('E 090°', w - 46, cy + 4);
    ctx.fillText('W 270°', 8, cy + 4);
  };

  // Canvas Click Handler: Select Target
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Check hit radius on any object (24px hit target)
    let hitObject: DroneObject | null = null;
    for (const obj of objects) {
      const ox = cx + obj.x;
      const oy = cy + obj.y;
      const dist = Math.hypot(clickX - ox, clickY - oy);
      if (dist < 26) {
        hitObject = obj;
        break;
      }
    }

    if (hitObject) {
      playTacticalClick();
      setSelectedObjectId(hitObject.id);
      pushAlert(`Target selected: ${hitObject.id} (${hitObject.classification})`, 'info');
    }
  };

  // Format elapsed time string
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Top Telemetry Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-[#0a101c] border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-tactical font-bold text-slate-200 uppercase tracking-wide">
              {scenario.title}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-cyan-400">{scenario.environment}</span>
          </div>

          <div className="text-slate-400 hidden sm:block">
            Weather: <span className="text-slate-200">{scenario.weather} ({scenario.visibilityKm}km)</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-[#0e1627] px-2.5 py-1 rounded border border-slate-800 text-slate-300">
            <span>ELAPSED:</span>
            <span className="text-cyan-400 font-bold tabular-nums">{formatTime(elapsedTime)}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0e1627] px-2.5 py-1 rounded border border-slate-800 text-slate-300">
            <span>TARGETS:</span>
            <span className="text-amber-400 font-bold tabular-nums">{objects.length}</span>
          </div>

          {/* Complete Exercise Button */}
          <button
            onClick={handleCompleteSession}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-tactical font-bold rounded transition-colors shadow-[0_0_10px_rgba(16,185,129,0.3)] whitespace-nowrap"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Complete &amp; Evaluate Session</span>
          </button>
        </div>
      </div>

      {/* Main Simulation Layout: Left Canvas + Controls | Right Multi-Panel HUD */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column (8 cols): 2D Tactical Radar Canvas & Sensor Controls */}
        <div className="xl:col-span-8 space-y-3">
          {/* Radar Stage Container */}
          <div className="relative rounded-xl bg-[#060910] border border-cyan-900/60 p-2 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
            {/* HUD Status Header Overlay */}
            <div className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-800/80">
              <span className="text-cyan-400 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                TACTICAL RADAR HORIZON (2.0 KM)
              </span>
              <span className="text-slate-400">
                SWEEP: <span className="text-slate-200">ACTIVE</span> · FPS: 60
              </span>
            </div>

            {/* Canvas Element */}
            <canvas
              ref={canvasRef}
              width={680}
              height={560}
              onClick={handleCanvasClick}
              className="cursor-crosshair w-full max-h-[560px] object-contain rounded"
            />

            {/* Overlaid Corner Tactical Legends */}
            <div className="absolute top-10 left-4 pointer-events-none text-[10px] font-mono space-y-1">
              <div className="bg-[#090e18]/90 border border-slate-800/80 p-1.5 rounded text-slate-300">
                GRID: 100m · AZIMUTH: 360°
              </div>
              <div className="bg-[#090e18]/90 border border-rose-900/60 p-1.5 rounded text-rose-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                RESTRICTED AIRSPACE: 500M
              </div>
            </div>

            {/* Overlaid Bottom Toolbar inside Canvas Frame */}
            <div className="w-full flex items-center justify-between px-3 py-2 border-t border-slate-800/80 bg-[#080d17]/90 text-xs">
              {/* Play / Pause / Speed */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playTacticalClick();
                    setIsPlaying(!isPlaying);
                  }}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <div className="flex items-center bg-slate-900 border border-slate-800 rounded text-[11px] font-mono overflow-hidden">
                  {[1, 2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        playTacticalClick();
                        setSimSpeed(s);
                      }}
                      className={`px-2 py-1 transition-colors ${
                        simSpeed === s ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleReset}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Reset Scenario"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleToggleSound}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSpawnObject}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/40 text-xs font-tactical transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Spawn Target</span>
                </button>

                <button
                  onClick={() => setShowOpticalModal(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-tactical transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Optical / EO-IR HUD</span>
                </button>
              </div>
            </div>
          </div>

          {/* Simulated Sensor System Toggle Panel */}
          <div className="p-3.5 rounded-lg bg-[#0a101c] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-tactical uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Simulated Multi-Sensor Correlation Layer
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Toggle sensors to simulate telemetry fidelity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Radar Simulation */}
              <div className={`p-2.5 rounded border transition-colors ${
                sensors.radar.active 
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200' 
                  : 'bg-[#090d16] border-slate-800/80 text-slate-500'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-tactical text-xs font-bold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    Radar Simulation
                  </span>
                  <input
                    type="checkbox"
                    checked={sensors.radar.active}
                    onChange={(e) => {
                      playTacticalClick();
                      setSensors({ ...sensors, radar: { ...sensors.radar, active: e.target.checked } });
                    }}
                    className="accent-cyan-400 w-3.5 h-3.5 cursor-pointer"
                  />
                </div>
                <div className="text-[10px] font-mono mt-1 text-slate-400">
                  Confidence: {sensors.radar.confidence}% · Range: 2.5 km
                </div>
              </div>

              {/* Optical Simulation */}
              <div className={`p-2.5 rounded border transition-colors ${
                sensors.optical.active 
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
                  : 'bg-[#090d16] border-slate-800/80 text-slate-500'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-tactical text-xs font-bold flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    Optical / EO-IR
                  </span>
                  <input
                    type="checkbox"
                    checked={sensors.optical.active}
                    onChange={(e) => {
                      playTacticalClick();
                      setSensors({ ...sensors, optical: { ...sensors.optical, active: e.target.checked } });
                    }}
                    className="accent-emerald-400 w-3.5 h-3.5 cursor-pointer"
                  />
                </div>
                <div className="text-[10px] font-mono mt-1 text-slate-400">
                  Confidence: {sensors.optical.confidence}% · 4x Thermal Zoom
                </div>
              </div>

              {/* RF / Signal Simulation */}
              <div className={`p-2.5 rounded border transition-colors ${
                sensors.rfSignal.active 
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' 
                  : 'bg-[#090d16] border-slate-800/80 text-slate-500'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-tactical text-xs font-bold flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    RF / Signal Sensor
                  </span>
                  <input
                    type="checkbox"
                    checked={sensors.rfSignal.active}
                    onChange={(e) => {
                      playTacticalClick();
                      setSensors({ ...sensors, rfSignal: { ...sensors.rfSignal, active: e.target.checked } });
                    }}
                    className="accent-amber-400 w-3.5 h-3.5 cursor-pointer"
                  />
                </div>
                <div className="text-[10px] font-mono mt-1 text-slate-400">
                  Confidence: {sensors.rfSignal.confidence}% · 2.4 / 5.8 GHz
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Tactical Event Feed */}
          <div className="p-3 rounded-lg bg-[#0a101c] border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-tactical uppercase tracking-wider text-slate-400">
              <span>Tactical Alert Log</span>
              <span className="font-mono text-[10px] text-cyan-400">{alerts.length} Events</span>
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1 font-mono text-[11px] pr-1">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-1.5 rounded flex items-center justify-between border ${
                    alert.type === 'alert'
                      ? 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                      : alert.type === 'warning'
                      ? 'bg-amber-950/40 border-amber-800/50 text-amber-300'
                      : 'bg-[#0e1627] border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="truncate pr-2">{alert.message}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): AI Threat Assessment, Decision Panel, AI Instructor */}
        <div className="xl:col-span-4 space-y-4">
          {/* 1. AI Threat Assessment */}
          <ThreatAssessmentPanel
            selectedObject={selectedObject}
            scenario={scenario}
          />

          {/* 2. Trainee Decision Panel */}
          <DecisionPanel
            selectedObject={selectedObject}
            onSubmitDecision={handleDecisionSubmit}
            recentDecisions={decisions}
          />

          {/* 3. AI Instructor Live Feedback */}
          <InstructorPanel
            recentDecisions={decisions}
            activeObjects={objects}
            elapsedSeconds={elapsedTime}
          />
        </div>
      </div>

      {/* Optical / EO-IR Zoom Camera Modal */}
      {showOpticalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-xl bg-[#090e17] border border-cyan-500/50 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                <Camera className="w-4 h-4" />
                SIMULATED EO-IR OPTICAL RETICLE (4X ZOOM)
              </span>
              <button
                onClick={() => setShowOpticalModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕ Close
              </button>
            </div>

            {/* Thermal Camera Simulation Window */}
            <div className="relative h-64 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-center overflow-hidden">
              {/* Scanlines effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

              {/* Crosshair reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border border-emerald-500/40 rounded-full" />
                <div className="absolute w-64 h-[1px] bg-emerald-500/40" />
                <div className="absolute h-64 w-[1px] bg-emerald-500/40" />
              </div>

              {selectedObject ? (
                <div className="text-center space-y-2 z-10">
                  <div className="w-16 h-16 mx-auto rounded bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300 font-mono font-bold animate-pulse">
                    {selectedObject.classification.includes('Multi-Rotor') ? 'QUAD' : 'UAV'}
                  </div>
                  <div className="font-mono text-xs text-emerald-300">
                    TARGET: {selectedObject.id} · {selectedObject.classification}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400/80">
                    THERMAL SIGNATURE: MOTOR HEAT BLOOM DETECTED
                  </div>
                </div>
              ) : (
                <div className="text-center font-mono text-xs text-emerald-500/70">
                  No target in boresight. Select target on radar horizon.
                </div>
              )}

              {/* Status overlay */}
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-400">
                FOV: 12.4° · SENSOR: LWIR THERMAL
              </div>
              <div className="absolute top-2 right-2 text-[10px] font-mono text-emerald-400">
                IR TRACK LOCK
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Simulated optical sensors assist the operator in confirming target configuration (micro-drone vs. bird/decoy) prior to initiating security protocols.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
