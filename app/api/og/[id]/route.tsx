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

/**
 * Satori rules (via next/og):
 * - Every element MUST have explicit `display` (we use `flex` everywhere).
 * - Prefer <div> over <h1>/<p>/<span>; Satori's semantic-tag support is
 *   inconsistent and will silently produce an empty PNG if it chokes.
 * - Fonts must be loaded as ArrayBuffer — no system font fallback works.
 * - No `auto` margins, no percentage border-radius.
 */

// Fetch Playfair Display from Google Fonts CDN so the PNG matches the
// website's editorial serif typography. Cached by the edge runtime.
async function loadFont(weight: number = 700): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(
      `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@${weight}&display=swap`,
      { headers: { "User-Agent": "Mozilla/5.0" } },
    );
    const css = await res.text();
    const match = css.match(/src:\s*url\((https:\/\/[^)]+)\)/);
    if (!match) return null;
    const fontRes = await fetch(match[1]);
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}
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

    // Load editorial serif (Playfair Display) + body sans (Inter) in parallel
    const [serifBold, serifItalic] = await Promise.all([
      loadFont(700),
      loadFont(400).then(async () => {
        // Italic variant for the pull-quote
        try {
          const res = await fetch(
            "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400&display=swap",
            { headers: { "User-Agent": "Mozilla/5.0" } },
          );
          const css = await res.text();
          const match = css.match(/src:\s*url\((https:\/\/[^)]+)\)/);
          if (!match) return null;
          const fontRes = await fetch(match[1]);
          return await fontRes.arrayBuffer();
        } catch {
          return null;
        }
      }),
    ]);

    const fonts: NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"] = [];
    if (serifBold) fonts.push({ name: "Playfair Display", data: serifBold, style: "normal", weight: 700 });
    if (serifItalic) fonts.push({ name: "Playfair Display", data: serifItalic, style: "italic", weight: 400 });

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
          }}
        >
          {/* Color bar */}
          <div style={{ display: "flex", width: "100%", height: 6 }}>
            {primaryColors.map((hex, i) => (
              <div key={i} style={{ display: "flex", flex: 1, backgroundColor: hex }} />
            ))}
          </div>

          {/* Main content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "40px 56px 32px 56px",
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
              <div
                style={{
                  display: "flex",
                  fontSize: 13,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: "#666",
                }}
              >
                You the Birthday
              </div>
              <div style={{ display: "flex", fontSize: 14, color: "#666" }}>
                {name} · {ageTurning}
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                display: "flex",
                fontSize: 44,
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: 16,
                textAlign: "center",
                justifyContent: "center",
                fontFamily: "Playfair Display",
              }}
            >
              {title}
            </div>

            {/* Badges */}
            {(archetype || era) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                {archetype && (
                  <div
                    style={{
                      display: "flex",
                      border: `1px solid ${accentHex}66`,
                      color: `${accentHex}cc`,
                      padding: "4px 14px",
                      borderRadius: 20,
                      fontSize: 13,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginRight: 10,
                    }}
                  >
                    {archetype}
                  </div>
                )}
                {era && (
                  <div
                    style={{
                      display: "flex",
                      border: "1px solid #444",
                      color: "#999",
                      padding: "4px 14px",
                      borderRadius: 20,
                      fontSize: 13,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {era}
                  </div>
                )}
              </div>
            )}

            {/* Caption */}
            {bestCaption && (
              <div
                style={{
                  display: "flex",
                  margin: "8px 0 16px 0",
                  paddingLeft: 16,
                  borderLeft: `3px solid ${accentHex}88`,
                  fontSize: 20,
                  fontStyle: "italic",
                  color: "#ccc",
                  lineHeight: 1.5,
                  fontFamily: "Playfair Display",
                }}
              >
                {`"${bestCaption}"`}
              </div>
            )}

            {/* Celebration (full description, matching website card) */}
            {celebrationStyle && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "12px 0 0 0",
                  padding: "16px 0 0 0",
                  borderTop: "1px solid #222",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#555",
                    marginBottom: 6,
                  }}
                >
                  Your Celebration
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#ddd",
                    marginBottom: 8,
                  }}
                >
                  {celebrationStyle.primaryStyle}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 13,
                    color: "#999",
                    lineHeight: 1.5,
                    marginBottom: 6,
                  }}
                >
                  {celebrationStyle.description}
                </div>
                {celebrationStyle.outfit && (
                  <div
                    style={{
                      display: "flex",
                      fontSize: 12,
                      color: "#888",
                      lineHeight: 1.4,
                    }}
                  >
                    {celebrationStyle.outfit}
                  </div>
                )}
              </div>
            )}

            {/* Top destination */}
            {topDest && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "12px 0 0 0",
                  padding: "12px 0 0 0",
                  borderTop: "1px solid #222",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#555",
                    marginBottom: 4,
                  }}
                >
                  {topDest.section === "chosen" ? "Your City" : "Top Destination Pick"}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#ddd",
                  }}
                >
                  {topDest.city}
                  {topDest.country ? `, ${topDest.country}` : ""}
                </div>
              </div>
            )}

            {/* Bottom row: zodiac + palette */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
                paddingTop: 16,
              }}
            >
              {cosmic?.sunSign ? (
                <div style={{ display: "flex", fontSize: 12, color: "#555" }}>
                  <div style={{ display: "flex", marginRight: 16 }}>☉ {cosmic.sunSign}</div>
                  {cosmic.moonSign && (
                    <div style={{ display: "flex", marginRight: 16 }}>☽ {cosmic.moonSign}</div>
                  )}
                  {cosmic.risingSign && (
                    <div style={{ display: "flex" }}>↑ {cosmic.risingSign}</div>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex" }} />
              )}

              <div style={{ display: "flex" }}>
                {primaryColors.map((hex, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: hex,
                      border: "1px solid #333",
                      marginLeft: i === 0 ? 0 : 4,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Brand footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 16,
                paddingTop: 12,
                borderTop: "1px solid #1a1a1a",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#444",
              }}
            >
              youthebirthday.app
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts: fonts.length > 0 ? fonts : undefined },
    );
  } catch (err) {
    console.error("[og] render error:", err instanceof Error ? err.message : String(err));
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
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 14,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#666",
              marginBottom: 20,
            }}
          >
            You the Birthday
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>
            Your Personalized Birthday Experience
          </div>
          <div style={{ display: "flex", fontSize: 18, color: "#666", marginTop: 20 }}>
            youthebirthday.app
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }
}
