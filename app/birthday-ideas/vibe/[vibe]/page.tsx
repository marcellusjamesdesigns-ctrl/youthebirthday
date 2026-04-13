import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContentPage, generateContentMetadata } from "@/lib/content/render";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { getContentPagesByCategory } from "@/lib/content/render";

type PageProps = { params: Promise<{ vibe: string }> };

export async function generateStaticParams() {
  return getContentPagesByCategory("ideas")
    .filter((p) => p.canonicalPath.startsWith("/birthday-ideas/vibe/"))
    .map((p) => ({ vibe: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { vibe } = await params;
  const page = getContentPage(`/birthday-ideas/vibe/${vibe}`);
  if (!page) return { title: "Not Found" };
  return generateContentMetadata(page);
}

export default async function VibeIdeaPage({ params }: PageProps) {
  const { vibe } = await params;
  const page = getContentPage(`/birthday-ideas/vibe/${vibe}`);
  if (!page) notFound();
  return <ContentPageLayout page={page} />;
}
