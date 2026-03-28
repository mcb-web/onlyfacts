import { ExternalLink } from "lucide-react";
import SensationBadge from "./SensationBadge";
import { getSource, getLeanLabel } from "@/lib/sources";
import { leanToPercent } from "@/lib/utils";
import type { SourceArticleData } from "@/lib/types";

interface PerspectiveCardProps {
  article: SourceArticleData;
}

export default function PerspectiveCard({ article }: PerspectiveCardProps) {
  const meta = getSource(article.sourceKey);
  const leanPct = leanToPercent(article.politicalLean);

  // Left-right indicator color
  let leanColor: string;
  if (article.politicalLean < -1) leanColor = "#1E40AF";
  else if (article.politicalLean < -0.5) leanColor = "#3B82F6";
  else if (article.politicalLean < 0.5) leanColor = "#6B7280";
  else if (article.politicalLean < 1.5) leanColor = "#F87171";
  else leanColor = "#9F1239";

  return (
    <div className="card p-4 space-y-3">
      {/* Source header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
            style={{ backgroundColor: meta.color }}
          />
          <div>
            <p className="font-semibold text-sm text-ink">{meta.shortName}</p>
            <p className="text-[0.65rem] text-ink-muted">{meta.description}</p>
          </div>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[0.65rem] font-medium text-accent hover:underline shrink-0"
          title="Lees origineel artikel"
        >
          <ExternalLink size={11} />
          Origineel
        </a>
      </div>

      {/* Original headline */}
      <div className="bg-canvas rounded-lg px-3 py-2">
        <p className="text-[0.75rem] text-ink-muted mb-1">Originele kop</p>
        <p className="text-sm text-ink leading-snug italic">
          &ldquo;{article.originalTitle}&rdquo;
        </p>
      </div>

      {/* Perspective analysis */}
      <p className="text-sm text-ink-secondary leading-relaxed">{article.perspective}</p>

      {/* Key phrases */}
      {article.keyPhrases.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {article.keyPhrases.slice(0, 4).map((phrase) => (
            <span
              key={phrase}
              className="text-[0.65rem] bg-canvas-dark text-ink-secondary px-2 py-0.5 rounded-full"
            >
              &ldquo;{phrase}&rdquo;
            </span>
          ))}
        </div>
      )}

      {/* Metrics */}
      <div className="pt-2 border-t border-border space-y-2">
        <SensationBadge score={article.sensationScore} size="sm" />
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-canvas-dark rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${leanPct}%`, backgroundColor: leanColor }}
            />
          </div>
          <span
            className="text-[0.65rem] font-medium shrink-0"
            style={{ color: leanColor }}
          >
            {getLeanLabel(article.politicalLean)}
          </span>
        </div>
      </div>
    </div>
  );
}
