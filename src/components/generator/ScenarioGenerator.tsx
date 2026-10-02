import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  RefreshCw, 
  Shield, 
  CloudSun, 
  Target, 
  Sliders, 
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  EnvironmentType, 
  TimeOfDay, 
  WeatherType, 
  DifficultyLevel, 
  ScenarioObjective, 
  ScenarioConfig 
} from '../../types';
import { playTacticalClick } from '../../utils/audio';

interface ScenarioGeneratorProps {
  onLaunchScenario: (scenario: ScenarioConfig) => void;
}

export const ScenarioGenerator: React.FC<ScenarioGeneratorProps> = ({ onLaunchScenario }) => {
  // Form input state
  const [environment, setEnvironment] = useState<EnvironmentType>('Airport');
  const [time, setTime] = useState<TimeOfDay>('Night');
  const [weather, setWeather] = useState<WeatherType>('Fog');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Advanced');
  const [objectCount, setObjectCount] = useState<number>(3);
  const [objective, setObjective] = useState<ScenarioObjective>('Multi-object Monitoring');

  const [loading, setLoading] = useState(false);
  const [generatedScenario, setGeneratedScenario] = useState<ScenarioConfig | null>(null);
  const [generationSource, setGenerationSource] = useState<string>('');

  const environments: EnvironmentType[] = [
    'Airport',
    'Government Facility',
    'Industrial Facility',
    'Stadium',
    'Border/Remote Area',
    'Critical Infrastructure',
  ];

  const times: TimeOfDay[] = ['Day', 'Night', 'Dawn', 'Dusk'];
  const weathers: WeatherType[] = ['Clear', 'Rain', 'Fog', 'Windy'];
  const difficulties: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const objectives: ScenarioObjective[] = [
    'Detection',
    'Identification',
    'Tracking',
    'Threat Assessment',
    'Multi-object Monitoring',
    'Decision Making',
  ];

  const handleGenerate = async () => {
    playTacticalClick();
    setLoading(true);

    try {
      const response = await fetch('/api/ai/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          environment,
          time,
          weather,
          difficulty,
          objectCount,
          objective,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const d = resData.data;
        const config: ScenarioConfig = {
          id: d.scenarioId || `SCN-${environment.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`,
          codename: d.codename || `OPERATION VANGUARD-${Math.floor(Math.random() * 90 + 10)}`,
          title: d.title || `${environment} - ${difficulty} Surveillance`,
          environment,
          time,
          weather,
          difficulty,
          objectCount,
          objective,
          description: d.description || 'Simulated aerial incursion exercise testing operator sensor correlation and threat classification.',
          visibilityKm: d.visibilityKm || (weather === 'Fog' ? 0.8 : weather === 'Rain' ? 2.5 : 8.0),
          sensorDegradation: d.sensorDegradation || 'Nominal sensor fidelity',
          tacticalDirectives: d.tacticalDirectives || [
            'Maintain continuous radar horizon tracking',
            'Verify classification before restricted zone buffer crossing',
            'Log all decisions with zero false positive alarms',
          ],
          estimatedDurationMin: Math.max(4, objectCount * 2),
        };
        setGeneratedScenario(config);
        setGenerationSource(resData.source || 'ai-engine');
      }
    } catch {
      // Offline fallback
      const rand = Math.floor(Math.random() * 899 + 100);
      const fallbackConfig: ScenarioConfig = {
        id: `SCN-${environment.substring(0, 3).toUpperCase()}-${rand}`,
        codename: `OPERATION VANGUARD-${rand}`,
        title: `${environment} - ${difficulty} Surveillance`,
        environment,
        time,
        weather,
        difficulty,
        objectCount,
        objective,
        description: `Tactical radar sensors indicate potential unauthorized low-RCS micro aerial systems navigating towards the ${environment} boundary under ${weather} conditions at ${time}. Trainee must calibrate multi-sensor correlation, track vectors, and execute standard security protocols without false alarms.`,
        visibilityKm: weather === 'Fog' ? 0.8 : weather === 'Rain' ? 2.5 : 8.0,
        sensorDegradation: weather === 'Fog' ? 'High optical diffusion; radar range reduced by 15%' : 'Nominal multi-spectrum fidelity',
        tacticalDirectives: [
          'Maintain continuous radar contact on approach corridor',
          'Verify identification through simulated optical zoom before zone boundary crossing',
          'Log telemetry vectors and escalate high-threat anomalies to training supervisor',
        ],
        estimatedDurationMin: Math.max(4, objectCount * 2),
      };
      setGeneratedScenario(fallbackConfig);
      setGenerationSource('simulation-engine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" />
          AI SCENARIO GENERATOR
        </div>
        <h1 className="font-tactical text-2xl font-bold text-slate-100 mt-1">
          Scenario Configuration &amp; Synthesis
        </h1>
        <p className="text-xs text-slate-400">
          Configure operational parameters. Gemini AI generates realistic tactical scenario briefings, sensor degradation models, and training directives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-[#0a101c] border border-slate-800/80 space-y-5">
          <h2 className="font-tactical text-base font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Simulation Parameters
          </h2>

          {/* Environment */}
          <div className="space-y-1.5">
            <label className="text-xs font-tactical uppercase tracking-wider text-slate-400">
              1. Protected Facility / Environment
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {environments.map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => {
                    playTacticalClick();
                    setEnvironment(env);
                  }}
                  className={`p-2.5 rounded text-xs text-left transition-all border ${
                    environment === env
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'bg-[#0e1626] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          {/* Time & Weather */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-tactical uppercase tracking-wider text-slate-400">
                2. Time of Day
              </label>
              <div className="grid grid-cols-2 gap-2">
                {times.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      playTacticalClick();
                      setTime(t);
                    }}
                    className={`p-2 rounded text-xs text-center border ${
                      time === t
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 font-semibold'
                        : 'bg-[#0e1626] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-tactical uppercase tracking-wider text-slate-400">
                3. Weather Conditions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {weathers.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => {
                      playTacticalClick();
                      setWeather(w);
                    }}
                    className={`p-2 rounded text-xs text-center border ${
                      weather === w
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 font-semibold'
                        : 'bg-[#0e1626] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="text-xs font-tactical uppercase tracking-wider text-slate-400">
              4. Difficulty Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => {
                    playTacticalClick();
                    setDifficulty(diff);
                  }}
                  className={`p-2 rounded text-xs text-center border ${
                    difficulty === diff
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-[#0e1626] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Object Count Slider (1 - 10) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-tactical uppercase tracking-wider text-slate-400">
                5. Simulated Aerial Objects Count
              </label>
              <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                {objectCount} Targets
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={objectCount}
              onChange={(e) => setObjectCount(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 bg-slate-800 cursor-pointer h-2 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>1 (Single Vector)</span>
              <span>5 (Multi-Target)</span>
              <span>10 (Swarm Stress Test)</span>
            </div>
          </div>

          {/* Scenario Objective */}
          <div className="space-y-1.5">
            <label className="text-xs font-tactical uppercase tracking-wider text-slate-400">
              6. Primary Training Objective
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {objectives.map((obj) => (
                <button
                  key={obj}
                  type="button"
                  onClick={() => {
                    playTacticalClick();
                    setObjective(obj);
                  }}
                  className={`p-2 rounded text-xs text-left border ${
                    objective === obj
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-[#0e1626] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-900/50 text-slate-950 font-tactical font-bold text-sm rounded shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>SYNTHESIZING SCENARIO BRIEFING...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>GENERATE AI SCENARIO</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Generated Scenario Output Display */}
        <div className="lg:col-span-6 flex flex-col">
          {generatedScenario ? (
            <div className="p-5 rounded-xl bg-[#0a101c] border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.1)] flex-1 flex flex-col justify-between space-y-5 animate-in fade-in duration-300">
              <div className="space-y-4">
                {/* Header tags */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">{generatedScenario.id}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-300">{generatedScenario.codename}</span>
                  </div>
                  <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded text-[10px] border border-emerald-800/40">
                    Engine: {generationSource}
                  </span>
                </div>

                {/* Scenario Title */}
                <div>
                  <h3 className="font-tactical text-xl font-bold text-slate-100">
                    {generatedScenario.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono mt-1 text-slate-400">
                    <span>{generatedScenario.environment}</span>
                    <span>·</span>
                    <span>{generatedScenario.weather} ({generatedScenario.visibilityKm}km Vis)</span>
                    <span>·</span>
                    <span>{generatedScenario.time}</span>
                    <span>·</span>
                    <span className="text-amber-400">{generatedScenario.difficulty}</span>
                    <span>·</span>
                    <span className="text-cyan-400">{generatedScenario.objectCount} Aerial Targets</span>
                  </div>
                </div>

                {/* Scenario Description */}
                <div className="p-3.5 rounded-lg bg-[#0e1627] border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <div className="font-tactical text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                    Tactical Scenario Briefing
                  </div>
                  {generatedScenario.description}
                </div>

                {/* Sensor Degradation Challenge */}
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300/90 space-y-1">
                  <div className="font-tactical text-[10px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Sensor Attenuation Profile
                  </div>
                  <p className="text-[11px]">{generatedScenario.sensorDegradation}</p>
                </div>

                {/* Directives */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-tactical uppercase tracking-wider text-slate-400 font-semibold">
                    Trainee Rules of Engagement
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                    {generatedScenario.tacticalDirectives.map((dir, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-[#090e18] p-2 rounded border border-slate-800/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{dir}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button: Start Simulation with this scenario */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => {
                    playTacticalClick();
                    onLaunchScenario(generatedScenario);
                  }}
                  className="flex-1 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-tactical font-bold text-xs rounded transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>START SIMULATION WITH THIS SCENARIO</span>
                </button>
              </div>
            </div>
          ) : (
            /* Empty State Placeholder */
            <div className="p-8 rounded-xl bg-[#0a101c] border border-slate-800/80 flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                <Compass className="w-7 h-7" />
              </div>
              <div className="max-w-sm space-y-1.5">
                <h3 className="font-tactical text-base font-bold text-slate-300">
                  Ready to Synthesize Scenario
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select your desired environment, meteorological conditions, target density, and training objective, then click <strong>GENERATE AI SCENARIO</strong> to compose a calibrated tactical training package.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
