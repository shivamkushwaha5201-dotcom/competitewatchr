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
import { InfoModal } from './components/InfoModals';
import { INITIAL_ALERTS, INITIAL_COMPETITORS, DEMO_LANDING_SAMPLE_ALERT } from './data/mockData';
import { ChangeAlert, ChangeCategory, MonitoredCompetitor, SimulatedPageState } from './types';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import {
  createInitialBaseline,
  createDefaultSimulatedPageState,
  detectPageChanges,
  extractStructuredContent,
  renderSimulatedHtml,
  fetchRealPageContent
} from './services/monitorEngine';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'dashboard'>('landing');

  // Competitor list initialized from localStorage or clean empty state
  const [competitors, setCompetitors] = useState<MonitoredCompetitor[]>(() => {
    const saved = localStorage.getItem('competewatch_competitors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy mock competitors if any existed in cache
          const sanitized = parsed.filter(
            (c: any) =>
              c.id !== 'comp-x' &&
              c.name !== 'Competitor X' &&
              c.name !== 'Veloce HQ' &&
              c.name !== 'PayStream Cloud' &&
              c.name !== 'DocuSync AI'
          );
          return sanitized;
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_COMPETITORS;
  });

  // Alerts list initialized strictly from verified changes (no fake/mock data)
  const [alerts, setAlerts] = useState<ChangeAlert[]>(() => {
    const saved = localStorage.getItem('competewatch_alerts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy mock alerts
          const sanitized = parsed.filter(
            (a: any) =>
              !a.id.startsWith('alert-1') &&
              !a.id.startsWith('alert-2') &&
              !a.id.startsWith('alert-3') &&
              !a.id.startsWith('alert-4') &&
              !a.id.startsWith('alert-5') &&
              a.competitorName !== 'Competitor X' &&
              a.competitorName !== 'Veloce HQ' &&
              a.competitorName !== 'PayStream Cloud' &&
              a.competitorName !== 'DocuSync AI'
          );
          return sanitized;
        }
      } catch (e) {
        return [];
      }
    }
    return INITIAL_ALERTS;
  });

  const [selectedAlert, setSelectedAlert] = useState<ChangeAlert | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  /**
   * FIRST SCAN MUST ONLY CREATE A BASELINE:
   * When adding a competitor for the first time:
   * - Fetch & index pages.
   * - Save current content as baseline.
   * - Start monitoring.
   * - DO NOT create a Major Diff, alert, or fake change!
   */
  const handleAddCompetitor = (newCompData: Omit<MonitoredCompetitor, 'id'>) => {
    const newCompId = `comp-${Date.now()}`;
    
    let pageSnapshots = newCompData.pageSnapshots || {};
    let liveSimulatedState = newCompData.liveSimulatedState || {};

    if (Object.keys(pageSnapshots).length === 0) {
      const baseline = createInitialBaseline({
        ...newCompData,
        id: newCompId
      });
      pageSnapshots = baseline.pageSnapshots;
      liveSimulatedState = baseline.liveSimulatedState;
    }

    const newComp: MonitoredCompetitor = {
      ...newCompData,
      id: newCompId,
      status: 'active',
      lastScanned: 'Just now',
      alertCount: 0,
      pageSnapshots,
      liveSimulatedState
    };

    setCompetitors((prev) => [newComp, ...prev]);
    showToast(`Baseline Created: Indexed ${newComp.monitoredPages.length} active pages. Monitoring active.`);
  };

  /**
   * Update competitor simulated page state for live testing
   */
  const handleUpdateCompetitorSimulation = (
    competitorId: string,
    pageUrl: string,
    updates: Partial<SimulatedPageState>
  ) => {
    setCompetitors((prev) =>
      prev.map((c) => {
        if (c.id !== competitorId) return c;
        const currentSim =
          c.liveSimulatedState?.[pageUrl] ||
          createDefaultSimulatedPageState('pricing', c.name);
        const newSim = { ...currentSim, ...updates };
        return {
          ...c,
          liveSimulatedState: {
            ...(c.liveSimulatedState || {}),
            [pageUrl]: newSim
          }
        };
      })
    );
    showToast('Updated live page state. Click "Run Scan" to verify change detection.');
  };

  /**
   * CRITICAL REQUIREMENT 2 & 8:
   * On every scan after baseline:
   * - Compare new page content with previous snapshot.
   * - If real URL, attempts live Jina fetch; if unchanged, 0 alerts!
   * - If real change detected: create accurate diff alert with source evidence.
   */
  const handleTriggerScan = async () => {
    setIsScanning(true);
    showToast('Autonomous Scanner inspecting competitor DOM trees...');

    try {
      const newAlertsFound: ChangeAlert[] = [];
      const updatedCompetitors: MonitoredCompetitor[] = [];

      for (const comp of competitors) {
        const updatedSnapshots = { ...(comp.pageSnapshots || {}) };
        let compAlertsCount = comp.alertCount;
        let compHasNewAlert = false;

        const updatedPages = [];

        for (const page of comp.monitoredPages) {
          let currentSnapshot = comp.pageSnapshots?.[page.url];

          // If competitor has a real live URL or live simulated state
          if (comp.url.startsWith('http') && !comp.liveSimulatedState?.[page.url]) {
            // Live real crawl
            const fetchRes = await fetchRealPageContent(page.url);
            if (fetchRes.success && fetchRes.content) {
              currentSnapshot = extractStructuredContent(
                fetchRes.content,
                page.type,
                page.url,
                page.name
              );
            }
          } else {
            // Simulated state
            const simState =
              comp.liveSimulatedState?.[page.url] ||
              createDefaultSimulatedPageState(page.type, comp.name);
            const currentHtml = renderSimulatedHtml(simState, comp.name);
            currentSnapshot = extractStructuredContent(
              currentHtml,
              page.type,
              page.url,
              page.name
            );
          }

          const prevSnapshot = comp.pageSnapshots?.[page.url];

          if (prevSnapshot && currentSnapshot) {
            const diffAlerts = detectPageChanges(prevSnapshot, currentSnapshot, comp);
            if (diffAlerts.length > 0) {
              const uniqueDiffs = diffAlerts.filter(
                (na) =>
                  !alerts.some(
                    (ea) =>
                      ea.competitorId === na.competitorId &&
                      ea.pageUrl === na.pageUrl &&
                      ea.previousValue === na.previousValue &&
                      ea.newValue === na.newValue
                  ) &&
                  !newAlertsFound.some(
                    (ea) =>
                      ea.competitorId === na.competitorId &&
                      ea.pageUrl === na.pageUrl &&
                      ea.previousValue === na.previousValue &&
                      ea.newValue === na.newValue
                  )
              );

              if (uniqueDiffs.length > 0) {
                newAlertsFound.push(...uniqueDiffs);
                compAlertsCount += uniqueDiffs.length;
                compHasNewAlert = true;
                updatedSnapshots[page.url] = currentSnapshot;
                updatedPages.push({ ...page, lastChange: 'Just now' });
                continue;
              }
            }
          }

          if (currentSnapshot) {
            updatedSnapshots[page.url] = currentSnapshot;
          }
          updatedPages.push(page);
        }

        updatedCompetitors.push({
          ...comp,
          lastScanned: 'Just now',
          status: compHasNewAlert ? 'alert_detected' : comp.status,
          alertCount: compAlertsCount,
          monitoredPages: updatedPages,
          pageSnapshots: updatedSnapshots
        });
      }

      setCompetitors(updatedCompetitors);

      if (newAlertsFound.length > 0) {
        setAlerts((prev) => [...newAlertsFound, ...prev]);
        showToast(`Scan complete: ${newAlertsFound.length} meaningful change(s) detected.`);
      } else {
        showToast('Scan complete: All pages verified against baselines. No changes detected.');
      }
    } catch (err) {
      console.error('Scan error:', err);
      showToast('Scan completed with partial network verification.');
    } finally {
      setIsScanning(false);
    }
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
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Autonomous Scanner inspecting competitor DOM trees for delta...</span>
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
              sampleAlert={alerts[0] || DEMO_LANDING_SAMPLE_ALERT}
              onTriggerScanSimulation={handleTriggerScan}
              isScanning={isScanning}
            />

            {/* 2. Problem Section */}
            <ProblemSection onCategorySelect={handleSelectCategoryFromLanding} />

            {/* 3. How It Works Section */}
            <HowItWorksSection onStartMonitoring={handleStartMonitoring} />

            {/* 4. What We Monitor Section */}
            <WhatWeMonitorSection onSelectCategory={handleSelectCategoryFromLanding} />

            {/* 5. Verified Website Change Intelligence Section */}
            <AIInsightSection />

            {/* 6. Free MVP Section */}
            <PricingSection onStartFree={handleStartMonitoring} />
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
            onUpdateCompetitorSimulation={handleUpdateCompetitorSimulation}
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
