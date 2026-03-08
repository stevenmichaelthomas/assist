import { NextRequest, NextResponse } from "next/server";
import { getSessionOrg } from "@/lib/integrations/helpers";
import { getDb } from "@/lib/db";
import { agentMemory, agentConfigs, organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { memories, agents, businessName } = await req.json();
  const db = getDb();

  // Insert memories
  if (memories && memories.length > 0) {
    await db.insert(agentMemory).values(
      memories.map((m: { category: string; key: string; value: string }) => ({
        orgId: session.orgId,
        category: m.category,
        key: m.key,
        value: m.value,
      }))
    );
  }

  // Insert agent configs
  if (agents && agents.length > 0) {
    await db.insert(agentConfigs).values(
      agents.map(
        (a: {
          name: string;
          type: string;
          description: string;
          systemPrompt: string;
          toolsEnabled: string[];
          schedule: string | null;
        }) => ({
          orgId: session.orgId,
          name: a.name,
          type: a.type,
          description: a.description,
          systemPrompt: a.systemPrompt,
          toolsEnabled: a.toolsEnabled,
          schedule: a.schedule,
        })
      )
    );
  }

  // Update org name if provided
  if (businessName) {
    await db
      .update(organizations)
      .set({ name: businessName })
      .where(eq(organizations.id, session.orgId));
  }

  return NextResponse.json({ ok: true });
}
