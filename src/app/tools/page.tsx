import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Calculators for US investing & RSUs (Indian residents)",
  description:
    "Free calculators for Indian residents: RSU take-home, LRS/TCS, US capital gains, Form 67, ESPP, Schedule FA — all built for Indian tax rules.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: `Calculators · ${SITE_NAME}`,
    description:
      "Free calculators for Indian residents: RSU, LRS/TCS, US capital gains, Form 67, and more.",
    url: `${SITE_URL}/tools`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

const CATEGORY_LABEL: Record<string, string> = {
  rsu: "RSU & equity comp",
  tax: "Tax",
  investing: "Investing",
  planning: "Planning",
};

export default function ToolsIndexPage() {
  const grouped: Record<string, typeof CALCULATORS> = {};
  for (const c of CALCULATORS) {
    if (!grouped[c.category]) grouped[c.category] = [];
    grouped[c.category].push(c);
  }
  const order = ["rsu", "tax", "investing", "planning"];

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: CALCULATORS.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${c.href}`,
      name: c.title,
    })),
  };

  return (
    <div className="container-wide py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-accent-700">Calculators</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Tools for cross-border investing
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          {CALCULATORS.length} free calculators for Indian residents — RSU
          taxes, LRS/TCS, US capital gains, Form 67 FTC, and more. All math
          uses live USD/INR where applicable.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {order.map((cat) => {
          const list = grouped[cat] ?? [];
          if (list.length === 0) return null;
          return (
            <section key={cat}>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                {CATEGORY_LABEL[cat]}
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {list.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={c.href}
                      className="group block rounded-2xl border border-ink-100 bg-white p-5 transition hover:border-ink-200 hover:shadow-sm"
                    >
                      <h3 className="font-display text-base font-semibold text-ink-900 group-hover:text-brand-700">
                        {c.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-ink-600">
                        {c.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
