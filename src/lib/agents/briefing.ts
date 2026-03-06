import Anthropic from "@anthropic-ai/sdk";
import { getDb } from "@/lib/db";
import { agentRuns, pendingActions, dailyBriefings } from "@/lib/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";

export async function generateBriefing(orgId: string): Promise<string> {
  const db = getDb();
  const anthropic = new Anthropic();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateStr = today.toISOString().split("T")[0];

  // Gather data from last 24 hours
  const recentRuns = await db.query.agentRuns.findMany({
    where: and(
      eq(agentRuns.orgId, orgId),
      gte(agentRuns.startedAt, today)
    ),
    orderBy: desc(agentRuns.startedAt),
  });

  const pendingCount = await db.query.pendingActions.findMany({
    where: and(
      eq(pendingActions.orgId, orgId),
      eq(pendingActions.status, "pending")
    ),
  });

  const recentActions = await db.query.pendingActions.findMany({
    where: and(
      eq(pendingActions.orgId, orgId),
      gte(pendingActions.createdAt, today)
    ),
    orderBy: desc(pendingActions.createdAt),
  });

  const briefingData = {
    date: dateStr,
    agentRuns: recentRuns.map((r) => ({
      status: r.status,
      summary: r.summary,
      tokensUsed: r.tokensUsed,
      startedAt: r.startedAt,
    })),
    pendingActions: pendingCount.length,
    todayActions: recentActions.map((a) => ({
      tool: a.toolName,
      description: a.description,
      status: a.status,
    })),
  };

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Generate a concise daily briefing for ${dateStr} based on this data:\n\n${JSON.stringify(briefingData, null, 2)}\n\nFormat as markdown with sections: Summary, Agent Activity, Pending Actions, Key Highlights. Keep it short and actionable.`,
      },
    ],
  });

  const content = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("\n");

  // Save briefing
  await db.insert(dailyBriefings).values({
    orgId,
    date: dateStr,
    content,
    metrics: briefingData,
  });

  return content;
}
