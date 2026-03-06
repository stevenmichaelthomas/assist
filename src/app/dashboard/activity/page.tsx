"use client";

import { useEffect, useState } from "react";

type AgentRun = {
  id: string;
  agentConfigId: string;
  status: string;
  triggeredBy: string;
  summary: string | null;
  tokensUsed: number | null;
  startedAt: string;
  completedAt: string | null;
};

export default function ActivityPage() {
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);

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
          <p className="text-muted">No agent runs yet. Trigger an agent to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => (
            <div
              key={run.id}
              className="bg-white rounded-xl border border-surface p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusDot status={run.status} />
                  <span className="text-sm font-medium text-foreground">
                    {run.status === "running" ? "Running..." : run.status}
                  </span>
                  <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded">
                    {run.triggeredBy}
                  </span>
                </div>
                <span className="text-xs text-muted">
                  {new Date(run.startedAt).toLocaleString()}
                </span>
              </div>
              {run.summary && (
                <p className="text-sm text-foreground/80 line-clamp-3">
                  {run.summary}
                </p>
              )}
              {run.tokensUsed && (
                <p className="text-xs text-muted mt-2">
                  {run.tokensUsed.toLocaleString()} tokens used
                </p>
              )}
            </div>
          ))}
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

  return <div className={`w-2 h-2 rounded-full ${color}`} />;
}
