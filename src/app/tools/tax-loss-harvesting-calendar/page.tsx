import type { Metadata } from "next";
import { TaxLossHarvestingCalendar } from "@/components/calc/TaxLossHarvestingCalendar";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tax-loss harvesting calendar (foreign equity)",
  description:
    "Find the best dates to realize losses across your foreign-equity lots, given Indian holding-period rules.",
  alternates: { canonical: "/tools/tax-loss-harvesting-calendar" },
  openGraph: {
    title: "Tax-loss harvesting calendar",
    description:
      "Best dates to realize losses across foreign-equity lots, with Indian rules.",
    url: `${SITE_URL}/tools/tax-loss-harvesting-calendar`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/tax-loss-harvesting-calendar", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-us">US Investing</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Tax-loss harvesting calendar
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          For foreign equity, short-term losses (under 24 months) can offset
          any capital gains; long-term losses can only offset long-term gains.
          Add lots to find the optimal harvest window.
        </p>
      </header>
      <div className="mt-8">
        <TaxLossHarvestingCalendar />
      </div>
    </div>
  );
}
