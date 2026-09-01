import React from 'react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenAPIStatus?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenAPIStatus
}) => {
  return (
    <footer className="w-full py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center max-w-[1440px] mx-auto border-t border-[#c3c6d7]/60 bg-[#ffffff]">
      <div className="text-[18px] font-bold text-[#191c1e] mb-4 md:mb-0 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[#004ac6] text-[20px]">
          monitoring
        </span>
        <span>CompeteWatch</span>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0 text-[14px]">
        <button
          onClick={onOpenPrivacy}
          className="text-[#434655] hover:text-[#004ac6] hover:underline transition-colors"
        >
          Privacy
        </button>
        <button
          onClick={onOpenTerms}
          className="text-[#434655] hover:text-[#004ac6] hover:underline transition-colors"
        >
          Terms
        </button>
        <button
          onClick={onOpenAPIStatus}
          className="text-[#434655] hover:text-[#004ac6] hover:underline transition-colors flex items-center gap-1"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>API Status</span>
        </button>
        <a
          href="mailto:support@competewatch.ai"
          className="text-[#434655] hover:text-[#004ac6] hover:underline transition-colors"
        >
          Contact
        </a>
      </div>

      <div className="text-[14px] text-[#434655]">
        © 2024 CompeteWatch AI. All rights reserved.
      </div>
    </footer>
  );
};
