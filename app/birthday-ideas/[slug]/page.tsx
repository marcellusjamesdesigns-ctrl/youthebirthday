import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContentPage, generateContentMetadata, generateStaticSlugs } from "@/lib/content/render";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return generateStaticSlugs("ideas")
    .filter((slug) => !slug.includes("/"))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getContentPage(`/birthday-ideas/${slug}`);
  if (!page) return { title: "Not Found" };
  return generateContentMetadata(page);
}

export default async function IdeaPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getContentPage(`/birthday-ideas/${slug}`);
  if (!page) notFound();
  return <ContentPageLayout page={page} />;
}
