import Image from "next/image";

interface ImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  creditUrl?: string;
  ratio?: "hero" | "wide" | "square" | "portrait";
}

const RATIO_CLASSES: Record<string, string> = {
  hero: "aspect-[16/9]",
  wide: "aspect-[2/1]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
};

export function ImageBlock({ src, alt, caption, credit, creditUrl, ratio = "hero" }: ImageBlockProps) {
  return (
    <figure className="space-y-2">
      <div className={`relative w-full ${RATIO_CLASSES[ratio]} rounded-xl overflow-hidden bg-card/40`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority={ratio === "hero"}
          unoptimized
        />
      </div>
      {(caption || credit) && (
        <figcaption className="flex flex-wrap items-baseline gap-2 text-[11px] text-muted-foreground/50">
          {caption && <span className="italic">{caption}</span>}
          {credit && (
            <span className="ml-auto">
              {creditUrl ? (
                <a
                  href={creditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-muted-foreground/75 transition-colors"
                >
                  {credit}
                </a>
              ) : (
                credit
              )}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
