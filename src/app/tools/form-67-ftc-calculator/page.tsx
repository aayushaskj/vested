import type { Metadata } from "next";
import { Form67Calculator } from "@/components/calc/Form67Calculator";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Form 67 / FTC calculator — US dividend FTC",
  description:
    "Compute the foreign tax credit available to Indian residents on US dividends, and the net Indian tax owed.",
  alternates: { canonical: "/tools/form-67-ftc-calculator" },
  openGraph: {
    title: "Form 67 / FTC calculator",
    description:
      "Foreign tax credit on US dividends + net Indian tax owed for Indian residents.",
    url: `${SITE_URL}/tools/form-67-ftc-calculator`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/form-67-ftc-calculator", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-us">US Investing</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Form 67 / FTC calculator
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Compute foreign tax credit available on US dividends and net Indian
          tax owed. The FTC is capped at the lower of US tax paid or Indian
          tax payable — this calculator does the math.
        </p>
      </header>
      <div className="mt-8">
        <Form67Calculator />
      </div>
    </div>
  );
}
