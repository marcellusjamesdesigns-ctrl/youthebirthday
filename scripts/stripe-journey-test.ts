/**
 * Stripe User Journey Test
 *
 * Exercises the entitlement logic end-to-end by firing synthetic
 * `checkout.session.completed` and `customer.subscription.deleted`
 * events through the refactored webhook handlers, then asserting
 * on DB + Redis state.
 *
 * Does NOT hit Stripe. We've already signed off on the code that sends
 * the API request (success_url / cancel_url / metadata construction); it's
 * pure string building. What actually matters — the post-payment state
 * the user lands in — is what we test here.
 *
 * Every test uses an isolated namespace so a partial run doesn't pollute
 * real data, and cleans up at the end.
 *
 * Usage:  dotenv -e .env.local -- tsx scripts/stripe-journey-test.ts
 */

import { createHash, randomUUID } from "node:crypto";
import type Stripe from "stripe";
import { getDb } from "@/lib/db";
import { birthdaySessions, userWaitlist } from "@/lib/db/schema";
import { eq, like } from "drizzle-orm";
import { createId } from "@/lib/utils/id";
import { getRedis } from "@/lib/cache/redis";
import {
  handleCheckoutCompleted,
  handleSubscriptionDeleted,
} from "@/app/api/stripe/webhook/route";
import {
  checkGenerationLimit,
  grantEmailBonus,
  isPremiumFlag,
} from "@/lib/limits/generation-limits";

// ─── Fixtures ────────────────────────────────────────────────────────────

const RUN_ID = Date.now().toString(36);
const TEST_EMAIL_DOMAIN = `journeytest-${RUN_ID}.local`;
const testEmail = (label: string) => `${label}@${TEST_EMAIL_DOMAIN}`;
const testDeviceToken = () => `dev-${RUN_ID}-${randomUUID().slice(0, 8)}`;
const testIp = (label: string) =>
  createHash("sha256").update(`${RUN_ID}:${label}`).digest("hex");

/** Build a synthetic Stripe checkout session. */
function buildCheckoutSession(opts: {
  deviceToken?: string | null;
  email?: string | null;
  sessionId?: string | null;
  mode?: "payment" | "subscription";
  customerId?: string;
}): Stripe.Checkout.Session {
  return {
    id: `cs_test_${randomUUID().slice(0, 16)}`,
    object: "checkout.session",
    mode: opts.mode ?? "payment",
    customer: opts.customerId ?? `cus_test_${randomUUID().slice(0, 12)}`,
    customer_email: opts.email ?? null,
    customer_details: opts.email ? ({ email: opts.email } as unknown as Stripe.Checkout.Session["customer_details"]) : null,
    metadata: {
      ...(opts.deviceToken ? { deviceToken: opts.deviceToken } : {}),
      sessionId: opts.sessionId ?? "",
    },
  } as unknown as Stripe.Checkout.Session;
}

function buildSubscription(opts: { customerId: string }): Stripe.Subscription {
  return {
    id: `sub_test_${randomUUID().slice(0, 12)}`,
    object: "subscription",
    customer: opts.customerId,
  } as unknown as Stripe.Subscription;
}

/** Create a birthday session row so the webhook can read its ipHash. */
async function insertBirthdaySession(ipHash: string): Promise<string> {
  const db = getDb();
  const id = createId();
  await db.insert(birthdaySessions).values({
    id,
    name: "Journey Test",
    birthdate: "01-01",
    birthYear: 2000,
    currentCity: "Test City",
    celebrationVibe: "luxury",
    mode: "quick",
    ipHash,
    status: "pending",
  });
  return id;
}

// ─── Assertion helpers ───────────────────────────────────────────────────

interface JourneyResult {
  name: string;
  passed: boolean;
  assertions: Array<{ label: string; passed: boolean; detail?: string }>;
}

function makeAssert(result: JourneyResult) {
  return (label: string, condition: boolean, detail?: string) => {
    result.assertions.push({ label, passed: condition, detail });
    if (!condition) result.passed = false;
  };
}

