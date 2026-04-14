import type { Metadata } from "next";
import { getContentPagesByCategory } from "@/lib/content/render";
import { HubPage } from "@/components/content/HubPage";

export const metadata: Metadata = {
  title: "Birthday Party Color Schemes & Palettes (2026) — Hex Codes",
  description: "Birthday color palettes with hex codes for decorations, outfits, and invitations. Luxury gold, soft pastels, bold neon, earthy tones, and seasonal palettes.",
  alternates: { canonical: "/birthday-palettes" },
};

export default function PalettesHub() {
  const pages = getContentPagesByCategory("palettes");
  return (
    <HubPage
      title="Birthday Color Palettes"
      description="Color palettes for birthday decorations, outfits, and themes — with hex codes you can copy."
      pages={pages}
      category="palettes"
    />
  );
}
