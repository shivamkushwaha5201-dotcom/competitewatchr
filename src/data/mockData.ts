import { ChangeAlert, MonitoredCompetitor, PricingPlan } from '../types';

/**
 * INITIAL_ALERTS is strictly empty by default.
 * All dashboard alerts MUST come from actual verified change detection against previous snapshots.
 */
export const INITIAL_ALERTS: ChangeAlert[] = [];

/**
 * INITIAL_COMPETITORS is strictly empty by default.
 * Competitors are added by the user and verified against live Jina Reader DOM data.
 */
export const INITIAL_COMPETITORS: MonitoredCompetitor[] = [];

/**
 * Illustrative change preview shown only on the landing page hero widget
 * when no user competitors/alerts have been generated yet.
 */
export const DEMO_LANDING_SAMPLE_ALERT: ChangeAlert = {
  id: 'preview-sample-alert',
  competitorId: 'comp-sample',
  competitorName: 'Linear',
  timestamp: new Date().toISOString(),
  relativeTime: '2 hours ago',
  category: 'pricing',
  severity: 'critical',
  title: 'Pricing Plan Modified',
  description: 'Linear updated their Pro tier pricing structure.',
  previousValue: '$29/mo',
  newValue: '$39/mo',
  pageUrl: 'https://linear.app/pricing',
  pageType: 'Pricing Page',
  sourceEvidence: {
    snippet: 'Pro Plan — $39 per user/mo billed annually. Advanced workflows and team roadmaps.',
    fetchedAt: new Date().toISOString(),
    sourceUrl: 'https://linear.app/pricing'
  },
  aiInsight: {
    strategyShift: 'Pro Plan Price Adjustment',
    businessImpact: 'Pricing increased from $29/mo to $39/mo on verified pricing page.',
    recommendedAction: 'Review your pricing positioning and team seat comparison chart.',
    confidence: 100,
    tags: ['Pricing Tier', 'SaaS Model', 'Verified Change']
  },
  isRead: false
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/mo',
    competitorLimit: '3 competitors',
    features: ['3 competitors', 'Basic alerts', 'Daily scan frequency', 'Email digests'],
    isPopular: false,
    ctaText: 'Start Free',
    buttonVariant: 'secondary'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    period: '/mo',
    competitorLimit: '20 competitors',
    features: ['20 competitors', 'AI Insights', 'Hourly scan frequency', 'Slack & Webhook alerts', 'Historical diff timeline'],
    isPopular: true,
    ctaText: 'Upgrade to Pro',
    buttonVariant: 'primary'
  },
  {
    id: 'business',
    name: 'Business',
    price: '$49',
    period: '/mo',
    competitorLimit: '100 competitors',
    features: ['100 competitors', 'API Access', 'Real-time scans', 'Custom executive reports', 'Dedicated account manager'],
    isPopular: false,
    ctaText: 'Contact Sales',
    buttonVariant: 'secondary'
  }
];

