import React from 'react';
import { 
  Printer, 
  FileText, 
  ShieldCheck, 
  Award, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { TraineeProfile, SessionEvaluation, ScenarioConfig } from '../../types';
import { playTacticalClick } from '../../utils/audio';

interface InstructorReportViewProps {
  trainee: TraineeProfile;
  latestEvaluation: SessionEvaluation | null;
  onLaunchAdaptive: (scenario: ScenarioConfig) => void;
}

export const InstructorReportView: React.FC<InstructorReportViewProps> = ({
  trainee,
  latestEvaluation,
  onLaunchAdaptive,
}) => {
  const handlePrint = () => {
    playTacticalClick();
    window.print();
  };

  const reportData = latestEvaluation || {
    scenarioId: 'SCN-AIR-01',
    scenarioTitle: 'Airport Perimeter Surveillance – Advanced',
    traineeId: trainee.id,
    traineeName: trainee.name,
    timestamp: '2026-10-01 21:00:00 UTC',
    durationSeconds: 384,
    detectionAccuracy: 92,
    identificationAccuracy: 86,
    trackingAccuracy: 78,
    decisionAccuracy: 84,
    avgReactionTime: 3.1,
    falseAlarms: 0,
    missedTargets: 0,
    overallScore: 85,
    strengths: [
      'Fast initial object acquisition on radar horizon',
      'Consistent multi-sensor tracking and vector maintenance',
      'Disciplined adherence to perimeter security rules of engagement',
    ],
    areasForImprovement: [
      'Multi-object prioritization under simultaneous azimuth ingress',
      'Decision speed under sensor ambiguity and fog obscuration',
    ],
    instructorQuotes: [
      'You detected the primary target rapidly, though initial optical confirmation took longer than baseline.',
      'Decisions conformed with perimeter guidelines without generating false escalations.',
    ],
    primaryWeakness: 'Multi-Object Tracking Under Clutter',
    adaptiveRecommendation: {
      adaptiveLevel: 4,
      recommendedTitle: 'Nighttime Airport – Multi-Object Detection',
      rationale: 'Calibrated to challenge multi-target prioritization under low optical contrast.',
      environment: 'Airport' as const,
      weather: 'Fog' as const,
      time: 'Night' as const,
      objectCount: 5,
      difficulty: 'Advanced' as const,
      focusSkill: 'Decision-Making Under Multiple-Object Conditions',
    },
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Top Header Actions (hidden in print) */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <FileText className="w-3.5 h-3.5" />
            OFFICIAL EVALUATION DOSSIER
          </div>
          <h1 className="font-tactical text-2xl font-bold text-slate-100 mt-1">
            Instructor Performance Report
          </h1>
          <p className="text-xs text-slate-400">
            Standardized evaluation record for security training records and operator credentialing logs.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-tactical font-bold text-xs rounded transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)]"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF Report</span>
        </button>
      </div>

      {/* The Printable Report Document Page */}
      <div className="max-w-4xl mx-auto p-8 rounded-xl bg-[#090d16] border border-slate-700/80 shadow-2xl space-y-6 text-slate-200 font-sans print:bg-white print:text-black print:border-none print:p-0 print:shadow-none">
        {/* Document Header with Security Banner */}
        <div className="border-b-2 border-slate-700 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-cyan-950 border border-cyan-500/50 flex items-center justify-center font-tactical font-bold text-cyan-400 text-lg print:border-black print:text-black">
              AEGIS
            </div>
            <div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest print:text-slate-600">
                Airspace Defence Simulation Command
              </div>
              <h2 className="font-tactical text-xl font-bold tracking-wide">
                TRAINING PERFORMANCE EVALUATION REPORT
              </h2>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 print:text-slate-600">
            <div>DOC ID: <span className="font-bold text-slate-200 print:text-black">REP-{reportData.scenarioId}-2026</span></div>
            <div>STATUS: <span className="text-emerald-400 font-bold print:text-emerald-700">VERIFIED</span></div>
          </div>
        </div>

        {/* Trainee & Exercise Metadata Block */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-[#0e1627] border border-slate-800 text-xs font-mono print:bg-slate-50 print:border-slate-300">
          <div>
            <div className="text-slate-400 text-[10px]">Trainee Name:</div>
            <div className="font-bold text-slate-100 print:text-black">{reportData.traineeName}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">Operator ID:</div>
            <div className="font-bold text-cyan-400 print:text-slate-800">{reportData.traineeId}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">Scenario:</div>
            <div className="font-bold text-slate-100 print:text-black truncate">{reportData.scenarioTitle}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">Evaluation Date:</div>
            <div className="text-slate-300 print:text-slate-700">{reportData.timestamp}</div>
          </div>
        </div>

        {/* Score & Rating Banner */}
        <div className="p-6 rounded-lg bg-gradient-to-r from-[#0c1a2f] to-[#081220] border border-cyan-800/40 flex items-center justify-between print:bg-slate-100 print:border-slate-300">
          <div>
            <div className="text-xs font-tactical uppercase tracking-wider text-cyan-400 print:text-slate-700">
              Aggregated Performance Rating
            </div>
            <div className="text-sm text-slate-300 mt-1 print:text-slate-700">
              Comprehensive evaluation of acquisition, tracking fidelity, threat triage, and rules of engagement.
            </div>
          </div>

          <div className="text-center pl-6 border-l border-slate-700">
            <div className="font-mono text-5xl font-extrabold text-emerald-400 tabular-nums print:text-emerald-700">
              {reportData.overallScore}%
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1 print:text-slate-600">
              COMPETENCY LEVEL: {reportData.overallScore >= 80 ? 'PROFICIENT' : 'NEEDS REINFORCEMENT'}
            </div>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="space-y-2">
          <div className="text-xs font-tactical uppercase tracking-wider text-slate-400 font-semibold print:text-slate-700">
            Quantitative Performance Metrics:
          </div>
          <table className="w-full text-left text-xs font-mono border border-slate-800 rounded-lg overflow-hidden print:border-slate-300">
            <thead className="bg-[#0e1627] text-slate-400 print:bg-slate-100 print:text-slate-700 border-b border-slate-800 print:border-slate-300">
              <tr>
                <th className="py-2.5 px-3">Evaluation Parameter</th>
                <th className="py-2.5 px-3">Operator Score</th>
                <th className="py-2.5 px-3">Target Benchmark</th>
                <th className="py-2.5 px-3 text-right">Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-slate-200">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-200 print:text-black">Detection Accuracy</td>
                <td className="py-2.5 px-3 font-bold text-cyan-400 print:text-slate-800">{reportData.detectionAccuracy}%</td>
                <td className="py-2.5 px-3 text-slate-400 print:text-slate-600">80.0%</td>
                <td className="py-2.5 px-3 text-right text-emerald-400 print:text-emerald-700">Exceeded (+12%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-200 print:text-black">Identification Accuracy</td>
                <td className="py-2.5 px-3 font-bold text-emerald-400 print:text-slate-800">{reportData.identificationAccuracy}%</td>
                <td className="py-2.5 px-3 text-slate-400 print:text-slate-600">75.0%</td>
                <td className="py-2.5 px-3 text-right text-emerald-400 print:text-emerald-700">Exceeded (+11%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-200 print:text-black">Tracking Accuracy</td>
                <td className="py-2.5 px-3 font-bold text-cyan-300 print:text-slate-800">{reportData.trackingAccuracy}%</td>
                <td className="py-2.5 px-3 text-slate-400 print:text-slate-600">75.0%</td>
                <td className="py-2.5 px-3 text-right text-cyan-400 print:text-cyan-700">Met Target (+3%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-200 print:text-black">Decision Accuracy</td>
                <td className="py-2.5 px-3 font-bold text-amber-300 print:text-slate-800">{reportData.decisionAccuracy}%</td>
                <td className="py-2.5 px-3 text-slate-400 print:text-slate-600">80.0%</td>
                <td className="py-2.5 px-3 text-right text-emerald-400 print:text-emerald-700">Exceeded (+4%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-200 print:text-black">Average Reaction Latency</td>
                <td className="py-2.5 px-3 font-bold text-slate-200 print:text-black">{reportData.avgReactionTime}s</td>
                <td className="py-2.5 px-3 text-slate-400 print:text-slate-600">&lt; 4.0s</td>
                <td className="py-2.5 px-3 text-right text-emerald-400 print:text-emerald-700">Optimal (3.1s)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Strengths & Areas for Improvement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-[#09121f] border border-emerald-900/50 space-y-2 print:bg-emerald-50 print:border-emerald-300">
            <div className="text-[11px] font-tactical uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5 print:text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              Observed Strengths
            </div>
            <ul className="space-y-1.5 text-slate-300 print:text-slate-800">
              {reportData.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 print:text-emerald-700">✔</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-[#140f1a] border border-amber-900/50 space-y-2 print:bg-amber-50 print:border-amber-300">
            <div className="text-[11px] font-tactical uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5 print:text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              Targeted Improvement Areas
            </div>
            <ul className="space-y-1.5 text-slate-300 print:text-slate-800">
              {reportData.areasForImprovement.map((area, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400 print:text-amber-700">›</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prescribed Next Training Milestone */}
        {reportData.adaptiveRecommendation && (
          <div className="p-4 rounded-lg bg-[#0e1627] border border-slate-800 text-xs font-mono space-y-1.5 print:bg-slate-50 print:border-slate-300">
            <div className="text-[10px] uppercase font-bold text-cyan-400 print:text-slate-800">
              Adaptive Training Engine Recommendation:
            </div>
            <div className="text-sm font-bold text-slate-100 print:text-black">
              {reportData.adaptiveRecommendation.recommendedTitle}
            </div>
            <p className="text-slate-400 print:text-slate-700">
              {reportData.adaptiveRecommendation.rationale}
            </p>
          </div>
        )}

        {/* Instructor Endorsement & Signature */}
        <div className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
          <div>
            <div className="text-slate-400 text-[10px] print:text-slate-600">Simulated Training Certification:</div>
            <div className="text-slate-200 font-semibold print:text-black">AegisDrone AI Tactical Systems Validator</div>
            <div className="text-[10px] text-slate-500 print:text-slate-600">Smart India Hackathon Software-Only Evaluation Suite</div>
          </div>

          <div className="text-right">
            <div className="border-b border-slate-600 w-48 pb-1 mb-1 font-tactical italic text-cyan-400 print:text-slate-900 print:border-slate-800">
              Capt. V. Sharma (AI Senior Instructor)
            </div>
            <div className="text-[10px] text-slate-400 print:text-slate-600">Digital Authentication Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
};
