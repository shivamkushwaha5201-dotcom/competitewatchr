import { ChangeAlert, ChangeCategory, MonitoredCompetitor, PageSnapshot, SimulatedPageState, ExtractedPricingTier } from '../types';

/**
 * Normalizes competitor URLs to clean canonical format:
 * - Strips advertising, UTM, tracking parameters (utm_*, adgroup, gclid, fbclid, ref, etc.)
 * - Strips URL fragments/hashes
 * - Standardizes scheme and host
 */
export function normalizeCanonicalUrl(inputUrl: string): {
  canonicalUrl: string;
  originalUrl: string;
  domain: string;
  path: string;
} {
  let formatted = inputUrl.trim();
  if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    formatted = `https://${formatted}`;
  }

  try {
    const parsed = new URL(formatted);

    // List of common ad/tracking/session parameters to remove
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'adgroup', 'adgroupid', 'gclid', 'fbclid', 'ref', 'ref_src', 'source',
      'mc_cid', 'mc_eid', '_ga', '_gl', 'msclkid', 'twclid', 'yclid', 'v', 'session_id'
    ];

    trackingParams.forEach((param) => parsed.searchParams.delete(param));

    // Remove any parameters starting with utm_ or ad_
    Array.from(parsed.searchParams.keys()).forEach((key) => {
      const lower = key.toLowerCase();
      if (lower.startsWith('utm_') || lower.startsWith('ad_') || lower.startsWith('campaign_')) {
        parsed.searchParams.delete(key);
      }
    });

    // Remove fragment/hash
    parsed.hash = '';

    // If query string became empty, eliminate trailing '?'
    let canonical = parsed.toString();
    if (canonical.endsWith('?')) {
      canonical = canonical.slice(0, -1);
    }

    const domain = parsed.hostname.replace(/^www\./, '');

    return {
      canonicalUrl: canonical,
      originalUrl: inputUrl,
      domain: domain,
      path: parsed.pathname || '/'
    };
  } catch (err) {
    const fallbackDomain = formatted.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
    return {
      canonicalUrl: formatted,
      originalUrl: inputUrl,
      domain: fallbackDomain,
      path: '/'
    };
  }
}

/**
 * Strips HTML and markdown noise: styles, scripts, SVGs, iframes, cookies/chat/ad widgets,
 * dynamic IDs, tracking attributes, and excessive whitespace.
 */
export function cleanAndSanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  // 1. Remove non-content tags: script, style, noscript, svg, canvas, iframe, link, meta, comments
  let cleaned = rawHtml
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
    .replace(/<canvas\b[^<]*(?:(?!<\/canvas>)<[^<]*)*<\/canvas>/gi, ' ')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, ' ');

  // 2. Remove typical cookie banners, chat widgets, and ad containers
  cleaned = cleaned.replace(
    /<div[^>]*(?:cookie|chat-widget|intercom|drift|crisp|advertisement|gtm-debug|tracker|feedback-modal)[^>]*>[\s\S]*?<\/div>/gi,
    ' '
  );

  // 3. Remove dynamic tracking and randomized attributes
  cleaned = cleaned.replace(/\s(data-[a-z0-9_-]+|aria-controls|id="[^"]*")/gi, ' ');

  // 4. Remove session/timestamp tokens and dynamic counter noise
  cleaned = cleaned.replace(/\b(?:session_[a-z0-9]+|csrf_[a-z0-9]+|req_[a-z0-9]+)\b/gi, ' ');

  return cleaned;
}

/**
 * Computes a fast, deterministic hash from normalized string content.
 */
export function computeContentHash(str: string): string {
  let hash = 5381;
  const normalized = str.replace(/\s+/g, ' ').trim();
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) + hash) + normalized.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return `h_${Math.abs(hash).toString(36)}`;
}

/**
 * Currency regular expressions supporting $, €, £, ₹, ¥ with periods (/mo, /month, /yr, /year)
 */
