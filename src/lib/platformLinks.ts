/**
 * Referral / install links for the platforms we cover.
 *
 * Single source of truth. Update here and the change flows through every
 * MDX post that references them.
 *
 * The MDX `a` component (see src/components/mdxComponents.tsx) auto-detects
 * these affiliate hostnames and adds `rel="sponsored noopener noreferrer"`,
 * per Google's recommended attribute for affiliate/referral links.
 */
export const PLATFORM_LINKS = {
  vested: "https://refer.vestedfinance.com/AAJA82006",
  indmoney: "https://indmoney.onelink.me/RmHC/rgupa7ir",
  ibkr: "https://ibkr.com/referral/aayush858",
  rovia: "https://rovia.onelink.me/xOtI/c29h3ped",
} as const;

/**
 * Hostnames / URL fragments that mark a link as an affiliate / referral.
 * Used by the MDX `a` component to apply `rel="sponsored"`.
 */
export const AFFILIATE_URL_PATTERNS = [
  "onelink.me",
  "refer.vestedfinance.com",
  "ibkr.com/referral",
] as const;

export function isAffiliateUrl(href: string): boolean {
  return AFFILIATE_URL_PATTERNS.some((pattern) => href.includes(pattern));
}