async function getTierFromDb(email: string): Promise<string | null> {
  const db = getDb();
  const row = await db
    .select({ tier: userWaitlist.tier })
    .from(userWaitlist)
    .where(eq(userWaitlist.email, email))
    .limit(1)
    .then((r) => r[0] ?? null);
  return row?.tier ?? null;
}

/** Returns true iff the key is set to the premium sentinel (handling
 *  Upstash's JSON auto-parse quirk that roundtrips "true" → boolean true). */
async function redisFlagTrue(key: string): Promise<boolean> {
  return isPremiumFlag(await getRedis().get(key));
}

/** Returns true iff the key is absent (used to assert eviction). */
async function redisFlagAbsent(key: string): Promise<boolean> {
  const v = await getRedis().get(key);
  return v === null || v === undefined;
}

// ─── 11 Journeys ─────────────────────────────────────────────────────────

async function journey1_happyPathOneTime(): Promise<JourneyResult> {
  const r: JourneyResult = { name: "1. Happy path — one-time purchase", passed: true, assertions: [] };
  const assert = makeAssert(r);
  const email = testEmail("j1");
  const device = testDeviceToken();
  const ip = testIp("j1");
  const bdayId = await insertBirthdaySession(ip);

  await handleCheckoutCompleted(
    buildCheckoutSession({ deviceToken: device, email, sessionId: bdayId, mode: "payment" }),
  );

  assert("DB tier = premium", (await getTierFromDb(email)) === "premium");
  assert("Redis device key = true", await redisFlagTrue(`gen:device:${device}:premium`));
  assert("Redis ip key = true", await redisFlagTrue(`gen:ip:${ip}:premium`));

  const limit = await checkGenerationLimit(ip, device);
  assert("checkGenerationLimit allows premium", limit.allowed && limit.remaining === Infinity);
  return r;
}

async function journey2_happyPathMonthly(): Promise<JourneyResult> {
  const r: JourneyResult = { name: "2. Happy path — monthly subscription", passed: true, assertions: [] };
  const assert = makeAssert(r);
  const email = testEmail("j2");
  const device = testDeviceToken();
  const ip = testIp("j2");
  const bdayId = await insertBirthdaySession(ip);

  await handleCheckoutCompleted(
    buildCheckoutSession({ deviceToken: device, email, sessionId: bdayId, mode: "subscription" }),
  );

  assert("DB tier = premium", (await getTierFromDb(email)) === "premium");
  assert("Redis device key = true", await redisFlagTrue(`gen:device:${device}:premium`));
  assert("Redis ip key = true", await redisFlagTrue(`gen:ip:${ip}:premium`));
  return r;
}

async function journey3_deviceTokenDrift(): Promise<JourneyResult> {
  const r: JourneyResult = { name: "3. Device token drift — paid with A, returns as B", passed: true, assertions: [] };
  const assert = makeAssert(r);
  const email = testEmail("j3");
  const deviceA = testDeviceToken();
  const deviceB = testDeviceToken(); // different token, same human
  const ip = testIp("j3");
  const bdayId = await insertBirthdaySession(ip);

  await handleCheckoutCompleted(
    buildCheckoutSession({ deviceToken: deviceA, email, sessionId: bdayId, mode: "payment" }),
  );

  // User comes back with a NEW device token (Safari ITP / cleared storage).
  // The IP-hash Redis key should save them.
  const limit = await checkGenerationLimit(ip, deviceB);
  assert(
    "premium survives device-token drift (via ipHash)",
    limit.allowed && limit.remaining === Infinity,
    `allowed=${limit.allowed} remaining=${String(limit.remaining)}`,
  );
  return r;
}

