"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding";

export function StepBasics() {
  const { name, birthdate, birthYear, currentCity, celebrationCity, birthdayFor, setField, nextStep } =
    useOnboardingStore();
  const [birthdateTouched, setBirthdateTouched] = useState(false);
  const [showCelebrationCity, setShowCelebrationCity] = useState(celebrationCity.trim().length > 0);
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
          Whose birthday is this?
        </h1>
        <p className="text-sm text-muted-foreground">
          Are you celebrating yourself or planning for someone else?
        </p>
      </div>

      {/* Self vs Other toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setField("birthdayFor", "self")}
          className={`rounded-2xl border p-4 text-center transition-all ${
            birthdayFor === "self"
              ? "border-champagne/40 bg-champagne/5 text-foreground"
              : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground/80"
          }`}
        >
          <p className="text-sm font-medium">It&apos;s mine</p>
          <p className="text-[12px] text-muted-foreground/80 mt-1">We&apos;ll plan everything around you</p>
        </button>
        <button
          type="button"
          onClick={() => setField("birthdayFor", "other")}
          className={`rounded-2xl border p-4 text-center transition-all ${
            birthdayFor === "other"
              ? "border-champagne/40 bg-champagne/5 text-foreground"
              : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground/80"
          }`}
        >
          <p className="text-sm font-medium">Someone else&apos;s</p>
          <p className="text-[12px] text-muted-foreground/80 mt-1">We&apos;ll plan their day and gift ideas</p>
        </button>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
            {birthdayFor === "other" ? "Their name" : "Name or nickname"}
          </label>
          <input
            id="name"
            placeholder={birthdayFor === "other" ? "Who's the birthday person?" : "What should we call you?"}
            value={name}
            onChange={(e) => setField("name", e.target.value)}
            maxLength={50}
            autoComplete={birthdayFor === "other" ? "off" : "given-name"}
            autoCapitalize="words"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
            className="luxury-input w-full px-4 py-3.5 text-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="birthdate" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Birthday (month + day)
            </label>
            <input
              id="birthdate"
              placeholder="03 / 15"
              value={birthdate}
              onChange={(e) => {
                // Strip everything non-digit, auto-insert dash after 2 digits.
                // This way any keyboard works — dash, slash, or just 4 digits.
                const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                const formatted = digits.length >= 2
                  ? `${digits.slice(0, 2)}-${digits.slice(2)}`
                  : digits;
                setField("birthdate", formatted);
              }}
              onBlur={() => setBirthdateTouched(true)}
              maxLength={5}
              inputMode="numeric"
              autoComplete="off"
              enterKeyHint="next"
              className={`luxury-input w-full px-4 py-3.5 text-base ${
                birthdateTouched && birthdate.length > 0 && !birthdateValid
                  ? "!border-rose/50"
                  : ""
              }`}
            />
            {birthdateTouched && birthdate.length > 0 && !birthdateValid && (
              <p className="text-[12px] text-rose/80 mt-1">Two digits for month, two for day — like 03 15 for March 15.</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="birthYear" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Birth year
            </label>
            <input
              id="birthYear"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              autoComplete="bday-year"
              enterKeyHint="next"
              placeholder="1995"
              value={birthYear ?? ""}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                setField("birthYear", digits ? parseInt(digits, 10) : null);
              }}
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
            autoComplete="address-level2"
            autoCapitalize="words"
            autoCorrect="off"
            enterKeyHint={showCelebrationCity ? "next" : "done"}
            className="luxury-input w-full px-4 py-3.5 text-base"
          />
        </div>

        {!showCelebrationCity ? (
          <button
            type="button"
            onClick={() => setShowCelebrationCity(true)}
            className="text-[12px] text-champagne/70 hover:text-champagne transition-colors"
          >
            + Celebrating somewhere else?
          </button>
        ) : (
          <div className="space-y-2">
            <label htmlFor="celebrationCity" className="text-[12px] text-muted-foreground/85">
              Where are you celebrating?
              <span className="text-muted-foreground/50 ml-1">optional</span>
            </label>
            <input
              id="celebrationCity"
              placeholder={currentCity || "Same as current city"}
              value={celebrationCity}
              onChange={(e) => setField("celebrationCity", e.target.value)}
              autoComplete="address-level2"
              autoCapitalize="words"
              autoCorrect="off"
              enterKeyHint="done"
              className="luxury-input w-full px-4 py-3.5 text-base"
            />
            <p className="text-[12px] text-muted-foreground/70">
              We&apos;ll use this for restaurant and activity recs.
            </p>
          </div>
        )}
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
