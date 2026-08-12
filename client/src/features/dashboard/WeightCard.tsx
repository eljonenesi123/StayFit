import { useMemo } from "react";
import { getWeightTrend } from "./placeholderData";
import "./WeightCard.css";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function WeightCard() {
  const trend = useMemo(() => getWeightTrend(), []);

  const min = Math.min(...trend.map((e) => e.weightKg));
  const max = Math.max(...trend.map((e) => e.weightKg));
  const range = Math.max(max - min, 0.5); // avoid a flat 0-height chart when weight barely moves

  const first = trend[0].weightKg;
  const last = trend[trend.length - 1].weightKg;
  const delta = Math.round((last - first) * 10) / 10;

  return (
    <div className="card weight-card">
      <div className="weight-card__header">
        <span className="eyebrow">Bodyweight</span>
        <span className={`weight-card__delta ${delta > 0 ? "weight-card__delta--up" : delta < 0 ? "weight-card__delta--down" : ""}`}>
          {delta === 0 ? "No change" : `${delta > 0 ? "+" : ""}${delta} kg this week`}
        </span>
      </div>
      <div className="weight-card__value">{last} kg</div>

      <div className="weight-card__chart" role="img" aria-label={`Bodyweight over the last 7 days, ending at ${last} kg`}>
        {trend.map((entry, i) => {
          const heightPct = 18 + ((entry.weightKg - min) / range) * 82;
          const isLast = i === trend.length - 1;
          return (
            <div key={entry.date} className="weight-card__bar-col">
              <div
                className={`weight-card__bar ${isLast ? "weight-card__bar--current" : ""}`}
                style={{ height: `${heightPct}%` }}
                title={`${entry.weightKg} kg`}
              />
              <span className="weight-card__bar-label">{DAY_LABELS[i]}</span>
            </div>
          );
        })}
      </div>
      <p className="weight-card__note">Demo trend — weight logging is coming soon.</p>
    </div>
  );
}
