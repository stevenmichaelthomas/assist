"use client";

import { useEffect, useState } from "react";

type Integration = {
  id: string;
  type: string;
  status: string;
  metadata: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopDomain, setShopDomain] = useState("");

  useEffect(() => {
    fetchIntegrations();
  }, []);

  async function fetchIntegrations() {
    const res = await fetch("/api/integrations");
    if (res.ok) {
      setIntegrations(await res.json());
    }
    setLoading(false);
  }

  async function disconnect(type: string) {
    await fetch("/api/integrations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    fetchIntegrations();
  }

  const gmail = integrations.find(
    (i) => i.type === "gmail" && i.status === "connected"
  );
  const shopify = integrations.find(
    (i) => i.type === "shopify" && i.status === "connected"
  );

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl text-foreground mb-2">Integrations</h1>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground mb-2">Integrations</h1>
      <p className="text-muted mb-8">
        Connect your tools so agents can work on your behalf.
      </p>

      <div className="grid gap-4 max-w-xl">
        {/* Gmail */}
        <div className="bg-white rounded-xl border border-surface p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 font-bold text-sm">
                G
              </div>
              <div>
                <h2 className="font-medium text-foreground">Gmail</h2>
                <p className="text-sm text-muted">
                  Read and send emails on your behalf
                </p>
              </div>
            </div>
            {gmail ? (
              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                Connected
              </span>
            ) : (
              <span className="text-xs text-muted">Not connected</span>
            )}
          </div>
          {gmail ? (
            <button
              onClick={() => disconnect("gmail")}
              className="text-sm text-red-600 hover:underline"
            >
              Disconnect
            </button>
          ) : (
            <a
              href="/api/integrations/gmail/connect"
              className="inline-block bg-foreground text-white text-sm px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors"
            >
              Connect Gmail
            </a>
          )}
        </div>

        {/* Shopify */}
        <div className="bg-white rounded-xl border border-surface p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-700 font-bold text-sm">
                S
              </div>
              <div>
                <h2 className="font-medium text-foreground">Shopify</h2>
                <p className="text-sm text-muted">
                  Manage orders, customers, and products
                </p>
              </div>
            </div>
            {shopify ? (
              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                Connected
              </span>
            ) : (
              <span className="text-xs text-muted">Not connected</span>
            )}
          </div>
          {shopify ? (
            <div>
              <p className="text-sm text-muted mb-2">
                Store: {(shopify.metadata as Record<string, string>)?.shop}
              </p>
              <button
                onClick={() => disconnect("shopify")}
                className="text-sm text-red-600 hover:underline"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="my-store.myshopify.com"
                value={shopDomain}
                onChange={(e) => setShopDomain(e.target.value)}
                className="flex-1 border border-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              />
              <a
                href={
                  shopDomain
                    ? `/api/integrations/shopify/connect?shop=${encodeURIComponent(shopDomain)}`
                    : "#"
                }
                onClick={(e) => !shopDomain && e.preventDefault()}
                className={`bg-foreground text-white text-sm px-4 py-2 rounded-lg transition-colors ${
                  shopDomain ? "hover:bg-foreground/90" : "opacity-50 cursor-not-allowed"
                }`}
              >
                Connect
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
