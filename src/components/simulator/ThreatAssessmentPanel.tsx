import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  BrainCircuit, 
  Info,
  Layers,
  Activity
} from 'lucide-react';
import { DroneObject, ScenarioConfig } from '../../types';
import { playTacticalClick } from '../../utils/audio';

interface ThreatAssessmentPanelProps {
  selectedObject: DroneObject | null;
  scenario: ScenarioConfig;
}

export const ThreatAssessmentPanel: React.FC<ThreatAssessmentPanelProps> = ({
  selectedObject,
  scenario,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiReasons, setAiReasons] = useState<string[] | null>(null);

  const requestDeepAiAssessment = async () => {
    if (!selectedObject) return;
    playTacticalClick();
    setAnalyzing(true);

    try {
      const res = await fetch('/api/ai/threat-assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectData: selectedObject,
          environment: scenario.environment,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.reasons) {
        setAiReasons(data.data.reasons);
      }
    } catch {
      // Fallback
      setAiReasons([
        'Entering restricted training zone buffer',
        'Persistent high-speed inbound vector',
        'Unregistered transponder signal',
      ]);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!selectedObject) {
    return (
      <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800 text-xs text-center text-slate-400 space-y-2">
        <div className="flex justify-center text-slate-600">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <p className="font-tactical font-semibold text-slate-300">
          No Target Selected
        </p>
        <p className="text-[11px] leading-relaxed">
          Click any radar contact blip on the 2D tactical map to view automated AI threat telemetry and assess incursion vectors.
        </p>
      </div>
    );
  }

  const threatColor = 
    selectedObject.threatLevel === 'HIGH' 
      ? 'text-rose-400 bg-rose-950/40 border-rose-800/60' 
      : selectedObject.threatLevel === 'MEDIUM' 
      ? 'text-amber-400 bg-amber-950/40 border-amber-800/60' 
      : 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60';

  const reasons = aiReasons || [
    ...(selectedObject.inRestrictedZone ? ['Entering restricted training zone (500m)'] : []),
    ...(selectedObject.inWarningZone ? ['Incursing surveillance buffer zone (1200m)'] : []),
    `Trajectory: ${selectedObject.trajectory} towards facility asset center`,
    `Classification confidence: ${selectedObject.classificationConfidence}% (${selectedObject.classification})`,
    ...selectedObject.anomalyFlags,
  ];

  return (
    <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800/80 space-y-3">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-cyan-400 font-tactical font-bold">
          <BrainCircuit className="w-4 h-4" />
          <span>AI THREAT ASSESSMENT</span>
        </div>
        <button
          onClick={requestDeepAiAssessment}
          disabled={analyzing}
          className="text-[10px] font-tactical px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-700/50 text-cyan-300 hover:border-cyan-400 transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>{analyzing ? 'Reasoning...' : 'AI Re-Assess'}</span>
        </button>
      </div>

      {/* Target Key Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>{selectedObject.id}</span>
            <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              {selectedObject.status}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {selectedObject.classification}
          </div>
        </div>

        {/* Threat Level Badge */}
        <div className={`px-2.5 py-1 rounded border font-mono font-bold text-xs tracking-wider flex items-center gap-1.5 ${threatColor}`}>
          {selectedObject.threatLevel === 'HIGH' ? (
            <ShieldAlert className="w-3.5 h-3.5 fill-rose-500/20" />
          ) : selectedObject.threatLevel === 'MEDIUM' ? (
            <AlertTriangle className="w-3.5 h-3.5" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5" />
          )}
          <span>THREAT: {selectedObject.threatLevel}</span>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
        <div className="p-2 rounded bg-[#0e1627] border border-slate-800/80">
          <div className="text-[10px] text-slate-400">Altitude</div>
          <div className="text-slate-200 font-semibold">{selectedObject.altitude} m</div>
        </div>
        <div className="p-2 rounded bg-[#0e1627] border border-slate-800/80">
          <div className="text-[10px] text-slate-400">Velocity</div>
          <div className="text-slate-200 font-semibold">{selectedObject.speed} m/s</div>
        </div>
        <div className="p-2 rounded bg-[#0e1627] border border-slate-800/80">
          <div className="text-[10px] text-slate-400">Distance</div>
          <div className="text-cyan-400 font-semibold">{selectedObject.distance} km</div>
        </div>
      </div>

      {/* Confidence Indicators */}
      <div className="space-y-1.5 text-xs font-mono">
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-400">Detection Confidence:</span>
          <span className="text-cyan-400 font-bold">{selectedObject.detectionConfidence}%</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-cyan-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${selectedObject.detectionConfidence}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] pt-1">
          <span className="text-slate-400">Classification Confidence:</span>
          <span className="text-emerald-400 font-bold">{selectedObject.classificationConfidence}%</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${selectedObject.classificationConfidence}%` }}
          />
        </div>
      </div>

      {/* AI Assessment Reasons */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[10px] font-tactical uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
          <Info className="w-3 h-3 text-cyan-400" />
          Tactical Reasoning Rationale:
        </div>
        <ul className="space-y-1 text-[11px] text-slate-300 font-mono">
          {reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-1.5 bg-[#090e18] p-1.5 rounded border border-slate-800/60">
              <span className="text-cyan-400 shrink-0">›</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Important Safety Disclaimer from spec */}
      <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 leading-tight font-mono">
        <strong>SAFETY NOTICE:</strong> These are simulated training indicators only. Software-only tactical simulation.
      </div>
    </div>
  );
};
