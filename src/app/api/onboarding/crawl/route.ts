import { NextRequest, NextResponse } from "next/server";
import { getSessionOrg } from "@/lib/integrations/helpers";
import { crawlWebsite } from "@/lib/onboarding/crawl";

export async function POST(req: NextRequest) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  try {
    const result = await crawlWebsite(url);
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Crawl failed";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
