import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";
import type { Post } from "@/lib/posts";

/**
 * Maps post tags / category to the most relevant calculator(s).
 * Priority order matters — the first match wins.
 */
const TAG_TO_CALC: { tags: string[]; slugs: string[] }[] = [
  { tags: ["form-67", "ftc"], slugs: ["form-67-ftc-calculator"] },
  { tags: ["lrs", "tcs", "remittance"], slugs: ["lrs-tcs-calculator"] },
  { tags: ["espp"], slugs: ["espp-roi-calculator"] },
  { tags: ["stock-options", "iso", "nso"], slugs: ["stock-options-calculator"] },
  { tags: ["concentration-risk"], slugs: ["rsu-concentration-tracker"] },
  { tags: ["schedule-fa"], slugs: ["schedule-fa-helper"] },
  { tags: ["w-8ben"], slugs: ["form-67-ftc-calculator"] },
  { tags: ["repatriation", "withdrawal"], slugs: ["repatriation-cost-calculator"] },
  { tags: ["currency", "fx", "hedging"], slugs: ["currency-hedge-calculator"] },
  { tags: ["holding-period"], slugs: ["holding-period-checker"] },
  { tags: ["nri", "returning-resident", "rnor", "relocation"], slugs: ["rnor-window-calculator"] },
  {
    tags: ["capital-gains", "ltcg", "stcg"],
    slugs: ["us-capital-gains-calculator", "holding-period-checker"],
  },
  {
    tags: ["sell-to-cover", "vesting", "perquisite", "withholding"],
    slugs: ["sell-to-cover-simulator", "rsu-calculator"],
  },
  {
    tags: ["rsu", "compensation", "negotiation"],
    slugs: ["rsu-calculator", "rsu-concentration-tracker"],
  },
  {
    tags: ["etfs", "vti", "voo", "qqq", "portfolio", "asset-allocation"],
    slugs: ["us-etf-sip-calculator", "indian-vs-direct-us-calculator"],
  },
  { tags: ["indian-mutual-funds", "ppfas", "motilal-oswal"], slugs: ["indian-vs-direct-us-calculator"] },
  { tags: ["tax", "form-67"], slugs: ["form-67-ftc-calculator", "us-capital-gains-calculator"] },
];

/** Pick up to 2 matching calculators for a post. */
function pickCalculatorsForPost(post: Post): typeof CALCULATORS {
  const tags = (post.tags ?? []).map((t) => t.toLowerCase());
  const matched: string[] = [];
  for (const rule of TAG_TO_CALC) {
    if (rule.tags.some((t) => tags.includes(t.toLowerCase()))) {
      for (const s of rule.slugs) {
        if (!matched.includes(s) && matched.length < 2) matched.push(s);
      }
    }
    if (matched.length >= 2) break;
  }
  return matched
    .map((slug) => CALCULATORS.find((c) => c.slug === slug))
    .filter((c): c is (typeof CALCULATORS)[number] => Boolean(c));
}

export function PostCalculatorCTA({ post }: { post: Post }) {
  const calcs = pickCalculatorsForPost(post);
  if (calcs.length === 0) return null;
  return (
    <section className="mt-10 rounded-2xl border border-brand-100 bg-brand-50/50 p-5 sm:p-6">
      <p className="text-xs uppercase tracking-wider text-brand-700">
        Run your own numbers
      </p>
      <h2 className="mt-2 font-display text-base font-semibold text-ink-900 sm:text-lg">
        {calcs.length === 1
          ? "Try the calculator that matches this post"
          : "Try the calculators that match this post"}
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {calcs.map((c) => (
          <li key={c.slug}>
            <Link
              href={c.href}
              className="group flex items-start gap-3 rounded-xl bg-white p-4 transition hover:bg-ink-50"
            >
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 text-xs font-bold text-white"
              >
                ƒx
              </span>
              <span className="flex-1">
                <span className="block font-display text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                  {c.title} →
                </span>
                <span className="block text-xs text-ink-600">
                  {c.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
