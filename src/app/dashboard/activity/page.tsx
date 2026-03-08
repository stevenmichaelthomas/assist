"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type ToolCall = {
  name: string;
  input: Record<string, unknown>;
  output?: unknown;
  queued?: boolean;
};

type AgentRun = {
  id: string;
  agentConfigId: string;
  agentName: string | null;
  status: string;
  triggeredBy: string;
  summary: string | null;
  toolCalls: ToolCall[] | null;
  tokensUsed: number | null;
  startedAt: string;
  completedAt: string | null;
};

function formatToolName(name: string): string {
  return name
    .replace(/^(gmail|shopify)_/, "")
    .replace(/_/g, " ");
}

function summarizeRun(run: AgentRun): string {
  const tools = run.toolCalls || [];
  if (tools.length === 0) return run.summary || "No actions taken";

  const reads = tools.filter((t) => !t.queued);
  const writes = tools.filter((t) => t.queued);

  const parts: string[] = [];

  // Group reads by type
  const readCounts: Record<string, number> = {};
  reads.forEach((t) => {
    const name = formatToolName(t.name);
    readCounts[name] = (readCounts[name] || 0) + 1;
  });
  Object.entries(readCounts).forEach(([name, count]) => {
    parts.push(count > 1 ? `${name} (${count}x)` : name);
  });

  // Summarize writes
  writes.forEach((t) => {
    if (t.name === "gmail_send") {
      parts.push(`draft email to ${t.input.to}`);
    } else if (t.name === "shopify_create_draft_order") {
      parts.push("draft order created");
    } else {
      parts.push(formatToolName(t.name));
    }
  });

  return parts.join(", ");
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ActivityPage() {
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.json())
      .then(setRuns)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground mb-2">Activity</h1>
      <p className="text-muted mb-8">Agent run history</p>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : runs.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface p-8 text-center">
          <p className="text-muted">
            No agent runs yet. Trigger an agent to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {runs.map((run) => {
            const tools = run.toolCalls || [];
            const writeCount = tools.filter((t) => t.queued).length;
            const isExpanded = expandedId === run.id;
            const duration =
              run.completedAt && run.startedAt
                ? Math.round(
                    (new Date(run.completedAt).getTime() -
                      new Date(run.startedAt).getTime()) /
                      1000
                  )
                : null;

            return (
              <div
                key={run.id}
                className="bg-white rounded-xl border border-surface overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : run.id)
                  }
                  className="w-full text-left px-4 py-3 hover:bg-surface/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <StatusDot status={run.status} />
                      <span className="text-sm font-medium text-foreground truncate">
                        {run.agentName || "Unknown Agent"}
                      </span>
                      <span className="text-xs text-muted flex-shrink-0">
                        {summarizeRun(run)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      {writeCount > 0 && (
                        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
                          {writeCount} pending
                        </span>
                      )}
                      <span className="text-xs text-muted">
                        {timeAgo(run.startedAt)}
                      </span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-surface pt-3 space-y-3">
                    <div className="flex gap-4 text-xs text-muted">
                      <span>
                        Triggered: {run.triggeredBy}
                      </span>
                      {duration !== null && (
                        <span>Duration: {duration}s</span>
                      )}
                      {run.tokensUsed && (
                        <span>
                          {run.tokensUsed.toLocaleString()} tokens
                        </span>
                      )}
                    </div>

                    {tools.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-muted uppercase tracking-wide">
                          Tool calls
                        </p>
                        {tools.map((tool, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                tool.queued
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                              }`}
                            />
                            <span className="text-foreground/80">
                              {formatToolName(tool.name)}
                            </span>
                            {tool.queued && (
                              <span className="text-xs text-amber-600">
                                queued for approval
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {run.summary && (
                      <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
                          Summary
                        </p>
                        <div className="text-sm text-foreground/80 prose prose-sm prose-neutral max-w-none">
                          <ReactMarkdown>{run.summary}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "completed"
      ? "bg-green-500"
      : status === "running"
        ? "bg-yellow-500 animate-pulse"
        : "bg-red-500";

  return <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />;
}
