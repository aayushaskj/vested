import type { Metadata } from "next";
import { OldVsNewRegimeCalculator } from "@/components/calc/OldVsNewRegimeCalculator";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Old vs new tax regime calculator (with foreign income)",
  description:
    "Compare Indian old vs new regime tax for someone with foreign salary, dividends, or RSU income.",
  alternates: { canonical: "/tools/old-vs-new-tax-regime" },
  openGraph: {
    title: "Old vs new tax regime calculator",
    description:
      "Compare Indian old vs new regime tax — including foreign income.",
    url: `${SITE_URL}/tools/old-vs-new-tax-regime`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/old-vs-new-tax-regime", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-rsu">RSU Management</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Old vs new tax regime
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Most regime calculators don't model foreign income (RSU vests,
          dividends). This one does. Slabs, surcharges, and cess for both
          regimes — including FY 2025-26 new-regime rates.
        </p>
      </header>
      <div className="mt-8">
        <OldVsNewRegimeCalculator />
      </div>
    </div>
  );
}
