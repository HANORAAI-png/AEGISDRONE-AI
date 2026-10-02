import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  X, 
  Radar, 
  BrainCircuit, 
  Award, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { ScenarioConfig } from '../../types';
import { playTacticalClick } from '../../utils/audio';

interface DemoWalkthroughModalProps {
  onClose: () => void;
  onJumpToSimulator: (scenario?: ScenarioConfig) => void;
  onOpenGenerator: () => void;
  onOpenDashboard: () => void;
  onOpenAnalytics: () => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  onClose,
  onJumpToSimulator,
  onOpenGenerator,
  onOpenDashboard,
  onOpenAnalytics,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      title: '1. Autonomous AI Scenario Generation',
      subtitle: 'Configuring Airport + Night + Fog + Advanced',
      content: 'Demonstrates real-time scenario briefing synthesis with meteorological sensor attenuation (fog degrading optical sensors by 70%) and multi-target inbound vectors.',
      actionLabel: 'Launch Configured Scenario in Simulator',
      runAction: () => {
        const demoScenario: ScenarioConfig = {
          id: 'SCN-DEMO-01',
          codename: 'OPERATION VANGUARD',
          title: 'Airport Perimeter Surveillance – Advanced',
          environment: 'Airport',
          time: 'Night',
          weather: 'Fog',
          difficulty: 'Advanced',
          objectCount: 3,
          objective: 'Multi-object Monitoring',
          description: 'Autonomous micro-aerial systems navigating towards the civilian runway approach corridor under dense fog. Trainee must correlate multi-sensor data, inspect OBJECT A-17, and execute standard security protocols.',
          visibilityKm: 0.8,
          sensorDegradation: 'High optical diffusion; radar range reduced by 15%',
          tacticalDirectives: [
            'Maintain continuous radar horizon tracking',
            'Verify classification before restricted zone buffer crossing',
            'Log all decisions with zero false positive alarms',
          ],
          estimatedDurationMin: 5,
        };
        onJumpToSimulator(demoScenario);
        onClose();
      },
    },
    {
      title: '2. Multi-Sensor Tactical Radar Horizon',
      subtitle: 'Real-Time 2D Map with 500m & 1200m Zones',
      content: 'Simulated 2D radar display with concentric distance rings, facility buildings, live vector heading arrows, altitude telemetry, and toggleable Radar / Optical / RF sensors.',
      actionLabel: 'Open Interactive Tactical Simulator',
      runAction: () => {
        onJumpToSimulator();
        onClose();
      },
    },
    {
      title: '3. Contextual AI Threat Assessment',
      subtitle: 'Explainable AI Severity & Rationale',
      content: 'Inspect contact OBJECT A-17 to view automated threat rating (HIGH/MEDIUM/LOW), proximity to restricted airspace, and bulleted tactical explanations without black-box confusion.',
      actionLabel: 'Inspect Active Target & Decisions',
      runAction: () => {
        onJumpToSimulator();
        onClose();
      },
    },
    {
      title: '4. Trainee Decision & Protocol Logging',
      subtitle: 'Safe Abstract Operator Choices & Stopwatch',
      content: 'Trainee selects safe abstract responses: Monitor, Investigate, Escalate, or Initiate simulated security protocol, tracking reaction latency in seconds.',
      actionLabel: 'Practice Operator Decision',
      runAction: () => {
        onJumpToSimulator();
        onClose();
      },
    },
    {
      title: '5. AI Adaptive Engine & Evaluator (USP)',
      subtitle: 'Weakness Identification & Next Recommended Training',
      content: 'The system computes performance across Detection, Tracking, and Decision Accuracy, isolates the primary weakness, and automatically prescribes the next calibrated exercise.',
      actionLabel: 'View Analytics & Dashboard',
      runAction: () => {
        onOpenDashboard();
        onClose();
      },
    },
  ];

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-xl bg-[#0a101c] border border-cyan-500/50 p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-400 font-tactical font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>SIH DEMONSTRATION WORKFLOW (STEP {currentStep + 1} OF {steps.length})</span>
          </div>
          <button
            onClick={() => {
              playTacticalClick();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Dots */}
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                playTacticalClick();
                setCurrentStep(i);
              }}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i === currentStep ? 'bg-cyan-400' : i < currentStep ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Current Step Content */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              {step.subtitle}
            </span>
            <h2 className="font-tactical text-xl font-bold text-slate-100 mt-0.5">
              {step.title}
            </h2>
          </div>

          <div className="p-4 rounded-lg bg-[#0e1627] border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
            {step.content}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => {
                  playTacticalClick();
                  setCurrentStep(currentStep - 1);
                }}
                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-tactical transition-colors"
              >
                &larr; Previous
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => {
                  playTacticalClick();
                  setCurrentStep(currentStep + 1);
                }}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/40 text-xs font-tactical transition-colors flex items-center gap-1"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          <button
            onClick={() => {
              playTacticalClick();
              step.runAction();
            }}
            className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-tactical font-bold text-xs rounded transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{step.actionLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
