import { cn } from "@/lib/utils";
import { getSensationLabel } from "@/lib/sources";

interface SensationBadgeProps {
  score: number;
  showScore?: boolean;
  size?: "sm" | "md";
}

export default function SensationBadge({
  score,
  showScore = true,
  size = "md",
}: SensationBadgeProps) {
  let colorClass: string;
  let bgClass: string;

  if (score <= 2.5) {
    colorClass = "text-sensation-low";
    bgClass = "bg-sensation-low-bg";
  } else if (score <= 5.5) {
    colorClass = "text-sensation-mid";
    bgClass = "bg-sensation-mid-bg";
  } else {
    colorClass = "text-sensation-high";
    bgClass = "bg-sensation-high-bg";
  }

  const label = getSensationLabel(score);
  const barWidth = `${(score / 10) * 100}%`;

  if (size === "sm") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
          colorClass,
          bgClass
        )}
        title={`Sensatie-score: ${score.toFixed(1)}/10`}
      >
        {label}
        {showScore && (
          <span className="opacity-60">{score.toFixed(1)}</span>
        )}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="h-1.5 bg-canvas-dark rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              score <= 2.5
                ? "bg-sensation-low"
                : score <= 5.5
                ? "bg-sensation-mid"
                : "bg-sensation-high"
            )}
            style={{ width: barWidth }}
          />
        </div>
      </div>
      <span className={cn("text-xs font-semibold shrink-0", colorClass)}>
        {label}
        {showScore && (
          <span className="font-normal opacity-70 ml-1">{score.toFixed(1)}</span>
        )}
      </span>
    </div>
  );
}