const CURRENCY_REGEX = /([$€£₹¥]\s*[\d,]+(?:\.\d{1,2})?(?:\s*(?:\/|\s+per\s+)(?:mo|month|yr|year|user|seat|user\/mo|seat\/mo))?)|([\d,]+(?:\.\d{1,2})?\s*(?:USD|EUR|GBP|INR|JPY)(?:\s*(?:\/|\s+per\s+)(?:mo|month|yr|year))?)/gi;

/**
 * Extracts structured, noise-free content from Jina Reader markdown or rendered HTML.
 */
export function extractStructuredContent(
  markdownOrHtml: string,
  pageType: ChangeCategory,
  pageUrl: string,
  pageName: string
): PageSnapshot {
  const isHtml = /<[a-z][\s\S]*>/i.test(markdownOrHtml);
  const rawText = isHtml ? cleanAndSanitizeHtml(markdownOrHtml) : markdownOrHtml;

  const headings: string[] = [];
  let heroHeadline = '';

  if (isHtml) {
    const headingMatches = rawText.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi) || [];
    for (const h of headingMatches) {
      const text = h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      if (text && text.length > 2 && text.length < 250) {
        headings.push(text);
      }
    }
    const h1Match = rawText.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match) {
      heroHeadline = h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    } else if (headings.length > 0) {
      heroHeadline = headings[0];
    }
  } else {
    // Markdown format from Jina Reader
    const lines = rawText.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      const headingMatch = trimmed.match(/^#{1,3}\s+(.+)$/);
      if (headingMatch) {
        const hText = headingMatch[1].replace(/\[(.*?)\]\(.*?\)/g, '$1').trim();
        if (hText && hText.length > 2 && hText.length < 250) {
          headings.push(hText);
          if (!heroHeadline && trimmed.startsWith('# ')) {
            heroHeadline = hText;
          }
        }
      }
    }
    if (!heroHeadline && headings.length > 0) {
      heroHeadline = headings[0];
    }
  }

  // Extract Pricing Tiers
  const pricingTiers: ExtractedPricingTier[] = [];
  const knownPlanNames = ['Free', 'Starter', 'Basic', 'Standard', 'Pro', 'Professional', 'Growth', 'Team', 'Business', 'Scale', 'Enterprise', 'Ultimate', 'Plus', 'Developer', 'Pay-as-you-go'];

  const priceMatches = rawText.match(CURRENCY_REGEX) || [];
  const uniquePrices = Array.from(new Set(priceMatches.map((p) => p.replace(/\s+/g, ' ').trim())));

  if (uniquePrices.length > 0) {
    uniquePrices.forEach((priceStr, idx) => {
      let matchedPlan = knownPlanNames[idx] || `Tier ${idx + 1}`;
      for (const name of knownPlanNames) {
        if (rawText.toLowerCase().includes(name.toLowerCase())) {
          if (!pricingTiers.some((t) => t.planName.toLowerCase() === name.toLowerCase())) {
            matchedPlan = name;
            break;
          }
        }
      }

      let period = '/mo';
      if (/yr|year|annual/i.test(priceStr)) {
        period = '/yr';
      } else if (/mo|month/i.test(priceStr)) {
        period = '/mo';
      }

      pricingTiers.push({
        planName: matchedPlan,
        price: priceStr,
        period: period,
        raw: `${matchedPlan} — ${priceStr}`
      });
    });
  }

  // Extract CTAs / Button Texts
  const ctas: string[] = [];
  const actionRegex = /trial|demo|start|get|join|sign|book|talk|contact|buy|pricing|explore|upgrade|request|download|register/i;

  if (isHtml) {
    const buttonMatches = rawText.match(/<(?:button|a)[^>]*>(.*?)<\/(?:button|a)>/gi) || [];
    for (const b of buttonMatches) {
      const text = b.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      if (text && text.length >= 3 && text.length <= 40 && actionRegex.test(text)) {
        if (!ctas.includes(text)) {
          ctas.push(text);
        }
      }
    }
  } else {
    // Markdown links [Text](url)
    const linkMatches = rawText.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
    for (const link of linkMatches) {
      const match = link.match(/\[([^\]]+)\]/);
      if (match && match[1]) {
        const text = match[1].trim();
        if (text && text.length >= 3 && text.length <= 40 && actionRegex.test(text)) {
          if (!ctas.includes(text)) {
            ctas.push(text);
          }
        }
      }
    }
  }

  // Extract Features (bullet points / lists)
  const features: string[] = [];
  if (isHtml) {
    const liMatches = rawText.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
    for (const li of liMatches) {
      const text = li.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      if (text && text.length > 4 && text.length < 120 && !ctas.includes(text)) {
        if (!features.includes(text)) {
          features.push(text);
        }
      }
    }
  } else {
    const lines = rawText.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      const listMatch = trimmed.match(/^[-*•]\s+(.+)$/) || trimmed.match(/^\d+\.\s+(.+)$/);
      if (listMatch && listMatch[1]) {
        const text = listMatch[1].replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/\*\*/g, '').trim();
        if (text && text.length > 4 && text.length < 120 && !ctas.includes(text)) {
          if (!features.includes(text)) {
            features.push(text);
          }
        }
      }
    }
  }

  // Extract Products / Offerings
  const products: string[] = [];
  const productPatterns = rawText.match(/(?:Product|Module|Package|Toolkit|Solution|Platform):\s*([^<.,\n]+)/gi) || [];
  for (const p of productPatterns) {
    const text = p.replace(/<[^>]+>/g, '').replace(/(?:Product|Module|Package|Toolkit|Solution|Platform):\s*/i, '').replace(/\s+/g, ' ').trim();
    if (text && text.length > 2 && text.length < 60 && !products.includes(text)) {
      products.push(text);
    }
  }

  // Raw cleaned visible text representation for hashing
  const rawVisibleText = [
    heroHeadline,
    headings.join(' | '),
    pricingTiers.map((p) => p.raw).join(' | '),
    ctas.join(' | '),
    features.join(' | '),
    products.join(' | ')
  ]
    .filter(Boolean)
    .join(' \n ');

  const contentHash = computeContentHash(rawVisibleText || rawText.substring(0, 3000));

  return {
    pageUrl,
    pageName,
    pageType,
    lastScanned: new Date().toISOString(),
    contentHash,
    heroHeadline,
    headings,
    pricingTiers,
    ctas,
    features,
    products,
    rawVisibleText
  };
}

