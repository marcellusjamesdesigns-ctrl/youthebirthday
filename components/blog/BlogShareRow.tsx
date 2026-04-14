"use client";

import { useState } from "react";

interface BlogShareRowProps {
  title: string;
  url: string;              // full canonical URL
  pinterestImage?: string;  // optional vertical image for pinning
  description?: string;     // post description for share meta
}

export function BlogShareRow({ title, url, pinterestImage, description }: BlogShareRowProps) {
  const [copied, setCopied] = useState(false);

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(pinterestImage ?? "")}&description=${encodeURIComponent(description ?? title)}`;

  function track(network: string) {
    if (typeof window !== "undefined" && "posthog" in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).posthog?.capture("blog_share_clicked", { network, url });
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      track("copy");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40">
        Share
      </span>
      <div className="flex items-center gap-1.5">
        <ShareButton label="Share on X" onClick={() => track("x")} href={xUrl}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </ShareButton>
        <ShareButton label="Save to Pinterest" onClick={() => track("pinterest")} href={pinterestUrl}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .86.331 1.781.745 2.281a.3.3 0 0 1 .069.287c-.075.312-.243.988-.276 1.127-.043.183-.143.222-.33.134-1.238-.575-2.013-2.388-2.013-3.84 0-3.127 2.272-5.998 6.554-5.998 3.443 0 6.116 2.452 6.116 5.73 0 3.42-2.157 6.176-5.153 6.176-1.005 0-1.951-.523-2.275-1.141 0 0-.497 1.895-.618 2.36-.224.866-.829 1.95-1.234 2.611A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
          </svg>
        </ShareButton>
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy link"
          className="flex items-center gap-1.5 rounded-full border border-border/40 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 hover:text-foreground/80 hover:border-foreground/20 transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function ShareButton({
  children,
  label,
  href,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  href: string;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center w-7 h-7 rounded-full border border-border/40 text-muted-foreground/60 hover:text-foreground/80 hover:border-foreground/20 transition-all"
    >
      {children}
    </a>
  );
}
