"use client";

import { useOnboardingStore } from "@/stores/onboarding";
import {
  celebrationVibes,
  birthdayGoalOptions,
} from "@/lib/validators/birthday-input";

export function StepVibe() {
  const {
    celebrationVibe,
    birthdayGoals,
    setField,
    nextStep,
    prevStep,
  } = useOnboardingStore();

  function toggleGoal(goal: string) {
    const current = birthdayGoals;
    if (current.includes(goal)) {
      setField("birthdayGoals", current.filter((g) => g !== goal));
    } else if (current.length < 5) {
      setField("birthdayGoals", [...current, goal]);
    }
  }

  const canContinue = celebrationVibe.length > 0 && birthdayGoals.length > 0;

  return (
    <div className="space-y-8 animate-fade-rise">
      <div className="text-center space-y-3">
        <h1 className="heading-editorial text-3xl sm:text-4xl">
          What&apos;s the vibe?
        </h1>
        <p className="text-sm text-muted-foreground">
          Pick the energy that fits your birthday this year.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Celebration vibe
          </p>
          <div className="grid grid-cols-2 gap-2">
            {celebrationVibes.map((vibe) => (
              <button
                key={vibe}
                onClick={() => setField("celebrationVibe", vibe)}
                className={`luxury-card px-4 py-3 text-sm text-left transition-all ${
                  celebrationVibe === vibe
                    ? "selection-active"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {vibe}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Birthday goals (pick up to 5)
          </p>
          <div className="flex flex-wrap gap-2">
            {birthdayGoalOptions.map((goal) => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                  birthdayGoals.includes(goal)
                    ? "selection-active"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
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
          disabled={!canContinue}
          className="flex-1 rounded-full bg-foreground py-3.5 text-[15px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
