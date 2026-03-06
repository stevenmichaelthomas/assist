import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { pendingActions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionOrg } from "@/lib/integrations/helpers";
import { executeWriteTool } from "@/lib/agents/executor";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { actionId: string } }
) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, editedInput } = await req.json();

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const db = getDb();

  // Verify the action belongs to this org
  const pendingAction = await db.query.pendingActions.findFirst({
    where: and(
      eq(pendingActions.id, params.actionId),
      eq(pendingActions.orgId, session.orgId)
    ),
  });

  if (!pendingAction) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (pendingAction.status !== "pending") {
    return NextResponse.json(
      { error: "Action already processed" },
      { status: 400 }
    );
  }

  if (action === "reject") {
    await db
      .update(pendingActions)
      .set({
        status: "rejected",
        reviewedBy: session.userId,
        reviewedAt: new Date(),
      })
      .where(eq(pendingActions.id, params.actionId));

    return NextResponse.json({ status: "rejected" });
  }

  // Approve and execute
  const toolInput = editedInput || pendingAction.toolInput;

  try {
    const result = await executeWriteTool(
      pendingAction.toolName,
      toolInput as Record<string, unknown>,
      session.orgId
    );

    await db
      .update(pendingActions)
      .set({
        status: "executed",
        reviewedBy: session.userId,
        reviewedAt: new Date(),
        editedInput: editedInput || null,
        executionResult: result as Record<string, unknown>,
      })
      .where(eq(pendingActions.id, params.actionId));

    return NextResponse.json({ status: "executed", result });
  } catch (error) {
    console.error("Execution error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Execution failed",
      },
      { status: 500 }
    );
  }
}
