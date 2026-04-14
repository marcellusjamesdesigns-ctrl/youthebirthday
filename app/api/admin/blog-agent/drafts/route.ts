import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "ytb-admin-2026";

/**
 * GET /api/admin/blog-agent/drafts
 * List all drafts (drafts, approved, rejected, published), newest first.
 */
export async function GET(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  if (token !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const rows = await db
    .select({
      id: blogDrafts.id,
      status: blogDrafts.status,
      topicSeedId: blogDrafts.topicSeedId,
      topicTitle: blogDrafts.topicTitle,
      gatesPassed: blogDrafts.gatesPassed,
      gatesTotal: blogDrafts.gatesTotal,
      estimatedCostCents: blogDrafts.estimatedCostCents,
      durationMs: blogDrafts.durationMs,
      createdAt: blogDrafts.createdAt,
      reviewedAt: blogDrafts.reviewedAt,
      publishedAt: blogDrafts.publishedAt,
    })
    .from(blogDrafts)
    .orderBy(desc(blogDrafts.createdAt))
    .limit(100);

  return NextResponse.json({ drafts: rows });
}
