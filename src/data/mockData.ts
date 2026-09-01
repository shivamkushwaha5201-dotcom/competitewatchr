import { ChangeAlert, MonitoredCompetitor, PricingPlan } from '../types';

export const INITIAL_ALERTS: ChangeAlert[] = [
  {
    id: 'alert-1',
    competitorId: 'comp-x',
    competitorName: 'Competitor X',
    timestamp: '2026-08-31T14:32:00Z',
    relativeTime: '2 hours ago',
    category: 'pricing',
    severity: 'critical',
    title: 'Pricing Change Detected',
    description: 'Competitor X updated their Pro plan pricing.',
    previousValue: '$29/mo',
    newValue: '$39/mo',
    pageUrl: 'https://competitorx.com/pricing',
    pageType: 'Pricing Page',
    aiInsight: {
      strategyShift: 'Competitor X Pricing Strategy Shift',
      businessImpact:
        'This indicates a move toward higher-value positioning and potentially higher customer acquisition costs. Consider reviewing your mid-tier offering\'s perceived value.',
      recommendedAction:
        'Highlight your price advantage on your comparison landing page. You now hold a 34% cost savings advantage over their mid-tier tier.',
      confidence: 96,
      tags: ['SaaS Pricing', 'Pro Tier Expansion', 'Margin Expansion']
    },
    isRead: false
  },
  {
    id: 'alert-2',
    competitorId: 'comp-linear',
    competitorName: 'Veloce HQ',
    timestamp: '2026-08-31T09:15:00Z',
    relativeTime: '7 hours ago',
    category: 'features',
    severity: 'major',
    title: 'Unannounced Feature Rollout',
    description: 'Added "Automated Sprint Triage AI" to feature matrix.',
    previousValue: 'Manual milestone triaging',
    newValue: 'Auto-triage with predictive backlog scoring',
    pageUrl: 'https://velocehq.io/features/sprints',
    pageType: 'Feature Matrix',
    aiInsight: {
      strategyShift: 'AI Workflow Integration',
      businessImpact:
        'Targets project managers spending >5 hrs weekly on backlog grooming. Threatens legacy team productivity tools.',
      recommendedAction:
        'Draft a feature-parity briefing for the product marketing team and schedule an audit of client workflow automation demands.',
      confidence: 92,
      tags: ['Feature Launch', 'Automation', 'Product Matrix']
    },
    isRead: false
  },
  {
    id: 'alert-3',
    competitorId: 'comp-str',
    competitorName: 'PayStream Cloud',
    timestamp: '2026-08-30T18:40:00Z',
    relativeTime: '1 day ago',
    category: 'messaging',
    severity: 'major',
    title: 'Subtle Messaging Shift',
    description: 'Hero headline rewritten from developer-centric to enterprise finance.',
    previousValue: '"The payment infrastructure built for developers"',
    newValue: '"The financial operations platform powering the Fortune 500"',
    pageUrl: 'https://paystream.cloud',
    pageType: 'Homepage Hero',
    aiInsight: {
      strategyShift: 'Upmarket Enterprise Repositioning',
      businessImpact:
        'Moving focus away from self-serve indie hackers toward multi-seat enterprise procurement teams with higher ACV.',
      recommendedAction:
        'Capture the underserved developer community by running search ads targeting dissatisfied SMB developers.',
      confidence: 94,
      tags: ['Positioning', 'Upmarket Shift', 'Copywriting']
    },
    isRead: true
  },
  {
    id: 'alert-4',
    competitorId: 'comp-not',
    competitorName: 'DocuSync AI',
    timestamp: '2026-08-30T11:20:00Z',
    relativeTime: '1 day ago',
    category: 'products',
    severity: 'minor',
    title: 'New Product Add-on Launched',
    description: 'Introduced "Security Vault Addon" with SOC2 compliance toolkit.',
    previousValue: 'Standard Enterprise Package',
    newValue: 'Custom Security Vault Add-on ($150/mo)',
    pageUrl: 'https://docusync.app/products/security',
    pageType: 'Product Catalog',
    aiInsight: {
      strategyShift: 'Modular Monetization Model',
      businessImpact:
        'Unbundling enterprise security features to create land-and-expand revenue streams.',
      recommendedAction:
        'Keep standard compliance included in your base business plan to maintain a competitive bundling advantage.',
      confidence: 88,
      tags: ['Product Add-on', 'Security', 'Packaging']
    },
    isRead: true
  },
  {
    id: 'alert-5',
    competitorId: 'comp-x',
    competitorName: 'Competitor X',
    timestamp: '2026-08-29T16:05:00Z',
    relativeTime: '2 days ago',
    category: 'messaging',
    severity: 'minor',
    title: 'Changed Call-to-Actions',
    description: 'Replaced "Start Free Trial" with "Book an Enterprise Demo".',
    previousValue: 'Start 14-day Free Trial (No CC Required)',
    newValue: 'Request Custom Demo & Pricing',
    pageUrl: 'https://competitorx.com',
    pageType: 'Homepage Navigation CTA',
    aiInsight: {
      strategyShift: 'Sales-Led Funnel Transition',
      businessImpact:
        'Friction increased for self-serve users; indicates higher qualification bar and sales team expansion.',
      recommendedAction:
        'Emphasize frictionless instant signup in your onboarding flow to attract quick-start prospects.',
      confidence: 91,
      tags: ['Conversion Funnel', 'CTA Strategy', 'Sales-Led']
    },
    isRead: true
  }
];

