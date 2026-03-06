/**
 * Seed script: Super Magic Taste (Saucy) as the first tenant.
 *
 * Run with: npx tsx src/scripts/seed-saucy.ts
 *
 * This creates:
 * - An organization for Super Magic Taste
 * - Agent configs (email triage, order manager)
 * - Agent memory entries (products, pricing, contacts, policies)
 *
 * Prerequisites: DATABASE_URL set in .env.local
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/db/schema";
import { eq } from "drizzle-orm";

const SYSTEM_PROMPT = `# Saucy - Sauce Business Assistant

You are an assistant for running a sauce business (Super Magic Taste). Your primary functions are managing email communications and Shopify store operations.

## Core Responsibilities

### Email Triage
Scan inbox for anything that needs a response. Prioritize and categorize:

**Order Requests** — Highest priority. Look for emails where someone wants to place an order or reorder, asks for a specific number of cases, or specifies which product(s) they want.

Extract: Who (name, company/store, email), What (product(s) + case counts), Notes (shipping, delivery dates, PO numbers). Default to Original Chili Crisp if product not specified.

**Distributor Communications** — Questions, updates, pricing discussions, logistics, delivery scheduling, invoice follow-ups.

**Customer Inquiries** — Product questions, wholesale interest, complaints, feedback.

**Other Actionable** — Anything else that requires a reply or follow-up.

Skip newsletters, marketing, automated notifications. Present a summary grouped by category with recommended actions/responses.

### Email Management
- Read and triage incoming emails, prioritizing order requests
- Draft and send professional responses to customers, suppliers, and partners
- Follow up on outstanding orders, inquiries, and wholesale requests
- Maintain a professional, friendly tone consistent with a small-batch sauce brand

### Shopify Store Operations
- Create orders and draft orders
- Send invoices to customers
- Look up order status and customer information

## Guidelines
- When responding to customer emails, be warm, helpful, and on-brand
- Always confirm before sending emails or creating/modifying orders
- When creating orders, double-check product names, quantities, and pricing
- Summarize actions taken after completing tasks
- Flag anything unusual — unexpected large orders, complaints, or payment issues — for human review
- Be optimistic and encouraging in tone. Celebrate wins, highlight progress, keep energy up.`;

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log("Seeding Super Magic Taste...");

  // Check if org already exists
  let org = await db.query.organizations.findFirst({
    where: eq(schema.organizations.slug, "super-magic-taste"),
  });

  if (!org) {
    const [created] = await db
      .insert(schema.organizations)
      .values({
        name: "Super Magic Taste",
        slug: "super-magic-taste",
      })
      .returning();
    org = created;
    console.log("Created organization:", org.id);
  } else {
    console.log("Organization already exists:", org.id);
  }

  // Create email triage agent
  const existingAgent = await db.query.agentConfigs.findFirst({
    where: eq(schema.agentConfigs.orgId, org.id),
  });

  if (!existingAgent) {
    const [agent] = await db
      .insert(schema.agentConfigs)
      .values({
        orgId: org.id,
        name: "Email Triage",
        type: "email_triage",
        systemPrompt: SYSTEM_PROMPT,
        toolsEnabled: ["gmail", "shopify"],
        schedule: "0 12 * * *", // Daily at noon
        enabled: true,
      })
      .returning();
    console.log("Created email triage agent:", agent.id);

    // Create order manager agent
    const [orderAgent] = await db
      .insert(schema.agentConfigs)
      .values({
        orgId: org.id,
        name: "Order Manager",
        type: "order_manager",
        systemPrompt: SYSTEM_PROMPT,
        toolsEnabled: ["shopify"],
        schedule: null,
        enabled: true,
      })
      .returning();
    console.log("Created order manager agent:", orderAgent.id);
  } else {
    console.log("Agents already exist, skipping.");
  }

  // Seed agent memory
  const existingMemory = await db.query.agentMemory.findFirst({
    where: eq(schema.agentMemory.orgId, org.id),
  });

  if (!existingMemory) {
    const memories = [
      {
        category: "products",
        key: "Original Chili Crisp",
        value:
          "Default product. Variant ID: gid://shopify/ProductVariant/40636089335830 (single, $14.00, SKU: SMT1). Case: gid://shopify/ProductVariant/43837871980566 (12x270mL, $108.00, SKU: SMTCASE). If a customer just says 'chili crisp' or doesn't specify, assume Original.",
      },
      {
        category: "products",
        key: "Yummy Crisp",
        value:
          'Mushroom-based alternative. Also referred to as "the mushroom one", "mushroom chili crisp", "yummy". Variant ID: gid://shopify/ProductVariant/53841827725334 (single, $14.00, SKU: YUMMY). Case: gid://shopify/ProductVariant/53841835687958 (12x270mL, $108.00, SKU: YUMMYCASE).',
      },
      {
        category: "policies",
        key: "Wholesale Pricing",
        value:
          "Price per jar: $9.00 (MSRP $14-15). Case size: 12 jars. Free shipping on 3+ cases. Ships from Ontario.\nVolume discounts: 10+ cases = 5% off, 20+ cases = 10% off, 30+ cases = 15% off.\nShelf life: 2 years. Happy to send samples to prospective retailers/distributors.",
      },
      {
        category: "contacts",
        key: "Halls Kitchen (Co-packer)",
        value:
          "Hall's Kitchen, 1 Wiltshire Ave, Unit R, Toronto, ON M6N 2V7. Phone: (416) 576-1823. Contact: Ron Saban. Shipping hours: 12pm-4pm. No dock — tailgate required. Business pickup.",
      },
      {
        category: "contacts",
        key: "Shipping Partners",
        value:
          "ShipGreen Dispatch: dispatch@shipgreen.com\nEcom Logistics Warehouse: warehouse@ecomlogistics.ca\nVasanth at Ecom: vasanth@ecomlogistics.ca",
      },
      {
        category: "policies",
        key: "Pickup Scheduling",
        value:
          "For inventory pickups from Halls Kitchen to Ecom Logistics: always 100 cases per pickup (one skid) unless specified otherwise. Weight ~1200lbs per skid. Dimensions: 48x48x58 inches. Email dispatch@shipgreen.com and warehouse@ecomlogistics.ca, CC hallskitchensoup@gmail.com and vasanth@ecomlogistics.ca.",
      },
      {
        category: "general",
        key: "Store",
        value: "Shopify store: super-magic-taste.myshopify.com",
      },
      {
        category: "general",
        key: "Business Context",
        value:
          "Super Magic Taste is a small-batch sauce brand based in Toronto. ~$597K CAD lifetime revenue across ~5K orders. Revenue split: 77% wholesale / 23% DTC. Top customer: RHSM (~$100K, ~400 doors). Currently 2 products (Original Chili Crisp + Yummy Crisp), with Spicy Crisp in development.",
      },
    ];

    for (const mem of memories) {
      await db.insert(schema.agentMemory).values({
        orgId: org.id,
        ...mem,
      });
    }
    console.log(`Seeded ${memories.length} memory entries.`);
  } else {
    console.log("Memory already seeded, skipping.");
  }

  console.log("Done! Super Magic Taste is ready as tenant #1.");
}

seed().catch(console.error);
