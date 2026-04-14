import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/birthday/", "/api/", "/admin/"],
      },
    ],
    sitemap: "https://youthebirthday.app/sitemap.xml",
  };
}
