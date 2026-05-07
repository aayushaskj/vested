import type { Metadata } from "next";
import { ScheduleFaHelper } from "@/components/calc/ScheduleFaHelper";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Schedule FA helper for Indian residents",
  description:
    "Compute initial value, peak value, and closing balance in INR for foreign-asset disclosure (Schedule FA) on your ITR.",
  alternates: { canonical: "/tools/schedule-fa-helper" },
  openGraph: {
    title: "Schedule FA helper",
    description:
      "Compute peak value and closing balance in INR for Schedule FA disclosure.",
    url: `${SITE_URL}/tools/schedule-fa-helper`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <span className="badge-us">US Investing</span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Schedule FA helper
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Schedule FA wants peak value, closing balance, and total income for
          each foreign asset — all in INR. This calculator does the conversion
          using the rates you supply (use SBI TT-buying on each date).
        </p>
      </header>
      <div className="mt-8">
        <ScheduleFaHelper />
      </div>
    </div>
  );
}
