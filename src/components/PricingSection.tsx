import React from 'react';
import { ShieldCheck, Check, Zap, Globe } from 'lucide-react';

interface PricingSectionProps {
  onStartFree: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onStartFree }) => {
  return (
    <section className="py-12 md:py-16 border-t border-[#c3c6d7]/60 mb-12 max-w-3xl mx-auto w-full">
      <div className="bg-[#ffffff] border-2 border-[#004ac6] rounded-2xl p-8 text-center shadow-sm relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 bg-[#dae2fd] text-[#00174b] px-3 py-1 rounded-full text-[12px] font-mono-code font-bold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-4 h-4 text-[#004ac6]" />
          <span>100% Free MVP Stage</span>
        </div>

        <h2 className="text-[24px] md:text-[28px] font-bold text-[#191c1e] mb-2 tracking-tight">
          Real Website Intelligence — Free for All Teams
        </h2>

        <p className="text-[14px] md:text-[15px] text-[#434655] max-w-lg mx-auto mb-6">
          Monitor competitor pricing changes, messaging shifts, CTA alterations, and feature releases directly from real webpage content without paywalls or subscription limits.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-8 text-left">
          <div className="bg-[#f7f9fb] p-3.5 rounded-xl border border-[#c3c6d7]/60 flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#004ac6] shrink-0 mt-0.5" />
            <div className="text-[13px] text-[#191c1e]">
              <strong className="block font-semibold">Real Extraction</strong>
              <span>Clean DOM data via Jina Reader</span>
            </div>
          </div>

          <div className="bg-[#f7f9fb] p-3.5 rounded-xl border border-[#c3c6d7]/60 flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#004ac6] shrink-0 mt-0.5" />
            <div className="text-[13px] text-[#191c1e]">
              <strong className="block font-semibold">Deterministic Diffs</strong>
              <span>No hallucinated or guessed alerts</span>
            </div>
          </div>

          <div className="bg-[#f7f9fb] p-3.5 rounded-xl border border-[#c3c6d7]/60 flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#004ac6] shrink-0 mt-0.5" />
            <div className="text-[13px] text-[#191c1e]">
              <strong className="block font-semibold">Instant Alerting</strong>
              <span>Pricing, CTA & feature changes</span>
            </div>
          </div>
        </div>

        <button
          onClick={onStartFree}
          className="bg-[#2563eb] text-[#ffffff] px-6 py-3 rounded-xl text-[15px] font-semibold hover:bg-[#004ac6] transition-all shadow-sm active:scale-[0.99] cursor-pointer inline-flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          <span>Launch Live Competitor Monitor</span>
        </button>
      </div>
    </section>
  );
};
