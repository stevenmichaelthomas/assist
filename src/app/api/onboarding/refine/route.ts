import { NextRequest, NextResponse } from "next/server";
import { getSessionOrg } from "@/lib/integrations/helpers";
import { refineWithPrompt } from "@/lib/onboarding/analyze";

export async function POST(req: NextRequest) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { current, prompt } = await req.json();
  if (!current || !prompt) {
    return NextResponse.json(
      { error: "current data and prompt are required" },
      { status: 400 }
    );
  }

  try {
    const result = await refineWithPrompt(current, prompt);
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Refinement failed";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
