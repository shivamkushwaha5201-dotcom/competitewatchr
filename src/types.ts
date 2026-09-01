export type ChangeCategory = 'pricing' | 'features' | 'products' | 'messaging';

export type AlertSeverity = 'critical' | 'major' | 'minor' | 'info';

export interface AIInsight {
  strategyShift: string;
  businessImpact: string;
  recommendedAction: string;
  confidence: number;
  tags?: string[];
}

export interface ExtractedPricingTier {
  planName: string;
  price: string;
  period: string;
  raw: string;
}

export interface PageSnapshot {
  pageUrl: string;
  pageName: string;
  pageType: ChangeCategory;
  lastScanned: string;
  contentHash: string;
  heroHeadline: string;
  headings: string[];
  pricingTiers: ExtractedPricingTier[];
  ctas: string[];
  features: string[];
  products: string[];
  rawVisibleText: string;
}

export interface SimulatedPageState {
  heroHeadline: string;
  pricingTiers: ExtractedPricingTier[];
  primaryCTA: string;
  features: string[];
  products: string[];
}

export interface ChangeAlert {
  id: string;
  competitorId: string;
  competitorName: string;
  competitorLogo?: string;
  timestamp: string;
  relativeTime: string;
  category: ChangeCategory;
  severity: AlertSeverity;
  title: string;
  description: string;
  previousValue: string;
  newValue: string;
  pageUrl: string;
  pageType: string;
  aiInsight: AIInsight;
  isRead?: boolean;
  sourceEvidence?: {
    snippet?: string;
    fetchedAt: string;
    sourceUrl: string;
  };
}

export interface MonitoredCompetitor {
  id: string;
  name: string;
  url: string;
  canonicalUrl?: string;
  submittedUrl?: string;
  category: string;
  status: 'active' | 'scanning' | 'paused' | 'alert_detected' | 'error';
  lastScanned: string;
  frequency: 'hourly' | 'daily' | 'weekly';
  monitoredPages: {
    name: string;
    url: string;
    type: ChangeCategory;
    lastChange: string;
  }[];
  alertCount: number;
  pageSnapshots?: Record<string, PageSnapshot>;
  liveSimulatedState?: Record<string, SimulatedPageState>;
  lastError?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  competitorLimit: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  buttonVariant: 'primary' | 'secondary';
}

