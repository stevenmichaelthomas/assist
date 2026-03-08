"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface CrawledPage {
  url: string;
  title: string;
  text: string;
}

interface MemoryItem {
  category: "products" | "contacts" | "policies" | "general";
  key: string;
  value: string;
}

interface AgentSuggestion {
  name: string;
  type: string;
  description: string;
  systemPrompt: string;
  toolsEnabled: string[];
  schedule: string | null;
}

interface OnboardingResult {
  businessName: string;
  businessSummary: string;
  memories: MemoryItem[];
  agents: AgentSuggestion[];
}

type Status = "idle" | "crawling" | "analyzing" | "review" | "refining" | "saving" | "done";

function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setElapsed(0);
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    setRunning(false);
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => e + 0.1);
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  return { elapsed, running, start, stop };
}

export default function OnboardingPage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // Crawl state
  const [crawledPages, setCrawledPages] = useState<CrawledPage[]>([]);
  const crawlTimer = useTimer();

  // Analysis state
  const [result, setResult] = useState<OnboardingResult | null>(null);
  const analyzeTimer = useTimer();

  // Prompt-based editing
  const [editPrompt, setEditPrompt] = useState("");

  // Agent prompt visibility
  const [expandedAgents, setExpandedAgents] = useState<Set<number>>(new Set());

  const toggleAgent = (idx: number) => {
    setExpandedAgents((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  async function handleScan() {
    if (!url.trim()) return;
    setError(null);
    setCrawledPages([]);
    setResult(null);
    setExpandedAgents(new Set());

    // Phase 1: Crawl
    setStatus("crawling");
    crawlTimer.start();
    try {
      const res = await fetch("/api/onboarding/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      crawlTimer.stop();
      if (!res.ok) throw new Error(data.error || "Crawl failed");
      setCrawledPages(data.pages);

      // Phase 2: Analyze
      setStatus("analyzing");
      analyzeTimer.start();
      const analyzeRes = await fetch("/api/onboarding/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.url, pages: data.pages }),
      });
      const analyzeData = await analyzeRes.json();
      analyzeTimer.stop();
      if (!analyzeRes.ok) throw new Error(analyzeData.error || "Analysis failed");
      setResult(analyzeData);
      setStatus("review");
    } catch (e: unknown) {
      crawlTimer.stop();
      analyzeTimer.stop();
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("idle");
    }
  }

  async function handleRefine() {
    if (!editPrompt.trim() || !result) return;
    const prompt = editPrompt.trim();
    setEditPrompt("");
    setStatus("refining");

    try {
      const res = await fetch("/api/onboarding/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: result, prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refinement failed");
      setResult(data);
      setStatus("review");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Refinement failed");
      setStatus("review");
    }
  }

  async function handleSave() {
    if (!result) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/onboarding/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memories: result.memories,
          agents: result.agents,
          businessName: result.businessName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
      setStatus("review");
    }
  }

  const categoryOrder = ["products", "contacts", "policies", "general"] as const;
  const categoryLabels: Record<string, string> = {
    products: "Products & Services",
    contacts: "Contact Info",
    policies: "Policies",
    general: "General",
  };

  const memoriesByCategory = result
    ? categoryOrder
        .map((cat) => ({
          category: cat,
          label: categoryLabels[cat],
          items: result.memories.filter((m) => m.category === cat),
        }))
        .filter((g) => g.items.length > 0)
    : [];

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-foreground mb-2">
        Set up your business
      </h1>
      <p className="text-muted mb-8">
        Add your website and we&apos;ll gather everything we need to know to
        help run your business.
      </p>

      {/* URL Input */}
      <div className="flex gap-2 mb-8">
        <input
          type="url"
          placeholder="https://yourbrand.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          disabled={status === "crawling" || status === "analyzing"}
          className="flex-1 border border-surface rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent disabled:opacity-50"
        />
        <button
          onClick={handleScan}
          disabled={
            !url.trim() ||
            status === "crawling" ||
            status === "analyzing" ||
            status === "saving"
          }
          className="bg-foreground text-white text-sm px-5 py-2.5 rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          {status === "crawling" || status === "analyzing" ? "Scanning..." : "Scan"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Crawl Progress */}
      {(status === "crawling" || crawledPages.length > 0) && (
        <Section
          title="Scanning website"
          timer={crawlTimer.elapsed}
          running={crawlTimer.running}
          done={!crawlTimer.running && crawledPages.length > 0}
          doneText={`Found ${crawledPages.length} page${crawledPages.length !== 1 ? "s" : ""}`}
        >
          {crawledPages.length > 0 && (
            <div className="space-y-1">
              {crawledPages.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">&#10003;</span>
                  <span className="text-foreground/80">
                    {p.title || new URL(p.url).pathname}
                  </span>
                </div>
              ))}
            </div>
          )}
          {crawlTimer.running && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Spinner />
              Fetching pages...
            </div>
          )}
        </Section>
      )}

      {/* Analysis Progress */}
      {(status === "analyzing" || result) && (
        <Section
          title="Analyzing your business"
          timer={analyzeTimer.elapsed}
          running={analyzeTimer.running}
          done={!!result}
          doneText={
            result
              ? `Found ${result.memories.length + result.agents.length} things about your business`
              : undefined
          }
        >
          {analyzeTimer.running && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Spinner />
              Learning about your business...
            </div>
          )}
        </Section>
      )}

      {/* Results: Memories */}
      {result && status !== "done" && (
        <>
          <Section title={`What we learned (${result.memories.length})`}>
            {memoriesByCategory.map((group) => (
              <div key={group.category} className="mb-4 last:mb-0">
                <h4 className="text-xs font-medium text-muted uppercase tracking-wide mb-2">
                  {group.label}
                </h4>
                <div className="space-y-2">
                  {group.items.map((m, i) => (
                    <div
                      key={`${group.category}-${i}`}
                      className="bg-white border border-surface rounded-lg px-4 py-3"
                    >
                      <div className="font-medium text-sm text-foreground">
                        {m.key}
                      </div>
                      <div className="text-sm text-foreground/70 mt-1">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Section>

          {/* Results: Agents */}
          <Section title={`How we can help (${result.agents.length})`}>
            <div className="space-y-3">
              {result.agents.map((a, i) => (
                <div
                  key={i}
                  className="bg-white border border-surface rounded-lg px-4 py-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm text-foreground">
                        {a.name}
                      </div>
                      <div className="text-sm text-foreground/70 mt-1">
                        {a.description}
                      </div>
                    </div>
                  </div>
                  {a.toolsEnabled.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {a.toolsEnabled.map((t) => (
                        <span
                          key={t}
                          className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => toggleAgent(i)}
                    className="text-xs text-accent hover:underline mt-2"
                  >
                    {expandedAgents.has(i)
                      ? "Hide details"
                      : "View details"}
                  </button>
                  {expandedAgents.has(i) && (
                    <pre className="mt-2 text-xs text-foreground/60 bg-surface/50 rounded-lg p-3 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {a.systemPrompt}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Prompt-based editing */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. &quot;Add a 10% student discount policy&quot; or &quot;Remove the shipping info&quot;"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRefine()}
                disabled={status === "refining"}
                className="flex-1 border border-surface rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent disabled:opacity-50"
              />
              <button
                onClick={handleRefine}
                disabled={!editPrompt.trim() || status === "refining"}
                className="bg-white border border-surface text-foreground text-sm px-4 py-2.5 rounded-lg hover:border-accent/30 transition-colors disabled:opacity-50"
              >
                {status === "refining" ? (
                  <span className="flex items-center gap-2">
                    <Spinner /> Updating...
                  </span>
                ) : (
                  "Suggest edit"
                )}
              </button>
            </div>
            <p className="text-xs text-muted mt-1.5">
              Tell us what to add, remove, or change.
            </p>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="bg-foreground text-white text-sm px-6 py-2.5 rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {status === "saving" ? "Saving..." : "Save and finish"}
          </button>
        </>
      )}

      {/* Done */}
      {status === "done" && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-5 mb-6">
          <h3 className="font-display text-lg text-green-900 mb-2">
            You&apos;re all set!
          </h3>
          <p className="text-sm text-green-800 mb-4">
            Everything has been saved. You&apos;re ready to go.
          </p>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-green-700 hover:underline font-medium"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  timer,
  running,
  done,
  doneText,
  children,
}: {
  title: string;
  timer?: number;
  running?: boolean;
  done?: boolean;
  doneText?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-surface" />
        <span className="text-xs font-medium text-muted uppercase tracking-wide flex items-center gap-2">
          {done && <span className="text-green-600">&#10003;</span>}
          {running && <Spinner />}
          {title}
          {timer !== undefined && (
            <span className="tabular-nums text-muted/60">
              {timer.toFixed(1)}s
            </span>
          )}
          {done && doneText && (
            <span className="normal-case tracking-normal text-foreground/60">
              &middot; {doneText}
            </span>
          )}
        </span>
        <div className="h-px flex-1 bg-surface" />
      </div>
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-3.5 w-3.5 text-accent"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
