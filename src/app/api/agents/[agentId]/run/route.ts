import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/agents/executor";
import { getSessionOrg } from "@/lib/integrations/helpers";

// Allow up to 120s for agent runs on Vercel
export const maxDuration = 120;

export async function POST(
  req: NextRequest,
  { params }: { params: { agentId: string } }
) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runAgent(params.agentId, session.orgId, "manual");
    return NextResponse.json(result);
  } catch (error) {
    console.error("Agent run error:", error);
    const message = error instanceof Error ? error.message : "Agent run failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
