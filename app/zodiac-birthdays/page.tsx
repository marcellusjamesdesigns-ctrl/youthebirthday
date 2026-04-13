import type { Metadata } from "next";
import { getContentPagesByCategory } from "@/lib/content/render";
import { HubPage } from "@/components/content/HubPage";

export const metadata: Metadata = {
  title: "Birthday Ideas by Zodiac Sign (2026) | You The Birthday",
  description: "Birthday ideas, destinations, captions, and celebration styles for every zodiac sign. Find what matches your sign's energy.",
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
