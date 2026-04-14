"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ADMIN_SECRET = "ytb-admin-2026";
const ADMIN_PASSCODE = "062093";

interface DraftRow {
  id: string;
  status: "draft" | "approved" | "rejected" | "published";
  topicSeedId: string | null;
  topicTitle: string;
  gatesPassed: number;
  gatesTotal: number;
  estimatedCostCents: number | null;
  durationMs: number | null;
  createdAt: string;
  reviewedAt: string | null;
  publishedAt: string | null;
}

export default function BlogAdminQueue() {
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateResult, setGenerateResult] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("ytb-admin") === "1") setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    refresh();
  }, [authed]);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog-agent/drafts", {
        headers: { "x-admin-token": ADMIN_SECRET },
      });
      const data = await res.json();
      setDrafts(data.drafts ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setGenerateResult(null);
    try {
      const res = await fetch("/api/admin/blog-agent/generate", {
        method: "POST",
        headers: {
          "x-admin-token": ADMIN_SECRET,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        setGenerateResult(`Draft created: ${data.title} (${data.gates.passed}/${data.gates.total} gates passed)`);
        refresh();
      } else {
        setGenerateResult(`Error: ${data.error}${data.message ? ` — ${data.message}` : ""}`);
      }
    } catch (e) {
      setGenerateResult(`Network error: ${(e as Error).message}`);
    } finally {
      setGenerating(false);
    }
  }

  function handlePasscode(e: React.FormEvent) {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      sessionStorage.setItem("ytb-admin", "1");
      setAuthed(true);
    } else {
      setPasscodeError(true);
      setPasscode("");
    }
  }

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
          {passcodeError && <p className="text-[12px] text-rose-400">Incorrect passcode</p>}
          <button
            type="submit"
            disabled={passcode.length !== 6}
            className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-background tracking-wide hover:bg-foreground/90 disabled:opacity-30"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">Blog Agent</p>
            <h1 className="heading-editorial text-3xl mt-1">Review Queue</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground/60 hover:text-foreground transition-colors self-center"
            >
              ← Admin
            </Link>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="rounded-full bg-foreground px-5 py-2.5 text-[12px] font-medium text-background tracking-wide hover:bg-foreground/90 disabled:opacity-40"
            >
              {generating ? "Generating… (up to 2 min)" : "Generate Draft"}
            </button>
          </div>
        </div>

        {generateResult && (
          <div className="rounded-xl bg-card/40 border border-border/30 px-5 py-3 text-sm text-foreground/80">
            {generateResult}
          </div>
        )}

        {/* Drafts table */}
        {loading ? (
          <p className="text-muted-foreground animate-gentle-pulse">Loading…</p>
        ) : drafts.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="text-sm text-muted-foreground/70">No drafts yet.</p>
            <p className="text-xs text-muted-foreground/40">
              Click &ldquo;Generate Draft&rdquo; to run the agent.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/20 text-left text-[10px] uppercase tracking-wider text-muted-foreground/50">
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Gates</th>
                  <th className="pb-3 pr-4">Cost</th>
                  <th className="pb-3 pr-4">Created</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {drafts.map((d) => (
                  <tr key={d.id} className="text-foreground/70">
                    <td className="py-3 pr-4">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-foreground/85">{d.topicTitle}</p>
                      <p className="text-[10px] text-muted-foreground/40 mt-0.5">
                        {d.topicSeedId}
                      </p>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-xs font-mono ${
                          d.gatesPassed === d.gatesTotal
                            ? "text-green-400/70"
                            : d.gatesPassed >= d.gatesTotal - 2
                              ? "text-champagne/70"
                              : "text-rose-400/70"
                        }`}
                      >
                        {d.gatesPassed}/{d.gatesTotal}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs font-mono text-muted-foreground/60">
                      ${((d.estimatedCostCents ?? 0) / 100).toFixed(3)}
                    </td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground/50">
                      {new Date(d.createdAt).toLocaleString("en", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/admin/blog/${d.id}`}
                        className="text-[11px] uppercase tracking-[0.15em] text-champagne/70 hover:text-champagne transition-colors"
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "text-muted-foreground/60 bg-foreground/[0.04]",
    approved: "text-champagne/80 bg-champagne/10",
    rejected: "text-rose-400/70 bg-rose-400/5",
    published: "text-green-400/80 bg-green-400/10",
  };
  return (
    <span
      className={`text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-full ${
        colors[status] ?? colors.draft
      }`}
    >
      {status}
    </span>
  );
}
