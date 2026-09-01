import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { ChangeAlert } from '../types';

interface HeroSectionProps {
  onStartMonitoring: () => void;
  onScrollToHowItWorks: () => void;
  onSelectAlert: (alert: ChangeAlert) => void;
  sampleAlert: ChangeAlert;
  onTriggerScanSimulation: () => void;
  isScanning?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartMonitoring,
  onScrollToHowItWorks,
  onSelectAlert,
  sampleAlert,
  onTriggerScanSimulation,
  isScanning = false
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput) {
      onStartMonitoring();
      return;
    }
    setAddedSuccess(true);
    setTimeout(() => {
      onStartMonitoring();
      setAddedSuccess(false);
    }, 600);
  };

  return (
    <section className="py-10 md:py-16 flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
      {/* Real-time Status Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dae2fd] text-[#00174b] text-[12px] font-medium tracking-wide">
        <span className="w-2 h-2 rounded-full bg-[#004ac6] animate-pulse" />
        <span>Live Autonomous Competitor Tracking Active</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-[36px] sm:text-[44px] md:text-[50px] font-bold text-[#191c1e] leading-[1.12] tracking-tight">
        Know When Your Competitors Change.
      </h1>

      {/* Subtitle */}
      <p className="text-[16px] md:text-[18px] text-[#434655] leading-relaxed max-w-2xl mx-auto font-normal">
        Monitor competitor websites, pricing, product pages, and positioning. Get an AI-powered alert whenever something important changes.
      </p>

      {/* Quick Start Form / Buttons */}
      <div className="flex flex-col sm:flex-row w-full gap-3 mt-2 max-w-xl">
        <button
          onClick={onStartMonitoring}
          className="w-full sm:flex-1 bg-[#2563eb] text-[#ffffff] py-3.5 px-6 rounded-lg text-[16px] font-semibold hover:bg-[#004ac6] transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99]"
        >
          <span>Start Monitoring Free</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={onScrollToHowItWorks}
          className="w-full sm:w-auto bg-[#ffffff] border border-[#c3c6d7] text-[#565e74] py-3.5 px-6 rounded-lg text-[16px] font-medium hover:bg-[#e0e3e5]/40 hover:text-[#191c1e] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-[#565e74]" />
          <span>See How It Works</span>
        </button>
      </div>

      {/* Dashboard Preview Widget (Matching Screen) */}
      <div className="mt-6 w-full max-w-xl text-left">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-[12px] font-mono-code uppercase tracking-wider text-[#565e74] font-semibold">
            Live Preview Widget
          </span>
          <button
            onClick={onTriggerScanSimulation}
            disabled={isScanning}
            className="text-[12px] text-[#004ac6] hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isScanning ? 'Scanning...' : 'Test AI Scan'}</span>
          </button>
        </div>

        <div
          onClick={() => onSelectAlert(sampleAlert)}
          className="w-full bg-[#ffffff] border border-[#c3c6d7] rounded-xl p-5 shadow-md hover:shadow-lg transition-all text-left relative overflow-hidden cursor-pointer group"
        >
          {/* Left Vertical Critical Bar */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ba1a1a]" />

          {/* Top Pill & Icon */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
                trending_up
              </span>
              <span className="font-mono-code text-[11px] font-semibold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded tracking-wide">
                CRITICAL ALERT
              </span>
            </div>
            <span className="text-[12px] font-mono-code text-[#565e74]">
              {sampleAlert.relativeTime}
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="text-[18px] md:text-[20px] font-semibold text-[#191c1e] group-hover:text-[#004ac6] transition-colors">
            {sampleAlert.title}
          </h3>
          <p className="text-[14px] text-[#434655] mt-1 mb-3.5">
            {sampleAlert.description}
          </p>

          {/* Price Diff Visualizer */}
          <div className="bg-[#f2f4f6] rounded-lg p-3.5 flex justify-between items-center border border-[#c3c6d7]/70">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono-code uppercase text-[#565e74]">Previous</span>
              <span className="text-[15px] text-[#434655] line-through font-medium">
                {sampleAlert.previousValue}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ffffff] rounded-md border border-[#c3c6d7]/60 shadow-xs">
              <span className="material-symbols-outlined text-[#737686] text-[18px]">
                arrow_forward
              </span>
              <span className="text-[11px] font-mono-code font-bold text-[#ba1a1a]">+34%</span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[11px] font-mono-code uppercase text-[#ba1a1a] font-semibold">New Price</span>
              <span className="text-[18px] text-[#191c1e] font-bold">
                {sampleAlert.newValue}
              </span>
            </div>
          </div>

          {/* Bottom quick action footer */}
          <div className="mt-3 pt-2.5 border-t border-[#f2f4f6] flex items-center justify-between text-[12px] text-[#565e74]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#004ac6]">auto_awesome</span>
              AI Strategic analysis attached
            </span>
            <span className="text-[#004ac6] font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
              Inspect Diff →
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