export const INITIAL_COMPETITORS: MonitoredCompetitor[] = [
  {
    id: 'comp-x',
    name: 'Competitor X',
    url: 'https://competitorx.com',
    category: 'Direct Competitor',
    status: 'alert_detected',
    lastScanned: '2 mins ago',
    frequency: 'daily',
    monitoredPages: [
      { name: 'Pricing Page', url: 'https://competitorx.com/pricing', type: 'pricing', lastChange: '2 hours ago' },
      { name: 'Homepage', url: 'https://competitorx.com', type: 'messaging', lastChange: '2 days ago' },
      { name: 'Product Features', url: 'https://competitorx.com/features', type: 'features', lastChange: '1 week ago' }
    ],
    alertCount: 2
  },
  {
    id: 'comp-linear',
    name: 'Veloce HQ',
    url: 'https://velocehq.io',
    category: 'Productivity & Issue Tracking',
    status: 'alert_detected',
    lastScanned: '15 mins ago',
    frequency: 'daily',
    monitoredPages: [
      { name: 'Features Matrix', url: 'https://velocehq.io/features', type: 'features', lastChange: '7 hours ago' },
      { name: 'Changelog', url: 'https://velocehq.io/changelog', type: 'products', lastChange: '3 days ago' }
    ],
    alertCount: 1
  },
  {
    id: 'comp-str',
    name: 'PayStream Cloud',
    url: 'https://paystream.cloud',
    category: 'Billing & Payments',
    status: 'active',
    lastScanned: '1 hour ago',
    frequency: 'daily',
    monitoredPages: [
      { name: 'Landing Page', url: 'https://paystream.cloud', type: 'messaging', lastChange: '1 day ago' },
      { name: 'Pricing Tiers', url: 'https://paystream.cloud/pricing', type: 'pricing', lastChange: '2 weeks ago' }
    ],
    alertCount: 1
  },
  {
    id: 'comp-not',
    name: 'DocuSync AI',
    url: 'https://docusync.app',
    category: 'Knowledge Workspace',
    status: 'active',
    lastScanned: '3 hours ago',
    frequency: 'daily',
    monitoredPages: [
      { name: 'Add-ons Directory', url: 'https://docusync.app/products/security', type: 'products', lastChange: '1 day ago' },
      { name: 'Home', url: 'https://docusync.app', type: 'messaging', lastChange: '5 days ago' }
    ],
    alertCount: 1
  }
];

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
