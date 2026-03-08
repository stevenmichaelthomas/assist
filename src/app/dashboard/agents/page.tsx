"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

type AgentConfig = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  enabled: boolean;
  schedule: string | null;
  createdAt: string;
};

type AgentRun = {
  id: string;
  agentConfigId: string;
  agentName: string | null;
  status: string;
  triggeredBy: string;
  summary: string | null;
  toolCalls: { name: string; queued?: boolean }[] | null;
  tokensUsed: number | null;
  startedAt: string;
  completedAt: string | null;
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

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAgents, setRunningAgents] = useState<Set<string>>(new Set());
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [expandedRun, setExpandedRun] = useState<string | null>(null);
  const pollTimers = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/agents/config").then((r) => r.json()),
      fetch("/api/activity").then((r) => r.json()),
    ])
      .then(([agentsData, runsData]) => {
        setAgents(agentsData);
        setRuns(runsData);

        // Detect any currently running agents and resume polling
        const activeRuns = (runsData as AgentRun[]).filter(
          (r) => r.status === "running"
        );
        if (activeRuns.length > 0) {
          const activeIds = new Set(activeRuns.map((r) => r.agentConfigId));
          setRunningAgents(activeIds);
          // Auto-expand the first running agent
          setExpandedAgent(activeRuns[0].agentConfigId);
          // Start polling for each
          activeIds.forEach((agentId) => startPolling(agentId));
        }
      })
      .finally(() => setLoading(false));

    return () => {
      Object.values(pollTimers.current).forEach(clearInterval);
    };
  }, []);

  const startPolling = useCallback((agentId: string) => {
    // Don't start duplicate timers
    if (pollTimers.current[agentId]) return;

    const timer = setInterval(async () => {
      try {
        const res = await fetch("/api/activity");
        const allRuns = await res.json();
        setRuns(allRuns);
        const latest = allRuns.find(
          (r: AgentRun) => r.agentConfigId === agentId
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
        // ignore
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

  const triggerRun = useCallback(
    async (agentId: string) => {
      setRunningAgents((prev) => new Set(prev).add(agentId));
      setExpandedAgent(agentId);

      try {
        await fetch(`/api/agents/${agentId}/run`, { method: "POST" });
      } catch {
        // run may have started
      }

      startPolling(agentId);
    },
    [startPolling]
  );

  function getAgentRuns(agentId: string): AgentRun[] {
    return runs
      .filter((r) => r.agentConfigId === agentId)
      .slice(0, 5);
  }

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
            const isExpanded = expandedAgent === agent.id;
            const agentRuns = getAgentRuns(agent.id);

            return (
              <div
                key={agent.id}
                className="bg-white rounded-xl border border-surface overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-medium text-foreground">
                          {agent.name}
                        </h2>
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
                        <p className="text-sm text-muted truncate">
                          {agent.description}
                        </p>
                      ) : (
                        <p className="text-sm text-muted">
                          {agent.type.replace(/_/g, " ")}
                          {agent.schedule &&
                            ` · ${SCHEDULE_LABELS[agent.schedule] || agent.schedule}`}
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

                  {/* Recent runs toggle */}
                  {agentRuns.length > 0 && (
                    <button
                      onClick={() =>
                        setExpandedAgent(isExpanded ? null : agent.id)
                      }
                      className="mt-3 text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <span
                        className="inline-block transition-transform"
                        style={{
                          transform: isExpanded
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        ▶
                      </span>
                      {agentRuns.length} recent run{agentRuns.length !== 1 && "s"}
                    </button>
                  )}
                </div>

                {/* Expanded recent runs */}
                {isExpanded && agentRuns.length > 0 && (
                  <div className="border-t border-surface">
                    {agentRuns.map((run) => {
                      const isRunExpanded = expandedRun === run.id;
                      const writeCount =
                        run.toolCalls?.filter((t) => t.queued).length || 0;
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
                          className="border-b border-surface last:border-b-0"
                        >
                          <button
                            onClick={() =>
                              setExpandedRun(isRunExpanded ? null : run.id)
                            }
                            className="w-full text-left px-6 py-3 hover:bg-surface/30 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <StatusDot status={run.status} />
                                <span className="text-xs text-foreground">
                                  {run.triggeredBy === "cron"
                                    ? "Scheduled run"
                                    : "Manual run"}
                                </span>
                                {writeCount > 0 && (
                                  <span className="text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                                    {writeCount} queued
                                  </span>
                                )}
                                {duration !== null && (
                                  <span className="text-xs text-muted">
                                    {duration}s
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-muted">
                                {timeAgo(run.startedAt)}
                              </span>
                            </div>
                          </button>

                          {isRunExpanded && run.summary && (
                            <div className="px-6 pb-4">
                              <div className="md-content md-content-compact bg-surface/40 rounded-lg px-4 py-3">
                                <ReactMarkdown>{run.summary}</ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
