"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics/events";

export function TrackContentPage({ path, category }: { path: string; category: string }) {
  useEffect(() => {
    analytics.contentPageViewed({ path, category });
  }, [path, category]);

  return null;
}
