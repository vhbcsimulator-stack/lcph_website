/**
 * Post-build SEO pass. Runs after `vite build`, against `dist/`.
 *
 * The site is a client-rendered SPA, so the shipped index.html carries only generic
 * metadata — every crawler and every social scraper would see the same title for every
 * URL. This script fixes that without changing the app's rendering model: it writes one
 * static HTML file per route, identical to the SPA shell except that the <head> holds
 * that route's real title, description, canonical, Open Graph tags and JSON-LD.
 *
 * Vercel (and the Apache/_redirects fallbacks) check the filesystem before applying the
 * SPA rewrite, so /projects/lcn is served from dist/projects/lcn/index.html — correct meta
 * on first byte, no JS required — and React then hydrates over it exactly as before.
 *
 * It also emits sitemap.xml and robots.txt with the live slugs pulled from Supabase.
 *
 * Failure policy: a Supabase outage degrades to the static routes only (with a warning)
 * rather than failing the deploy. Missing dist/index.html is fatal — that means the
 * build itself broke.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  SITE_URL,
  STATIC_ROUTES,
  faqLd,
  metaForStatic,
  metaForProject,
  metaForNews,
  metaForUpdate,
} from '../src/seo/site.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

/**
 * Vite loads .env for the app bundle, but this script runs as bare Node and would not
 * see it — so a local `npm run build` would fail on credentials that are plainly there.
 * Hosts (Vercel) inject real env vars, which always win over the file.
 */
function loadDotEnv() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const match = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/.exec(line);
    if (!match || line.trim().startsWith('#')) continue;
    const key = match[1];
    if (process.env[key] !== undefined) continue;
    process.env[key] = (match[2] ?? '').trim().replace(/^(['"])(.*)\1$/, '$2');
  }
}

loadDotEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

/**
 * Absent credentials are a configuration error, not an outage, so they stop the build.
 * The distinction matters: a *reachable* Supabase that errors degrades to the static
 * routes with a warning, but unset env vars would do the same silently and ship a
 * sitemap with every project and article missing — an invisible SEO regression.
 */
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    '[seo] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set — without them no\n' +
      '      project, news or update pages can be prerendered or listed in sitemap.xml.\n' +
      '      Set both in the deployment environment (Vercel → Settings → Environment Variables).'
  );
  process.exit(1);
}

// ─── Data ─────────────────────────────────────────────────────────────────────

