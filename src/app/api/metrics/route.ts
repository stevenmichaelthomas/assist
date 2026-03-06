import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentRuns, pendingActions } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { getSessionOrg, getIntegrationCredentials } from "@/lib/integrations/helpers";
import { getRecentOrders, getCustomers } from "@/lib/integrations/shopify/client";
import { integrations } from "@/lib/db/schema";

export async function GET() {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Agent metrics
  const [runsToday] = await db
    .select({ count: sql<number>`count(*)` })
    .from(agentRuns)
    .where(
      and(
        eq(agentRuns.orgId, session.orgId),
        gte(agentRuns.startedAt, today)
      )
    );

  const [pendingCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(pendingActions)
    .where(
      and(
        eq(pendingActions.orgId, session.orgId),
        eq(pendingActions.status, "pending")
      )
    );

  const metrics: Record<string, unknown> = {
    agentRunsToday: Number(runsToday.count),
    pendingApprovals: Number(pendingCount.count),
  };

  // Try to get Shopify metrics if connected
  try {
    const shopifyCreds = await getIntegrationCredentials(session.orgId, "shopify");
    if (shopifyCreds) {
      const integration = await db.query.integrations.findFirst({
        where: and(
          eq(integrations.orgId, session.orgId),
          eq(integrations.type, "shopify")
        ),
      });
      const shop = (integration?.metadata as Record<string, string>)?.shop;
      if (shop) {
        const orders = await getRecentOrders(
          shop,
          shopifyCreds.access_token as string,
          10
        );
        const customers = await getCustomers(
          shop,
          shopifyCreds.access_token as string,
          5
        );

        // MTD revenue
        const mtdStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const mtdRevenue = orders
          .filter(
            (o: { createdAt: string }) => new Date(o.createdAt) >= mtdStart
          )
          .reduce(
            (sum: number, o: { totalPriceSet: { shopMoney: { amount: string } } }) =>
              sum + parseFloat(o.totalPriceSet.shopMoney.amount),
            0
          );

        metrics.shopify = {
          recentOrders: orders.length,
          mtdRevenue: mtdRevenue.toFixed(2),
          topCustomers: customers.slice(0, 5),
        };
      }
    }
  } catch {
    // Shopify metrics are optional
  }

  return NextResponse.json(metrics);
}
