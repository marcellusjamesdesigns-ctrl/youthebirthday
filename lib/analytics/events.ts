import posthog from "posthog-js";

export const analytics = {
  homepageViewed: () =>
    posthog.capture("homepage_viewed"),

  onboardingStarted: () =>
    posthog.capture("onboarding_started"),

  onboardingCompleted: (props: { mode: "quick" | "cosmic" }) =>
    posthog.capture("onboarding_completed", props),

  generationCompleted: (props: { session_id: string }) =>
    posthog.capture("generation_completed", props),

  captionCopied: (props: { session_id: string; category: string }) =>
    posthog.capture("caption_copied", props),

  paletteCopied: (props: { session_id: string; palette_name: string }) =>
    posthog.capture("palette_copied", props),

  shareClicked: (props: { session_id: string; method: string }) =>
    posthog.capture("share_clicked", props),

  cardViewed: (props: { session_id: string }) =>
    posthog.capture("card_viewed", props),

  seeMorePalettes: (props: { session_id: string }) =>
    posthog.capture("see_more_palettes", props),

  generationGated: (props: { session_id: string; reason: string }) =>
    posthog.capture("generation_gated", props),

  emailCaptured: () =>
    posthog.capture("email_captured"),

  // ── Funnel events (Phase 3) ─────────────────────────────────────
  contentPageViewed: (props: { path: string; category: string }) =>
    posthog.capture("content_page_viewed", props),

  ctaClicked: (props: { source: string; destination: string }) =>
    posthog.capture("cta_clicked", props),

  premiumCheckoutStarted: (props: { plan: string; session_id?: string }) =>
    posthog.capture("premium_checkout_started", props),
};