/** Read a table over PostgREST. Returns [] on any failure so a build never hard-fails on it. */
async function fetchTable(table, columns) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(columns)}`;
  try {
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
    if (!res.ok) {
      console.warn(`[seo] ${table}: ${res.status} ${res.statusText} — skipping its routes`);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.warn(`[seo] ${table}: ${err.message} — skipping its routes`);
    return [];
  }
}

/**
 * Rebuild the FAQ list from the `page_content` key/value rows, mirroring
 * `resolveFaqs` in src/data/faqContent.ts: an admin-managed `faq_items_json`
 * list wins, otherwise every id that has both a question and an answer stored.
 */
function faqsFromPageContent(pageContent) {
  const pair = (id) => ({
    question: pageContent[`faq_${id}_question`],
    answer: pageContent[`faq_${id}_answer`],
  });
  const complete = (f) => Boolean(f.question && f.answer);

  let stored = null;
  try {
    const parsed = JSON.parse(pageContent['faq_items_json'] ?? 'null');
    if (Array.isArray(parsed)) stored = parsed;
  } catch {
    stored = null;
  }

  if (stored) {
    return stored
      .filter((entry) => entry && typeof entry.id === 'string')
      .map((entry) => pair(entry.id))
      .filter(complete);
  }

  return Object.keys(pageContent)
    .map((key) => /^faq_(.+)_question$/.exec(key))
    .filter(Boolean)
    .map((match) => pair(match[1]))
    .filter(complete);
}

async function loadContent() {
  const [projectRows, newsRows, updateRows, contentRows] = await Promise.all([
    fetchTable('projects', 'slug,name,location,description,long_description,image,amenities,created_at'),
    fetchTable('news', 'slug,title,date,category,author,excerpt,content,image,created_at'),
    fetchTable('development_updates', 'slug,title,date,project_name,summary,content,image,created_at'),
    fetchTable('page_content', 'key,value'),
  ]);

  const withSlug = (rows) => rows.filter((r) => r && typeof r.slug === 'string' && r.slug.length > 0);
  const pageContent = Object.fromEntries(contentRows.map((r) => [r.key, r.value]));

  return {
    faqs: faqsFromPageContent(pageContent),
    projects: withSlug(projectRows).map((r) => ({
      slug: r.slug,
      name: r.name,
      location: r.location,
      description: r.description,
      longDescription: r.long_description,
      image: r.image,
      amenities: r.amenities ?? [],
      lastmod: r.created_at,
    })),
    news: withSlug(newsRows).map((r) => ({
      slug: r.slug,
      title: r.title,
      date: r.date,
      category: r.category,
      author: r.author,
      excerpt: r.excerpt,
      content: r.content,
      image: r.image,
      lastmod: r.created_at,
    })),
    updates: withSlug(updateRows).map((r) => ({
      slug: r.slug,
      title: r.title,
      date: r.date,
      projectName: r.project_name,
      summary: r.summary,
      content: r.content,
      image: r.image,
      lastmod: r.created_at,
    })),
  };
}

// ─── HTML injection ───────────────────────────────────────────────────────────

const escapeAttr = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** `</script>` inside JSON-LD would close the tag early. */
const escapeJsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

function headFor(meta) {
  const image = meta.image;
  const robots = meta.noindex
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const tags = [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="author" content="LCPH Realty Inc." />`,
    `<link rel="canonical" href="${escapeAttr(meta.canonical)}" />`,
    `<meta property="og:type" content="${escapeAttr(meta.type || 'website')}" />`,
    `<meta property="og:site_name" content="LCPH Realty Inc." />`,
    `<meta property="og:locale" content="en_PH" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(meta.canonical)}" />`,
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
    `<meta property="og:image:alt" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
  ];

  // Set GOOGLE_SITE_VERIFICATION in the host's env to verify the property in Search
  // Console via the HTML-tag method — no code change, and it lands on every page.
  if (process.env.GOOGLE_SITE_VERIFICATION) {
    tags.push(
      `<meta name="google-site-verification" content="${escapeAttr(process.env.GOOGLE_SITE_VERIFICATION)}" />`
    );
  }

  for (const block of meta.jsonLd || []) {
    tags.push(`<script type="application/ld+json" data-seo-ld>${escapeJsonLd(block)}</script>`);
  }

  return tags.join('\n  ');
}

/**
 * Strip the shell's placeholder SEO tags and splice this route's in. Everything else in
 * the head — hashed asset links, fonts, icons, viewport — is left byte-for-byte intact,
 * so the page still boots the same bundle the SPA shell does.
 */
function renderRoute(shell, meta) {
  const stripped = shell
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    // Must cover every tag headFor() emits: the shell is read back from dist/index.html,
    // which this script also rewrites, so anything not stripped would accumulate on a
    // second run (e.g. `npm run seo` without an intervening `vite build`).
    .replace(
      /<meta\s+name="(description|robots|author|google-site-verification|twitter:[^"]+)"[^>]*>\s*/gi,
      ''
    )
    .replace(/<meta\s+property="og:[^"]+"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>\s*/gi, '');

  if (!/<\/head>/i.test(stripped)) throw new Error('dist/index.html has no </head> to inject into');
  return stripped.replace(/<\/head>/i, `  ${headFor(meta)}\n</head>`);
}

/**
 * Written in both layouts a static host may look for, because they disagree:
 * Vercel's `cleanUrls` resolves /about to about.html, while Apache and Netlify
 * resolve it to about/index.html. Emitting both means the extensionless URL hits
 * a real file — and never the SPA rewrite — wherever this is deployed.
 */
async function writeRoute(path, html) {
  if (path === '/') {
    await writeFile(join(DIST, 'index.html'), html, 'utf8');
    return;
  }

  const clean = path.replace(/^\/+/, '');
  for (const target of [join(DIST, `${clean}.html`), join(DIST, clean, 'index.html')]) {
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html, 'utf8');
  }
}

// ─── sitemap.xml / robots.txt ─────────────────────────────────────────────────

const isoDay = (value) => {
  const d = value ? new Date(value) : new Date();
  return (Number.isNaN(d.getTime()) ? new Date() : d).toISOString().slice(0, 10);
};

function buildSitemap(entries) {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${escapeAttr(SITE_URL + (e.path === '/' ? '/' : e.path))}</loc>
    <lastmod>${isoDay(e.lastmod)}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobots() {
  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# The admin dashboard is a separate deployment, but block the paths defensively
# in case it is ever mounted under this host.
Disallow: /admin
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const shellPath = join(DIST, 'index.html');
  if (!existsSync(shellPath)) {
    throw new Error('dist/index.html not found — run `vite build` before this script');
  }
  const shell = await readFile(shellPath, 'utf8');

  const { projects, news, updates, faqs } = await loadContent();
  const sitemap = [];

  for (const route of STATIC_ROUTES) {
    const meta = metaForStatic(route.path);
    // The FAQ rich result is the one piece of structured data that depends on
    // page_content, so it is attached here rather than baked into metaForStatic.
    if (route.path === '/faqs' && faqs.length) {
      meta.jsonLd = [...(meta.jsonLd || []), faqLd(faqs)];
    }
    await writeRoute(route.path, renderRoute(shell, meta));
    if (!route.noindex) {
      sitemap.push({ path: route.path, priority: route.priority, changefreq: route.changefreq });
    }
  }

  for (const project of projects) {
    const path = `/projects/${project.slug}`;
    await writeRoute(path, renderRoute(shell, metaForProject(project)));
    sitemap.push({ path, priority: 0.9, changefreq: 'monthly', lastmod: project.lastmod });
  }

  for (const article of news) {
    const path = `/news/${article.slug}`;
    await writeRoute(path, renderRoute(shell, metaForNews(article)));
    sitemap.push({ path, priority: 0.6, changefreq: 'yearly', lastmod: article.lastmod });
  }

  for (const update of updates) {
    const path = `/updates/${update.slug}`;
    await writeRoute(path, renderRoute(shell, metaForUpdate(update)));
    sitemap.push({ path, priority: 0.6, changefreq: 'yearly', lastmod: update.lastmod });
  }

  await writeFile(join(DIST, 'sitemap.xml'), buildSitemap(sitemap), 'utf8');
  await writeFile(join(DIST, 'robots.txt'), buildRobots(), 'utf8');

  console.log(
    `[seo] ${sitemap.length} URLs in sitemap.xml — ` +
      `${STATIC_ROUTES.length} static, ${projects.length} projects, ${news.length} news, ${updates.length} updates`
  );
}

main().catch((err) => {
  console.error('[seo] prerender failed:', err);
  process.exit(1);
});
