import { createHash } from "crypto";

export function hashPromptInputs(inputs: Record<string, string | number | string[]>): string {
  const normalized = Object.keys(inputs)
    .sort()
    .map((key) => {
      const val = inputs[key];
      return `${key}:${Array.isArray(val) ? val.sort().join(",") : val}`;
    })
    .join("|");

  return createHash("sha256").update(normalized).digest("hex");
}
