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

  // Start the agent run in the background — return immediately with the run ID
  // The run inserts a row with status "running" before doing any work,
  // so the client can poll /api/activity or /api/agents/runs/[runId] for status.
  const runPromise = runAgent(params.agentId, session.orgId, "manual");

  // Give it a moment to create the DB row
  const result = await Promise.race([
    runPromise.then((r) => ({ done: true, ...r })),
    new Promise<{ done: false }>((resolve) =>
      setTimeout(() => resolve({ done: false }), 500)
    ),
  ]);

  if (result.done) {
    // Fast run — completed in under 500ms
    return NextResponse.json(result);
  }

  // Still running — let it continue in background, return early
  runPromise.catch((error) => {
    console.error("Background agent run error:", error);
  });

  return NextResponse.json({ status: "started", message: "Agent is running" });
}
