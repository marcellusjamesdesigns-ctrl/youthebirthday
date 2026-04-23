import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { generateContentMetadata, generateStaticSlugs } from "@/lib/content/render";
import { getContentPageAsync } from "@/lib/traffic-db";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";

// Allow on-demand rendering for pages that exist only in the DB (agent-published).
export const dynamicParams = true;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return generateStaticSlugs("captions").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getContentPageAsync(`/birthday-captions/${slug}`);
  if (!page) return { title: "Not Found" };
  return generateContentMetadata(page);
}

export default async function CaptionPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getContentPageAsync(`/birthday-captions/${slug}`);
  if (!page) notFound();
  return <ContentPageLayout page={page} />;
}
