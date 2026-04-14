import type { Metadata } from "next";
import { getContentPagesByCategory } from "@/lib/content/render";
import { HubPage } from "@/components/content/HubPage";

export const metadata: Metadata = {
  title: "Best Birthday Trip Ideas & Destinations (2026)",
  description: "Where to go for your birthday — luxury getaways, solo trips, beach escapes, and budget-friendly destinations. Birthday trip ideas by vibe, season, and budget.",
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
