import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam, ContentBlockParam, ToolResultBlockParam } from "@anthropic-ai/sdk/resources/messages";
import { getDb } from "@/lib/db";
import { agentRuns, pendingActions, agentMemory, agentConfigs } from "@/lib/db/schema";
import { BASE_AGENT_PROMPT } from "./base-prompt";
import { eq, and } from "drizzle-orm";
import { getIntegrationCredentials } from "@/lib/integrations/helpers";
import { refreshAccessToken } from "@/lib/integrations/gmail/oauth";
import { searchEmails, readEmail, sendEmail } from "@/lib/integrations/gmail/client";
import {
  getRecentOrders,
  getCustomers,
  getOrdersByMonth,
  createDraftOrder,
} from "@/lib/integrations/shopify/client";
import { integrations } from "@/lib/db/schema";
import { gmailTools, GMAIL_WRITE_TOOLS } from "./tools/gmail";
import { shopifyTools, SHOPIFY_WRITE_TOOLS } from "./tools/shopify";

const MAX_TURNS = 10;
const MAX_TOOL_RESULT_CHARS = 8000;
const TOOL_TIMEOUT_MS = 30_000; // 30s per tool call
const RUN_TIMEOUT_MS = 120_000; // 2 min total run timeout

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms)
    ),
  ]);
}

type ToolCallLog = {
  name: string;
  input: Record<string, unknown>;
  output?: unknown;
  queued?: boolean;
};

