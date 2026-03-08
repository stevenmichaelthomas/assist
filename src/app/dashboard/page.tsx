import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { agentRuns, pendingActions, integrations, agentMemory, agentConfigs } from "@/lib/db/schema";
import { eq, and, gte, sql, desc } from "drizzle-orm";
import { users } from "@/lib/db/schema";
import Link from "next/link";
import { LocalTime } from "@/components/LocalTime";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });
  const orgId = user?.orgId;

  let pendingCount = 0;
  let runsToday = 0;
  let integrationCount = 0;
  let recentRuns: { id: string; status: string; summary: string | null; startedAt: Date }[] = [];
  let memoryCount = 0;
  let agentsCount = 0;

  if (orgId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [pending] = await db
      .select({ count: sql<number>`count(*)` })
      .from(pendingActions)
      .where(
        and(
          eq(pendingActions.orgId, orgId),
          eq(pendingActions.status, "pending")
        )
      );
    pendingCount = Number(pending.count);

    const [runs] = await db
      .select({ count: sql<number>`count(*)` })
      .from(agentRuns)
      .where(
        and(eq(agentRuns.orgId, orgId), gte(agentRuns.startedAt, today))
      );
    runsToday = Number(runs.count);

    const [integ] = await db
      .select({ count: sql<number>`count(*)` })
      .from(integrations)
      .where(
        and(
          eq(integrations.orgId, orgId),
          eq(integrations.status, "connected")
        )
      );
    integrationCount = Number(integ.count);

    recentRuns = await db.query.agentRuns.findMany({
      where: eq(agentRuns.orgId, orgId),
      orderBy: desc(agentRuns.startedAt),
      limit: 5,
      columns: { id: true, status: true, summary: true, startedAt: true },
    });

    const [memCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(agentMemory)
      .where(eq(agentMemory.orgId, orgId));
    const [agentCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(agentConfigs)
      .where(eq(agentConfigs.orgId, orgId));
    memoryCount = Number(memCount.count);
    agentsCount = Number(agentCount.count);
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground mb-2">Dashboard</h1>
      <p className="text-muted mb-8">
        Welcome back, {session.user.name?.split(" ")[0] || "there"}.
      </p>

      {memoryCount === 0 && agentsCount === 0 && (
        <Link
          href="/dashboard/onboarding"
          className="block bg-accent/5 border-2 border-accent/20 rounded-xl p-6 mb-8 hover:border-accent/40 transition-colors"
        >
          <h2 className="font-display text-xl text-foreground mb-1">
            Set up your business
          </h2>
          <p className="text-sm text-muted">
            Add your website and we&apos;ll gather everything we need to know to start helping.
          </p>
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <DashboardCard
          title="Pending Approvals"
          value={String(pendingCount)}
          href="/dashboard/approvals"
        />
        <DashboardCard
          title="Agent Runs Today"
          value={String(runsToday)}
          href="/dashboard/activity"
        />
        <DashboardCard
          title="Integrations"
          value={String(integrationCount)}
          href="/dashboard/integrations"
        />
      </div>

      {recentRuns.length > 0 && (
        <div className="bg-white rounded-xl border border-surface p-6 mb-8">
          <h2 className="font-display text-xl text-foreground mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentRuns.map((run) => (
              <div key={run.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      run.status === "completed"
                        ? "bg-green-500"
                        : run.status === "running"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-foreground/80 line-clamp-1">
                    {run.summary || run.status}
                  </span>
                </div>
                <LocalTime
                  date={run.startedAt.toISOString()}
                  className="text-muted text-xs"
                />
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/activity"
            className="text-sm text-accent hover:underline mt-3 inline-block"
          >
            View all activity
          </Link>
        </div>
      )}

      <div className="bg-white rounded-xl border border-surface p-6">
        <h2 className="font-display text-xl text-foreground mb-4">
          Getting Started
        </h2>
        <ol className="space-y-3 text-sm text-foreground/80">
          <li className="flex items-start gap-3">
            <span
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                integrationCount > 0
                  ? "bg-green-500 text-white"
                  : "bg-accent text-white"
              }`}
            >
              1
            </span>
            <span>
              Connect your Gmail and Shopify accounts in{" "}
              <Link href="/dashboard/integrations" className="text-accent hover:underline">
                Integrations
              </Link>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-surface text-foreground/60 flex items-center justify-center text-xs font-medium">
              2
            </span>
            <span>
              Configure your AI agents in{" "}
              <Link href="/dashboard/agents" className="text-accent hover:underline">
                Agents
              </Link>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-surface text-foreground/60 flex items-center justify-center text-xs font-medium">
              3
            </span>
            <span>
              Review agent actions in the{" "}
              <Link href="/dashboard/approvals" className="text-accent hover:underline">
                Approval Queue
              </Link>
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  href,
}: {
  title: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-surface p-6 hover:border-accent/30 transition-colors"
    >
      <p className="text-sm text-muted mb-1">{title}</p>
      <p className="font-display text-3xl text-foreground">{value}</p>
    </Link>
  );
}
