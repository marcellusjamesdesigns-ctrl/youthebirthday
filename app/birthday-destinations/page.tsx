import type { Metadata } from "next";
import { getContentPagesByCategory } from "@/lib/content/render";
import { HubPage } from "@/components/content/HubPage";

export const metadata: Metadata = {
  title: "Birthday Trip Destinations (2026) — Where to Celebrate | You The Birthday",
  description: "The best birthday trip destinations worldwide by vibe, season, and budget. Luxury, solo, group, tropical, and city birthday destinations.",
  alternates: { canonical: "/birthday-destinations" },
};

export default function DestinationsHub() {
  const pages = getContentPagesByCategory("destinations");
  return (
    <HubPage
      title="Birthday Trip Destinations"
      description="Where to celebrate your birthday — by vibe, season, and how you want to feel."
      pages={pages}
      category="destinations"
    />
  );
}
