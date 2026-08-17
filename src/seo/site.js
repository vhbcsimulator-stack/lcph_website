/**
 * Single source of truth for every piece of SEO metadata on the public site.
 *
 * This file is plain ESM on purpose: it is imported by the React app through Vite
 * *and* by `scripts/prerender.mjs` running under bare Node at build time, so the
 * titles, descriptions and JSON-LD that crawlers see in the static HTML are the
 * exact same ones the client renders after hydration.
 */

/** Override with a `SITE_URL` env var at build time (staging, preview deploys). */
const ENV_SITE_URL = typeof process !== 'undefined' && process.env ? process.env.SITE_URL : undefined;

export const SITE_URL = (ENV_SITE_URL || 'https://www.lcph.com.ph').replace(/\/+$/, '');
export const SITE_NAME = 'LCPH Realty Inc.';
export const SITE_LEGAL_NAME = 'Lakeshore Community Philippines (LCPH) Realty Inc.';
export const SITE_LOCALE = 'en_PH';
export const DEFAULT_OG_IMAGE = '/og-image.jpg';

/**
 * The corporate office — where the company *is*, not where it builds.
 * Verified against the Google Maps listing for LCPH Realty Inc.
 */
export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: SITE_LEGAL_NAME,
  telephone: '+63 917 123 4567',
  email: 'inquire@lcphrealty.com',
  streetAddress: 'Ground Floor, Freluz Building, Jose Abad Santos Avenue',
  addressLocality: 'City of San Fernando',
  addressRegion: 'Pampanga',
  postalCode: '2000',
  addressCountry: 'PH',
  latitude: 15.0418329,
  longitude: 120.6836597,
  parentOrganization: 'VHBC',

  /** Every name the company is searched by, including the bare acronym. */
  alternateNames: [
    'LCPH',
    'LCPH Realty',
    'Lakeshore Community Philippines',
    'Leisure Community PH',
  ],

  /**
   * Official profiles, used for schema.org `sameAs`. This is one of the strongest
   * signals Google uses to resolve a brand to a real entity — an acronym as contested
   * as "LCPH" needs it. Add the real URLs (Facebook page, Google Business Profile,
   * YouTube, LinkedIn) as they exist; empty entries are omitted from the output.
   */
  sameAs: [
    // 'https://www.facebook.com/<page>',
    // 'https://www.youtube.com/@<channel>',
    // 'https://www.linkedin.com/company/<company>',
  ].filter(Boolean),
};

/**
 * Where the developments actually are — a different province from the office, so the
 * two must never be conflated. Search engines cross-check a project's stated address
 * against its coordinates, and the office address on a project page reads as a
 * mismatch that suppresses the local result.
 */
export const DEVELOPMENT = {
  addressLocality: 'Talugtug',
  addressRegion: 'Nueva Ecija',
  postalCode: '3118',
  addressCountry: 'PH',
  latitude: 15.792,
  longitude: 120.811,
  /** Human-readable form used in titles and prose. */
  label: 'Brgy. Buted, Talugtug, Nueva Ecija',
  shortLabel: 'Talugtug, Nueva Ecija',
};

// ─── URL + text helpers ───────────────────────────────────────────────────────

/** Turn a site-relative path into an absolute URL; passes absolute URLs through. */
export function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}/${String(pathOrUrl).replace(/^\/+/, '')}`;
}

/**
 * Social scrapers cannot fetch a `data:` URI and Vite rewrites `/src/...` paths at
 * build time, so anything that is not a real remote image falls back to the default.
 */
export function socialImage(url) {
  if (typeof url === 'string' && /^https?:\/\//i.test(url)) return url;
  return absoluteUrl(DEFAULT_OG_IMAGE);
}

/** Strip rich-text markup and entities so a description reads as plain prose. */
export function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Clamp to `max` characters on a word boundary — Google truncates around 160. */
export function clamp(text, max = 160) {
  const clean = stripHtml(text);
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).trim()}…`;
}

/** Every page title ends with the brand, except the home page which leads with it. */
export function pageTitle(title) {
  if (!title) return `${SITE_NAME} | Lakeside Master-Planned Communities in Nueva Ecija`;
  return `${title} | ${SITE_NAME}`;
}

// ─── Keywords ─────────────────────────────────────────────────────────────────

/**
 * Terms every page carries: the brand, the two provinces the business spans, and the
 * category language buyers actually type. Google itself ignores the keywords meta tag
 * (it has since 2009), so the value of this list is not the tag — it is that the same
 * terms are deliberately worked into the titles, descriptions and headings, which do
 * count. Keep it honest and specific; padding it with unrelated terms helps nothing.
 */
