import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { getDb } from "@/lib/db";
import { userWaitlist, birthdaySessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@/lib/utils/id";
import { getRedis } from "@/lib/cache/redis";
import { SESSION_PAID_TTL_SECONDS } from "@/lib/limits/generation-limits";
import { sendBirthdayReport } from "@/lib/email/send-report";

/**
 * Handle a Stripe checkout.session.completed event.
 *
 * Exported so it can be exercised directly by the journey-test harness
 * without signing synthetic webhook bodies. The route below still enforces
 * signature verification for real traffic.
 */
export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const db = getDb();
  const deviceToken = session.metadata?.deviceToken;
  const email = session.customer_email ?? session.customer_details?.email;
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  // Look up the birthday session we're paying for so we can tie
  // premium entitlement to ipHash — not just deviceToken. Fix for
  // "paid on device A, browser returned token B, user still paywalled."
  const sessionId = session.metadata?.sessionId;
  let ipHash: string | null = null;
  if (sessionId) {
    try {
      const row = await db
        .select({ ipHash: birthdaySessions.ipHash })
        .from(birthdaySessions)
        .where(eq(birthdaySessions.id, sessionId))
        .limit(1)
        .then((r) => r[0] ?? null);
      ipHash = row?.ipHash ?? null;
    } catch {
      // soft-fail — we still write device-token entitlement below
    }
  }

  const isSubscription = session.mode === "subscription";
  const purchaseType = isSubscription ? "subscription" : "one_time";
  // Subscriptions grant unlimited. One-time purchases unlock ONLY the
  // specific session they paid for. This is the core monetization gate —
  // don't collapse the two branches.
  const dbTier = isSubscription ? "premium" : "one_time";

  if (deviceToken) {
    try {
      await db
        .insert(userWaitlist)
        .values({
          id: createId(),
          email: email ?? `premium-${deviceToken}@youthebirthday.app`,
          deviceToken,
          ipHash,
          tier: dbTier,
          stripeCustomerId: customerId ?? null,
        })
        .onConflictDoNothing();

      if (email) {
        await db
          .update(userWaitlist)
          .set({
            tier: dbTier,
            stripeCustomerId: customerId ?? null,
            deviceToken,
            ipHash: ipHash ?? undefined,
          })
          .where(eq(userWaitlist.email, email));
      }
    } catch {
      // upsert fallback
    }

    const redis = getRedis();

    if (isSubscription) {
      // Subscription → unlimited generations across any session.
      await redis.set(`gen:device:${deviceToken}:premium`, "true");
      await redis.set(`gen:device:${deviceToken}:purchase_type`, purchaseType);
      if (ipHash) {
        await redis.set(`gen:ip:${ipHash}:premium`, "true");
        await redis.set(`gen:ip:${ipHash}:purchase_type`, purchaseType);
      }
    }

    // Session-scoped unlock — written for BOTH one-time and subscription
    // purchases so the user can view/regen/re-email the exact session
    // they just paid for, regardless of future device changes.
    if (sessionId) {
      await redis.set(`gen:session:${sessionId}:paid`, "true", {
        ex: SESSION_PAID_TTL_SECONDS,
      });
      await redis.set(`gen:session:${sessionId}:purchase_type`, purchaseType, {
        ex: SESSION_PAID_TTL_SECONDS,
      });
    }
  } else if (email) {
    // Edge case: checkout completed with email but no deviceToken
    // (older client, or device-token cookie blocked). Still record the
    // purchase so we can repair the user later by email.
    try {
      await db
        .insert(userWaitlist)
        .values({
          id: createId(),
          email,
          deviceToken: null,
          ipHash,
          tier: dbTier,
          stripeCustomerId: customerId ?? null,
        })
        .onConflictDoUpdate({
          target: userWaitlist.email,
          set: {
            tier: dbTier,
            stripeCustomerId: customerId ?? null,
            ipHash: ipHash ?? undefined,
          },
        });

      const redis = getRedis();
      if (isSubscription && ipHash) {
        await redis.set(`gen:ip:${ipHash}:premium`, "true");
      }
      if (sessionId) {
        await redis.set(`gen:session:${sessionId}:paid`, "true", {
          ex: SESSION_PAID_TTL_SECONDS,
        });
      }
    } catch {
      // soft-fail
    }
  }

  // Log the email-send decision unconditionally so diagnosis is trivial.
  console.log(
    JSON.stringify({
      level: "info",
      msg: "email:gate_check",
      hasEmail: !!email,
      hasSessionId: !!sessionId && sessionId !== "",
      sessionIdValue: sessionId ?? null,
      emailValue: email ?? null,
    }),
  );

  if (email && sessionId && sessionId !== "") {
    // Retry once on transient Resend / DB failures. The second attempt
    // runs after a short delay which also covers webhook→DB races where
    // the generation row hasn't been marked complete yet.
    let sent = await sendBirthdayReport(email, sessionId, isSubscription);
    if (!sent) {
      await new Promise((r) => setTimeout(r, 2000));
      sent = await sendBirthdayReport(email, sessionId, isSubscription);
    }
    console.log(
      JSON.stringify({
        level: sent ? "info" : "error",
        msg: sent ? "email:report_sent" : "email:report_failed",
        email,
        sessionId,
        mode: session.mode,
      }),
    );
  } else {
    console.warn(
      JSON.stringify({
        level: "warn",
        msg: "email:skipped_missing_data",
        hasEmail: !!email,
        hasSessionId: !!sessionId && sessionId !== "",
      }),
    );
  }

  console.log(
    JSON.stringify({
      level: "info",
      msg: "stripe:checkout_completed",
      deviceToken,
      email,
      customerId,
      mode: session.mode,
    }),
  );
}

/**
 * Handle a subscription cancellation.
 *
 * IMPORTANT: also clears Redis premium flags so the Upstash cache doesn't
 * keep a cancelled subscriber entitled until TTL expiry.
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
): Promise<void> {
  const db = getDb();
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  if (!customerId) return;

  // Find the user row so we can also evict their Redis keys.
  const row = await db
    .select({
      deviceToken: userWaitlist.deviceToken,
      ipHash: userWaitlist.ipHash,
    })
    .from(userWaitlist)
    .where(eq(userWaitlist.stripeCustomerId, customerId))
    .limit(1)
    .then((r) => r[0] ?? null);

  await db
    .update(userWaitlist)
    .set({ tier: "free" })
    .where(eq(userWaitlist.stripeCustomerId, customerId));

  if (row) {
    const redis = getRedis();
    const ops: Promise<unknown>[] = [];
    if (row.deviceToken) ops.push(redis.del(`gen:device:${row.deviceToken}:premium`));
    if (row.ipHash) ops.push(redis.del(`gen:ip:${row.ipHash}:premium`));
    await Promise.all(ops);
  }

  console.log(
    JSON.stringify({
      level: "info",
      msg: "stripe:subscription_cancelled",
      customerId,
    }),
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object);
      break;
  }

  return NextResponse.json({ received: true });
}
