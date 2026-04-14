import type { Metadata } from "next";
import { getContentPagesByCategory } from "@/lib/content/render";
import { HubPage } from "@/components/content/HubPage";

export const metadata: Metadata = {
  title: "Birthday Captions for Instagram (2026) — Copy & Paste",
  description: "150+ birthday captions for Instagram — funny, cute, short, and aesthetic. Captions for your 21st, 25th, 30th, 40th, and 50th birthday. Copy and paste ready.",
  alternates: { canonical: "/birthday-captions" },
};

export default function CaptionsHub() {
  const pages = getContentPagesByCategory("captions");
  return (
    <HubPage
      title="Birthday Captions for Instagram"
      description="The best birthday captions for Instagram by age, vibe, and zodiac sign — funny, cute, short, aesthetic, and luxury. Click any caption to copy it."
      pages={pages}
      category="captions"
    />
  );
}
