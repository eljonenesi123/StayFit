import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useProfile } from "../profile/useProfile";
import { getRecentTrend, logWeight, type WeightLogEntry } from "./weightLog";
import { useCountUp } from "../../lib/useCountUp";
import { PencilIcon } from "../../components/icons";
import emptyWeightLogUrl from "../../assets/illustrations/empty-weight-log.svg";
import "./WeightCard.css";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function WeightCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, loading } = useProfile();
  const [trend, setTrend] = useState<WeightLogEntry[]>([]);

  // Seed the local weight log from the real saved profile weight the first
  // time it's available — replaces the old random-demo placeholder trend
  // with "what the user actually entered" as the single source of truth.
  useEffect(() => {
    if (!user || loading) return;
    if (getRecentTrend(user.id, 1).length === 0 && profile?.weight != null) {
      logWeight(user.id, profile.weight);
    }
    setTrend(getRecentTrend(user.id, 7));
  }, [user, loading, profile?.weight]);

  const hasData = trend.length > 0;
  const last = hasData ? trend[trend.length - 1].weightKg : 0;
  const animatedLast = useCountUp(last, 600, hasData);

  if (loading) {
    return <div className="card weight-card weight-card--loading skeleton" aria-hidden="true" />;
  }

  if (!hasData) {
    return (
      <div className="card weight-card weight-card--empty">
        <div className="weight-card__header">
          <span className="eyebrow">Bodyweight</span>
          <button type="button" className="weight-card__edit" onClick={() => navigate("/profile")} aria-label="Log your weight">
            <PencilIcon width={16} height={16} />
          </button>
        </div>
        <img src={emptyWeightLogUrl} alt="" className="weight-card__empty-illustration" />
        <p className="weight-card__empty-text">Log your weight to see your trend here.</p>
        <button type="button" className="btn btn-secondary weight-card__log-btn" onClick={() => navigate("/profile")}>
          Add Weight
        </button>
      </div>
    );
  }

  const min = Math.min(...trend.map((e) => e.weightKg));
  const max = Math.max(...trend.map((e) => e.weightKg));
  const range = Math.max(max - min, 0.5); // avoid a flat 0-height chart when weight barely moves
  const first = trend[0].weightKg;
  const delta = Math.round((last - first) * 10) / 10;
  // Right-align the real entries under their actual weekday, oldest-first.
  const startDow = new Date(`${trend[0].date}T00:00:00`).getDay();

  return (
    <div className="card weight-card">
      <div className="weight-card__header">
        <span className="eyebrow">Bodyweight</span>
        <div className="weight-card__header-right">
          {trend.length > 1 && (
            <span
              className={`weight-card__delta ${delta > 0 ? "weight-card__delta--up" : delta < 0 ? "weight-card__delta--down" : ""}`}
            >
              {delta === 0 ? "No change" : `${delta > 0 ? "+" : ""}${delta} kg this week`}
            </span>
          )}
          <button type="button" className="weight-card__edit" onClick={() => navigate("/profile")} aria-label="Edit weight">
            <PencilIcon width={16} height={16} />
          </button>
        </div>
      </div>
      <div className="weight-card__value">{animatedLast.toFixed(1)} kg</div>

      <div className="weight-card__chart" role="img" aria-label={`Bodyweight over the last ${trend.length} days, ending at ${last} kg`}>
        {trend.map((entry, i) => {
          const heightPct = 18 + ((entry.weightKg - min) / range) * 82;
          const isLast = i === trend.length - 1;
          return (
            <div key={entry.date} className="weight-card__bar-col">
              <div
                className={`weight-card__bar bar-grow ${isLast ? "weight-card__bar--current" : ""}`}
                style={{ height: `${heightPct}%`, animationDelay: `${i * 60}ms` }}
                title={`${entry.weightKg} kg`}
              />
              <span className="weight-card__bar-label">{DAY_LABELS[(startDow + i) % 7]}</span>
            </div>
          );
        })}
      </div>
      {trend.length < 3 && <p className="weight-card__note">Keep logging to build out your weekly trend.</p>}
    </div>
  );
}