export const BASE_KEYWORDS = [
  'LCPH Realty',
  'LCPH Realty Inc',
  'Lakeshore Community Philippines',
  'Lakeshore Community North',
  'lot for sale Nueva Ecija',
  'subdivision Nueva Ecija',
  'Talugtug Nueva Ecija real estate',
  'real estate developer Pampanga',
  'San Fernando Pampanga real estate office',
  'master-planned community Central Luzon',
  'lakeside lots Philippines',
];

/** Merge page-specific terms with the base list, de-duplicated, order preserved. */
export function keywordsFor(...extra) {
  return [...new Set([...extra.flat().filter(Boolean), ...BASE_KEYWORDS])].join(', ');
}

// ─── Static routes ────────────────────────────────────────────────────────────

/**
 * Hand-written metadata for every non-parameterised public route. `priority` and
 * `changefreq` feed the sitemap; `noindex` keeps thin/utility pages out of the index.
 *
 * @type {{path: string, title: string, description: string, priority: number, changefreq: string, noindex?: boolean}[]}
 */
export const STATIC_ROUTES = [
  {
    path: '/',
    title: `${SITE_NAME} | Lakeside Master-Planned Communities in Nueva Ecija`,
    description:
      'Residential and commercial lots for sale at Lakeshore Community North, a master-planned lakeside community in Talugtug, Nueva Ecija. LCPH Realty Inc. — a VHBC subsidiary with offices in San Fernando, Pampanga.',
    keywords: keywordsFor(['lot for sale Philippines','residential lots for sale','investment property Central Luzon','lakeside subdivision']),
    priority: 1.0,
    changefreq: 'weekly',
  },
  {
    path: '/about',
    title: pageTitle('About Us'),
    description:
      'LCPH Realty Inc. is a VHBC subsidiary building master-planned lakeside estates in Nueva Ecija, with its corporate office in San Fernando, Pampanga. Our story, pillars and commitment to heritage quality.',
    keywords: keywordsFor(['about LCPH Realty','VHBC subsidiary','property developer Central Luzon','real estate company Pampanga']),
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/projects',
    title: pageTitle('Our Projects'),
    description:
      'Browse LCPH Realty Inc. master-planned communities and townships, including the flagship Lakeshore Community North estate in Brgy. Buted, Talugtug, Nueva Ecija.',
    keywords: keywordsFor(['master-planned communities Philippines','townships Nueva Ecija','Mini Complete Vacation Community','residential and commercial estates']),
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/amenities',
    title: pageTitle('Amenities'),
    description:
      'Resort-style amenities at Lakeshore Community North in Nueva Ecija: clubhouse and pools, nature trails, sports courts, wellness facilities and 24/7 secured perimeters.',
    keywords: keywordsFor(['subdivision amenities','clubhouse and pool','nature trails','gated community Nueva Ecija']),
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/updates',
    title: pageTitle('Construction Updates'),
    description:
      'Construction progress at Lakeshore Community North, Talugtug, Nueva Ecija — dated site engineering reports, completion percentages and on-site photos from LCPH Realty Inc.',
    keywords: keywordsFor(['construction updates','project progress','site development Nueva Ecija']),
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/news',
    title: pageTitle('News & Events'),
    description:
      'Property news, buyer guides and events from LCPH Realty Inc. — investing in Central Luzon real estate, Nueva Ecija lot buying, and updates from Lakeshore Community North.',
    keywords: keywordsFor(['real estate news Philippines','property investment guides','Central Luzon property news']),
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/gallery',
    title: pageTitle('Gallery'),
    description:
      'Photos of Lakeshore Community North: aerial views of the lake and lots, amenity renders, construction progress and community life in Talugtug, Nueva Ecija.',
    keywords: keywordsFor(['subdivision photos','aerial view','property renders Nueva Ecija']),
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    path: '/contact',
    title: pageTitle('Contact Us'),
    description:
      'Talk to an LCPH Realty Inc. property specialist. Office at the Freluz Building, Jose Abad Santos Avenue, San Fernando, Pampanga — call +63 917 123 4567 or send an inquiry online.',
    keywords: keywordsFor(['contact LCPH Realty','property specialist Pampanga','real estate office San Fernando Pampanga','Freluz Building Jose Abad Santos Avenue']),
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/schedule-site-visit',
    title: pageTitle('Schedule a Site Visit'),
    description:
      'Book a guided site tour of Lakeshore Community North in Talugtug, Nueva Ecija. Pick a date, meet a certified property specialist and walk the lots, amenities and master plan in person.',
    keywords: keywordsFor(['schedule site visit','property tripping Nueva Ecija','site tour Lakeshore Community North']),
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/faqs',
    title: pageTitle('Frequently Asked Questions'),
    description:
      'Answers on LCPH lot pricing, payment terms, reservation requirements, turnover timelines, titles and financing for our Nueva Ecija developments.',
    keywords: keywordsFor(['lot pricing','payment terms','reservation requirements','financing Pag-IBIG bank loan']),
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    path: '/careers',
    title: pageTitle('Careers'),
    description:
      'Join LCPH Realty Inc. Open roles across sales and marketing, engineering and architecture, property management and corporate operations.',
    keywords: keywordsFor(['real estate jobs Pampanga','careers LCPH Realty','property sales jobs Central Luzon']),
    priority: 0.5,
    changefreq: 'monthly',
  },
  {
    path: '/partner-with-us',
    title: pageTitle('Partner With Us'),
    description:
      'Broker, landowner and institutional partnership opportunities with LCPH Realty Inc., a VHBC subsidiary developing lakeside communities in Nueva Ecija.',
    keywords: keywordsFor(['broker partnership','real estate brokers Philippines','landowner joint venture']),
    priority: 0.5,
    changefreq: 'monthly',
  },
  {
    path: '/privacy-policy',
    title: pageTitle('Privacy Policy'),
    description:
      'How LCPH Realty Inc. collects, uses and protects personal information submitted through this website, in line with the Philippine Data Privacy Act.',
    priority: 0.2,
    changefreq: 'yearly',
  },
  {
    path: '/terms',
    title: pageTitle('Terms of Use'),
    description: 'The terms and conditions governing your use of the LCPH Realty Inc. website.',
    priority: 0.2,
    changefreq: 'yearly',
  },
  {
    path: '/cookie-policy',
    title: pageTitle('Cookie Policy'),
    description: 'How the LCPH Realty Inc. website uses cookies and similar technologies, and how to manage them.',
    priority: 0.2,
    changefreq: 'yearly',
  },
];

