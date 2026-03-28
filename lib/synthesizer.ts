// OpenAI-powered synthesis for real articles.
// When OPENAI_API_KEY is set, this calls the API.
// Otherwise it returns pre-written mock content (the mock-data already has objective reports).

import OpenAI from "openai";

const SYNTHESIS_SYSTEM = `Je bent een objectieve Nederlandse nieuwssynthesizer.
Je taak is om meerdere nieuwsartikelen over hetzelfde onderwerp te verwerken tot één feitelijk verslag.

Regels:
- Geen bijvoeglijke naamwoorden met emotionele lading (geen "schokkend", "alarmerend", "verrassend")
- Geen clickbait of sensationalistische formuleringen
- Alleen verifieerbare feiten: namen, datums, bedragen, percentages, citaten met bronvermelding
- Passieve en neutrale zinsconstructies
- Maximaal 350 woorden
- Schrijf in het Nederlands`;

const PERSPECTIVE_SYSTEM = `Je bent een mediaanalist die framing en bias analyseert in Nederlandse journalistiek.
Beschrijf in 2-3 zinnen hoe dit artikel het onderwerp frames: welk perspectief domineert, welke bronnen worden geciteerd, welke waardeoordelen worden gemaakt.
Wees neutraal en analytisch. Schrijf in het Nederlands.`;

function getClient(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function synthesizeArticles(
  articles: Array<{ source: string; title: string; content: string }>
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return "[Synthesizer niet actief — voeg OPENAI_API_KEY toe aan .env.local om live synthese te activeren.]";
  }

  const articlesText = articles
    .map((a) => `## ${a.source}\nKop: ${a.title}\n${a.content}`)
    .join("\n\n---\n\n");

  const response = await getClient().chat.completions.create({
    model: "gpt-4o",
    max_tokens: 800,
    messages: [
      { role: "system", content: SYNTHESIS_SYSTEM },
      {
        role: "user",
        content: `Synthetiseer de volgende ${articles.length} artikelen tot één objectief feitenverslag:\n\n${articlesText}`,
      },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}

export async function analyzePerspective(
  source: string,
  title: string,
  content: string
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) return "";

  const response = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 200,
    messages: [
      { role: "system", content: PERSPECTIVE_SYSTEM },
      {
        role: "user",
        content: `Bron: ${source}\nKop: ${title}\n\nInhoud:\n${content}`,
      },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}

export async function scoreSensation(
  title: string,
  content: string
): Promise<number> {
  if (!process.env.OPENAI_API_KEY) return 5.0;

  const response = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 10,
    messages: [
      {
        role: "system",
        content:
          "Geef een sensationalisme-score van 0.0 tot 10.0 voor dit Nederlandse nieuwsartikel. 0=volledig feitelijk, 10=maximaal sensationalistisch. Antwoord alleen met het getal, niets anders.",
      },
      {
        role: "user",
        content: `Kop: ${title}\n\n${content.slice(0, 500)}`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content?.trim() ?? "";
  const num = parseFloat(text);
  return isNaN(num) ? 5.0 : Math.max(0, Math.min(10, num));
}
