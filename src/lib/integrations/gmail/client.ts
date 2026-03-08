import { google } from "googleapis";
import { getOAuth2Client } from "./oauth";

export function getGmailClient(accessToken: string) {
  const auth = getOAuth2Client();
  auth.setCredentials({ access_token: accessToken });
  return google.gmail({ version: "v1", auth });
}

export async function searchEmails(
  accessToken: string,
  query: string,
  maxResults = 10
) {
  const gmail = getGmailClient(accessToken);
  const res = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: Math.min(maxResults, 15),
  });

  if (!res.data.messages) return [];

  const messages = await Promise.all(
    res.data.messages.map(async (msg) => {
      const full = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "full",
      });
      return parseMessage(full.data);
    })
  );

  return messages;
}

export async function readEmail(accessToken: string, messageId: string) {
  const gmail = getGmailClient(accessToken);
  const res = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  });
  return parseMessage(res.data);
}

export async function sendEmail(
  accessToken: string,
  to: string,
  subject: string,
  body: string,
  threadId?: string,
  inReplyTo?: string
) {
  const gmail = getGmailClient(accessToken);

  const headers = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=utf-8",
  ];
  if (inReplyTo) {
    headers.push(`In-Reply-To: ${inReplyTo}`);
    headers.push(`References: ${inReplyTo}`);
  }

  const raw = Buffer.from(headers.join("\r\n") + "\r\n\r\n" + body)
    .toString("base64url");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw,
      threadId,
    },
  });

  return res.data;
}

function parseMessage(data: { id?: string | null; threadId?: string | null; payload?: { headers?: Array<{ name?: string | null; value?: string | null }> | null; parts?: Array<{ mimeType?: string | null; body?: { data?: string | null } | null }> | null; body?: { data?: string | null } | null } | null }) {
  const headers = data.payload?.headers || [];
  const getHeader = (name: string) =>
    headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || "";

  let bodyText = "";
  if (data.payload?.parts) {
    const textPart = data.payload.parts.find((p) => p.mimeType === "text/plain");
    if (textPart?.body?.data) {
      bodyText = Buffer.from(textPart.body.data, "base64url").toString("utf8");
    }
  } else if (data.payload?.body?.data) {
    bodyText = Buffer.from(data.payload.body.data, "base64url").toString("utf8");
  }

  return {
    id: data.id,
    threadId: data.threadId,
    from: getHeader("From"),
    to: getHeader("To"),
    subject: getHeader("Subject"),
    date: getHeader("Date"),
    messageId: getHeader("Message-ID"),
    body: trimEmailBody(bodyText),
  };
}

/**
 * Strip quoted reply text, signatures, and truncate to keep token usage low.
 */
function trimEmailBody(body: string): string {
  // Remove quoted reply chains (lines starting with >)
  let trimmed = body.replace(/^>.*$/gm, "").replace(/\n{3,}/g, "\n\n");

  // Remove common signature markers and everything after
  const sigMarkers = [
    "\n-- \n",
    "\n--\n",
    "\nSent from my iPhone",
    "\nSent from my Android",
    "\nGet Outlook for",
    "\n________________________________",
  ];
  for (const marker of sigMarkers) {
    const idx = trimmed.indexOf(marker);
    if (idx > 0) trimmed = trimmed.substring(0, idx);
  }

  // Cap at 1500 chars — enough for context, not wasteful
  if (trimmed.length > 1500) {
    trimmed = trimmed.substring(0, 1500) + "\n[...truncated]";
  }

  return trimmed.trim();
}
