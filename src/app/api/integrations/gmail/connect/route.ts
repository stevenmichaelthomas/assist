import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/integrations/gmail/oauth";
import { getSessionOrg } from "@/lib/integrations/helpers";
import crypto from "crypto";

export async function GET() {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // State = orgId:nonce (verified in callback)
  const state = `${session.orgId}:${crypto.randomBytes(16).toString("hex")}`;
  const url = getAuthUrl(state);

  return NextResponse.redirect(url);
}
