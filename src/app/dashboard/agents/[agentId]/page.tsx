"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type AgentConfig = {
  id: string;
  name: string;
  type: string;
  description: string;
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
    type: "custom",
    description: "",
    systemPrompt: "",
    toolsEnabled: ["gmail", "shopify"],
    schedule: null,
    enabled: true,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch("/api/agents/config")
        .then((r) => r.json())
        .then((configs: AgentConfig[]) => {
          const found = configs.find((c) => c.id === agentId);
          if (found) {
            setConfig(found);
            setGenerated(true); // existing agent already has a system prompt
          }
        })
        .finally(() => setLoading(false));
    }
  }, [agentId, isNew]);

  async function generate() {
    if (!config.description.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/agents/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: config.description }),
      });
      const result = await res.json();
      if (res.ok) {
        setConfig((prev) => ({
          ...prev,
          name: result.name || prev.name,
          type: result.type || prev.type,
          systemPrompt: result.systemPrompt || prev.systemPrompt,
          toolsEnabled: result.toolsEnabled || prev.toolsEnabled,
        }));
        setGenerated(true);
      }
    } finally {
      setGenerating(false);
    }
  }

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
      <h1 className="font-display text-3xl text-foreground mb-2">
        {isNew ? "Create Agent" : "Edit Agent"}
      </h1>
      {isNew && (
        <p className="text-muted text-sm mb-8">
          Describe the job you need done. AI will configure the agent for you.
        </p>
      )}

      <div className="space-y-6">
        {/* Job description — the primary input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            What should this agent do?
          </label>
          <textarea
            value={config.description}
            onChange={(e) => {
              setConfig({ ...config, description: e.target.value });
              if (generated && isNew) setGenerated(false);
            }}
            placeholder="e.g. Check my inbox every morning, triage emails by urgency, and draft replies to customer inquiries about orders and shipping. Flag anything that needs my personal attention."
            className="w-full border border-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent min-h-[120px]"
          />
        </div>

        {/* Generate button for new agents */}
        {isNew && !generated && (
          <button
            onClick={generate}
            disabled={generating || !config.description.trim()}
            className="bg-foreground text-white text-sm px-6 py-2.5 rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {generating ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating agent config...
              </>
            ) : (
              "Set up this agent"
            )}
          </button>
        )}

        {/* Generated config — shown after AI generates it */}
        {generated && (
          <div className="space-y-6 border-t border-surface pt-6">
            <div className="bg-surface/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-foreground">
                  Agent Configuration
                </h2>
                {isNew && (
                  <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded">
                    AI-generated
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1">Name</label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) =>
                      setConfig({ ...config, name: e.target.value })
                    }
                    className="w-full border border-surface rounded px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Type</label>
                  <select
                    value={config.type}
                    onChange={(e) =>
                      setConfig({ ...config, type: e.target.value })
                    }
                    className="w-full border border-surface rounded px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
                  >
                    <option value="email_triage">Email Triage</option>
                    <option value="order_manager">Order Manager</option>
                    <option value="briefing">Daily Briefing</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-muted mb-1">
                  Integrations
                </label>
                <div className="flex gap-3">
                  {["gmail", "shopify"].map((tool) => (
                    <label
                      key={tool}
                      className="flex items-center gap-1.5 text-sm"
                    >
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
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                When should it run?
              </label>
              <select
                value={config.schedule || ""}
                onChange={(e) =>
                  setConfig({ ...config, schedule: e.target.value || null })
                }
                className="w-full border border-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              >
                <option value="">Only when I trigger it manually</option>
                <option value="0 9 * * *">Every morning (9am UTC)</option>
                <option value="0 9 * * 1-5">Every weekday morning (9am UTC)</option>
                <option value="0 9,17 * * *">Twice a day (9am & 5pm UTC)</option>
                <option value="0 */4 * * *">Every 4 hours</option>
                <option value="0 */2 * * *">Every 2 hours</option>
                <option value="0 * * * *">Every hour</option>
                <option value="0 12 * * 1">Once a week (Monday noon UTC)</option>
              </select>
            </div>

            {/* Enabled toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) =>
                  setConfig({ ...config, enabled: e.target.checked })
                }
                className="rounded"
              />
              <label className="text-sm text-foreground">Enabled</label>
            </div>

            {/* Advanced: system prompt (collapsible) */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-muted hover:text-foreground flex items-center gap-1"
              >
                <span
                  className="transition-transform inline-block"
                  style={{
                    transform: showAdvanced
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                  }}
                >
                  ▶
                </span>
                Advanced: View/edit system prompt
              </button>
              {showAdvanced && (
                <textarea
                  value={config.systemPrompt}
                  onChange={(e) =>
                    setConfig({ ...config, systemPrompt: e.target.value })
                  }
                  className="w-full border border-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent min-h-[250px] font-mono mt-2"
                />
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={save}
                disabled={saving || !config.name || !config.systemPrompt}
                className="bg-foreground text-white text-sm px-6 py-2 rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : isNew
                    ? "Create Agent"
                    : "Save Changes"}
              </button>
              {isNew && generated && (
                <button
                  onClick={() => {
                    setGenerated(false);
                    setConfig((prev) => ({
                      ...prev,
                      systemPrompt: "",
                      name: "",
                      type: "custom",
                    }));
                  }}
                  className="text-sm text-muted hover:text-foreground px-4 py-2"
                >
                  Re-generate
                </button>
              )}
              <button
                onClick={() => router.push("/dashboard/agents")}
                className="text-sm text-muted hover:text-foreground px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