/** @param {string} path */
export function staticRoute(path) {
  const normalised = path === '/' ? '/' : path.replace(/\/+$/, '');
  return STATIC_ROUTES.find((r) => r.path === normalised);
}

// ─── JSON-LD builders ─────────────────────────────────────────────────────────

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#organization`,
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    // "LCPH" is a contested acronym (a hospital, a league of cities, two churches all
    // use it), so every name this company is known by is declared explicitly. This is
    // how Google learns which entity a bare "LCPH" query might mean.
    alternateName: ORGANIZATION.alternateNames,
    url: SITE_URL,
    ...(ORGANIZATION.sameAs.length ? { sameAs: ORGANIZATION.sameAs } : {}),
    logo: absoluteUrl(DEFAULT_OG_IMAGE),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    telephone: ORGANIZATION.telephone,
    email: ORGANIZATION.email,
    parentOrganization: { '@type': 'Organization', name: ORGANIZATION.parentOrganization },
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORGANIZATION.streetAddress,
      addressLocality: ORGANIZATION.addressLocality,
      addressRegion: ORGANIZATION.addressRegion,
      postalCode: ORGANIZATION.postalCode,
      addressCountry: ORGANIZATION.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: ORGANIZATION.latitude,
      longitude: ORGANIZATION.longitude,
    },
    // Two provinces matter: the office serves buyers in Pampanga, the developments
    // are in Nueva Ecija, and both sit inside Central Luzon.
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Nueva Ecija, Philippines' },
      { '@type': 'AdministrativeArea', name: 'Pampanga, Philippines' },
      { '@type': 'AdministrativeArea', name: 'Central Luzon, Philippines' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '17:00',
      },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '09:00', closes: '16:00' },
    ],
  };
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'en-PH',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** @param {{name: string, path?: string}[]} trail */
export function breadcrumbLd(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      ...(crumb.path ? { item: absoluteUrl(crumb.path) } : {}),
    })),
  };
}

/**
 * Best-effort ISO 8601 from the free-text `date` admins type ("March 15, 2026").
 * Returns undefined rather than an invalid date, which Google treats as an error.
 */
