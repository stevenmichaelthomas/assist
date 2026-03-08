import { NextRequest, NextResponse } from "next/server";
import { getSessionOrg } from "@/lib/integrations/helpers";
import { analyzeBusinessContent } from "@/lib/onboarding/analyze";

export async function POST(req: NextRequest) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, pages } = await req.json();
  if (!url || !pages || !Array.isArray(pages)) {
    return NextResponse.json(
      { error: "url and pages are required" },
      { status: 400 }
    );
  }

  try {
    const result = await analyzeBusinessContent(url, pages);
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
