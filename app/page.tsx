export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import ArticleCard from "@/components/ArticleCard";
import FetchButton from "@/components/FetchButton";
import type { NewsEventData } from "@/lib/types";
import { AlertCircle, RefreshCw } from "lucide-react";

async function getEvents(): Promise<NewsEventData[]> {
  try {
    const events = await prisma.newsEvent.findMany({
      include: { sourceArticles: true },
      orderBy: { createdAt: "desc" },
    });
    return events.map((e) => ({
      ...e,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
      intriguingFacts: JSON.parse(e.intriguingFacts),
      politicalContext: e.politicalContext ? JSON.parse(e.politicalContext) : null,
      webFacts: JSON.parse(e.webFacts ?? "[]"),
      sourceArticles: e.sourceArticles.map((a) => ({
        ...a,
        publishedAt: a.publishedAt.toISOString(),
        createdAt: a.createdAt.toISOString(),
        keyPhrases: JSON.parse(a.keyPhrases),
      })),
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const events = await getEvents();
  const [featured, ...rest] = events;

  if (events.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <AlertCircle className="w-10 h-10 text-ink-muted mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-semibold text-ink mb-3">
          Geen artikelen gevonden
        </h2>
        <p className="text-ink-secondary mb-6">
          Initialiseer de database met voorbeelddata om te beginnen.
        </p>
        <a
          href="/api/seed"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <RefreshCw size={15} />
          Database initialiseren
        </a>
        <p className="text-xs text-ink-muted mt-4">
          Of bezoek{" "}
          <code className="bg-canvas-dark px-1.5 py-0.5 rounded text-ink-secondary">
            /api/seed
          </code>{" "}
          in uw browser en ververs daarna deze pagina.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-ink mb-2">
              Vandaag in het nieuws
            </h1>
            <p className="text-ink-secondary text-[0.9rem]">
              {events.length} nieuwsgebeurtenissen · objectief samengevat uit{" "}
              {new Set(events.flatMap((e) => e.sourceArticles.map((a) => a.sourceKey))).size}{" "}
              bronnen
            </p>
          </div>
          <FetchButton />
        </div>
      </div>

      {/* Legend */}
      <div className="card p-4 mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-secondary">
        <span className="font-semibold text-ink">Legenda:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-left inline-block" />
          Links-leunend medium
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-center inline-block" />
          Centraal medium
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-right inline-block" />
          Rechts-leunend medium
        </span>
      </div>

      {/* Featured article */}
      {featured && (
        <div className="mb-8">
          <p className="text-[0.7rem] uppercase tracking-widest text-ink-muted font-medium mb-3">
            Uitgelicht verhaal
          </p>
          <ArticleCard event={featured} featured />
        </div>
      )}

      {/* Article grid */}
      {rest.length > 0 && (
        <div>
          <p className="text-[0.7rem] uppercase tracking-widest text-ink-muted font-medium mb-3">
            Overig nieuws
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((event) => (
              <ArticleCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
