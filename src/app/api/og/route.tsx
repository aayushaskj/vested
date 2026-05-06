import { ImageResponse } from "next/og";
import { getPostBySlug, CATEGORIES } from "@/lib/posts";

export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  let title = "Vested";
  let description = "US investing & RSUs for Indians";
  let category: string | null = null;

  if (slug) {
    const post = getPostBySlug(slug);
    if (post) {
      title = post.title;
      description = post.description;
      category = CATEGORIES[post.category].label;
    }
  }

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
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #2563eb, #10b981)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "36px",
              fontWeight: 700,
            }}
          >
            V
          </div>
          <div
            style={{
              fontSize: "32px",
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
              fontSize: "20px",
              color: "#7d8a9e",
              marginLeft: "4px",
              display: "flex",
            }}
          >
            .blog
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {category && (
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
              {category}
            </div>
          )}
          <div
            style={{
              fontSize: title.length > 80 ? "52px" : "64px",
              fontWeight: 600,
              color: "#10141d",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#525e75",
              lineHeight: 1.4,
              display: "flex",
              maxWidth: "1000px",
            }}
          >
            {description.length > 140
              ? description.slice(0, 140) + "…"
              : description}
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
          <div style={{ fontSize: "20px", color: "#7d8a9e", display: "flex" }}>
            For Indian residents
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#7d8a9e",
              display: "flex",
            }}
          >
            vested.blog
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
