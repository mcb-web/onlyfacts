import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import BiasSpectrum from "@/components/BiasSpectrum";
import PerspectiveCard from "@/components/PerspectiveCard";
import IntriguingFacts from "@/components/IntriguingFacts";
import WebFacts from "@/components/WebFacts";
import PoliticalContextPanel from "@/components/PoliticalContext";
import SensationBadge from "@/components/SensationBadge";
import { formatDate, avgSensation } from "@/lib/utils";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types";
import type { NewsEventData, Category } from "@/lib/types";
import { ChevronLeft, FileText, Eye } from "lucide-react";

async function getEvent(id: string): Promise<NewsEventData | null> {
  try {
    const event = await prisma.newsEvent.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { sourceArticles: { orderBy: { sensationScore: "asc" } } },
    });
    if (!event) return null;
    return {
      ...event,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      intriguingFacts: JSON.parse(event.intriguingFacts),
      politicalContext: event.politicalContext
        ? JSON.parse(event.politicalContext)
        : null,
      webFacts: JSON.parse(event.webFacts ?? "[]"),
      sourceArticles: event.sourceArticles.map((a) => ({
        ...a,
        publishedAt: a.publishedAt.toISOString(),
        createdAt: a.createdAt.toISOString(),
        keyPhrases: JSON.parse(a.keyPhrases),
      })),
    };
  } catch (err) {
    console.error("[getEvent] error:", err);
    return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);
  if (!event) notFound();

  const avgSens = avgSensation(event.sourceArticles.map((a) => a.sensationScore));
  const categoryLabel = CATEGORY_LABELS[event.category as Category] ?? event.category;
  const categoryColor = CATEGORY_COLORS[event.category as Category] ?? "bg-gray-100 text-gray-700";

  // Paragraphs for the objective report
  const paragraphs = event.objectiveReport
    .split("\n\n")
    .filter((p) => p.trim().length > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        Terug naar overzicht
      </Link>

      {/* Article header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className={`category-badge ${categoryColor}`}>{categoryLabel}</span>
          <span className="text-sm text-ink-muted">{formatDate(event.createdAt)}</span>
          <span className="text-sm text-ink-muted">
            {event.sourceArticles.length} bronnen geraadpleegd
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink leading-snug mb-4">
          {event.title}
        </h1>

        <p className="text-lg text-ink-secondary leading-relaxed mb-6">
          {event.summary}
        </p>

        {/* Bias + sensation overview */}
        <div className="card p-5 grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-[0.7rem] text-ink-muted uppercase tracking-wider font-medium mb-3">
              Verdeling over het politiek spectrum
            </p>
            <BiasSpectrum sources={event.sourceArticles} />
          </div>
          <div>
            <p className="text-[0.7rem] text-ink-muted uppercase tracking-wider font-medium mb-3">
              Gemiddelde sensatie-score
            </p>
            {/* mt-7 compensates for the Links/Centrum/Rechts axis-label row in BiasSpectrum */}
            <div className="mt-7">
            <SensationBadge score={avgSens} />
            <p className="text-xs text-ink-muted mt-2">
              Bereik: {Math.min(...event.sourceArticles.map((a) => a.sensationScore)).toFixed(1)}&nbsp;–&nbsp;
              {Math.max(...event.sourceArticles.map((a) => a.sensationScore)).toFixed(1)} per bron
            </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Objective report + Intriguing facts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Objective report */}
          <div className="card p-6 sm:p-8">
            <h2 className="font-serif text-xl font-semibold text-ink mb-1 flex items-center gap-2">
              <FileText className="text-accent shrink-0" size={20} />
              Het objectieve verslag
            </h2>
            <p className="text-xs text-ink-muted mb-5">
              Synthesized from {event.sourceArticles.length} sources · no editorializing
            </p>
            <div className="article-prose">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Intriguing facts */}
          <IntriguingFacts facts={event.intriguingFacts} />

          {/* Web-researched facts */}
          <WebFacts facts={event.webFacts} />
        </div>

        {/* Right: Source perspectives + Political context */}
        <div className="space-y-5">
          {/* Perspective map */}
          <div>
            <h2 className="font-serif text-lg font-semibold text-ink mb-1 flex items-center gap-2">
              <Eye className="text-accent shrink-0" size={18} />
              Perspectievenkaart
            </h2>
            <p className="text-xs text-ink-muted mb-3">
              Hoe framen verschillende media dit verhaal?
            </p>
            <div className="space-y-3">
              {event.sourceArticles.map((article) => (
                <PerspectiveCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          {/* Political context */}
          {event.politicalContext && (
            <PoliticalContextPanel context={event.politicalContext} />
          )}
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}
