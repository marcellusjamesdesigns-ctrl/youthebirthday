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

const RELATIONSHIP_OPTIONS = [
  "best friend", "partner", "parent", "sibling", "child", "coworker", "friend", "other",
];

const GIFT_BUDGET_OPTIONS: { value: string; label: string }[] = [
  { value: "under-50", label: "Under $50" },
  { value: "50-150", label: "$50–$150" },
  { value: "150-500", label: "$150–$500" },
  { value: "500+", label: "$500+" },
];

const GIFT_INTEREST_OPTIONS = [
  "wellness", "books", "home", "fashion", "travel", "tech", "experience", "food", "beauty",
];

export function StepPreferences() {
  const {
    pronoun, budget, groupSize, foodVibe, aestheticPreference,
    birthdayFor, recipientRelationship, giftBudget, giftInterests,
    setField, nextStep, prevStep,
  } = useOnboardingStore();

  function toggleInterest(interest: string) {
    if (giftInterests.includes(interest)) {
      setField("giftInterests", giftInterests.filter((i) => i !== interest));
    } else {
      setField("giftInterests", [...giftInterests, interest]);
    }
  }

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
        {/* Gift mode questions — only for "other" */}
        {birthdayFor === "other" && (
          <div className="space-y-5 pb-5 border-b border-border/20">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-champagne/60">
                Your relationship to them
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {RELATIONSHIP_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setField("recipientRelationship", recipientRelationship === opt ? "" : opt)}
                    className={`lift-card px-3 py-2.5 text-sm transition-all ${
                      recipientRelationship === opt
                        ? "selection-active"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-champagne/60">
                Gift budget
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {GIFT_BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setField("giftBudget", giftBudget === opt.value ? "" : opt.value)}
                    className={`lift-card px-3 py-2.5 text-sm transition-all ${
                      giftBudget === opt.value
                        ? "selection-active"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-champagne/60">
                What they&apos;re into (pick any)
              </p>
              <div className="flex flex-wrap gap-2">
                {GIFT_INTEREST_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInterest(opt)}
                    className={`rounded-full border px-3.5 py-1.5 text-[12px] capitalize transition-all ${
                      giftInterests.includes(opt)
                        ? "border-champagne/40 bg-champagne/10 text-champagne"
                        : "border-border/50 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

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
                className={`lift-card px-3 py-3 text-sm transition-all ${
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
                className={`lift-card px-3 py-3 text-sm transition-all ${
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
