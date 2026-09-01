import React, { useState } from 'react';
import { ChangeCategory } from '../types';

interface ProblemSectionProps {
  onCategorySelect?: (category: ChangeCategory) => void;
}

interface ProblemItem {
  id: string;
  icon: string;
  title: string;
  category: ChangeCategory;
  example: string;
  risk: string;
}

export const ProblemSection: React.FC<ProblemSectionProps> = ({ onCategorySelect }) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const problemItems: ProblemItem[] = [
    {
      id: 'pricing',
      icon: 'payments',
      title: 'Sneaky Pricing Updates',
      category: 'pricing',
      example: 'Competitor silently drops plan prices or hides add-on fees to undercut your sales cycle.',
      risk: 'Losing prospects during buyer vendor bake-offs.'
    },
    {
      id: 'features',
      icon: 'new_releases',
      title: 'Unannounced Features',
      category: 'features',
      example: 'A sudden AI integration or critical API release is shipped without a public press release.',
      risk: 'Getting caught off guard on sales discovery calls.'
    },
    {
      id: 'messaging',
      icon: 'campaign',
      title: 'Subtle Messaging Shifts',
      category: 'messaging',
      example: 'Competitor updates homepage pitch from SMB to Enterprise, targeting your top accounts.',
      risk: 'Erosion of your core market positioning.'
    },
    {
      id: 'cta',
      icon: 'touch_app',
      title: 'Changed Call-to-Actions',
      category: 'messaging',
      example: 'Flipping from "Book Demo" to "Instant Free Trial" to capture high-velocity buyer demand.',
      risk: 'Competitor winning top-of-funnel friction test.'
    }
  ];

  return (
    <section className="py-12 md:py-16 border-t border-[#c3c6d7]/60 max-w-3xl mx-auto w-full">
      {/* Title */}
      <h2 className="text-[22px] md:text-[26px] font-bold text-[#191c1e] mb-2 text-center tracking-tight">
        Stop checking competitor websites manually.
      </h2>
      <p className="text-[15px] text-[#434655] text-center mb-8">
        Competitors change silently. You miss:
      </p>

      {/* Grid of 4 Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {problemItems.map((item) => {
          const isSelected = activeItem === item.id;
          return (
            <div
              key={item.id}
              onClick={() => {
                setActiveItem(isSelected ? null : item.id);
                if (onCategorySelect) onCategorySelect(item.category);
              }}
              className={`bg-[#ffffff] border rounded-lg p-4 flex flex-col justify-center transition-all cursor-pointer select-none ${
                isSelected
                  ? 'border-[#004ac6] bg-[#dae2fd]/20 ring-1 ring-[#004ac6]'
                  : 'border-[#c3c6d7] hover:border-[#737686] hover:bg-[#f2f4f6]/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#f2f4f6] flex items-center justify-center shrink-0 border border-[#c3c6d7]/50">
                  <span className="material-symbols-outlined text-[#565e74] text-[24px]">
                    {item.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-[15px] text-[#191c1e] font-semibold block">
                    {item.title}
                  </span>
                  <span className="text-[12px] text-[#565e74]">
                    Click to view radar example
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-[#c3c6d7]/50 text-[13px] text-[#434655] animate-fadeIn">
                  <p className="mb-1.5"><strong className="text-[#191c1e]">Real scenario:</strong> {item.example}</p>
                  <p className="text-[#ba1a1a] font-medium"><strong className="text-[#191c1e]">Business impact:</strong> {item.risk}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
