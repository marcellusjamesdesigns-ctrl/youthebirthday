import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { getDb } from "@/lib/db";
import { birthdaySessions, birthdayGenerations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { createId } from "@/lib/utils/id";
import { runBirthdayPipeline } from "@/lib/ai/pipeline";
import type { StepStatusMap } from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const db = getDb();

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
    cosmic: session.mode === "cosmic" ? "queued" : "skipped",
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
