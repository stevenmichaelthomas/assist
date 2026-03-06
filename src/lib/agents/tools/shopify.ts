import type { Tool } from "@anthropic-ai/sdk/resources/messages";

export const shopifyTools: Tool[] = [
  {
    name: "shopify_get_orders",
    description:
      "Get recent orders from Shopify. Returns order details including items, financial status, fulfillment status, and customer info.",
    input_schema: {
      type: "object" as const,
      properties: {
        count: {
          type: "number",
          description: "Number of recent orders to retrieve (default: 25)",
        },
      },
      required: [],
    },
  },
  {
    name: "shopify_get_customers",
    description:
      "Get customers from Shopify, sorted by total spent. Returns customer details including order count and lifetime value.",
    input_schema: {
      type: "object" as const,
      properties: {
        count: {
          type: "number",
          description: "Number of customers to retrieve (default: 50)",
        },
      },
      required: [],
    },
  },
  {
    name: "shopify_get_orders_by_month",
    description:
      "Get orders grouped by month for revenue analysis. Returns order details with line items for product mix analysis.",
    input_schema: {
      type: "object" as const,
      properties: {
        months: {
          type: "number",
          description: "Number of months of history to retrieve (default: 12)",
        },
      },
      required: [],
    },
  },
  {
    name: "shopify_create_draft_order",
    description:
      "Create a draft order in Shopify. This is a WRITE action and will be queued for human approval.",
    input_schema: {
      type: "object" as const,
      properties: {
        line_items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              variant_id: {
                type: "string",
                description: "Shopify product variant GID",
              },
              quantity: {
                type: "number",
                description: "Quantity to order",
              },
            },
            required: ["variant_id", "quantity"],
          },
          description: "Items to include in the draft order",
        },
        customer_id: {
          type: "string",
          description: "Shopify customer GID (optional)",
        },
        note: {
          type: "string",
          description: "Order note (optional)",
        },
      },
      required: ["line_items"],
    },
  },
];

// Tools that execute immediately (read-only)
export const SHOPIFY_READ_TOOLS = new Set([
  "shopify_get_orders",
  "shopify_get_customers",
  "shopify_get_orders_by_month",
]);

// Tools that require approval (write operations)
export const SHOPIFY_WRITE_TOOLS = new Set(["shopify_create_draft_order"]);