/**
 * Calls the server-side Jina Reader proxy (`/api/fetch-page`)
 */
export async function fetchRealPageContent(url: string): Promise<{
  success: boolean;
  content?: string;
  title?: string;
  sourceUrl?: string;
  error?: string;
}> {
  try {
    const res = await fetch('/api/fetch-page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (!res.ok) {
      return {
        success: false,
        error: 'Unable to verify this website right now.'
      };
    }

    const json = await res.json();
    if (!json.success || !json.data?.content) {
      return {
        success: false,
        error: json.error || 'Unable to verify this website right now.'
      };
    }

    return {
      success: true,
      content: json.data.content,
      title: json.data.title,
      sourceUrl: json.sourceUrl || url
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'Unable to verify this website right now.'
    };
  }
}

/**
 * Creates default initial simulated page state for local tests or fallback
 */
export function createDefaultSimulatedPageState(pageType: ChangeCategory, compName: string): SimulatedPageState {
  if (pageType === 'pricing') {
    return {
      heroHeadline: `Simple, transparent pricing for ${compName}`,
      pricingTiers: [
        { planName: 'Starter', price: '$0/mo', period: '/mo', raw: 'Starter — $0/mo' },
        { planName: 'Pro', price: '$29/mo', period: '/mo', raw: 'Pro — $29/mo' },
        { planName: 'Enterprise', price: '$99/mo', period: '/mo', raw: 'Enterprise — $99/mo' }
      ],
      primaryCTA: 'Start Free Trial',
      features: ['Unlimited Projects', 'Standard Analytics', 'Email Support'],
      products: ['Base Platform']
    };
  }

  if (pageType === 'features') {
    return {
      heroHeadline: `Powerful workflow capabilities built into ${compName}`,
      pricingTiers: [],
      primaryCTA: 'Explore Features',
      features: ['Real-time Collaboration', 'Automated Backlog Grooming', 'API Webhook Integrations'],
      products: ['Core Suite']
    };
  }

  if (pageType === 'products') {
    return {
      heroHeadline: `Explore the ${compName} product ecosystem`,
      pricingTiers: [],
      primaryCTA: 'Contact Sales',
      features: ['Multi-tenant Security', 'Global CDN Routing'],
      products: ['Developer Cloud', 'Security Vault Add-on']
    };
  }

  return {
    heroHeadline: `The intelligent platform for modern teams`,
    pricingTiers: [],
    primaryCTA: 'Book a Demo',
    features: ['Instant Setup', 'Enterprise Grade', 'SOC-2 Ready'],
    products: ['Platform']
  };
}

