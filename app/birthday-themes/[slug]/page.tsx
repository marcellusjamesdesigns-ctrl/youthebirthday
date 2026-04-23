import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { generateContentMetadata, generateStaticSlugs } from "@/lib/content/render";
import { getContentPageAsync } from "@/lib/traffic-db";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";

export const dynamicParams = true;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return generateStaticSlugs("themes").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getContentPageAsync(`/birthday-themes/${slug}`);
  if (!page) return { title: "Not Found" };
  return generateContentMetadata(page);
}

export default async function ThemePage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getContentPageAsync(`/birthday-themes/${slug}`);
  if (!page) notFound();
  return <ContentPageLayout page={page} />;
}
