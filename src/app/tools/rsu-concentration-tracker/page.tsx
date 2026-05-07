import type { Metadata } from "next";
import { ConcentrationTracker } from "@/components/calc/ConcentrationTracker";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "RSU concentration risk tracker for Indians",
  description:
    "Project single-stock concentration as RSUs vest and accumulate. See when concentration crosses risk thresholds.",
  alternates: { canonical: "/tools/rsu-concentration-tracker" },
  openGraph: {
    title: "RSU concentration tracker",
    description:
      "Project single-stock concentration as RSUs vest and accumulate.",
    url: `${SITE_URL}/tools/rsu-concentration-tracker`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/rsu-concentration-tracker", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-rsu">RSU Management</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          RSU concentration risk tracker
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Most concentrated RSU holders never made a deliberate decision to
          end up that way — it just compounded from sell-to-cover defaults.
          This tool shows where you are, and where 4 quarterly vests will
          take you under different sell strategies.
        </p>
      </header>
      <div className="mt-8">
        <ConcentrationTracker />
      </div>
    </div>
  );
}
