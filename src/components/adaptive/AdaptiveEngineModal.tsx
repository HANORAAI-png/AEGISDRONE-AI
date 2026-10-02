import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Sliders, 
  ShieldCheck, 
  Activity, 
  X,
  Target,
  Layers
} from 'lucide-react';
import { TraineeProfile, ScenarioConfig } from '../../types';
import { playTacticalClick } from '../../utils/audio';

interface AdaptiveEngineModalProps {
  trainee: TraineeProfile;
  onClose: () => void;
  onLaunchScenario: (scenario: ScenarioConfig) => void;
}

export const AdaptiveEngineModal: React.FC<AdaptiveEngineModalProps> = ({
  trainee,
  onClose,
  onLaunchScenario,
}) => {
  const [level, setLevel] = useState<number>(Math.round(trainee.adaptiveLevelRating));

  const recommendedScenario: ScenarioConfig = {
    id: `SCN-ADAPT-NIGHT-${Math.floor(Math.random() * 899 + 100)}`,
    codename: 'NIGHT FALCON',
    title: 'Nighttime Airport – Multi-Object Detection',
    environment: 'Airport',
    time: 'Night',
    weather: 'Fog',
    difficulty: level >= 4 ? 'Expert' : level >= 3 ? 'Advanced' : 'Intermediate',
    objectCount: Math.min(8, level + 2),
    objective: 'Decision Making',
    description: `AI-Adaptive curriculum prescribed specifically for ${trainee.name}. Calibrated to overcome target fixation and improve vector tracking under low optical contrast and simultaneous incursion vectors.`,
    visibilityKm: 0.8,
    sensorDegradation: 'High optical diffusion; radar range reduced by 15%',
    tacticalDirectives: [
      'Prioritize decision sequence on closest inbound vector within 1.5 km',
      'Verify transponder correlation before zone boundary crossing',
      'Maintain track log with zero false alarms',
    ],
    estimatedDurationMin: 6,
  };

  const handleLaunch = () => {
    playTacticalClick();
    onLaunchScenario(recommendedScenario);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl bg-[#0a101c] border border-cyan-500/50 p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-400 font-tactical font-bold">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <span>ADAPTIVE TRAINING ENGINE (USP ARCHITECTURE)</span>
          </div>
          <button
            onClick={() => {
              playTacticalClick();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine Overview */}
        <div className="space-y-1">
          <h2 className="font-tactical text-xl font-bold text-slate-100">
            Automated Curricular Adaptation
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            The AegisDrone Adaptive Engine continuously monitors trainee decision telemetry, latency, false alarms, and tracking accuracy. When a specific weakness is detected, the engine modifies 5 operational axes.
          </p>
        </div>

        {/* 5 Operational Axes of Adaptation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
          <div className="p-2.5 rounded bg-[#0e1627] border border-slate-800">
            <div className="text-[10px] text-slate-400">Axis 1: Target Count</div>
            <div className="text-cyan-400 font-bold mt-0.5">1 &rarr; 10 Simultaneous</div>
          </div>
          <div className="p-2.5 rounded bg-[#0e1627] border border-slate-800">
            <div className="text-[10px] text-slate-400">Axis 2: Environment</div>
            <div className="text-cyan-400 font-bold mt-0.5">Airport · Border · Urban</div>
          </div>
          <div className="p-2.5 rounded bg-[#0e1627] border border-slate-800">
            <div className="text-[10px] text-slate-400">Axis 3: Weather Stress</div>
            <div className="text-cyan-400 font-bold mt-0.5">Fog · Rain · Night</div>
          </div>
          <div className="p-2.5 rounded bg-[#0e1627] border border-slate-800">
            <div className="text-[10px] text-slate-400">Axis 4: Time Pressure</div>
            <div className="text-cyan-400 font-bold mt-0.5">8.0s &rarr; 3.0s Threshold</div>
          </div>
          <div className="p-2.5 rounded bg-[#0e1627] border border-slate-800 col-span-2 sm:col-span-2">
            <div className="text-[10px] text-slate-400">Axis 5: Information Ambiguity</div>
            <div className="text-cyan-400 font-bold mt-0.5">RF Clutter · Decoy Birds · Transponder Fuzzing</div>
          </div>
        </div>

        {/* Trainee Analysis Profile */}
        <div className="p-4 rounded-lg bg-[#0e1627] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-tactical uppercase tracking-wider text-slate-400 font-semibold">
              Trainee Telemetry: {trainee.name} ({trainee.callsign})
            </span>
            <span className="font-mono text-cyan-400">Level: {trainee.currentLevel}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-[#090e18] border border-slate-800">
              <div className="text-[10px] text-slate-400">Detection</div>
              <div className="text-cyan-400 font-bold">{trainee.detectionAccuracy}%</div>
            </div>
            <div className="p-2 rounded bg-[#090e18] border border-slate-800">
              <div className="text-[10px] text-slate-400">Tracking</div>
              <div className="text-cyan-400 font-bold">{trainee.trackingAccuracy}%</div>
            </div>
            <div className="p-2 rounded bg-[#090e18] border border-slate-800">
              <div className="text-[10px] text-slate-400">Decision Acc.</div>
              <div className="text-amber-400 font-bold">{trainee.decisionAccuracy}%</div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/40 text-xs font-mono text-amber-300">
            <strong>AI Identified Primary Weakness:</strong> {trainee.needsImprovement}
          </div>
        </div>

        {/* Next Recommended Adaptive Exercise */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#0c1a2f] to-[#091322] border border-cyan-500/50 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400 font-tactical font-bold">
              <Sparkles className="w-4 h-4" />
              <span>CURRENT ADAPTIVE RECOMMENDATION</span>
            </div>
            <span className="font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              Adaptive Level: {level}/5
            </span>
          </div>

          <div>
            <div className="font-tactical text-base font-bold text-slate-100">
              &ldquo;{recommendedScenario.title}&rdquo;
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {recommendedScenario.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-mono text-slate-400">
              {recommendedScenario.environment} · {recommendedScenario.weather} · {recommendedScenario.objectCount} Targets
            </div>

            <button
              onClick={handleLaunch}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-tactical font-bold text-xs rounded transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            >
              <span>Launch Recommended Scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
