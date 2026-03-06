import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { integrations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { encrypt, decrypt } from "@/lib/crypto";

export async function getSessionOrg() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(
      (await import("@/lib/db/schema")).users.id,
      session.user.id
    ),
  });

  if (!user?.orgId) return null;
  return { userId: session.user.id, orgId: user.orgId };
}

export async function saveIntegration(
  orgId: string,
  type: string,
  credentials: Record<string, unknown>,
  metadata?: Record<string, unknown>
) {
  const db = getDb();
  const encrypted = encrypt(JSON.stringify(credentials));

  // Upsert — check if integration exists
  const existing = await db.query.integrations.findFirst({
    where: and(eq(integrations.orgId, orgId), eq(integrations.type, type)),
  });

  if (existing) {
    await db
      .update(integrations)
      .set({
        credentials: encrypted,
        metadata: metadata || existing.metadata,
        status: "connected",
        updatedAt: new Date(),
      })
      .where(eq(integrations.id, existing.id));
    return existing.id;
  }

  const [row] = await db
    .insert(integrations)
    .values({
      orgId,
      type,
      credentials: encrypted,
      metadata,
      status: "connected",
    })
    .returning({ id: integrations.id });
  return row.id;
}

export async function getIntegrationCredentials(
  orgId: string,
  type: string
): Promise<Record<string, unknown> | null> {
  const db = getDb();
  const row = await db.query.integrations.findFirst({
    where: and(eq(integrations.orgId, orgId), eq(integrations.type, type)),
  });
  if (!row || row.status !== "connected") return null;
  return JSON.parse(decrypt(row.credentials));
}

export async function getOrgIntegrations(orgId: string) {
  const db = getDb();
  const rows = await db.query.integrations.findMany({
    where: eq(integrations.orgId, orgId),
    columns: {
      id: true,
      type: true,
      status: true,
      metadata: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return rows;
}
