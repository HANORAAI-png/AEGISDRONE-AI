import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { TrainerDashboard } from './components/dashboard/TrainerDashboard';
import { DroneSimulator } from './components/simulator/DroneSimulator';
import { ScenarioGenerator } from './components/generator/ScenarioGenerator';
import { ScenarioLibrary } from './components/library/ScenarioLibrary';
import { TraineeProfileView } from './components/history/TraineeProfile';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { InstructorReportView } from './components/reports/InstructorReportView';
import { EvaluationModal } from './components/scoring/EvaluationModal';
import { AdaptiveEngineModal } from './components/adaptive/AdaptiveEngineModal';
import { DemoWalkthroughModal } from './components/demo/DemoWalkthroughModal';

import { PREDEFINED_SCENARIOS, INITIAL_TRAINEES } from './data/mockData';
import { ScenarioConfig, TraineeProfile, SessionEvaluation } from './types';
import { playTacticalClick } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [trainees, setTrainees] = useState<TraineeProfile[]>(INITIAL_TRAINEES);
  const [activeOperator, setActiveOperator] = useState<TraineeProfile>(INITIAL_TRAINEES[0]);

  // Current active scenario loaded in simulator
  const [currentScenario, setCurrentScenario] = useState<ScenarioConfig>(PREDEFINED_SCENARIOS[0]);

  // Modals state
  const [showEvaluationModal, setShowEvaluationModal] = useState<boolean>(false);
  const [latestEvaluation, setLatestEvaluation] = useState<SessionEvaluation | null>(null);

  const [showAdaptiveModal, setShowAdaptiveModal] = useState<boolean>(false);
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);

  // Settings State
  const [radarHorizonKm, setRadarHorizonKm] = useState<number>(2.5);
  const [autoTriageAssist, setAutoTriageAssist] = useState<boolean>(true);
  const [audioPings, setAudioPings] = useState<boolean>(true);

  // Handlers
  const handleLaunchScenario = (scenario: ScenarioConfig) => {
    setCurrentScenario(scenario);
    setCurrentTab('simulation');
  };

  const handleCompleteSession = (evaluation: SessionEvaluation) => {
    setLatestEvaluation(evaluation);
    setShowEvaluationModal(true);

    // Update active operator stats
    setTrainees((prev) =>
      prev.map((t) => {
        if (t.id === activeOperator.id) {
          const newSessions = t.sessionsCompleted + 1;
          const newOverall = Math.round((t.overallAccuracy * 0.8) + (evaluation.overallScore * 0.2));
          return {
            ...t,
            sessionsCompleted: newSessions,
            overallAccuracy: newOverall,
            detectionAccuracy: evaluation.detectionAccuracy,
            trackingAccuracy: evaluation.trackingAccuracy,
            decisionAccuracy: evaluation.decisionAccuracy,
            sessionHistory: [
              {
                sessionId: `SESS-${Date.now().toString().slice(-4)}`,
                date: new Date().toISOString().split('T')[0],
                scenario: evaluation.scenarioTitle,
                score: evaluation.overallScore,
                status: evaluation.overallScore >= 80 ? 'Completed' : 'Needs Improvement',
                durationMin: Math.max(1, Math.round(evaluation.durationSeconds / 60)),
                weakness: evaluation.primaryWeakness,
              },
              ...t.sessionHistory,
            ],
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeOperator={activeOperator}
        trainees={trainees}
        onSelectOperator={setActiveOperator}
        onStartDemo={() => setShowDemoModal(true)}
        onLaunchQuickSim={() => {
          setCurrentScenario(PREDEFINED_SCENARIOS[0]);
          setCurrentTab('simulation');
        }}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation (visible except on full-width landing page) */}
        {currentTab !== 'landing' && (
          <Sidebar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            adaptiveLevel={activeOperator.adaptiveLevelRating}
          />
        )}

        {/* View Routing */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {currentTab === 'landing' && (
            <LandingPage
              onLaunchTraining={() => {
                setCurrentScenario(PREDEFINED_SCENARIOS[0]);
                setCurrentTab('simulation');
              }}
              onOpenDashboard={() => setCurrentTab('dashboard')}
              onStartDemo={() => setShowDemoModal(true)}
            />
          )}

          {currentTab === 'dashboard' && (
            <TrainerDashboard
              trainees={trainees}
              onOpenGenerator={() => setCurrentTab('generator')}
              onLaunchSimulation={(scenarioId) => {
                if (scenarioId) {
                  const scn = PREDEFINED_SCENARIOS.find((s) => s.id === scenarioId);
                  if (scn) setCurrentScenario(scn);
                }
                setCurrentTab('simulation');
              }}
              onOpenAdaptiveModal={() => setShowAdaptiveModal(true)}
              onViewTrainee={(trainee) => {
                setActiveOperator(trainee);
                setCurrentTab('trainees');
              }}
              onViewReport={() => setCurrentTab('reports')}
            />
          )}

          {currentTab === 'simulation' && (
            <DroneSimulator
              scenario={currentScenario}
              activeOperator={activeOperator}
              onCompleteSession={handleCompleteSession}
              onSelectNewScenario={() => setCurrentTab('library')}
            />
          )}

          {currentTab === 'generator' && (
            <ScenarioGenerator onLaunchScenario={handleLaunchScenario} />
          )}

          {currentTab === 'library' && (
            <ScenarioLibrary onStartScenario={handleLaunchScenario} />
          )}

          {currentTab === 'trainees' && (
            <TraineeProfileView
              trainee={activeOperator}
              allTrainees={trainees}
              onSelectTrainee={setActiveOperator}
              onLaunchPractice={() => {
                setCurrentScenario(PREDEFINED_SCENARIOS[0]);
                setCurrentTab('simulation');
              }}
            />
          )}

          {currentTab === 'analytics' && <AnalyticsView />}

          {currentTab === 'reports' && (
            <InstructorReportView
              trainee={activeOperator}
              latestEvaluation={latestEvaluation}
              onLaunchAdaptive={handleLaunchScenario}
            />
          )}

          {currentTab === 'settings' && (
            <div className="p-6 max-w-3xl space-y-6">
              <div>
                <h1 className="font-tactical text-2xl font-bold text-slate-100">
                  Simulation &amp; Trainer Settings
                </h1>
                <p className="text-xs text-slate-400">
                  Configure simulation parameters, audio synthesis, and display preferences.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#0a101c] border border-slate-800 space-y-5 text-xs font-mono">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-bold">Simulated Radar Horizon Range</span>
                    <span className="text-cyan-400 font-bold">{radarHorizonKm.toFixed(1)} km</span>
                  </div>
                  <input
                    type="range"
                    min="1.5"
                    max="5.0"
                    step="0.5"
                    value={radarHorizonKm}
                    onChange={(e) => setRadarHorizonKm(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 h-2 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div>
                    <div className="text-slate-200 font-bold">Tactical Web Audio Synthesizer</div>
                    <div className="text-slate-400 text-[11px]">Real-time frequency modulation radar pings and alert chimes</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={audioPings}
                    onChange={(e) => {
                      playTacticalClick();
                      setAudioPings(e.target.checked);
                    }}
                    className="accent-cyan-400 w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div>
                    <div className="text-slate-200 font-bold">Automated AI Threat Co-Pilot</div>
                    <div className="text-slate-400 text-[11px]">Calculates real-time anomaly scores for moving radar contacts</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoTriageAssist}
                    onChange={(e) => {
                      playTacticalClick();
                      setAutoTriageAssist(e.target.checked);
                    }}
                    className="accent-cyan-400 w-4 h-4"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300 font-mono">
                <strong>Platform Notice:</strong> AegisDrone AI operates strictly in simulated environment sandboxes. Real-world drone disabling, weaponization, or jamming functionalities are prohibited by design.
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Evaluation Debrief Modal */}
      {showEvaluationModal && latestEvaluation && (
        <EvaluationModal
          evaluation={latestEvaluation}
          onClose={() => setShowEvaluationModal(false)}
          onLaunchAdaptiveScenario={(scenario) => {
            setShowEvaluationModal(false);
            handleLaunchScenario(scenario);
          }}
          onViewReport={() => {
            setShowEvaluationModal(false);
            setCurrentTab('reports');
          }}
        />
      )}

      {/* Adaptive Curriculum Modal */}
      {showAdaptiveModal && (
        <AdaptiveEngineModal
          trainee={activeOperator}
          onClose={() => setShowAdaptiveModal(false)}
          onLaunchScenario={(scenario) => {
            setShowAdaptiveModal(false);
            handleLaunchScenario(scenario);
          }}
        />
      )}

      {/* 5-Step Guided Demo Walkthrough Modal */}
      {showDemoModal && (
        <DemoWalkthroughModal
          onClose={() => setShowDemoModal(false)}
          onJumpToSimulator={(scenario) => {
            if (scenario) setCurrentScenario(scenario);
            setCurrentTab('simulation');
          }}
          onOpenGenerator={() => setCurrentTab('generator')}
          onOpenDashboard={() => setCurrentTab('dashboard')}
          onOpenAnalytics={() => setCurrentTab('analytics')}
        />
      )}
    </div>
  );
}
