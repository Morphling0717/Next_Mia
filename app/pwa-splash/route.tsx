import { ImageResponse } from "next/og";

export const runtime = "edge";

const MIN_DIMENSION = 320;
const MAX_DIMENSION = 3200;

function clampDim(value: number) {
  if (!Number.isFinite(value)) return 1170;
  return Math.max(MIN_DIMENSION, Math.min(MAX_DIMENSION, Math.round(value)));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const width = clampDim(Number(url.searchParams.get("w") || "1170"));
  const height = clampDim(Number(url.searchParams.get("h") || "2532"));

  const shorter = Math.min(width, height);
  const badgeSize = Math.round(shorter * 0.42);
  const innerRadius = Math.round(badgeSize * 0.28);
  const titleSize = Math.round(shorter * 0.11);
  const subtitleSize = Math.round(shorter * 0.034);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "linear-gradient(180deg, #fbf6ec 0%, #f5ede0 60%, #fbf6ec 100%)",
          color: "#2b2620",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 30% 28%, rgba(196,169,110,0.28), transparent 45%), radial-gradient(circle at 72% 78%, rgba(232,201,184,0.22), transparent 45%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: Math.round(shorter * 0.045),
          }}
        >
          <div
            style={{
              width: badgeSize,
              height: badgeSize,
              borderRadius: innerRadius,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,252,244,0.65)",
              border: "3px solid rgba(196,169,110,0.55)",
              boxShadow: "0 0 60px rgba(196,169,110,0.22)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                lineHeight: 1,
              }}
            >
              <div
                style={{
                  fontSize: titleSize,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "#2b2620",
                }}
              >
                MIA
              </div>
              <div
                style={{
                  marginTop: Math.round(titleSize * 0.18),
                  fontSize: subtitleSize,
                  fontWeight: 700,
                  letterSpacing: "0.32em",
                  color: "#8a6f3a",
                }}
              >
                CATHEDRAL
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: Math.round(shorter * 0.024),
              letterSpacing: "0.4em",
              color: "rgba(43,38,32,0.55)",
            }}
          >
            星眠MIA · CLOUD CATHEDRAL
          </div>
        </div>
      </div>
    ),
    { width, height },
  );
}
