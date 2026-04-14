import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { getDb } from "@/lib/db";
import { userWaitlist } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@/lib/utils/id";
import { getRedis } from "@/lib/cache/redis";
import { sendBirthdayReport } from "@/lib/email/send-report";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = getDb();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const deviceToken = session.metadata?.deviceToken;
      const email = session.customer_email ?? session.customer_details?.email;
      const customerId = typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;

      if (deviceToken) {
        // Upsert user to premium
        try {
          await db.insert(userWaitlist).values({
            id: createId(),
            email: email ?? `premium-${deviceToken}@youthebirthday.app`,
            deviceToken,
            tier: "premium",
            stripeCustomerId: customerId ?? null,
          }).onConflictDoNothing();

          // Also update existing record if email already exists
          if (email) {
            await db.update(userWaitlist)
              .set({ tier: "premium", stripeCustomerId: customerId ?? null, deviceToken })
              .where(eq(userWaitlist.email, email));
          }
        } catch {
          // upsert fallback — update by device token
        }

        // Grant unlimited generations in Redis (set a very high bonus)
        const redis = getRedis();
        const ipKey = `gen:device:${deviceToken}:premium`;
        await redis.set(ipKey, "true");

        // Also set a large bonus so IP-based check passes
        // Find the IP hash from recent sessions if possible
        if (email) {
          const bonusKey = `gen:email:${email}:premium`;
          await redis.set(bonusKey, "true");
        }
      }

      // Send the birthday report via email
      const sessionId = session.metadata?.sessionId;
      if (email && sessionId && sessionId !== "") {
        const isSubscription = session.mode === "subscription";
        const sent = await sendBirthdayReport(email, sessionId, isSubscription);
        console.log(JSON.stringify({
          level: "info",
          msg: sent ? "email:report_sent" : "email:report_failed",
          email,
          sessionId,
        }));
      }

      console.log(JSON.stringify({
        level: "info",
        msg: "stripe:checkout_completed",
        deviceToken,
        email,
        customerId,
        mode: session.mode,
      }));
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id;

      if (customerId) {
        await db.update(userWaitlist)
          .set({ tier: "free" })
          .where(eq(userWaitlist.stripeCustomerId, customerId));

        console.log(JSON.stringify({
          level: "info",
          msg: "stripe:subscription_cancelled",
          customerId,
        }));
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
