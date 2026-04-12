"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OnboardingState {
  step: number;
  // Step 1 — Basics
  name: string;
  birthdate: string; // "MM-DD"
  birthYear: number | null;
  currentCity: string;
  currentLat: string;
  currentLng: string;
  // Step 2 — Vibe
  celebrationVibe: string;
  birthdayGoals: string[];
  // Step 3 — Preferences
  pronoun: string;
  budget: string;
  groupSize: string;
  foodVibe: string;
  aestheticPreference: string;
  // Step 4 — Cosmic
  mode: "quick" | "cosmic";
  birthTime: string;
  birthCity: string;
  birthLat: string;
  birthLng: string;
}

interface OnboardingActions {
  setField: <K extends keyof OnboardingState>(
    key: K,
    value: OnboardingState[K]
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const initialState: OnboardingState = {
  step: 1,
  name: "",
  birthdate: "",
  birthYear: null,
  currentCity: "",
  currentLat: "",
  currentLng: "",
  celebrationVibe: "",
  birthdayGoals: [],
  pronoun: "",
  budget: "",
  groupSize: "",
  foodVibe: "",
  aestheticPreference: "",
  mode: "quick",
  birthTime: "",
  birthCity: "",
  birthLat: "",
  birthLng: "",
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set) => ({
      ...initialState,
      setField: (key, value) => set({ [key]: value }),
      nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 5) })),
      prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
      reset: () => set(initialState),
    }),
    {
      name: "ytb-onboarding",
    }
  )
);
