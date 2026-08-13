import { useNavigate } from "react-router-dom";
import { getTodayEntries } from "../calories/todayLog";
import { TDEE_STORAGE_KEY } from "../calories/CalculatorTab";
import { loadJSON } from "../../lib/storage";
import { useCountUp } from "../../lib/useCountUp";
import "./TodayCalorieGlance.css";

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DEFAULT_GOAL = 2000;

/** Home's read-only glance at today's calories — editing/logging happens on the Meals tab. */
export default function TodayCalorieGlance() {
  const navigate = useNavigate();
  const entries = getTodayEntries();
  const goal = loadJSON<number | null>(TDEE_STORAGE_KEY, null) ?? DEFAULT_GOAL;
  const eaten = entries.reduce((sum, e) => sum + e.calories, 0);
  const progress = Math.min(1, eaten / goal);
  const offset = CIRCUMFERENCE * (1 - progress);
  const remaining = Math.max(0, goal - eaten);
  const animatedEaten = Math.round(useCountUp(eaten, 600));

  return (
    <button type="button" className="card today-calorie-glance" onClick={() => navigate("/meals")}>
      <div className="today-calorie-glance__info">
        <span className="eyebrow">Calories today</span>
        <p className="today-calorie-glance__remaining">{remaining > 0 ? `${remaining} kcal remaining` : "Goal reached"}</p>
        <span className="today-calorie-glance__hint">Tap to log or adjust →</span>
      </div>
      <div className="today-calorie-glance__ring">
        <svg viewBox="0 0 100 100" className="today-calorie-glance__svg">
          <circle cx="50" cy="50" r={RADIUS} className="today-calorie-glance__track" />
          <circle
            key={offset}
            cx="50"
            cy="50"
            r={RADIUS}
            className="today-calorie-glance__progress gauge-sweep"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ "--gauge-from": CIRCUMFERENCE, "--gauge-to": offset } as React.CSSProperties}
          />
        </svg>
        <div className="today-calorie-glance__center">
          <span className="today-calorie-glance__value">{animatedEaten}</span>
        </div>
      </div>
    </button>
  );
}
