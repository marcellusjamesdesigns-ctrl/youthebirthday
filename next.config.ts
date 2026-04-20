import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  async redirects() {
    return [
      // Normalized canonical paths for ideas: the legacy /birthday-ideas/vibe/*
      // route has been retired. Redirect permanently to preserve any existing
      // backlinks or indexed URLs.
      {
        source: "/birthday-ideas/vibe/solo-birthday-ideas",
        destination: "/birthday-ideas/solo-birthday-ideas",
        permanent: true,
      },
      {
        source: "/birthday-ideas/vibe/romantic-birthday-ideas",
        destination: "/birthday-ideas/romantic-birthday-ideas",
        permanent: true,
      },
      {
        source: "/birthday-ideas/vibe/soft-life-birthday-ideas",
        destination: "/birthday-ideas/soft-life-birthday-ideas",
        permanent: true,
      },
      // Catch-all for any other legacy /birthday-ideas/vibe/[slug] URLs:
      // strip the /vibe/ segment.
      {
        source: "/birthday-ideas/vibe/:slug",
        destination: "/birthday-ideas/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
};

export default withWorkflow(nextConfig);
