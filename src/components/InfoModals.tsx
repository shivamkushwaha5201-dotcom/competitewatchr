import React from 'react';
import { X, Shield, FileText, CheckCircle2, Activity } from 'lucide-react';

interface InfoModalProps {
  type: 'privacy' | 'terms' | 'status' | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl max-w-lg w-full p-6 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#565e74] hover:bg-[#f2f4f6] hover:text-[#191c1e]"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'privacy' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[#004ac6]" />
              <h3 className="text-[20px] font-bold text-[#191c1e]">Privacy Policy</h3>
            </div>
            <p className="text-[14px] text-[#434655] mb-3">
              CompeteWatch operates in strict compliance with automated data indexing standards. We only analyze publicly accessible web pages (e.g. pricing tiers, product feature grids, and changelog updates).
            </p>
            <p className="text-[14px] text-[#434655] mb-3">
              Your monitored competitor list, custom alert thresholds, and AI strategy reports are strictly private to your workspace organization and never shared or syndicated.
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-[#004ac6]" />
              <h3 className="text-[20px] font-bold text-[#191c1e]">Terms of Service</h3>
            </div>
            <p className="text-[14px] text-[#434655] mb-3">
              CompeteWatch provides autonomous competitor change detection and generative strategic synthesis.
            </p>
            <p className="text-[14px] text-[#434655] mb-3">
              Users agree to monitor only domains for legitimate commercial intelligence and market strategy research. Scan limits are enforced according to your active plan tier (Free: 3 competitors, Pro: 20 competitors, Business: 100 competitors).
            </p>
          </div>
        )}

        {type === 'status' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-emerald-600" />
              <h3 className="text-[20px] font-bold text-[#191c1e]">Systems & API Status</h3>
            </div>
            <div className="space-y-2 mb-4 text-[13px]">
              <div className="flex justify-between p-2.5 bg-[#f2f4f6] rounded-lg">
                <span className="font-semibold text-[#191c1e]">DOM Scraping & Diff Engine</span>
                <span className="text-emerald-700 font-mono-code font-bold">Operational (99.99%)</span>
              </div>
              <div className="flex justify-between p-2.5 bg-[#f2f4f6] rounded-lg">
                <span className="font-semibold text-[#191c1e]">AI Synthesis & Strategic Reasoning</span>
                <span className="text-emerald-700 font-mono-code font-bold">Operational (42ms)</span>
              </div>
              <div className="flex justify-between p-2.5 bg-[#f2f4f6] rounded-lg">
                <span className="font-semibold text-[#191c1e]">Slack / Webhook Dispatcher</span>
                <span className="text-emerald-700 font-mono-code font-bold">Operational</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-[#c3c6d7]/60 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#2563eb] text-[#ffffff] px-4 py-2 rounded-lg text-[14px] font-semibold hover:bg-[#004ac6]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
