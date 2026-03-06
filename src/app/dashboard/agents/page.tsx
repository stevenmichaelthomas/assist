"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AgentConfig = {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  schedule: string | null;
  createdAt: string;
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/agents/config")
      .then((r) => r.json())
      .then(setAgents)
      .finally(() => setLoading(false));
  }, []);

  async function triggerRun(agentId: string) {
    setRunning(agentId);
    try {
      const res = await fetch(`/api/agents/${agentId}/run`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(`Agent run complete. ${data.summary?.substring(0, 200) || "Done"}`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } finally {
      setRunning(null);
    }
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
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-xl border border-surface p-6"
            >
              <div className="flex items-center justify-between">
                <div>
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
                  </div>
                  <p className="text-sm text-muted">
                    Type: {agent.type}
                    {agent.schedule && ` | Schedule: ${agent.schedule}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => triggerRun(agent.id)}
                    disabled={running === agent.id}
                    className="bg-accent text-white text-sm px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
                  >
                    {running === agent.id ? "Running..." : "Run Now"}
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
          ))}
        </div>
      )}
    </div>
  );
}
