import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { listSubscribers, countSubscribers, type Subscriber } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Simple HTTP Basic Auth on the admin route.
 * Set ADMIN_USER and ADMIN_PASSWORD as Vercel env vars.
 */
function isAuthenticated(headerValue: string | null): boolean {
  if (!headerValue || !headerValue.startsWith("Basic ")) return false;
  const expectedUser = process.env.ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) return false;
  try {
    const decoded = Buffer.from(headerValue.slice(6), "base64").toString();
    const idx = decoded.indexOf(":");
    if (idx === -1) return false;
    const user = decoded.slice(0, idx);
    const pass = decoded.slice(idx + 1);
    return user === expectedUser && pass === expectedPass;
  } catch {
    return false;
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function AdminSubscribersPage() {
  const h = await headers();
  if (!isAuthenticated(h.get("authorization"))) {
    // Trigger browser auth dialog by responding with 401
    // Next.js doesn't have a clean idiom for this in a server component;
    // we return a page that asks the user to retry with auth.
    return (
      <div className="container-prose py-16">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Admin · Subscribers
        </h1>
        <p className="mt-3 text-ink-600">
          This page requires HTTP Basic auth. Configure ADMIN_USER and
          ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then
          access via{" "}
          <code className="rounded bg-ink-100 px-1 py-0.5 text-sm">
            https://USER:PASS@vested.blog/admin/subscribers
          </code>{" "}
          or use a browser that prompts for credentials. If you visited this
          page without credentials, your browser sent no Authorization header.
        </p>
        <p className="mt-3 text-sm text-ink-500">
          Tip: most modern browsers no longer prompt for HTTP Basic auth at the
          URL level. Use a dedicated tool like Hoppscotch / Postman, or use the{" "}
          <code className="rounded bg-ink-100 px-1 py-0.5 text-xs">curl</code>{" "}
          command:
          <br />
          <code className="mt-2 block rounded bg-ink-100 px-2 py-1 text-xs">
            curl -u USER:PASS https://vested.blog/admin/subscribers
          </code>
        </p>
      </div>
    );
  }

  let subs: Subscriber[] = [];
  let total = 0;
  let error: string | null = null;
  try {
    subs = await listSubscribers(2000);
    total = await countSubscribers();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <div className="container-wide py-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-500">
            Admin
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink-900">
            Subscribers
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {total.toLocaleString("en-IN")} total · showing latest{" "}
            {subs.length}
          </p>
        </div>
        <a
          href="/admin/subscribers/export.csv"
          className="inline-flex items-center justify-center rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:border-ink-300"
        >
          Download CSV
        </a>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <strong>Database error:</strong> {error}
          <br />
          Make sure DATABASE_URL is set in Vercel environment variables.
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Source</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Referrer</th>
            </tr>
          </thead>
          <tbody>
            {subs.length === 0 && !error && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-ink-500"
                >
                  No subscribers yet.
                </td>
              </tr>
            )}
            {subs.map((s) => (
              <tr key={s.id} className="border-t border-ink-100">
                <td className="px-4 py-2.5 font-mono text-xs text-ink-900">
                  {s.email}
                </td>
                <td className="px-4 py-2.5 text-ink-700">
                  {s.source ?? "—"}
                </td>
                <td className="px-4 py-2.5 text-ink-700">
                  {formatDate(s.created_at)}
                </td>
                <td className="px-4 py-2.5 text-xs text-ink-500 max-w-xs truncate">
                  {s.referrer ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-ink-500">
        <Link href="/" className="underline">
          ← Back to site
        </Link>
      </p>
    </div>
  );
}
