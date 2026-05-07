import { neon } from "@neondatabase/serverless";

/**
 * Neon Postgres client. Uses the serverless driver — perfect for Vercel
 * edge / Node functions because it does HTTP-based queries, no connection
 * pooling needed.
 *
 * Set the DATABASE_URL env var in Vercel → Settings → Environment Variables.
 * The Vercel ↔ Neon integration sets this automatically when you connect a
 * Neon database to your project.
 */
function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Connect a Neon database in Vercel → Storage."
    );
  }
  return neon(url);
}

export interface Subscriber {
  id: number;
  email: string;
  source: string | null;
  created_at: string;
  user_agent: string | null;
  referrer: string | null;
}

/**
 * Idempotently creates the subscriptions table. Called on first write so we
 * don't need a separate migration step.
 */
async function ensureTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      source TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      user_agent TEXT,
      referrer TEXT
    )
  `;
}

/**
 * Insert a new subscriber. Returns true if inserted (new), false if already
 * existed. Throws on actual DB errors.
 */
export async function addSubscriber(input: {
  email: string;
  source?: string;
  userAgent?: string | null;
  referrer?: string | null;
}): Promise<{ inserted: boolean }> {
  const sql = getSql();
  await ensureTable();
  const result = await sql`
    INSERT INTO subscriptions (email, source, user_agent, referrer)
    VALUES (${input.email}, ${input.source ?? null}, ${input.userAgent ?? null}, ${input.referrer ?? null})
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `;
  return { inserted: Array.isArray(result) && result.length > 0 };
}

export async function listSubscribers(limit = 1000): Promise<Subscriber[]> {
  const sql = getSql();
  await ensureTable();
  const rows = (await sql`
    SELECT id, email, source, created_at, user_agent, referrer
    FROM subscriptions
    ORDER BY created_at DESC
    LIMIT ${limit}
  `) as unknown as Subscriber[];
  return rows;
}

export async function countSubscribers(): Promise<number> {
  const sql = getSql();
  await ensureTable();
  const rows = (await sql`SELECT COUNT(*)::int AS n FROM subscriptions`) as unknown as { n: number }[];
  return rows[0]?.n ?? 0;
}
