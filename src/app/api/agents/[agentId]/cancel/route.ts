import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentRuns } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionOrg } from "@/lib/integrations/helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: { agentId: string } }
) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();

  // Find the most recent running run for this agent
  const [run] = await db
    .select()
    .from(agentRuns)
    .where(
      and(
        eq(agentRuns.agentConfigId, params.agentId),
        eq(agentRuns.orgId, session.orgId),
        eq(agentRuns.status, "running")
      )
    )
    .limit(1);

  if (!run) {
    return NextResponse.json({ error: "No running job found" }, { status: 404 });
  }

  await db
    .update(agentRuns)
    .set({
      status: "failed",
      summary: "Cancelled by user.",
      completedAt: new Date(),
    })
    .where(eq(agentRuns.id, run.id));

  return NextResponse.json({ ok: true, runId: run.id });
}
