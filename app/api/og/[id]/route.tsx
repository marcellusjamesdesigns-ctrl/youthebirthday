import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { birthdaySessions, birthdayGenerations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type {
  ColorPalette,
  CosmicProfile,
  CelebrationStyle,
  Destination,
  CaptionCategory,
} from "@/lib/db/schema";

export const runtime = "edge";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const db = getDb();
    const session = await db
      .select()
      .from(birthdaySessions)
      .where(eq(birthdaySessions.id, id))
      .limit(1)
      .then((r) => r[0] ?? null);

    const generation = await db
      .select()
      .from(birthdayGenerations)
      .where(eq(birthdayGenerations.sessionId, id))
      .orderBy(desc(birthdayGenerations.version))
      .limit(1)
      .then((r) => r[0] ?? null);

    const name = session?.name ?? "Someone";
    const ageTurning = session
      ? new Date().getFullYear() - session.birthYear
      : "?";
    const title = generation?.birthdayTitle ?? `${name}'s Birthday`;
    const archetype = generation?.birthdayArchetype ?? "";
    const era = generation?.birthdayEra ?? "";

    const palettes = generation?.colorPalettes as ColorPalette[] | null;
    const primaryColors = palettes?.[0]?.colors?.map((c) => c.hex) ?? [
      "#1a1a2e",
      "#16213e",
      "#0f3460",
      "#e94560",
      "#d4af37",
    ];
    const accentHex = primaryColors[0] ?? "#d4af37";

    const cosmic = generation?.cosmicProfile as CosmicProfile | null;
    const celebrationStyle = generation?.celebrationStyle as CelebrationStyle | null;
    const destinations = (generation?.destinations as Destination[]) ?? [];
    const topDest = destinations[0];

    const captions = generation?.captionPack as CaptionCategory[] | null;
    const allCaptions = captions?.flatMap((c) => c.captions) ?? [];
    const bestCaption =
      allCaptions.filter((c) => c.length < 90).sort((a, b) => a.length - b.length)[0] ??
      allCaptions[0] ??
      null;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#0a0a0b",
            color: "#f5f0eb",
            fontFamily: "Georgia, 'Times New Roman', serif",
            padding: 0,
          }}
        >
          {/* Color bar */}
          <div style={{ display: "flex", width: "100%", height: "6px" }}>
            {primaryColors.map((hex, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: hex }} />
            ))}
          </div>

          {/* Main content area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "40px 56px 32px",
            }}
          >
            {/* Top row: brand + name */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase" as const,
                  color: "#666",
                }}
              >
                You the Birthday
              </span>
              <span style={{ fontSize: 14, color: "#666" }}>
                {name} · {ageTurning}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: 44,
                fontWeight: 700,
                lineHeight: 1.1,
                margin: "0 0 16px 0",
                textAlign: "center" as const,
              }}
            >
              {title}
            </h1>

            {/* Badges */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {archetype && (
                <span
                  style={{
                    border: `1px solid ${accentHex}66`,
                    color: `${accentHex}cc`,
                    padding: "4px 14px",
                    borderRadius: 20,
                    fontSize: 13,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  {archetype}
                </span>
              )}
              {era && (
                <span
                  style={{
                    border: "1px solid #444",
                    color: "#999",
                    padding: "4px 14px",
                    borderRadius: 20,
                    fontSize: 13,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  {era}
                </span>
              )}
            </div>

            {/* Caption */}
            {bestCaption && (
              <div
                style={{
                  display: "flex",
                  margin: "8px 0 16px",
                  paddingLeft: 16,
                  borderLeft: `3px solid ${accentHex}88`,
                }}
              >
                <p
                  style={{
                    fontSize: 20,
                    fontStyle: "italic",
                    color: "#ccc",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  &ldquo;{bestCaption}&rdquo;
                </p>
              </div>
            )}

            {/* Middle section: celebration + destination */}
            <div
              style={{
                display: "flex",
                gap: 40,
                margin: "12px 0",
                padding: "16px 0",
                borderTop: "1px solid #222",
                borderBottom: "1px solid #222",
              }}
            >
              {/* Celebration style */}
              {celebrationStyle && (
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase" as const,
                      color: "#555",
                      marginBottom: 6,
                    }}
                  >
                    Your Celebration
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#ddd" }}>
                    {celebrationStyle.primaryStyle}
                  </span>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#777",
                        border: "1px solid #333",
                        borderRadius: 10,
                        padding: "2px 8px",
                      }}
                    >
                      {celebrationStyle.aesthetic}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#777",
                        border: "1px solid #333",
                        borderRadius: 10,
                        padding: "2px 8px",
                      }}
                    >
                      {celebrationStyle.outfit}
                    </span>
                  </div>
                </div>
              )}

              {/* Top destination */}
              {topDest && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase" as const,
                      color: "#555",
                      marginBottom: 6,
                    }}
                  >
                    {topDest.section === "chosen" ? "Your City" : "Top Destination"}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#ddd" }}>
                    {topDest.city}
                    {topDest.country ? `, ${topDest.country}` : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom row: zodiac + palette */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "auto",
                paddingTop: 16,
              }}
            >
              {/* Big 3 */}
              {cosmic?.sunSign ? (
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#555" }}>
                  <span>☉ {cosmic.sunSign}</span>
                  {cosmic.moonSign && <span>☽ {cosmic.moonSign}</span>}
                  {cosmic.risingSign && <span>↑ {cosmic.risingSign}</span>}
                </div>
              ) : (
                <div />
              )}

              {/* Palette swatches */}
              <div style={{ display: "flex", gap: 4 }}>
                {primaryColors.map((hex, i) => (
                  <div
                    key={i}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: hex,
                      border: "1px solid #333",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Brand footer */}
            <div
              style={{
                textAlign: "center" as const,
                marginTop: 16,
                paddingTop: 12,
                borderTop: "1px solid #1a1a1a",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase" as const,
                  color: "#444",
                }}
              >
                youthebirthday.app
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0b",
            color: "#f5f0eb",
            fontFamily: "Georgia, serif",
          }}
        >
          <p
            style={{
              fontSize: 14,
              letterSpacing: "0.3em",
              textTransform: "uppercase" as const,
              color: "#666",
            }}
          >
            You the Birthday
          </p>
          <h1 style={{ fontSize: 44, fontWeight: 700 }}>
            Your Personalized Birthday Experience
          </h1>
          <p style={{ fontSize: 18, color: "#666" }}>youthebirthday.app</p>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }
}
