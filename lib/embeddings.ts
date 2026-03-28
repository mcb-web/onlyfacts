import OpenAI from "openai";

function client() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/** Embed an array of texts in one API call, returned in input order. */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const response = await client().embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return response.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

/** Cosine similarity between two vectors, returns −1..1. */
export function cosineSim(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}

/**
 * Group embeddings into clusters using Union-Find connected components.
 * Any two embeddings with cosine similarity ≥ threshold are merged into
 * the same cluster. Each index appears in exactly one cluster.
 */
export function connectedComponents(
  embeddings: number[][],
  threshold: number
): number[][] {
  const n = embeddings.length;
  const parent = Array.from({ length: n }, (_, i) => i);

  function find(x: number): number {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]; // path compression
      x = parent[x];
    }
    return x;
  }

  function union(x: number, y: number) {
    parent[find(x)] = find(y);
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (cosineSim(embeddings[i], embeddings[j]) >= threshold) {
        union(i, j);
      }
    }
  }

  const groups: Record<number, number[]> = {};
  for (let i = 0; i < n; i++) {
    const root = find(i);
    if (!groups[root]) groups[root] = [];
    groups[root].push(i);
  }

  return Object.values(groups);
}
