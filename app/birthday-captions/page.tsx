import type { Metadata } from "next";
import { getContentPagesByCategory } from "@/lib/content/render";
import { HubPage } from "@/components/content/HubPage";

export const metadata: Metadata = {
  title: "Birthday Captions for Instagram (2026) — Copy & Post | You The Birthday",
  description: "The best birthday captions for Instagram by age, zodiac sign, and vibe. Hype, soft, funny, luxury — find yours and copy it.",
  alternates: { canonical: "/birthday-captions" },
};

export default function CaptionsHub() {
  const pages = getContentPagesByCategory("captions");
  return (
    <HubPage
      title="Birthday Captions for Instagram"
      description="Find the perfect birthday caption by age, vibe, or zodiac sign. Click any caption to copy it."
      pages={pages}
      category="captions"
    />
  );
}
