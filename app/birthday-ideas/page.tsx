import type { Metadata } from "next";
import { getContentPagesByCategory } from "@/lib/content/render";
import { HubPage } from "@/components/content/HubPage";

export const metadata: Metadata = {
  title: "Birthday Ideas (2026) — How to Celebrate by Vibe & Age | You The Birthday",
  description: "Birthday ideas for every vibe — luxury, soft life, adventure, intimate, solo, and more. Find the right celebration for your age and energy.",
  alternates: { canonical: "/birthday-ideas" },
};

export default function IdeasHub() {
  const pages = getContentPagesByCategory("ideas");
  return (
    <HubPage
      title="Birthday Ideas"
      description="Find your perfect birthday celebration by age, vibe, or style."
      pages={pages}
      category="ideas"
    />
  );
}
