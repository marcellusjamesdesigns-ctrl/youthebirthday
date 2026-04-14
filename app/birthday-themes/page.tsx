import type { Metadata } from "next";
import { getContentPagesByCategory } from "@/lib/content/render";
import { HubPage } from "@/components/content/HubPage";

export const metadata: Metadata = {
  title: "Birthday Party Themes for Adults (2026) — Complete Guides",
  description: "Birthday party theme ideas for adults — soft life, dark feminine, old money, Y2K, and maximalist. Full guides with colors, food, outfits, and decorations.",
  alternates: { canonical: "/birthday-themes" },
};

export default function ThemesHub() {
  const pages = getContentPagesByCategory("themes");
  return (
    <HubPage
      title="Birthday Themes"
      description="Complete birthday theme guides — colors, food, outfits, music, and activities by vibe."
      pages={pages}
      category="themes"
    />
  );
}
