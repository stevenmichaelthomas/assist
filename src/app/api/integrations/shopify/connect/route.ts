import { NextRequest, NextResponse } from "next/server";
import { getInstallUrl } from "@/lib/integrations/shopify/oauth";
import { getSessionOrg } from "@/lib/integrations/helpers";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shop = req.nextUrl.searchParams.get("shop");
  if (!shop || !shop.endsWith(".myshopify.com")) {
    return NextResponse.json(
      { error: "Valid shop domain required (e.g. my-store.myshopify.com)" },
      { status: 400 }
    );
  }

  const state = `${session.orgId}:${shop}:${crypto.randomBytes(16).toString("hex")}`;
  const url = getInstallUrl(shop, state);

  return NextResponse.redirect(url);
}
