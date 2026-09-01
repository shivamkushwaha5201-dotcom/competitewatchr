import React, { useState } from 'react';
import { X, Check, ShieldCheck, Zap } from 'lucide-react';
import { PricingPlan } from '../types';

interface PlanModalProps {
  plan: PricingPlan | null;
  onClose: () => void;
  onConfirmPlan: (planId: string) => void;
}

export const PlanModal: React.FC<PlanModalProps> = ({
  plan,
  onClose,
  onConfirmPlan
}) => {
  const [email, setEmail] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!plan) return null;

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      setSuccess(true);
      setTimeout(() => {
        onConfirmPlan(plan.id);
        onClose();
        setSuccess(false);
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl max-w-md w-full p-6 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#565e74] hover:bg-[#f2f4f6] hover:text-[#191c1e] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#dae2fd] text-[#004ac6] flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-[20px] font-bold text-[#191c1e]">
              {plan.name} Plan Activated!
            </h3>
            <p className="text-[14px] text-[#434655]">
              Your account has been upgraded with {plan.competitorLimit} and AI tracking.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#004ac6] text-[24px]">
                workspace_premium
              </span>
              <h2 className="text-[20px] font-bold text-[#191c1e]">
                {plan.name} Plan
              </h2>
              {plan.isPopular && (
                <span className="text-[11px] font-mono-code bg-[#dae2fd] text-[#00174b] px-2 py-0.5 rounded font-bold">
                  Popular
                </span>
              )}
            </div>

            <div className="flex items-baseline mb-4">
              <span className="text-[32px] font-bold text-[#191c1e]">
                {plan.price}
              </span>
              <span className="text-[14px] text-[#565e74] ml-1">
                {plan.period}
              </span>
            </div>

            <div className="bg-[#f2f4f6] p-3.5 rounded-lg border border-[#c3c6d7]/60 mb-5">
              <div className="text-[12px] font-semibold text-[#191c1e] mb-2">
                What's included:
              </div>
              <ul className="space-y-1.5">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[13px] text-[#434655]">
                    <span className="material-symbols-outlined text-[16px] text-[#004ac6] shrink-0">
                      check
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleActivate} className="space-y-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-3.5 py-2 text-[14px] border border-[#c3c6d7] rounded-lg focus:outline-none focus:border-[#004ac6] bg-[#f7f9fb]"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#565e74] mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>14-day money-back guarantee • No credit card required for Free tier</span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-[#ffffff] border border-[#c3c6d7] text-[#191c1e] py-2.5 px-4 rounded-lg text-[14px] font-medium hover:bg-[#f2f4f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActivating || !email}
                  className="flex-1 bg-[#2563eb] text-[#ffffff] py-2.5 px-4 rounded-lg text-[14px] font-semibold hover:bg-[#004ac6] disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {isActivating ? (
                    <span>Activating...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>{plan.id === 'free' ? 'Get Started' : 'Confirm & Start'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
