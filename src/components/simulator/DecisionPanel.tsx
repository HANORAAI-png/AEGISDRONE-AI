import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Search,
  AlertTriangle,
  Check
} from 'lucide-react';
import { DroneObject, TraineeDecision } from '../../types';
import { playTacticalClick, playAlertChime } from '../../utils/audio';

interface DecisionPanelProps {
  selectedObject: DroneObject | null;
  onSubmitDecision: (decision: TraineeDecision) => void;
  recentDecisions: TraineeDecision[];
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({
  selectedObject,
  onSubmitDecision,
  recentDecisions,
}) => {
  const [assessment, setAssessment] = useState<'Monitor' | 'Investigate' | 'Escalate' | 'Mark as Non-Threat'>('Monitor');
  const [responseAction, setResponseAction] = useState<string>('Continue monitoring');
  const [reactionTimer, setReactionTimer] = useState<number>(0);
  const [submittedFeedback, setSubmittedFeedback] = useState<string | null>(null);

  // Reaction time ticker
  useEffect(() => {
    if (!selectedObject) {
      setReactionTimer(0);
      return;
    }
    const interval = setInterval(() => {
      setReactionTimer((prev) => +(prev + 0.1).toFixed(1));
    }, 100);
    return () => clearInterval(interval);
  }, [selectedObject?.id]);

  const assessmentOptions: Array<{ id: 'Monitor' | 'Investigate' | 'Escalate' | 'Mark as Non-Threat'; label: string; icon: React.ElementType }> = [
    { id: 'Monitor', label: 'Monitor', icon: Eye },
    { id: 'Investigate', label: 'Investigate', icon: Search },
    { id: 'Escalate', label: 'Escalate', icon: AlertTriangle },
    { id: 'Mark as Non-Threat', label: 'Mark as Non-Threat', icon: Check },
  ];

  const trainingResponseOptions = [
    'Continue monitoring',
    'Request additional simulated sensor data',
    'Notify supervisor',
    'Initiate simulated security protocol',
    'Mark as resolved',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedObject) return;

    playTacticalClick();

    // Check correctness against threat level
    let correctness: 'Optimal' | 'Sub-optimal' | 'Delayed' = 'Optimal';
    let feedback = '';

    if (selectedObject.threatLevel === 'HIGH') {
      if (assessment === 'Escalate' || responseAction === 'Initiate simulated security protocol' || responseAction === 'Notify supervisor') {
        correctness = 'Optimal';
        feedback = 'Optimal protocol action. High-severity vector escalated promptly.';
      } else {
        correctness = 'Sub-optimal';
        feedback = 'Sub-optimal: High-threat target required prompt security escalation or supervisor alert.';
      }
    } else if (selectedObject.threatLevel === 'MEDIUM') {
      if (assessment === 'Investigate' || responseAction === 'Request additional simulated sensor data') {
        correctness = 'Optimal';
        feedback = 'Optimal: Requested secondary multi-spectral sensor correlation for ambiguous vector.';
      } else {
        correctness = 'Sub-optimal';
        feedback = 'Acceptable, but sensor data investigation is recommended for medium contacts.';
      }
    } else {
      if (assessment === 'Monitor' || assessment === 'Mark as Non-Threat') {
        correctness = 'Optimal';
        feedback = 'Accurate: Avoided false alarm escalation on low-threat tangential contact.';
      }
    }

    if (reactionTimer > 8.0) {
      correctness = 'Delayed';
      feedback += ' Latency notice: Reaction time exceeded 8.0 seconds.';
    }

    const decision: TraineeDecision = {
      timestamp: new Date().toLocaleTimeString(),
      objectId: selectedObject.id,
      assessment,
      responseAction,
      reactionTimeSeconds: reactionTimer,
      correctness,
      notes: feedback,
    };

    onSubmitDecision(decision);
    setSubmittedFeedback(feedback);
    setTimeout(() => setSubmittedFeedback(null), 4000);
  };

  if (!selectedObject) {
    return (
      <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800 text-xs text-center text-slate-400">
        <p className="font-tactical font-semibold text-slate-300">
          Decision Panel Inactive
        </p>
        <p className="text-[11px] mt-1 text-slate-400">
          Select an active radar contact to log operator threat assessment and protocol responses.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800/80 space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-cyan-400 font-tactical font-bold">
          <CheckSquare className="w-4 h-4" />
          <span>TRAINEE DECISION PANEL</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
          <Clock className="w-3 h-3" />
          <span>Reaction: {reactionTimer.toFixed(1)}s</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Immediate Assessment */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-tactical uppercase tracking-wider text-slate-400 font-semibold">
            1. Operator Threat Assessment:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {assessmentOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = assessment === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    playTacticalClick();
                    setAssessment(opt.id);
                  }}
                  className={`p-2 rounded text-xs text-left flex items-center gap-2 border transition-all ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 font-semibold shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                      : 'bg-[#0e1627] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Training Response Action */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-tactical uppercase tracking-wider text-slate-400 font-semibold">
            2. Select Appropriate Training Response:
          </label>
          <div className="space-y-1.5">
            {trainingResponseOptions.map((action) => (
              <label
                key={action}
                className={`flex items-center gap-2.5 p-2 rounded text-xs cursor-pointer border transition-colors ${
                  responseAction === action
                    ? 'bg-cyan-950/50 border-cyan-500/70 text-cyan-200 font-medium'
                    : 'bg-[#0e1627] border-slate-800/80 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <input
                  type="radio"
                  name="responseAction"
                  value={action}
                  checked={responseAction === action}
                  onChange={() => {
                    playTacticalClick();
                    setResponseAction(action);
                  }}
                  className="accent-cyan-400 w-3.5 h-3.5"
                />
                <span className="font-mono text-[11px]">{action}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Feedback Alert if submitted */}
        {submittedFeedback && (
          <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 font-mono flex items-start gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{submittedFeedback}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-tactical font-bold text-xs rounded transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>SUBMIT OPERATOR DECISION</span>
        </button>
      </form>

      {/* Recent Decisions History Mini-Ticker */}
      {recentDecisions.length > 0 && (
        <div className="pt-2 border-t border-slate-800 space-y-1.5">
          <div className="text-[10px] font-tactical uppercase tracking-wider text-slate-400">
            Logged Operator Actions ({recentDecisions.length})
          </div>
          <div className="max-h-24 overflow-y-auto space-y-1 pr-1 font-mono text-[10px]">
            {recentDecisions.slice(-3).reverse().map((d, i) => (
              <div key={i} className="p-1.5 rounded bg-[#090e18] border border-slate-800 flex items-center justify-between text-slate-300">
                <span className="text-cyan-400 font-semibold">{d.objectId}</span>
                <span className="truncate max-w-[120px]">{d.assessment}</span>
                <span className={d.correctness === 'Optimal' ? 'text-emerald-400' : 'text-amber-400'}>
                  {d.reactionTimeSeconds}s · {d.correctness}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
