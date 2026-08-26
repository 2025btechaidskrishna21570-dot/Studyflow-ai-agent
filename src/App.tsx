/**
 * StudyFlow: Autonomous Academic Operations Agent
 * Main React Application Entry & Router
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import AdaptivePlanView from './components/AdaptivePlanView';
import RiskIntelligenceView from './components/RiskIntelligenceView';
import AgentActivityCenter from './components/AgentActivityCenter';
import AnalyticsView from './components/AnalyticsView';
import SyllabusAnalyzerView from './components/SyllabusAnalyzerView';
import OnboardingModal from './components/OnboardingModal';
import ArchitectureModal from './components/ArchitectureModal';

const AppContent: React.FC = () => {
  const {
    currentView,
    showOnboarding,
    setShowOnboarding,
    showArchitecture,
    setShowArchitecture
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Header />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'adaptive_plan' && <AdaptivePlanView />}
        {currentView === 'risk_intelligence' && <RiskIntelligenceView />}
        {currentView === 'activity_center' && <AgentActivityCenter />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'syllabus_analyzer' && <SyllabusAnalyzerView />}
      </main>

      {/* Global Modals */}
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
      {showArchitecture && <ArchitectureModal onClose={() => setShowArchitecture(false)} />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
