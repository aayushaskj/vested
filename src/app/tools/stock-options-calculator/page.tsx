import type { Metadata } from "next";
import { StockOptionsCalculator } from "@/components/calc/StockOptionsCalculator";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Stock options exercise calculator (NSO / ISO) for Indians",
  description:
    "Cash needed to exercise NSO or ISO options + Indian perquisite tax on the spread. Total cash burn at exercise.",
  alternates: { canonical: "/tools/stock-options-calculator" },
  openGraph: {
    title: "Stock options exercise calculator",
    description:
      "Cash needed to exercise + Indian perquisite tax on the spread.",
    url: `${SITE_URL}/tools/stock-options-calculator`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/stock-options-calculator", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-rsu">RSU Management</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Stock options exercise calculator
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          For NSOs and ISOs at US companies. Calculate the cash you need to
          exercise (strike payment) plus the Indian perquisite tax on the
          spread between FMV and strike. Both apply at exercise time.
        </p>
      </header>
      <div className="mt-8">
        <StockOptionsCalculator />
      </div>
    </div>
  );
}
