"use client";

import { useState, useEffect } from "react";

// Admin token stored in localStorage after first-time entry.
// User only needs to paste it ONCE per device. After that, the 6-digit
// passcode is the per-visit gate. Click "Sign out" on the dashboard to
// clear the stored token (e.g. when changing admin secret).
const ADMIN_PASSCODE = "062093";
const TOKEN_STORAGE_KEY = "ytb-admin-token";

interface Stats {
  overview: {
    totalSessions: number;
    totalGenerations: number;
    completedGenerations: number;
    errorGenerations: number;
    completionRate: number;
  };
  users: {
    totalEmailCaptures: number;
    premiumUsers: number;
    conversionRate: number;
  };
  economics: {
    avgCostPerGenerationCents: number;
    totalCostCents: number;
    totalCostDollars: string;
    cost24hCents: number;
    cost24hDollars: string;
    cost7dCents: number;
    cost7dDollars: string;
    projectedMonthlyCostDollars: string;
  };
  services: { name: string; note: string; critical: boolean }[];
  warnings: string[];
  recentSessions: {
    id: string;
    name: string;
    city: string;
    vibe: string;
    mode: string;
    status: string;
    createdAt: string;
  }[];
  dailyVolume: { day: string; sessions: number }[];
  modeBreakdown: { mode: string; count: number }[];
  vibeBreakdown: { vibe: string; count: number }[];
}

