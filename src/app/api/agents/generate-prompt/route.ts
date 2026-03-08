import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSessionOrg } from "@/lib/integrations/helpers";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { description } = await req.json();
  if (!description || typeof description !== "string") {
    return NextResponse.json(
      { error: "description is required" },
      { status: 400 }
    );
  }

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: `You are an AI agent architect. Given a plain-English description of a job someone wants an AI agent to do, you generate:

1. A short, clear agent name (2-4 words)
2. An agent type — one of: "email_triage", "order_manager", "briefing", "custom"
3. Which tool integrations the agent needs: "gmail", "shopify", or both
4. A detailed system prompt that will guide the AI agent to do this job well

The system prompt should:
- Be written as direct instructions to the AI agent (use "you")
- Specify what to do, what to watch for, and how to handle edge cases
- Include tone/voice guidance if relevant
- Be specific and actionable, not vague
- Assume the agent will have access to Gmail and/or Shopify tools as specified

Respond in JSON only, no markdown fencing:
{
  "name": "...",
  "type": "...",
  "toolsEnabled": ["gmail", "shopify"],
  "systemPrompt": "..."
}`,
    messages: [
      {
        role: "user",
        content: `Here's the job I need an AI agent to handle:\n\n${description}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate agent config", raw: text },
      { status: 500 }
    );
  }
}
