import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { dailyBriefings } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSessionOrg } from "@/lib/integrations/helpers";
import { generateBriefing } from "@/lib/agents/briefing";

export async function GET() {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const briefings = await db.query.dailyBriefings.findMany({
    where: eq(dailyBriefings.orgId, session.orgId),
    orderBy: desc(dailyBriefings.date),
    limit: 14,
  });

  return NextResponse.json(briefings);
}

export async function POST() {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = await generateBriefing(session.orgId);
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Briefing generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate briefing" },
      { status: 500 }
    );
  }
}
