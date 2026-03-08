import * as cheerio from "cheerio";

export interface CrawledPage {
  url: string;
  title: string;
  text: string;
}

export interface CrawlResult {
  url: string;
  pages: CrawledPage[];
  totalChars: number;
}

const MAX_PAGES = 6;
const MAX_CHARS_PER_PAGE = 4000;
const MAX_TOTAL_CHARS = 20000;
const FETCH_TIMEOUT = 5000;

const PATH_KEYWORDS: Record<string, number> = {
  about: 10,
  "about-us": 10,
  products: 9,
  services: 9,
  contact: 8,
  faq: 7,
  shipping: 7,
  policies: 7,
  "return-policy": 7,
  "refund-policy": 7,
  "privacy-policy": 6,
  terms: 6,
  pricing: 8,
  features: 8,
  team: 6,
  story: 6,
  mission: 6,
  help: 5,
  support: 5,
  blog: 3,
  menu: 7,
};

async function fetchPage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AssistBot/1.0; +https://assist.dev)",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractText(html: string): { title: string; text: string } {
  const $ = cheerio.load(html);
  $("script, style, nav, footer, header, iframe, noscript, svg").remove();
  const title = $("title").first().text().trim() || "";
  const main = $("main").length ? $("main") : $("body");
  const text = main
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_CHARS_PER_PAGE);
  return { title, text };
}

function scoreLink(pathname: string): number {
  const segments = pathname
    .toLowerCase()
    .split("/")
    .filter((s) => s.length > 0);
  if (segments.length === 0) return 0;
  if (segments.length > 2) return 0; // skip deep paths

  let score = 0;
  for (const seg of segments) {
    if (PATH_KEYWORDS[seg]) {
      score += PATH_KEYWORDS[seg];
    }
  }
  return score;
}

function discoverLinks(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);
  const scored: { url: string; score: number }[] = [];
  const seen = new Set<string>();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    try {
      const resolved = new URL(href, baseUrl);
      if (resolved.hostname !== base.hostname) return;
      resolved.hash = "";
      resolved.search = "";
      const normalized = resolved.toString();
      if (seen.has(normalized)) return;
      seen.add(normalized);

      const score = scoreLink(resolved.pathname);
      if (score > 0) {
        scored.push({ url: normalized, score });
      }
    } catch {
      // invalid URL
    }
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_PAGES - 1).map((s) => s.url);
}

export async function crawlWebsite(inputUrl: string): Promise<CrawlResult> {
  // Normalize URL
  let url = inputUrl.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  // Remove trailing slash for consistency
  url = url.replace(/\/+$/, "");

  // Fetch homepage
  const homepageHtml = await fetchPage(url);
  if (!homepageHtml) {
    throw new Error("Could not fetch the website. Check the URL and try again.");
  }

  const homepage = extractText(homepageHtml);
  const pages: CrawledPage[] = [
    { url, title: homepage.title, text: homepage.text },
  ];

  // Discover and fetch internal pages
  const links = discoverLinks(homepageHtml, url);
  const fetches = await Promise.allSettled(
    links.map(async (linkUrl) => {
      const html = await fetchPage(linkUrl);
      if (!html) return null;
      const { title, text } = extractText(html);
      if (text.length < 50) return null; // skip near-empty pages
      return { url: linkUrl, title, text };
    })
  );

  let totalChars = homepage.text.length;
  for (const result of fetches) {
    if (result.status === "fulfilled" && result.value) {
      if (totalChars + result.value.text.length > MAX_TOTAL_CHARS) break;
      pages.push(result.value);
      totalChars += result.value.text.length;
    }
  }

  return { url, pages, totalChars };
}
