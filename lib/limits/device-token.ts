// Client-side only — localStorage device fingerprint

export function getOrCreateDeviceToken(): string {
  if (typeof window === "undefined") return "";
  const key = "ytb-token";
  let token = localStorage.getItem(key);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(key, token);
  }
  return token;
}

export function getLocalGenerationCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("ytb-gen-count") ?? "0", 10);
}

export function incrementLocalCount(): void {
  if (typeof window === "undefined") return;
  const current = getLocalGenerationCount();
  localStorage.setItem("ytb-gen-count", String(current + 1));
}
