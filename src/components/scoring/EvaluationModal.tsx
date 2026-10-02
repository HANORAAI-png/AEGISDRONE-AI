import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  BrainCircuit, 
  TrendingUp, 
  Clock,
  Printer,
  X
} from 'lucide-react';
import { SessionEvaluation, ScenarioConfig } from '../../types';
import { playTacticalClick } from '../../utils/audio';

interface EvaluationModalProps {
  evaluation: SessionEvaluation;
  onClose: () => void;
  onLaunchAdaptiveScenario: (scenario: ScenarioConfig) => void;
  onViewReport: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  evaluation,
  onClose,
  onLaunchAdaptiveScenario,
  onViewReport,
}) => {
  const isPassing = evaluation.overallScore >= 75;

  const handleLaunchRecommended = () => {
    playTacticalClick();
    if (evaluation.adaptiveRecommendation) {
      const rec = evaluation.adaptiveRecommendation;
      const recScenario: ScenarioConfig = {
        id: `SCN-ADAPT-${Math.floor(Math.random() * 899 + 100)}`,
        codename: 'ADAPTIVE CYCLE 02',
        title: rec.recommendedTitle,
        environment: rec.environment,
        time: rec.time,
        weather: rec.weather,
        difficulty: rec.difficulty,
        objectCount: rec.objectCount,
        objective: 'Multi-object Monitoring',
        description: rec.rationale,
        visibilityKm: rec.weather === 'Fog' ? 0.8 : 2.5,
        sensorDegradation: 'Dynamic clutter calibrated to target weakness profile',
        tacticalDirectives: [
          `Focus on ${rec.focusSkill}`,
          'Maintain multi-target situational scan across 360°',
          'Execute prompt reporting to perimeter command',
        ],
        estimatedDurationMin: 6,
      };
      onLaunchAdaptiveScenario(recScenario);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-xl bg-[#0a101c] border border-cyan-500/50 p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-400 font-tactical font-bold">
            <Award className="w-5 h-5 text-cyan-400" />
            <span>AI PERFORMANCE EVALUATION &amp; SCORING</span>
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

        {/* Overall Score Banner */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-[#0d172a] via-[#0b1424] to-[#080e1b] border border-cyan-900/60 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-mono text-cyan-400">
              OPERATOR PERFORMANCE DEBRIEF · {evaluation.traineeName}
            </div>
            <h2 className="font-tactical text-2xl font-bold text-slate-100">
              {evaluation.scenarioTitle}
            </h2>
            <div className="text-xs text-slate-400 font-mono">
              Duration: {Math.round(evaluation.durationSeconds)}s · Timestamp: {evaluation.timestamp}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#070b13] border border-slate-800 min-w-[140px]">
            <div className="text-[10px] font-tactical uppercase tracking-wider text-slate-400">
              Overall Score
            </div>
            <div className={`font-mono text-4xl font-extrabold tabular-nums ${
              isPassing ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {evaluation.overallScore}%
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              {isPassing ? '● MET BENCHMARK' : '▲ NEEDS REINFORCEMENT'}
            </div>
          </div>
        </div>

        {/* Score Breakdown Grid (spec section 11) */}
        <div className="space-y-2">
          <div className="text-xs font-tactical uppercase tracking-wider text-slate-400 font-semibold">
            Performance Breakdown:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#0e1627] border border-slate-800">
              <div className="text-[10px] text-slate-400">Detection</div>
              <div className="text-lg font-bold text-cyan-400 tabular-nums">{evaluation.detectionAccuracy}%</div>
              <div className="w-full bg-slate-800 h-1 rounded mt-1.5 overflow-hidden">
                <div className="bg-cyan-400 h-full rounded" style={{ width: `${evaluation.detectionAccuracy}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0e1627] border border-slate-800">
              <div className="text-[10px] text-slate-400">Identification</div>
              <div className="text-lg font-bold text-emerald-400 tabular-nums">{evaluation.identificationAccuracy}%</div>
              <div className="w-full bg-slate-800 h-1 rounded mt-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded" style={{ width: `${evaluation.identificationAccuracy}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0e1627] border border-slate-800">
              <div className="text-[10px] text-slate-400">Tracking</div>
              <div className="text-lg font-bold text-cyan-300 tabular-nums">{evaluation.trackingAccuracy}%</div>
              <div className="w-full bg-slate-800 h-1 rounded mt-1.5 overflow-hidden">
                <div className="bg-cyan-300 h-full rounded" style={{ width: `${evaluation.trackingAccuracy}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0e1627] border border-slate-800">
              <div className="text-[10px] text-slate-400">Decision</div>
              <div className="text-lg font-bold text-amber-300 tabular-nums">{evaluation.decisionAccuracy}%</div>
              <div className="w-full bg-slate-800 h-1 rounded mt-1.5 overflow-hidden">
                <div className="bg-amber-300 h-full rounded" style={{ width: `${evaluation.decisionAccuracy}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0e1627] border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400">Reaction Time</div>
              <div className="text-lg font-bold text-slate-200 tabular-nums">{evaluation.avgReactionTime}s</div>
              <div className="text-[10px] text-emerald-400 mt-1">Within standard</div>
            </div>
          </div>
        </div>

        {/* Strengths & Areas for Improvement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-[#09121f] border border-emerald-900/50 space-y-2">
            <div className="text-[11px] font-tactical uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Observed Strengths
            </div>
            <ul className="space-y-1 text-slate-300">
              {evaluation.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400">✔</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-lg bg-[#140f1a] border border-amber-900/50 space-y-2">
            <div className="text-[11px] font-tactical uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Identified Primary Weakness
            </div>
            <div className="font-bold text-amber-300 text-sm">
              {evaluation.primaryWeakness}
            </div>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              {evaluation.areasForImprovement.map((area, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400">›</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Adaptive Training Recommendation (The USP) */}
        {evaluation.adaptiveRecommendation && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0c1a2f] to-[#091322] border border-cyan-500/50 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-tactical font-bold">
                <BrainCircuit className="w-4 h-4" />
                <span>ADAPTIVE TRAINING ENGINE RECOMMENDATION (USP)</span>
              </div>
              <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                Calibrated Level: {evaluation.adaptiveRecommendation.adaptiveLevel}/5
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-400">Target Weakness Prescribed Exercise:</div>
              <div className="font-tactical text-base font-bold text-slate-100">
                {evaluation.adaptiveRecommendation.recommendedTitle}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {evaluation.adaptiveRecommendation.rationale}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
              <div className="text-[11px] font-mono text-slate-400">
                Parameters: {evaluation.adaptiveRecommendation.environment} · {evaluation.adaptiveRecommendation.weather} · {evaluation.adaptiveRecommendation.objectCount} Contacts
              </div>

              <button
                onClick={handleLaunchRecommended}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-tactical font-bold text-xs rounded transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] whitespace-nowrap"
              >
                <span>Launch Adaptive Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Disclaimer & Actions */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-[10px] font-mono text-slate-500">
            * Simulated training performance score only. Not a real-world defence certification.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playTacticalClick();
                onViewReport();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-tactical transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Generate Instructor Report</span>
            </button>

            <button
              onClick={() => {
                playTacticalClick();
                onClose();
              }}
              className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-tactical font-semibold transition-colors"
            >
              Close Debrief
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
