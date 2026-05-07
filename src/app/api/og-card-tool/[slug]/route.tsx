import { ImageResponse } from "next/og";
import { CALCULATORS, getCalculator } from "@/lib/calculators";

export const runtime = "nodejs";
// Pre-render one OG card per calculator at build time. Each tool URL is a
// separate static asset, so the CDN cache + per-slug content can co-exist.
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }));
}

const CATEGORY_KICKER: Record<string, string> = {
  rsu: "RSU & EQUITY COMP",
  tax: "TAX",
  investing: "INVESTING",
  planning: "PLANNING",
};

/**
 * Magazine-cover OG image for a calculator page.
 *
 * Layout (1200×630):
 *   - Dark navy background (matches post OG cards)
 *   - Top: green tracked-out kicker — calculator's category (e.g. "TAX")
 *   - Center: HUGE calculator name (auto-sized to fit)
 *   - Below name: green tracked label "FREE CALCULATOR · INDIAN RULES"
 *   - Description below in soft white
 *   - Footer: vested.blog · FOR INDIAN RESIDENTS
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const calc = getCalculator(slug);

  const name = calc?.title ?? "Vested Calculator";
  const description = calc?.description ?? "Free calculators for Indian residents.";
  const kicker = calc ? CATEGORY_KICKER[calc.category] : "CALCULATORS";

  // Adaptive sizing for the calculator name
  const nameLen = name.length;
  const nameFontSize =
    nameLen <= 22 ? 96 : nameLen <= 32 ? 80 : nameLen <= 44 ? 64 : 54;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0b1018",
          backgroundImage:
            "radial-gradient(ellipse at top left, rgba(37,99,235,0.20), transparent 55%), radial-gradient(ellipse at bottom right, rgba(16,185,129,0.18), transparent 60%)",
          padding: "0",
          position: "relative",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Subtle grid */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.06,
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Top kicker */}
        <div
          style={{
            display: "flex",
            padding: "70px 80px 0 80px",
            fontSize: 24,
            letterSpacing: "0.18em",
            color: "rgba(52,211,153,0.95)",
            fontWeight: 600,
          }}
        >
          fx | {kicker}
        </div>

        {/* Center: hero name + concept label, stacked */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "0 80px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: nameFontSize,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              fontWeight: 700,
              backgroundImage:
                "linear-gradient(180deg, #ffffff 0%, #d8dde5 100%)",
              backgroundClip: "text",
              color: "transparent",
              maxWidth: 1040,
            }}
          >
            {name}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 26,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.35,
              maxWidth: 980,
            }}
          >
            {description.length > 130
              ? description.slice(0, 130) + "…"
              : description}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: 20,
              letterSpacing: "0.18em",
              fontWeight: 600,
              color: "rgba(96,165,250,0.95)",
            }}
          >
            FREE | INDIAN TAX RULES | LIVE USD/INR
          </div>
        </div>

        {/* Footer wordmark */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 80px 60px 80px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.02em",
              fontWeight: 600,
            }}
          >
            vested.blog/tools
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.18em",
              fontWeight: 500,
            }}
          >
            FOR INDIAN RESIDENTS
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