export function isoDate(value) {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

// ─── Per-entity metadata ──────────────────────────────────────────────────────

/**
 * @typedef {object} SeoMeta
 * @property {string} title
 * @property {string} description
 * @property {string} canonical
 * @property {string} image
 * @property {string} [type]
 * @property {boolean} [noindex]
 * @property {object[]} [jsonLd]
 */

/** @returns {SeoMeta} */
export function metaForStatic(path) {
  const route = staticRoute(path);
  const jsonLd = [organizationLd(), websiteLd()];

  if (route && route.path !== '/') {
    jsonLd.push(breadcrumbLd([{ name: route.title.split(' | ')[0], path: route.path }]));
  }

  return {
    title: route ? route.title : pageTitle(),
    description: route ? route.description : STATIC_ROUTES[0].description,
    canonical: absoluteUrl(route ? route.path : '/'),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    type: 'website',
    keywords: route && route.keywords ? route.keywords : keywordsFor(),
    noindex: route ? Boolean(route.noindex) : false,
    jsonLd,
  };
}

/** The admin-entered specs, as schema.org PropertyValue rows. Blank fields are skipped. */
function specProperties(project) {
  const specs = project.specs || {};
  return [
    ['Total area', specs.totalArea],
    ['Lot sizes', specs.lotSizes],
    ['Total units', specs.totalUnits],
    ['Price range', specs.priceRange],
  ]
    .filter(([, value]) => value && String(value).trim() && String(value).trim() !== 'TBA')
    .map(([name, value]) => ({ '@type': 'PropertyValue', name, value: String(value).trim() }));
}

/** @returns {SeoMeta} */
export function metaForProject(project) {
  const path = `/projects/${project.slug}`;
  const description = clamp(
    project.description || project.longDescription || `${project.name} by ${SITE_NAME}.`,
    160
  );

  const isCondo = project.category === 'Condominium';
  // What buyers actually type. A subdivision and a condominium are different searches,
  // and "pre-selling" is high-intent language in Philippine real estate — it belongs in
  // the title rather than buried in the body.
  const productLabel = isCondo ? 'Condominium' : 'Subdivision Lots';
  const preSelling = project.status === 'Pre-selling';
  const headline = `${preSelling ? 'Pre-selling ' : ''}${productLabel} in ${DEVELOPMENT.addressRegion}`;

  const productKeywords = isCondo
    ? [
        `${project.name} condominium`,
        'condo for sale Nueva Ecija',
        'pre-selling condo Nueva Ecija',
        'condominium Talugtug',
        'vacation condo Philippines',
      ]
    : [
        `${project.name} lots`,
        'lot for sale Nueva Ecija',
        'lot for sale Talugtug',
        'subdivision Nueva Ecija',
        'pre-selling lots Nueva Ecija',
        'residential lots for sale Central Luzon',
        project.specs && project.specs.lotSizes ? `lots ${project.specs.lotSizes}` : null,
      ];

  // `project.location` is admin-editable and has held the office's province rather than
  // the site's, so the development constant is authoritative for the address block.
  return {
    title: pageTitle(`${project.name} — ${headline}`),
    description,
    keywords: keywordsFor(productKeywords, [
      project.name,
      `${project.name} price`,
      `${project.name} location`,
      preSelling ? `${project.name} pre-selling` : null,
    ]),
    canonical: absoluteUrl(path),
    image: socialImage(project.image),
    type: 'website',
    jsonLd: [
      organizationLd(),
      breadcrumbLd([
        { name: 'Projects', path: '/projects' },
        { name: project.name, path },
      ]),
      {
        '@context': 'https://schema.org',
        // ApartmentComplex for the condominium, ResidentialComplex for the subdivision —
        // the two are distinct entities to Google and surface for different queries.
        '@type': isCondo ? 'ApartmentComplex' : 'ResidentialComplex',
        name: project.name,
        url: absoluteUrl(path),
        description: clamp(project.longDescription || project.description, 400),
        image: socialImage(project.image),
        // Lot sizes are a range ("170 sqm to 2043 sqm"), not a single measurement, so
        // they belong in additionalProperty rather than a QuantitativeValue.
        ...(specProperties(project).length ? { additionalProperty: specProperties(project) } : {}),
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Brgy. Buted',
          addressLocality: DEVELOPMENT.addressLocality,
          addressRegion: DEVELOPMENT.addressRegion,
          postalCode: DEVELOPMENT.postalCode,
          addressCountry: DEVELOPMENT.addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: DEVELOPMENT.latitude,
          longitude: DEVELOPMENT.longitude,
        },
        ...(project.amenities && project.amenities.length
          ? {
              amenityFeature: project.amenities.map((name) => ({
                '@type': 'LocationFeatureSpecification',
                name,
                value: true,
              })),
            }
          : {}),
        provider: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
}

/**
 * Individual lot listings. These are the pages that match specific buyer searches
 * ("corner lot Nueva Ecija", "300 sqm lot for sale"), so each gets a RealEstateListing.
 *
 * Price is deliberately omitted from the structured data: `pricePlaceholder` is free
 * text an admin types, and publishing a mis-parsed number as a machine-readable price
 * is worse than publishing none. Availability is safe to state.
 *
 * @returns {SeoMeta}
 */
export function metaForProperty(property) {
  const path = `/properties/${property.slug}`;
  const availability = {
    Available: 'https://schema.org/InStock',
    Reserved: 'https://schema.org/LimitedAvailability',
    Sold: 'https://schema.org/SoldOut',
  }[property.status];

  const summary =
    property.description ||
    `${property.lotType || 'Lot'} at ${property.projectName || SITE_NAME}, ${DEVELOPMENT.shortLabel}.`;

  return {
    title: pageTitle(`${property.title} — ${DEVELOPMENT.shortLabel}`),
    description: clamp(summary, 160),
    keywords: keywordsFor([property.title, property.lotType, property.category, property.lotSize ? `${property.lotSize} sqm lot` : null, `${property.lotType || 'lot'} for sale Nueva Ecija`]),
    canonical: absoluteUrl(path),
    image: socialImage((property.images || [])[0]),
    type: 'website',
    jsonLd: [
      breadcrumbLd([
        { name: 'Projects', path: '/projects' },
        { name: property.title, path },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: property.title,
        url: absoluteUrl(path),
        description: clamp(summary, 400),
        ...((property.images || []).length ? { image: property.images.map(socialImage) } : {}),
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Brgy. Buted',
          addressLocality: DEVELOPMENT.addressLocality,
          addressRegion: DEVELOPMENT.addressRegion,
          postalCode: DEVELOPMENT.postalCode,
          addressCountry: DEVELOPMENT.addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: DEVELOPMENT.latitude,
          longitude: DEVELOPMENT.longitude,
        },
        ...(property.lotSize
          ? {
              floorSize: {
                '@type': 'QuantitativeValue',
                value: property.lotSize,
                unitCode: 'MTK', // square metres
              },
            }
          : {}),
        ...(availability ? { offers: { '@type': 'Offer', availability } } : {}),
        provider: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
}

/** @returns {SeoMeta} */
export function metaForNews(article) {
  const path = `/news/${article.slug}`;
  const published = isoDate(article.date);

  return {
    title: pageTitle(article.title),
    description: clamp(article.excerpt || article.content, 160),
    keywords: keywordsFor([article.title, article.category]),
    canonical: absoluteUrl(path),
    image: socialImage(article.image),
    type: 'article',
    jsonLd: [
      breadcrumbLd([
        { name: 'News & Events', path: '/news' },
        { name: article.title, path },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: clamp(article.title, 110),
        description: clamp(article.excerpt || article.content, 300),
        image: [socialImage(article.image)],
        url: absoluteUrl(path),
        mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(path) },
        articleSection: article.category,
        ...(published ? { datePublished: published, dateModified: published } : {}),
        author: { '@type': 'Person', name: article.author || SITE_NAME },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
}

/** @returns {SeoMeta} */
export function metaForUpdate(update) {
  const path = `/updates/${update.slug}`;
  const published = isoDate(update.date);

  return {
    title: pageTitle(`${update.title} — Construction Update`),
    description: clamp(update.summary || update.content, 160),
    keywords: keywordsFor([update.title, update.projectName, 'construction update']),
    canonical: absoluteUrl(path),
    image: socialImage(update.image),
    type: 'article',
    jsonLd: [
      breadcrumbLd([
        { name: 'Construction Updates', path: '/updates' },
        { name: update.title, path },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: clamp(update.title, 110),
        description: clamp(update.summary || update.content, 300),
        image: [socialImage(update.image)],
        url: absoluteUrl(path),
        mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(path) },
        about: update.projectName,
        ...(published ? { datePublished: published, dateModified: published } : {}),
        author: { '@type': 'Organization', name: SITE_NAME },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
}

/** @param {{question: string, answer: string}[]} faqs */
export function faqLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.slice(0, 30).map((f) => ({
      '@type': 'Question',
      name: stripHtml(f.question),
      acceptedAnswer: { '@type': 'Answer', text: stripHtml(f.answer) },
    })),
  };
}