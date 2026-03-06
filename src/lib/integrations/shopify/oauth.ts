import crypto from "crypto";

const SCOPES = [
  "read_orders",
  "write_orders",
  "read_draft_orders",
  "write_draft_orders",
  "read_customers",
  "write_customers",
  "read_products",
  "write_products",
].join(",");

export function getInstallUrl(shop: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.SHOPIFY_CLIENT_ID!,
    scope: SCOPES,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/integrations/shopify/callback`,
    state,
    grant_options: "per-user",
  });
  return `https://${shop}/admin/oauth/authorize?${params}`;
}

export async function exchangeCode(shop: string, code: string) {
  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      code,
    }),
  });

  if (!res.ok) {
    throw new Error(`Shopify token exchange failed: ${res.status}`);
  }

  return res.json() as Promise<{ access_token: string; scope: string }>;
}

export function verifyHmac(query: Record<string, string>): boolean {
  const { hmac, ...rest } = query;
  if (!hmac) return false;

  const message = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join("&");

  const computed = crypto
    .createHmac("sha256", process.env.SHOPIFY_CLIENT_SECRET!)
    .update(message)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(computed));
}