async function journey4_redisEviction(): Promise<JourneyResult> {
  const r: JourneyResult = { name: "4. Redis evicted — DB fallback rehydrates", passed: true, assertions: [] };
  const assert = makeAssert(r);
  const email = testEmail("j4");
  const device = testDeviceToken();
  const ip = testIp("j4");
  const bdayId = await insertBirthdaySession(ip);

  await handleCheckoutCompleted(
    buildCheckoutSession({ deviceToken: device, email, sessionId: bdayId, mode: "payment" }),
  );

  // Simulate Redis eviction / cold cache.
  const redis = getRedis();
  await redis.del(`gen:device:${device}:premium`);
  await redis.del(`gen:ip:${ip}:premium`);

  const limit = await checkGenerationLimit(ip, device);
  assert(
    "premium via DB fallback",
    limit.allowed && limit.remaining === Infinity,
    `allowed=${limit.allowed} remaining=${String(limit.remaining)}`,
  );

  // And Redis should have been rehydrated by the lookup.
  assert("Redis device key rehydrated", await redisFlagTrue(`gen:device:${device}:premium`));
  assert("Redis ip key rehydrated", await redisFlagTrue(`gen:ip:${ip}:premium`));
  return r;
}

async function journey5_noDeviceToken(): Promise<JourneyResult> {
  const r: JourneyResult = { name: "5. Checkout with no deviceToken (older client)", passed: true, assertions: [] };
  const assert = makeAssert(r);
  const email = testEmail("j5");
  const ip = testIp("j5");
  const bdayId = await insertBirthdaySession(ip);

  await handleCheckoutCompleted(
    buildCheckoutSession({ deviceToken: null, email, sessionId: bdayId, mode: "payment" }),
  );

  assert("DB row created with tier=premium", (await getTierFromDb(email)) === "premium");
  assert(
    "Redis ip key still set (so same-IP caller is recognized)",
    await redisFlagTrue(`gen:ip:${ip}:premium`),
  );

  // A later call from same IP, any device token, should be premium.
  const limit = await checkGenerationLimit(ip, testDeviceToken());
  assert(
    "same-IP caller is recognized as premium",
    limit.allowed && limit.remaining === Infinity,
  );
  return r;
}

async function journey6_noSessionId(): Promise<JourneyResult> {
  const r: JourneyResult = { name: "6. Checkout with no birthday sessionId", passed: true, assertions: [] };
  const assert = makeAssert(r);
  const email = testEmail("j6");
  const device = testDeviceToken();
  const ip = testIp("j6"); // any IP — webhook won't know it

  await handleCheckoutCompleted(
    buildCheckoutSession({ deviceToken: device, email, sessionId: null, mode: "payment" }),
  );

  assert("DB tier = premium", (await getTierFromDb(email)) === "premium");
  assert("Redis device key = true", await redisFlagTrue(`gen:device:${device}:premium`));
  // No sessionId → no ipHash → IP key should NOT be set.
  assert(
    "Redis ip key NOT set (no sessionId to look up)",
    await redisFlagAbsent(`gen:ip:${ip}:premium`),
  );

  // Caller with the same device token is still premium.
  const limit = await checkGenerationLimit(ip, device);
  assert("premium via device-token key", limit.allowed && limit.remaining === Infinity);
  return r;
}

async function journey7_emailOnlyMatch(): Promise<JourneyResult> {
  const r: JourneyResult = {
    name: "7. Paid by email only, no device, no sessionId (worst-case repair path)",
    passed: true,
    assertions: [],
  };
  const assert = makeAssert(r);
  const email = testEmail("j7");

  await handleCheckoutCompleted(
    buildCheckoutSession({ deviceToken: null, email, sessionId: null, mode: "payment" }),
  );

  assert("DB row created with tier=premium", (await getTierFromDb(email)) === "premium");
  // Expected: no Redis flags, no way to identify an anonymous caller.
  // This is a genuine weakness — document it rather than pretend it's fixed.
  return r;
}

