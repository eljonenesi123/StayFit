import { useNavigate } from "react-router-dom";
import { useProfile } from "../profile/useProfile";
import { calculateBmi, getBmiCategory, BMI_STATUS_TEXT } from "./bmi";
import { useCountUp } from "../../lib/useCountUp";
import "./BmiCard.css";

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// Typical displayed BMI span for the gauge fill — values outside it just
// clamp to a nearly-empty/nearly-full ring instead of over/underflowing.
const DISPLAY_MIN = 15;
const DISPLAY_MAX = 35;

export default function BmiCard() {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();

  const heightCm = profile?.height ?? null;
  const weightKg = profile?.weight ?? null;
  const hasData = heightCm != null && weightKg != null;
  const bmi = hasData ? calculateBmi(heightCm, weightKg) : 0;
  const animatedBmi = useCountUp(bmi, 600, hasData);

  if (loading) {
    return <div className="card bmi-card bmi-card--loading skeleton" aria-hidden="true" />;
  }

  if (!hasData) {
    return (
      <div className="card bmi-card bmi-card--empty">
        <span className="eyebrow bmi-card__eyebrow">BMI (Body Mass Index)</span>
        <p className="bmi-card__empty-text">Add your height and weight to see your BMI.</p>
        <button type="button" className="bmi-card__cta" onClick={() => navigate("/profile")}>
          Complete Profile
        </button>
      </div>
    );
  }

  const category = getBmiCategory(bmi);
  const statusText = BMI_STATUS_TEXT[category];
  const progress = Math.min(0.96, Math.max(0.04, (bmi - DISPLAY_MIN) / (DISPLAY_MAX - DISPLAY_MIN)));
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="card bmi-card bmi-card--filled">
      <div className="bmi-card__info">
        <span className="eyebrow bmi-card__eyebrow">BMI (Body Mass Index)</span>
        <p className="bmi-card__status">{statusText}</p>
        <button type="button" className="bmi-card__cta" onClick={() => navigate("/profile")}>
          View More
        </button>
      </div>

      <div className="bmi-card__gauge" role="img" aria-label={`BMI ${bmi.toFixed(1)}, ${statusText.toLowerCase()}`}>
        <svg viewBox="0 0 100 100" className="bmi-card__gauge-svg">
          <circle cx="50" cy="50" r={RADIUS} className="bmi-card__gauge-track" />
          <circle
            key={offset}
            cx="50"
            cy="50"
            r={RADIUS}
            className="bmi-card__gauge-progress gauge-sweep"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ "--gauge-from": CIRCUMFERENCE, "--gauge-to": offset } as React.CSSProperties}
          />
        </svg>
        <div className="bmi-card__gauge-center">
          <span className="bmi-card__gauge-value">{animatedBmi.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
