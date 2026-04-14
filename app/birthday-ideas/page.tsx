import type { Metadata } from "next";
import { getContentPagesByCategory } from "@/lib/content/render";
import { HubPage } from "@/components/content/HubPage";

export const metadata: Metadata = {
  title: "Birthday Ideas for Adults (2026) — Dinner, Trips & Party Ideas",
  description: "Birthday ideas for every budget and vibe — dinner ideas, trip ideas, party themes, solo celebrations, and romantic plans. Ideas for your 21st through 50th.",
  alternates: { canonical: "/birthday-ideas" },
};

export default function IdeasHub() {
  const pages = getContentPagesByCategory("ideas");
  return (
    <HubPage
      title="Birthday Ideas"
      description="Birthday ideas for adults — dinner ideas, trip plans, party themes, solo celebrations, and romantic plans for every age and budget."
      pages={pages}
      category="ideas"
    />
  );
}
