import { useEffect, useState } from "react";
import { getOrCreateDeviceToken } from "./device-token";

export type PurchaseType = "one_time" | "subscription" | "none" | "unknown";

interface PremiumState {
  /**
   * True only for users with an active subscription OR an already-paid
   * session (when the hook is called with a sessionId). This is the
   * correct value for UI gating "show premium content for this session."
   *
   * IMPORTANT: one-time buyers will only show isPremium=true for the
   * specific session they paid for — not for creating new sessions.
   */
  isPremium: boolean;
  purchaseType: PurchaseType;
  /** True only if the caller is a real subscriber (unlimited generations). */
  isSubscriber: boolean;
}

export function useIsPremium(sessionId?: string | null): boolean {
  return usePremiumState(sessionId).isPremium;
}

export function usePremiumState(sessionId?: string | null): PremiumState {
  const [state, setState] = useState<PremiumState>({
    isPremium: false,
    purchaseType: "unknown",
    isSubscriber: false,
  });

  useEffect(() => {
    const token = getOrCreateDeviceToken();
    if (!token) return;

    // Check localStorage cache first — only for subscriber state, since
    // session-scoped unlocks should always be verified server-side.
    const cached = localStorage.getItem("ytb-premium");
    const cachedType = localStorage.getItem("ytb-purchase-type") as PurchaseType | null;
    if (cached === "true" && cachedType === "subscription") {
      setState({
        isPremium: true,
        purchaseType: "subscription",
        isSubscriber: true,
      });
    }

    const url = sessionId
      ? `/api/user/tier?sessionId=${encodeURIComponent(sessionId)}`
      : "/api/user/tier";

    fetch(url, { headers: { "X-Device-Token": token } })
      .then((r) => r.json())
      .then((d) => {
        const pt: PurchaseType = d.purchaseType ?? "none";
        const isSubscriber = d.tier === "premium";
        const isPremium =
          isSubscriber || d.isPaidForSession === true;

        setState({ isPremium, purchaseType: pt, isSubscriber });

        // Cache ONLY the subscription flag. Session-scoped unlocks must
        // always re-verify against the server because they're tied to a
        // specific sessionId, not the device itself.
        if (isSubscriber) {
          localStorage.setItem("ytb-premium", "true");
          localStorage.setItem("ytb-purchase-type", "subscription");
        } else {
          // Non-subscribers: clear any stale cache so a one-time buyer
          // doesn't accidentally appear unlimited on their next visit.
          localStorage.removeItem("ytb-premium");
          localStorage.removeItem("ytb-purchase-type");
        }
      })
      .catch(() => {});
  }, [sessionId]);

  return state;
}
