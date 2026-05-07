import { ImageResponse } from "next/og";
import { getAllPosts } from "@/lib/posts";
import { CALCULATORS } from "@/lib/calculators";

export const runtime = "nodejs";
export const dynamic = "force-static";

/**
 * Generic / homepage OG image. Highlights the depth of the site:
 * "29 guides · 17 calculators · live USD/INR".
 */
export async function GET() {
  const postCount = getAllPosts().length;
  const calcCount = CALCULATORS.length;

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
            "radial-gradient(ellipse at top left, rgba(37,99,235,0.22), transparent 55%), radial-gradient(ellipse at bottom right, rgba(16,185,129,0.20), transparent 60%)",
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
          VESTED · FOR INDIAN RESIDENTS
        </div>

        {/* Center: the headline */}
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
              fontSize: 88,
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
              fontWeight: 700,
              backgroundImage: "linear-gradient(180deg, #ffffff 0%, #d8dde5 100%)",
              backgroundClip: "text",
              color: "transparent",
              maxWidth: 1040,
            }}
          >
            US investing & RSUs,
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              lineHeight: 1.0,
              letterSpacing: "-0.035em",
              fontWeight: 700,
              backgroundImage: "linear-gradient(90deg, #60a5fa 0%, #34d399 100%)",
              backgroundClip: "text",
              color: "transparent",
              marginTop: 8,
              maxWidth: 1040,
            }}
          >
            without the guesswork.
          </div>

          {/* Stat bar */}
          <div
            style={{
              display: "flex",
              gap: 56,
              marginTop: 56,
            }}
          >
            <Stat n={postCount} label="GUIDES" />
            <Divider />
            <Stat n={calcCount} label="CALCULATORS" />
            <Divider />
            <Stat label="LIVE" n="USD/INR" small />
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
              fontSize: 24,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.02em",
              fontWeight: 600,
            }}
          >
            vested.blog
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.16em",
              fontWeight: 500,
            }}
          >
            LRS · RSU · TAX · ETF
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

function Stat({
  n,
  label,
  small,
}: {
  n: number | string;
  label: string;
  small?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          fontSize: small ? 56 : 80,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {n}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 10,
          fontSize: 18,
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.55)",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        display: "flex",
        width: 1,
        background: "rgba(255,255,255,0.15)",
        alignSelf: "stretch",
      }}
    />
  );
}
