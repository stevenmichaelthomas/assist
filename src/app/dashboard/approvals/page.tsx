"use client";

import { useEffect, useState } from "react";

type PendingAction = {
  id: string;
  toolName: string;
  toolInput: Record<string, unknown>;
  description: string;
  status: string;
  createdAt: string;
  reviewedAt: string | null;
  executionResult: Record<string, unknown> | null;
};

export default function ApprovalsPage() {
  const [actions, setActions] = useState<PendingAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedInput, setEditedInput] = useState("");
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  useEffect(() => {
    fetchActions();
  }, []);

  async function fetchActions() {
    const res = await fetch("/api/approvals");
    if (res.ok) {
      setActions(await res.json());
    }
    setLoading(false);
  }

  async function handleAction(actionId: string, action: "approve" | "reject", edited?: Record<string, unknown>) {
    setProcessing(actionId);
    try {
      const res = await fetch(`/api/approvals/${actionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, editedInput: edited }),
      });
      if (res.ok) {
        fetchActions();
        setEditingId(null);
      }
    } finally {
      setProcessing(null);
    }
  }

  const filtered = filter === "pending"
    ? actions.filter((a) => a.status === "pending")
    : actions;

  const pendingCount = actions.filter((a) => a.status === "pending").length;

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl text-foreground mb-2">Approval Queue</h1>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-2">
            Approval Queue
          </h1>
          <p className="text-muted">
            {pendingCount} action{pendingCount !== 1 ? "s" : ""} waiting for review
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === "pending"
                ? "bg-surface text-foreground font-medium"
                : "text-muted hover:text-foreground"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === "all"
                ? "bg-surface text-foreground font-medium"
                : "text-muted hover:text-foreground"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface p-8 text-center">
          <p className="text-muted">
            {filter === "pending"
              ? "No pending actions. Run an agent to generate actions."
              : "No actions yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((action) => (
            <div
              key={action.id}
              className="bg-white rounded-xl border border-surface p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono bg-surface text-foreground/70 px-2 py-0.5 rounded">
                      {action.toolName}
                    </span>
                    <StatusBadge status={action.status} />
                  </div>
                  <p className="text-foreground font-medium">
                    {action.description}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {new Date(action.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Show email preview for gmail_send */}
              {action.toolName === "gmail_send" && (
                <div className="bg-surface/50 rounded-lg p-4 mb-4 text-sm">
                  <div className="text-muted mb-1">
                    <strong>To:</strong> {action.toolInput.to as string}
                  </div>
                  <div className="text-muted mb-2">
                    <strong>Subject:</strong> {action.toolInput.subject as string}
                  </div>
                  <div className="whitespace-pre-wrap text-foreground/80">
                    {editingId === action.id ? (
                      <textarea
                        value={editedInput}
                        onChange={(e) => setEditedInput(e.target.value)}
                        className="w-full min-h-[120px] bg-white border border-surface rounded p-2 text-sm focus:outline-none focus:border-accent"
                      />
                    ) : (
                      action.toolInput.body as string
                    )}
                  </div>
                </div>
              )}

              {/* Show order preview for shopify_create_draft_order */}
              {action.toolName === "shopify_create_draft_order" && (
                <div className="bg-surface/50 rounded-lg p-4 mb-4 text-sm">
                  <div className="text-muted mb-1">
                    <strong>Items:</strong>
                  </div>
                  {(
                    action.toolInput.line_items as Array<{
                      variant_id: string;
                      quantity: number;
                    }>
                  )?.map((item, i) => (
                    <div key={i} className="text-foreground/80">
                      {item.quantity}x {item.variant_id}
                    </div>
                  ))}
                  {(action.toolInput.note as string) && (
                    <div className="text-muted mt-2">
                      <strong>Note:</strong> {action.toolInput.note as string}
                    </div>
                  )}
                </div>
              )}

              {action.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (editingId === action.id) {
                        // Save edits and approve
                        const edited = {
                          ...action.toolInput,
                          body: editedInput,
                        };
                        handleAction(action.id, "approve", edited);
                      } else {
                        handleAction(action.id, "approve");
                      }
                    }}
                    disabled={processing === action.id}
                    className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {processing === action.id
                      ? "Processing..."
                      : editingId === action.id
                      ? "Save & Approve"
                      : "Approve"}
                  </button>
                  {action.toolName === "gmail_send" && editingId !== action.id && (
                    <button
                      onClick={() => {
                        setEditingId(action.id);
                        setEditedInput(action.toolInput.body as string);
                      }}
                      className="bg-surface text-foreground text-sm px-4 py-2 rounded-lg hover:bg-surface/80 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(action.id, "reject")}
                    disabled={processing === action.id}
                    className="text-red-600 text-sm px-4 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}

              {action.status === "executed" && action.executionResult && (
                <div className="text-xs text-green-700 bg-green-50 rounded-lg p-3">
                  Executed successfully
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    executed: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
    approved: "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        styles[status] || "bg-surface text-muted"
      }`}
    >
      {status}
    </span>
  );
}
