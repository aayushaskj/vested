export const SITE_URL = "https://vested.blog";
export const SITE_NAME = "Vested";
export const SITE_TAGLINE = "US investing & RSUs for Indians";
export const SITE_DESCRIPTION =
  "Practical guides on US investing, RSU management, LRS, and Indian tax for residents. No US-centric fluff.";
export const SITE_AUTHOR = "Vested";
export const SITE_LOCALE = "en_IN";
export const SITE_LANG = "en-IN";

export function postUrl(slug: string): string {
  return `${SITE_URL}/posts/${slug}`;
}

export function categoryUrl(slug: string): string {
  return `${SITE_URL}/category/${slug}`;
}

export function ogImageUrl(slug?: string): string {
  // Per-slug static route — each post has its own pre-rendered PNG so the
  // CDN doesn't conflate them.
  return slug ? `/api/og-card/${slug}` : "/og-default.png";
}

export function ogImageUrlTool(slug: string): string {
  return `/api/og-card-tool/${slug}`;
}

export function ogImageUrlAuthor(slug: string): string {
  return `/api/og-card-author/${slug}`;
}