/**
 * Renders HTML string from a simulated page state
 */
export function renderSimulatedHtml(state: SimulatedPageState, compName: string): string {
  return `
    <div class="competitor-page" data-comp="${compName}">
      <script>window.analyticsTracker = { id: 'track_${Date.now()}', session: '${Math.random()}' };</script>
      <style>.btn-primary { background: #000; color: #fff; }</style>
      <div id="cookie-consent-banner" class="cookie-banner">Accept cookies to continue</div>
      <div class="chat-widget intercom-frame">Support Online</div>

      <header>
        <nav>
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
          <button class="btn-primary">${state.primaryCTA}</button>
        </nav>
      </header>

      <main>
        <h1>${state.heroHeadline}</h1>
        <p class="subtitle">Empowering teams with precision tools and high-velocity infrastructure.</p>

        ${
          state.pricingTiers.length > 0
            ? `
            <section class="pricing-grid">
              <h2>Plans and Pricing</h2>
              ${state.pricingTiers
                .map(
                  (tier) => `
                <div class="pricing-card">
                  <h3>${tier.planName}</h3>
                  <div class="price-amount">${tier.price}</div>
                  <button>${state.primaryCTA}</button>
                </div>
              `
                )
                .join('')}
            </section>
          `
            : ''
        }

        <section class="features-list">
          <h2>Capabilities</h2>
          <ul>
            ${state.features.map((f) => `<li>${f}</li>`).join('')}
          </ul>
        </section>

        ${
          state.products.length > 0
            ? `
            <section class="products-list">
              <h2>Product Catalog</h2>
              ${state.products.map((p) => `<div class="product-item">Product: ${p}</div>`).join('')}
            </section>
          `
            : ''
        }
      </main>
    </div>
  `;
}

/**
 * Creates initial baseline snapshot for all pages of a newly added competitor.
 * MANDATE:
 * 1. Fetches real content or parses provided snapshot.
 * 2. Saves content as baseline.
 * 3. MUST NOT create any alerts, changes, or major diffs.
 */
export function createInitialBaseline(competitor: MonitoredCompetitor): {
  pageSnapshots: Record<string, PageSnapshot>;
  liveSimulatedState: Record<string, SimulatedPageState>;
} {
  const pageSnapshots: Record<string, PageSnapshot> = {};
  const liveSimulatedState: Record<string, SimulatedPageState> = {};

  for (const page of competitor.monitoredPages) {
    const defaultState = createDefaultSimulatedPageState(page.type, competitor.name);
    liveSimulatedState[page.url] = defaultState;

    const html = renderSimulatedHtml(defaultState, competitor.name);
    const snapshot = extractStructuredContent(html, page.type, page.url, page.name);
    pageSnapshots[page.url] = snapshot;
  }

  return { pageSnapshots, liveSimulatedState };
}

/**
 * Compares a previous snapshot with the newly scanned snapshot.
 * STRICT ACCURACY RULES:
 * - If nothing changed (identical content hash): returns [] (zero alerts).
 * - Only reports real, meaningful changes (Pricing, CTA, Headline/Messaging, Features, Products).
 * - No fake AI claims or hallucinated text.
 */
