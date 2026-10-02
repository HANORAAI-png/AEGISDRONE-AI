import React, { useState } from 'react';
import { 
  BookOpen, 
  Play, 
  Eye, 
  Filter, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  Compass,
  X
} from 'lucide-react';
import { PREDEFINED_SCENARIOS } from '../../data/mockData';
import { ScenarioConfig } from '../../types';
import { playTacticalClick } from '../../utils/audio';

interface ScenarioLibraryProps {
  onStartScenario: (scenario: ScenarioConfig) => void;
}

export const ScenarioLibrary: React.FC<ScenarioLibraryProps> = ({ onStartScenario }) => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [selectedScenarioForDetails, setSelectedScenarioForDetails] = useState<ScenarioConfig | null>(null);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filteredScenarios = PREDEFINED_SCENARIOS.filter((s) => {
    if (filterDifficulty === 'All') return true;
    return s.difficulty === filterDifficulty;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <BookOpen className="w-3.5 h-3.5" />
            STANDARDIZED TRAINING CURRICULUM
          </div>
          <h1 className="font-tactical text-2xl font-bold text-slate-100 mt-1">
            Scenario Library (10 Curated Exercises)
          </h1>
          <p className="text-xs text-slate-400">
            Select standard or adaptive exercises across airports, government installations, industrial complexes, and remote border posts.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0a101c] border border-slate-800 rounded-lg text-xs font-tactical">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => {
                playTacticalClick();
                setFilterDifficulty(diff);
              }}
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                filterDifficulty === diff
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredScenarios.map((scenario) => {
          const diffBadge = 
            scenario.difficulty === 'Expert' ? 'text-rose-400 bg-rose-950/40 border-rose-800/50' :
            scenario.difficulty === 'Advanced' ? 'text-amber-400 bg-amber-950/40 border-amber-800/50' :
            scenario.difficulty === 'Intermediate' ? 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50' :
            'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';

          return (
            <div
              key={scenario.id}
              className="p-5 rounded-xl bg-[#0a101c] border border-slate-800/80 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">{scenario.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold border ${diffBadge}`}>
                    {scenario.difficulty}
                  </span>
                </div>

                {/* Title & Metadata */}
                <div>
                  <h3 className="font-tactical text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {scenario.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono mt-1 text-slate-400">
                    <span>{scenario.environment}</span>
                    <span>·</span>
                    <span>{scenario.time}</span>
                    <span>·</span>
                    <span>{scenario.weather}</span>
                  </div>
                </div>

                {/* Objective & Description snippet */}
                <div className="p-2.5 rounded bg-[#0e1627] border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                  <div className="text-[10px] uppercase text-cyan-400 font-semibold mb-1">
                    Objective: {scenario.objective}
                  </div>
                  <p className="line-clamp-2 text-slate-400 text-[11px]">
                    {scenario.description}
                  </p>
                </div>

                {/* Target Count & Estimated Duration */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>{scenario.objectCount} Aerial Target(s)</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    ~{scenario.estimatedDurationMin} min
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    playTacticalClick();
                    setSelectedScenarioForDetails(scenario);
                  }}
                  className="flex-1 py-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-tactical text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => {
                    playTacticalClick();
                    onStartScenario(scenario);
                  }}
                  className="flex-1 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-tactical font-bold text-xs transition-all shadow-[0_0_10px_rgba(6,182,212,0.25)] flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedScenarioForDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-xl bg-[#0a101c] border border-cyan-500/50 p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
              <span className="text-cyan-400 font-bold">{selectedScenarioForDetails.id} · {selectedScenarioForDetails.codename}</span>
              <button
                onClick={() => setSelectedScenarioForDetails(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h2 className="font-tactical text-xl font-bold text-slate-100">
                {selectedScenarioForDetails.title}
              </h2>
              <div className="text-xs text-slate-400 font-mono mt-1">
                {selectedScenarioForDetails.environment} · {selectedScenarioForDetails.weather} · {selectedScenarioForDetails.difficulty} Level
              </div>
            </div>

            <div className="p-3.5 rounded bg-[#0e1627] border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <div className="font-tactical text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                Operational Context
              </div>
              {selectedScenarioForDetails.description}
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-tactical uppercase tracking-wider text-slate-400 font-semibold">
                Directives &amp; Training Goals
              </div>
              <ul className="space-y-1 text-xs text-slate-300 font-mono">
                {selectedScenarioForDetails.tacticalDirectives.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#090e18] p-2 rounded border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Target density: {selectedScenarioForDetails.objectCount} aerial contact(s)
              </span>

              <button
                onClick={() => {
                  playTacticalClick();
                  onStartScenario(selectedScenarioForDetails);
                  setSelectedScenarioForDetails(null);
                }}
                className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-tactical font-bold text-xs rounded transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch This Scenario</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
