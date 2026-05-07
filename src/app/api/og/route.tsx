import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";
import { extractOgHook } from "@/lib/og-extract";

export const runtime = "nodejs";
// Per-post OG: needs to read the slug query param at request time, so we
// can't statically pre-render this. We do cache the response at the edge
// for 1 hour, with stale-while-revalidate for 24 hours, so per-slug
// rendering is cheap after the first request.
export const dynamic = "force-dynamic";

/**
 * Magazine-cover OG image.
 *
 * Layout (1200×630):
 *   - Dark navy background with a faint gradient + grain
 *   - HUGE hook number/phrase, centered horizontally, vertically biased to upper half
 *   - Tiny accent dot
 *   - Small uppercase concept label below the hook
 *   - Optional context line in small text above the hook (40-70 chars max)
 *
 * No logo, no author, no category badge. The art is the brand.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  let hook = "Vested";
  let label = "US INVESTING & RSUs";
  let context: string | null = null;

  if (slug) {
    const post = getPostBySlug(slug);
    if (post) {
      const extracted = extractOgHook(post);
      hook = extracted.hook;
      label = extracted.label.toUpperCase();
      context = extracted.context ?? null;
    }
  }

  // Adaptive sizing: longer hooks shrink down so they always fit.
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

        {/* Top "kicker" — small uppercase context (optional) */}
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

        {/* Center: hook + label, stacked */}
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
          {/* Tiny accent dot */}
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

          {/* The huge hook */}
          <div
            style={{
              display: "flex",
              fontSize: hookFontSize,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              fontWeight: 700,
              backgroundImage: "linear-gradient(180deg, #ffffff 0%, #d8dde5 100%)",
              backgroundClip: "text",
              color: "transparent",
              textAlign: "center",
              maxWidth: 1080,
            }}
          >
            {hook}
          </div>

          {/* Concept label */}
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

        {/* Footer strip — minimal mark, no logo, just a subtle wordmark for attribution */}
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
      headers: {
        // Cache at the edge for 1 hour, allow stale serving up to 1 day while
        // revalidating in the background. Per-slug responses are cheap to
        // generate so this is a great trade-off.
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
