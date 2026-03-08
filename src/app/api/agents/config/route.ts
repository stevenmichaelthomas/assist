import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentConfigs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionOrg } from "@/lib/integrations/helpers";

export async function GET() {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const configs = await db.query.agentConfigs.findMany({
    where: eq(agentConfigs.orgId, session.orgId),
  });

  return NextResponse.json(configs);
}

export async function POST(req: NextRequest) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, type, systemPrompt, description, toolsEnabled, schedule } = await req.json();
  if (!name || !type || !systemPrompt) {
    return NextResponse.json(
      { error: "name, type, and systemPrompt required" },
      { status: 400 }
    );
  }

  const db = getDb();
  const [config] = await db
    .insert(agentConfigs)
    .values({
      orgId: session.orgId,
      name,
      type,
      description: description || null,
      systemPrompt,
      toolsEnabled: toolsEnabled || ["gmail", "shopify"],
      schedule: schedule || null,
    })
    .returning();

  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const db = getDb();
  await db
    .update(agentConfigs)
    .set({
      ...(body.name !== undefined && { name: body.name }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.systemPrompt !== undefined && { systemPrompt: body.systemPrompt }),
      ...(body.toolsEnabled !== undefined && { toolsEnabled: body.toolsEnabled }),
      ...(body.schedule !== undefined && { schedule: body.schedule }),
      ...(body.enabled !== undefined && { enabled: body.enabled }),
      updatedAt: new Date(),
    })
    .where(
      and(eq(agentConfigs.id, id), eq(agentConfigs.orgId, session.orgId))
    );

  return NextResponse.json({ success: true });
}
