import { NextResponse } from "next/server";
import { countSubscribers } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/subscribe/health
 *
 * Quick diagnostic: confirms the Neon DB is reachable, the subscriptions
 * table exists, and reports current row count. Useful when debugging "why
 * isn't the form storing emails?" — hit this URL and you get an immediate
 * pass/fail with a concrete error message instead of digging through Vercel
 * Function Logs.
 *
 * Returns 200 + { ok: true, count } if healthy.
 * Returns 500 + { ok: false, error } if anything fails.
 */
export async function GET() {
  const hasDbUrl = Boolean(
    process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL
  );

  try {
    const count = await countSubscribers();
    return NextResponse.json({
      ok: true,
      hasDbUrl,
      subscribers: count,
      driver: "@neondatabase/serverless",
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        hasDbUrl,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
