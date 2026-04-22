import posthog from "posthog-js";

// PostHog project key comes from env. Fallback preserved for local dev
// and older deploys, but the intent is to set NEXT_PUBLIC_POSTHOG_KEY
// to the dedicated "You The Birthday" project key in production so
// events don't merge with other Flolo apps.
const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ??
  "phc_TNaCbsRAPyoPFBPucE9yjEwO605pdPQdWuPVnB3R14t";

const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

posthog.init(POSTHOG_KEY, {
  api_host: POSTHOG_HOST,
  person_profiles: "identified_only",
  capture_pageview: true,
  capture_pageleave: true,
  // Tag every event with the app source. Even if two projects ever
  // share a PostHog project again, you can filter by `$app` to isolate
  // You The Birthday traffic.
  loaded: (ph) => {
    ph.register({ $app: "youthebirthday" });
  },
});
