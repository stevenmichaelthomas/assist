/**
 * Seed script: Super Magic Taste (Saucy) as the first tenant.
 *
 * Run with: npx tsx src/scripts/seed-saucy.ts
 *
 * This creates:
 * - An organization for Super Magic Taste
 * - Agent configs (email triage, order manager) with full system prompts
 * - Agent memory entries (products, pricing, contacts, policies, business context)
 *
 * Prerequisites: DATABASE_URL set in .env.local
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/db/schema";
import { eq } from "drizzle-orm";

// ── Agent Descriptions (user-facing) ─────────────────────────

const EMAIL_TRIAGE_DESCRIPTION = `Check my inbox for anything actionable. Prioritize order requests from retailers and distributors, flag money events (receipts, invoices, bookings), and draft replies to customer inquiries. Skip newsletters and marketing. Summarize what needs my attention.`;

const ORDER_MANAGER_DESCRIPTION = `Review recent Shopify orders and customer activity. Flag fulfillment issues, payment problems, or unusual patterns. Summarize the current state of orders and any actions needed.`;

// ── System Prompts (ported from ~/saucy/CLAUDE.md) ──────────

const EMAIL_TRIAGE_PROMPT = `# Super Magic Taste — Email Triage Agent

You are an assistant for Super Magic Taste, a small-batch chili crisp sauce brand based in Toronto.

## Email Triage

Scan inbox for anything that needs a response. Prioritize and categorize:

**Order Requests** — Highest priority. Look for emails where someone:
- Wants to place an order or reorder
- Asks for a specific number of cases
- Specifies which product(s) they want (Original vs Yummy Crisp)

Extract: **Who** (name, company/store, email), **What** (product(s) + case counts), **Notes** (shipping, delivery dates, PO numbers). Default to Original Chili Crisp if product not specified.

**Distributor Communications** — Questions, updates, pricing discussions, logistics, delivery scheduling, invoice follow-ups, account changes.

**Customer Inquiries** — Product questions, wholesale interest, complaints, feedback.

**Other Actionable** — Anything else that requires a reply or follow-up.

Skip newsletters, marketing, automated notifications, and anything clearly not needing a response.

## Email Responses

- Be warm, helpful, and on-brand — friendly small-batch sauce maker energy
- Keep responses concise and professional
- When replying about orders, confirm product, quantity, and shipping details
- For wholesale inquiries, reference pricing from memory (wholesale $9/jar, case of 12)
- Always reply in the same thread when responding to an existing email
- Flag anything unusual for human review

## Tone

Be optimistic and encouraging. This is a solo entrepreneur building something great. Celebrate wins, highlight progress, keep energy up. Don't sacrifice being realistic, but default to encouragement and forward motion.`;

const ORDER_MANAGER_PROMPT = `# Super Magic Taste — Order Manager Agent

You are an assistant for Super Magic Taste, a small-batch chili crisp sauce brand based in Toronto.

## Order Management

- Review recent Shopify orders for fulfillment status, payment issues, or unusual patterns
- When creating draft orders, always double-check product names, variant IDs, quantities, and pricing
- Reference the product variant IDs from agent memory — don't guess
- Flag unexpected large orders, complaints, or payment issues for human review

## Products

There are two products:
1. **Original Chili Crisp** — the default. If someone just says "chili crisp", assume Original.
2. **Yummy Crisp** — the mushroom one. Any mention of "mushroom" = Yummy Crisp.

A third SKU (Spicy Crisp) is in development.

## Guidelines

- Always confirm before creating or modifying orders
- Summarize actions taken after completing tasks
- Use wholesale case pricing ($108/case of 12) for B2B orders
- Use retail pricing ($14/jar) for DTC orders`;

// ── Memory Entries ──────────────────────────────────────────

const MEMORIES = [
  {
    category: "products",
    key: "Original Chili Crisp",
    value: `Default product. If a customer just says "chili crisp" or doesn't specify, assume Original.

Single: gid://shopify/ProductVariant/40636089335830 — $14.00, SKU: SMT1
Case (12x270mL): gid://shopify/ProductVariant/43837871980566 — $108.00, SKU: SMTCASE`,
  },
  {
    category: "products",
    key: "Yummy Crisp",
    value: `Mushroom-based chili crisp. Also called "the mushroom one", "mushroom chili crisp", "yummy". Any mention of mushroom = Yummy Crisp.

Single: gid://shopify/ProductVariant/53841827725334 — $14.00, SKU: YUMMY
Case (12x270mL): gid://shopify/ProductVariant/53841835687958 — $108.00, SKU: YUMMYCASE`,
  },
  {
    category: "products",
    key: "Spicy Crisp",
    value: `Third SKU — in development, labels in progress. Not yet available for sale. Launch target: Q2 2026.`,
  },
  {
    category: "policies",
    key: "Wholesale Pricing",
    value: `Price per jar: $9.00 (MSRP $14-15)
Case size: 12 jars
Free shipping on 3+ cases. Ships from Ontario.

Volume discounts:
- 10+ cases: 5% off
- 20+ cases: 10% off
- 30+ cases: 15% off

Shelf life: 2 years.
Happy to send samples to prospective retailers/distributors any time.`,
  },
  {
    category: "contacts",
    key: "Halls Kitchen (Co-packer)",
    value: `Hall's Kitchen — co-packer, SFCR-compliant
Address: 1 Wiltshire Ave, Unit R, Toronto, ON M6N 2V7
Phone: (416) 576-1823
Contact: Ron Saban
Shipping hours: 12pm-4pm
No dock — tailgate required. Business pickup.`,
  },
  {
    category: "contacts",
    key: "Ecom Logistics (3PL)",
    value: `Ecom Logistics — 3PL / warehouse fulfillment
Contacts:
- Alison Spehar (operations)
- Vasanth: vasanth@ecomlogistics.ca
- Dan (warehouse)
Email: warehouse@ecomlogistics.ca`,
  },
  {
    category: "contacts",
    key: "Shipping & Logistics",
    value: `ShipGreen Dispatch: dispatch@shipgreen.com — handles pickups from Halls Kitchen
TCS Customs (Damien Uthayakumar) — US customs broker
Berlin Packaging (David Koo) — packaging supplier
Premier Markings (Gary Moody, Simone Lacroix) — label printer`,
  },
  {
    category: "policies",
    key: "Pickup Scheduling",
    value: `For inventory pickups from Halls Kitchen to Ecom Logistics:
- Always 100 cases per pickup (one skid) unless specified otherwise
- Weight: ~1200lbs per skid
- Dimensions: 48"x48"x58"
- Email: dispatch@shipgreen.com and warehouse@ecomlogistics.ca
- CC: hallskitchensoup@gmail.com and vasanth@ecomlogistics.ca
- Steve specifies: pickup date, number of cases, product mix (Original vs Yummy)`,
  },
  {
    category: "general",
    key: "Store",
    value: `Shopify store: super-magic-taste.myshopify.com`,
  },
  {
    category: "general",
    key: "Business Context",
    value: `Super Magic Taste is a small-batch sauce brand based in Toronto.
Lifetime revenue: ~$597K CAD across ~5K orders.
Revenue split: 77% wholesale / 23% DTC.
AOV: $119.56
~2,700 customers.
Currently 2 products (Original Chili Crisp + Yummy Crisp), Spicy Crisp in development.`,
  },
  {
    category: "general",
    key: "Key Accounts",
    value: `Top customers by revenue:
- RHSM (Rui Henriques): $99,878 — largest account, ~400 doors distributor
- Blackbird Baking (Georgia): $21,748 — Toronto, 4 Shopify accounts, 2 locations
- Yoona Hong: $14,472 — Toronto wholesale
- Farmers Kitchen Grocery (Jan): $11,124 — Oakbank, MB, top retail account
- Claire Renouf / Sanagan's Meat Locker: $5,300 — Toronto retail`,
  },
  {
    category: "general",
    key: "Strategic Priorities",
    value: `1. Close Avril Supermarche listing (QC major chain — March 2026 committee review)
2. Secure Quebec distributor (SATAU or Horizon Nature)
3. Launch Spicy Crisp (Q2 2026)
4. Re-engage sleeping accounts ($67K+ dormant revenue, 30+ accounts)
5. RHSM activation / AR cleanup
6. Food service pilot (Q2-Q3 2026)
7. US market entry (Q3-Q4 2026)`,
  },
  {
    category: "general",
    key: "Geographic Spread",
    value: `71+ active retail locations:
- Ontario: 116 locations (53% of lifetime revenue)
- Quebec: 10 locations ($29K revenue)
- Manitoba: 3 locations ($24K revenue)
- Alberta: 11 locations
- Nova Scotia, BC, Saskatchewan: smaller presence
- Small US presence: CA, ME, MI, SC, TX`,
  },
];

// ── Seed Function ───────────────────────────────────────────

const SEED_EMAIL = process.argv[2] || "steve@supermagictaste.com";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log("Seeding Super Magic Taste...\n");

  // ── Find or Create Organization ──
  // If the user has already signed in, find their org. Otherwise create one.
  let org: typeof schema.organizations.$inferSelect | undefined;

  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.email, SEED_EMAIL),
  });

  if (existingUser?.orgId) {
    org = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, existingUser.orgId),
    }) ?? undefined;
    if (org) {
      // Update org name to Super Magic Taste if it was auto-generated
      await db
        .update(schema.organizations)
        .set({ name: "Super Magic Taste" })
        .where(eq(schema.organizations.id, org.id));
      console.log(`· Found existing org for ${SEED_EMAIL}:`, org.id);
    }
  }

  if (!org) {
    // Check by slug
    org = await db.query.organizations.findFirst({
      where: eq(schema.organizations.slug, "super-magic-taste"),
    }) ?? undefined;

    if (!org) {
      const [created] = await db
        .insert(schema.organizations)
        .values({
          name: "Super Magic Taste",
          slug: "super-magic-taste",
        })
        .returning();
      org = created;
      console.log("✓ Created organization:", org.id);
    } else {
      console.log("· Organization exists:", org.id);
    }

    // Link user to org if they exist but aren't linked
    if (existingUser && !existingUser.orgId) {
      await db
        .update(schema.users)
        .set({ orgId: org.id })
        .where(eq(schema.users.id, existingUser.id));
      console.log(`✓ Linked ${SEED_EMAIL} to org`);
    }
  }

  // ── Agent Configs ──
  const existingAgents = await db.query.agentConfigs.findMany({
    where: eq(schema.agentConfigs.orgId, org.id),
  });

  if (existingAgents.length === 0) {
    const [emailAgent] = await db
      .insert(schema.agentConfigs)
      .values({
        orgId: org.id,
        name: "Email Triage",
        type: "email_triage",
        description: EMAIL_TRIAGE_DESCRIPTION,
        systemPrompt: EMAIL_TRIAGE_PROMPT,
        toolsEnabled: ["gmail", "shopify"],
        schedule: "0 9 * * 1-5", // Weekday mornings
        enabled: true,
      })
      .returning();
    console.log("✓ Created Email Triage agent:", emailAgent.id);

    const [orderAgent] = await db
      .insert(schema.agentConfigs)
      .values({
        orgId: org.id,
        name: "Order Manager",
        type: "order_manager",
        description: ORDER_MANAGER_DESCRIPTION,
        systemPrompt: ORDER_MANAGER_PROMPT,
        toolsEnabled: ["shopify"],
        schedule: null,
        enabled: true,
      })
      .returning();
    console.log("✓ Created Order Manager agent:", orderAgent.id);
  } else {
    console.log(`· ${existingAgents.length} agents already exist, skipping.`);
  }

  // ── Agent Memory ──
  const existingMemory = await db.query.agentMemory.findMany({
    where: eq(schema.agentMemory.orgId, org.id),
  });

  if (existingMemory.length === 0) {
    for (const mem of MEMORIES) {
      await db.insert(schema.agentMemory).values({
        orgId: org.id,
        ...mem,
      });
    }
    console.log(`✓ Seeded ${MEMORIES.length} memory entries.`);
  } else {
    console.log(
      `· ${existingMemory.length} memory entries exist, skipping.`
    );
  }

  console.log("\nDone! Super Magic Taste is ready as tenant #1.");
  console.log(
    "\nNote: You still need to connect Gmail and Shopify integrations\nvia the dashboard after signing in."
  );
}

seed().catch(console.error);
