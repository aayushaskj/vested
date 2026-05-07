import type { Metadata } from "next";
import { UsEtfSipCalculator } from "@/components/calc/UsEtfSipCalculator";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "US ETF SIP calculator (INR + USD projection)",
  description:
    "Project a multi-year US ETF SIP corpus in both INR and USD with rupee depreciation factored in.",
  alternates: { canonical: "/tools/us-etf-sip-calculator" },
  openGraph: {
    title: "US ETF SIP calculator",
    description:
      "Project a multi-year US ETF SIP corpus with rupee depreciation factored in.",
    url: `${SITE_URL}/tools/us-etf-sip-calculator`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/us-etf-sip-calculator", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-us">US Investing</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          US ETF SIP calculator
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Project a long-term SIP into US ETFs (VTI, VOO, QQQM) with rupee
          depreciation factored in. Shows both USD and INR-equivalent corpus.
        </p>
      </header>
      <div className="mt-8">
        <UsEtfSipCalculator />
      </div>
    </div>
  );
}
