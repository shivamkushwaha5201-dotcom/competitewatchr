import React, { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Plus, 
  Search, 
  ExternalLink, 
  SlidersHorizontal, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Globe,
  Bell,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ChangeAlert, ChangeCategory, MonitoredCompetitor } from '../types';

interface LiveDashboardViewProps {
  competitors: MonitoredCompetitor[];
  alerts: ChangeAlert[];
  onSelectAlert: (alert: ChangeAlert) => void;
  onOpenAddCompetitor: () => void;
  onTriggerScan: () => void;
  isScanning: boolean;
  onBackToLanding: () => void;
  activeCategoryFilter?: ChangeCategory | 'all';
}

export const LiveDashboardView: React.FC<LiveDashboardViewProps> = ({
  competitors,
  alerts,
  onSelectAlert,
  onOpenAddCompetitor,
  onTriggerScan,
  isScanning,
  onBackToLanding,
  activeCategoryFilter = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ChangeCategory | 'all'>(activeCategoryFilter);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'major' | 'minor'>('all');
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | 'all'>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (categoryFilter !== 'all' && alert.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    if (selectedCompetitorId !== 'all' && alert.competitorId !== selectedCompetitorId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.competitorName.toLowerCase().includes(q) ||
        alert.title.toLowerCase().includes(q) ||
        alert.description.toLowerCase().includes(q) ||
        alert.aiInsight.strategyShift.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const majorCount = alerts.filter((a) => a.severity === 'major').length;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6 text-left">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#c3c6d7]/60">
        <div>
          <div className="flex items-center gap-2 text-[12px] text-[#565e74] mb-1">
            <button 
              onClick={onBackToLanding}
              className="hover:text-[#004ac6] flex items-center gap-1 cursor-pointer"
            >
              <span>CompeteWatch</span>
            </button>
            <span>/</span>
            <span className="text-[#191c1e] font-semibold">Live Competitive Radar</span>
          </div>
          <h1 className="text-[24px] md:text-[28px] font-bold text-[#191c1e] tracking-tight">
            Competitor Intelligence Feed
          </h1>
          <p className="text-[14px] text-[#434655] mt-0.5">
            Real-time DOM diffs, pricing shifts, and AI tactical counter-measures.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className="bg-[#ffffff] border border-[#c3c6d7] text-[#191c1e] px-3.5 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#f2f4f6] transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-[#004ac6] ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Live DOM...' : 'Run Global Scan'}</span>
          </button>

          <button
            onClick={onOpenAddCompetitor}
            className="bg-[#2563eb] text-[#ffffff] px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#004ac6] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Track Competitor</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
        <div className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-[#565e74] text-[12px] font-mono-code">
            <span>TRACKED DOMAINS</span>
            <Globe className="w-4 h-4 text-[#004ac6]" />
          </div>
          <div className="text-[26px] font-bold text-[#191c1e] mt-1">
            {competitors.length}
          </div>
          <div className="text-[12px] text-[#565e74] mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>All scans operational</span>
          </div>
        </div>

        <div className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-[#ba1a1a] text-[12px] font-mono-code font-semibold">
            <span>CRITICAL ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
          </div>
          <div className="text-[26px] font-bold text-[#ba1a1a] mt-1">
            {criticalCount}
          </div>
          <div className="text-[12px] text-[#565e74] mt-1">
            Requires executive review
          </div>
        </div>

        <div className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-[#565e74] text-[12px] font-mono-code">
            <span>MAJOR DIFFS</span>
            <TrendingUp className="w-4 h-4 text-[#004ac6]" />
          </div>
          <div className="text-[26px] font-bold text-[#191c1e] mt-1">
            {majorCount}
          </div>
          <div className="text-[12px] text-[#565e74] mt-1">
            Features & messaging shifts
          </div>
        </div>

        <div className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-[#004ac6] text-[12px] font-mono-code font-semibold">
            <span>AI INSIGHTS</span>
            <Sparkles className="w-4 h-4 text-[#004ac6]" />
          </div>
          <div className="text-[26px] font-bold text-[#004ac6] mt-1">
            100%
          </div>
          <div className="text-[12px] text-[#565e74] mt-1">
            Full tactical breakdown
          </div>
        </div>
      </div>

      {/* Main Grid: Tracked Competitors List + Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Monitored Competitor Cards */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-[#191c1e] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#004ac6]" />
              <span>Tracked Targets ({competitors.length})</span>
            </h3>
            <button
              onClick={() => setSelectedCompetitorId('all')}
              className={`text-[12px] font-mono-code px-2 py-0.5 rounded cursor-pointer ${
                selectedCompetitorId === 'all'
                  ? 'bg-[#2563eb] text-[#ffffff] font-medium'
                  : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
            >
              Show All
            </button>
          </div>

          <div className="space-y-2.5">
            {competitors.map((comp) => {
              const isSelected = selectedCompetitorId === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompetitorId(isSelected ? 'all' : comp.id)}
                  className={`bg-[#ffffff] border rounded-xl p-3.5 transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'border-[#004ac6] ring-1 ring-[#004ac6] bg-[#dae2fd]/15 shadow-xs'
                      : 'border-[#c3c6d7] hover:border-[#737686]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-[15px] text-[#191c1e]">
                      {comp.name}
                    </span>
                    <span className="text-[11px] font-mono-code text-[#565e74] bg-[#f2f4f6] px-2 py-0.5 rounded">
                      {comp.frequency}
                    </span>
                  </div>

                  <div className="text-[12px] text-[#565e74] font-mono-code truncate mb-2">
                    {comp.url}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#f2f4f6] text-[12px]">
                    <span className="text-[#434655]">
                      {comp.monitoredPages.length} pages indexed
                    </span>
                    {comp.alertCount > 0 ? (
                      <span className="text-[11px] font-mono-code font-semibold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded">
                        {comp.alertCount} new {comp.alertCount === 1 ? 'alert' : 'alerts'}
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono-code text-emerald-600">
                        Up to date
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Alerts Feed & Filter Bar */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Bar */}
          <div className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl p-3.5 space-y-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#737686] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search alerts by competitor, topic, or keyword..."
                  className="w-full pl-9 pr-3.5 py-1.5 text-[13px] border border-[#c3c6d7] rounded-lg focus:outline-none focus:border-[#004ac6] bg-[#f7f9fb]"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as any)}
                  className="text-[12px] px-2.5 py-1.5 border border-[#c3c6d7] rounded-lg bg-[#f7f9fb] text-[#434655] font-medium"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical Only</option>
                  <option value="major">Major Only</option>
                  <option value="minor">Minor Only</option>
                </select>
              </div>
            </div>

            {/* Category Pills (Bento Category Matcher) */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#f2f4f6]">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`text-[12px] px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-[#004ac6] text-[#ffffff]'
                    : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
                }`}
              >
                All Changes
              </button>
              <button
                onClick={() => setCategoryFilter('pricing')}
                className={`text-[12px] px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  categoryFilter === 'pricing'
                    ? 'bg-[#004ac6] text-[#ffffff]'
                    : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">price_change</span>
                <span>Pricing</span>
              </button>
              <button
                onClick={() => setCategoryFilter('features')}
                className={`text-[12px] px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  categoryFilter === 'features'
                    ? 'bg-[#004ac6] text-[#ffffff]'
                    : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">extension</span>
                <span>Features</span>
              </button>
              <button
                onClick={() => setCategoryFilter('products')}
                className={`text-[12px] px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  categoryFilter === 'products'
                    ? 'bg-[#004ac6] text-[#ffffff]'
                    : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                <span>Products</span>
              </button>
              <button
                onClick={() => setCategoryFilter('messaging')}
                className={`text-[12px] px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  categoryFilter === 'messaging'
                    ? 'bg-[#004ac6] text-[#ffffff]'
                    : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">record_voice_over</span>
                <span>Messaging</span>
              </button>
            </div>
          </div>

          {/* List of Alerts */}
          {filteredAlerts.length === 0 ? (
            <div className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-[#737686] text-[36px] mb-2">
                search_off
              </span>
              <p className="text-[15px] font-semibold text-[#191c1e]">
                No change alerts matching current filter
              </p>
              <p className="text-[13px] text-[#565e74] mt-1">
                Try clearing your search query or reset category filter.
              </p>
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setSeverityFilter('all');
                  setSelectedCompetitorId('all');
                  setSearchQuery('');
                }}
                className="mt-4 bg-[#2563eb] text-[#ffffff] px-4 py-1.5 rounded-lg text-[13px] font-medium"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => {
                const isCritical = alert.severity === 'critical';
                const isMajor = alert.severity === 'major';

                return (
                  <div
                    key={alert.id}
                    onClick={() => onSelectAlert(alert)}
                    className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl p-4 md:p-5 shadow-xs hover:shadow-md hover:border-[#004ac6] transition-all cursor-pointer relative overflow-hidden group"
                  >
                    {/* Left Colored Accent Bar */}
                    <div
                      className={`absolute top-0 left-0 w-1.5 h-full ${
                        isCritical
                          ? 'bg-[#ba1a1a]'
                          : isMajor
                          ? 'bg-[#2563eb]'
                          : 'bg-[#565e74]'
                      }`}
                    />

                    {/* Top Row: Competitor & Severity */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[#004ac6]">
                          {alert.competitorName}
                        </span>
                        <span className="text-[#c3c6d7]">•</span>
                        <span className="text-[12px] font-mono-code text-[#565e74]">
                          {alert.pageType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono-code text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide ${
                            isCritical
                              ? 'text-[#ba1a1a] bg-[#ffdad6]'
                              : isMajor
                              ? 'text-[#004ac6] bg-[#dae2fd]'
                              : 'text-[#434655] bg-[#eceef0]'
                          }`}
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-[12px] font-mono-code text-[#565e74]">
                          {alert.relativeTime}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h4 className="text-[16px] font-bold text-[#191c1e] group-hover:text-[#004ac6] transition-colors">
                      {alert.title}
                    </h4>
                    <p className="text-[13px] text-[#434655] mt-1 mb-3">
                      {alert.description}
                    </p>

                    {/* Diff Preview */}
                    <div className="bg-[#f2f4f6] rounded-lg p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2 border border-[#c3c6d7]/60">
                      <div className="text-[13px] text-[#565e74] truncate max-w-xs">
                        <span className="text-[11px] font-mono-code text-[#ba1a1a] block sm:inline mr-2">−</span>
                        <span className="line-through">{alert.previousValue}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#191c1e]">
                        <span className="text-[11px] font-mono-code text-[#004ac6] mr-1">+</span>
                        <span>{alert.newValue}</span>
                      </div>
                    </div>

                    {/* Bottom AI impact hook */}
                    <div className="mt-3 pt-2.5 border-t border-[#f2f4f6] flex items-center justify-between text-[12px]">
                      <span className="text-[#434655] italic truncate max-w-[420px]">
                        "{alert.aiInsight.strategyShift}"
                      </span>
                      <span className="text-[#004ac6] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
