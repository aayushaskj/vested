import { ShareButtons } from "@/components/ShareButtons";

/**
 * Layout for all /tools/* routes. Adds a sitewide share-this-calculator
 * footer below every calculator page automatically.
 */
export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className="container-wide pb-16">
        <div className="mt-12 rounded-2xl border border-ink-100 bg-ink-50/40 p-5 sm:p-6">
          <h3 className="font-display text-base font-semibold text-ink-900">
            Useful? Pass it on.
          </h3>
          <p className="mt-1 text-sm text-ink-500">
            If this calculator saved you a tab full of broken Indian-tax
            templates, share it with someone else who'd benefit.
          </p>
          <div className="mt-4">
            <ShareButtons
              title="Free calculators for Indian residents — Vested"
              description="RSU, LRS/TCS, Form 67, capital gains, and more. Built around Indian tax rules."
            />
          </div>
        </div>
      </div>
    </>
  );
}
