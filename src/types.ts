export type ChangeCategory = 'pricing' | 'features' | 'products' | 'messaging';

export type AlertSeverity = 'critical' | 'major' | 'minor' | 'info';

export interface AIInsight {
  strategyShift: string;
  businessImpact: string;
  recommendedAction: string;
  confidence: number;
  tags?: string[];
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
}

export interface MonitoredCompetitor {
  id: string;
  name: string;
  url: string;
  category: string;
  status: 'active' | 'scanning' | 'paused' | 'alert_detected';
  lastScanned: string;
  frequency: 'hourly' | 'daily' | 'weekly';
  monitoredPages: {
    name: string;
    url: string;
    type: ChangeCategory;
    lastChange: string;
  }[];
  alertCount: number;
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
