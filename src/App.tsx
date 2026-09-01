import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { WhatWeMonitorSection } from './components/WhatWeMonitorSection';
import { AIInsightSection } from './components/AIInsightSection';
import { PricingSection } from './components/PricingSection';
import { Footer } from './components/Footer';
import { LiveDashboardView } from './components/LiveDashboardView';
import { AlertDetailModal } from './components/AlertDetailModal';
import { AddCompetitorModal } from './components/AddCompetitorModal';
import { PlanModal } from './components/PlanModal';
import { InfoModal } from './components/InfoModals';
import { INITIAL_ALERTS, INITIAL_COMPETITORS, PRICING_PLANS } from './data/mockData';
import { ChangeAlert, ChangeCategory, MonitoredCompetitor, PricingPlan } from './types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'dashboard'>('landing');
  const [competitors, setCompetitors] = useState<MonitoredCompetitor[]>(() => {
    const saved = localStorage.getItem('competewatch_competitors');
    return saved ? JSON.parse(saved) : INITIAL_COMPETITORS;
  });
  const [alerts, setAlerts] = useState<ChangeAlert[]>(() => {
    const saved = localStorage.getItem('competewatch_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [selectedAlert, setSelectedAlert] = useState<ChangeAlert | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'terms' | 'status' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<ChangeCategory | 'all'>('all');

  useEffect(() => {
    localStorage.setItem('competewatch_competitors', JSON.stringify(competitors));
  }, [competitors]);

  useEffect(() => {
    localStorage.setItem('competewatch_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleStartMonitoring = () => {
    setActiveView('dashboard');
    setIsAddModalOpen(true);
  };

  const handleScrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddCompetitor = (newCompData: Omit<MonitoredCompetitor, 'id'>) => {
    const newComp: MonitoredCompetitor = {
      ...newCompData,
      id: `comp-${Date.now()}`
    };

    setCompetitors((prev) => [newComp, ...prev]);

    // Also simulate a realistic discovered alert
    const newAlert: ChangeAlert = {
      id: `alert-${Date.now()}`,
      competitorId: newComp.id,
      competitorName: newComp.name,
      timestamp: new Date().toISOString(),
      relativeTime: 'Just now',
      category: 'pricing',
      severity: 'major',
      title: `${newComp.name} Initial Baseline Indexed`,
      description: `Indexed ${newComp.monitoredPages.length} active pages and initiated continuous baseline DOM diffing.`,
      previousValue: 'Unmonitored',
      newValue: 'Autonomous Tracking Active',
      pageUrl: newComp.url,
      pageType: 'Baseline Index',
      aiInsight: {
        strategyShift: 'Baseline Monitoring Initialized',
        businessImpact: `Any changes in ${newComp.name}'s pricing, feature matrices, or messaging positioning will trigger instant AI analysis.`,
        recommendedAction: 'Keep daily digests active in your team notifications channel.',
        confidence: 98,
        tags: ['New Target', 'Baseline']
      },
      isRead: false
    };

    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Added ${newComp.name} to active tracking radar!`);
  };

  const handleTriggerScan = () => {
    setIsScanning(true);
    showToast('Autonomous Scanner inspecting competitor DOM trees...');

    setTimeout(() => {
      setIsScanning(false);
      showToast('Scan complete: All 4 competitor endpoints refreshed.');
    }, 1500);
  };

  const handleMarkAlertRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isRead: true } : a))
    );
  };

  const handleSelectCategoryFromLanding = (category: ChangeCategory) => {
    setActiveCategoryFilter(category);
    setActiveView('dashboard');
    showToast(`Filtered radar view to "${category.toUpperCase()}" changes.`);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] antialiased flex flex-col pt-[64px] font-sans">
      {/* Top Header */}
      <Header
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        unreadCount={alerts.filter((a) => !a.isRead).length}
      />

      {/* Floating Scan Banner if Scanning */}
      {isScanning && (
        <div className="fixed top-[64px] left-0 w-full z-40 bg-[#004ac6] text-[#ffffff] py-2 px-4 text-center text-[13px] font-medium flex items-center justify-center gap-2 shadow-md animate-pulse">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>AI Scanning active competitor pages for delta...</span>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1 max-w-[1440px] mx-auto px-4 md:px-8 w-full">
        {activeView === 'landing' ? (
          <div>
            {/* 1. Hero Section */}
            <HeroSection
              onStartMonitoring={handleStartMonitoring}
              onScrollToHowItWorks={handleScrollToHowItWorks}
              onSelectAlert={setSelectedAlert}
              sampleAlert={alerts[0] || INITIAL_ALERTS[0]}
              onTriggerScanSimulation={handleTriggerScan}
              isScanning={isScanning}
            />

            {/* 2. Problem Section */}
            <ProblemSection onCategorySelect={handleSelectCategoryFromLanding} />

            {/* 3. How It Works Section */}
            <HowItWorksSection onStartMonitoring={handleStartMonitoring} />

            {/* 4. What We Monitor Section */}
            <WhatWeMonitorSection onSelectCategory={handleSelectCategoryFromLanding} />

            {/* 5. AI Insight Section */}
            <AIInsightSection />

            {/* 6. Pricing Section */}
            <PricingSection onSelectPlan={(plan) => setSelectedPlan(plan)} />
          </div>
        ) : (
          <LiveDashboardView
            competitors={competitors}
            alerts={alerts}
            onSelectAlert={setSelectedAlert}
            onOpenAddCompetitor={() => setIsAddModalOpen(true)}
            onTriggerScan={handleTriggerScan}
            isScanning={isScanning}
            onBackToLanding={() => setActiveView('landing')}
            activeCategoryFilter={activeCategoryFilter}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setInfoModalType('privacy')}
        onOpenTerms={() => setInfoModalType('terms')}
        onOpenAPIStatus={() => setInfoModalType('status')}
      />

      {/* Modals */}
      <AlertDetailModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onMarkRead={handleMarkAlertRead}
      />

      <AddCompetitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCompetitor={handleAddCompetitor}
      />

      <PlanModal
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onConfirmPlan={(planId) => {
          showToast(`Plan upgraded to ${planId.toUpperCase()}! Full feature set unlocked.`);
        }}
      />

      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191c1e] text-[#ffffff] px-4 py-3 rounded-lg shadow-xl text-[13px] font-medium flex items-center gap-2 border border-[#434655] animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