export async function runAgent(
  agentConfigId: string,
  orgId: string,
  triggeredBy: "manual" | "cron" | "webhook"
) {
  const db = getDb();
  const anthropic = new Anthropic();

  // Load agent config
  const config = await db.query.agentConfigs.findFirst({
    where: and(
      eq(agentConfigs.id, agentConfigId),
      eq(agentConfigs.orgId, orgId)
    ),
  });
  if (!config) throw new Error("Agent config not found");

  // Create agent run record
  const [run] = await db
    .insert(agentRuns)
    .values({
      agentConfigId,
      orgId,
      triggeredBy,
      status: "running",
    })
    .returning();

  const toolCallLog: ToolCallLog[] = [];
  let totalTokens = 0;

  try {
    // Load agent memory for system prompt
    const memories = await db.query.agentMemory.findMany({
      where: eq(agentMemory.orgId, orgId),
    });

    const memoryBlock =
      memories.length > 0
        ? "\n\n## Agent Memory\n" +
          memories
            .map((m) => `### ${m.category}: ${m.key}\n${m.value}`)
            .join("\n\n")
        : "";

    const systemPrompt = BASE_AGENT_PROMPT + "\n\n---\n\n" + config.systemPrompt + memoryBlock;

    // Build available tools based on config
    const tools = buildToolSet(config.toolsEnabled as string[] | null);

    // Agent conversation loop
    const messages: MessageParam[] = [
      {
        role: "user",
        content: getInitialPrompt(config.type),
      },
    ];

    const runDeadline = Date.now() + RUN_TIMEOUT_MS;

    for (let turn = 0; turn < MAX_TURNS; turn++) {
      if (Date.now() > runDeadline) {
        throw new Error("Run timed out after 2 minutes");
      }

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: systemPrompt,
        tools,
        messages,
      });

      totalTokens += (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

      // Check if the model wants to use tools
      const toolUseBlocks = response.content.filter(
        (block) => block.type === "tool_use"
      );

      if (toolUseBlocks.length === 0 || response.stop_reason === "end_turn") {
        // Agent is done — extract text summary
        const textBlocks = response.content.filter(
          (block) => block.type === "text"
        );
        const summary = textBlocks
          .map((b) => (b.type === "text" ? b.text : ""))
          .join("\n");

        await db
          .update(agentRuns)
          .set({
            status: "completed",
            summary,
            toolCalls: toolCallLog,
            tokensUsed: totalTokens,
            completedAt: new Date(),
          })
          .where(eq(agentRuns.id, run.id));

        return { runId: run.id, summary, toolCalls: toolCallLog };
      }

      // Process tool calls
      const toolResults: ToolResultBlockParam[] = [];

      for (const block of toolUseBlocks) {
        if (block.type !== "tool_use") continue;

        const toolName = block.name;
        const toolInput = block.input as Record<string, unknown>;
        const log: ToolCallLog = { name: toolName, input: toolInput };

        if (isWriteTool(toolName)) {
          // Queue for approval instead of executing
          const description = describeAction(toolName, toolInput);
          await db.insert(pendingActions).values({
            orgId,
            agentRunId: run.id,
            toolName,
            toolInput,
            description,
          });

          log.queued = true;
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: `Action queued for human approval: ${description}. It will be executed after a human reviews and approves it.`,
          });
        } else {
          // Execute read tool with timeout + 1 retry
          let lastError: string | null = null;
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              const result = await withTimeout(
                executeReadTool(toolName, toolInput, orgId),
                TOOL_TIMEOUT_MS,
                toolName
              );
              log.output = result;
              let resultStr = JSON.stringify(result);
              if (resultStr.length > MAX_TOOL_RESULT_CHARS) {
                resultStr = resultStr.substring(0, MAX_TOOL_RESULT_CHARS) + "\n[...truncated]";
              }
              toolResults.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: resultStr,
              });
              lastError = null;
              break;
            } catch (error) {
              lastError = error instanceof Error ? error.message : "Unknown error";
              if (attempt === 0 && lastError.includes("timed out")) {
                continue; // retry once on timeout
              }
              break;
            }
          }
          if (lastError) {
            log.output = { error: lastError };
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: `Error: ${lastError}`,
              is_error: true,
            });
          }
        }

        toolCallLog.push(log);
      }

      // Persist progress so polling clients can see live tool calls
      await db
        .update(agentRuns)
        .set({ toolCalls: toolCallLog, tokensUsed: totalTokens })
        .where(eq(agentRuns.id, run.id));

      // Add assistant response + tool results to conversation
      messages.push({ role: "assistant", content: response.content as ContentBlockParam[] });
      messages.push({ role: "user", content: toolResults });
    }

    // Max turns reached
    await db
      .update(agentRuns)
      .set({
        status: "completed",
        summary: "Agent reached maximum turns limit.",
        toolCalls: toolCallLog,
        tokensUsed: totalTokens,
        completedAt: new Date(),
      })
      .where(eq(agentRuns.id, run.id));

    return { runId: run.id, summary: "Max turns reached", toolCalls: toolCallLog };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await db
      .update(agentRuns)
      .set({
        status: "failed",
        summary: `Error: ${errMsg}`,
        toolCalls: toolCallLog,
        tokensUsed: totalTokens,
        completedAt: new Date(),
      })
      .where(eq(agentRuns.id, run.id));

    throw error;
  }
}

function buildToolSet(toolsEnabled: string[] | null) {
  const tools = [];
  const enabled = toolsEnabled || ["gmail", "shopify"];
  if (enabled.includes("gmail")) tools.push(...gmailTools);
  if (enabled.includes("shopify")) tools.push(...shopifyTools);
  return tools;
}

function isWriteTool(name: string): boolean {
  return GMAIL_WRITE_TOOLS.has(name) || SHOPIFY_WRITE_TOOLS.has(name);
}

function getInitialPrompt(agentType: string): string {
  switch (agentType) {
    case "email_triage":
      return "Please triage my inbox. Search for unread and recent emails from the last 24 hours. Categorize them (order requests, distributor communications, customer inquiries, other actionable items). For any that need a response, draft a reply. Skip newsletters, marketing emails, and automated notifications.";
    case "order_manager":
      return "Check recent Shopify orders and customers. Flag any issues with fulfillment, payment, or unusual patterns. Summarize the current state of orders.";
    case "briefing":
      return "Generate a daily briefing. Check recent emails, orders, and customer activity. Summarize key metrics, pending items, and any important updates.";
    default:
      return "Run your configured tasks.";
  }
}

