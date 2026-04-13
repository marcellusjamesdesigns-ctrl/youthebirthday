"use client";

import { useOnboardingStore } from "@/stores/onboarding";

interface StepReviewProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  error?: string | null;
}

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
          Here&apos;s what we&apos;re working with.
        </p>
      </div>

      <div className="luxury-card p-6 space-y-4">
        <ReviewRow label="Name" value={store.name} />
        <div className="h-px bg-border/50" />
        <ReviewRow label="Birthday" value={`${store.birthdate} · turning ${ageTurning}`} />
        <div className="h-px bg-border/50" />
        <ReviewRow label="City" value={store.currentCity} />
        <div className="h-px bg-border/50" />
        <ReviewRow label="Vibe" value={store.celebrationVibe} />
        <div className="h-px bg-border/50" />
        <div className="flex justify-between items-start">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">Goals</span>
          <div className="flex flex-wrap gap-1.5 justify-end max-w-[60%]">
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
        <div className="h-px bg-border/50" />
        <ReviewRow
          label="Mode"
          value={store.mode === "cosmic" ? "Cosmic" : "Quick"}
          accent={store.mode === "cosmic"}
        />
        {store.pronoun && (
          <>
            <div className="h-px bg-border/50" />
            <ReviewRow label="Pronouns" value={store.pronoun} />
          </>
        )}
        {store.budget && (
          <>
            <div className="h-px bg-border/50" />
            <ReviewRow label="Budget" value={store.budget} />
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

function ReviewRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">{label}</span>
      <span className={`text-sm font-medium ${accent ? "text-plum" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}
