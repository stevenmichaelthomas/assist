"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

type AgentConfig = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  enabled: boolean;
  schedule: string | null;
  createdAt: string;
};

const SCHEDULE_LABELS: Record<string, string> = {
  "0 9 * * *": "Every morning",
  "0 9 * * 1-5": "Weekday mornings",
  "0 9,17 * * *": "Twice daily",
  "0 */4 * * *": "Every 4 hours",
  "0 */2 * * *": "Every 2 hours",
  "0 * * * *": "Every hour",
  "0 12 * * 1": "Weekly (Monday)",
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAgents, setRunningAgents] = useState<Set<string>>(new Set());
  const pollTimers = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    fetch("/api/agents/config")
      .then((r) => r.json())
      .then(setAgents)
      .finally(() => setLoading(false));

    return () => {
      Object.values(pollTimers.current).forEach(clearInterval);
    };
  }, []);

  const triggerRun = useCallback(async (agentId: string) => {
    setRunningAgents((prev) => new Set(prev).add(agentId));

    try {
      await fetch(`/api/agents/${agentId}/run`, { method: "POST" });
    } catch {
      // Even on error, the run may have started
    }

    // Poll activity for completion
    const timer = setInterval(async () => {
      try {
        const res = await fetch("/api/activity");
        const runs = await res.json();
        const latest = runs.find(
          (r: { agentConfigId: string }) => r.agentConfigId === agentId
        );
        if (latest && latest.status !== "running") {
          clearInterval(timer);
          delete pollTimers.current[agentId];
          setRunningAgents((prev) => {
            const next = new Set(prev);
            next.delete(agentId);
            return next;
          });
        }
      } catch {
        // ignore poll errors
      }
    }, 3000);

    pollTimers.current[agentId] = timer;

    // Safety timeout — stop polling after 5 minutes
    setTimeout(() => {
      if (pollTimers.current[agentId]) {
        clearInterval(pollTimers.current[agentId]);
        delete pollTimers.current[agentId];
        setRunningAgents((prev) => {
          const next = new Set(prev);
          next.delete(agentId);
          return next;
        });
      }
    }, 300000);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-2">Agents</h1>
          <p className="text-muted">Your AI agents and their configurations</p>
        </div>
        <Link
          href="/dashboard/agents/new"
          className="bg-foreground text-white text-sm px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors"
        >
          Create Agent
        </Link>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : agents.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface p-8 text-center">
          <p className="text-muted mb-4">
            No agents configured yet. Create your first agent to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {agents.map((agent) => {
            const isRunning = runningAgents.has(agent.id);

            return (
              <div
                key={agent.id}
                className="bg-white rounded-xl border border-surface p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-medium text-foreground">{agent.name}</h2>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          agent.enabled
                            ? "bg-green-50 text-green-700"
                            : "bg-surface text-muted"
                        }`}
                      >
                        {agent.enabled ? "Active" : "Disabled"}
                      </span>
                      {isRunning && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 flex items-center gap-1.5">
                          <span className="inline-block w-2 h-2 border border-amber-600 border-t-transparent rounded-full animate-spin" />
                          Running
                        </span>
                      )}
                    </div>
                    {agent.description ? (
                      <p className="text-sm text-muted truncate">{agent.description}</p>
                    ) : (
                      <p className="text-sm text-muted">
                        {agent.type.replace(/_/g, " ")}
                        {agent.schedule && ` · ${SCHEDULE_LABELS[agent.schedule] || agent.schedule}`}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => triggerRun(agent.id)}
                      disabled={isRunning}
                      className="bg-accent text-white text-sm px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
                    >
                      {isRunning ? "Running..." : "Run Now"}
                    </button>
                    <Link
                      href={`/dashboard/agents/${agent.id}`}
                      className="bg-surface text-foreground text-sm px-4 py-2 rounded-lg hover:bg-surface/80 transition-colors"
                    >
                      Configure
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
