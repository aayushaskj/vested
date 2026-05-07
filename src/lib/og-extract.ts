import type { Post } from "@/lib/posts";

interface OgHookResult {
  hook: string;
  label: string;
  context?: string;
}

/**
 * Decide what to put on the magazine-cover OG image for a given post.
 *
 * Priority:
 *   1. Explicit ogHook + ogLabel in frontmatter — always wins.
 *   2. First prominent figure in content (₹, %, $, x-multiplier).
 *   3. Fallback: post title (truncated) + category as label.
 */
export function extractOgHook(post: Post): OgHookResult {
  if (post.ogHook && post.ogLabel) {
    return {
      hook: post.ogHook,
      label: post.ogLabel,
      context: post.ogContext,
    };
  }

  // Try to extract from content
  const auto = autoExtract(post.content);
  if (auto) {
    return {
      hook: auto,
      label: post.tags?.[0]?.toUpperCase() ?? post.category.toUpperCase(),
      context: post.ogContext,
    };
  }

  // Fallback: short title + category
  const fallbackHook = post.title.length > 40
    ? post.title.slice(0, 38) + "…"
    : post.title;
  return {
    hook: fallbackHook,
    label: post.category === "us-investing" ? "US INVESTING" : "RSU MGMT",
    context: post.ogContext,
  };
}

const RUPEE_AMOUNT = /₹\s*[\d,.]+\s*(?:lakh|crore|cr|L)?/gi;
const PCT = /\b\d+(?:\.\d+)?\s*%/g;
const USD_AMOUNT = /\$\s*[\d,.]+(?:k|K|M|B)?/g;
const MULTIPLIER = /\b\d+\s*[xX]\b/g;
const MONTHS = /\b(?:12|24|36|6|18)\s*months?\b/gi;

function autoExtract(content: string): string | null {
  // Score patterns by "interestingness" — bigger, rarer numbers win
  const candidates: { value: string; score: number }[] = [];

  for (const m of content.match(RUPEE_AMOUNT) ?? []) {
    candidates.push({
      value: m.replace(/\s+/g, "").replace(/lakh/i, "L").replace(/crore|cr/i, "Cr"),
      score: 5 + (m.length > 8 ? 2 : 0),
    });
  }
  for (const m of content.match(PCT) ?? []) {
    candidates.push({ value: m.replace(/\s+/g, ""), score: 4 });
  }
  for (const m of content.match(USD_AMOUNT) ?? []) {
    candidates.push({ value: m.replace(/\s+/g, ""), score: 3 });
  }
  for (const m of content.match(MULTIPLIER) ?? []) {
    candidates.push({ value: m.replace(/\s+/g, ""), score: 2 });
  }
  for (const m of content.match(MONTHS) ?? []) {
    candidates.push({ value: m.toLowerCase(), score: 2 });
  }

  if (candidates.length === 0) return null;

  // Prefer earliest interesting hit (probably part of the lede)
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].value;
}
