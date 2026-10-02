import React from 'react';
import { 
  User, 
  Award, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { TraineeProfile } from '../../types';
import { playTacticalClick } from '../../utils/audio';

interface TraineeProfileViewProps {
  trainee: TraineeProfile;
  allTrainees: TraineeProfile[];
  onSelectTrainee: (trainee: TraineeProfile) => void;
  onLaunchPractice: () => void;
}

export const TraineeProfileView: React.FC<TraineeProfileViewProps> = ({
  trainee,
  allTrainees,
  onSelectTrainee,
  onLaunchPractice,
}) => {
  // Simulated longitudinal score points across 18 sessions
  const progressPoints = [
    { sess: 'S1', score: 62 },
    { sess: 'S3', score: 68 },
    { sess: 'S6', score: 72 },
    { sess: 'S9', score: 75 },
    { sess: 'S12', score: 81 },
    { sess: 'S15', score: 84 },
    { sess: 'S18', score: 87 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header and Trainee Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <User className="w-3.5 h-3.5" />
            OPERATOR READINESS RECORD
          </div>
          <h1 className="font-tactical text-2xl font-bold text-slate-100 mt-1">
            Trainee Profile: {trainee.name} ({trainee.callsign})
          </h1>
          <p className="text-xs text-slate-400">
            Comprehensive historical telemetry, longitudinal progress tracking, and AI-identified training focus.
          </p>
        </div>

        {/* Trainee Switcher Pills */}
        <div className="flex items-center gap-2 p-1 bg-[#0a101c] border border-slate-800 rounded-lg text-xs font-tactical">
          {allTrainees.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                playTacticalClick();
                onSelectTrainee(t);
              }}
              className={`px-3 py-1.5 rounded transition-all ${
                t.id === trainee.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Trainee Stats Card */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#0a101c] border border-slate-800/80 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#0e1627] border border-cyan-500/40 flex items-center justify-center font-tactical text-xl font-bold text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              {trainee.id.replace('OP-', '')}
            </div>
            <div>
              <div className="font-tactical text-lg font-bold text-slate-100">{trainee.name}</div>
              <div className="text-xs text-cyan-400 font-mono">{trainee.role}</div>
              <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                <span>{trainee.sessionsCompleted} Sessions Completed</span>
                <span>·</span>
                <span className="text-emerald-400">{trainee.currentLevel} Level</span>
              </div>
            </div>
          </div>

          {/* Metric Gauges */}
          <div className="space-y-3 pt-3 border-t border-slate-800 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Detection Accuracy:</span>
                <span className="text-cyan-400 font-bold tabular-nums">{trainee.detectionAccuracy}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded" style={{ width: `${trainee.detectionAccuracy}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Tracking Accuracy:</span>
                <span className="text-cyan-300 font-bold tabular-nums">{trainee.trackingAccuracy}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-300 h-full rounded" style={{ width: `${trainee.trackingAccuracy}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Decision Accuracy:</span>
                <span className="text-amber-400 font-bold tabular-nums">{trainee.decisionAccuracy}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded" style={{ width: `${trainee.decisionAccuracy}%` }} />
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses Cards */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
            <div className="p-3 rounded bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 space-y-1">
              <div className="text-[10px] uppercase font-bold flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Demonstrated Strength:
              </div>
              <div>{trainee.strength}</div>
            </div>

            <div className="p-3 rounded bg-amber-950/30 border border-amber-800/40 text-amber-300 space-y-1">
              <div className="text-[10px] uppercase font-bold flex items-center gap-1.5 text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                Target Practice Weakness:
              </div>
              <div>{trainee.needsImprovement}</div>
            </div>
          </div>

          <button
            onClick={() => {
              playTacticalClick();
              onLaunchPractice();
            }}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-tactical font-bold text-xs rounded transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)]"
          >
            Launch Targeted Weakness Exercise &rarr;
          </button>
        </div>

        {/* Right Column: Progress Over Time & Session History */}
        <div className="lg:col-span-7 space-y-6">
          {/* Progress Chart SVG */}
          <div className="p-5 rounded-xl bg-[#0a101c] border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-tactical text-base font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Longitudinal Performance Trend
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Session 1 &rarr; Session 18 (Score Improvement: +25% Overall)
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                Steady Ascending Trajectory
              </span>
            </div>

            {/* Responsive SVG Line Chart */}
            <div className="w-full h-44 bg-[#060910] rounded-lg p-3 border border-slate-800/80 flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120">
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                {/* Score polygon area */}
                <polygon
                  points="0,110 0,90 80,78 160,70 240,64 320,50 400,42 480,34 480,110"
                  fill="rgba(6, 182, 212, 0.12)"
                />

                {/* Trend line */}
                <polyline
                  points="0,90 80,78 160,70 240,64 320,50 400,42 480,34"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                />

                {/* Dots with labels */}
                {progressPoints.map((pt, i) => {
                  const x = (i / (progressPoints.length - 1)) * 480;
                  const y = 110 - ((pt.score - 50) / 50) * 90;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={x} y={y - 8} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                        {pt.score}%
                      </text>
                      <text x={x} y={118} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        {pt.sess}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Historical Session Log Table */}
          <div className="p-5 rounded-xl bg-[#0a101c] border border-slate-800/80 space-y-3">
            <h2 className="font-tactical text-base font-bold text-slate-100">
              Evaluated Training Session Log
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Scenario</th>
                    <th className="py-2 px-3">Score</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Primary Observation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {trainee.sessionHistory.map((sess) => (
                    <tr key={sess.sessionId} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 text-slate-400">{sess.date}</td>
                      <td className="py-2.5 px-3 text-slate-200 font-semibold">{sess.scenario}</td>
                      <td className="py-2.5 px-3">
                        <span className={`font-bold tabular-nums ${
                          sess.score >= 85 ? 'text-emerald-400' : 'text-cyan-400'
                        }`}>
                          {sess.score}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                          {sess.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">{sess.weakness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
