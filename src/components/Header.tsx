import React from 'react';
import { Activity, Bell, Plus, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeView: 'landing' | 'dashboard';
  onNavigate: (view: 'landing' | 'dashboard') => void;
  onOpenAddModal: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  onOpenAddModal,
  unreadCount = 0
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 max-w-[1440px] mx-auto h-[64px] bg-[#ffffff] border-b border-[#c3c6d7]/60 transition-all duration-200 ease-in-out">
      {/* Brand Logo */}
      <div 
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-2 cursor-pointer select-none group"
      >
        <span className="material-symbols-outlined text-[#004ac6] text-[26px] group-hover:scale-105 transition-transform">
          monitoring
        </span>
        <span className="text-[20px] font-bold tracking-tight text-[#004ac6]">
          CompeteWatch
        </span>
        <span className="hidden sm:inline-block text-[11px] font-mono-code uppercase tracking-wider px-2 py-0.5 rounded bg-[#dae2fd] text-[#00174b] font-semibold">
          Free MVP
        </span>
      </div>

      {/* Navigation & Actions */}
      <div className="flex items-center gap-3">
        {/* Toggle Mode */}
        <div className="hidden sm:flex items-center bg-[#f2f4f6] p-1 rounded-lg border border-[#c3c6d7]/40 text-[13px] font-medium">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeView === 'landing'
                ? 'bg-[#ffffff] text-[#004ac6] shadow-xs font-semibold'
                : 'text-[#434655] hover:text-[#191c1e]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeView === 'dashboard'
                ? 'bg-[#ffffff] text-[#004ac6] shadow-xs font-semibold'
                : 'text-[#434655] hover:text-[#191c1e]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Monitor</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
            )}
          </button>
        </div>

        {activeView === 'dashboard' ? (
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 bg-[#2563eb] text-[#ffffff] px-3.5 py-2 rounded-lg text-[14px] font-semibold hover:bg-[#004ac6] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Track Competitor</span>
            <span className="sm:hidden">Add</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-[#434655] hover:text-[#004ac6] px-3 py-2 text-[14px] font-medium hidden xs:inline-block cursor-pointer"
            >
              Open Live Monitor
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-[#2563eb] text-[#ffffff] px-4 py-2 rounded-lg text-[14px] font-semibold hover:bg-[#004ac6] transition-colors shadow-xs active:scale-[0.98] cursor-pointer"
            >
              Start Free Monitoring
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
