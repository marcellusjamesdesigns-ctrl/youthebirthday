import { gateway } from "@ai-sdk/gateway";

// AI Gateway — reads AI_GATEWAY_API_KEY or VERCEL_OIDC_TOKEN automatically
// Sonnet for creative steps (identity, captions, palettes, celebration, cosmic)
export const DEFAULT_MODEL = gateway("anthropic/claude-sonnet-4.6");
export const DEFAULT_MODEL_ID = "anthropic/claude-sonnet-4.6";

// Haiku for factual/lookup steps (restaurants, activities, destinations)
// 75% cheaper: $0.80/M input + $4/M output vs $3/M + $15/M
export const FAST_MODEL = gateway("anthropic/claude-haiku-4.5");
export const FAST_MODEL_ID = "anthropic/claude-haiku-4.5";
