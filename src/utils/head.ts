import type { APIContext } from 'astro';
import { publicLocales, defaultLocale, isRTL } from '@/i18n/locales.config';
import { SOCIAL_LINKS } from '@/config/app';

export type HeadMeta = {
  title: string;
  description: string;
  url: string; // absolute
  image?: string; // absolute og:image
  locale: string; // current page locale
};

export function buildCanonical(url: string): string {
  return url.replace(/\/$/, '/')
}

export function computeCanonical(currentUrl: URL, site?: string): string {
  const base = site && /^https?:\/\//.test(site) ? site : currentUrl.origin;
  return new URL(currentUrl.pathname, base).toString();
}

export function buildHrefLangs(currentUrl: URL, pathWithoutLang: string): { code: string; href: string }[] {
  const site = new URL(import.meta.env.SITE || currentUrl.origin);
  const base = import.meta.env.BASE_URL || currentUrl.pathname.split('/').slice(0, 2).join('/');
  return publicLocales.map((l) => {
    const href = new URL(`${base}/${l.code}/${pathWithoutLang}`.replace(/\/+/, '/'), site);
    return { code: l.code, href: href.toString() };
  });
}

export function ogTags(meta: HeadMeta) {
  return `
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:url" content="${meta.url}" />
    ${meta.image ? `<meta property="og:image" content="${meta.image}" />` : ''}
    <meta property="og:locale" content="${meta.locale.replace('-', '_')}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    ${meta.image ? `<meta name="twitter:image" content="${meta.image}" />` : ''}
  `;
}

export function jsonLdOrganization(meta: { name: string; url: string; logo?: string }) {
  let origin = '';
  try {
    origin = new URL(meta.url).origin;
  } catch {
    origin = '';
  }

  const sameAsCandidates: string[] = [];
  if (SOCIAL_LINKS && typeof SOCIAL_LINKS === 'object') {
    const s: any = SOCIAL_LINKS as any;
    if (s.channel) sameAsCandidates.push(String(s.channel));
    if (s.group) sameAsCandidates.push(String(s.group));
    if (s.x) sameAsCandidates.push(String(s.x));
    if (s.youtube) sameAsCandidates.push(String(s.youtube));
  }
  const sameAs: string[] = [];
  const seen: Record<string, true> = Object.create(null);
  for (let i = 0; i < sameAsCandidates.length; i++) {
    const v = sameAsCandidates[i];
    if (v && !seen[v]) {
      seen[v] = true;
      sameAs.push(v);
    }
  }

  const defaultLogo = origin ? `${origin}/logo-512.png` : '';
  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: meta.name,
    url: meta.url
  };
  const logo = meta.logo || defaultLogo;
  if (logo) data.logo = logo;
  if (sameAs.length > 0) data.sameAs = sameAs;
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

export function jsonLdBreadcrumbList(items: { name: string; url: string }[]) {
  const list: any[] = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it || !it.name || !it.url) continue;
    list.push({
      '@type': 'ListItem',
      position: list.length + 1,
      name: it.name,
      item: it.url
    });
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list
  };
  return JSON.stringify(data);
}

export function escapeHtml(str: string): string {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}


