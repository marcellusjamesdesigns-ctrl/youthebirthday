import { useEffect, useState } from "react";
import { getOrCreateDeviceToken } from "./device-token";

export function useIsPremium(): boolean {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const token = getOrCreateDeviceToken();
    if (!token) return;

    // Check localStorage cache first
    const cached = localStorage.getItem("ytb-premium");
    if (cached === "true") {
      setIsPremium(true);
      return;
    }

    // Check server
    fetch("/api/user/tier", {
      headers: { "X-Device-Token": token },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.tier === "premium") {
          setIsPremium(true);
          localStorage.setItem("ytb-premium", "true");
        }
      })
      .catch(() => {});
  }, []);

  return isPremium;
}
