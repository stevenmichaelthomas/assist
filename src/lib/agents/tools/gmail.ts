import type { Tool } from "@anthropic-ai/sdk/resources/messages";

export const gmailTools: Tool[] = [
  {
    name: "gmail_search",
    description:
      "Search Gmail inbox. Returns subject, from, date, and ID only — use gmail_read to get the full body of specific emails. Combine filters into one broad query instead of multiple narrow searches. Use Gmail operators like 'is:unread newer_than:1d'.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Gmail search query (e.g. 'is:unread newer_than:1d', 'from:customer@example.com')",
        },
        max_results: {
          type: "number",
          description: "Maximum number of results (default 5, max 5)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "gmail_read",
    description:
      "Read a specific email by its message ID. Returns full email content including body.",
    input_schema: {
      type: "object" as const,
      properties: {
        message_id: {
          type: "string",
          description: "The Gmail message ID to read",
        },
      },
      required: ["message_id"],
    },
  },
  {
    name: "gmail_send",
    description:
      "Send an email via Gmail. This is a WRITE action and will be queued for human approval before sending.",
    input_schema: {
      type: "object" as const,
      properties: {
        to: {
          type: "string",
          description: "Recipient email address",
        },
        subject: {
          type: "string",
          description: "Email subject line",
        },
        body: {
          type: "string",
          description: "Email body text (plain text)",
        },
        thread_id: {
          type: "string",
          description: "Thread ID to reply to (optional, for threading replies)",
        },
        in_reply_to: {
          type: "string",
          description: "Message-ID header of the email being replied to (optional)",
        },
      },
      required: ["to", "subject", "body"],
    },
  },
];

// Tools that execute immediately (read-only)
export const GMAIL_READ_TOOLS = new Set(["gmail_search", "gmail_read"]);

// Tools that require approval (write operations)
export const GMAIL_WRITE_TOOLS = new Set(["gmail_send"]);
