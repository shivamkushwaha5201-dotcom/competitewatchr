import React, { useState } from 'react';
import { Sparkles, RefreshCw, Send, Check } from 'lucide-react';

interface InsightScenario {
  id: string;
  title: string;
  competitor: string;
  changeSummary: React.ReactNode;
  businessImpact: string;
  recommendedCounter: string;
  confidence: number;
}

export const AIInsightSection: React.FC = () => {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customInsight, setCustomInsight] = useState<{
    title: string;
    changeSummary: string;
    impact: string;
    action: string;
  } | null>(null);

  const scenarios: InsightScenario[] = [
    {
      id: 'pricing-shift',
      title: 'Competitor X Pricing Strategy Shift',
      competitor: 'Competitor X',
      changeSummary: (
        <span>
          Pro plan increased: <span className="line-through text-[#565e74]">$29/mo</span> → <strong className="text-[#191c1e] font-bold">$39/mo</strong>
        </span>
      ),
      businessImpact:
        'Business impact: This indicates a move toward higher-value positioning and potentially higher customer acquisition costs. Consider reviewing your mid-tier offering\'s perceived value.',
      recommendedCounter:
        'Launch an email campaign highlighting your locked-in $29 pricing for existing and migrating users.',
      confidence: 96
    },
    {
      id: 'feature-drop',
      title: 'Veloce Sprint Automation Launch',
      competitor: 'Veloce HQ',
      changeSummary: (
        <span>
          Feature added: <span className="line-through text-[#565e74]">Manual Backlog Grooming</span> → <strong className="text-[#191c1e] font-bold">Predictive AI Sprint Triage</strong>
        </span>
      ),
      businessImpact:
        'Business impact: Reduces manual operational overhead for engineering leads by ~30%. Directly targets your project management customer persona.',
      recommendedCounter:
        'Publish a comparative benchmark showcasing your automated workflow speed vs third-party bots.',
      confidence: 93
    },
    {
      id: 'messaging-pivot',
      title: 'PayStream Enterprise Repositioning',
      competitor: 'PayStream Cloud',
      changeSummary: (
        <span>
          Headline changed: <span className="line-through text-[#565e74]">"Payments for indie developers"</span> → <strong className="text-[#191c1e] font-bold">"Global Treasury Platform for Enterprise"</strong>
        </span>
      ),
      businessImpact:
        'Business impact: Abandons SMB/Indie segment to hunt 6-figure ACVs. Leaves high-growth early startups vulnerable to poaching.',
      recommendedCounter:
        'Target "PayStream alternative for startups" on search ads and offer 1-click API migration.',
      confidence: 95
    }
  ];

  const current = scenarios[selectedScenarioIdx];

  const handleGenerateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setCustomInsight({
        title: `AI Analysis for "${customInput}"`,
        changeSummary: `Detected modification in ${customInput.includes('http') ? customInput : 'https://' + customInput}`,
        impact: `Business impact: The observed change alters the competitive differentiation equilibrium. Expect increased marketing spend on this category within the next 45 days.`,
        action: `Audit your product roadmap and prepare a dedicated battle card for sales reps within 24 hours.`
      });
      setIsGenerating(false);
    }, 850);
  };

  return (
    <section className="py-12 md:py-16 border-t border-[#c3c6d7]/60 max-w-3xl mx-auto w-full">
      <h2 className="text-[22px] md:text-[26px] font-bold text-[#191c1e] mb-6 text-center tracking-tight">
        AI-Powered Insights
      </h2>

      {/* Main AI Insight Card (Matching screenshot) */}
      <div className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl p-5 md:p-6 shadow-sm relative overflow-hidden text-left">
        {/* Left vertical Primary Bar */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#004ac6]" />

        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[20px]">
              auto_awesome
            </span>
            <span className="font-mono-code text-[12px] font-semibold text-[#004ac6] uppercase tracking-wider">
              AI Analysis
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono-code text-[#565e74]">Confidence</span>
            <span className="text-[11px] font-mono-code font-bold text-[#004ac6] bg-[#dae2fd]/60 px-2 py-0.5 rounded">
              {current.confidence}%
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[18px] md:text-[20px] font-semibold text-[#191c1e] mb-2">
          {customInsight ? customInsight.title : current.title}
        </h3>

        {/* Delta */}
        <p className="text-[14px] text-[#434655] mb-4">
          {customInsight ? customInsight.changeSummary : current.changeSummary}
        </p>

        {/* Quotation Gray Box */}
        <div className="bg-[#f2f4f6] p-4 rounded-lg border border-[#c3c6d7]/70">
          <p className="text-[14px] text-[#191c1e] italic leading-relaxed">
            "{customInsight ? customInsight.impact : current.businessImpact}"
          </p>
        </div>

        {/* Strategic Counter Action */}
        <div className="mt-4 pt-3 border-t border-[#f2f4f6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px]">
          <div className="flex items-center gap-1.5 text-[#004ac6] font-medium">
            <span className="material-symbols-outlined text-[16px]">lightbulb</span>
            <span>Recommended Strategic Response:</span>
          </div>
          <span className="text-[#434655] text-[12px] sm:max-w-xs text-right">
            {customInsight ? customInsight.action : current.recommendedCounter}
          </span>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="mt-5 pt-3 border-t border-[#c3c6d7]/50 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono-code text-[#565e74] uppercase tracking-wider">
            Explore Scenarios:
          </span>
          {scenarios.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setCustomInsight(null);
                setSelectedScenarioIdx(idx);
              }}
              className={`text-[12px] px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedScenarioIdx === idx && !customInsight
                  ? 'bg-[#2563eb] text-[#ffffff] font-medium'
                  : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
              }`}
            >
              {sc.competitor}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive AI Sandbox Prompt */}
      <div className="mt-5 bg-[#ffffff] border border-[#c3c6d7]/80 rounded-xl p-4 text-left">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#004ac6]" />
          <span className="text-[13px] font-semibold text-[#191c1e]">
            Try Instant Competitor Analysis Simulator
          </span>
        </div>
        <form onSubmit={handleGenerateCustom} className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter any competitor URL (e.g. notion.so, stripe.com)"
            className="flex-1 px-3.5 py-2 text-[13px] border border-[#c3c6d7] rounded-lg focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] font-mono-code placeholder:font-sans bg-[#f7f9fb]"
          />
          <button
            type="submit"
            disabled={isGenerating || !customInput.trim()}
            className="bg-[#2563eb] text-[#ffffff] px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#004ac6] disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Simulate</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
