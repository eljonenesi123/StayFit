import { useMemo } from "react";
import { getTodayTotal } from "../calories/todayLog";
import { TDEE_STORAGE_KEY } from "../calories/CalculatorTab";
import { loadJSON } from "../../lib/storage";
import { estimateMacros } from "./placeholderData";
import { MACRO_COLORS } from "./macroPalette";
import "./CalorieRing.css";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DEFAULT_GOAL = 2000;

export default function CalorieRing() {
  const eaten = useMemo(() => getTodayTotal(), []);
  const goal = loadJSON<number | null>(TDEE_STORAGE_KEY, null) ?? DEFAULT_GOAL;
  const macros = useMemo(() => estimateMacros(eaten), [eaten]);

  const progress = Math.min(1, eaten / goal);
  const offset = CIRCUMFERENCE * (1 - progress);
  const remaining = Math.max(0, goal - eaten);

  return (
    <div className="card calorie-ring-card">
      <div className="calorie-ring-card__top">
        <span className="eyebrow">Calories today</span>
      </div>

      <div className="calorie-ring">
        <svg viewBox="0 0 120 120" className="calorie-ring__svg">
          <circle cx="60" cy="60" r={RADIUS} className="calorie-ring__track" />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            className="calorie-ring__progress"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="calorie-ring__center">
          <span className="calorie-ring__value">{eaten}</span>
          <span className="calorie-ring__unit">of {goal} kcal</span>
        </div>
      </div>
      <p className="calorie-ring__remaining">
        {remaining > 0 ? `${remaining} kcal remaining` : "Goal reached"}
        {!loadJSON(TDEE_STORAGE_KEY, null) && " · using a default estimate — set yours in Calories → Calculator"}
      </p>

      <div className="macro-breakdown">
        <MacroRow label="Protein" grams={macros.proteinG} color={MACRO_COLORS.protein} />
        <MacroRow label="Carbs" grams={macros.carbsG} color={MACRO_COLORS.carbs} />
        <MacroRow label="Fat" grams={macros.fatG} color={MACRO_COLORS.fat} />
      </div>
      <p className="calorie-ring__note">Macro split is an estimate — per-food macros aren't tracked yet.</p>
    </div>
  );
}

function MacroRow({ label, grams, color }: { label: string; grams: number; color: string }) {
  return (
    <div className="macro-row">
      <span className="macro-row__swatch" style={{ background: color }} aria-hidden="true" />
      <span className="macro-row__label">{label}</span>
      <span className="macro-row__value">{grams}g</span>
    </div>
  );
}
