import Link from "next/link";
import { Clock, BookOpen } from "lucide-react";
import BiasSpectrum from "./BiasSpectrum";
import SensationBadge from "./SensationBadge";
import { timeAgo, avgSensation } from "@/lib/utils";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types";
import type { NewsEventData, Category } from "@/lib/types";

interface ArticleCardProps {
  event: NewsEventData;
  featured?: boolean;
}

export default function ArticleCard({ event, featured = false }: ArticleCardProps) {
  const avgSens = avgSensation(event.sourceArticles.map((a) => a.sensationScore));
  const categoryLabel = CATEGORY_LABELS[event.category as Category] ?? event.category;
  const categoryColor = CATEGORY_COLORS[event.category as Category] ?? "bg-gray-100 text-gray-700";

  if (featured) {
    return (
      <Link href={`/article/${event.slug}`} className="block group">
        <article className="card-hover p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`category-badge ${categoryColor}`}>{categoryLabel}</span>
            <div className="flex items-center gap-1.5 text-xs text-ink-muted">
              <Clock size={12} />
              <span>{timeAgo(event.createdAt)}</span>
            </div>
            <span className="text-xs text-ink-muted">
              {event.sourceArticles.length} bronnen
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mb-3 leading-snug group-hover:text-accent transition-colors">
            {event.title}
          </h2>
          <p className="text-ink-secondary text-[0.95rem] leading-relaxed mb-6">
            {event.summary}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[0.7rem] text-ink-muted uppercase tracking-wider font-medium mb-2">
                Politiek spectrum
              </p>
              <BiasSpectrum sources={event.sourceArticles} />
            </div>
            <div>
              <p className="text-[0.7rem] text-ink-muted uppercase tracking-wider font-medium mb-2">
                Gemiddelde sensatie-score
              </p>
              <SensationBadge score={avgSens} />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-1.5 text-accent text-sm font-medium">
            <BookOpen size={14} />
            <span>Lees objectief verslag</span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/article/${event.slug}`} className="block group">
      <article className="card-hover p-5 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`category-badge ${categoryColor}`}>{categoryLabel}</span>
          <span className="text-xs text-ink-muted">{timeAgo(event.createdAt)}</span>
        </div>

        <h3 className="font-serif font-semibold text-ink text-[1.05rem] leading-snug mb-2 group-hover:text-accent transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-ink-secondary leading-relaxed mb-4 flex-1 line-clamp-3">
          {event.summary}
        </p>

        <div className="space-y-3 mt-auto">
          <BiasSpectrum sources={event.sourceArticles} compact />
          <div className="flex items-center justify-between">
            <SensationBadge score={avgSens} size="sm" />
            <span className="text-xs text-ink-muted">
              {event.sourceArticles.length} bronnen
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
