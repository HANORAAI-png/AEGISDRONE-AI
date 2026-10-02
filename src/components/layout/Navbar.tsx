import React, { useState } from 'react';
import { 
  Radar, 
  Volume2, 
  VolumeX, 
  Play, 
  User, 
  CheckCircle2, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { isAudioEnabled, setAudioEnabled, playTacticalClick } from '../../utils/audio';
import { TraineeProfile } from '../../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeOperator: TraineeProfile;
  trainees: TraineeProfile[];
  onSelectOperator: (trainee: TraineeProfile) => void;
  onStartDemo: () => void;
  onLaunchQuickSim: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeOperator,
  trainees,
  onSelectOperator,
  onStartDemo,
  onLaunchQuickSim,
}) => {
  const [audioOn, setAudioOn] = useState(isAudioEnabled());
  const [showOperatorMenu, setShowOperatorMenu] = useState(false);

  const toggleSound = () => {
    const next = !audioOn;
    setAudioOn(next);
    setAudioEnabled(next);
    if (next) playTacticalClick();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'simulation', label: 'Simulator' },
    { id: 'generator', label: 'AI Generator' },
    { id: 'library', label: 'Scenario Library' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Single Brand Wordmark in display face */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => {
            playTacticalClick();
            setCurrentTab('landing');
          }}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <Radar className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div>
            <span className="font-tactical text-lg font-bold tracking-wider text-slate-100 group-hover:text-cyan-400 transition-colors">
              AegisDrone AI
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Clean 4-6 text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-tactical font-semibold">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                playTacticalClick();
                setCurrentTab(item.id);
              }}
              className={`relative py-1.5 transition-colors whitespace-nowrap ${
                isActive 
                  ? 'text-cyan-400 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Actions & Operator Profile */}
      <div className="flex items-center gap-3">
        {/* Sound FX Toggle */}
        <button
          onClick={toggleSound}
          title={audioOn ? 'Mute Tactical Audio' : 'Enable Tactical Audio'}
          className={`p-2 rounded border transition-colors ${
            audioOn 
              ? 'border-slate-700 bg-slate-900/80 text-cyan-400 hover:border-cyan-500/50' 
              : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:text-slate-300'
          }`}
        >
          {audioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Guided SIH Demo Tour Button */}
        <button
          onClick={() => {
            playTacticalClick();
            onStartDemo();
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-tactical font-semibold text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 rounded hover:bg-cyan-900/40 hover:border-cyan-400 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.12)] whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Demo</span>
        </button>

        {/* Quick Launch Simulator Button */}
        <button
          onClick={() => {
            playTacticalClick();
            onLaunchQuickSim();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-tactical font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors shadow-[0_0_12px_rgba(6,182,212,0.3)] whitespace-nowrap"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Sim</span>
        </button>

        {/* Operator Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowOperatorMenu(!showOperatorMenu)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors"
          >
            <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-mono font-medium text-slate-200 leading-tight">
                {activeOperator.name}
              </div>
              <div className="text-[10px] text-slate-400 leading-none">
                Lvl {activeOperator.adaptiveLevelRating.toFixed(1)}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showOperatorMenu && (
            <div 
              className="absolute right-0 mt-2 w-56 rounded-md bg-[#0d1422] border border-slate-700/80 shadow-2xl py-1 z-50"
              onMouseLeave={() => setShowOperatorMenu(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-tactical uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Switch Trainee Profile
              </div>
              {trainees.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    playTacticalClick();
                    onSelectOperator(t);
                    setShowOperatorMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-800/60 transition-colors ${
                    t.id === activeOperator.id ? 'text-cyan-400 font-semibold bg-cyan-950/20' : 'text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-mono">{t.name}</div>
                    <div className="text-[10px] text-slate-400">{t.role}</div>
                  </div>
                  {t.id === activeOperator.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
