import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { getDb } from "@/lib/db";
import { userWaitlist, birthdaySessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@/lib/utils/id";
import { getRedis } from "@/lib/cache/redis";
import {
  SESSION_PAID_TTL_SECONDS,
  grantBirthdayPass,
  BIRTHDAY_PASS_CREDITS_PER_PURCHASE,
} from "@/lib/limits/generation-limits";
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

  // NEW PRICING MODEL:
  //   - single_report ($2.99): unlock THIS session only. Nothing else.
  //   - birthday_pass ($4.99): grant 10 full-report credits AND unlock
  //       the current session (so the user who just paid sees their
  //       current report unlock immediately without consuming a credit).
  //
  // Purchase type comes from the checkout metadata we set ourselves.
  // Falls back to inferring from Stripe session mode for legacy events.
  const metaType = session.metadata?.purchaseType as
    | "single_report"
    | "birthday_pass"
    | "one_time"
    | "monthly"
    | undefined;
  const purchaseType: "single_report" | "birthday_pass" =
    metaType === "birthday_pass" || metaType === "monthly"
      ? "birthday_pass"
      : "single_report";
  const isPass = purchaseType === "birthday_pass";
  // Keep tier values distinct in the DB so analytics queries can tell
  // apart single-report buyers from pass holders.
  const dbTier = isPass ? "birthday_pass" : "single_report";

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

    // Birthday Pass: grant N full-report credits. Stacks if purchased
    // again. The credits are consumed on subsequent NEW-session
    // generations (not on viewing an already-unlocked report).
    if (isPass) {
      await grantBirthdayPass(
        ipHash,
        deviceToken,
        BIRTHDAY_PASS_CREDITS_PER_PURCHASE,
      );
    }

    // ALWAYS unlock the current session regardless of plan. A pass
    // buyer who's paying from inside a specific report expects that
    // report unlocked immediately — they don't want to burn a credit
    // on it. Credits are for FUTURE sessions.
    if (sessionId) {
      await redis.set(`gen:session:${sessionId}:paid`, "true", {
        ex: SESSION_PAID_TTL_SECONDS,
      });
      await redis.set(`gen:session:${sessionId}:unlock_type`, purchaseType, {
        ex: SESSION_PAID_TTL_SECONDS,
      });
    }
  } else if (email) {
    // Edge case: checkout completed with email but no deviceToken.
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

      if (isPass) {
        await grantBirthdayPass(
          ipHash,
          null,
          BIRTHDAY_PASS_CREDITS_PER_PURCHASE,
        );
      }

      if (sessionId) {
        await getRedis().set(`gen:session:${sessionId}:paid`, "true", {
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
    let sent = await sendBirthdayReport(email, sessionId, isPass);
    if (!sent) {
      await new Promise((r) => setTimeout(r, 2000));
      sent = await sendBirthdayReport(email, sessionId, isPass);
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
    case "invoice.payment_succeeded":
      // Monthly renewal of a Birthday Pass subscription → refresh
      // 10 credits for the caller. We don't reset `credits_used` to 0;
      // we just add 10 more to `credits_total`. This way a user who
      // burned 7 of last month's 10 now has 13 credits total — fine,
      // slight upside to the user if they don't use all credits.
      await handleInvoicePaid(event.data.object);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object);
      break;
  }

  return NextResponse.json({ received: true });
}

/**
 * Handle a Stripe `invoice.payment_succeeded` event — the recurring
 * monthly renewal of a Birthday Pass subscription. Adds a fresh batch
 * of credits to the subscriber's pass balance so they can generate
 * another 10 reports this billing period.
 *
 * The FIRST invoice after checkout also fires this event. We use
 * `billing_reason` to distinguish the first-billing invoice (credits
 * already granted by the checkout.session.completed handler) from
 * renewal invoices (where we should top up).
 */
async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  // Only top up on actual renewals. The first invoice after a new
  // subscription has billing_reason === "subscription_create" and is
  // already handled by the checkout.session.completed path.
  if (invoice.billing_reason !== "subscription_cycle") {
    return;
  }

  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;
  if (!customerId) return;

  const db = getDb();
  const row = await db
    .select({
      deviceToken: userWaitlist.deviceToken,
      ipHash: userWaitlist.ipHash,
    })
    .from(userWaitlist)
    .where(eq(userWaitlist.stripeCustomerId, customerId))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!row) {
    console.warn(
      JSON.stringify({
        level: "warn",
        msg: "pass:renewal_no_user",
        customerId,
      }),
    );
    return;
  }

  await grantBirthdayPass(
    row.ipHash,
    row.deviceToken,
    BIRTHDAY_PASS_CREDITS_PER_PURCHASE,
  );

  console.log(
    JSON.stringify({
      level: "info",
      msg: "pass:renewed",
      customerId,
      creditsAdded: BIRTHDAY_PASS_CREDITS_PER_PURCHASE,
    }),
  );
}
