import OpenAI from "openai";
import type { ArticleCluster } from "./deduplicator";
import type { IntriguingFact, PoliticalContext, WebFact } from "./types";
import { SOURCES } from "./sources";

const client = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SynthesisResult {
  title: string;
  summary: string;
  objectiveReport: string;
  intriguingFacts: IntriguingFact[];
  politicalContext: PoliticalContext | null;
  webFacts: WebFact[];
  category: string;
}

interface SourceAnalysis {
  sourceKey: string;
  sensationScore: number;
  politicalLean: number;
  perspective: string;
  keyPhrases: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ñ]/g, "n")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "");
}

async function fetchWebFacts(
  ai: OpenAI,
  title: string,
  summary: string
): Promise<WebFact[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (ai as any).responses.create({
      model: "gpt-4o-search-preview",
      tools: [{ type: "web_search_preview" }],
      input: `Zoek 3 tot 5 aanvullende, verifieerbare feiten die de volgende Nederlandse nieuwsgebeurtenis verrijken met bredere context, historische achtergrond of relevante statistieken. Feiten die de meeste Nederlandse nieuwslezers nog niet kennen. Schrijf elk feit als één beknopte zin in het Nederlands, met een directe bronvermelding.

Onderwerp: "${title}"
Samenvatting: ${summary}`,
    });

    // Extract text and URL annotations from the Responses API output
    const messageItem = response.output?.find(
      (o: { type: string }) => o.type === "message"
    );
    if (!messageItem) return [];

    const textBlock = messageItem.content?.find(
      (c: { type: string }) => c.type === "output_text"
    );
    if (!textBlock) return [];

    const text: string = textBlock.text ?? "";
    const annotations: Array<{
      type: string;
      url: string;
      title?: string;
      start_index: number;
      end_index: number;
    }> = textBlock.annotations ?? [];

    // Pair each URL citation with the sentence that contains it
    const facts: WebFact[] = [];
    const seen = new Set<string>();

    for (const ann of annotations) {
      if (ann.type !== "url_citation" || seen.has(ann.url)) continue;
      seen.add(ann.url);

      // Extract the sentence surrounding the citation marker
      const before = text.substring(0, ann.start_index);
      const after = text.substring(ann.end_index);
      const sentStart = Math.max(
        before.lastIndexOf(". ") + 2,
        before.lastIndexOf("\n") + 1,
        0
      );
      const relEnd = after.search(/[.!?](\s|$)/);
      const sentEnd =
        ann.end_index + (relEnd === -1 ? after.length : relEnd + 1);
      const claim = text
        .substring(sentStart, sentEnd)
        .replace(/\s*\[\d+\]/g, "")
        .trim();

      if (claim.length > 15) {
        facts.push({
          claim,
          source: ann.title ?? new URL(ann.url).hostname,
          url: ann.url,
        });
      }
    }

    return facts.slice(0, 5);
  } catch (err) {
    console.error("[pipeline] Web facts fetch failed:", err);
    return fetchWebFactsFallback(ai, title, summary);
  }
}

