import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { waitUntil } from "@vercel/functions";
import { getDb } from "@/lib/db";
import { birthdaySessions, birthdayGenerations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { createId } from "@/lib/utils/id";
import { runBirthdayPipeline } from "@/lib/ai/pipeline";
import {
  incrementGenerationCount,
  getPassCredits,
  consumePassCredit,
  markSessionPaid,
  isSessionPaid,
} from "@/lib/limits/generation-limits";
import type { StepStatusMap } from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const db = getDb();

  // Rate limiting — extract IP and device token
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");
  const deviceToken = request.headers.get("x-device-token") ?? null;

  const session = await db
    .select()
    .from(birthdaySessions)
    .where(eq(birthdaySessions.id, id))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status !== "pending" && session.status !== "error") {
    return NextResponse.json({ error: "Already generating" }, { status: 409 });
  }

  // PREVIEW-FIRST MODEL: generation is always allowed. The report
  // renders a locked preview for non-paying users; the paywall lives
  // inside the report. No 403/gated responses here.
  //
  // Birthday Pass auto-unlock: if the caller has remaining pass credits
  // AND this session isn't already paid, auto-consume one credit and
  // mark the session as paid. This is the "pass users get their next
  // report unlocked automatically" behavior from the product spec.
  const alreadyPaid = await isSessionPaid(id);
  if (!alreadyPaid) {
    const credits = await getPassCredits(ipHash, deviceToken);
    if (credits && credits.remaining > 0) {
      await consumePassCredit(ipHash, deviceToken);
      await markSessionPaid(id, "birthday_pass");
      console.log(
        JSON.stringify({
          level: "info",
          msg: "pass:credit_consumed",
          sessionId: id,
          creditsRemainingAfter: credits.remaining - 1,
        }),
      );
    }
  }

  // Determine version (increment if regenerating after error)
  const existingGen = await db
    .select({ version: birthdayGenerations.version })
    .from(birthdayGenerations)
    .where(eq(birthdayGenerations.sessionId, id))
    .orderBy(desc(birthdayGenerations.version))
    .limit(1)
    .then((r) => r[0] ?? null);

  const version = (existingGen?.version ?? 0) + 1;
  const generationId = createId();

  const initialStepStatus: StepStatusMap = {
    identity: "queued",
    palettes: "queued",
    captions: "queued",
    destinations: "queued",
    celebrationStyle: "queued",
    restaurants: "queued",
    activities: "queued",
    cosmic: session.mode === "cosmic" ? "queued" : "skipped",
    gifts: session.birthdayFor === "other" ? "queued" : "skipped",
  };

  await db.insert(birthdayGenerations).values({
    id: generationId,
    sessionId: id,
    version,
    status: "processing",
    stepStatus: initialStepStatus,
    generationStartedAt: new Date(),
  });

  await db
    .update(birthdaySessions)
    .set({ status: "processing", updatedAt: new Date() })
    .where(eq(birthdaySessions.id, id));

  console.log(
    JSON.stringify({
      level: "info",
      msg: "pipeline:triggered",
      sessionId: id,
      generationId,
      version,
    })
  );

  // Increment generation count BEFORE the pipeline runs (count the attempt, not the success)
  await incrementGenerationCount(ipHash, deviceToken);

  // Fire the pipeline in the background — response returns immediately
  waitUntil(
    runBirthdayPipeline(session, generationId).catch((err) => {
      console.error(JSON.stringify({
        level: "error",
        msg: "pipeline:crash",
        generationId,
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      }));
    })
  );

  return NextResponse.json({ generationId, version });
}
