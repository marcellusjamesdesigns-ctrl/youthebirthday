import { gateway } from "@ai-sdk/gateway";

// AI Gateway — reads AI_GATEWAY_API_KEY or VERCEL_OIDC_TOKEN automatically
export const DEFAULT_MODEL = gateway("anthropic/claude-sonnet-4.6");
export const DEFAULT_MODEL_ID = "anthropic/claude-sonnet-4.6";
