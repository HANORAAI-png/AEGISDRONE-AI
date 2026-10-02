import React from 'react';
import { 
  Bot, 
  MessageSquare, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import { TraineeDecision, DroneObject } from '../../types';

interface InstructorPanelProps {
  recentDecisions: TraineeDecision[];
  activeObjects: DroneObject[];
  elapsedSeconds: number;
}

export const InstructorPanel: React.FC<InstructorPanelProps> = ({
  recentDecisions,
  activeObjects,
  elapsedSeconds,
}) => {
  // Generate dynamic contextual observations based on active state
  const lastDecision = recentDecisions[recentDecisions.length - 1];
  const highThreatCount = activeObjects.filter((o) => o.threatLevel === 'HIGH').length;
  const inRestrictedCount = activeObjects.filter((o) => o.inRestrictedZone).length;

  let dynamicAdvice = 'Continuous 360-degree radar scan active. Verify all approaching azimuths.';
  let feedbackQuote = 'System awaiting operator target designations.';

  if (lastDecision) {
    if (lastDecision.correctness === 'Optimal') {
      feedbackQuote = `Decisive action on ${lastDecision.objectId}. Your assessment aligned with standard perimeter rules of engagement.`;
    } else if (lastDecision.correctness === 'Delayed') {
      feedbackQuote = `Decision recorded on ${lastDecision.objectId} at ${lastDecision.reactionTimeSeconds}s. High latency in dense airspace increases perimeter vulnerability.`;
    } else {
      feedbackQuote = `Your action on ${lastDecision.objectId} was recorded. Verify sensor telemetry before finalizing threat level.`;
    }
  } else if (elapsedSeconds > 10 && activeObjects.length > 0) {
    feedbackQuote = `Target acquisition latency: ${activeObjects.length} active contact(s) on radar. Select target to establish track correlation.`;
  }

  if (inRestrictedCount > 0) {
    dynamicAdvice = 'URGENT: Aerial contact has crossed the 500m restricted training zone boundary! Issue simulated security notification.';
  } else if (highThreatCount > 1) {
    dynamicAdvice = 'Prioritize triage: Multiple high-threat inbound vectors detected simultaneously.';
  } else if (activeObjects.length > 3) {
    dynamicAdvice = 'Multi-target environment: Avoid target fixation on tangential decoys.';
  }

  return (
    <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800/80 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-cyan-400 font-tactical font-bold">
          <Bot className="w-4 h-4" />
          <span>AI INSTRUCTOR OVERWATCH</span>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
          Real-Time Observer
        </span>
      </div>

      {/* Main Quote Block */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-[#0d1628] to-[#091120] border border-cyan-800/30 space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400">
          <Sparkles className="w-3 h-3" />
          <span>EVALUATION OBSERVATION</span>
        </div>
        <p className="text-xs text-slate-200 font-sans italic leading-relaxed">
          &ldquo;{feedbackQuote}&rdquo;
        </p>
      </div>

      {/* Tactical Directive */}
      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-cyan-400" />
          <span>Tactical Cue:</span>
        </div>
        <div className="text-[11px] text-slate-300">
          {dynamicAdvice}
        </div>
      </div>

      {/* Historical Performance Delta */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          Response latency vs baseline:
        </span>
        <span className="text-emerald-400 font-bold tabular-nums">
          +18% Improved
        </span>
      </div>
    </div>
  );
};
