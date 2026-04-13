import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { birthdaySessions, birthdayGenerations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const runtime = "edge";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    // Get primary palette colors if available
    const palettes = generation?.colorPalettes as
      | { colors: { hex: string }[] }[]
      | null;
    const primaryColors = palettes?.[0]?.colors?.map((c) => c.hex) ?? [
      "#1a1a2e",
      "#16213e",
      "#0f3460",
      "#e94560",
      "#d4af37",
    ];

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
            backgroundColor: "#0a0a0a",
            color: "#fafafa",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Color bar */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "8px",
              position: "absolute",
              top: 0,
            }}
          >
            {primaryColors.map((hex, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: hex,
                }}
              />
            ))}
          </div>

          {/* Brand */}
          <p
            style={{
              fontSize: 16,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#888",
              marginBottom: 16,
            }}
          >
            you the birthday
          </p>

          {/* Title */}
          <h1
            style={{
              fontSize: 56,
              fontWeight: 700,
              textAlign: "center" as const,
              lineHeight: 1.1,
              maxWidth: "80%",
              margin: 0,
            }}
          >
            {title}
          </h1>

          {/* Badges */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 24,
            }}
          >
            {archetype && (
              <span
                style={{
                  backgroundColor: "#222",
                  padding: "6px 16px",
                  borderRadius: 20,
                  fontSize: 18,
                }}
              >
                {archetype}
              </span>
            )}
            {era && (
              <span
                style={{
                  border: "1px solid #444",
                  padding: "6px 16px",
                  borderRadius: 20,
                  fontSize: 18,
                }}
              >
                {era}
              </span>
            )}
          </div>

          {/* Name + age */}
          <p
            style={{
              fontSize: 20,
              color: "#888",
              marginTop: 24,
            }}
          >
            {name} · turning {ageTurning}
          </p>

          {/* Footer */}
          <p
            style={{
              position: "absolute",
              bottom: 24,
              fontSize: 14,
              color: "#555",
            }}
          >
            youthebirthday.app
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    // Fallback OG image on error
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
            backgroundColor: "#0a0a0a",
            color: "#fafafa",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <p
            style={{
              fontSize: 16,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#888",
            }}
          >
            you the birthday
          </p>
          <h1 style={{ fontSize: 48, fontWeight: 700 }}>
            Your Personalized Birthday Experience
          </h1>
          <p style={{ fontSize: 20, color: "#888" }}>youthebirthday.app</p>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
