import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { extractOgHook } from "@/lib/og-extract";

export const runtime = "nodejs";
// One pre-rendered PNG per post slug at build time. Each post URL is a
// separate static asset, so the CDN cache + per-slug content can co-exist.
export const dynamic = "force-static";
export const dynamicParams = false;

/**
 * Pre-render an OG image for every post slug at build time.
 */
export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

/**
 * Magazine-cover OG image for a specific post slug.
 *
 * Layout (1200×630):
 *   - Dark navy background with a faint gradient + grain
 *   - HUGE hook number/phrase, vertically centered
 *   - Tiny accent dot above the hook
 *   - Small uppercase concept label below the hook
 *   - Optional context line in small text above the hook
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  let hook = "Vested";
  let label = "US INVESTING & RSUs";
  let context: string | null = null;

  if (post) {
    const extracted = extractOgHook(post);
    hook = extracted.hook;
    label = extracted.label.toUpperCase();
    context = extracted.context ?? null;
  }

  // Adaptive sizing
  const hookLen = hook.length;
  const hookFontSize =
    hookLen <= 5
      ? 280
      : hookLen <= 8
        ? 230
        : hookLen <= 12
          ? 180
          : hookLen <= 18
            ? 130
            : 96;

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
            "radial-gradient(ellipse at top left, rgba(37,99,235,0.18), transparent 55%), radial-gradient(ellipse at bottom right, rgba(16,185,129,0.16), transparent 60%)",
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

        {context && (
          <div
            style={{
              display: "flex",
              padding: "70px 80px 0 80px",
              fontSize: 26,
              letterSpacing: "0.02em",
              color: "rgba(255,255,255,0.55)",
              fontWeight: 500,
              maxWidth: 1040,
              lineHeight: 1.3,
            }}
          >
            {context}
          </div>
        )}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 60px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "linear-gradient(135deg, #34d399, #2563eb)",
              marginBottom: 36,
            }}
          />

          <div
            style={{
              display: "flex",
              fontSize: hookFontSize,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              fontWeight: 700,
              backgroundImage:
                "linear-gradient(180deg, #ffffff 0%, #d8dde5 100%)",
              backgroundClip: "text",
              color: "transparent",
              textAlign: "center",
              maxWidth: 1080,
            }}
          >
            {hook}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: 28,
              letterSpacing: "0.18em",
              fontWeight: 600,
              color: "rgba(52,211,153,0.95)",
              textAlign: "center",
              maxWidth: 1000,
            }}
          >
            {label}
          </div>
        </div>

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
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.02em",
              fontWeight: 500,
            }}
          >
            vested.blog
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
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
    {
      width: 1200,
      height: 630,
    }
  );
}
