import { Globe } from "lucide-react";
import type { WebFact } from "@/lib/types";

interface WebFactsProps {
  facts: WebFact[];
}

export default function WebFacts({ facts }: WebFactsProps) {
  if (!facts.length) return null;

  return (
    <div className="card p-5 sm:p-6">
      <h3 className="font-serif font-semibold text-lg text-ink mb-1 flex items-center gap-2">
        <Globe className="text-accent shrink-0" size={20} />
        Verdieping
      </h3>
      <p className="text-xs text-ink-muted mb-5">
        Aanvullende feiten gezocht via webonderzoek · klik op de nootmarkering
        voor de bron
      </p>

      <ol className="space-y-0">
        {facts.map((item, i) => (
          <li key={i} className="border-b border-canvas-dark last:border-0 py-4 first:pt-0 last:pb-0">
            <p className="text-sm text-ink leading-relaxed">
              {item.claim}
              {/* Superscript note marker — triggers the details below */}
              <sup className="ml-0.5 text-[0.6rem] font-semibold text-accent select-none">
                [{i + 1}]
              </sup>
            </p>

            {/* De Correspondent-style collapsed citation */}
            {item.source && (
              <details className="group mt-1">
                <summary className="inline-flex items-center gap-1 text-[0.65rem] text-ink-muted cursor-pointer list-none hover:text-accent transition-colors select-none">
                  <span className="font-semibold text-accent">[{i + 1}]</span>
                  <span className="group-open:hidden">Toon bron</span>
                  <span className="hidden group-open:inline">Verberg bron</span>
                </summary>
                <div className="mt-1.5 pl-3 border-l-2 border-accent/30">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.7rem] text-accent hover:underline break-words leading-relaxed"
                    >
                      {item.source}
                    </a>
                  ) : (
                    <span className="text-[0.7rem] text-ink-secondary">{item.source}</span>
                  )}
                </div>
              </details>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
