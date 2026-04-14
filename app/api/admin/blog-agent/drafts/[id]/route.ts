import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { BlogPost } from "@/lib/content/types";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "ytb-admin-2026";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const token = request.headers.get("x-admin-token");
  if (token !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();
  const [row] = await db.select().from(blogDrafts).where(eq(blogDrafts.id, id)).limit(1);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ draft: row });
}

/**
 * PATCH /api/admin/blog-agent/drafts/[id]
 * Body: { action: "approve" | "reject" | "edit", postData?, reviewNotes? }
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  const token = request.headers.get("x-admin-token");
  if (token !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const db = getDb();

  const [existing] = await db.select().from(blogDrafts).where(eq(blogDrafts.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = new Date();

  if (body.action === "approve") {
    // Publish — flip status to "published" and set publishedAt
    const postData = (body.postData ?? existing.postData) as BlogPost;
    // Mark the embedded post as published
    const publishedPost: BlogPost = {
      ...postData,
      publishStatus: "published",
      publishedAt: now.toISOString().split("T")[0],
    };
    await db
      .update(blogDrafts)
      .set({
        status: "published",
        postData: publishedPost as unknown as Record<string, unknown>,
        reviewNotes: body.reviewNotes ?? existing.reviewNotes,
        reviewedBy: body.reviewedBy ?? "admin",
        reviewedAt: now,
        publishedAt: now,
        updatedAt: now,
      })
      .where(eq(blogDrafts.id, id));
    return NextResponse.json({ ok: true, status: "published", slug: publishedPost.slug });
  }

  if (body.action === "reject") {
    await db
      .update(blogDrafts)
      .set({
        status: "rejected",
        reviewNotes: body.reviewNotes ?? existing.reviewNotes,
        reviewedBy: body.reviewedBy ?? "admin",
        reviewedAt: now,
        updatedAt: now,
      })
      .where(eq(blogDrafts.id, id));
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  if (body.action === "edit") {
    if (!body.postData) {
      return NextResponse.json({ error: "postData required for edit" }, { status: 400 });
    }
    await db
      .update(blogDrafts)
      .set({
        postData: body.postData as Record<string, unknown>,
        reviewNotes: body.reviewNotes ?? existing.reviewNotes,
        updatedAt: now,
      })
      .where(eq(blogDrafts.id, id));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: `Unknown action: ${body.action}` }, { status: 400 });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const token = request.headers.get("x-admin-token");
  if (token !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const db = getDb();
  await db.delete(blogDrafts).where(eq(blogDrafts.id, id));
  return NextResponse.json({ ok: true });
}
