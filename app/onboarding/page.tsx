"use client";

import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/stores/onboarding";
import { StepBasics } from "./_components/StepBasics";
import { StepVibe } from "./_components/StepVibe";
import { StepPreferences } from "./_components/StepPreferences";
import { StepCosmic } from "./_components/StepCosmic";
import { StepReview } from "./_components/StepReview";
import { useState, useEffect } from "react";
import { analytics } from "@/lib/analytics/events";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const { step } = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const store = useOnboardingStore();

  useEffect(() => {
    if (step === 1 && !store.name) {
      analytics.onboardingStarted();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/birthday/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: store.name,
          birthdate: store.birthdate,
          birthYear: store.birthYear,
          currentCity: store.currentCity,
          currentLat: store.currentLat || undefined,
          currentLng: store.currentLng || undefined,
          celebrationCity: store.celebrationCity || undefined,
          celebrationVibe: store.celebrationVibe,
          birthdayGoals: store.birthdayGoals,
          pronoun: store.pronoun || undefined,
          budget: store.budget || undefined,
          groupSize: store.groupSize || undefined,
          foodVibe: store.foodVibe || undefined,
          aestheticPreference: store.aestheticPreference || undefined,
          mode: store.mode,
          birthTime: store.birthTime || undefined,
          birthCity: store.birthCity || undefined,
          birthLat: store.birthLat || undefined,
          birthLng: store.birthLng || undefined,
          birthdayFor: store.birthdayFor,
          recipientRelationship: store.recipientRelationship || undefined,
          giftBudget: store.giftBudget || undefined,
          giftInterests: store.giftInterests.length > 0 ? store.giftInterests : undefined,
        }),
      });

      if (!res.ok) {
        setSubmitError("Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const { redirectUrl } = await res.json();
      analytics.onboardingCompleted({ mode: store.mode });
      store.reset();
      router.push(redirectUrl);
    } catch {
      setSubmitError("Connection error. Please check your internet and try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-luxury flex flex-col">
      <div className="mx-auto w-full max-w-lg px-6 py-12 flex-1">
        {/* Luxury progress indicator */}
        <div className="mb-12 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/60">
              Step {step} of {TOTAL_STEPS}
            </p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
              {step === 1 && "The Basics"}
              {step === 2 && "Your Vibe"}
              {step === 3 && "Preferences"}
              {step === 4 && "Cosmic"}
              {step === 5 && "Review"}
            </p>
          </div>
          <div className="h-[1px] bg-border relative">
            <div
              className="h-[1px] bg-champagne/50 transition-all duration-700 ease-out"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && <StepBasics />}
        {step === 2 && <StepVibe />}
        {step === 3 && <StepPreferences />}
        {step === 4 && <StepCosmic />}
        {step === 5 && (
          <StepReview onSubmit={handleSubmit} isSubmitting={isSubmitting} error={submitError} />
        )}
      </div>
    </div>
  );
}
