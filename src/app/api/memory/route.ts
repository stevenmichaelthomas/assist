import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentMemory } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionOrg } from "@/lib/integrations/helpers";

export async function GET() {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const memories = await db.query.agentMemory.findMany({
    where: eq(agentMemory.orgId, session.orgId),
    orderBy: agentMemory.category,
  });

  return NextResponse.json(memories);
}

export async function POST(req: NextRequest) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category, key, value } = await req.json();
  if (!category || !key || !value) {
    return NextResponse.json({ error: "category, key, and value required" }, { status: 400 });
  }

  const db = getDb();
  const [row] = await db
    .insert(agentMemory)
    .values({ orgId: session.orgId, category, key, value })
    .returning();

  return NextResponse.json(row);
}

export async function PUT(req: NextRequest) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, value } = await req.json();
  if (!id || !value) {
    return NextResponse.json({ error: "id and value required" }, { status: 400 });
  }

  const db = getDb();
  await db
    .update(agentMemory)
    .set({ value, updatedAt: new Date() })
    .where(
      and(eq(agentMemory.id, id), eq(agentMemory.orgId, session.orgId))
    );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const db = getDb();
  await db
    .delete(agentMemory)
    .where(
      and(eq(agentMemory.id, id), eq(agentMemory.orgId, session.orgId))
    );

  return NextResponse.json({ success: true });
}
