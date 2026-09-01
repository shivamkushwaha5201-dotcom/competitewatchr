import React, { useState } from 'react';
import { ChangeCategory } from '../types';

interface WhatWeMonitorSectionProps {
  onSelectCategory?: (category: ChangeCategory) => void;
}

interface MonitorItem {
  id: ChangeCategory;
  icon: string;
  label: string;
  signals: string[];
  recentMetric: string;
}

export const WhatWeMonitorSection: React.FC<WhatWeMonitorSectionProps> = ({ onSelectCategory }) => {
  const [activeCategory, setActiveCategory] = useState<ChangeCategory | null>(null);

  const monitorCards: MonitorItem[] = [
    {
      id: 'pricing',
      icon: 'price_change',
      label: 'Pricing',
      signals: ['Tier rate changes', 'Seat & usage thresholds', 'Annual discount shifts', 'Hidden checkout fees'],
      recentMetric: '94% accuracy detecting silent price hikes'
    },
    {
      id: 'features',
      icon: 'extension',
      label: 'Features',
      signals: ['Changelog updates', 'Feature comparison grids', 'Navigation bar updates', 'Beta test flags'],
      recentMetric: 'Scans full HTML DOM trees for delta'
    },
    {
      id: 'products',
      icon: 'inventory_2',
      label: 'Products',
      signals: ['New SKU introductions', 'Enterprise add-on packages', 'Discontinued offerings', 'Bundle changes'],
      recentMetric: 'Catalogs all sub-product landing pages'
    },
    {
      id: 'messaging',
      icon: 'record_voice_over',
      label: 'Messaging',
      signals: ['Hero value proposition updates', 'Customer logo changes', 'Case study shifts', 'CTA text revisions'],
      recentMetric: 'AI tone & ICP positioning classification'
    }
  ];

  return (
    <section className="py-12 md:py-16 border-t border-[#c3c6d7]/60 max-w-3xl mx-auto w-full">
      <h2 className="text-[22px] md:text-[26px] font-bold text-[#191c1e] mb-6 text-center tracking-tight">
        What We Monitor
      </h2>

      {/* Grid 2x2 on mobile and desktop */}
      <div className="grid grid-cols-2 gap-4">
        {monitorCards.map((card) => {
          const isSelected = activeCategory === card.id;
          return (
            <div
              key={card.id}
              onClick={() => {
                const next = isSelected ? null : card.id;
                setActiveCategory(next);
                if (onSelectCategory) onSelectCategory(card.id);
              }}
              className={`bg-[#ffffff] border rounded-xl p-5 flex flex-col items-center text-center gap-2.5 transition-all cursor-pointer select-none group shadow-xs ${
                isSelected
                  ? 'border-[#004ac6] bg-[#dae2fd]/20 ring-1 ring-[#004ac6]'
                  : 'border-[#c3c6d7] hover:border-[#004ac6] hover:bg-[#f2f4f6]/60'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#dae2fd]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[#004ac6] text-[30px]">
                  {card.icon}
                </span>
              </div>

              <span className="text-[16px] text-[#191c1e] font-semibold">
                {card.label}
              </span>

              <span className="text-[11px] font-mono-code text-[#565e74]">
                {isSelected ? 'Tap to collapse' : 'Click to inspect signals'}
              </span>

              {isSelected && (
                <div className="w-full mt-2 pt-2 border-t border-[#c3c6d7]/60 text-left text-[12px] text-[#434655] animate-fadeIn">
                  <div className="font-semibold text-[#191c1e] mb-1">Tracked Signals:</div>
                  <ul className="space-y-1 mb-2">
                    {card.signals.map((sig, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                        <span className="w-1 h-1 rounded-full bg-[#004ac6]" />
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-[#f2f4f6] p-1.5 rounded text-[10px] font-mono-code text-[#004ac6]">
                    {card.recentMetric}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
