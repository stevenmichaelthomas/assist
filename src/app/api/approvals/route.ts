import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { pendingActions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSessionOrg } from "@/lib/integrations/helpers";

export async function GET() {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const actions = await db.query.pendingActions.findMany({
    where: eq(pendingActions.orgId, session.orgId),
    orderBy: desc(pendingActions.createdAt),
  });

  return NextResponse.json(actions);
}
