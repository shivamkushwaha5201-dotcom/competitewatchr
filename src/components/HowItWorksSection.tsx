import React from 'react';

interface HowItWorksSectionProps {
  onStartMonitoring: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onStartMonitoring }) => {
  return (
    <section id="how-it-works" className="py-12 md:py-16 border-t border-[#c3c6d7]/60 max-w-3xl mx-auto w-full">
      <h2 className="text-[22px] md:text-[26px] font-bold text-[#191c1e] mb-10 text-center tracking-tight">
        How It Works
      </h2>

      <div className="flex flex-col gap-8 relative max-w-md mx-auto">
        {/* Vertical Line */}
        <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-[#c3c6d7] z-0" />

        {/* Step 1 */}
        <div className="flex gap-4 items-start relative z-10 group">
          <div className="w-12 h-12 rounded-full bg-[#2563eb] text-[#ffffff] flex items-center justify-center text-[18px] font-bold shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            1
          </div>
          <div className="pt-1.5 flex-1">
            <h3 className="text-[18px] font-semibold text-[#191c1e]">
              Add competitors
            </h3>
            <p className="text-[14px] text-[#434655] mt-1">
              Input the URLs you want to track.
            </p>
            <div className="mt-2 text-[12px] font-mono-code text-[#004ac6] bg-[#dae2fd]/40 px-2.5 py-1 rounded inline-block">
              e.g. competitor.com/pricing, /features
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4 items-start relative z-10 group">
          <div className="w-12 h-12 rounded-full bg-[#2563eb] text-[#ffffff] flex items-center justify-center text-[18px] font-bold shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            2
          </div>
          <div className="pt-1.5 flex-1">
            <h3 className="text-[18px] font-semibold text-[#191c1e]">
              We detect changes
            </h3>
            <p className="text-[14px] text-[#434655] mt-1">
              Our engine scans daily for modifications.
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#565e74]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6]" />
              <span>DOM visual diff + DOM AST structural tracking</span>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4 items-start relative z-10 group">
          <div className="w-12 h-12 rounded-full bg-[#2563eb] text-[#ffffff] flex items-center justify-center text-[18px] font-bold shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            3
          </div>
          <div className="pt-1.5 flex-1">
            <h3 className="text-[18px] font-semibold text-[#191c1e]">
              Get intelligent alerts
            </h3>
            <p className="text-[14px] text-[#434655] mt-1">
              Receive AI-summarized insights instantly.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] font-mono-code bg-[#ffdad6] text-[#ba1a1a] px-2 py-0.5 rounded font-semibold">
                Strategic Impact Analysis
              </span>
              <span className="text-[11px] font-mono-code bg-[#eceef0] text-[#434655] px-2 py-0.5 rounded font-medium">
                Instant Diff
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
