import posthog from "posthog-js";

posthog.init("phc_TNaCbsRAPyoPFBPucE9yjEwO605pdPQdWuPVnB3R14t", {
  api_host: "https://us.i.posthog.com",
  person_profiles: "identified_only",
  capture_pageview: true,
  capture_pageleave: true,
});
