import React, { useEffect, useRef } from 'react';
import { 
  Radar, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  Layers, 
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';
import { playTacticalClick } from '../../utils/audio';

interface LandingPageProps {
  onLaunchTraining: () => void;
  onOpenDashboard: () => void;
  onStartDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchTraining,
  onOpenDashboard,
  onStartDemo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mini radar visualizer animation on hero
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    let animId: number;

    const blips = [
      { dist: 70, angle: 0.8, id: 'A-17', threat: 'HIGH' },
      { dist: 110, angle: 2.4, id: 'B-04', threat: 'MED' },
      { dist: 145, angle: 4.6, id: 'C-09', threat: 'LOW' },
    ];

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Background grid circles
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
      [40, 80, 120, 160].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - 165, cy);
      ctx.lineTo(cx + 165, cy);
      ctx.moveTo(cx, cy - 165);
      ctx.lineTo(cx, cy + 165);
      ctx.stroke();

      // Inner restricted boundary
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Radar sweep cone
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 160);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 160, 0, Math.PI / 4);
      ctx.closePath();
      ctx.fill();

      // Sweep line
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(160, 0);
      ctx.stroke();
      ctx.restore();

      // Draw blips
      blips.forEach((blip) => {
        const bx = cx + Math.cos(blip.angle) * blip.dist;
        const by = cy + Math.sin(blip.angle) * blip.dist;
        const color = blip.threat === 'HIGH' ? '#f43f5e' : blip.threat === 'MED' ? '#f59e0b' : '#06b6d4';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing ring
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bx, by, 7 + Math.sin(angle * 3) * 2, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px monospace';
        ctx.fillText(blip.id, bx + 8, by + 3);
      });

      // Center TOC dot
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      angle += 0.02;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/40 border border-cyan-800/40 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              SMART INDIA HACKATHON (SIH) PROTOTYPE
            </div>

            <h1 className="font-tactical text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.1]">
              AI-Powered Drone Threat Simulation &amp; Training
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              An adaptive virtual training environment for drone detection, threat assessment, tracking and operator decision-making. Train security and defence personnel in safe simulated airspaces with real-time AI feedback.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  playTacticalClick();
                  onLaunchTraining();
                }}
                className="flex items-center gap-2 px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-tactical font-bold text-sm rounded shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Launch Training</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  playTacticalClick();
                  onOpenDashboard();
                }}
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-tactical font-semibold text-sm rounded transition-colors"
              >
                <span>Trainer Dashboard</span>
              </button>

              <button
                onClick={() => {
                  playTacticalClick();
                  onStartDemo();
                }}
                className="flex items-center gap-2 px-4 py-3.5 text-cyan-300 hover:text-cyan-200 text-sm font-tactical font-medium transition-colors"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Run Interactive Demo Flow</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg text-xs">
              <div>
                <div className="font-mono text-cyan-400 font-bold text-lg tabular-nums">100%</div>
                <div className="text-slate-400">Virtual Software-Only</div>
              </div>
              <div>
                <div className="font-mono text-emerald-400 font-bold text-lg tabular-nums">Multi-Sensor</div>
                <div className="text-slate-400">Radar · Optical · RF</div>
              </div>
              <div>
                <div className="font-mono text-amber-400 font-bold text-lg tabular-nums">Adaptive AI</div>
                <div className="text-slate-400">Calibrated Weakness Fix</div>
              </div>
            </div>
          </div>

          {/* Right Column: Simulated Tactical Radar Canvas Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative p-4 rounded-xl bg-[#090e17] border border-cyan-900/50 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
              {/* Radar HUD Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-[11px] font-mono">
                <span className="text-cyan-400 flex items-center gap-1.5 font-semibold">
                  <Activity className="w-3.5 h-3.5" />
                  SECTOR 04 - LIVE SIMULATION
                </span>
                <span className="text-slate-400">SWEEP 360°</span>
              </div>

              {/* Canvas Visualizer */}
              <div className="relative py-2">
                <canvas 
                  ref={canvasRef} 
                  width={340} 
                  height={340} 
                  className="rounded-lg bg-[#05080e]"
                />

                {/* Overlaid status tags */}
                <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700/80 rounded px-2 py-1 text-[10px] font-mono text-slate-300">
                  RANGE: <span className="text-cyan-400">2.0 KM</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-rose-900/60 rounded px-2 py-1 text-[10px] font-mono text-rose-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  RESTRICTED ZONE: ACTIVE
                </div>
              </div>

              {/* Radar HUD Footer */}
              <div className="pt-2 text-center text-[10px] font-mono text-slate-400">
                Simulated Radar Display · Coordinates Origin: Facility Center (0,0)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Key Capabilities Section: DETECT, ASSESS, ADAPT */}
      <section className="px-6 py-16 bg-[#080c14] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-tactical uppercase tracking-wider text-cyan-400">
              Core Training Methodology
            </span>
            <h2 className="font-tactical text-3xl font-bold text-slate-100 mt-2">
              Train. Detect. Assess. Adapt.
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              A comprehensive three-pillar pedagogical framework tailored for airspace defence trainees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. DETECT */}
            <div className="p-6 rounded-lg bg-[#0c121e] border border-slate-800/80 hover:border-cyan-500/40 transition-colors space-y-4">
              <div className="w-12 h-12 rounded bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
                <Eye className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Phase 01 // Acquisition
              </div>
              <h3 className="font-tactical text-xl font-bold text-slate-100">
                DETECT
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Identify simulated aerial objects and suspicious activity across simulated Radar, Optical/Thermal, and RF signal spectrums before they penetrate restricted boundaries.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Multi-sensor telemetry correlation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Confidence score tracking
                </li>
              </ul>
            </div>

            {/* 2. ASSESS */}
            <div className="p-6 rounded-lg bg-[#0c121e] border border-slate-800/80 hover:border-amber-500/40 transition-colors space-y-4">
              <div className="w-12 h-12 rounded bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                Phase 02 // Analysis
              </div>
              <h3 className="font-tactical text-xl font-bold text-slate-100">
                ASSESS
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Evaluate potential threats using contextual information, proximity to restricted training zones, speed anomalies, and vector trajectories with AI explainability.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  Automated threat severity rating
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  Tactical reasoning breakdown
                </li>
              </ul>
            </div>

            {/* 3. ADAPT */}
            <div className="p-6 rounded-lg bg-[#0c121e] border border-slate-800/80 hover:border-emerald-500/40 transition-colors space-y-4">
              <div className="w-12 h-12 rounded bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Phase 03 // Evolution
              </div>
              <h3 className="font-tactical text-xl font-bold text-slate-100">
                ADAPT
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Use AI-generated scenarios to continuously improve trainee performance. The engine detects decision weaknesses and dynamically adjusts difficulty and environmental complexity.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Weakness-targeted curricula
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Longitudinal skill analytics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice Banner */}
      <section className="px-6 py-8 max-w-7xl mx-auto">
        <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-300">Software-Only Training Compliance:</span> This application generates abstract operator simulation cues for training purposes. No kinetic, EW, or physical drone countermeasures are featured.
            </div>
          </div>
          <button
            onClick={onLaunchTraining}
            className="text-cyan-400 hover:text-cyan-300 font-tactical font-semibold underline underline-offset-4"
          >
            Enter Tactical Training Console &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};
