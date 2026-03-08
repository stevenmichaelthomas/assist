"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type Briefing = {
  id: string;
  date: string;
  content: string;
  createdAt: string;
};

export default function BriefingsPage() {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchBriefings();
  }, []);

  async function fetchBriefings() {
    const res = await fetch("/api/briefings");
    if (res.ok) {
      const data = await res.json();
      setBriefings(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    }
    setLoading(false);
  }

  async function generateBriefing() {
    setGenerating(true);
    try {
      await fetch("/api/briefings", { method: "POST" });
      await fetchBriefings();
    } finally {
      setGenerating(false);
    }
  }

  const selected = briefings.find((b) => b.id === selectedId);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-2">
            Daily Briefings
          </h1>
          <p className="text-muted">AI-generated summaries of your business</p>
        </div>
        <button
          onClick={generateBriefing}
          disabled={generating}
          className="bg-foreground text-white text-sm px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate Briefing"}
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : briefings.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface p-8 text-center">
          <p className="text-muted mb-4">
            No briefings yet. Generate your first one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            {briefings.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedId === b.id
                    ? "bg-surface text-foreground font-medium"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {b.date}
              </button>
            ))}
          </div>
          <div className="md:col-span-3">
            {selected && (
              <div className="bg-white rounded-xl border border-surface p-6">
                <h2 className="font-display text-xl text-foreground mb-4">
                  {selected.date}
                </h2>
                <div className="prose prose-sm prose-neutral max-w-none text-foreground/80">
                  <ReactMarkdown>{selected.content}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
