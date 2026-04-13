"use client";

import { useOnboardingStore } from "@/stores/onboarding";
import { budgetOptions, groupSizeOptions } from "@/lib/validators/birthday-input";

const budgetLabels: Record<string, string> = {
  budget: "Budget-friendly",
  mid: "Treat yourself",
  luxury: "Go all out",
};

const groupLabels: Record<string, string> = {
  solo: "Just me",
  partner: "Me + one",
  small: "Small group",
  large: "Big celebration",
};

export function StepPreferences() {
  const {
    pronoun, budget, groupSize, foodVibe, aestheticPreference,
    setField, nextStep, prevStep,
  } = useOnboardingStore();

  return (
    <div className="space-y-8 animate-fade-rise">
      <div className="text-center space-y-3">
        <h1 className="heading-editorial text-3xl sm:text-4xl">
          Fine-tune your experience
        </h1>
        <p className="text-sm text-muted-foreground">
          All optional — skip what doesn&apos;t apply.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="pronoun" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Pronouns (optional)
          </label>
          <input
            id="pronoun"
            placeholder="she/her, he/him, they/them..."
            value={pronoun}
            onChange={(e) => setField("pronoun", e.target.value)}
            maxLength={20}
            className="luxury-input w-full px-4 py-3.5 text-base"
          />
        </div>

        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">Budget</p>
          <div className="grid grid-cols-3 gap-2">
            {budgetOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setField("budget", budget === opt ? "" : opt)}
                className={`luxury-card px-3 py-3 text-sm transition-all ${
                  budget === opt
                    ? "selection-active"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {budgetLabels[opt]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">Celebration size</p>
          <div className="grid grid-cols-2 gap-2">
            {groupSizeOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setField("groupSize", groupSize === opt ? "" : opt)}
                className={`luxury-card px-3 py-3 text-sm transition-all ${
                  groupSize === opt
                    ? "selection-active"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {groupLabels[opt]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="foodVibe" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Food vibe (optional)
          </label>
          <input
            id="foodVibe"
            placeholder="Sushi, steak, vegan, brunch..."
            value={foodVibe}
            onChange={(e) => setField("foodVibe", e.target.value)}
            maxLength={100}
            className="luxury-input w-full px-4 py-3.5 text-base"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="aesthetic" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Aesthetic (optional)
          </label>
          <input
            id="aesthetic"
            placeholder="Minimalist, Y2K, old money, cottagecore..."
            value={aestheticPreference}
            onChange={(e) => setField("aestheticPreference", e.target.value)}
            maxLength={100}
            className="luxury-input w-full px-4 py-3.5 text-base"
          />
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
          className="flex-1 rounded-full bg-foreground py-3.5 text-[15px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
