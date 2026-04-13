import type { Metadata } from "next";
import { getContentPagesByCategory } from "@/lib/content/render";
import { HubPage } from "@/components/content/HubPage";

export const metadata: Metadata = {
  title: "Birthday Color Palettes (2026) — Colors & Hex Codes | You The Birthday",
  description: "Birthday color palette inspiration with hex codes. Luxury, soft, bold, earthy, and seasonal palettes for decorations, outfits, and themes.",
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
