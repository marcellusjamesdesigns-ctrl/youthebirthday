"use client";

import type { StepStatusMap } from "@/lib/db/schema";

const stepLabels: Record<keyof StepStatusMap, string> = {
  identity: "Finding your era",
  palettes: "Matching your colors",
  captions: "Writing your captions",
  destinations: "Mapping your travel vibe",
  celebrationStyle: "Designing your celebration",
  restaurants: "Looking for your dinner spots",
  cosmic: "Reading the stars",
};

const stepOrder: (keyof StepStatusMap)[] = [
  "identity",
  "palettes",
  "captions",
  "destinations",
  "celebrationStyle",
  "restaurants",
  "cosmic",
];

interface StreamingStatusProps {
  sessionId: string;
  stepStatus: StepStatusMap | null;
}

export function StreamingStatus({ stepStatus }: StreamingStatusProps) {
  if (!stepStatus) {
    return (
      <div role="status" aria-live="polite" aria-label="Generating your birthday experience" className="mx-auto max-w-md text-center space-y-6 mt-12 animate-fade-rise">
        <p className="text-sm text-muted-foreground animate-gentle-pulse italic font-editorial">
          Assembling your birthday...
        </p>
        <div className="h-[1px] bg-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-champagne/30 to-transparent animate-[shimmer-sweep_2s_ease-in-out_infinite]" />
        </div>
      </div>
    );
  }

  const completedCount = stepOrder.filter(
    (step) => stepStatus[step] === "complete" || stepStatus[step] === "skipped"
  ).length;
  const totalSteps = stepOrder.filter(
    (step) => stepStatus[step] !== "skipped"
  ).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const currentStep = stepOrder.find((step) => stepStatus[step] === "running");
  const currentLabel = currentStep ? stepLabels[currentStep] : "Finishing up...";

  return (
    <div role="status" aria-live="polite" aria-label={`Generation progress: ${progressPercent}%`} className="mx-auto max-w-md text-center space-y-6 mt-12 animate-fade-rise">
      <p className="text-sm text-muted-foreground animate-gentle-pulse italic font-editorial">
        {currentLabel}
      </p>
      <div className="h-[1px] bg-border relative">
        <div
          className="h-[1px] bg-champagne/50 transition-all duration-1000 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {stepOrder
          .filter((step) => stepStatus[step] !== "skipped")
          .map((step) => (
            <span
              key={step}
              className={`text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full transition-all ${
                stepStatus[step] === "complete"
                  ? "border border-champagne/20 text-champagne/70 bg-champagne/5"
                  : stepStatus[step] === "running"
                  ? "border border-champagne/10 text-champagne/50 animate-gentle-pulse"
                  : "border border-border/50 text-muted-foreground/40"
              }`}
            >
              {stepLabels[step]}
            </span>
          ))}
      </div>
    </div>
  );
}
