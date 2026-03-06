"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type AgentConfig = {
  id: string;
  name: string;
  type: string;
  systemPrompt: string;
  toolsEnabled: string[];
  schedule: string | null;
  enabled: boolean;
};

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;
  const isNew = agentId === "new";

  const [config, setConfig] = useState<AgentConfig>({
    id: "",
    name: "",
    type: "email_triage",
    systemPrompt: "",
    toolsEnabled: ["gmail", "shopify"],
    schedule: null,
    enabled: true,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch("/api/agents/config")
        .then((r) => r.json())
        .then((configs: AgentConfig[]) => {
          const found = configs.find((c) => c.id === agentId);
          if (found) setConfig(found);
        })
        .finally(() => setLoading(false));
    }
  }, [agentId, isNew]);

  async function save() {
    setSaving(true);
    try {
      if (isNew) {
        await fetch("/api/agents/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        });
      } else {
        await fetch("/api/agents/config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        });
      }
      router.push("/dashboard/agents");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-foreground mb-8">
        {isNew ? "Create Agent" : "Edit Agent"}
      </h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Name
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => setConfig({ ...config, name: e.target.value })}
            placeholder="e.g. Email Triage"
            className="w-full border border-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Type
          </label>
          <select
            value={config.type}
            onChange={(e) => setConfig({ ...config, type: e.target.value })}
            className="w-full border border-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
          >
            <option value="email_triage">Email Triage</option>
            <option value="order_manager">Order Manager</option>
            <option value="briefing">Daily Briefing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            System Prompt
          </label>
          <textarea
            value={config.systemPrompt}
            onChange={(e) =>
              setConfig({ ...config, systemPrompt: e.target.value })
            }
            placeholder="Instructions for the agent..."
            className="w-full border border-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent min-h-[300px] font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tools
          </label>
          <div className="flex gap-4">
            {["gmail", "shopify"].map((tool) => (
              <label key={tool} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={config.toolsEnabled.includes(tool)}
                  onChange={(e) => {
                    const tools = e.target.checked
                      ? [...config.toolsEnabled, tool]
                      : config.toolsEnabled.filter((t) => t !== tool);
                    setConfig({ ...config, toolsEnabled: tools });
                  }}
                  className="rounded"
                />
                <span className="capitalize">{tool}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Schedule (cron expression, optional)
          </label>
          <input
            type="text"
            value={config.schedule || ""}
            onChange={(e) =>
              setConfig({ ...config, schedule: e.target.value || null })
            }
            placeholder="e.g. 0 12 * * * (daily at noon)"
            className="w-full border border-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
            className="rounded"
          />
          <label className="text-sm text-foreground">Enabled</label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={save}
            disabled={saving || !config.name || !config.systemPrompt}
            className="bg-foreground text-white text-sm px-6 py-2 rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : isNew ? "Create Agent" : "Save Changes"}
          </button>
          <button
            onClick={() => router.push("/dashboard/agents")}
            className="text-sm text-muted hover:text-foreground px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
