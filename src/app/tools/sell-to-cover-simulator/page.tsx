import type { Metadata } from "next";
import { SellToCoverSimulator } from "@/components/calc/SellToCoverSimulator";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sell-to-cover simulator (RSU outcomes)",
  description:
    "Project net shares retained after sell-to-cover, plus stock-up and stock-down scenarios over the next 12 months.",
  alternates: { canonical: "/tools/sell-to-cover-simulator" },
  openGraph: {
    title: "Sell-to-cover simulator",
    description:
      "Net shares after sell-to-cover, plus stock-up / stock-down scenarios.",
    url: `${SITE_URL}/tools/sell-to-cover-simulator`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/sell-to-cover-simulator", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-rsu">RSU Management</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Sell-to-cover simulator
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Sell-to-cover happens at vest-day price, but the stock keeps moving.
          This tool shows what your retained shares are worth in three
          scenarios: flat, +20%, and −20% over the next 12 months.
        </p>
      </header>
      <div className="mt-8">
        <SellToCoverSimulator />
      </div>
    </div>
  );
}
