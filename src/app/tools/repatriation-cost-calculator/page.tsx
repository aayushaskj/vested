import type { Metadata } from "next";
import { RepatriationCostCalculator } from "@/components/calc/RepatriationCostCalculator";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Repatriation cost calculator (US → India)",
  description:
    "Total cost of bringing US investment proceeds back to India: FX markup, wire fees, and capital gains tax.",
  alternates: { canonical: "/tools/repatriation-cost-calculator" },
  openGraph: {
    title: "Repatriation cost calculator",
    description:
      "Total cost of bringing US investment proceeds back to India.",
    url: `${SITE_URL}/tools/repatriation-cost-calculator`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-us">US Investing</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Repatriation cost calculator
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Bringing US investment proceeds back to India costs three things:
          capital gains tax, FX markup at your Indian bank, and wire fees.
          This calculator totals all three.
        </p>
      </header>
      <div className="mt-8">
        <RepatriationCostCalculator />
      </div>
    </div>
  );
}