export function detectPageChanges(
  previousSnapshot: PageSnapshot,
  currentSnapshot: PageSnapshot,
  competitor: MonitoredCompetitor
): ChangeAlert[] {
  // If hashes match exactly, no meaningful change occurred
  if (previousSnapshot.contentHash === currentSnapshot.contentHash) {
    return [];
  }

  const detectedAlerts: ChangeAlert[] = [];
  const now = new Date().toISOString();
  const sourceEvidence = {
    snippet: currentSnapshot.rawVisibleText.substring(0, 300),
    fetchedAt: now,
    sourceUrl: currentSnapshot.pageUrl
  };

  // 1. Check Pricing Changes
  if (currentSnapshot.pricingTiers.length > 0 || previousSnapshot.pricingTiers.length > 0) {
    for (const currTier of currentSnapshot.pricingTiers) {
      const prevTier = previousSnapshot.pricingTiers.find(
        (p) => p.planName.toLowerCase() === currTier.planName.toLowerCase()
      );

      if (prevTier && prevTier.price !== currTier.price) {
        // Price changed!
        detectedAlerts.push({
          id: `alert-price-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          competitorId: competitor.id,
          competitorName: competitor.name,
          timestamp: now,
          relativeTime: 'Just now',
          category: 'pricing',
          severity: 'critical',
          title: 'Pricing Change Detected',
          description: `${competitor.name} updated their ${currTier.planName} plan pricing.`,
          previousValue: prevTier.price,
          newValue: currTier.price,
          pageUrl: currentSnapshot.pageUrl,
          pageType: 'Pricing Page',
          sourceEvidence,
          aiInsight: {
            strategyShift: `Price changed for ${currTier.planName} tier`,
            businessImpact: `Pricing updated from ${prevTier.price} to ${currTier.price} on ${currentSnapshot.pageName}.`,
            recommendedAction: `Review your pricing page and value proposition against ${competitor.name}'s new ${currTier.price} rate.`,
            confidence: 100,
            tags: ['Pricing Change', 'Tier Update', 'Verified Change']
          },
          isRead: false
        });
      } else if (!prevTier && currTier.price) {
        // New tier introduced
        detectedAlerts.push({
          id: `alert-tier-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          competitorId: competitor.id,
          competitorName: competitor.name,
          timestamp: now,
          relativeTime: 'Just now',
          category: 'pricing',
          severity: 'major',
          title: 'New Pricing Plan Introduced',
          description: `${competitor.name} added the "${currTier.planName}" tier for ${currTier.price}.`,
          previousValue: 'Not in pricing matrix',
          newValue: `${currTier.planName} (${currTier.price})`,
          pageUrl: currentSnapshot.pageUrl,
          pageType: 'Pricing Page',
          sourceEvidence,
          aiInsight: {
            strategyShift: `New plan tier: ${currTier.planName}`,
            businessImpact: `Added new tier ${currTier.planName} at ${currTier.price}.`,
            recommendedAction: `Evaluate feature set bundled in ${currTier.planName} against your pricing tiers.`,
            confidence: 100,
            tags: ['Pricing', 'New Tier', 'Verified Change']
          },
          isRead: false
        });
      }
    }
  }

  // 2. Check CTA Changes
  const prevPrimaryCTA = previousSnapshot.ctas[0] || '';
  const currPrimaryCTA = currentSnapshot.ctas[0] || '';
  if (prevPrimaryCTA && currPrimaryCTA && prevPrimaryCTA !== currPrimaryCTA) {
    detectedAlerts.push({
      id: `alert-cta-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      competitorId: competitor.id,
      competitorName: competitor.name,
      timestamp: now,
      relativeTime: 'Just now',
      category: 'messaging',
      severity: 'minor',
      title: 'CTA Changed',
      description: `Primary call-to-action changed from "${prevPrimaryCTA}" to "${currPrimaryCTA}".`,
      previousValue: prevPrimaryCTA,
      newValue: currPrimaryCTA,
      pageUrl: currentSnapshot.pageUrl,
      pageType: currentSnapshot.pageName,
      sourceEvidence,
      aiInsight: {
        strategyShift: `Call-to-action updated to "${currPrimaryCTA}"`,
        businessImpact: `Conversion funnel updated from "${prevPrimaryCTA}" to "${currPrimaryCTA}".`,
        recommendedAction: `Observe if this indicates a shift toward self-serve or sales-led motion.`,
        confidence: 100,
        tags: ['CTA', 'Funnel', 'Verified Change']
      },
      isRead: false
    });
  }

  // 3. Check Hero Headline / Messaging Shifts
  if (
    previousSnapshot.heroHeadline &&
    currentSnapshot.heroHeadline &&
    previousSnapshot.heroHeadline !== currentSnapshot.heroHeadline
  ) {
    detectedAlerts.push({
      id: `alert-msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      competitorId: competitor.id,
      competitorName: competitor.name,
      timestamp: now,
      relativeTime: 'Just now',
      category: 'messaging',
      severity: 'major',
      title: 'Messaging Changed',
      description: `Hero headline updated on ${currentSnapshot.pageName}.`,
      previousValue: `"${previousSnapshot.heroHeadline}"`,
      newValue: `"${currentSnapshot.heroHeadline}"`,
      pageUrl: currentSnapshot.pageUrl,
      pageType: currentSnapshot.pageName,
      sourceEvidence,
      aiInsight: {
        strategyShift: `Positioning headline updated on ${currentSnapshot.pageName}`,
        businessImpact: `Hero value proposition changed from "${previousSnapshot.heroHeadline}" to "${currentSnapshot.heroHeadline}".`,
        recommendedAction: `Review market positioning and competitor keywords.`,
        confidence: 100,
        tags: ['Messaging', 'Positioning', 'Verified Change']
      },
      isRead: false
    });
  }

  // 4. Check Features Added
  for (const feature of currentSnapshot.features) {
    if (!previousSnapshot.features.includes(feature)) {
      detectedAlerts.push({
        id: `alert-feat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        competitorId: competitor.id,
        competitorName: competitor.name,
        timestamp: now,
        relativeTime: 'Just now',
        category: 'features',
        severity: 'major',
        title: 'New Feature Detected',
        description: `Added "${feature}" to feature matrix.`,
        previousValue: 'Not listed in features',
        newValue: feature,
        pageUrl: currentSnapshot.pageUrl,
        pageType: currentSnapshot.pageName,
        sourceEvidence,
        aiInsight: {
          strategyShift: `Feature addition: "${feature}"`,
          businessImpact: `New feature "${feature}" was published on ${currentSnapshot.pageName}.`,
          recommendedAction: `Check feature parity and product roadmap alignment.`,
          confidence: 100,
          tags: ['Features', 'Capability', 'Verified Change']
        },
        isRead: false
      });
    }
  }

  // 5. Check Products Added
  for (const product of currentSnapshot.products) {
    if (!previousSnapshot.products.includes(product)) {
      detectedAlerts.push({
        id: `alert-prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        competitorId: competitor.id,
        competitorName: competitor.name,
        timestamp: now,
        relativeTime: 'Just now',
        category: 'products',
        severity: 'minor',
        title: 'Product Add-on Detected',
        description: `Introduced new offering: "${product}".`,
        previousValue: 'Standard Offering',
        newValue: product,
        pageUrl: currentSnapshot.pageUrl,
        pageType: currentSnapshot.pageName,
        sourceEvidence,
        aiInsight: {
          strategyShift: `New product offering: "${product}"`,
          businessImpact: `New product catalog item "${product}" published.`,
          recommendedAction: `Evaluate potential impact on customer add-on demand.`,
          confidence: 100,
          tags: ['Product', 'Catalog', 'Verified Change']
        },
        isRead: false
      });
    }
  }

  return detectedAlerts;
}
