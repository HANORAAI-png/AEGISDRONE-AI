import React from 'react';
import { 
  Users, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  BrainCircuit, 
  Play, 
  Sparkles,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { playTacticalClick } from '../../utils/audio';
import { TraineeProfile } from '../../types';

interface TrainerDashboardProps {
  trainees: TraineeProfile[];
  onOpenGenerator: () => void;
  onLaunchSimulation: (scenarioId?: string) => void;
  onOpenAdaptiveModal: () => void;
  onViewTrainee: (trainee: TraineeProfile) => void;
  onViewReport: () => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({
  trainees,
  onOpenGenerator,
  onLaunchSimulation,
  onOpenAdaptiveModal,
  onViewTrainee,
  onViewReport,
}) => {
  // Aggregate statistics
  const totalTrainees = 24;
  const totalSessions = 142;
  const avgDetectionAccuracy = 91.4;
  const avgDecisionAccuracy = 86.8;
  const completionRate = 94.2;
  const improvementTrend = '+14.5%';

  // Recent training sessions from spec
  const recentSessions = [
    {
      operator: 'Operator 01',
      scenario: 'Airport Perimeter',
      score: 87,
      status: 'Completed',
      timeAgo: '18 min ago',
      level: 'Intermediate',
      trend: '+4%',
    },
    {
      operator: 'Operator 02',
      scenario: 'Industrial Facility',
      score: 74,
      status: 'Needs Improvement',
      timeAgo: '1 hour ago',
      level: 'Beginner',
      trend: '-2%',
    },
    {
      operator: 'Operator 03',
      scenario: 'Government Facility',
      score: 92,
      status: 'Completed',
      timeAgo: '3 hours ago',
      level: 'Expert',
      trend: '+8%',
    },
    {
      operator: 'Operator 01',
      scenario: 'Critical Infrastructure',
      score: 89,
      status: 'Completed',
      timeAgo: 'Yesterday',
      level: 'Intermediate',
      trend: '+5%',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-[#0d1627] to-[#09101d] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            OPERATIONS SUPERVISOR CONSOLE
          </div>
          <h1 className="font-tactical text-2xl font-bold text-slate-100 mt-1">
            Trainer Command &amp; Readiness Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Monitor operator performance, calibrate adaptive AI scenarios, and evaluate threat response metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playTacticalClick();
              onOpenAdaptiveModal();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded bg-cyan-950/70 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 text-xs font-tactical font-semibold transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)] whitespace-nowrap"
          >
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            <span>Generate Adaptive Scenario</span>
          </button>

          <button
            onClick={() => {
              playTacticalClick();
              onLaunchSimulation();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-tactical font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Training Sim</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (6 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Trainees */}
        <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-tactical uppercase tracking-wider">Total Trainees</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-100 tabular-nums">
            {totalTrainees}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">3 Squads Active</div>
        </div>

        {/* Training Sessions */}
        <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-tactical uppercase tracking-wider">Training Sessions</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-cyan-300 tabular-nums">
            {totalSessions}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">+18 this week</div>
        </div>

        {/* Avg Detection Accuracy */}
        <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-tactical uppercase tracking-wider">Detection Acc.</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {avgDetectionAccuracy}%
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1">+2.1% from baseline</div>
        </div>

        {/* Avg Decision Accuracy */}
        <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-tactical uppercase tracking-wider">Decision Acc.</span>
            <CheckCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-cyan-400 tabular-nums">
            {avgDecisionAccuracy}%
          </div>
          <div className="text-[10px] text-cyan-400/80 mt-1">Protocol compliance</div>
        </div>

        {/* Scenario Completion Rate */}
        <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-tactical uppercase tracking-wider">Completion Rate</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-amber-300 tabular-nums">
            {completionRate}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">5.8 min avg duration</div>
        </div>

        {/* Improvement Trend */}
        <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-tactical uppercase tracking-wider">Improvement</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-300 tabular-nums">
            {improvementTrend}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1">Last 30 days</div>
        </div>
      </div>

      {/* Main Content Grid: Recent Sessions & Trainee Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Training Sessions */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-[#0a101c] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-tactical text-base font-bold text-slate-100">
                Recent Training Sessions
              </h2>
              <p className="text-xs text-slate-400">
                Evaluated operator exercises with simulated threat outcomes.
              </p>
            </div>
            <button
              onClick={() => {
                playTacticalClick();
                onViewReport();
              }}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Full Reports Log</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-tactical uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-3">Operator</th>
                  <th className="py-2.5 px-3">Scenario</th>
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {recentSessions.map((session, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {session.operator}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {session.scenario}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {session.level}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold tabular-nums ${
                        session.score >= 85 ? 'text-emerald-400' : session.score >= 75 ? 'text-cyan-400' : 'text-amber-400'
                      }`}>
                        {session.score}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-sans ${
                        session.status === 'Completed'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                      }`}>
                        {session.status === 'Completed' ? (
                          <CheckCircle className="w-2.5 h-2.5" />
                        ) : (
                          <AlertTriangle className="w-2.5 h-2.5" />
                        )}
                        {session.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 text-[11px]">
                      {session.timeAgo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Scenario Launch Bar */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-slate-400">Recommended Next Step:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playTacticalClick();
                  onOpenGenerator();
                }}
                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-tactical font-medium transition-colors"
              >
                Custom Scenario Creator &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Trainees & Adaptive Recommendations */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Trainee Profiles */}
          <div className="p-5 rounded-xl bg-[#0a101c] border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-tactical text-base font-bold text-slate-100">
                Trainee Roster
              </h2>
              <span className="text-[10px] font-mono text-cyan-400">Ready for Exercise</span>
            </div>

            <div className="space-y-2.5">
              {trainees.map((trainee) => (
                <div 
                  key={trainee.id}
                  onClick={() => {
                    playTacticalClick();
                    onViewTrainee(trainee);
                  }}
                  className="p-3 rounded-lg bg-[#0e1626] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-cyan-400 text-xs">
                      {trainee.id.replace('OP-', '')}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{trainee.name}</div>
                      <div className="text-[10px] text-slate-400">{trainee.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-cyan-400 tabular-nums">
                      {trainee.overallAccuracy}%
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {trainee.sessionsCompleted} sess.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adaptive Training Engine Teaser Card */}
          <div className="p-5 rounded-xl bg-gradient-to-b from-[#0e1a30] to-[#091120] border border-cyan-800/40 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-tactical font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>AI ADAPTIVE RECOMMENDATION</span>
            </div>
            <h3 className="font-tactical text-sm font-bold text-slate-100">
              Decision-Making Under Multiple-Object Conditions
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on Operator 01&apos;s recent delay on simultaneous targets, the engine prescribes an adverse weather exercise with 4 inbound contacts.
            </p>
            <button
              onClick={() => {
                playTacticalClick();
                onOpenAdaptiveModal();
              }}
              className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded text-xs font-tactical font-bold transition-colors"
            >
              Inspect Adaptive Curriculum &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
