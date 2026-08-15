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

/** Used by Organization/LocalBusiness JSON-LD and the contact page. */
export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: SITE_LEGAL_NAME,
  telephone: '+63 917 123 4567',
  email: 'inquire@lcphrealty.com',
  streetAddress: 'KM 71 NLEX Interchange',
  addressLocality: 'Umingan',
  addressRegion: 'Pampanga',
  postalCode: '2021',
  addressCountry: 'PH',
  latitude: 15.0418381,
  longitude: 120.6810848,
  parentOrganization: 'VHBC',
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
  if (!title) return `${SITE_NAME} | Lakeside Master-Planned Communities in Pampanga`;
  return `${title} | ${SITE_NAME}`;
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
    title: `${SITE_NAME} | Lakeside Master-Planned Communities in Pampanga`,
    description:
      'LCPH Realty Inc., a subsidiary of VHBC, develops premier lakeside residential and commercial communities in Pampanga. Explore Lakeshore Community North lots, amenities and pricing.',
    priority: 1.0,
    changefreq: 'weekly',
  },
  {
    path: '/about',
    title: pageTitle('About Us'),
    description:
      'Learn how LCPH Realty Inc. builds master-planned lakeside estates in Pampanga — our story as a VHBC subsidiary, our core pillars and our commitment to heritage quality.',
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/projects',
    title: pageTitle('Our Projects'),
    description:
      'Browse LCPH Realty Inc. master-planned communities and townships, including the flagship Lakeshore Community North estate in Mexico, Pampanga.',
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/amenities',
    title: pageTitle('Amenities'),
    description:
      'Resort-style amenities across LCPH communities: clubhouse and pools, nature trails, sports courts, wellness facilities and 24/7 secured perimeters.',
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/updates',
    title: pageTitle('Construction Updates'),
    description:
      'Track construction progress across LCPH Realty Inc. developments with dated site engineering reports, progress percentages and on-site photos.',
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/news',
    title: pageTitle('News & Events'),
    description:
      'Announcements, events, buyer guides and company news from LCPH Realty Inc. and the Lakeshore Community Philippines developments.',
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/gallery',
    title: pageTitle('Gallery'),
    description:
      'Aerial views, amenity renders, construction progress and community photos from LCPH Realty Inc. lakeside developments in Pampanga.',
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    path: '/contact',
    title: pageTitle('Contact Us'),
    description:
      'Talk to an LCPH Realty Inc. property specialist. Office at KM 71 NLEX, Mexico, Pampanga — call +63 917 123 4567 or send an inquiry online.',
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/schedule-site-visit',
    title: pageTitle('Schedule a Site Visit'),
    description:
      'Book a guided site tour of Lakeshore Community North. Pick a date, meet a certified property specialist and walk the lots, amenities and master plan in person.',
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/faqs',
    title: pageTitle('Frequently Asked Questions'),
    description:
      'Answers on LCPH lot pricing, payment terms, reservation requirements, turnover timelines, titles and financing for our Pampanga developments.',
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    path: '/careers',
    title: pageTitle('Careers'),
    description:
      'Join LCPH Realty Inc. Open roles across sales and marketing, engineering and architecture, property management and corporate operations.',
    priority: 0.5,
    changefreq: 'monthly',
  },
  {
    path: '/partner-with-us',
    title: pageTitle('Partner With Us'),
    description:
      'Broker, landowner and institutional partnership opportunities with LCPH Realty Inc., a VHBC subsidiary developing lakeside communities in Pampanga.',
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
    url: SITE_URL,
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
    areaServed: { '@type': 'AdministrativeArea', name: 'Pampanga, Philippines' },
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
    noindex: route ? Boolean(route.noindex) : false,
    jsonLd,
  };
}

/** @returns {SeoMeta} */
export function metaForProject(project) {
  const path = `/projects/${project.slug}`;
  const description = clamp(
    project.description || project.longDescription || `${project.name} by ${SITE_NAME}.`,
    160
  );

  return {
    title: pageTitle(`${project.name} — ${project.location}`),
    description,
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
        '@type': 'ResidentialComplex',
        name: project.name,
        url: absoluteUrl(path),
        description: clamp(project.longDescription || project.description, 400),
        image: socialImage(project.image),
        address: {
          '@type': 'PostalAddress',
          addressLocality: project.location,
          addressRegion: ORGANIZATION.addressRegion,
          addressCountry: ORGANIZATION.addressCountry,
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

/** @returns {SeoMeta} */
export function metaForNews(article) {
  const path = `/news/${article.slug}`;
  const published = isoDate(article.date);

  return {
    title: pageTitle(article.title),
    description: clamp(article.excerpt || article.content, 160),
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
