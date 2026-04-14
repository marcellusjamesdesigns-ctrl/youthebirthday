import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/content/types";

export function BlogRelatedPosts({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="space-y-5">
      <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
        Keep Reading
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={post.canonicalPath}
            className="group block rounded-xl overflow-hidden bg-card/40 hover:bg-card/60 transition-colors"
          >
            <div className="relative aspect-[16/9] bg-card">
              <Image
                src={post.heroImage.src}
                alt={post.heroImage.alt}
                fill
                sizes="(max-width: 768px) 100vw, 384px"
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                unoptimized
              />
            </div>
            <div className="p-4 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">
                {post.category}
              </p>
              <h3 className="font-editorial text-base text-foreground/85 leading-snug group-hover:text-foreground transition-colors">
                {post.headline}
              </h3>
              <p className="text-[12px] text-muted-foreground/60 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
