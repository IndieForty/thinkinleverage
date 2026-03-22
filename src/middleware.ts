import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Set of slugs that exist as blog posts in our new site
const KEPT_SLUGS = new Set([
  '10-client-retention-best-practices-for-high-leverage-business-growth',
  '10-examples-of-digital-marketing-strategies-you-should-know',
  '10-partnership-marketing-strategies-to-fuel-growth-in-2025',
  '10-potent-small-business-growth-strategies-for-2025',
  '12-best-ai-tools-for-small-business-leverage-in-2025',
  '7-benefits-of-marketing-automation-for-business-leverage',
  '7-business-process-automation-examples-to-boost-your-business-leverage',
  '7-high-leverage-referral-program-examples-for-exponential-growth-in-2026',
  '7-levers-to-improve-business-productivity-today',
  '7-scalable-business-model-examples-to-leverage-in-2025',
  '7-strategic-alliance-examples-that-master-business-leverage',
  '9-content-marketing-trends-to-leverage-for-business-growth-in-2025',
  '9-proven-growth-strategies-for-small-businesses-in-2025',
  'a-client-onboarding-process-template-for-sustainable-growth',
  'a-guide-on-how-to-increase-client-retention',
  'a-guide-to-business-continuity-planning-for-maximum-business-leverage',
  'a-guide-to-content-marketing-and-inbound-marketing-for-business-leverage',
  'a-guide-to-content-marketing-brand-awareness',
  'a-guide-to-digital-content-strategy-for-business-leverage',
  'a16z-backed-super-pac-attacks-ny-lawmaker-over-ai-bill',
  'actionable-growth-strategies-for-startups-using-business-leverage',
  'ai-and-the-myth-of-the-shorter-workweek',
  'amazon-blocks-perplexitys-agentic-browsing-to-enforce-identification-rules-and-control-automation',
  'armano-hrs-pay-once-model-automates-core-hr-tasks-shifting-operational-constraints',
  'automate-your-business-processes-for-strategic-business-leverage',
  'automation-for-small-business-your-ultimate-guide-to-business-leverage',
  'beyond-meats-weak-demand-signals-structural-supply-chain-and-market-positioning-constraints',
  'black-forest-labs-raises-300m-at-3-25b-valuation-led-by-amp-and-salesforce-ventures',
  'blackstones-130m-four-seasons-buy-shifts-hotel-ownership-constraints-in-san-francisco',
  'boost-roi-with-marketing-automation-workflow-examples-8-tactics',
  'borromeo-family-aims-to-rival-lake-como-with-lake-maggiore-islands',
  'branding-and-content-marketing-your-ultimate-leverage-playbook',
  'brevo-review',
  'build-a-network-of-influencers-for-business-leverage',
  'build-digital-marketing-programs-that-scale-with-business-leverage',
  'build-your-leadership-development-framework-to-maximize-business-leverage',
  'building-high-performing-teams-a-guide-to-unlocking-business-leverage',
  'business-intelligence-tools-comparison-find-your-platform-for-maximum-business-leverage',
  'business-leverage-in-the-digital-age-how-to-dominate-your-market-with-the-right-tools',
  'case-studies-on-marketing-10-tactics-that-drive-business-leverage',
  'clickup-uses-qatalog-acquisition-to-embed-ai-assistant-and-challenge-slack-and-notion',
  'cloud-computing-benefits-for-small-business-growth',
  'cloudtalk-review',
  'cluelys-roy-lee-signals-viral-growth-alone-fails-without-sustainable-business-metrics',
  'decision-making-frameworks-for-business-leverage',
  'definition-of-strategic-alliances-unlock-business-leverage',
  'digital-transformation-for-small-business-your-guide-to-business-leverage',
  'egypts-saving-system-cuts-energy-bills-with-smart-device',
  'endurance-over-optimization-why-entrepreneurs-should-shift-from-speed-to-sustainable-systems',
  'example-of-a-social-media-strategy-10-hacks-for-every-industry-in-2025',
  'explore-types-of-business-partnerships-to-boost-growth',
  'figma-opens-bengaluru-office-to-leverage-indias-developer-ecosystem-beyond-design',
  'growth-through-influencer-marketing-in-b2b-a-guide-to-strategic-business-leverage',
  'how-ai-accelerates-decision-making-while-multiplying-confusion-without-clarity',
  'how-ai-assistants-like-chatgpt-are-replacing-google-searches-and-what-that-means-for-lead-generation',
  'how-ai-tools-are-reshaping-seo-insights-by-automating-site-analysis-bottlenecks',
  'how-ai-transforms-brands-connection-with-customers',
  'how-arbiter-is-retooling-us-healthcare-with-ai-and-family-office-capital',
  'how-awss-graviton5-changes-cloud-cpu-efficiency-game',
  'how-blue-js-pivot-to-chatgpt-sparked-a-300m-valuation-leap',
  'how-blue-owls-1-7b-fund-changes-data-center-investing',
  'how-carlyle-quietly-explores-lukoils-billions-in-foreign-assets',
  'how-cook-county-made-basic-income-permanent-and-why-it-matters',
  'how-cursor-built-an-ai-help-desk-handling-80-of-support-tickets',
  'how-dropbox-used-cold-email-and-invitations-to-explode-their-growth-and-how-you-can-steal-the-strategy',
  'how-embraers-eve-will-reshape-urban-air-mobility-by-2027',
  'how-founders-build-lasting-investor-trust-by-respecting-capital-constraints',
  'how-hong-kongs-lawsgroup-is-redefining-fashion-leverage',
  'how-identifying-employee-learning-sweet-spots-creates-scalable-talent-growth-without-expensive-training',
  'how-indianas-24-hour-daycare-solves-night-shift-childcare-crisis',
  'how-kalshis-11b-valuation-reinvents-market-leverage',
  'how-knowledge-management-systems-create-unbeatable-business-leverage',
  'how-mckinsey-and-pwc-are-reshaping-consulting-with-ai-talent',
  'how-megan-cornish-boosted-linkedin-engagement-400-by-changing-one-detail',
  'how-millenniums-index-rebalance-losses-reveal-hedge-fund-crowding-risks',
  'how-morgan-stanleys-data-center-shift-changes-ai-finance-leverage',
  'how-netflixs-82-7b-warner-bros-deal-reshapes-hollywoods-content-power',
  'how-nintendo-achieved-a-98-employee-retention-rate',
  'how-onlyfans-runs-7b-revenue-with-no-middle-managers',
  'how-openai-built-an-ai-video-app-from-copyrighted-content',
  'how-openais-ai-platform-cuts-entrepreneurs-work-hours-by-50',
  'how-petrofacs-north-sea-sale-reveals-uk-job-market-leverage',
  'how-pimcos-u-s-bond-bet-defied-sell-america-talk',
  'how-polymarkets-59m-bet-exposes-prediction-market-flaws',
  'how-salesforce-masters-cold-email-personalization-and-how-you-can-too',
  'how-shopify-wins-at-seo-and-how-you-can-too',
  'how-singapore-built-ai-training-systems-for-3-000-msmes-fast',
  'how-singapores-kpmg-mentoring-builds-talent-for-a-green-digital-future',
  'how-smart-sales-strategies-sustain-business-growth-beyond-5-years',
  'how-spotifys-new-features-unlock-music-discovery-leverage',
  'how-sunday-robotics-cut-training-costs-100x-to-teach-robots-home-tasks',
  'how-swedens-mini-missiles-create-a-new-leverage-against-russian-drones',
  'how-teads-post-merger-layoffs-expose-adtechs-hidden-integration-trap',
  'how-the-eus-new-investment-rules-shift-leverage-on-china',
  'how-the-uks-gilt-basis-trade-creates-hidden-financial-risk',
  'how-tiktok-shop-scaled-to-500m-sales-in-us-black-friday-week',
  'how-to-automate-business-processes-for-maximum-business-leverage',
  'how-to-build-a-membership-website-for-maximum-business-leverage',
  'how-to-conduct-swot-analysis-for-business-leverage',
  'how-to-create-leverage-with-automation-without-losing-the-human-touch',
  'how-to-create-standard-operating-procedures-for-maximum-business-leverage',
  'how-to-delegate-tasks-effectively-a-guide-to-business-leverage',
  'how-to-do-seo-competitor-analysis-for-real-business-leverage',
  'how-to-find-business-partners-who-fuel-your-growth',
  'how-to-forecast-sales-and-leverage-data-for-growth',
  'how-to-improve-business-efficiency-with-smart-leverage',
  'how-to-improve-profit-margins-with-business-leverage',
  'how-to-improve-team-productivity-through-business-leverage',
  'how-to-increase-business-efficiency-a-guide-to-business-leverage',
  'how-to-network-with-people-proven-tips-for-business-leverage',
  'how-to-perform-a-website-audit-for-maximum-business-leverage',
  'how-to-prioritize-tasks-at-work-for-maximum-business-leverage',
  'how-to-reduce-labor-costs-with-business-leverage',
  'how-to-reduce-operational-costs-and-boost-profits-through-business-leverage',
  'how-to-work-smarter-not-harder-with-business-leverage',
  'how-tower-researchs-sva-model-unlocks-quant-talent-leverage',
  'how-vales-production-cut-reveals-new-levers-in-global-iron-ore-supply',
  'how-we-grew-organic-traffic-5x-with-under-1-000-month',
  'hyros-review-2025-the-ultimate-leverage-layer-for-ad-tracking-and-roi-visibility',
  'inbound-marketing-lead-generation-the-business-leverage-playbook',
  'integrated-marketing-communication-examples-6-tactics-for-business-leverage',
  'lambdas-multi-billion-ai-infrastructure-deal-with-microsoft-secures-ai-scaling-through-specialized-hardware-access',
  'laude-institute-launches-slingshots-ai-grants-to-shift-ai-evaluation-constraints',
  'leverage-thinking-the-definitive-guide-to-finding-and-exploiting-leverage-points-in-business-systems',
  'leverage-your-growth-a-guide-to-marketing-with-newsletters',
  'leveraging-partnerships-how-to-grow-your-business-10x-without-spending-more',
  'leveraging-your-business-partnership-agreement-template',
  'lina-khans-role-on-nyc-mayor-elect-zohran-mamdanis-transition-team-signals-regulatory-leverage-shift-against-big-tech',
  'link-building-shifts-from-anchors-to-authentic-mentions-brands-must-adapt-by-2026',
  'master-google-analytics-utm-parameters-to-turbocharge-your-campaign-roi',
  'maximize-your-content-marketing-return-on-investment',
  'mcdonalds-8-nugget-combo-backlash-reveals-pricing-leverage-flaw',
  'measuring-content-marketing-roi-for-business-leverage',
  'meta-earns-10-revenue-from-scam-ads-revealing-a-costly-automation-blindspot',
  'meta-lets-facebook-groups-go-public-without-exposing-private-posts-redefining-privacy-leverage',
  'michael-burry-calls-tesla-ridiculously-overvalued-amid-rising-competition',
  'openais-chatgpt-atlas-declares-war-on-google-chrome-and-its-playing-a-different-game-entirely',
  'outsourcing-digital-marketing-a-guide-to-business-leverage',
  'performance-management-best-practices-10-levers-for-business-growth',
  'peru-just-secured-u-s-tariff-exemptions-for-100-farm-products',
  'project-management-for-small-teams-a-business-leverage-guide',
  'rad-power-bikes-faces-shutdown-without-new-funding-revealing-critical-capital-flow-constraint-in-ev-scale-up',
  'rivians-mind-robotics-spinoff-reveals-a-shift-from-product-scale-to-specialized-system-focus',
  'rockstar-delays-gta-vi-to-november-19-2026-shaping-development-leverage-around-quality-and-scalability',
  'sam-altmans-ai-researcher-vision-the-ultimate-leverage-play-for-2028',
  'scaling-fast-how-to-use-the-power-of-leverage-to-build-a-multi-million-dollar-business',
  'shopifys-11x-growth-in-ai-driven-orders-reveals-new-traffic-monetization-constraint',
  'shopifysecret',
  'social-media-and-roi-mastering-business-leverage-for-maximum-return',
  'social-media-strategies-examples-10-tactics-for-business-leverage',
  'strategic-partnership-benefits-6-ways-to-leverage-business-growth',
  'strategic-planning-process-steps-for-maximum-business-leverage',
  'techcrunch-disrupt-2025-the-ultimate-leveraged-arena-for-founders-and-investors',
  'the-billion-dollar-conversion-shortcut-shopify-doesnt-talk-about',
  'the-hidden-leverage-in-instagrams-new-reels-playback-feature',
  'the-high-leverage-social-media-audit-for-business-growth',
  'the-leveraged-entrepreneur-why-you-should-build-an-empire-not-just-a-job',
  'the-secret-sauce-of-leveraging-people-why-your-team-is-your-best-asset',
  'thoma-bravo-just-offered-to-buy-clearwater-analytics-heres-why',
  'tips-on-best-workflow-automation-tools-top-picks-for-2025',
  'top-8-strategic-partnership-examples-for-business-success',
  'top-business-model-innovation-examples-for-2025-success',
  'top-business-process-automation-examples-for-greater-business-leverage',
  'top-business-process-improvement-techniques-for-2025',
  'top-business-process-mapping-examples-for-2025',
  'top-capacity-planning-strategies-for-business-leverage',
  'top-marketing-strategies-for-a-startup-to-grow-with-leverage',
  'top-vendor-management-best-practices-for-maximizing-business-leverage',
  'trump-pardons-convicted-honduran-leader-amid-u-s-drug-crackdown',
  'uk-exempts-state-pensioners-from-income-tax-until-2030',
  'unlocking-business-leverage-through-process-improvement',
  'warren-buffett-shifts-berkshire-hathaways-reporting-model-with-annual-thanksgiving-letter',
  'what-apples-new-ai-chief-reveals-about-its-strategic-ai-shift',
  'what-asias-euro-borrowing-reveals-about-us-financing-power',
  'what-binances-co-ceo-move-reveals-about-crypto-power-dynamics',
  'what-brookfields-peru-toll-road-exit-reveals-about-infrastructure-leverage',
  'what-chinas-gasoline-car-exports-reveal-about-global-auto-leverage',
  'what-credlixs-vanik-finance-stake-reveals-about-indias-supply-chain-credit-shift',
  'what-genting-malaysias-privatization-bid-reveals-about-ownership-leverage',
  'what-ings-new-private-markets-unit-reveals-about-banking-leverage',
  'what-intels-decision-to-keep-networking-unit-reveals-about-chip-industry-shifts',
  'what-is-branded-content-discover-key-strategies-examples',
  'what-is-business-process-outsourcing-a-guide-to-business-leverage',
  'what-is-economies-of-scale-explained-through-business-leverage',
  'what-is-leverage-in-business-boost-growth-strategies',
  'what-is-strategic-partnership-your-guide-to-business-leverage',
  'what-is-systems-thinking-unlock-business-leverage-today',
  'what-is-value-chain-analysis-unlock-business-leverage',
  'what-itts-4-5b-spx-flow-deal-reveals-about-industrial-leverage',
  'what-mexicos-zero-growth-reveals-about-economic-leverage',
  'what-qatars-sainsburys-selloff-reveals-about-shareholder-leverage',
  'what-teslas-china-ev-sales-rise-reveals-about-global-supply-leverage',
  'what-trustpilots-short-seller-attack-reveals-about-review-platform-risks',
  'what-upm-and-sappis-1-7b-joint-venture-reveals-about-paper-industry-leverage',
  'when-open-source-meets-heavy-capital-the-wordpress-legal-tug-of-war',
  'which-e-commerce-platform-leverages-most-ai-for-small-businesses-2025',
  'why-amazon-quietly-dropped-satellite-internets-affordability-pitch',
  'why-art-pharmacys-social-prescriptions-redefine-healthcare-leverage',
  'why-australias-qube-sale-shows-leverage-beyond-logistics',
  'why-bad-bosses-actually-destroy-team-leverage-according-to-harris-poll',
  'why-baidus-kunlunxin-ipo-signals-chinas-ai-sovereignty-push',
  'why-bains-sale-of-tanabe-pharma-assets-signals-a-strategic-reset',
  'why-bending-spoons-is-the-silent-leverage-giant-aol-never-saw-coming',
  'why-blackstones-nyc-mall-sale-reveals-real-estate-system-shifts',
  'why-building-a-mile-high-skyscraper-is-nearly-impossible',
  'why-catalio-capitals-healthcare-hire-signals-hedge-fund-leverage-shift',
  'why-celebrity-steakhouses-are-the-ultimate-leverage-play-you-missed',
  'why-citigroups-bullish-turn-on-europe-signals-earnings-fragility',
  'why-digital-succession-planning-is-the-overlooked-leverage-strategy-for-enduring-businesses',
  'why-ecuadors-solgold-rejected-chinas-takeover-bid',
  'why-founders-learning-to-code-remains-crucial-despite-ai-advances',
  'why-google-offers-voluntary-buyouts-to-uk-employees-now',
  'why-indias-sirion-labs-attracts-500m-from-tpg-and-warburg',
  'why-leonteqs-profit-warning-signals-a-deep-structural-leverage-problem',
  'why-major-us-insurers-reject-ai-liability-coverage',
  'why-mantech-scrapped-2-3b-loan-sale-for-private-credit-leverage',
  'why-mastodons-ceo-exit-signals-a-governance-shift-not-just-leadership-change',
  'why-meta-is-entering-electricity-trading-to-power-data-centers',
  'why-metas-shift-from-metaverse-to-ai-glasses-signals-a-leverage-reset',
  'why-michael-dells-6-25b-kids-grant-reveals-strategic-leverage',
  'why-monarch-tractors-autonomy-lawsuit-reveals-startup-scaling-risks',
  'why-morgan-stanleys-data-center-shift-signals-hidden-constraints',
  'why-navans-ipo-collapse-is-the-ultimate-lesson-in-misused-leverage',
  'why-new-york-quietly-considers-raising-corporate-taxes-by-2',
  'why-openai-naming-denise-dresser-signals-its-profit-shift',
  'why-overengineering-weapons-is-natos-biggest-strategic-blunder-ukraine-just-proved-it',
  'why-poland-and-nato-use-xbox-controllers-to-fight-drone-wars',
  'why-qatar-airways-ceo-change-signals-strategic-leverage-reset',
  'why-rahul-agarwals-rasa-group-reveals-new-multi-brand-leverage',
  'why-russias-baikonur-launchpad-crash-reveals-space-system-fragility',
  'why-salesforces-informatica-deal-reveals-ai-data-leverage-shift',
  'why-servicenows-1b-veza-deal-is-identity-security-leverage',
  'why-shrms-turmoil-reveals-a-leverage-failure-in-hr-leadership',
  'why-singapore-quietly-adopted-swiss-like-money-management',
  'why-singapores-dbs-scaled-back-alliance-bank-bid-to-30',
  'why-t-mobiles-15-minute-switch-reshapes-us-carrier-competition',
  'why-teslas-texting-move-reveals-a-hidden-automation-constraint',
  'why-the-leveraged-etf-boom-signals-hidden-risks-in-401ks',
  'why-the-us-air-traffic-control-crisis-is-a-brutal-lesson-in-leverage-failure',
  'why-the-us-ban-is-shoving-dji-out-of-american-skies',
  'why-the-us-export-import-bank-bets-100b-on-fossil-fuel-deals-abroad',
  'why-trumps-fcc-scrapped-u-s-telecom-cybersecurity-rules',
  'why-ubers-ai-training-cut-reveals-a-leverage-trap',
  'why-walmart-and-costco-closed-thanksgiving-while-others-stayed-open',
  'why-web3-marketing-reveals-a-shift-from-control-to-community',
  'why-wells-fargos-jackie-krese-hire-signals-fund-finance-shift',
  'why-whole-foods-tiny-new-stores-are-amazons-biggest-grocery-power-play-you-didnt-see-coming',
  'why-wisconsins-snowiest-ski-resort-filed-bankruptcy-to-survive',
  'why-xiaomis-share-buyback-signals-strategic-leverage-shift',
  'wisetechs-pricing-shift-aligns-with-revenue-growth-forecasts',
  'your-ultimate-case-study-template-for-business-leverage',
])

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Strip trailing slash for matching
  const cleanPath = pathname.endsWith('/') && pathname !== '/' 
    ? pathname.slice(0, -1) 
    : pathname
  
  // Skip paths that are already handled by Next.js routes
  if (
    cleanPath.startsWith('/blog') ||
    cleanPath.startsWith('/category') ||
    cleanPath.startsWith('/author') ||
    cleanPath.startsWith('/feed') ||
    cleanPath.startsWith('/about') ||
    cleanPath.startsWith('/contact') ||
    cleanPath.startsWith('/privacy') ||
    cleanPath.startsWith('/_next') ||
    cleanPath.startsWith('/images') ||
    cleanPath.startsWith('/api') ||
    cleanPath === '/' ||
    cleanPath === '/sitemap.xml' ||
    cleanPath === '/robots.txt'
  ) {
    return NextResponse.next()
  }

  // Extract the slug from the path (remove leading slash)
  const slug = cleanPath.slice(1)

  // Ghost tag pages -> redirect to homepage
  if (slug.startsWith('tag/')) {
    return NextResponse.redirect(new URL('/', request.url), 301)
  }

  // Ghost author pages -> redirect to our author page
  if (slug.startsWith('author/')) {
    return NextResponse.redirect(new URL('/author/paul-allen', request.url), 301)
  }

  // If this slug exists in our kept content, redirect to /blog/slug
  if (KEPT_SLUGS.has(slug)) {
    return NextResponse.redirect(new URL(`/blog/${slug}`, request.url), 301)
  }

  // All other old Ghost URLs -> redirect to homepage (preserves backlink equity)
  // This catches the ~4,400 dropped articles
  if (slug && !slug.includes('.')) {
    return NextResponse.redirect(new URL('/', request.url), 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
}
