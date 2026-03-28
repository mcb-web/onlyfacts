import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
  });
}

export function timeAgo(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} min geleden`;
  if (hours < 24) return `${hours} uur geleden`;
  if (days === 1) return "gisteren";
  return `${days} dagen geleden`;
}

export function leanToPercent(lean: number): number {
  // Convert -5..+5 to 0..100 percent
  return ((lean + 5) / 10) * 100;
}

// Compute the average political lean from a set of source articles
export function avgLean(leans: number[]): number {
  if (!leans.length) return 0;
  return leans.reduce((a, b) => a + b, 0) / leans.length;
}

export function avgSensation(scores: number[]): number {
  if (!scores.length) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Dutch stopwords to strip before comparing titles
const NL_STOP = new Set([
  "de", "het", "een", "van", "voor", "naar", "door", "over", "zijn", "heeft",
  "wordt", "maar", "ook", "niet", "meer", "deze", "alle", "met", "aan", "bij",
  "dit", "dat", "hij", "zij", "wij", "hun", "hen", "ons", "we", "je", "jij",
  "is", "was", "worden", "werd", "om", "op", "in", "uit", "en", "of", "als",
  "dan", "er", "zo", "te", "al", "nu", "die", "der", "den", "des", "sich",
]);

function titleTokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .split(/[\s\-:,.()'"/!?]+/)
      .filter((w) => w.length > 3 && !NL_STOP.has(w))
  );
}

/**
 * Jaccard similarity between two news titles based on significant word overlap.
 * Returns 0–1; values above ~0.3 almost always indicate the same story.
 */
export function titleSimilarity(a: string, b: string): number {
  const ta = titleTokens(a);
  const tb = titleTokens(b);
  if (ta.size === 0 && tb.size === 0) return 1;
  if (ta.size === 0 || tb.size === 0) return 0;
  const taArr = Array.from(ta);
  const tbArr = Array.from(tb);
  const intersection = taArr.filter((w) => tb.has(w)).length;
  const union = new Set(taArr.concat(tbArr)).size;
  return intersection / union;
}
