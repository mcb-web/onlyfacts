import OpenAI from "openai";
import type { RawArticle } from "./scraper";
import { embedTexts, connectedComponents } from "./embeddings";
import { titleSimilarity } from "./utils";

export interface ArticleCluster {
  eventTitle: string;
  articles: RawArticle[];
  /** "event" = all sources cover the exact same news fact.
   *  "topic" = sources cover different aspects of the same prominent ongoing story. */
  type: "event" | "topic";
}

const SIMILARITY_THRESHOLD = 0.75;
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

interface ClusterValidation {
  type: "event" | "topic";
  title: string;
}

/**
 * Ask GPT whether the cluster is a single event, a topic overview, or unrelated.
 * Returns null if articles don't belong together.
 */
async function validateCluster(
  client: OpenAI,
  articles: RawArticle[]
): Promise<ClusterValidation | null> {
  const list = articles
    .map((a) => `- [${a.sourceName}] "${a.title}"`)
    .join("\n");

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 80,
    messages: [
      {
        role: "system",
        content:
          'Je bent een Nederlandse nieuwsredacteur. Beantwoord alleen met JSON: {"type": "event"|"topic"|"none", "title": "korte objectieve titel (max 12 woorden)"}.\n' +
          '- "event": alle koppen gaan over EXACT hetzelfde nieuwsfeit\n' +
          '- "topic": koppen gaan over hetzelfde prominente lopende onderwerp maar vanuit verschillende invalshoeken of sub-gebeurtenissen\n' +
          '- "none": koppen horen inhoudelijk niet bij elkaar',
      },
      {
        role: "user",
        content: `Analyseer de onderstaande koppen:\n\n${list}`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  try {
    const obj = JSON.parse(raw);
    if ((obj.type === "event" || obj.type === "topic") && typeof obj.title === "string") {
      return { type: obj.type, title: obj.title };
    }
    return null;
  } catch {
    return null;
  }
}

export async function clusterArticles(
  articles: RawArticle[],
  existingEventTitles: string[] = [],
  recentTopicTitles: string[] = []
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

  // Merge: embedding candidates first (semantic match = more reliable),
  // then name-based candidates not already covered, deduplicating by URL set.
  const seenKeys = new Set<string>();
  const embeddingDeduped: RawArticle[][] = [];
  for (const group of embeddingCandidates) {
    const key = group.map((a) => a.url).sort().join("|");
    if (!seenKeys.has(key)) { seenKeys.add(key); embeddingDeduped.push(group); }
  }
  const nameDeduped: RawArticle[][] = [];
  for (const group of nameCandidates) {
    const key = group.map((a) => a.url).sort().join("|");
    if (!seenKeys.has(key)) { seenKeys.add(key); nameDeduped.push(group); }
  }

  // Sort each group by article count, then interleave: all embedding first, then name-based.
  embeddingDeduped.sort((a, b) => b.length - a.length);
  nameDeduped.sort((a, b) => b.length - a.length);
  const candidates = [...embeddingDeduped, ...nameDeduped];

  if (candidates.length === 0) return [];

  // 4. Validate up to 10 embedding candidates + up to 10 name candidates (cap 20 total)
  const topCandidates = candidates.slice(0, 20);

  const results: ArticleCluster[] = [];

  for (const arts of topCandidates) {
    const validation = await validateCluster(client, arts);
    if (!validation) continue;

    if (validation.type === "event") {
      // Events: skip if already covered by any article in the DB
      const alreadyExists = existingEventTitles.some(
        (t) => titleSimilarity(validation.title, t) >= 0.4
      );
      if (alreadyExists) continue;
    } else {
      // Topics: skip only if a recent overview (last 3 days) already covers this topic
      const recentlyPublished = recentTopicTitles.some(
        (t) => titleSimilarity(validation.title, t) >= 0.4
      );
      if (recentlyPublished) continue;
    }

    results.push({ eventTitle: validation.title, articles: arts, type: validation.type });
  }

  return results;
}
