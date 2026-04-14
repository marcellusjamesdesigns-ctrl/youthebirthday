"use client";

import { useOnboardingStore } from "@/stores/onboarding";

interface StepReviewProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  error?: string | null;
}

const BUDGET_LABELS: Record<string, string> = {
  budget: "Budget-friendly",
  mid: "Moderate",
  luxury: "Go all out",
};

const GROUP_LABELS: Record<string, string> = {
  solo: "Just me",
  partner: "Me + one",
  small: "Small group",
  large: "Big celebration",
};

export function StepReview({ onSubmit, isSubmitting, error }: StepReviewProps) {
  const store = useOnboardingStore();
  const ageTurning = store.birthYear
    ? new Date().getFullYear() - store.birthYear
    : "?";

  return (
    <div className="space-y-8 animate-fade-rise">
      <div className="text-center space-y-3">
        <h1 className="heading-editorial text-3xl sm:text-4xl">
          Ready to go
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s everything we&apos;re working with.
        </p>
      </div>

      <div className="lift-card p-6 space-y-4">

        {/* — Core — */}
        <ReviewRow label="Name" value={store.name} />
        <Divider />
        <ReviewRow label="Birthday" value={`${store.birthdate} · turning ${ageTurning}`} />
        <Divider />
        <ReviewRow label="Home city" value={store.currentCity} />
        {store.celebrationCity && store.celebrationCity !== store.currentCity && (
          <>
            <Divider />
            <ReviewRow label="Celebrating in" value={store.celebrationCity} accent />
          </>
        )}
        <Divider />
        <ReviewRow label="Vibe" value={store.celebrationVibe} />
        <Divider />

        {/* Goals chips */}
        <div className="flex justify-between items-start">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70 shrink-0">Goals</span>
          <div className="flex flex-wrap gap-1.5 justify-end max-w-[62%]">
            {store.birthdayGoals.map((goal) => (
              <span
                key={goal}
                className="text-xs rounded-full border border-border px-2.5 py-1 text-muted-foreground"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>

        {/* — Preferences (only shown if set) — */}
        {store.pronoun && (
          <>
            <Divider />
            <ReviewRow label="Pronouns" value={store.pronoun} />
          </>
        )}
        {store.budget && (
          <>
            <Divider />
            <ReviewRow label="Budget" value={BUDGET_LABELS[store.budget] ?? store.budget} />
          </>
        )}
        {store.groupSize && (
          <>
            <Divider />
            <ReviewRow label="Group size" value={GROUP_LABELS[store.groupSize] ?? store.groupSize} />
          </>
        )}
        {store.foodVibe && (
          <>
            <Divider />
            <ReviewRow label="Food vibe" value={store.foodVibe} />
          </>
        )}
        {store.aestheticPreference && (
          <>
            <Divider />
            <ReviewRow label="Aesthetic" value={store.aestheticPreference} />
          </>
        )}

        {/* — Mode — */}
        <Divider />
        <ReviewRow
          label="Mode"
          value={store.mode === "cosmic" ? "✦ Cosmic" : "Quick"}
          accent={store.mode === "cosmic"}
        />

        {/* — Cosmic fields (only if cosmic mode) — */}
        {store.mode === "cosmic" && store.birthTime && (
          <>
            <Divider />
            <ReviewRow label="Birth time" value={store.birthTime} accent />
          </>
        )}
        {store.mode === "cosmic" && store.birthCity && (
          <>
            <Divider />
            <ReviewRow label="Birth city" value={store.birthCity} accent />
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-rose text-center">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={store.prevStep}
          disabled={isSubmitting}
          className="flex-1 rounded-full border border-border py-3.5 text-[15px] text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all disabled:opacity-30"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 rounded-full bg-foreground py-3.5 text-[15px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Generate My Birthday"}
        </button>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border/50" />;
}

function ReviewRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70 shrink-0">
        {label}
      </span>
      <span className={`text-sm font-medium text-right ${accent ? "text-champagne" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}
