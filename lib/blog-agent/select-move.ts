/**
 * Growth Operator: daily move selector.
 *
 * Chooses ONE content action per run, following the approved priority stack:
 *   1. Fill an obvious hub gap (traffic-page lane, curated seed list)
 *   2. Publish a blog post (existing blog lane)
 *
 * V1 explicitly does NOT include "upgrade an existing page" — that lane
 * needs read-and-diff logic we haven't built. Deferred to V2.
 *
 * The selector is read-only (no side effects). Callers hand the result
 * to the lane-specific generator.
 */
import { TRAFFIC_SEEDS, findNextUnfilledSeed, type TrafficSeed } from "./traffic-seeds";
import { getAllContentPages } from "@/lib/content/render";
import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export type DailyMove =
  | { kind: "traffic-page"; seed: TrafficSeed; reason: string }
  | { kind: "blog"; reason: string }
  | { kind: "none"; reason: string };

/**
 * Decide the next content move.
 *
 * Priority:
 *   1. If any traffic-seed slug is unfilled (neither in the static registry
 *      nor in the DB as a published traffic-page draft), take that seed.
 *   2. Otherwise, default to the blog lane — the existing blog-agent seed
 *      pool handles topic selection inside that lane.
 *   3. If all traffic seeds are filled AND we've logged a blog in the last
 *      6 hours (a safety valve against same-run duplication), return "none".
 */
export async function chooseDailyMove(opts?: {
  /** Skip the traffic-page lane even if seeds are open — used when the admin
   *  manually forces a blog-only run. */
  forceBlog?: boolean;
}): Promise<DailyMove> {
  if (opts?.forceBlog) {
    return { kind: "blog", reason: "forced:blog" };
  }

  // Collect taken slugs: static registry + DB-published traffic drafts.
  const takenByCategory: Record<string, Set<string>> = {};

  // Static content pages (compiled-in).
  const staticPages = getAllContentPages();
  for (const p of staticPages) {
    takenByCategory[p.category] ??= new Set();
    takenByCategory[p.category].add(p.slug);
  }

  // DB-published traffic pages.
  try {
    const db = getDb();
    const rows = await db
      .select({
        category: blogDrafts.targetCategory,
        slug: blogDrafts.targetSlug,
      })
      .from(blogDrafts)
      .where(
        and(eq(blogDrafts.kind, "traffic-page"), eq(blogDrafts.status, "published")),
      );
    for (const r of rows) {
      if (!r.category || !r.slug) continue;
      takenByCategory[r.category] ??= new Set();
      takenByCategory[r.category].add(r.slug);
    }
  } catch (err) {
    // If the DB is unreachable, proceed with static-only coverage. The
    // selector still works; worst case the blog lane runs.
    console.warn(
      JSON.stringify({
        level: "warn",
        msg: "blog-agent:selector_db_unreachable",
        error: err instanceof Error ? err.message : String(err),
      }),
    );
  }

  // Also exclude seeds whose slug currently has a PENDING draft (draft or
  // approved, not yet published) — no point generating it again.
  try {
    const db = getDb();
    const pending = await db
      .select({
        category: blogDrafts.targetCategory,
        slug: blogDrafts.targetSlug,
      })
      .from(blogDrafts)
      .where(
        and(eq(blogDrafts.kind, "traffic-page"), eq(blogDrafts.status, "draft")),
      );
    for (const r of pending) {
      if (!r.category || !r.slug) continue;
      takenByCategory[r.category] ??= new Set();
      takenByCategory[r.category].add(r.slug);
    }
  } catch {
    // non-fatal; handled above
  }

  const nextSeed = findNextUnfilledSeed(takenByCategory);

  if (nextSeed) {
    return {
      kind: "traffic-page",
      seed: nextSeed,
      reason: `traffic-gap:${nextSeed.category}:${nextSeed.slug}`,
    };
  }

  // Traffic seed list exhausted — fall through to blog lane.
  return {
    kind: "blog",
    reason: "traffic-seeds-exhausted:defaulting-to-blog",
  };
}

/** Convenience for logging/admin visibility. */
export function summarizeSelection(move: DailyMove): string {
  if (move.kind === "traffic-page") {
    return `traffic-page • ${move.seed.category}/${move.seed.slug} • ${move.reason}`;
  }
  if (move.kind === "blog") {
    return `blog • ${move.reason}`;
  }
  return `none • ${move.reason}`;
}

/** Surfaced for tests / admin UI. */
export function listAvailableTrafficSeeds() {
  return TRAFFIC_SEEDS.map((s) => ({ id: s.id, category: s.category, slug: s.slug, priority: s.priority }));
}
