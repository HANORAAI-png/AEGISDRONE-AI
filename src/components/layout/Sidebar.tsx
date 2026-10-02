import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Radar, 
  BookOpen, 
  Users, 
  BarChart3, 
  FileText, 
  Settings,
  ShieldAlert,
  Activity,
  Cpu
} from 'lucide-react';
import { playTacticalClick } from '../../utils/audio';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  adaptiveLevel: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  adaptiveLevel,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generator', label: 'Create Scenario', icon: PlusCircle },
    { id: 'simulation', label: 'Simulation', icon: Radar },
    { id: 'library', label: 'Scenario Library', icon: BookOpen },
    { id: 'trainees', label: 'Trainees', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-60 shrink-0 bg-[#090d16] border-r border-slate-800/80 flex flex-col justify-between p-4 hidden md:flex min-h-[calc(100vh-57px)]">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-tactical uppercase tracking-wider text-slate-400">
            Training Operations
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playTacticalClick();
                    setCurrentTab(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-tactical font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-950/40 text-cyan-300 border-l-2 border-cyan-400 font-semibold shadow-[inset_0_0_12px_rgba(6,182,212,0.1)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                  {item.id === 'simulation' && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Adaptive Engine Telemetry Gauge */}
        <div className="p-3 rounded-lg bg-[#0e1524] border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-tactical font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Adaptive Engine
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
              Lvl {adaptiveLevel.toFixed(1)}/5.0
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-700" 
              style={{ width: `${(adaptiveLevel / 5) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 leading-snug">
            Calibrating dynamic scenario complexity and target vector speeds based on decision metrics.
          </p>
        </div>
      </div>

      {/* Safety Notice Footer */}
      <div className="pt-4 border-t border-slate-800/60">
        <div className="p-2.5 rounded bg-amber-950/20 border border-amber-800/30 flex items-start gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[10px] text-amber-300/80 leading-tight font-mono">
            VIRTUAL SIMULATION ONLY. Abstract operator decision training. No weaponization or jamming.
          </div>
        </div>
      </div>
    </aside>
  );
};
