import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentConfigs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { runAgent } from "@/lib/agents/executor";

export async function GET(req: NextRequest) {
  // Verify cron secret for Vercel Cron Jobs
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const configs = await db.query.agentConfigs.findMany({
    where: eq(agentConfigs.enabled, true),
  });

  const results = [];
  for (const config of configs) {
    if (!config.schedule) continue;

    try {
      const result = await runAgent(config.id, config.orgId, "cron");
      results.push({ agentId: config.id, status: "ok", runId: result.runId });
    } catch (error) {
      results.push({
        agentId: config.id,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown",
      });
    }
  }

  return NextResponse.json({ results });
}
