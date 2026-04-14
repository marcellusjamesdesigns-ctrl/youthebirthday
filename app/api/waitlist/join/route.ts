import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";
import { getDb } from "@/lib/db";
import { userWaitlist } from "@/lib/db/schema";
import { createId } from "@/lib/utils/id";
import { grantEmailBonus } from "@/lib/limits/generation-limits";

const JoinSchema = z.object({
  email: z.string().email(),
  deviceToken: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = JoinSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email, deviceToken } = parsed.data;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");

  const db = getDb();

  // Upsert — if email exists, just grant bonus again (idempotent)
  try {
    await db.insert(userWaitlist).values({
      id: createId(),
      email,
      ipHash,
      deviceToken,
    }).onConflictDoNothing();
  } catch {
    // Email already exists — that's fine
  }

  // Grant bonus generations in Redis
  await grantEmailBonus(ipHash);

  return NextResponse.json({ granted: 2 });
}
