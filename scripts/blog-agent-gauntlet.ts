/**
 * Blog Agent Validation Gauntlet
 *
 * Runs generateDraft + runQualityGates for 6 pre-picked seeds spanning
 * all 5 categories. No DB writes, no HTTP — just the raw agent output.
 *
 * Usage:  dotenv -e .env.local -- tsx scripts/blog-agent-gauntlet.ts
 *
 * Output: tmp/gauntlet-<timestamp>/
 *   - draft-<seedId>.json   (full draft)
 *   - gates-<seedId>.json   (gate report)
 *   - summary.json          (aggregate stats)
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { findSeedById } from "@/lib/blog-agent/seeds";
import { scoreSeeds } from "@/lib/blog-agent/scoring";
import { generateDraft } from "@/lib/blog-agent/generate";
import { runQualityGates } from "@/lib/blog-agent/quality-gates";

// Deliberately mixed — not cherry-picked for easiness.
const GAUNTLET_SEEDS = [
  "checklist-birthday-party-planning", // planning, structural
  "decorations-dark-feminine",         // planning, aesthetic + shopping
  "birthday-outfit-30th",              // style
  "april-birthday-aries",              // seasonal (in-season for April)
  "gift-ideas-best-friend",            // gifts, audience-based
  "birthday-alone-ideas",              // milestones, emotional
] as const;

async function main() {
  const stamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .split("_")
    .slice(0, 2)
    .join("_")
    .slice(0, 19);
  const outDir = join(process.cwd(), "tmp", `gauntlet-${stamp}`);
  await mkdir(outDir, { recursive: true });

  console.log(`[gauntlet] Output → ${outDir}`);
  console.log(`[gauntlet] Running ${GAUNTLET_SEEDS.length} drafts\n`);

  // No existing slugs/titles — we're testing the agent, not dedup.
  const emptySlugs = new Set<string>();
  const emptyTitles: string[] = [];

  // Score all seeds up front so we have the same score shape the route uses.
  const allScores = scoreSeeds(emptySlugs, emptyTitles);

  const summary: Array<Record<string, unknown>> = [];
  let totalCostCents = 0;
  let totalDurationMs = 0;

  for (const seedId of GAUNTLET_SEEDS) {
    const seed = findSeedById(seedId);
    if (!seed) {
      console.error(`[gauntlet] seed not found: ${seedId}`);
      continue;
    }
    const score = allScores.find((s) => s.seedId === seedId);
    if (!score) {
      console.error(`[gauntlet] score missing for ${seedId}`);
      continue;
    }

    const label = `[${seed.category}] ${seedId}`;
    console.log(`→ ${label} (score ${score.total.toFixed(2)})`);

    const t0 = Date.now();

    // Step 1 — generate. Persist immediately so a downstream bug
    // never throws away a paid-for draft.
    let generation;
    try {
      generation = await generateDraft(seed, score);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ generate failed: ${msg}`);
      summary.push({
        seedId,
        category: seed.category,
        stage: "generate",
        error: msg,
        durationMs: Date.now() - t0,
      });
      await writeFile(
        join(outDir, `error-${seedId}.txt`),
        msg + "\n" + (err instanceof Error ? err.stack : ""),
      );
      continue;
    }

    totalCostCents += generation.estimatedCostCents;
    totalDurationMs += generation.durationMs;
    await writeFile(
      join(outDir, `draft-${seedId}.json`),
      JSON.stringify(generation.draft, null, 2),
    );

    // Step 2 — gates. A crash here still leaves the draft on disk.
    let gates;
    try {
      gates = runQualityGates(generation.draft, emptySlugs, emptyTitles, seed.titleHint);
      await writeFile(
        join(outDir, `gates-${seedId}.json`),
        JSON.stringify(gates, null, 2),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ! gates crashed (draft saved): ${msg}`);
      await writeFile(
        join(outDir, `gate-error-${seedId}.txt`),
        msg + "\n" + (err instanceof Error ? err.stack : ""),
      );
      summary.push({
        seedId,
        category: seed.category,
        title: generation.draft.title,
        slug: generation.draft.slug,
        sectionCount: generation.draft.sections.length,
        stage: "gates",
        error: msg,
        costCents: generation.estimatedCostCents,
        durationMs: generation.durationMs,
      });
      continue;
    }

    const row = {
      seedId,
      category: seed.category,
      title: generation.draft.title,
      slug: generation.draft.slug,
      sectionCount: generation.draft.sections.length,
      sectionTypes: generation.draft.sections.map((s) => s.type),
      gatesPassed: gates.passed,
      gatesTotal: gates.total,
      allPassed: gates.allPassed,
      failedGates: gates.results.filter((g) => !g.passed).map((g) => g.gate),
      costCents: generation.estimatedCostCents,
      durationMs: generation.durationMs,
      tokenUsage: generation.tokenUsage,
    };
    summary.push(row);

    console.log(
      `  ✓ ${generation.draft.sections.length} sections, ` +
        `${gates.passed}/${gates.total} gates, ` +
        `${(generation.durationMs / 1000).toFixed(1)}s, ` +
        `${(generation.estimatedCostCents / 100).toFixed(2)}$`,
    );
    if (!gates.allPassed) {
      console.log(`    failed: ${row.failedGates.join(", ")}`);
    }
  }

  await writeFile(
    join(outDir, "summary.json"),
    JSON.stringify(
      {
        ranAt: new Date().toISOString(),
        seedsRun: GAUNTLET_SEEDS.length,
        totalCostCents,
        totalDurationMs,
        results: summary,
      },
      null,
      2,
    ),
  );

  console.log(
    `\n[gauntlet] done. total: ${(totalCostCents / 100).toFixed(2)}$ ` +
      `over ${(totalDurationMs / 1000).toFixed(1)}s`,
  );
  console.log(`[gauntlet] summary → ${outDir}/summary.json`);
}

main().catch((err) => {
  console.error("[gauntlet] fatal:", err);
  process.exit(1);
});
