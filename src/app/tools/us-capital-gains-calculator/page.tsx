import type { Metadata } from "next";
import { UsCapGainsCalculator } from "@/components/calc/UsCapGainsCalculator";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "US capital gains calculator (INR) for Indian residents",
  description:
    "STCG vs LTCG, the 24-month rule, and Indian tax on US stock sales with currency conversion baked in.",
  alternates: { canonical: "/tools/us-capital-gains-calculator" },
  openGraph: {
    title: "US capital gains calculator (INR)",
    description:
      "STCG vs LTCG, 24-month rule, and Indian tax on US stock sales with currency conversion.",
    url: `${SITE_URL}/tools/us-capital-gains-calculator`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/us-capital-gains-calculator", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-us">US Investing</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          US capital gains calculator (INR)
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Indian capital gains tax on US stocks and ETFs, computed in INR. The
          tool classifies your sale as STCG (≤24 months) or LTCG (&gt;24 months)
          and applies the right rate.
        </p>
      </header>
      <div className="mt-8">
        <UsCapGainsCalculator />
      </div>
    </div>
  );
}
