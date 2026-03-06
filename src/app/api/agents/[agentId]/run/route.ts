import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/agents/executor";
import { getSessionOrg } from "@/lib/integrations/helpers";

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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Agent run failed" },
      { status: 500 }
    );
  }
}
