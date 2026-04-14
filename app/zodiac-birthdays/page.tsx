import type { Metadata } from "next";
import { getContentPagesByCategory } from "@/lib/content/render";
import { HubPage } from "@/components/content/HubPage";

export const metadata: Metadata = {
  title: "Zodiac Birthday Ideas — How to Celebrate Your Sign (2026)",
  description: "Birthday ideas for every zodiac sign — Aries through Pisces. Destinations, captions, party themes, and celebration styles matched to your sign's energy.",
  alternates: { canonical: "/zodiac-birthdays" },
};

export default function ZodiacHub() {
  const pages = getContentPagesByCategory("zodiac");
  return (
    <HubPage
      title="Birthday Ideas by Zodiac Sign"
      description="How each sign should celebrate their birthday — ideas, destinations, and captions matched to your cosmic energy."
      pages={pages}
      category="zodiac"
    />
  );
}
