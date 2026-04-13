import type { Metadata } from "next";
import { getContentPagesByCategory } from "@/lib/content/render";
import { HubPage } from "@/components/content/HubPage";

export const metadata: Metadata = {
  title: "Birthday Theme Ideas (2026) — Full Theme Guides | You The Birthday",
  description: "Birthday theme guides by vibe — soft life, luxury, turn up, intimate, and more. Colors, food, outfits, and activities all planned out.",
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
