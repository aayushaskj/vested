import { NextResponse } from "next/server";
import { listSubscribers } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthenticated(headerValue: string | null): boolean {
  if (!headerValue || !headerValue.startsWith("Basic ")) return false;
  const expectedUser = process.env.ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) return false;
  try {
    const decoded = Buffer.from(headerValue.slice(6), "base64").toString();
    const idx = decoded.indexOf(":");
    if (idx === -1) return false;
    return (
      decoded.slice(0, idx) === expectedUser &&
      decoded.slice(idx + 1) === expectedPass
    );
  } catch {
    return false;
  }
}

function csvEscape(value: string | null | undefined): string {
  if (value == null) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: Request) {
  if (!isAuthenticated(req.headers.get("authorization"))) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="vested-admin"' },
    });
  }

  try {
    const subs = await listSubscribers(50_000);
    const header = ["id", "email", "source", "created_at", "user_agent", "referrer"];
    const lines = [header.join(",")];
    for (const s of subs) {
      lines.push(
        [
          s.id,
          csvEscape(s.email),
          csvEscape(s.source),
          csvEscape(s.created_at),
          csvEscape(s.user_agent),
          csvEscape(s.referrer),
        ].join(",")
      );
    }
    const body = lines.join("\n");
    const filename = `vested-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}
