import { useEffect, useState } from "react";
import { getOrCreateDeviceToken } from "./device-token";

export type PurchaseType =
  | "single_report"
  | "birthday_pass"
  | "none"
  | "unknown"
  // Legacy values preserved for backward compat
  | "one_time"
  | "subscription";

export interface PassCredits {
  total: number;
  used: number;
  remaining: number;
}

interface PremiumState {
  /**
   * True if the named session is unlocked (full report visible).
   * A session is unlocked when the user either:
   *   - paid the single-report fee for this session, OR
   *   - paid (or auto-consumed a credit from) their Birthday Pass
   */
  isPremium: boolean;
  /**
   * Legacy field kept for components that reference it. Reflects
   * purchaseType of the CURRENT SESSION (not the caller's account).
   */
  purchaseType: PurchaseType;
  /**
   * True if the caller has an active Birthday Pass with >0 credits
   * remaining. Used to show pass status in the UI.
   */
  hasActivePass: boolean;
  /** Pass credit balance, or null if no pass. */
  passCredits: PassCredits | null;
}

export function useIsPremium(sessionId?: string | null): boolean {
  return usePremiumState(sessionId).isPremium;
}

export function usePremiumState(sessionId?: string | null): PremiumState {
  const [state, setState] = useState<PremiumState>({
    isPremium: false,
    purchaseType: "unknown",
    hasActivePass: false,
    passCredits: null,
  });

  useEffect(() => {
    const token = getOrCreateDeviceToken();
    if (!token) return;

    const url = sessionId
      ? `/api/user/tier?sessionId=${encodeURIComponent(sessionId)}`
      : "/api/user/tier";

    fetch(url, { headers: { "X-Device-Token": token } })
      .then((r) => r.json())
      .then((d) => {
        const isPremium = d.isPaidForSession === true;
        const purchaseType: PurchaseType =
          d.tier === "birthday_pass"
            ? "birthday_pass"
            : d.tier === "single_report"
              ? "single_report"
              : d.tier === "premium"
                ? "subscription"
                : isPremium
                  ? "single_report"
                  : "none";

        setState({
          isPremium,
          purchaseType,
          hasActivePass: !!d.hasActivePass,
          passCredits: d.passCredits ?? null,
        });
      })
      .catch(() => {});
  }, [sessionId]);

  return state;
}
