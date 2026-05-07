import type { Metadata } from "next";
import { RsuCalculator } from "@/components/RsuCalculator";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "RSU Calculator — vesting tax & take-home for Indians",
  description:
    "Estimate RSU take-home for Indian residents: gross USD value, INR perquisite tax, surcharge, and net rupees after sell-to-cover.",
  alternates: { canonical: "/tools/rsu-calculator" },
  openGraph: {
    title: "RSU Calculator for Indian residents",
    description:
      "Estimate RSU take-home as an Indian resident: perquisite tax, surcharge, cess, and net rupees in hand.",
    url: `${SITE_URL}/tools/rsu-calculator`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/api/og-card-tool/rsu-calculator", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RSU Calculator for Indian residents",
    description: "Estimate RSU take-home as an Indian resident.",
    images: ["/api/og-card-tool/rsu-calculator"],
  },
};

export default function RsuCalculatorPage() {
  return (
    <div className="container-wide py-16">
      <header className="max-w-2xl">
        <span className="badge-rsu">RSU Management</span>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          RSU Calculator
        </h1>
        <p className="mt-4 text-lg text-ink-600 leading-relaxed">
          Estimate the rupees in your hand after vesting an RSU tranche. Built
          for Indian residents holding US-listed RSUs from a multinational
          employer.
        </p>
        <p className="mt-3 text-sm text-ink-500">
          Educational tool. Numbers are estimates — your actual liability
          depends on your slab, surcharge, cess, and treaty position. Consult a
          CA before acting on any output.
        </p>
      </header>
      <div className="mt-10">
        <RsuCalculator />
      </div>
    </div>
  );
}
