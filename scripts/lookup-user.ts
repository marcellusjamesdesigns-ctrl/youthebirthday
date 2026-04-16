/**
 * One-shot production lookup for a specific user.
 *
 * Checks:
 *   - user_waitlist row (tier, stripeCustomerId, deviceToken, ipHash)
 *   - all birthday_sessions from the same ipHash
 *   - Redis premium flags keyed by any device/ip we find
 *
 * Usage:  dotenv -e .env.local -- tsx scripts/lookup-user.ts <email>
 */

import { getDb } from "@/lib/db";
import { userWaitlist, birthdaySessions, birthdayGenerations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getRedis } from "@/lib/cache/redis";
import { isPremiumFlag } from "@/lib/limits/generation-limits";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("usage: lookup-user.ts <email>");
    process.exit(1);
  }

  const db = getDb();
  const redis = getRedis();

  console.log(`\nLookup: ${email}\n${"─".repeat(60)}`);

  // 1. user_waitlist
  const rows = await db
    .select()
    .from(userWaitlist)
    .where(eq(userWaitlist.email, email));

  if (rows.length === 0) {
    console.log("user_waitlist:  NO ROW");
    console.log("  → means: webhook never wrote a record, OR email never captured.");
    console.log("  → this user paid in Stripe but the webhook did not fire / failed verification.");
  } else {
    console.log(`user_waitlist:  ${rows.length} row(s)`);
    for (const r of rows) {
      console.log(`  id:                  ${r.id}`);
      console.log(`  tier:                ${r.tier}`);
      console.log(`  stripeCustomerId:    ${r.stripeCustomerId ?? "(null)"}`);
      console.log(`  deviceToken:         ${r.deviceToken ?? "(null)"}`);
      console.log(`  ipHash:              ${r.ipHash ?? "(null)"}`);
      console.log(`  createdAt:           ${r.createdAt?.toISOString?.() ?? r.createdAt}`);
    }
  }

  // 2. Redis flags for any device/ip we know
  console.log("\nRedis premium flags:");
  let anyFlag = false;
  for (const r of rows) {
    if (r.deviceToken) {
      const k = `gen:device:${r.deviceToken}:premium`;
      const v = await redis.get(k);
      anyFlag = anyFlag || isPremiumFlag(v);
      console.log(`  ${k}`);
      console.log(`    value: ${JSON.stringify(v)}  (premium=${isPremiumFlag(v)})`);
    }
    if (r.ipHash) {
      const k = `gen:ip:${r.ipHash}:premium`;
      const v = await redis.get(k);
      anyFlag = anyFlag || isPremiumFlag(v);
      console.log(`  ${k}`);
      console.log(`    value: ${JSON.stringify(v)}  (premium=${isPremiumFlag(v)})`);
    }
  }
  if (rows.length === 0) console.log("  (no deviceToken/ipHash to key off of)");

  // 3. birthday sessions from the same ipHash (in case they have unpaired reports)
  console.log("\nBirthday sessions from the same ipHash:");
  const ipHashes = [...new Set(rows.map((r) => r.ipHash).filter(Boolean) as string[])];
  if (ipHashes.length === 0) {
    console.log("  (no ipHash on record)");
  } else {
    for (const h of ipHashes) {
      const sessions = await db
        .select({
          id: birthdaySessions.id,
          name: birthdaySessions.name,
          status: birthdaySessions.status,
          createdAt: birthdaySessions.createdAt,
        })
        .from(birthdaySessions)
        .where(eq(birthdaySessions.ipHash, h))
        .orderBy(desc(birthdaySessions.createdAt))
        .limit(20);
      console.log(`  ipHash ${h.slice(0, 12)}…: ${sessions.length} session(s)`);
      for (const s of sessions) {
        console.log(`    - ${s.id}  name="${s.name}"  status=${s.status}  ${s.createdAt?.toISOString?.()}`);
        // Peek at latest generation to see if it ever completed
        const gens = await db
          .select({
            version: birthdayGenerations.version,
            status: birthdayGenerations.stepStatus,
            cost: birthdayGenerations.estimatedCostCents,
          })
          .from(birthdayGenerations)
          .where(eq(birthdayGenerations.sessionId, s.id))
          .orderBy(desc(birthdayGenerations.version))
          .limit(1);
        if (gens[0]) {
          console.log(`        gen v${gens[0].version}  stepStatus=${JSON.stringify(gens[0].status)}`);
        } else {
          console.log(`        (no generation rows — never started)`);
        }
      }
    }
  }

  // 4. Diagnosis
  console.log(`\n${"─".repeat(60)}`);
  const hasRow = rows.length > 0;
  const isPremium = rows.some((r) => r.tier === "premium");
  const redisOK = anyFlag;

  console.log("Diagnosis:");
  if (!hasRow) {
    console.log("  ✗ No user_waitlist row — webhook likely never fired.");
    console.log("    Repair: manually insert a premium row keyed by email.");
    console.log("    Command to run (you'll need to fill deviceToken/ipHash manually if you want");
    console.log("    this user to also be recognized on their next page load):");
    console.log(
      `      INSERT INTO user_waitlist (id, email, tier) VALUES (gen_random_uuid()::text, '${email}', 'premium');`,
    );
  } else if (!isPremium) {
    console.log("  ✗ Row exists but tier = free. Webhook fired partially (row created) but");
    console.log("    tier update failed. Repair by flipping tier.");
    console.log(
      `      UPDATE user_waitlist SET tier = 'premium' WHERE email = '${email}';`,
    );
  } else if (!redisOK) {
    console.log("  ⚠ DB says premium but Redis flag missing. With the new fallback this should");
    console.log("    work — caller's next tier check will rehydrate Redis. No action needed.");
  } else {
    console.log("  ✓ DB + Redis both say premium. If the user is STILL hitting the gate, check:");
    console.log("    - do their browser's deviceToken / resolved IP match the values above?");
    console.log("    - is their generation already `processing`/`complete`? (gate only runs on pending)");
  }
}

main().catch((err) => {
  console.error("fatal:", err);
  process.exit(1);
});