interface OpsStatus {
  opsWatcher: {
    lastRun: {
      ranAt: string;
      durationMs: number;
      totalChecks: number;
      passed: number;
      warnings: number;
      errors: number;
      errorList: Array<{ check: string; details: string }>;
      warningList: Array<{ check: string; details: string }>;
    } | null;
    hoursSinceLastRun: number | null;
    cronExpression: string;
    cronDescription: string;
  };
  growthOp: {
    schedule: {
      paused: boolean;
      maxPerDay: number;
      minHoursBetweenRuns: number;
      todayCount: number;
      remainingToday: number;
      cronExpression: string;
      cronDescription: string;
    };
    lastDraftAt: string | null;
    hoursSinceLastDraft: number | null;
    nextEligibleAt: string | null;
    cadenceGateOpen: boolean;
    draftCounts: {
      byKind: Record<string, number>;
      byStatus: Record<string, number>;
      byKindStatus: Record<string, Record<string, number>>;
    };
    recentDrafts: Array<{
      id: string;
      kind: string;
      status: string;
      title: string;
      targetCategory: string | null;
      targetSlug: string | null;
      reason: string | null;
      gatesPassed: number;
      gatesTotal: number;
      costCents: number | null;
      createdAt: string;
    }>;
  };
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [hasStoredToken, setHasStoredToken] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [needsTokenEntry, setNeedsTokenEntry] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [opsStatus, setOpsStatus] = useState<OpsStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if we already have a stored admin token from a previous session
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (saved) {
      setAdminToken(saved);
      setHasStoredToken(true);
    }
  }, []);

  // Fetch stats + ops-status once authed. Both share the same token.
  useEffect(() => {
    if (!authed || !adminToken) return;
    setLoading(true);
    setError(null);
    const headers = { "x-admin-token": adminToken };

    Promise.all([
      fetch("/api/admin/stats", { headers }).then((r) => {
        if (!r.ok) throw new Error("Stored admin token is invalid. Please sign out and re-enter.");
        return r.json();
      }),
      // ops-status is best-effort — if it errors (e.g. the endpoint hasn't
      // shipped yet) the rest of the dashboard still renders.
      fetch("/api/admin/ops-status", { headers })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ])
      .then(([statsData, opsData]) => {
        setStats(statsData);
        setOpsStatus(opsData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [authed, adminToken]);

  function handlePasscode(e: React.FormEvent) {
    e.preventDefault();
    if (passcode !== ADMIN_PASSCODE) {
      setPasscodeError(true);
      setPasscode("");
      return;
    }
    setPasscodeError(false);

    if (hasStoredToken) {
      // Token already on this device — skip straight to dashboard
      setAuthed(true);
    } else {
      // First time on this device — need to enter token
      setNeedsTokenEntry(true);
    }
  }

  function handleTokenSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = tokenInput.trim();
    if (!t) return;
    localStorage.setItem(TOKEN_STORAGE_KEY, t);
    setAdminToken(t);
    setHasStoredToken(true);
    setNeedsTokenEntry(false);
    setAuthed(true);
  }

  function handleSignOut() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAdminToken("");
    setHasStoredToken(false);
    setAuthed(false);
    setStats(null);
    setPasscode("");
    setTokenInput("");
  }

  // ── 1. Token entry (first time on this device) ──────────────────
  if (needsTokenEntry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <form onSubmit={handleTokenSubmit} className="text-center space-y-6 max-w-sm w-full px-6">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">Admin</p>
            <h1 className="heading-editorial text-2xl">One-time token</h1>
            <p className="text-[12px] text-muted-foreground/60 leading-relaxed mt-3">
              Paste your admin secret (the <code className="text-champagne/70">ADMIN_SECRET</code> from
              Vercel) once. We&apos;ll remember it on this device so you only need the passcode going
              forward.
            </p>
          </div>
          <input
            type="password"
            placeholder="Admin secret"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            required
            autoComplete="current-password"
            className="luxury-input w-full px-4 py-3.5 text-base"
          />
          <button
            type="submit"
            disabled={!tokenInput.trim()}
            className="w-full rounded-full bg-foreground py-3.5 text-[15px] font-medium text-background tracking-wide hover:bg-foreground/90 disabled:opacity-40 transition-all"
          >
            Save & Continue
          </button>
        </form>
      </div>
    );
  }

  // ── 2. Passcode gate ────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <form onSubmit={handlePasscode} className="text-center space-y-6 max-w-xs w-full px-6">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">Admin</p>
            <h1 className="heading-editorial text-2xl">Enter Passcode</h1>
            {hasStoredToken && (
              <p className="text-[11px] text-muted-foreground/50 mt-2">
                Device remembered. Just your passcode.
              </p>
            )}
          </div>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ""))}
            required
            autoFocus
            className="luxury-input w-full px-4 py-3.5 text-base text-center tracking-[0.3em]"
          />
          {passcodeError && (
            <p className="text-[12px] text-rose">Incorrect passcode</p>
          )}
          <button
            type="submit"
            disabled={passcode.length !== 6}
            className="w-full rounded-full bg-foreground py-3.5 text-[15px] font-medium text-background tracking-wide hover:bg-foreground/90 disabled:opacity-40 transition-all"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  // ── 3. Dashboard (authed) ───────────────────────────────────────
  return <AuthedDashboard
    stats={stats}
    opsStatus={opsStatus}
    loading={loading}
    error={error}
    onSignOut={handleSignOut}
  />;
}

// ──────────────────────────────────────────────────────────────────
// The original dashboard rendering, extracted for clarity
// ──────────────────────────────────────────────────────────────────

