import { useEffect, useState } from "react";
import { getOrCreateDeviceToken } from "./device-token";

export type PurchaseType = "one_time" | "subscription" | "unknown";

interface PremiumState {
  isPremium: boolean;
  purchaseType: PurchaseType;
}

export function useIsPremium(): boolean {
  return usePremiumState().isPremium;
}

export function usePremiumState(): PremiumState {
  const [state, setState] = useState<PremiumState>({
    isPremium: false,
    purchaseType: "unknown",
  });

  useEffect(() => {
    const token = getOrCreateDeviceToken();
    if (!token) return;

    // Check localStorage cache first
    const cached = localStorage.getItem("ytb-premium");
    const cachedType = localStorage.getItem("ytb-purchase-type") as PurchaseType | null;
    if (cached === "true") {
      setState({ isPremium: true, purchaseType: cachedType ?? "unknown" });
      // Still check server to refresh purchaseType
    }

    // Check server
    fetch("/api/user/tier", {
      headers: { "X-Device-Token": token },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.tier === "premium") {
          const pt = d.purchaseType ?? "unknown";
          setState({ isPremium: true, purchaseType: pt });
          localStorage.setItem("ytb-premium", "true");
          localStorage.setItem("ytb-purchase-type", pt);
        }
      })
      .catch(() => {});
  }, []);

  return state;
}
