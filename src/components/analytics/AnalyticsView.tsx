import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Target, 
  Clock, 
  ShieldAlert, 
  Activity,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { playTacticalClick } from '../../utils/audio';

export const AnalyticsView: React.FC = () => {
  // Chart 1: Performance over last 8 weeks
  const weeklyTrends = [
    { week: 'W1', score: 68, latency: 4.6 },
    { week: 'W2', score: 71, latency: 4.4 },
    { week: 'W3', score: 74, latency: 4.1 },
    { week: 'W4', score: 77, latency: 3.9 },
    { week: 'W5', score: 82, latency: 3.6 },
    { week: 'W6', score: 85, latency: 3.4 },
    { week: 'W7', score: 88, latency: 3.2 },
    { week: 'W8', score: 91, latency: 2.9 },
  ];

  // Radar spider chart dimensions for 5 skill competencies
  // Detection, Identification, Tracking, Decision, Protocol
  const competencies = [
    { label: 'DETECTION', score: 92, benchmark: 80 },
    { label: 'IDENTIFICATION', score: 86, benchmark: 78 },
    { label: 'TRACKING', score: 78, benchmark: 75 },
    { label: 'DECISION SPEED', score: 84, benchmark: 72 },
    { label: 'PROTOCOL ADHERENCE', score: 90, benchmark: 85 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <BarChart3 className="w-3.5 h-3.5" />
          SQUADRON TELEMETRY &amp; READINESS ANALYTICS
        </div>
        <h1 className="font-tactical text-2xl font-bold text-slate-100 mt-1">
          Operational Training Analytics
        </h1>
        <p className="text-xs text-slate-400">
          Aggregated quantitative metrics across 142 simulated exercises, measuring cognitive load, reaction latencies, and threat classification accuracy.
        </p>
      </div>

      {/* AI-Generated Analytical Summary Card from Spec */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#0d1a2f] via-[#0b1526] to-[#080f1c] border border-cyan-500/40 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
          <Sparkles className="w-4 h-4" />
          <span>AI SYNTHESIZED EXECUTIVE SUMMARY</span>
        </div>
        <p className="text-sm text-slate-200 font-sans italic leading-relaxed">
          &ldquo;Overall squadron performance has improved by 14.5% across the last 10 sessions. Trainee detection speed and radar horizon acquisition remain exceptionally strong, while multi-object tracking under simultaneous azimuth incursions remains the primary area for targeted curricular practice.&rdquo;
        </p>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 pt-1 border-t border-slate-800">
          <span>Confidence: 94%</span>
          <span>·</span>
          <span>Sample Size: 142 Sessions</span>
          <span>·</span>
          <span className="text-emerald-400">Zero False Alarm Escalations in Last 48 hrs</span>
        </div>
      </div>

      {/* Top 4 Metric Summaries */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800">
          <div className="text-[11px] text-slate-400">Avg Reaction Time</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">3.1s</div>
          <div className="text-[10px] text-emerald-400 mt-1">&darr; 0.8s vs baseline</div>
        </div>

        <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800">
          <div className="text-[11px] text-slate-400">False Alarm Rate</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">2.4%</div>
          <div className="text-[10px] text-emerald-400 mt-1">Target &lt; 5.0%</div>
        </div>

        <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800">
          <div className="text-[11px] text-slate-400">Missed Detections</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">0.8%</div>
          <div className="text-[10px] text-cyan-400 mt-1">Near zero threshold</div>
        </div>

        <div className="p-4 rounded-lg bg-[#0a101c] border border-slate-800">
          <div className="text-[11px] text-slate-400">Curricular Mastery</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">86.2%</div>
          <div className="text-[10px] text-slate-400 mt-1">Level 3.8/5.0 Squad Avg</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart (7 cols): Performance & Latency over time */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#0a101c] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-tactical text-base font-bold text-slate-100">
                Score vs Reaction Latency Trend
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Inverse correlation: Higher scores correlate with lower operator decision delays.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              8-Week Cohort
            </span>
          </div>

          {/* SVG Multi-Axis Chart */}
          <div className="w-full h-56 bg-[#060910] rounded-lg p-3 border border-slate-800 flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 520 160">
              {/* Grid lines */}
              <line x1="20" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="20" y1="70" x2="500" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="20" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

              {/* Bars for Latency */}
              {weeklyTrends.map((wt, i) => {
                const x = 30 + i * 60;
                const barH = (wt.latency / 5) * 80;
                const barY = 140 - barH;
                return (
                  <g key={i}>
                    <rect
                      x={x - 10}
                      y={barY}
                      width={20}
                      height={barH}
                      fill="rgba(245, 158, 11, 0.25)"
                      stroke="rgba(245, 158, 11, 0.6)"
                      rx="2"
                    />
                    <text x={x} y={154} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      {wt.week}
                    </text>
                  </g>
                );
              })}

              {/* Score Trend Polyline */}
              <polyline
                points="30,85 90,78 150,71 210,64 270,52 330,44 390,38 450,28"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />

              {/* Dots on line */}
              {weeklyTrends.map((wt, i) => {
                const x = 30 + i * 60;
                const y = 140 - ((wt.score - 50) / 50) * 110;
                return (
                  <circle key={i} cx={x} cy={y} r="3.5" fill="#22d3ee" stroke="#ffffff" strokeWidth="1" />
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-400 inline-block" />
              Training Score % (Cyan line)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-500/60 inline-block" />
              Reaction Latency (Amber bars, sec)
            </span>
          </div>
        </div>

        {/* Right Chart (5 cols): Competency Spider / Polygon Radar */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#0a101c] border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-tactical text-base font-bold text-slate-100">
              5-Axis Skill Radar vs Benchmark
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Calibrated defence operator proficiency matrix.
            </p>
          </div>

          {/* SVG Spider Radar */}
          <div className="w-full flex items-center justify-center py-2">
            <svg width="240" height="240" viewBox="0 0 240 240" className="overflow-visible">
              {/* Outer boundary polygons (5 concentric pentagons) */}
              {[40, 70, 95].map((r, idx) => {
                const pts = [0, 1, 2, 3, 4].map((i) => {
                  const angle = (i * 72 - 90) * (Math.PI / 180);
                  return `${120 + Math.cos(angle) * r},${120 + Math.sin(angle) * r}`;
                }).join(' ');
                return (
                  <polygon
                    key={idx}
                    points={pts}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Radial spoke lines */}
              {[0, 1, 2, 3, 4].map((i) => {
                const angle = (i * 72 - 90) * (Math.PI / 180);
                return (
                  <line
                    key={i}
                    x1="120"
                    y1="120"
                    x2={120 + Math.cos(angle) * 95}
                    y2={120 + Math.sin(angle) * 95}
                    stroke="rgba(6, 182, 212, 0.15)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Trainee competency filled polygon */}
              {(() => {
                const traineePts = competencies.map((c, i) => {
                  const r = (c.score / 100) * 95;
                  const angle = (i * 72 - 90) * (Math.PI / 180);
                  return `${120 + Math.cos(angle) * r},${120 + Math.sin(angle) * r}`;
                }).join(' ');

                return (
                  <polygon
                    points={traineePts}
                    fill="rgba(6, 182, 212, 0.22)"
                    stroke="#22d3ee"
                    strokeWidth="2"
                  />
                );
              })()}

              {/* Axis Labels */}
              {competencies.map((c, i) => {
                const angle = (i * 72 - 90) * (Math.PI / 180);
                const lx = 120 + Math.cos(angle) * 115;
                const ly = 120 + Math.sin(angle) * 115;
                return (
                  <text
                    key={i}
                    x={lx}
                    y={ly + 3}
                    fill="#94a3b8"
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {c.label} ({c.score}%)
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="p-2.5 rounded bg-[#0e1627] border border-slate-800 text-[11px] font-mono text-slate-300">
            <strong>Key Finding:</strong> Strongest in Detection (92%) &amp; Protocol Compliance (90%). Prioritize Multi-Target Tracking under adverse weather.
          </div>
        </div>
      </div>
    </div>
  );
};
