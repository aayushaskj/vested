import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f7f8fa 50%, #ecfdf6 100%)",
          padding: "80px",
          justifyContent: "space-between",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              background: "linear-gradient(135deg, #2563eb, #10b981)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "44px",
              fontWeight: 700,
            }}
          >
            V
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 600,
              color: "#10141d",
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            Vested
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#7d8a9e",
              marginLeft: "4px",
              display: "flex",
            }}
          >
            .blog
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: "#d1fae8",
              color: "#047857",
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "20px",
              fontWeight: 500,
            }}
          >
            For Indian residents
          </div>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 600,
              color: "#10141d",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            US investing & RSUs,
          </div>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              background: "linear-gradient(90deg, #1d4ed8, #047857)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            without the guesswork.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #d8dde5",
            paddingTop: "24px",
          }}
        >
          <div style={{ fontSize: "22px", color: "#7d8a9e", display: "flex" }}>
            Practical guides on LRS, RSUs & US ETFs
          </div>
          <div style={{ fontSize: "22px", color: "#7d8a9e", display: "flex" }}>
            vested.blog
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
