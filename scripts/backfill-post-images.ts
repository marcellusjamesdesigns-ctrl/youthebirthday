/**
 * One-shot: backfill Unsplash images for an existing blog draft.
 *
 * Usage: dotenv -e .env.local -- tsx scripts/backfill-post-images.ts <slug>
 */

import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { searchUnsplashImage } from "@/lib/blog-agent/unsplash";
import type { BlogPost } from "@/lib/content/types";

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("usage: backfill-post-images.ts <slug>");
    process.exit(1);
  }

  const db = getDb();

  // Find the draft by slug (stored inside postData JSON)
  const all = await db
    .select()
    .from(blogDrafts)
    .orderBy(desc(blogDrafts.createdAt))
    .limit(50);

  const target = all.find((d) => {
    const p = d.postData as BlogPost | null;
    return p?.slug === slug;
  });

  if (!target) {
    console.error(`No draft found with slug: ${slug}`);
    process.exit(1);
  }

  const post = target.postData as BlogPost;
  console.log(`Found draft: ${target.id} | "${post.title}"`);
  console.log(`Status: ${target.status} | Sections: ${post.sections.length}`);

  // Resolve hero image
  console.log("\nResolving hero image...");
  const heroQuery = post.heroImage.alt ?? post.title;
  const hero = await searchUnsplashImage(heroQuery, "landscape");
  console.log(`  Hero: ${hero.src.slice(0, 60)}...`);

  // Resolve pinterest image
  let pinterest: { src: string; alt: string } | undefined = post.pinterestImage;
  if (post.pinterestImage) {
    console.log("Resolving pinterest image...");
    const pin = await searchUnsplashImage(post.pinterestImage.alt ?? post.title, "portrait");
    pinterest = { src: pin.src, alt: pin.alt };
    console.log(`  Pinterest: ${pin.src.slice(0, 60)}...`);
  }

  // Resolve image sections
  console.log("\nResolving image sections...");
  const newSections = await Promise.all(
    post.sections.map(async (section) => {
      if (section.type !== "image") return section;
      const s = section as { type: "image"; src: string; alt: string; suggestedSearchQuery?: string; caption?: string; credit?: string; creditUrl?: string; ratio?: string };
      const query = s.suggestedSearchQuery ?? s.alt ?? "birthday celebration";
      const img = await searchUnsplashImage(query, "landscape");
      console.log(`  Section: "${query.slice(0, 40)}" → ${img.src.slice(0, 50)}...`);
      return {
        ...s,
        src: img.src,
        alt: img.alt,
        credit: img.credit,
        creditUrl: img.creditUrl,
      };
    }),
  );

  // Update postData with resolved images
  const updated: BlogPost = {
    ...post,
    heroImage: hero,
    pinterestImage: pinterest,
    sections: newSections as BlogPost["sections"],
  };

  await db
    .update(blogDrafts)
    .set({ postData: updated as unknown as Record<string, unknown> })
    .where(eq(blogDrafts.id, target.id));

  console.log("\n✓ Updated draft in DB.");
  console.log("Visit /blog/" + slug + " — wait up to 60s for ISR cache to revalidate.");
}

main().catch((err) => {
  console.error("fatal:", err);
  process.exit(1);
});
