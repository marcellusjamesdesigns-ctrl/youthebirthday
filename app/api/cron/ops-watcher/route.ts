import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/cache/redis";
import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

/**
 * Ops Watcher — daily health check.
 *
 * Explicitly NOT a conversion analytics agent (that's Phase 3, deferred
 * until traffic is meaningful). This just answers: "is anything visibly
 * broken?"
 *
 * Battery:
 *   1. Smoke-test a handful of critical URLs (homepage, hubs, a sub-page)
 *      for HTTP 200.
 *   2. Read 24h Redis counters for Stripe webhook signature failures.
 *   3. Check recent cron runs (last 24h of blog_drafts) for unusual
 *      patterns — no runs at all AND not paused → warn.
 *
 * Output:
 *   - Structured JSON log line per check (admin-tailable)
 *   - Summary written to Redis `ops-watcher:last-run` (JSON) for the
 *     admin dashboard.
 *   - Response always 200 (same rationale as blog-agent cron).
 *
 * Adjust critical URL list as the site grows.
 */

export const maxDuration = 60;

const BASE_URL =
  process.env.OPS_WATCHER_BASE_URL ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  "https://youthebirthday.app";

const CRITICAL_PATHS = [
  "/",
  "/birthday-captions",
  "/birthday-ideas",
  "/birthday-destinations",
  "/birthday-palettes",
  "/birthday-themes",
  "/milestone-birthdays",
  "/zodiac-birthdays",
  "/blog",
  "/sitemap.xml",
  "/robots.txt",
  "/ads.txt",
];

interface CheckResult {
  check: string;
  passed: boolean;
  severity: "info" | "warn" | "error";
  details: string;
  data?: Record<string, unknown>;
}

async function smokeTestUrls(): Promise<CheckResult[]> {
  const out: CheckResult[] = [];
  await Promise.all(
    CRITICAL_PATHS.map(async (path) => {
      const url = `${BASE_URL}${path}`;
      const start = Date.now();
      try {
        // HEAD first, fall back to GET (some hosts 405 on HEAD).
        let res = await fetch(url, { method: "HEAD", redirect: "follow" });
        if (res.status === 405 || res.status === 501) {
          res = await fetch(url, { method: "GET", redirect: "follow" });
        }
        const ms = Date.now() - start;
        const passed = res.status >= 200 && res.status < 400;
        out.push({
          check: `url:${path}`,
          passed,
          severity: passed ? (ms > 4000 ? "warn" : "info") : "error",
          details: `${res.status} in ${ms}ms`,
          data: { url, status: res.status, ms },
        });
      } catch (err) {
        const ms = Date.now() - start;
        out.push({
          check: `url:${path}`,
          passed: false,
          severity: "error",
          details: `fetch failed in ${ms}ms: ${err instanceof Error ? err.message : String(err)}`,
          data: { url, ms },
        });
      }
    }),
  );
  return out;
}

async function checkStripeWebhookCounters(): Promise<CheckResult[]> {
  const redis = getRedis();
  const [badSig, missingSig] = await Promise.all([
    redis.get<number>("ops:stripe-webhook:bad-sig:24h"),
    redis.get<number>("ops:stripe-webhook:missing-sig:24h"),
  ]);
  const badSigCount = typeof badSig === "number" ? badSig : 0;
  const missingSigCount = typeof missingSig === "number" ? missingSig : 0;

  // Under 5 missing sigs per day is normal probing noise. Over 20 starts
  // to look like a misconfigured endpoint somewhere.
  const results: CheckResult[] = [];
  results.push({
    check: "stripe:webhook:bad-sig-24h",
    passed: badSigCount < 3,
    severity: badSigCount >= 3 ? "error" : "info",
    details: `${badSigCount} bad-signature webhook hits in last 24h.`,
    data: { count: badSigCount },
  });
  results.push({
    check: "stripe:webhook:missing-sig-24h",
    passed: missingSigCount < 20,
    severity: missingSigCount >= 20 ? "warn" : "info",
    details: `${missingSigCount} missing-signature webhook hits in last 24h (probing).`,
    data: { count: missingSigCount },
  });
  return results;
}

