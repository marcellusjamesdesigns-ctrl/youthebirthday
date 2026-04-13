"use client";

import { useOnboardingStore } from "@/stores/onboarding";

/** Convert "10:30 PM" or "10:30pm" → "22:30" for storage */
function to24h(raw: string): string {
  const clean = raw.trim().toLowerCase();
  const match = clean.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);
  if (!match) return raw; // already 24h or unparseable — store as-is
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3];
  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

export function StepCosmic() {
  const { mode, birthTime, birthCity, setField, nextStep, prevStep } =
    useOnboardingStore();

  function handleTimeBlur(e: React.FocusEvent<HTMLInputElement>) {
    const converted = to24h(e.target.value);
    if (converted !== e.target.value) {
      setField("birthTime", converted);
    }
  }

  const isCosmicComplete =
    mode !== "cosmic" || (birthTime.trim().length >= 4 && birthCity.trim().length >= 2);

  return (
    <div className="space-y-8 animate-fade-rise">
      <div className="text-center space-y-3">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/50">
          Optional
        </p>
        <h1 className="heading-editorial text-3xl sm:text-4xl">
          Go cosmic?
        </h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Add your birth time and city for Moon sign, Rising sign, and
          astrology-inspired recommendations.
        </p>
      </div>

      <div className="space-y-4">
        {/* Mode toggle — styled as clear choice cards */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setField("mode", "quick")}
            className={`luxury-card p-5 text-left transition-all duration-200 ${
              mode === "quick"
                ? "selection-active ring-1 ring-champagne/40"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <p className="font-medium text-sm text-foreground">Quick Mode</p>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Sun sign only · 30 seconds
            </p>
          </button>
          <button
            onClick={() => setField("mode", "cosmic")}
            className={`luxury-card p-5 text-left transition-all duration-200 ${
              mode === "cosmic"
                ? "selection-active-plum ring-1 ring-plum/40"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <p className="font-medium text-sm text-foreground">Cosmic Mode</p>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Sun + Moon + Rising · full chart
            </p>
          </button>
        </div>

        {/* Cosmic fields — slide in when cosmic is selected */}
        {mode === "cosmic" && (
          <div className="space-y-4 pt-3 animate-fade-rise">
            <div className="rounded-xl border border-plum/20 bg-plum/5 p-4 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="birthTime"
                  className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70"
                >
                  Birth time
                </label>
                <input
                  id="birthTime"
                  placeholder="e.g. 10:30 PM or 22:30"
                  value={birthTime}
                  onChange={(e) => setField("birthTime", e.target.value)}
                  onBlur={handleTimeBlur}
                  maxLength={8}
                  className="luxury-input w-full px-4 py-3.5 text-base"
                />
                <p className="text-[11px] text-muted-foreground/60">
                  12h (10:30 PM) or 24h (22:30) — both work
                </p>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="birthCity"
                  className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70"
                >
                  Birth city
                </label>
                <input
                  id="birthCity"
                  placeholder="e.g. Atlanta, GA"
                  value={birthCity}
                  onChange={(e) => setField("birthCity", e.target.value)}
                  className="luxury-input w-full px-4 py-3.5 text-base"
                />
                <p className="text-[11px] text-muted-foreground/60">
                  Used to calculate your Rising sign
                </p>
              </div>
            </div>

            {/* Inline validation nudge */}
            {(!birthTime.trim() || !birthCity.trim()) && (
              <p className="text-[12px] text-center text-muted-foreground/65">
                Fill in both fields above to unlock your full chart, or switch to Quick Mode.
              </p>
            )}
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
          disabled={!isCosmicComplete}
          className="flex-1 rounded-full bg-foreground py-3.5 text-[15px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
