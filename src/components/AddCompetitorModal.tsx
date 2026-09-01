import React, { useState } from 'react';
import { X, Globe, Plus, Check, Sparkles, Shield } from 'lucide-react';
import { MonitoredCompetitor } from '../types';

interface AddCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCompetitor: (competitor: Omit<MonitoredCompetitor, 'id'>) => void;
}

export const AddCompetitorModal: React.FC<AddCompetitorModalProps> = ({
  isOpen,
  onClose,
  onAddCompetitor
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Direct Competitor');
  const [frequency, setFrequency] = useState<'daily' | 'hourly'>('daily');
  const [monitorPricing, setMonitorPricing] = useState(true);
  const [monitorFeatures, setMonitorFeatures] = useState(true);
  const [monitorMessaging, setMonitorMessaging] = useState(true);
  const [monitorProducts, setMonitorProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quickPresets = [
    { name: 'Linear', url: 'https://linear.app', category: 'Project Management' },
    { name: 'Supabase', url: 'https://supabase.com', category: 'Database & Backend' },
    { name: 'Resend', url: 'https://resend.com', category: 'Email Infrastructure' },
    { name: 'Cal.com', url: 'https://cal.com', category: 'Scheduling' }
  ];

  const handleSelectPreset = (preset: { name: string; url: string; category: string }) => {
    setName(preset.name);
    setUrl(preset.url);
    setCategory(preset.category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsSubmitting(true);

    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const derivedName = name.trim() || new URL(formattedUrl).hostname.replace('www.', '');

    const pages = [];
    if (monitorPricing) {
      pages.push({
        name: 'Pricing Page',
        url: `${formattedUrl}/pricing`,
        type: 'pricing' as const,
        lastChange: 'Just added'
      });
    }
    if (monitorFeatures) {
      pages.push({
        name: 'Features / Product',
        url: `${formattedUrl}/features`,
        type: 'features' as const,
        lastChange: 'Just added'
      });
    }
    if (monitorMessaging) {
      pages.push({
        name: 'Homepage Hero',
        url: formattedUrl,
        type: 'messaging' as const,
        lastChange: 'Just added'
      });
    }
    if (monitorProducts) {
      pages.push({
        name: 'Product Matrix',
        url: `${formattedUrl}/products`,
        type: 'products' as const,
        lastChange: 'Just added'
      });
    }

    setTimeout(() => {
      onAddCompetitor({
        name: derivedName,
        url: formattedUrl,
        category: category,
        status: 'active',
        lastScanned: 'Just now',
        frequency: frequency,
        monitoredPages: pages,
        alertCount: 0
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-[#ffffff] border border-[#c3c6d7] rounded-xl max-w-lg w-full p-6 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#565e74] hover:bg-[#f2f4f6] hover:text-[#191c1e] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-5 h-5 text-[#004ac6]" />
          <h2 className="text-[20px] font-bold text-[#191c1e]">
            Track New Competitor
          </h2>
        </div>
        <p className="text-[13px] text-[#434655] mb-4">
          Enter their website URL. Our AI will automatically index their pricing, features, and messaging DOM structure.
        </p>

        {/* Quick Presets */}
        <div className="mb-4">
          <span className="text-[11px] font-mono-code text-[#565e74] uppercase tracking-wider block mb-1.5 font-semibold">
            Quick Suggestions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPresets.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="text-[12px] bg-[#f2f4f6] hover:bg-[#dae2fd] text-[#434655] hover:text-[#00174b] px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-[#c3c6d7]/50"
              >
                + {p.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#191c1e] mb-1">
              Website URL *
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. competitor.com or https://acme.io"
              className="w-full px-3.5 py-2 text-[14px] border border-[#c3c6d7] rounded-lg focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] font-mono-code placeholder:font-sans bg-[#f7f9fb]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                Competitor Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full px-3 py-2 text-[13px] border border-[#c3c6d7] rounded-lg focus:outline-none focus:border-[#004ac6] bg-[#f7f9fb]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#191c1e] mb-1">
                Scan Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2 text-[13px] border border-[#c3c6d7] rounded-lg focus:outline-none focus:border-[#004ac6] bg-[#f7f9fb]"
              >
                <option value="daily">Daily (Recommended)</option>
                <option value="hourly">Hourly (Pro/Business)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#191c1e] mb-1.5">
              Pages to Monitor & Compare
            </label>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <label className="flex items-center gap-2 p-2 rounded-lg border border-[#c3c6d7]/70 bg-[#f7f9fb] cursor-pointer">
                <input
                  type="checkbox"
                  checked={monitorPricing}
                  onChange={(e) => setMonitorPricing(e.target.checked)}
                  className="rounded text-[#004ac6]"
                />
                <span>Pricing & Tiers</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg border border-[#c3c6d7]/70 bg-[#f7f9fb] cursor-pointer">
                <input
                  type="checkbox"
                  checked={monitorFeatures}
                  onChange={(e) => setMonitorFeatures(e.target.checked)}
                  className="rounded text-[#004ac6]"
                />
                <span>Feature Matrices</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg border border-[#c3c6d7]/70 bg-[#f7f9fb] cursor-pointer">
                <input
                  type="checkbox"
                  checked={monitorMessaging}
                  onChange={(e) => setMonitorMessaging(e.target.checked)}
                  className="rounded text-[#004ac6]"
                />
                <span>Hero Messaging / CTA</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg border border-[#c3c6d7]/70 bg-[#f7f9fb] cursor-pointer">
                <input
                  type="checkbox"
                  checked={monitorProducts}
                  onChange={(e) => setMonitorProducts(e.target.checked)}
                  className="rounded text-[#004ac6]"
                />
                <span>Product Add-ons</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-[#c3c6d7]/60 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#ffffff] border border-[#c3c6d7] text-[#191c1e] py-2.5 px-4 rounded-lg text-[14px] font-medium hover:bg-[#f2f4f6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !url}
              className="flex-1 bg-[#2563eb] text-[#ffffff] py-2.5 px-4 rounded-lg text-[14px] font-semibold hover:bg-[#004ac6] disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Scanning DOM...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Start Monitoring</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
