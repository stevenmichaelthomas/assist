import Anthropic from "@anthropic-ai/sdk";
import type { CrawledPage } from "./crawl";

export interface MemoryItem {
  category: "products" | "contacts" | "policies" | "general";
  key: string;
  value: string;
}

export interface AgentSuggestion {
  name: string;
  type: string;
  description: string;
  systemPrompt: string;
  toolsEnabled: string[];
  schedule: string | null;
}

export interface OnboardingResult {
  businessName: string;
  businessSummary: string;
  memories: MemoryItem[];
  agents: AgentSuggestion[];
}

const SYSTEM_PROMPT = `You analyze business websites and extract structured information.

Given the content of a business website, extract:

1. **businessName**: The business/company name
2. **businessSummary**: A 1-2 sentence summary of what the business does
3. **memories**: An array of key facts about the business. Each memory has:
   - category: one of "products", "contacts", "policies", "general"
   - key: a short label (e.g. "Flagship Product", "Return Policy", "Business Hours")
   - value: the factual content (1-3 sentences)

   Extract 8-15 memories covering:
   - Products/services offered with descriptions and prices
   - Contact info (email, phone, address, social media)
   - Policies (shipping, returns, privacy)
   - General business info (hours, location, founding story, team)

4. **agents**: 2-3 suggested AI agents tailored to this business. Each agent has:
   - name: a short descriptive name
   - type: one of "email_triage", "order_manager", "briefing"
   - description: what the agent does (1 sentence)
   - systemPrompt: a detailed system prompt for the agent, referencing specific business details. The prompt should instruct the agent on its role, what tools to use, and how to handle common scenarios for THIS specific business.
   - toolsEnabled: array of tool names (from: "gmail", "shopify", "google_calendar")
   - schedule: a cron expression or null for manual-only agents

Only include information that is clearly stated on the website. Do not invent or assume facts.

Respond with valid JSON matching this exact structure:
{
  "businessName": "string",
  "businessSummary": "string",
  "memories": [{ "category": "string", "key": "string", "value": "string" }],
  "agents": [{ "name": "string", "type": "string", "description": "string", "systemPrompt": "string", "toolsEnabled": ["string"], "schedule": "string|null" }]
}`;

export async function analyzeBusinessContent(
  url: string,
  pages: CrawledPage[]
): Promise<OnboardingResult> {
  const anthropic = new Anthropic();

  const pagesText = pages
    .map((p) => `--- ${p.title} (${p.url}) ---\n${p.text}`)
    .join("\n\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analyze this business website: ${url}\n\nExtracted page content:\n\n${pagesText}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse analysis response");
  }

  return JSON.parse(jsonMatch[0]) as OnboardingResult;
}

export async function refineWithPrompt(
  current: OnboardingResult,
  userPrompt: string
): Promise<OnboardingResult> {
  const anthropic = new Anthropic();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: `You are editing a set of business memories and agent suggestions based on user feedback.

The user will provide instructions about what to change — adding, removing, or modifying items.

Apply the requested changes and return the COMPLETE updated result as valid JSON with this structure:
{
  "businessName": "string",
  "businessSummary": "string",
  "memories": [{ "category": "string", "key": "string", "value": "string" }],
  "agents": [{ "name": "string", "type": "string", "description": "string", "systemPrompt": "string", "toolsEnabled": ["string"], "schedule": "string|null" }]
}

Only make the changes the user requests. Keep everything else exactly the same.`,
    messages: [
      {
        role: "user",
        content: `Current data:\n${JSON.stringify(current, null, 2)}\n\nUser request: ${userPrompt}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse refinement response");
  }

  return JSON.parse(jsonMatch[0]) as OnboardingResult;
}
