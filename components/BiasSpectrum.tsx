import { getSource, getLeanLabel } from "@/lib/sources";
import { leanToPercent } from "@/lib/utils";
import type { SourceArticleData } from "@/lib/types";

interface BiasSpectrumProps {
  sources: SourceArticleData[];
  compact?: boolean;
}

export default function BiasSpectrum({ sources, compact = false }: BiasSpectrumProps) {
  const BAR_HEIGHT = compact ? 6 : 8;

  return (
    <div className={compact ? "space-y-1.5" : "space-y-3"}>
      {/* Axis labels */}
      {!compact && (
        <div className="flex justify-between text-[0.65rem] text-ink-muted font-medium tracking-wide uppercase">
          <span>Links</span>
          <span>Centrum</span>
          <span>Rechts</span>
        </div>
      )}

      {/* Gradient bar */}
      <div className="relative">
        <div
          className="bias-gradient w-full rounded-full opacity-30"
          style={{ height: BAR_HEIGHT }}
        />
        {/* Source dots */}
        {sources.map((article) => {
          const pct = leanToPercent(article.politicalLean);
          const meta = getSource(article.sourceKey);
          return (
            <div
              key={article.sourceKey}
              title={`${meta.shortName} — ${getLeanLabel(article.politicalLean)} (sensatie: ${article.sensationScore.toFixed(1)})`}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group cursor-default"
              style={{ left: `${pct}%` }}
            >
              <div
                className={`rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125 ${compact ? "w-3 h-3" : "w-4 h-4"}`}
                style={{ backgroundColor: meta.color }}
              />
              {/* Tooltip */}
              {!compact && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none">
                  <div className="bg-ink text-white text-[0.65rem] rounded-md px-2 py-1 whitespace-nowrap shadow-lg">
                    <div className="font-semibold">{meta.shortName}</div>
                    <div className="text-white/70">{getLeanLabel(article.politicalLean)}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {/* Center tick */}
        <div
          className="absolute top-0 bottom-0 w-px bg-ink-muted/30"
          style={{ left: "50%" }}
        />
      </div>

      {/* Source labels (non-compact) */}
      {!compact && (
        <div className="relative" style={{ height: 20 }}>
          {sources.map((article) => {
            const pct = leanToPercent(article.politicalLean);
            const meta = getSource(article.sourceKey);
            return (
              <span
                key={article.sourceKey}
                className="absolute text-[0.6rem] text-ink-muted -translate-x-1/2 whitespace-nowrap"
                style={{ left: `${pct}%`, top: 0 }}
              >
                {meta.shortName}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
