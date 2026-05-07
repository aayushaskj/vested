import type { Metadata } from "next";
import { EsppRoiCalculator } from "@/components/calc/EsppRoiCalculator";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ESPP ROI calculator for Indian residents",
  description:
    "Calculate your ESPP return after the 15% discount, lookback feature, and Indian perquisite tax on the discount.",
  alternates: { canonical: "/tools/espp-roi-calculator" },
  openGraph: {
    title: "ESPP ROI calculator",
    description:
      "ESPP return after the 15% discount, lookback, and Indian perquisite tax.",
    url: `${SITE_URL}/tools/espp-roi-calculator`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/espp-roi-calculator", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-rsu">RSU Management</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          ESPP ROI calculator
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          See your true ESPP return after the discount, the lookback feature,
          and Indian perquisite tax on the discount. Quick-sell at purchase
          assumed (no further capital gains).
        </p>
      </header>
      <div className="mt-8">
        <EsppRoiCalculator />
      </div>
    </div>
  );
}
