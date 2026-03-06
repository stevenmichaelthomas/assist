import { NextRequest, NextResponse } from "next/server";
import { exchangeCode } from "@/lib/integrations/gmail/oauth";
import { saveIntegration, getSessionOrg } from "@/lib/integrations/helpers";

export async function GET(req: NextRequest) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/dashboard/integrations?error=missing_params", req.url)
    );
  }

  // Verify state contains our orgId
  const [orgId] = state.split(":");
  if (orgId !== session.orgId) {
    return NextResponse.redirect(
      new URL("/dashboard/integrations?error=invalid_state", req.url)
    );
  }

  try {
    const tokens = await exchangeCode(code);
    await saveIntegration(session.orgId, "gmail", {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    });

    return NextResponse.redirect(
      new URL("/dashboard/integrations?connected=gmail", req.url)
    );
  } catch (error) {
    console.error("Gmail OAuth error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/integrations?error=gmail_oauth_failed", req.url)
    );
  }
}
