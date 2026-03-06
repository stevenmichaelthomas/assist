import { NextRequest, NextResponse } from "next/server";
import { exchangeCode, verifyHmac } from "@/lib/integrations/shopify/oauth";
import { saveIntegration, getSessionOrg } from "@/lib/integrations/helpers";

export async function GET(req: NextRequest) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const { code, state, shop } = params;

  if (!code || !state || !shop) {
    return NextResponse.redirect(
      new URL("/dashboard/integrations?error=missing_params", req.url)
    );
  }

  // Verify HMAC
  if (!verifyHmac(params)) {
    return NextResponse.redirect(
      new URL("/dashboard/integrations?error=invalid_hmac", req.url)
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
    const { access_token, scope } = await exchangeCode(shop, code);
    await saveIntegration(
      session.orgId,
      "shopify",
      { access_token },
      { shop, scope }
    );

    return NextResponse.redirect(
      new URL("/dashboard/integrations?connected=shopify", req.url)
    );
  } catch (error) {
    console.error("Shopify OAuth error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/integrations?error=shopify_oauth_failed", req.url)
    );
  }
}
