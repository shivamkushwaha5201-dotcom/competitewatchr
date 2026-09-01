import React from 'react';
import { X, ExternalLink, Share2, Sparkles, CheckCheck, FileText, ArrowRight } from 'lucide-react';
import { ChangeAlert } from '../types';

interface AlertDetailModalProps {
  alert: ChangeAlert | null;
  onClose: () => void;
  onMarkRead: (alertId: string) => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  onMarkRead
}) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#565e74] hover:bg-[#f2f4f6] hover:text-[#191c1e] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Severity & Timestamp */}
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
            trending_up
          </span>
          <span className="font-mono-code text-[11px] font-semibold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded tracking-wide">
            {alert.severity.toUpperCase()} ALERT
          </span>
          <span className="text-[12px] text-[#565e74] font-mono-code ml-auto">
            {alert.relativeTime}
          </span>
        </div>

        {/* Competitor & Title */}
        <div className="text-[13px] font-mono-code text-[#004ac6] font-semibold mb-1">
          {alert.competitorName} • {alert.pageType}
        </div>
        <h2 className="text-[20px] font-bold text-[#191c1e] mb-2 leading-snug">
          {alert.title}
        </h2>
        <p className="text-[14px] text-[#434655] mb-4">
          {alert.description}
        </p>

        {/* Diff Box */}
        <div className="bg-[#f2f4f6] rounded-xl p-4 border border-[#c3c6d7] mb-5">
          <div className="text-[11px] font-mono-code text-[#565e74] uppercase tracking-wider mb-2 font-semibold">
            Detected Structural Change
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#ffffff] p-3 rounded-lg border border-[#c3c6d7]/70">
              <span className="text-[11px] font-mono-code text-[#ba1a1a] font-semibold block mb-1">
                − Previous State
              </span>
              <p className="text-[14px] text-[#434655] line-through">
                {alert.previousValue}
              </p>
            </div>
            <div className="bg-[#ffffff] p-3 rounded-lg border border-[#004ac6]/40 ring-1 ring-[#004ac6]/20">
              <span className="text-[11px] font-mono-code text-[#004ac6] font-semibold block mb-1">
                + New Detected State
              </span>
              <p className="text-[14px] text-[#191c1e] font-semibold">
                {alert.newValue}
              </p>
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl p-4 relative overflow-hidden mb-5">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#004ac6]" />
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#004ac6]" />
              <span className="font-mono-code text-[11px] font-bold text-[#004ac6] uppercase tracking-wider">
                AI Strategic Impact Assessment
              </span>
            </div>
            <span className="text-[11px] font-mono-code font-bold text-[#004ac6] bg-[#dae2fd] px-2 py-0.5 rounded">
              {alert.aiInsight.confidence}% Confidence
            </span>
          </div>

          <h4 className="text-[15px] font-semibold text-[#191c1e] mb-1">
            {alert.aiInsight.strategyShift}
          </h4>
          
          <p className="text-[13px] text-[#434655] italic bg-[#f2f4f6] p-3 rounded-lg border border-[#c3c6d7]/60 mb-3">
            "{alert.aiInsight.businessImpact}"
          </p>

          <div className="text-[13px] text-[#191c1e]">
            <strong className="text-[#004ac6]">Action Plan: </strong>
            {alert.aiInsight.recommendedAction}
          </div>

          {alert.aiInsight.tags && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-[#f2f4f6]">
              {alert.aiInsight.tags.map((tag, idx) => (
                <span key={idx} className="text-[11px] font-mono-code bg-[#eceef0] text-[#434655] px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Source Page URL */}
        <div className="flex items-center justify-between text-[12px] text-[#565e74] bg-[#f7f9fb] p-2.5 rounded-lg border border-[#c3c6d7]/50 mb-5">
          <span className="truncate max-w-[320px] font-mono-code">
            {alert.pageUrl}
          </span>
          <a
            href={alert.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#004ac6] hover:underline flex items-center gap-1 font-medium shrink-0 ml-2"
          >
            <span>Open Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#c3c6d7]/60">
          <button
            onClick={() => {
              onMarkRead(alert.id);
              onClose();
            }}
            className="flex-1 bg-[#2563eb] text-[#ffffff] py-2.5 px-4 rounded-lg text-[14px] font-semibold hover:bg-[#004ac6] transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark Reviewed & Close</span>
          </button>
          
          <button
            onClick={() => {
              navigator.clipboard?.writeText(`${alert.title} - ${alert.description}\nImpact: ${alert.aiInsight.businessImpact}`);
              alert('Copied alert briefing to clipboard!');
            }}
            className="bg-[#ffffff] border border-[#c3c6d7] text-[#191c1e] py-2.5 px-4 rounded-lg text-[14px] font-medium hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Copy Briefing</span>
          </button>
        </div>
      </div>
    </div>
  );
};