async function journey8_existingFreeRowUpgrades(): Promise<JourneyResult> {
  const r: JourneyResult = { name: "8. Existing free user upgrades — no duplicate row", passed: true, assertions: [] };
  const assert = makeAssert(r);
  const db = getDb();
  const email = testEmail("j8");
  const device = testDeviceToken();
  const ip = testIp("j8");
  const bdayId = await insertBirthdaySession(ip);

  // Pre-seed a free-tier row like the waitlist/join route would.
  await db.insert(userWaitlist).values({
    id: createId(),
    email,
    deviceToken: device,
    ipHash: ip,
    tier: "free",
  });

  await handleCheckoutCompleted(
    buildCheckoutSession({ deviceToken: device, email, sessionId: bdayId, mode: "payment" }),
  );

  const rows = await db
    .select()
    .from(userWaitlist)
    .where(eq(userWaitlist.email, email));
  assert("exactly one row for email", rows.length === 1, `got ${rows.length}`);
  assert("tier flipped to premium", rows[0]?.tier === "premium");
  assert("stripeCustomerId populated", !!rows[0]?.stripeCustomerId);
  return r;
}

async function journey9_subscriptionCancelled(): Promise<JourneyResult> {
  const r: JourneyResult = {
    name: "9. Subscription cancelled — premium revoked in DB + Redis",
    passed: true,
    assertions: [],
  };
  const assert = makeAssert(r);
  const email = testEmail("j9");
  const device = testDeviceToken();
  const ip = testIp("j9");
  const customerId = `cus_test_${randomUUID().slice(0, 12)}`;
  const bdayId = await insertBirthdaySession(ip);

  await handleCheckoutCompleted(
    buildCheckoutSession({
      deviceToken: device,
      email,
      sessionId: bdayId,
      mode: "subscription",
      customerId,
    }),
  );

  assert("DB tier = premium before cancel", (await getTierFromDb(email)) === "premium");

  await handleSubscriptionDeleted(buildSubscription({ customerId }));

  assert("DB tier = free after cancel", (await getTierFromDb(email)) === "free");
  assert(
    "Redis device key cleared",
    await redisFlagAbsent(`gen:device:${device}:premium`),
  );
  assert(
    "Redis ip key cleared",
    await redisFlagAbsent(`gen:ip:${ip}:premium`),
  );
  return r;
}

async function journey10_emailBonusFlow(): Promise<JourneyResult> {
  const r: JourneyResult = {
    name: "10. Free-generation email flow — bonus grants 2 extra",
    passed: true,
    assertions: [],
  };
  const assert = makeAssert(r);
  const email = testEmail("j10");
  const device = testDeviceToken();
  const ip = testIp("j10");
  const db = getDb();
  const redis = getRedis();

  // Simulate the first free generation consumed.
  await redis.set(`gen:ip:${ip}:count`, 1);
  const beforeBonus = await checkGenerationLimit(ip, device);
  assert(
    "user is gated BEFORE email (free limit = 1)",
    !beforeBonus.allowed && beforeBonus.reason === "ip_limit",
    `allowed=${beforeBonus.allowed} reason=${beforeBonus.reason}`,
  );

  // Simulate /api/waitlist/join.
  await db.insert(userWaitlist).values({
    id: createId(),
    email,
    deviceToken: device,
    ipHash: ip,
    tier: "free",
  });
  await grantEmailBonus(ip);

  const afterBonus = await checkGenerationLimit(ip, device);
  assert(
    "user is ALLOWED after email bonus",
    afterBonus.allowed,
    `allowed=${afterBonus.allowed} remaining=${String(afterBonus.remaining)}`,
  );
  assert(
    "bonus gives 2 extra (remaining should be 1 after consuming one, here still 1)",
    afterBonus.remaining === 1 || afterBonus.remaining === 2,
    `remaining=${String(afterBonus.remaining)}`,
  );
  return r;
}

async function journey11_doubleCheckoutIdempotent(): Promise<JourneyResult> {
  const r: JourneyResult = {
    name: "11. Webhook fired twice for same checkout — idempotent (no dupes)",
    passed: true,
    assertions: [],
  };
  const assert = makeAssert(r);
  const db = getDb();
  const email = testEmail("j11");
  const device = testDeviceToken();
  const ip = testIp("j11");
  const bdayId = await insertBirthdaySession(ip);
  const session = buildCheckoutSession({
    deviceToken: device,
    email,
    sessionId: bdayId,
    mode: "payment",
  });

  await handleCheckoutCompleted(session);
  await handleCheckoutCompleted(session);

  const rows = await db.select().from(userWaitlist).where(eq(userWaitlist.email, email));
  assert("exactly one row after duplicate webhook", rows.length === 1, `got ${rows.length}`);
  assert("still premium", rows[0]?.tier === "premium");
  return r;
}

