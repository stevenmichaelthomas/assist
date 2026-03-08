import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentRuns, agentConfigs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSessionOrg } from "@/lib/integrations/helpers";

export async function GET() {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const runs = await db
    .select({
      id: agentRuns.id,
      agentConfigId: agentRuns.agentConfigId,
      agentName: agentConfigs.name,
      status: agentRuns.status,
      triggeredBy: agentRuns.triggeredBy,
      summary: agentRuns.summary,
      toolCalls: agentRuns.toolCalls,
      tokensUsed: agentRuns.tokensUsed,
      startedAt: agentRuns.startedAt,
      completedAt: agentRuns.completedAt,
    })
    .from(agentRuns)
    .leftJoin(agentConfigs, eq(agentRuns.agentConfigId, agentConfigs.id))
    .where(eq(agentRuns.orgId, session.orgId))
    .orderBy(desc(agentRuns.startedAt))
    .limit(50);

  return NextResponse.json(runs);
}
