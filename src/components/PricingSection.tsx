import React, { useState } from 'react';
import { PRICING_PLANS } from '../data/mockData';
import { PricingPlan } from '../types';

interface PricingSectionProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro');

  return (
    <section className="py-12 md:py-16 border-t border-[#c3c6d7]/60 mb-12 max-w-3xl mx-auto w-full">
      <h2 className="text-[22px] md:text-[26px] font-bold text-[#191c1e] mb-8 text-center tracking-tight">
        Simple Pricing
      </h2>

      <div className="flex flex-col gap-6 max-w-md mx-auto">
        {PRICING_PLANS.map((plan) => {
          const isPro = plan.isPopular;
          return (
            <div
              key={plan.id}
              className={`bg-[#ffffff] rounded-xl p-6 transition-all text-left relative ${
                isPro
                  ? 'border-2 border-[#004ac6] shadow-md'
                  : 'border border-[#c3c6d7] hover:border-[#737686]'
              }`}
            >
              {/* Popular Badge */}
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#004ac6] text-[#ffffff] px-3 py-0.5 rounded-full text-[12px] font-mono-code font-medium whitespace-nowrap shadow-xs">
                  Most Popular
                </div>
              )}

              {/* Header */}
              <h3 className="text-[20px] font-semibold text-[#191c1e]">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-2 mb-4 flex items-baseline">
                <span className="text-[36px] font-bold text-[#191c1e] tracking-tight">
                  {plan.price}
                </span>
                <span className="text-[14px] text-[#434655] ml-1">
                  {plan.period}
                </span>
              </div>

              {/* Features List */}
              <ul className="flex flex-col gap-2.5 mb-6">
                {plan.features.slice(0, 2).map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[14px] text-[#434655]">
                    <span className="material-symbols-outlined text-[16px] text-[#004ac6] shrink-0">
                      check
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button
                onClick={() => {
                  setSelectedPlanId(plan.id);
                  onSelectPlan(plan);
                }}
                className={`w-full py-2.5 rounded-lg text-[14px] font-semibold transition-all cursor-pointer ${
                  plan.buttonVariant === 'primary'
                    ? 'bg-[#2563eb] text-[#ffffff] hover:bg-[#004ac6] shadow-xs active:scale-[0.99]'
                    : 'bg-[#ffffff] border border-[#c3c6d7] text-[#191c1e] hover:bg-[#f2f4f6]'
                }`}
              >
                {plan.ctaText}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
