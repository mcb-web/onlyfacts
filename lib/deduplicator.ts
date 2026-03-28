import OpenAI from "openai";
import type { RawArticle } from "./scraper";
import { embedTexts, connectedComponents } from "./embeddings";

export interface ArticleCluster {
  eventTitle: string;
  articles: RawArticle[];
}

const SIMILARITY_THRESHOLD = 0.75;

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

  // 3. Build candidate clusters: 2+ different sources required
  const candidates = groups
    .map((indices) => {
      const clusterArticles = indices.map((i) => articles[i]);
      // deduplicate by sourceKey — keep first per source
      const deduped = clusterArticles.filter(
        (a, idx, arr) =>
          arr.findIndex((x) => x.sourceKey === a.sourceKey) === idx
      );
      return deduped;
    })
    .filter((arts) => arts.length >= 2);

  if (candidates.length === 0) return [];

  // 4. Validate each candidate cluster with GPT and generate an event title
  const results: ArticleCluster[] = [];

  for (const arts of candidates) {
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