async function checkCronHealth(): Promise<CheckResult[]> {
  const db = getDb();
  const since = new Date(Date.now() - 26 * 3_600_000); // 26h window

  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(blogDrafts)
      .where(sql`${blogDrafts.createdAt} >= ${since}`);

    // Zero drafts in 26h is expected with our 48h cadence gate — so this
    // is only a warn if it's been >72h since the last draft of any kind.
    const [latest] = await db
      .select({ createdAt: blogDrafts.createdAt })
      .from(blogDrafts)
      .orderBy(sql`${blogDrafts.createdAt} desc`)
      .limit(1);

    if (!latest) {
      return [{
        check: "growth-op:last-draft",
        passed: true,
        severity: "info",
        details: "No drafts on record yet.",
      }];
    }

    const hoursSince = (Date.now() - latest.createdAt.getTime()) / 3_600_000;
    // If the cadence gate is 48h and we haven't seen a draft in >96h AND
    // there's no "paused" marker, something is preventing generation.
    const redis = getRedis();
    const paused = await redis.get("blog-agent:schedule:paused");
    const isPaused = paused === true || paused === "true" || paused === 1 || paused === "1";
    const stale = hoursSince > 96 && !isPaused;

    return [
      {
        check: "growth-op:drafts-24h",
        passed: true,
        severity: "info",
        details: `${count} draft(s) created in last 26h.`,
        data: { count },
      },
      {
        check: "growth-op:last-draft-fresh",
        passed: !stale,
        severity: stale ? "warn" : "info",
        details: stale
          ? `No draft in ${hoursSince.toFixed(0)}h and schedule isn't paused — cron may be failing.`
          : `Last draft ${hoursSince.toFixed(1)}h ago (paused=${isPaused}).`,
        data: { hoursSinceLast: Number(hoursSince.toFixed(2)), paused: isPaused },
      },
    ];
  } catch (err) {
    return [{
      check: "growth-op:cron-health-query",
      passed: false,
      severity: "error",
      details: `DB query failed: ${err instanceof Error ? err.message : String(err)}`,
    }];
  }
}

export async function GET(request: NextRequest) {
  // Auth — Vercel cron uses the same CRON_SECRET pattern.
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const runStart = Date.now();
  const [urlResults, webhookResults, cronResults] = await Promise.all([
    smokeTestUrls(),
    checkStripeWebhookCounters(),
    checkCronHealth(),
  ]);

  const all: CheckResult[] = [...urlResults, ...webhookResults, ...cronResults];

  const summary = {
    ranAt: new Date().toISOString(),
    durationMs: Date.now() - runStart,
    totalChecks: all.length,
    passed: all.filter((r) => r.passed).length,
    warnings: all.filter((r) => r.severity === "warn").length,
    errors: all.filter((r) => r.severity === "error").length,
    errorList: all.filter((r) => r.severity === "error").map((r) => ({
      check: r.check,
      details: r.details,
    })),
    warningList: all.filter((r) => r.severity === "warn").map((r) => ({
      check: r.check,
      details: r.details,
    })),
  };

  // Structured log — one line, grep-able for "ops-watcher:"
  console.log(
    JSON.stringify({
      level: summary.errors > 0 ? "error" : summary.warnings > 0 ? "warn" : "info",
      msg: "ops-watcher:run",
      summary,
      checks: all,
    }),
  );

  // Persist last-run for the admin dashboard.
  try {
    await getRedis().set("ops-watcher:last-run", JSON.stringify({ summary, checks: all }));
  } catch (err) {
    console.warn(
      JSON.stringify({
        level: "warn",
        msg: "ops-watcher:redis_persist_failed",
        error: err instanceof Error ? err.message : String(err),
      }),
    );
  }

  return NextResponse.json({ summary, checks: all });
}
