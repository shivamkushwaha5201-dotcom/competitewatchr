import React from 'react';
import { X, ExternalLink, Share2, CheckCheck, FileText, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
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
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#565e74] hover:bg-[#f2f4f6] hover:text-[#191c1e] transition-colors cursor-pointer"
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
          <span className="text-[12px] text-[#565e74] font-mono-code ml-auto flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{alert.relativeTime}</span>
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

        {/* Diff Box: Previous Real Snapshot vs Current Real Snapshot */}
        <div className="bg-[#f2f4f6] rounded-xl p-4 border border-[#c3c6d7] mb-5">
          <div className="text-[11px] font-mono-code text-[#565e74] uppercase tracking-wider mb-2 font-semibold flex items-center justify-between">
            <span>Snapshot Comparison Diff</span>
            <span className="text-[#004ac6] font-normal">Deterministic Extraction</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#ffffff] p-3 rounded-lg border border-[#c3c6d7]/70">
              <span className="text-[11px] font-mono-code text-[#ba1a1a] font-semibold block mb-1">
                − Previous Real Snapshot
              </span>
              <p className="text-[14px] text-[#434655] line-through font-medium">
                {alert.previousValue}
              </p>
            </div>
            <div className="bg-[#ffffff] p-3 rounded-lg border border-[#004ac6]/40 ring-1 ring-[#004ac6]/20">
              <span className="text-[11px] font-mono-code text-[#004ac6] font-semibold block mb-1">
                + Current Real Snapshot
              </span>
              <p className="text-[14px] text-[#191c1e] font-semibold">
                {alert.newValue}
              </p>
            </div>
          </div>
        </div>

        {/* Verified Website Change Card */}
        <div className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl p-4 relative overflow-hidden mb-5">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#004ac6]" />
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#004ac6] text-[18px]">
                verified
              </span>
              <span className="font-mono-code text-[11px] font-bold text-[#004ac6] uppercase tracking-wider">
                Automated Change Detection
              </span>
            </div>
            <span className="text-[11px] font-mono-code font-bold text-[#004ac6] bg-[#dae2fd] px-2 py-0.5 rounded">
              Verified Evidence
            </span>
          </div>

          <h4 className="text-[15px] font-semibold text-[#191c1e] mb-1">
            {alert.aiInsight.strategyShift}
          </h4>
          
          <p className="text-[13px] text-[#434655] italic bg-[#f2f4f6] p-3 rounded-lg border border-[#c3c6d7]/60 mb-3">
            "{alert.aiInsight.businessImpact}"
          </p>

          <div className="text-[13px] text-[#191c1e]">
            <strong className="text-[#004ac6]">Recommended Action: </strong>
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

        {/* Source Evidence & View Source Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#f7f9fb] p-3 rounded-lg border border-[#c3c6d7]/60 mb-5">
          <div className="truncate max-w-[340px]">
            <div className="text-[11px] font-mono-code text-[#565e74] uppercase">Source URL</div>
            <div className="text-[13px] font-mono-code text-[#191c1e] truncate">
              {alert.pageUrl}
            </div>
          </div>
          <a
            href={alert.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#dae2fd] hover:bg-[#004ac6] hover:text-[#ffffff] text-[#00174b] px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
          >
            <span>View Source</span>
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
            className="flex-1 bg-[#2563eb] text-[#ffffff] py-2.5 px-4 rounded-lg text-[14px] font-semibold hover:bg-[#004ac6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark Reviewed & Close</span>
          </button>
          
          <button
            onClick={() => {
              navigator.clipboard?.writeText(
                `[${alert.category.toUpperCase()}] ${alert.title}\nCompetitor: ${alert.competitorName}\nPage: ${alert.pageUrl}\nBefore: ${alert.previousValue}\nAfter: ${alert.newValue}\nDetected: ${alert.timestamp}`
              );
            }}
            className="bg-[#ffffff] border border-[#c3c6d7] text-[#191c1e] py-2.5 px-4 rounded-lg text-[14px] font-medium hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Copy Diff Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