function AuthedDashboard({
  stats,
  opsStatus,
  loading,
  error,
  onSignOut,
}: {
  stats: Stats | null;
  opsStatus: OpsStatus | null;
  loading: boolean;
  error: string | null;
  onSignOut: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-luxury">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60">Admin</p>
            <h1 className="heading-editorial text-3xl sm:text-4xl">Economics Dashboard</h1>
            <p className="text-sm text-muted-foreground/60">youthebirthday.app</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/admin/blog"
              className="text-[12px] uppercase tracking-[0.2em] text-champagne/70 hover:text-champagne transition-colors"
            >
              Blog queue →
            </a>
            <button
              onClick={onSignOut}
              className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-rose transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground/50">Loading…</p>
        )}
        {error && (
          <div className="rounded-xl border border-rose/30 bg-rose/5 p-4 space-y-2">
            <p className="text-sm text-rose/90">{error}</p>
            <button
              onClick={onSignOut}
              className="text-[11px] uppercase tracking-[0.2em] text-rose/70 hover:text-rose transition-colors"
            >
              Sign out & re-enter
            </button>
          </div>
        )}

        {stats && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Total Sessions" value={stats.overview.totalSessions.toString()} />
              <StatCard label="Generations" value={stats.overview.totalGenerations.toString()} sub={`${(stats.overview.completionRate * 100).toFixed(0)}% completion`} />
              <StatCard label="Errors" value={stats.overview.errorGenerations.toString()} tone={stats.overview.errorGenerations > 0 ? "warn" : "ok"} />
              <StatCard label="Email Captures" value={stats.users.totalEmailCaptures.toString()} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Premium Users" value={stats.users.premiumUsers.toString()} tone="champagne" />
              <StatCard label="Free → Paid %" value={`${(stats.users.conversionRate * 100).toFixed(1)}%`} tone="champagne" />
              <StatCard label="Avg Cost/Gen" value={`$${(stats.economics.avgCostPerGenerationCents / 100).toFixed(2)}`} />
              <StatCard label="Total AI Cost" value={`$${stats.economics.totalCostDollars}`} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="AI Cost (24h)" value={`$${stats.economics.cost24hDollars}`} sub="past 24 hours" />
              <StatCard label="AI Cost (7d)" value={`$${stats.economics.cost7dDollars}`} sub="past 7 days" />
              <StatCard label="Projected /mo" value={`$${stats.economics.projectedMonthlyCostDollars}`} sub="based on last 7d" />
              <StatCard label="Cost per $1 Revenue" value="—" sub="needs Stripe data" />
            </div>

            {stats.warnings && stats.warnings.length > 0 && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-amber-500/80">Warnings</p>
                {stats.warnings.map((w, i) => (
                  <p key={i} className="text-[13px] text-amber-500/90">{w}</p>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-champagne/60">Services & Balances</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {stats.services.map((s) => (
                  <div key={s.name} className="lift-card p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-foreground/85">{s.name}</p>
                      <p className="text-[11px] text-muted-foreground/60 mt-0.5">{s.note}</p>
                    </div>
                    {s.critical && (
                      <span className="text-[9px] uppercase tracking-[0.15em] text-rose/80 border border-rose/30 rounded-full px-2 py-0.5">
                        Critical
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {opsStatus && <AutomationPanel opsStatus={opsStatus} />}

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-champagne/60">Mode Breakdown</h2>
                {stats.modeBreakdown.map((m) => (
                  <div key={m.mode} className="flex justify-between text-sm text-muted-foreground/70">
                    <span className="capitalize">{m.mode}</span>
                    <span className="font-mono text-foreground/80">{m.count}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-champagne/60">Top Vibes</h2>
                {stats.vibeBreakdown.slice(0, 5).map((v) => (
                  <div key={v.vibe} className="flex justify-between text-sm text-muted-foreground/70">
                    <span>{v.vibe}</span>
                    <span className="font-mono text-foreground/80">{v.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "ok" | "warn" | "champagne";
}) {
  const toneClass =
    tone === "warn"
      ? "text-rose"
      : tone === "champagne"
      ? "text-champagne"
      : "text-foreground";
  return (
    <div className="lift-card p-4 space-y-1">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">{label}</p>
      <p className={`text-2xl font-editorial ${toneClass}`}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground/40">{sub}</p>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Automation panel — Ops Watcher + Growth Operator status
// ──────────────────────────────────────────────────────────────────

function AutomationPanel({ opsStatus }: { opsStatus: OpsStatus }) {
  const ops = opsStatus.opsWatcher;
  const go = opsStatus.growthOp;

  const opsTone: "ok" | "warn" | "error" =
    !ops.lastRun
      ? "warn"
      : ops.lastRun.errors > 0
        ? "error"
        : ops.lastRun.warnings > 0
          ? "warn"
          : "ok";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] uppercase tracking-[0.25em] text-champagne/60">Automation</h2>
        <a
          href="/admin/blog"
          className="text-[11px] uppercase tracking-[0.2em] text-champagne/60 hover:text-champagne transition-colors"
        >
          Drafts queue →
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Ops Watcher */}
        <div className="lift-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                Ops Watcher
              </p>
              <p className="text-[11px] text-muted-foreground/50">{ops.cronDescription}</p>
            </div>
            <StatusPill tone={opsTone}>
              {opsTone === "ok" ? "Healthy" : opsTone === "warn" ? "Warnings" : "Errors"}
            </StatusPill>
          </div>

          {ops.lastRun ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <MiniStat label="Passed" value={`${ops.lastRun.passed}/${ops.lastRun.totalChecks}`} />
                <MiniStat label="Warnings" value={ops.lastRun.warnings.toString()} tone={ops.lastRun.warnings > 0 ? "warn" : "ok"} />
                <MiniStat label="Errors" value={ops.lastRun.errors.toString()} tone={ops.lastRun.errors > 0 ? "error" : "ok"} />
              </div>

              <p className="text-[11px] text-muted-foreground/60">
                Last run {ops.hoursSinceLastRun !== null ? `${formatHours(ops.hoursSinceLastRun)} ago` : "—"} · {ops.lastRun.durationMs}ms
              </p>

              {ops.lastRun.errorList.length > 0 && (
                <div className="rounded-lg border border-rose/30 bg-rose/5 p-3 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-rose/80">Errors</p>
                  {ops.lastRun.errorList.map((e, i) => (
                    <p key={i} className="text-[12px] text-rose/85">
                      <span className="font-mono">{e.check}:</span> {e.details}
                    </p>
                  ))}
                </div>
              )}

              {ops.lastRun.warningList.length > 0 && (
                <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500/80">Warnings</p>
                  {ops.lastRun.warningList.map((w, i) => (
                    <p key={i} className="text-[12px] text-amber-500/85">
                      <span className="font-mono">{w.check}:</span> {w.details}
                    </p>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-[12px] text-muted-foreground/60">
              No runs yet — the daily cron fires at 15:00 UTC.
            </p>
          )}
        </div>

        {/* Growth Operator */}
        <div className="lift-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                Growth Operator
              </p>
              <p className="text-[11px] text-muted-foreground/50">{go.schedule.cronDescription}</p>
            </div>
            <StatusPill tone={go.schedule.paused ? "warn" : go.cadenceGateOpen ? "ok" : "idle"}>
              {go.schedule.paused
                ? "Paused"
                : go.cadenceGateOpen
                  ? "Gate open"
                  : "In cooldown"}
            </StatusPill>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <MiniStat
              label="Blog drafts"
              value={String(go.draftCounts.byKind["blog"] ?? 0)}
            />
            <MiniStat
              label="Traffic drafts"
              value={String(go.draftCounts.byKind["traffic-page"] ?? 0)}
            />
            <MiniStat
              label="Pending review"
              value={String(go.draftCounts.byStatus["draft"] ?? 0)}
              tone={(go.draftCounts.byStatus["draft"] ?? 0) > 0 ? "champagne" : "ok"}
            />
          </div>

          <div className="space-y-1 text-[12px] text-muted-foreground/70">
            <p>
              <span className="text-muted-foreground/50">Last draft:</span>{" "}
              {go.hoursSinceLastDraft !== null
                ? `${formatHours(go.hoursSinceLastDraft)} ago`
                : "never"}
            </p>
            <p>
              <span className="text-muted-foreground/50">Next eligible:</span>{" "}
              {go.cadenceGateOpen
                ? "now"
                : go.nextEligibleAt
                  ? formatRelativeFuture(go.nextEligibleAt)
                  : "—"}
            </p>
            <p>
              <span className="text-muted-foreground/50">Min hours between runs:</span>{" "}
              {go.schedule.minHoursBetweenRuns}h
            </p>
          </div>
        </div>
      </div>

      {/* Recent drafts */}
      {go.recentDrafts.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            Recent drafts (all lanes)
          </p>
          <div className="space-y-1.5">
            {go.recentDrafts.map((d) => (
              <DraftRow key={d.id} draft={d} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DraftRow({ draft: d }: { draft: OpsStatus["growthOp"]["recentDrafts"][number] }) {
  const statusClass =
    d.status === "published"
      ? "text-champagne/80 border-champagne/30"
      : d.status === "rejected"
        ? "text-rose/70 border-rose/30"
        : "text-muted-foreground/70 border-border/40";

  const kindClass =
    d.kind === "traffic-page"
      ? "bg-champagne/10 text-champagne/80"
      : "bg-border/20 text-muted-foreground/80";

  const gatesOk = d.gatesPassed === d.gatesTotal;

  return (
    <div className="lift-card p-3 flex items-center gap-3 text-[12px]">
      <span className={`shrink-0 text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full ${kindClass}`}>
        {d.kind === "traffic-page" ? "traffic" : "blog"}
      </span>
      <span className="flex-1 truncate text-foreground/85">{d.title}</span>
      {d.targetCategory && d.targetSlug && (
        <span className="hidden sm:inline text-muted-foreground/40 font-mono text-[10px]">
          /{d.targetCategory === "captions" ? "birthday-captions" :
            d.targetCategory === "ideas" ? "birthday-ideas" :
            d.targetCategory === "destinations" ? "birthday-destinations" :
            d.targetCategory === "palettes" ? "birthday-palettes" :
            d.targetCategory === "themes" ? "birthday-themes" :
            d.targetCategory === "zodiac" ? "zodiac-birthdays" :
            d.targetCategory}/{d.targetSlug}
        </span>
      )}
      <span className={`shrink-0 text-[10px] font-mono ${gatesOk ? "text-muted-foreground/50" : "text-amber-500/70"}`}>
        {d.gatesPassed}/{d.gatesTotal}
      </span>
      <span className={`shrink-0 text-[9px] uppercase tracking-[0.15em] border rounded-full px-2 py-0.5 ${statusClass}`}>
        {d.status}
      </span>
    </div>
  );
}

function StatusPill({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "error" | "idle";
  children: React.ReactNode;
}) {
  const cls =
    tone === "ok"
      ? "border-champagne/30 text-champagne/80 bg-champagne/5"
      : tone === "warn"
        ? "border-amber-500/30 text-amber-500/85 bg-amber-500/5"
        : tone === "error"
          ? "border-rose/30 text-rose/85 bg-rose/5"
          : "border-border/40 text-muted-foreground/70";
  return (
    <span className={`text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border ${cls}`}>
      {children}
    </span>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "ok" | "warn" | "error" | "champagne";
}) {
  const toneClass =
    tone === "error"
      ? "text-rose"
      : tone === "warn"
        ? "text-amber-500"
        : tone === "champagne"
          ? "text-champagne"
          : "text-foreground/85";
  return (
    <div className="rounded-lg border border-border/20 px-3 py-2">
      <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">{label}</p>
      <p className={`text-base font-editorial ${toneClass}`}>{value}</p>
    </div>
  );
}

function formatHours(h: number): string {
  if (h < 1) return `${Math.max(1, Math.round(h * 60))}m`;
  if (h < 48) return `${h.toFixed(1)}h`;
  return `${Math.round(h / 24)}d`;
}

function formatRelativeFuture(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "now";
  const hours = ms / 3_600_000;
  if (hours < 1) return `in ${Math.max(1, Math.round(hours * 60))}m`;
  if (hours < 48) return `in ${hours.toFixed(1)}h`;
  return `in ${Math.round(hours / 24)}d`;
}
