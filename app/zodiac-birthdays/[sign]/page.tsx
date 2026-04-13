import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContentPage, generateContentMetadata } from "@/lib/content/render";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { zodiacSigns } from "@/lib/content/taxonomy";

type PageProps = { params: Promise<{ sign: string }> };

export async function generateStaticParams() {
  return zodiacSigns.map((sign) => ({ sign: `${sign}-birthday-ideas` }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sign } = await params;
  const page = getContentPage(`/zodiac-birthdays/${sign}`);
  if (!page) return { title: "Not Found" };
  return generateContentMetadata(page);
}

export default async function ZodiacPage({ params }: PageProps) {
  const { sign } = await params;
  const page = getContentPage(`/zodiac-birthdays/${sign}`);
  if (!page) notFound();
  return <ContentPageLayout page={page} />;
}
