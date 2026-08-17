import { useEffect } from 'react';
import { absoluteUrl, metaForStatic, SITE_NAME, SITE_LOCALE } from './site.js';

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  image?: string;
  /** Open Graph object type — 'website' for pages, 'article' for news/updates. */
  type?: string;
  noindex?: boolean;
  jsonLd?: object[];
}

/**
 * Applies page metadata to <head> imperatively.
 *
 * React 19 can hoist <title>/<meta> rendered in a component, but it appends rather
 * than replaces, which would leave the defaults from index.html duplicated ahead of
 * ours. Upserting by selector keeps exactly one tag per key — the same shape the
 * prerenderer bakes into the static HTML — so client navigation and the crawler's
 * first byte agree.
 */
function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${CSS.escape(key)}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

/**
 * Off switch for the whole module.
 *
 * The admin shell renders these same pages for editing, on a private origin that is never
 * crawled — there it has no metadata to publish, and letting the pages run would retitle the
 * browser tab per record and point canonical/OG at the public site. Its entry point calls
 * `disableSeo()` at startup; everything below then becomes a no-op. The public site leaves it on.
 */
let seoEnabled = true;

/** Turns every SEO write in this module into a no-op. Call before the app renders. */
export function disableSeo() {
  seoEnabled = false;
}

export function applySeo(meta: SeoMeta) {
  if (!seoEnabled) return;

  const image = meta.image || absoluteUrl('/og-image.jpg');

  document.title = meta.title;

  upsertMeta('name', 'description', meta.description);
  if (meta.keywords) upsertMeta('name', 'keywords', meta.keywords);
  upsertLink('canonical', meta.canonical);

  if (meta.noindex) {
    upsertMeta('name', 'robots', 'noindex, follow');
  } else {
    upsertMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  }

  upsertMeta('property', 'og:type', meta.type || 'website');
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:locale', SITE_LOCALE);
  upsertMeta('property', 'og:title', meta.title);
  upsertMeta('property', 'og:description', meta.description);
  upsertMeta('property', 'og:url', meta.canonical);
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:image:alt', meta.title);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', meta.title);
  upsertMeta('name', 'twitter:description', meta.description);
  upsertMeta('name', 'twitter:image', image);

  // Structured data is fully replaced each navigation — stale @graph entries from the
  // previous page would otherwise describe the wrong URL.
  document.head.querySelectorAll('script[data-seo-ld]').forEach((el) => el.remove());
  (meta.jsonLd || []).forEach((block) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-ld', '');
    script.textContent = JSON.stringify(block);
    document.head.appendChild(script);
  });
}

/**
 * Set the page's SEO metadata. Pass `null` to skip (e.g. while the record is still
 * loading) so the previous page's tags are not replaced with placeholders.
 */
export function useSeo(meta: SeoMeta | null) {
  const serialised = meta ? JSON.stringify(meta) : null;

  useEffect(() => {
    if (!serialised) return;
    applySeo(JSON.parse(serialised) as SeoMeta);
  }, [serialised]);
}

/** Convenience wrapper for the routes described in `STATIC_ROUTES`. */
export function useStaticSeo(path: string, extraJsonLd?: object[]) {
  const base = metaForStatic(path) as SeoMeta;
  useSeo(
    extraJsonLd && extraJsonLd.length
      ? { ...base, jsonLd: [...(base.jsonLd || []), ...extraJsonLd] }
      : base
  );
}

/** For pages that should never be indexed (404, admin-only views). */
export function useNoIndexSeo(title: string, description: string) {
  useSeo({
    title,
    description,
    canonical: absoluteUrl(typeof window !== 'undefined' ? window.location.pathname : '/'),
    noindex: true,
    jsonLd: [],
  });
}