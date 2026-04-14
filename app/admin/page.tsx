"use client";

import { useState, useEffect } from "react";

const ADMIN_SECRET = "ytb-admin-2026";
const ADMIN_PASSCODE = "062093";

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

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if already authed via sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem("ytb-admin") === "1") {
      setAuthed(true);
    }
  }, []);

  // Fetch stats once authed
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch("/api/admin/stats", {
      headers: { "x-admin-token": ADMIN_SECRET },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [authed]);

  function handlePasscode(e: React.FormEvent) {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      sessionStorage.setItem("ytb-admin", "1");
      setAuthed(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
      setPasscode("");
    }
  }

  // Passcode gate
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <form onSubmit={handlePasscode} className="text-center space-y-6 max-w-xs">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">Admin</p>
            <h1 className="heading-editorial text-2xl">Enter Passcode</h1>
          </div>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ""))}
            placeholder="••••••"
            autoFocus
            className="luxury-input w-full px-4 py-3.5 text-2xl text-center tracking-[0.5em] font-mono"
          />
          {passcodeError && (
            <p className="text-[12px] text-rose">Incorrect passcode</p>
          )}
          <button
            type="submit"
            disabled={passcode.length !== 6}
            className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-background tracking-wide transition-all hover:bg-foreground/90 disabled:opacity-30"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-gentle-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-rose">{error ?? "Failed to load"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <div>
          <h1 className="heading-editorial text-3xl">Economics Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">youthebirthday.app</p>
        </div>

        {/* Warnings banner */}
        {stats.warnings.length > 0 && (
          <div className="space-y-2">
            {stats.warnings.map((w, i) => (
              <div key={i} className="rounded-xl bg-rose/10 border border-rose/20 px-5 py-3 text-sm text-rose">
                {w}
              </div>
            ))}
          </div>
        )}

        {/* Overview metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard label="Total Sessions" value={stats.overview.totalSessions} />
          <MetricCard label="Generations" value={stats.overview.completedGenerations} subtitle={`${stats.overview.completionRate.toFixed(0)}% completion`} />
          <MetricCard label="Errors" value={stats.overview.errorGenerations} accent="rose" />
          <MetricCard label="Email Captures" value={stats.users.totalEmailCaptures} />
        </div>

        {/* Revenue & cost metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard label="Premium Users" value={stats.users.premiumUsers} accent="champagne" />
          <MetricCard label="Free→Paid %" value={`${stats.users.conversionRate.toFixed(1)}%`} accent="champagne" />
          <MetricCard label="Avg Cost/Gen" value={`$${(stats.economics.avgCostPerGenerationCents / 100).toFixed(2)}`} />
          <MetricCard label="Total AI Cost" value={`$${stats.economics.totalCostDollars}`} />
        </div>

        {/* Spend breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard label="AI Cost (24h)" value={`$${stats.economics.cost24hDollars}`} />
          <MetricCard label="AI Cost (7d)" value={`$${stats.economics.cost7dDollars}`} />
          <MetricCard label="Projected /mo" value={`$${stats.economics.projectedMonthlyCostDollars}`} accent={Number(stats.economics.projectedMonthlyCostDollars) > 50 ? "rose" : undefined} />
          <MetricCard label="Cost per $1 Revenue" value="—" subtitle="needs Stripe data" />
        </div>

        {/* Services health */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-foreground/80">Services &amp; Balances</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {stats.services.map((s) => (
              <div key={s.name} className={`lift-card p-3 flex items-center justify-between ${s.critical ? "" : "opacity-70"}`}>
                <div>
                  <p className="text-sm text-foreground/80">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground/50 mt-0.5">{s.note}</p>
                </div>
                {s.critical && (
                  <span className="text-[8px] uppercase tracking-wider text-champagne/60 bg-champagne/10 px-2 py-0.5 rounded-full">Critical</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Daily volume */}
        {stats.dailyVolume.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-foreground/80">Daily Sessions (14d)</h2>
            <div className="flex items-end gap-1 h-32">
              {stats.dailyVolume
                .slice()
                .reverse()
                .map((d: any) => {
                  const max = Math.max(...stats.dailyVolume.map((v: any) => Number(v.sessions)));
                  const h = max > 0 ? (Number(d.sessions) / max) * 100 : 0;
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] text-muted-foreground/40">{Number(d.sessions)}</span>
                      <div
                        className="w-full rounded-t bg-champagne/30 min-h-[2px]"
                        style={{ height: `${Math.max(h, 2)}%` }}
                      />
                      <span className="text-[8px] text-muted-foreground/30">
                        {new Date(d.day).toLocaleDateString("en", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* Breakdowns */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Mode breakdown */}
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-foreground/80">Mode Breakdown</h2>
            <div className="space-y-2">
              {stats.modeBreakdown.map((m) => (
                <div key={m.mode} className="flex justify-between items-center lift-card p-3">
                  <span className="text-sm text-foreground/70 capitalize">{m.mode}</span>
                  <span className="text-sm font-mono text-champagne/70">{m.count}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Top vibes */}
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-foreground/80">Top Vibes</h2>
            <div className="space-y-2">
              {stats.vibeBreakdown.map((v) => (
                <div key={v.vibe} className="flex justify-between items-center lift-card p-3">
                  <span className="text-sm text-foreground/70">{v.vibe}</span>
                  <span className="text-sm font-mono text-champagne/70">{v.count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Recent sessions */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-foreground/80">Recent Sessions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/20 text-left text-[10px] uppercase tracking-wider text-muted-foreground/50">
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">City</th>
                  <th className="pb-2 pr-4">Vibe</th>
                  <th className="pb-2 pr-4">Mode</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {stats.recentSessions.map((s) => (
                  <tr key={s.id} className="text-foreground/70">
                    <td className="py-2 pr-4">{s.name}</td>
                    <td className="py-2 pr-4 text-muted-foreground/50">{s.city}</td>
                    <td className="py-2 pr-4 text-muted-foreground/50">{s.vibe}</td>
                    <td className="py-2 pr-4">
                      <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        s.mode === "cosmic" ? "text-plum/70 bg-plum/10" : "text-champagne/70 bg-champagne/10"
                      }`}>
                        {s.mode}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <span className={`text-[9px] uppercase tracking-wider ${
                        s.status === "complete" ? "text-green-400/70" :
                        s.status === "error" ? "text-rose" :
                        "text-muted-foreground/50"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2 text-muted-foreground/40 text-xs">
                      {new Date(s.createdAt).toLocaleString("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtitle,
  accent,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: "champagne" | "rose";
}) {
  const valueColor = accent === "champagne" ? "text-champagne" : accent === "rose" ? "text-rose" : "text-foreground";

  return (
    <div className="lift-card p-4 space-y-1">
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">{label}</p>
      <p className={`text-2xl font-medium ${valueColor}`}>{value}</p>
      {subtitle && <p className="text-[11px] text-muted-foreground/40">{subtitle}</p>}
    </div>
  );
}
