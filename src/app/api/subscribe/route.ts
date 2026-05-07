import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribeBody {
  email?: string;
  source?: string;
}

export async function POST(req: Request) {
  let body: SubscribeBody;
  try {
    body = (await req.json()) as SubscribeBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const source = (body.source ?? "unknown").slice(0, 64);
  const userAgent = req.headers.get("user-agent")?.slice(0, 512) ?? null;
  const referrer = req.headers.get("referer")?.slice(0, 1024) ?? null;

  try {
    const { inserted } = await addSubscriber({
      email,
      source,
      userAgent,
      referrer,
    });
    return NextResponse.json({ ok: true, alreadySubscribed: !inserted });
  } catch (err) {
    // Surface DB failures so we notice them. We still return a generic 500 to
    // the client so we don't leak DB internals, but log the full error for
    // Vercel Function Logs.
    console.error("[subscribe] DB error", {
      message: err instanceof Error ? err.message : String(err),
      email,
      source,
    });
    return NextResponse.json(
      { ok: false, error: "subscribe_failed" },
      { status: 500 }
    );
  }
}
