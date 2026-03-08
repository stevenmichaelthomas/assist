import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

// ── Organizations ──────────────────────────────────────────────
export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  baseAgentPrompt: text("base_agent_prompt"), // shared instructions prepended to every agent's system prompt
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Users ──────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
  role: text("role").default("owner").notNull(), // owner | admin | viewer
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── NextAuth accounts (OAuth providers) ────────────────────────
export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

// ── NextAuth sessions ──────────────────────────────────────────
export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

// ── NextAuth verification tokens ──────────────────────────────
export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

// ── Integrations (OAuth tokens for Gmail, Shopify, etc.) ──────
export const integrations = pgTable("integrations", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "gmail" | "shopify"
  status: text("status").default("connected").notNull(), // connected | disconnected | error
  credentials: text("credentials").notNull(), // AES-256-GCM encrypted JSON
  metadata: jsonb("metadata"), // e.g. { shopDomain, email }
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Agent Configs ──────────────────────────────────────────────
export const agentConfigs = pgTable("agent_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g. "Email Triage", "Order Manager"
  type: text("type").notNull(), // "email_triage" | "order_manager" | "briefing"
  description: text("description"), // plain-English job description from the user
  systemPrompt: text("system_prompt").notNull(),
  toolsEnabled: jsonb("tools_enabled").$type<string[]>().default([]),
  schedule: text("schedule"), // cron expression, null = manual only
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Agent Runs ─────────────────────────────────────────────────
export const agentRuns = pgTable("agent_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentConfigId: uuid("agent_config_id").notNull().references(() => agentConfigs.id),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  status: text("status").default("running").notNull(), // running | completed | failed
  triggeredBy: text("triggered_by").notNull(), // "manual" | "cron" | "webhook"
  summary: text("summary"),
  toolCalls: jsonb("tool_calls").$type<Record<string, unknown>[]>().default([]),
  tokensUsed: integer("tokens_used"),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

// ── Pending Actions (approval queue) ──────────────────────────
export const pendingActions = pgTable("pending_actions", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  agentRunId: uuid("agent_run_id").notNull().references(() => agentRuns.id),
  toolName: text("tool_name").notNull(), // e.g. "gmail_send", "shopify_create_order"
  toolInput: jsonb("tool_input").notNull(), // the proposed action params
  description: text("description").notNull(), // human-readable summary
  status: text("status").default("pending").notNull(), // pending | approved | rejected | executed
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  editedInput: jsonb("edited_input"), // if human edited before approving
  executionResult: jsonb("execution_result"), // result after execution
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Daily Briefings ───────────────────────────────────────────
export const dailyBriefings = pgTable("daily_briefings", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  date: text("date").notNull(), // YYYY-MM-DD
  content: text("content").notNull(), // markdown briefing
  metrics: jsonb("metrics"), // snapshot of KPIs
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Agent Memory ──────────────────────────────────────────────
export const agentMemory = pgTable("agent_memory", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  category: text("category").notNull(), // "products" | "contacts" | "policies" | "general"
  key: text("key").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
