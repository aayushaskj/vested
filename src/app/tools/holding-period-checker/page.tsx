import type { Metadata } from "next";
import { HoldingPeriodChecker } from "@/components/calc/HoldingPeriodChecker";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Holding period checker — when does my asset cross LTCG?",
  description:
    "Given an acquisition date, when does an asset cross the LTCG threshold for its asset class (Indian listed, US equity, gold, real estate, etc.)?",
  alternates: { canonical: "/tools/holding-period-checker" },
  openGraph: {
    title: "Holding period checker",
    description:
      "When does your asset cross the LTCG threshold for its asset class?",
    url: `${SITE_URL}/tools/holding-period-checker`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/holding-period-checker", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-rsu">RSU Management</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Holding period checker
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Different asset classes cross the LTCG threshold at different
          months. Tell this tool what you bought and when, and it tells you
          the exact day you cross into long-term territory.
        </p>
      </header>
      <div className="mt-8">
        <HoldingPeriodChecker />
      </div>
    </div>
  );
}
