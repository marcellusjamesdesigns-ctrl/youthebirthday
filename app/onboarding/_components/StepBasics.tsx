"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding";

export function StepBasics() {
  const { name, birthdate, birthYear, currentCity, celebrationCity, setField, nextStep } =
    useOnboardingStore();
  const [birthdateTouched, setBirthdateTouched] = useState(false);
  const birthdateValid = /^\d{2}-\d{2}$/.test(birthdate);

  const canContinue =
    name.trim().length > 0 &&
    /^\d{2}-\d{2}$/.test(birthdate) &&
    birthYear !== null &&
    birthYear > 1920 &&
    currentCity.trim().length > 0;

  return (
    <div className="space-y-8 animate-fade-rise">
      <div className="text-center space-y-3">
        <h1 className="heading-editorial text-3xl sm:text-4xl">
          Let&apos;s start with the basics
        </h1>
        <p className="text-sm text-muted-foreground">
          Tell us about you so we can build your birthday experience.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Name or nickname
          </label>
          <input
            id="name"
            placeholder="What should we call you?"
            value={name}
            onChange={(e) => setField("name", e.target.value)}
            maxLength={50}
            className="luxury-input w-full px-4 py-3.5 text-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="birthdate" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Birthday (MM-DD)
            </label>
            <input
              id="birthdate"
              placeholder="03-15"
              value={birthdate}
              onChange={(e) => setField("birthdate", e.target.value)}
              onBlur={() => setBirthdateTouched(true)}
              maxLength={5}
              inputMode="numeric"
              className={`luxury-input w-full px-4 py-3.5 text-base ${
                birthdateTouched && birthdate.length > 0 && !birthdateValid
                  ? "!border-rose/50"
                  : ""
              }`}
            />
            {birthdateTouched && birthdate.length > 0 && !birthdateValid && (
              <p className="text-[11px] text-rose/70 mt-1">Format: MM-DD (e.g. 03-15)</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="birthYear" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Birth year
            </label>
            <input
              id="birthYear"
              type="number"
              inputMode="numeric"
              placeholder="1995"
              value={birthYear ?? ""}
              onChange={(e) =>
                setField(
                  "birthYear",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="luxury-input w-full px-4 py-3.5 text-base"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="currentCity" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Current city
          </label>
          <input
            id="currentCity"
            placeholder="Where do you live?"
            value={currentCity}
            onChange={(e) => setField("currentCity", e.target.value)}
            className="luxury-input w-full px-4 py-3.5 text-base"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="celebrationCity" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Where are you celebrating?
            <span className="text-muted-foreground/40 normal-case tracking-normal ml-1">optional</span>
          </label>
          <input
            id="celebrationCity"
            placeholder={currentCity || "Same as current city"}
            value={celebrationCity}
            onChange={(e) => setField("celebrationCity", e.target.value)}
            className="luxury-input w-full px-4 py-3.5 text-base"
          />
          <p className="text-[11px] text-muted-foreground/60">
            Leave blank if you&apos;re celebrating where you live. We&apos;ll use this for restaurant and activity recs.
          </p>
        </div>
      </div>

      <button
        onClick={nextStep}
        disabled={!canContinue}
        className="w-full rounded-full bg-foreground py-3.5 text-[15px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
