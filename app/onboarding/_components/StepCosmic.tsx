"use client";

import { useOnboardingStore } from "@/stores/onboarding";

export function StepCosmic() {
  const { mode, birthTime, birthCity, setField, nextStep, prevStep } =
    useOnboardingStore();

  return (
    <div className="space-y-8 animate-fade-rise">
      <div className="text-center space-y-3">
        <h1 className="heading-editorial text-3xl sm:text-4xl">
          Go cosmic?
        </h1>
        <p className="text-sm text-muted-foreground">
          Add your birth time and birth city for astrology-inspired
          recommendations. Totally optional.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setField("mode", "quick")}
            className={`luxury-card p-5 text-left transition-all ${
              mode === "quick"
                ? "selection-active"
                : ""
            }`}
          >
            <p className="font-medium text-sm text-foreground">Quick Mode</p>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Birthday vibe without birth time
            </p>
          </button>
          <button
            onClick={() => setField("mode", "cosmic")}
            className={`luxury-card p-5 text-left transition-all ${
              mode === "cosmic"
                ? "selection-active-plum"
                : ""
            }`}
          >
            <p className="font-medium text-sm text-foreground">Cosmic Mode</p>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Full astro-inspired experience
            </p>
          </button>
        </div>

        {mode === "cosmic" && (
          <div className="space-y-4 pt-2 animate-fade-rise">
            <div className="space-y-2">
              <label htmlFor="birthTime" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
                Birth time (24h format)
              </label>
              <input
                id="birthTime"
                placeholder="14:30"
                value={birthTime}
                onChange={(e) => setField("birthTime", e.target.value)}
                maxLength={5}
                className="luxury-input w-full px-4 py-3.5 text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="birthCity" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
                Birth city
              </label>
              <input
                id="birthCity"
                placeholder="Where were you born?"
                value={birthCity}
                onChange={(e) => setField("birthCity", e.target.value)}
                className="luxury-input w-full px-4 py-3.5 text-base"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={prevStep}
          className="flex-1 rounded-full border border-border py-3.5 text-[15px] text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="flex-1 rounded-full bg-foreground py-3.5 text-[15px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
