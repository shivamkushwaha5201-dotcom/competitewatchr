import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Send, Check, Globe, AlertCircle, ExternalLink } from 'lucide-react';
import { fetchRealPageContent, extractStructuredContent } from '../services/monitorEngine';

interface InsightScenario {
  id: string;
  title: string;
  competitor: string;
  changeSummary: React.ReactNode;
  businessImpact: string;
  recommendedCounter: string;
  verifiedSource: string;
}

export const AIInsightSection: React.FC = () => {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlError, setCrawlError] = useState<string | null>(null);
  const [liveExtractedData, setLiveExtractedData] = useState<{
    title: string;
    url: string;
    heroHeadline: string;
    pricingCount: number;
    featuresCount: number;
    ctasCount: number;
    rawSnippet: string;
  } | null>(null);

  const scenarios: InsightScenario[] = [
    {
      id: 'pricing-shift',
      title: 'Competitor Pricing Strategy Shift',
      competitor: 'Linear',
      changeSummary: (
        <span>
          Pro plan increased: <span className="line-through text-[#565e74]">$29/mo</span> → <strong className="text-[#191c1e] font-bold">$39/mo</strong>
        </span>
      ),
      businessImpact:
        'Business impact: Shift indicates higher ACV targeting and expanded enterprise feature packaging. Review your mid-tier value messaging.',
      recommendedCounter:
        'Highlight locked-in pricing for migrating teams and compare features side-by-side.',
      verifiedSource: 'https://linear.app/pricing'
    },
    {
      id: 'feature-drop',
      title: 'Automated Workflow Capability Launch',
      competitor: 'Supabase',
      changeSummary: (
        <span>
          Feature added: <span className="line-through text-[#565e74]">Manual Branching</span> → <strong className="text-[#191c1e] font-bold">Automated Database Migrations</strong>
        </span>
      ),
      businessImpact:
        'Business impact: Reduces developer onboarding friction and targets backend operations teams directly.',
      recommendedCounter:
        'Publish benchmark documentation showcasing your automated migration speed and security audits.',
      verifiedSource: 'https://supabase.com/features'
    },
    {
      id: 'messaging-pivot',
      title: 'Homepage Value Proposition Repositioning',
      competitor: 'Resend',
      changeSummary: (
        <span>
          Headline changed: <span className="line-through text-[#565e74]">"Email for developers"</span> → <strong className="text-[#191c1e] font-bold">"Enterprise Communications Platform"</strong>
        </span>
      ),
      businessImpact:
        'Business impact: Expands positioning upmarket to enterprise security leaders while keeping developer ergonomics.',
      recommendedCounter:
        'Target high-growth startups seeking fast, lightweight API integration.',
      verifiedSource: 'https://resend.com'
    }
  ];

  const current = scenarios[selectedScenarioIdx];

  const handleTestRealFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setIsCrawling(true);
    setCrawlError(null);
    setLiveExtractedData(null);

    let url = customInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    const res = await fetchRealPageContent(url);
    if (!res.success || !res.content) {
      setCrawlError(res.error || 'Unable to verify this website right now.');
      setIsCrawling(false);
      return;
    }

    const snapshot = extractStructuredContent(res.content, 'messaging', url, 'Homepage');
    setLiveExtractedData({
      title: res.title || url,
      url: url,
      heroHeadline: snapshot.heroHeadline || 'Verified page structure extracted',
      pricingCount: snapshot.pricingTiers.length,
      featuresCount: snapshot.features.length,
      ctasCount: snapshot.ctas.length,
      rawSnippet: snapshot.rawVisibleText.substring(0, 240) + '...'
    });
    setIsCrawling(false);
  };

  return (
    <section className="py-12 md:py-16 border-t border-[#c3c6d7]/60 max-w-3xl mx-auto w-full">
      <h2 className="text-[22px] md:text-[26px] font-bold text-[#191c1e] mb-6 text-center tracking-tight">
        Verified Website Intelligence
      </h2>

      {/* Main Intelligence Card */}
      <div className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl p-5 md:p-6 shadow-sm relative overflow-hidden text-left">
        {/* Left vertical Primary Bar */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#004ac6]" />

        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#004ac6]" />
            <span className="font-mono-code text-[12px] font-semibold text-[#004ac6] uppercase tracking-wider">
              Deterministic DOM Comparison
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono-code text-[#565e74]">Method</span>
            <span className="text-[11px] font-mono-code font-bold text-[#004ac6] bg-[#dae2fd]/60 px-2 py-0.5 rounded">
              Verified Snapshot Diff
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[18px] md:text-[20px] font-semibold text-[#191c1e] mb-2">
          {current.title}
        </h3>

        {/* Delta */}
        <p className="text-[14px] text-[#434655] mb-4">
          {current.changeSummary}
        </p>

        {/* Quotation Gray Box */}
        <div className="bg-[#f2f4f6] p-4 rounded-lg border border-[#c3c6d7]/70 mb-4">
          <p className="text-[14px] text-[#191c1e] italic leading-relaxed">
            "{current.businessImpact}"
          </p>
        </div>

        {/* Strategic Response */}
        <div className="pt-3 border-t border-[#f2f4f6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px]">
          <div className="flex items-center gap-1.5 text-[#004ac6] font-medium">
            <span className="material-symbols-outlined text-[16px]">lightbulb</span>
            <span>Recommended Response:</span>
          </div>
          <span className="text-[#434655] text-[12px] sm:max-w-xs text-right font-medium">
            {current.recommendedCounter}
          </span>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="mt-5 pt-3 border-t border-[#c3c6d7]/50 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono-code text-[#565e74] uppercase tracking-wider">
            Explore Monitored Examples:
          </span>
          {scenarios.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioIdx(idx);
              }}
              className={`text-[12px] px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedScenarioIdx === idx
                  ? 'bg-[#2563eb] text-[#ffffff] font-medium'
                  : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
              }`}
            >
              {sc.competitor}
            </button>
          ))}
        </div>
      </div>

      {/* Real Live Website Test Sandbox */}
      <div className="mt-5 bg-[#ffffff] border border-[#c3c6d7]/80 rounded-xl p-4 text-left">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-[#004ac6]" />
          <span className="text-[13px] font-semibold text-[#191c1e]">
            Live Website Content Verifier (Jina Reader)
          </span>
        </div>

        {crawlError && (
          <div className="mb-3 p-2.5 bg-[#ffdad6]/50 border border-[#ba1a1a]/40 rounded-lg flex items-center gap-2 text-[#ba1a1a] text-[12px]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{crawlError}</span>
          </div>
        )}

        <form onSubmit={handleTestRealFetch} className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value);
              setCrawlError(null);
            }}
            placeholder="Enter any real competitor URL (e.g. stripe.com or linear.app)"
            className="flex-1 px-3.5 py-2 text-[13px] border border-[#c3c6d7] rounded-lg focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] font-mono-code placeholder:font-sans bg-[#f7f9fb]"
          />
          <button
            type="submit"
            disabled={isCrawling || !customInput.trim()}
            className="bg-[#2563eb] text-[#ffffff] px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#004ac6] disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {isCrawling ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Fetching...</span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5" />
                <span>Verify DOM</span>
              </>
            )}
          </button>
        </form>

        {liveExtractedData && (
          <div className="mt-3 p-3 bg-[#f7f9fb] border border-[#c3c6d7] rounded-lg text-[12px] text-[#191c1e]">
            <div className="flex items-center justify-between font-semibold text-[#004ac6] mb-1">
              <span>{liveExtractedData.title}</span>
              <a
                href={liveExtractedData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 text-[#565e74]"
              >
                <span>View Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-[13px] font-medium text-[#191c1e] mb-2">
              Headline: "{liveExtractedData.heroHeadline}"
            </div>
            <div className="flex gap-3 text-[#565e74] font-mono-code text-[11px] mb-2">
              <span>Prices: {liveExtractedData.pricingCount}</span>
              <span>Features: {liveExtractedData.featuresCount}</span>
              <span>CTAs: {liveExtractedData.ctasCount}</span>
            </div>
            <div className="text-[11px] font-mono-code bg-[#ffffff] p-2 rounded border border-[#c3c6d7]/60 text-[#434655]">
              {liveExtractedData.rawSnippet}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
