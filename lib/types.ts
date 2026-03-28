export interface SourceMeta {
  key: string;
  name: string;
  shortName: string;
  domain: string;
  politicalLean: number; // -5 (far left) to +5 (far right)
  baseSensation: number; // 0-10 baseline sensation score
  color: string; // hex color for charts
  description: string;
}

export interface IntriguingFact {
  fact: string;
  source: string;
  sourceUrl?: string;
}

export interface WebFact {
  claim: string;
  source: string;
  url: string;
}

export interface PoliticalParty {
  name: string;
  abbreviation: string;
  position: "for" | "against" | "neutral" | "divided";
  context: string;
  votes?: string;
}

export interface PoliticalContext {
  parties: PoliticalParty[];
  lastVote?: string;
  nextDebate?: string;
}

export interface SourceArticleData {
  id: string;
  eventId: string;
  sourceKey: string;
  sourceName: string;
  originalTitle: string;
  url: string;
  publishedAt: string;
  sensationScore: number;
  politicalLean: number;
  perspective: string;
  keyPhrases: string[];
  createdAt: string;
}

export interface NewsEventData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  objectiveReport: string;
  intriguingFacts: IntriguingFact[];
  politicalContext: PoliticalContext | null;
  webFacts: WebFact[];
  category: string;
  createdAt: string;
  updatedAt: string;
  sourceArticles: SourceArticleData[];
}

export interface DailyStatPoint {
  date: string;
  avgSensation: number;
  politicalLean: number;
  articleCount: number;
}

export interface SourceStatsData {
  sourceKey: string;
  sourceName: string;
  points: DailyStatPoint[];
  avgSensation: number;
  avgLean: number;
}

export type Category =
  | "politiek"
  | "economie"
  | "klimaat"
  | "technologie"
  | "buitenland"
  | "maatschappij"
  | "sport";

export const CATEGORY_LABELS: Record<Category, string> = {
  politiek: "Politiek",
  economie: "Economie",
  klimaat: "Klimaat",
  technologie: "Technologie",
  buitenland: "Buitenland",
  maatschappij: "Maatschappij",
  sport: "Sport",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  politiek: "bg-violet-100 text-violet-800",
  economie: "bg-amber-100 text-amber-800",
  klimaat: "bg-emerald-100 text-emerald-800",
  technologie: "bg-sky-100 text-sky-800",
  buitenland: "bg-indigo-100 text-indigo-800",
  maatschappij: "bg-rose-100 text-rose-800",
  sport: "bg-orange-100 text-orange-800",
};