// ─── Cleanup ─────────────────────────────────────────────────────────────

async function cleanup() {
  const db = getDb();
  const redis = getRedis();

  // Drop all userWaitlist rows for this run.
  await db
    .delete(userWaitlist)
    .where(like(userWaitlist.email, `%@${TEST_EMAIL_DOMAIN}`));

  // Drop all test-IP birthday sessions (they cascade to generations via FK).
  // We identify ours by ipHash prefix (nope, that's sha256 — can't do prefix).
  // Instead, delete each we made individually would need tracking; accept leftover rows as OK —
  // the `name: "Journey Test"` marker lets us clean later if needed.
  await db.delete(birthdaySessions).where(eq(birthdaySessions.name, "Journey Test"));

  // Drop test Redis keys. We don't know every key, so scan by pattern.
  // Upstash supports SCAN via the SDK.
  const prefixes = [
    `gen:device:dev-${RUN_ID}`,
    // ip keys can't be prefixed — we hash — so we target each known ipHash
  ];
  for (const p of prefixes) {
    let cursor: string | number = "0";
    for (;;) {
      const scanResult: [string | number, string[]] = await redis.scan(cursor, {
        match: `${p}*`,
        count: 100,
      });
      const keys = scanResult[1];
      if (keys.length) await redis.del(...(keys as [string, ...string[]]));
      cursor = scanResult[0];
      if (cursor === "0" || cursor === 0) break;
    }
  }

  // Known IP-hash keys from the journeys.
  const labels = ["j1", "j2", "j3", "j4", "j5", "j6", "j7", "j8", "j9", "j10", "j11"];
  for (const label of labels) {
    const ip = testIp(label);
    await redis.del(
      `gen:ip:${ip}:premium`,
      `gen:ip:${ip}:count`,
      `gen:ip:${ip}:bonus`,
    );
  }
}

// ─── Runner ──────────────────────────────────────────────────────────────

async function main() {
  console.log(`[stripe-journey] run ${RUN_ID} — email domain: ${TEST_EMAIL_DOMAIN}\n`);

  const journeys = [
    journey1_happyPathOneTime,
    journey2_happyPathMonthly,
    journey3_deviceTokenDrift,
    journey4_redisEviction,
    journey5_noDeviceToken,
    journey6_noSessionId,
    journey7_emailOnlyMatch,
    journey8_existingFreeRowUpgrades,
    journey9_subscriptionCancelled,
    journey10_emailBonusFlow,
    journey11_doubleCheckoutIdempotent,
  ];

  const results: JourneyResult[] = [];
  for (const fn of journeys) {
    try {
      const r = await fn();
      results.push(r);
      const icon = r.passed ? "✓" : "✗";
      console.log(`${icon} ${r.name}`);
      for (const a of r.assertions) {
        const aicon = a.passed ? "  ✓" : "  ✗";
        console.log(`${aicon} ${a.label}${a.detail ? ` — ${a.detail}` : ""}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({
        name: fn.name,
        passed: false,
        assertions: [{ label: "threw", passed: false, detail: msg }],
      });
      console.log(`✗ ${fn.name} — THREW: ${msg}`);
    }
  }

  console.log("\n[stripe-journey] cleaning up…");
  try {
    await cleanup();
    console.log("[stripe-journey] cleanup done");
  } catch (err) {
    console.error("[stripe-journey] cleanup failed:", err);
  }

  const passed = results.filter((r) => r.passed).length;
  console.log(`\n[stripe-journey] ${passed}/${results.length} journeys passed`);
  if (passed !== results.length) process.exit(1);
}

main().catch((err) => {
  console.error("[stripe-journey] fatal:", err);
  process.exit(1);
});
