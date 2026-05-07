import type { Metadata } from "next";
import { IndianVsDirectUsCalculator } from "@/components/calc/IndianVsDirectUsCalculator";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Indian funds vs direct US ETFs (cost comparison)",
  description:
    "Compare 20-year wealth from PPFAS, MOSL Nasdaq FoF, and direct US ETFs (VTI) via LRS — with expense ratios baked in.",
  alternates: { canonical: "/tools/indian-vs-direct-us-calculator" },
  openGraph: {
    title: "Indian funds vs direct US (cost comparison)",
    description:
      "20-year wealth comparison: PPFAS vs MOSL Nasdaq vs direct VTI via LRS.",
    url: `${SITE_URL}/tools/indian-vs-direct-us-calculator`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/indian-vs-direct-us-calculator", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-us">US Investing</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Indian funds vs direct US ETFs
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Compare 20-year wealth across three routes: PPFAS Flexi Cap, MOSL
          Nasdaq 100 FoF, and direct US ETFs (VTI) via LRS. Expense-ratio drag
          baked in.
        </p>
      </header>
      <div className="mt-8">
        <IndianVsDirectUsCalculator />
      </div>
    </div>
  );
}
