import { ImageResponse } from "next/og";
import { getAllAuthors, getAuthor } from "@/lib/authors";

export const runtime = "nodejs";
// Pre-render one OG card per author at build time.
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

/**
 * Magazine-cover OG image for an author profile page.
 *
 * Layout (1200×630):
 *   - Dark navy background with subtle radial gradients (matches post + tool OG)
 *   - Top: green tracked-out kicker — "AUTHOR · VESTED"
 *   - Center: HUGE author name
 *   - Below: role line in soft white
 *   - Below role: top affiliations as tracked-out tags
 *   - Footer: vested.blog/authors · FOR INDIAN RESIDENTS
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const author = getAuthor(slug);

  const name = author?.name ?? "Vested Author";
  const role = author?.role ?? "Writes about US investing & RSUs";

  // Pull up to 3 affiliation names — these are the trust signals
  const affiliations = (author?.affiliations ?? [])
    .map((a) => a.name)
    .slice(0, 3);

  // Adaptive sizing for the author name
  const nameLen = name.length;
  const nameFontSize =
    nameLen <= 14 ? 112 : nameLen <= 20 ? 96 : nameLen <= 28 ? 80 : 64;

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
            letterSpacing: "0.22em",
            color: "rgba(52,211,153,0.95)",
            fontWeight: 600,
          }}
        >
          AUTHOR | VESTED
        </div>

        {/* Center: name + role + affiliations */}
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
              lineHeight: 1.0,
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
              fontSize: 28,
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.35,
              maxWidth: 980,
            }}
          >
            {role}
          </div>

          {affiliations.length > 0 && (
            <div
              style={{
                display: "flex",
                marginTop: 36,
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              {affiliations.map((a) => (
                <div
                  key={a}
                  style={{
                    display: "flex",
                    fontSize: 18,
                    letterSpacing: "0.16em",
                    fontWeight: 600,
                    color: "rgba(96,165,250,0.95)",
                    border: "1px solid rgba(96,165,250,0.45)",
                    borderRadius: 999,
                    padding: "8px 18px",
                    textTransform: "uppercase",
                  }}
                >
                  {a}
                </div>
              ))}
            </div>
          )}
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
            vested.blog/authors
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
