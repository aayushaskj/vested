import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Legacy redirect: the per-post OG image route moved to
 * /api/og-card/[slug] so each slug becomes its own static asset
 * (avoids CDN-cache conflation between slugs).
 *
 * Old social-share links of the form /api/og?slug=X get a 308 redirect
 * to /api/og-card/X. Calls without a slug get the generic default OG.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const target = slug ? `/api/og-card/${slug}` : "/og-default.png";
  return NextResponse.redirect(new URL(target, request.url), {
    status: 308,
  });
}