async function fetchWebFactsFallback(
  ai: OpenAI,
  title: string,
  summary: string
): Promise<WebFact[]> {
  try {
    const response = await ai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content:
            "Je bent een Nederlandse nieuwsanalist. Geef 3 tot 5 aanvullende, verifieerbare feiten die de nieuwsgebeurtenis verrijken. Stuur altijd dit exacte JSON formaat terug: {\"facts\": [{\"claim\": \"feit als zin\", \"source\": \"bronvermelding\"}]}",
        },
        {
          role: "user",
          content: `Onderwerp: "${title}"\nSamenvatting: ${summary}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    const items: Array<{ claim: string; source: string }> = parsed.facts ?? parsed.items ?? [];
    return items.slice(0, 5).map((item) => ({
      claim: item.claim,
      source: item.source,
      url: "",
    }));
  } catch (err) {
    console.error("[pipeline] Web facts fallback failed:", err);
    return [];
  }
}

export async function synthesizeCluster(
  cluster: ArticleCluster
): Promise<{
  synthesis: SynthesisResult;
  sourceAnalyses: SourceAnalysis[];
} | null> {
  const ai = client();

  const articlesText = cluster.articles
    .map(
      (a) =>
        `### ${a.sourceName} (${a.sourceKey})\nKop: "${a.title}"\n${a.description}`
    )
    .join("\n\n---\n\n");

  // Step 1: Main synthesis (objective report + facts + category)
  const synthesisPrompt = `Analyseer de volgende nieuwsartikelen over hetzelfde onderwerp en genereer:

${articlesText}

Genereer een JSON-object met:
{
  "title": "Korte objectieve titel (max 15 woorden, geen emotie, geen clickbait)",
  "summary": "2-3 feitelijke zinnen samenvatting",
  "objectiveReport": "Volledig objectief nieuwsverslag in 3-4 alinea's (max 350 woorden). Alleen verifieerbare feiten, namen, datums, bedragen. Geen bijvoeglijke naamwoorden met emotionele lading. Schrijf in het Nederlands.",
  "category": "één van: politiek, economie, klimaat, technologie, buitenland, maatschappij, sport",
  "intriguingFacts": [
    {"fact": "Opvallend of weinig bekend contextfeit", "source": "Bronvermelding (bijv. CBS, 2025)"}
  ],
  "politicalContext": {
    "parties": [
      {
        "name": "Partijnaam",
        "abbreviation": "Afkorting",
        "position": "for|against|neutral|divided",
        "context": "Kort standpunt (1-2 zinnen)"
      }
    ],
    "nextDebate": "datum of null"
  }
}

Regels:
- intriguingFacts: 2-4 items, verrassende feiten of context die de meeste lezers niet kennen
- politicalContext: alleen opnemen als het onderwerp politiek relevant is, anders null
- De bronartikelen kunnen in het Engels of Nederlands zijn — schrijf alle output altijd in het Nederlands`;

  let synthesis: SynthesisResult;
  try {
    const r1 = await ai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1500,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Je bent een objectieve Nederlandse nieuwssynthesizer. Stuur alleen geldige JSON terug.",
        },
        { role: "user", content: synthesisPrompt },
      ],
    });

    const raw = r1.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    synthesis = {
      title: parsed.title ?? cluster.eventTitle,
      summary: parsed.summary ?? "",
      objectiveReport: parsed.objectiveReport ?? "",
      intriguingFacts: Array.isArray(parsed.intriguingFacts)
        ? parsed.intriguingFacts.slice(0, 4)
        : [],
      politicalContext: parsed.politicalContext ?? null,
      webFacts: [], // filled in step 2
      category: parsed.category ?? "maatschappij",
    };
  } catch (err) {
    console.error("[pipeline] Synthesis failed:", err);
    return null;
  }

  // Step 2: Web facts + per-source analysis (parallel)
  const [webFacts, sourceAnalyses] = await Promise.all([
    fetchWebFacts(ai, synthesis.title, synthesis.summary),
    Promise.all(
      cluster.articles.map(async (article): Promise<SourceAnalysis> => {
        const baseLean = SOURCES[article.sourceKey]?.politicalLean ?? 0;
        const baseSensation = SOURCES[article.sourceKey]?.baseSensation ?? 5;

        try {
          const r2 = await ai.chat.completions.create({
            model: "gpt-4o-mini",
            max_tokens: 400,
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content:
                  "Je analyseert framing en sensationalisme in Nederlandse journalistiek. Stuur alleen geldige JSON terug.",
              },
              {
                role: "user",
                content: `Analyseer dit nieuwsartikel:

Bron: ${article.sourceName}
Kop: "${article.title}"
Inhoud: ${article.description}

Geef JSON terug:
{
  "sensationScore": getal van 0.0 tot 10.0 (0=volledig feitelijk, 10=maximaal sensationalistisch),
  "politicalLean": getal van -5.0 tot 5.0 (negatief=links, 0=centrum, positief=rechts),
  "perspective": "2-3 zinnen: hoe framed dit medium het nieuws? Welk perspectief domineert? Welke bronnen? Welke waardeoordelen?",
  "keyPhrases": ["opvallende zin of woordkeuze 1", "opvallende zin 2", "opvallende zin 3"]
}

Context: de bekende politieke positie van ${article.sourceName} ligt rond ${baseLean > 0 ? "+" : ""}${baseLean} op de -5/+5 schaal.`,
              },
            ],
          });

          const raw = r2.choices[0]?.message?.content ?? "{}";
          const parsed = JSON.parse(raw);
          return {
            sourceKey: article.sourceKey,
            sensationScore: Math.max(
              0,
              Math.min(10, parseFloat(parsed.sensationScore) || baseSensation)
            ),
            politicalLean: Math.max(
              -5,
              Math.min(5, parseFloat(parsed.politicalLean) || baseLean)
            ),
            perspective: parsed.perspective ?? "",
            keyPhrases: Array.isArray(parsed.keyPhrases)
              ? parsed.keyPhrases.slice(0, 5)
              : [],
          };
        } catch {
          return {
            sourceKey: article.sourceKey,
            sensationScore: baseSensation,
            politicalLean: baseLean,
            perspective: "",
            keyPhrases: [],
          };
        }
      })
    ),
  ]);

  synthesis.webFacts = webFacts;
  return { synthesis, sourceAnalyses };
}

export function generateSlug(title: string): string {
  return slugify(title) + "-" + Date.now().toString(36);
}
