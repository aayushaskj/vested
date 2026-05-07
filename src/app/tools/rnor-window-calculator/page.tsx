import type { Metadata } from "next";
import { RnorWindowCalculator } from "@/components/calc/RnorWindowCalculator";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "RNOR window calculator (NRIs returning to India)",
  description:
    "When does your RNOR status start and end if you return to India on a given date? The 2-year tax-friendly window for NRIs returning home.",
  alternates: { canonical: "/tools/rnor-window-calculator" },
  openGraph: {
    title: "RNOR window calculator",
    description:
      "When does your RNOR status start and end? The 2-year planning window for returning NRIs.",
    url: `${SITE_URL}/tools/rnor-window-calculator`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-rsu">RSU Management</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          RNOR window calculator
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          NRIs returning to India usually qualify for "Resident but Not
          Ordinarily Resident" (RNOR) status for 2 years. Foreign-source
          income is mostly tax-free during RNOR. This tool maps the window.
        </p>
      </header>
      <div className="mt-8">
        <RnorWindowCalculator />
      </div>
    </div>
  );
}
