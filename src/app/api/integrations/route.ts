import { NextResponse } from "next/server";
import { getSessionOrg, getOrgIntegrations } from "@/lib/integrations/helpers";
import { getDb } from "@/lib/db";
import { integrations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await getOrgIntegrations(session.orgId);
  return NextResponse.json(rows);
}

export async function DELETE(req: Request) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await req.json();
  if (!type) {
    return NextResponse.json({ error: "type required" }, { status: 400 });
  }

  const db = getDb();
  await db
    .update(integrations)
    .set({ status: "disconnected", updatedAt: new Date() })
    .where(
      and(eq(integrations.orgId, session.orgId), eq(integrations.type, type))
    );

  return NextResponse.json({ success: true });
}
