"use client";

import { useEffect, useState } from "react";

type Memory = {
  id: string;
  category: string;
  key: string;
  value: string;
  updatedAt: string;
};

const CATEGORIES = ["products", "contacts", "policies", "general"];

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newMemory, setNewMemory] = useState({
    category: "general",
    key: "",
    value: "",
  });

  useEffect(() => {
    fetchMemories();
  }, []);

  async function fetchMemories() {
    const res = await fetch("/api/memory");
    if (res.ok) setMemories(await res.json());
    setLoading(false);
  }

  async function addMemory() {
    if (!newMemory.key || !newMemory.value) return;
    await fetch("/api/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMemory),
    });
    setShowAdd(false);
    setNewMemory({ category: "general", key: "", value: "" });
    fetchMemories();
  }

  async function updateMemory(id: string) {
    await fetch("/api/memory", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, value: editValue }),
    });
    setEditingId(null);
    fetchMemories();
  }

  async function deleteMemory(id: string) {
    await fetch("/api/memory", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchMemories();
  }

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: memories.filter((m) => m.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-2">
            Agent Memory
          </h1>
          <p className="text-muted">
            Knowledge base your agents use to understand your business
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-foreground text-white text-sm px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors"
        >
          Add Memory
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-surface p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              value={newMemory.category}
              onChange={(e) =>
                setNewMemory({ ...newMemory, category: e.target.value })
              }
              className="border border-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Key (e.g. Wholesale Pricing)"
              value={newMemory.key}
              onChange={(e) =>
                setNewMemory({ ...newMemory, key: e.target.value })
              }
              className="border border-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <textarea
            placeholder="Value (the knowledge to store)"
            value={newMemory.value}
            onChange={(e) =>
              setNewMemory({ ...newMemory, value: e.target.value })
            }
            className="w-full border border-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent min-h-[100px] mb-4"
          />
          <div className="flex gap-2">
            <button
              onClick={addMemory}
              className="bg-foreground text-white text-sm px-4 py-2 rounded-lg hover:bg-foreground/90"
            >
              Save
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="text-sm text-muted hover:text-foreground px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : grouped.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface p-8 text-center">
          <p className="text-muted">
            No memories yet. Add knowledge about your products, contacts, and
            policies.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ category, items }) => (
            <div key={category}>
              <h2 className="font-display text-lg text-foreground mb-3 capitalize">
                {category}
              </h2>
              <div className="space-y-2">
                {items.map((mem) => (
                  <div
                    key={mem.id}
                    className="bg-white rounded-xl border border-surface p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-foreground">
                        {mem.key}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(mem.id);
                            setEditValue(mem.value);
                          }}
                          className="text-xs text-muted hover:text-foreground"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMemory(mem.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {editingId === mem.id ? (
                      <div>
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full border border-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent min-h-[80px] mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateMemory(mem.id)}
                            className="text-xs bg-foreground text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-xs text-muted px-3 py-1"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/70 whitespace-pre-wrap">
                        {mem.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
