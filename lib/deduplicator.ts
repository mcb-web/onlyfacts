import OpenAI from "openai";
import type { RawArticle } from "./scraper";
import { embedTexts, connectedComponents } from "./embeddings";

export interface ArticleCluster {
  eventTitle: string;
  articles: RawArticle[];
}

const SIMILARITY_THRESHOLD = 0.68;
const SIX_HOURS_MS = 6 * 3600 * 1000;

/** Extract mid-sentence capitalised words (likely proper nouns / names). */
function extractProperNouns(title: string): string[] {
  return title
    .split(/\s+/)
    .slice(1) // skip first word — always capitalised in Dutch headlines
    .map((w) => w.replace(/[^a-zA-ZÀ-ÿ-]/g, ""))
    .filter((w) => w.length >= 4 && /^[A-Z]/.test(w))
    .map((w) => w.toLowerCase());
}

/**
 * Additional clustering pass: articles from different sources that share a
 * proper noun in the title AND were published within 6 hours of each other.
 */
function nameBasedCandidates(articles: RawArticle[]): RawArticle[][] {
  const nounIndex = new Map<string, RawArticle[]>();

  for (const article of articles) {
    for (const noun of extractProperNouns(article.title)) {
      if (!nounIndex.has(noun)) nounIndex.set(noun, []);
      nounIndex.get(noun)!.push(article);
    }
  }

  const seen = new Set<string>();
  const candidates: RawArticle[][] = [];

  for (const group of nounIndex.values()) {
    if (group.length < 2) continue;

    // Build clusters of articles within 6 hours of each other
    for (let i = 0; i < group.length; i++) {
      const cluster: RawArticle[] = [group[i]];
      for (let j = i + 1; j < group.length; j++) {
        const dt = Math.abs(
          group[i].publishedAt.getTime() - group[j].publishedAt.getTime()
        );
        if (dt <= SIX_HOURS_MS) cluster.push(group[j]);
      }

      // Deduplicate by sourceKey and require 2+ sources
      const deduped = cluster.filter(
        (a, idx, arr) => arr.findIndex((x) => x.sourceKey === a.sourceKey) === idx
      );
      if (deduped.length < 2) continue;

      // Stable key to avoid processing the same article set twice
      const key = deduped
        .map((a) => a.url)
        .sort()
        .join("|");
      if (seen.has(key)) continue;
      seen.add(key);

      candidates.push(deduped);
    }
  }

  return candidates;
}

/** Ask GPT to confirm all articles in a cluster cover the same news event. */
async function validateCluster(
  client: OpenAI,
  articles: RawArticle[]
): Promise<string | null> {
  const list = articles
    .map((a) => `- [${a.sourceName}] "${a.title}"`)
    .join("\n");

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 60,
    messages: [
      {
        role: "system",
        content:
          'Je bent een Nederlandse nieuwsredacteur. Beantwoord alleen met JSON: {"same": true/false, "title": "korte objectieve titel (max 12 woorden)"}.',
      },
      {
        role: "user",
        content: `Gaan alle onderstaande koppen over exact hetzelfde nieuwsfeit?\n\n${list}`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  try {
    const obj = JSON.parse(raw);
    if (obj.same === true && typeof obj.title === "string") {
      return obj.title as string;
    }
    return null;
  } catch {
    return null;
  }
}

export async function clusterArticles(
  articles: RawArticle[],
  existingTitles: string[] = []
): Promise<ArticleCluster[]> {
  if (articles.length === 0) return [];

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // 1. Embed all article titles in a single batch call
  const titles = articles.map((a) => a.title);
  const embeddings = await embedTexts(titles);

  // 2. Connected-components clustering by cosine similarity
  const groups = connectedComponents(embeddings, SIMILARITY_THRESHOLD);

  // 3. Build candidate clusters from embeddings: 2+ different sources required
  const embeddingCandidates = groups
    .map((indices) => {
      const clusterArticles = indices.map((i) => articles[i]);
      const deduped = clusterArticles.filter(
        (a, idx, arr) =>
          arr.findIndex((x) => x.sourceKey === a.sourceKey) === idx
      );
      return deduped;
    })
    .filter((arts) => arts.length >= 2);

  // 3b. Additional candidates from name-based matching
  const nameCandidates = nameBasedCandidates(articles);

  // Merge, deduplicating by URL set
  const seenKeys = new Set<string>();
  const candidates: RawArticle[][] = [];
  for (const group of [...embeddingCandidates, ...nameCandidates]) {
    const key = group.map((a) => a.url).sort().join("|");
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      candidates.push(group);
    }
  }

  if (candidates.length === 0) return [];

  // 4. Validate top candidates only — sort by source count desc, cap at 5
  const topCandidates = candidates
    .sort((a, b) => b.length - a.length)
    .slice(0, 5);

  const results: ArticleCluster[] = [];

  for (const arts of topCandidates) {
    const eventTitle = await validateCluster(client, arts);
    if (!eventTitle) continue;

    // Skip if the event title is too similar to an already-existing story
    const alreadyExists = existingTitles.some((t) => {
      const overlap = [...new Set(eventTitle.toLowerCase().split(/\s+/))]
        .filter((w) => w.length > 3 && t.toLowerCase().includes(w));
      return overlap.length >= 3;
    });
    if (alreadyExists) continue;

    results.push({ eventTitle, articles: arts });
  }

  return results;
}
