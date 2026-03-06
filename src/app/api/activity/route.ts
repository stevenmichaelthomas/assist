import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentRuns } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSessionOrg } from "@/lib/integrations/helpers";

export async function GET() {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const runs = await db.query.agentRuns.findMany({
    where: eq(agentRuns.orgId, session.orgId),
    orderBy: desc(agentRuns.startedAt),
    limit: 50,
  });

  return NextResponse.json(runs);
}