async function getGmailAccessToken(orgId: string): Promise<string> {
  const creds = await getIntegrationCredentials(orgId, "gmail");
  if (!creds) throw new Error("Gmail not connected");

  // Check if token is expired and refresh if needed
  const expiryDate = creds.expiry_date as number;
  if (expiryDate && Date.now() > expiryDate - 60000) {
    const refreshToken = creds.refresh_token as string;
    if (!refreshToken) throw new Error("No refresh token available");
    const newCreds = await refreshAccessToken(refreshToken);

    // Save refreshed credentials
    const db = getDb();
    const { encrypt: enc } = await import("@/lib/crypto");
    await db
      .update(integrations)
      .set({
        credentials: enc(
          JSON.stringify({
            access_token: newCreds.access_token,
            refresh_token: newCreds.refresh_token || refreshToken,
            expiry_date: newCreds.expiry_date,
          })
        ),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(integrations.orgId, orgId),
          eq(integrations.type, "gmail")
        )
      );

    return newCreds.access_token!;
  }

  return creds.access_token as string;
}

async function getShopifyCredentials(orgId: string) {
  const creds = await getIntegrationCredentials(orgId, "shopify");
  if (!creds) throw new Error("Shopify not connected");

  const db = getDb();
  const integration = await db.query.integrations.findFirst({
    where: and(
      eq(integrations.orgId, orgId),
      eq(integrations.type, "shopify")
    ),
  });

  const metadata = integration?.metadata as Record<string, string> | null;
  return {
    accessToken: creds.access_token as string,
    shop: metadata?.shop as string,
  };
}

async function executeReadTool(
  toolName: string,
  input: Record<string, unknown>,
  orgId: string
): Promise<unknown> {
  switch (toolName) {
    case "gmail_search": {
      const token = await getGmailAccessToken(orgId);
      return searchEmails(
        token,
        input.query as string,
        (input.max_results as number) || 20
      );
    }
    case "gmail_read": {
      const token = await getGmailAccessToken(orgId);
      return readEmail(token, input.message_id as string);
    }
    case "shopify_get_orders": {
      const { accessToken, shop } = await getShopifyCredentials(orgId);
      return getRecentOrders(shop, accessToken, (input.count as number) || 10);
    }
    case "shopify_get_customers": {
      const { accessToken, shop } = await getShopifyCredentials(orgId);
      return getCustomers(shop, accessToken, (input.count as number) || 10);
    }
    case "shopify_get_orders_by_month": {
      const { accessToken, shop } = await getShopifyCredentials(orgId);
      return getOrdersByMonth(
        shop,
        accessToken,
        (input.months as number) || 12
      );
    }
    default:
      throw new Error(`Unknown read tool: ${toolName}`);
  }
}

// Execute a write tool after human approval
export async function executeWriteTool(
  toolName: string,
  input: Record<string, unknown>,
  orgId: string
): Promise<unknown> {
  switch (toolName) {
    case "gmail_send": {
      const token = await getGmailAccessToken(orgId);
      return sendEmail(
        token,
        input.to as string,
        input.subject as string,
        input.body as string,
        input.thread_id as string | undefined,
        input.in_reply_to as string | undefined
      );
    }
    case "shopify_create_draft_order": {
      const { accessToken, shop } = await getShopifyCredentials(orgId);
      const lineItems = (
        input.line_items as Array<{ variant_id: string; quantity: number }>
      ).map((item) => ({
        variantId: item.variant_id,
        quantity: item.quantity,
      }));
      return createDraftOrder(shop, accessToken, {
        lineItems,
        customerId: input.customer_id as string | undefined,
        note: input.note as string | undefined,
      });
    }
    default:
      throw new Error(`Unknown write tool: ${toolName}`);
  }
}

function describeAction(
  toolName: string,
  input: Record<string, unknown>
): string {
  switch (toolName) {
    case "gmail_send":
      return `Send email to ${input.to}: "${input.subject}"`;
    case "shopify_create_draft_order": {
      const items = input.line_items as Array<{
        variant_id: string;
        quantity: number;
      }>;
      const itemDesc = items
        .map((i) => `${i.quantity}x ${i.variant_id}`)
        .join(", ");
      return `Create draft order: ${itemDesc}`;
    }
    default:
      return `Execute ${toolName}`;
  }
}
