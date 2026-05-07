import type { Metadata } from "next";
import { CurrencyHedgeCalculator } from "@/components/calc/CurrencyHedgeCalculator";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Currency hedge sizing calculator for Indians",
  description:
    "How much of your long-term portfolio should be in USD assets, given your USD-flavored expenses and retirement plans.",
  alternates: { canonical: "/tools/currency-hedge-calculator" },
  openGraph: {
    title: "Currency hedge sizing calculator",
    description:
      "How much USD allocation makes sense based on your USD-flavored expenses.",
    url: `${SITE_URL}/tools/currency-hedge-calculator`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/currency-hedge-calculator", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-us">US Investing</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Currency hedge sizing calculator
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Most Indians end up either too heavy or too light in USD assets.
          This tool sizes your USD allocation based on what you actually spend
          in USD-flavored ways — not vibes.
        </p>
      </header>
      <div className="mt-8">
        <CurrencyHedgeCalculator />
      </div>
    </div>
  );
}
