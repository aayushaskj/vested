import type { Metadata } from "next";
import { LrsTcsCalculator } from "@/components/calc/LrsTcsCalculator";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "LRS & TCS calculator — 20% TCS above ₹10 lakh",
  description:
    "Compute the 20% TCS on LRS remittances above ₹10 lakh and how much actually lands at your US broker.",
  alternates: { canonical: "/tools/lrs-tcs-calculator" },
  openGraph: {
    title: "LRS & TCS calculator",
    description:
      "Compute 20% TCS on LRS remittances above ₹10 lakh and the net amount that lands abroad.",
    url: `${SITE_URL}/tools/lrs-tcs-calculator`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/lrs-tcs-calculator", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-us">US Investing</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          LRS & TCS calculator
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Compute the Tax Collected at Source on your LRS remittance, given
          how much you've already remitted this financial year. Net amount
          shown is what actually lands at your US broker.
        </p>
      </header>
      <div className="mt-8">
        <LrsTcsCalculator />
      </div>
    </div>
  );
}
