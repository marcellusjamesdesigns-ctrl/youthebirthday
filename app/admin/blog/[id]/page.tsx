"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import type { BlogPost } from "@/lib/content/types";

function getAdminToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("ytb-admin-token") ?? "";
}
const ADMIN_PASSCODE = "062093";

interface DraftDetail {
  id: string;
  status: "draft" | "approved" | "rejected" | "published";
  topicSeedId: string | null;
  topicTitle: string;
  topicScore: {
    total: number;
    searchOpportunity: number;
    clusterFit: number;
    affiliateFit: number;
    freshness: number;
    dedupRisk: number;
    reason: string;
  } | null;
  topicReason: string | null;
  postData: BlogPost;
  qualityGates: {
    results: { gate: string; passed: boolean; details: string }[];
    passed: number;
    total: number;
    allPassed: boolean;
  } | null;
  model: string | null;
  estimatedCostCents: number | null;
  durationMs: number | null;
  createdAt: string;
  reviewedAt: string | null;
  publishedAt: string | null;
  reviewNotes: string | null;
}

export default function DraftReview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  const [draft, setDraft] = useState<DraftDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("ytb-admin") === "1") setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch(`/api/admin/blog-agent/drafts/${id}`, {
      headers: { "x-admin-token": getAdminToken() },
    })
      .then((r) => r.json())
      .then((data) => {
        setDraft(data.draft);
        setNotes(data.draft?.reviewNotes ?? "");
      })
      .finally(() => setLoading(false));
  }, [authed, id]);

  async function handleAction(action: "approve" | "reject") {
    if (!draft) return;
    setWorking(true);
    try {
      const res = await fetch(`/api/admin/blog-agent/drafts/${id}`, {
        method: "PATCH",
        headers: {
          "x-admin-token": getAdminToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, reviewNotes: notes }),
      });
      if (res.ok) {
        router.push("/admin/blog");
      }
    } finally {
      setWorking(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-gentle-pulse">Loading draft…</p>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-rose-400">Draft not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-border/20 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between gap-4">
          <Link
            href="/admin/blog"
            className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            ← Queue
          </Link>
          <div className="flex items-center gap-2">
            {draft.status === "draft" ? (
              <>
                <button
                  onClick={() => handleAction("reject")}
                  disabled={working}
                  className="rounded-full border border-rose-400/30 text-rose-400/80 px-4 py-2 text-[12px] hover:bg-rose-400/5 disabled:opacity-40"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction("approve")}
                  disabled={working}
                  className="rounded-full bg-foreground px-5 py-2 text-[12px] font-medium text-background hover:bg-foreground/90 disabled:opacity-40"
                >
                  {working ? "Working…" : "Approve & Publish"}
                </button>
              </>
            ) : (
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
                Status: {draft.status}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {/* Scoring + quality panels */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="lift-card p-5 space-y-3">
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-champagne/60">
              Topic Score
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <ScoreRow label="Total" value={draft.topicScore?.total} />
              <ScoreRow label="Seed" value={draft.topicSeedId ?? "—"} />
              <ScoreRow label="Search" value={draft.topicScore?.searchOpportunity} />
              <ScoreRow label="Cluster" value={draft.topicScore?.clusterFit} />
              <ScoreRow label="Affiliate" value={draft.topicScore?.affiliateFit} />
              <ScoreRow label="Freshness" value={draft.topicScore?.freshness} />
              <ScoreRow label="Dedup Risk" value={draft.topicScore?.dedupRisk} />
              <ScoreRow label="Cost" value={`$${((draft.estimatedCostCents ?? 0) / 100).toFixed(3)}`} />
            </div>
            {draft.topicReason && (
              <p className="text-xs text-muted-foreground/60 italic pt-2 border-t border-border/15">
                {draft.topicReason}
              </p>
            )}
          </section>

          <section className="lift-card p-5 space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-champagne/60">
                Quality Gates
              </h2>
              <span
                className={`text-sm font-mono ${
                  draft.qualityGates?.allPassed
                    ? "text-green-400/70"
                    : "text-champagne/70"
                }`}
              >
                {draft.qualityGates?.passed}/{draft.qualityGates?.total}
              </span>
            </div>
            <ul className="space-y-1 text-xs">
              {draft.qualityGates?.results.map((g) => (
                <li key={g.gate} className="flex items-start gap-2">
                  <span className={g.passed ? "text-green-400/70" : "text-rose-400/70"}>
                    {g.passed ? "✓" : "✗"}
                  </span>
                  <div>
                    <p className="text-foreground/80">{g.gate}</p>
                    <p className="text-[10px] text-muted-foreground/50">{g.details}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Review notes */}
        <section className="space-y-2">
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-champagne/60">
            Review Notes (private)
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Why approved? What was edited? Notes for future drafts…"
            className="luxury-input w-full px-4 py-3 text-sm"
          />
        </section>

        {/* Image reminder */}
        {draft.status === "draft" && (
          <section className="rounded-xl bg-champagne/5 border border-champagne/20 px-5 py-4 text-sm text-foreground/80">
            <p className="font-medium text-champagne/80">
              Before publishing:
            </p>
            <ul className="text-xs text-muted-foreground/70 mt-2 space-y-1 list-disc pl-5">
              <li>Replace the placeholder hero image with a real Unsplash URL.</li>
              <li>Replace any mid-article image placeholders.</li>
              <li>Double-check at least 3 internal links exist in body paragraphs.</li>
              <li>Approve only if the post reads like it belongs next to the golden examples.</li>
            </ul>
          </section>
        )}

        {/* Live preview */}
        <section className="space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-champagne/60">
            Rendered Preview
          </h2>
          <div className="rounded-xl overflow-hidden border border-border/20 bg-background">
            <BlogPostLayout post={draft.postData} related={[]} />
          </div>
        </section>
      </div>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground/50">{label}</span>
      <span className="font-mono text-foreground/80">
        {value === null || value === undefined ? "—" : String(value)}
      </span>
    </div>
  );
}
