import { useEffect, useRef, useState } from "react";
import { getTodayEntries, addFoodEntry } from "../calories/todayLog";
import { TDEE_STORAGE_KEY } from "../calories/CalculatorTab";
import { loadJSON, saveJSON } from "../../lib/storage";
import { estimateMacros } from "./placeholderData";
import { MACRO_COLORS } from "./macroPalette";
import { useCountUp } from "../../lib/useCountUp";
import { PencilIcon, PlusIcon, CheckIcon } from "../../components/icons";
import LottieBurst from "../../components/LottieBurst";
import successCheckAnim from "../../assets/lottie/success-check.json";
import goalConfettiAnim from "../../assets/lottie/goal-confetti.json";
import "./CalorieRing.css";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DEFAULT_GOAL = 2000;

interface CalorieRingProps {
  /** FoodLogTab already provides full search+manual entry right below this on the Meals page, so its own mini quick-add form is redundant there. */
  showQuickAdd?: boolean;
}

export default function CalorieRing({ showQuickAdd = true }: CalorieRingProps) {
  const [entries, setEntries] = useState(() => getTodayEntries());
  const [goal, setGoal] = useState<number>(() => loadJSON<number | null>(TDEE_STORAGE_KEY, null) ?? DEFAULT_GOAL);
  const [hasCustomGoal, setHasCustomGoal] = useState<boolean>(() => loadJSON(TDEE_STORAGE_KEY, null) != null);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState(String(goal));
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  const [successKey, setSuccessKey] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);
  const prevRemainingRef = useRef<number | null>(null);

  const eaten = entries.reduce((sum, e) => sum + e.calories, 0);
  const macros = estimateMacros(eaten);
  const progress = Math.min(1, eaten / goal);
  const offset = CIRCUMFERENCE * (1 - progress);
  const remaining = Math.max(0, goal - eaten);
  const animatedEaten = Math.round(useCountUp(eaten, 600));

  // Fire the confetti once per crossing into "goal reached" — not on every
  // render, and not just because a previous session already hit the goal.
  useEffect(() => {
    const currentRemaining = goal - eaten;
    if (prevRemainingRef.current !== null && prevRemainingRef.current > 0 && currentRemaining <= 0) {
      setConfettiKey((k) => k + 1);
    }
    prevRemainingRef.current = currentRemaining;
  }, [eaten, goal]);

  const saveGoal = () => {
    const value = Number(goalDraft);
    if (!Number.isFinite(value) || value <= 0) return;
    const rounded = Math.round(value);
    saveJSON(TDEE_STORAGE_KEY, rounded);
    setGoal(rounded);
    setHasCustomGoal(true);
    setEditingGoal(false);
  };

  const handleAdd = () => {
    const entry = addFoodEntry(foodName, Number(foodCalories));
    if (!entry) return;
    setEntries(getTodayEntries());
    setFoodName("");
    setFoodCalories("");
    setSuccessKey((k) => k + 1);
  };

  const isEmpty = entries.length === 0;

  return (
    <div className="card calorie-ring-card">
      <LottieBurst playKey={successKey} animationData={successCheckAnim} size={72} />
      <LottieBurst playKey={confettiKey} animationData={goalConfettiAnim} size={220} />

      <div className="calorie-ring-card__top">
        <span className="eyebrow">Calories today</span>
        <button
          type="button"
          className="calorie-ring-card__goal-edit"
          onClick={() => {
            setGoalDraft(String(goal));
            setEditingGoal((v) => !v);
          }}
          aria-label="Edit calorie goal"
        >
          <PencilIcon width={16} height={16} />
        </button>
      </div>

      {editingGoal && (
        <div className="calorie-ring-card__goal-form">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={goalDraft}
            onChange={(e) => setGoalDraft(e.target.value)}
            aria-label="Daily calorie goal"
          />
          <button type="button" className="btn btn-primary btn-icon" onClick={saveGoal} aria-label="Save goal">
            <CheckIcon width={18} height={18} />
          </button>
        </div>
      )}

      {isEmpty ? (
        <div className="calorie-ring-card__empty">
          <p className="calorie-ring-card__empty-text">Nothing logged yet today.</p>
          <p className="calorie-ring-card__empty-goal">Goal: {goal} kcal</p>
        </div>
      ) : (
        <>
          <div className="calorie-ring">
            <svg viewBox="0 0 120 120" className="calorie-ring__svg">
              <circle cx="60" cy="60" r={RADIUS} className="calorie-ring__track" />
              <circle
                key={offset}
                cx="60"
                cy="60"
                r={RADIUS}
                className="calorie-ring__progress gauge-sweep"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                style={{ "--gauge-from": CIRCUMFERENCE, "--gauge-to": offset } as React.CSSProperties}
              />
            </svg>
            <div className="calorie-ring__center">
              <span className="calorie-ring__value">{animatedEaten}</span>
              <span className="calorie-ring__unit">of {goal} kcal</span>
            </div>
          </div>
          <p className="calorie-ring__remaining">
            {remaining > 0 ? `${remaining} kcal remaining` : "Goal reached"}
            {!hasCustomGoal && " · using a default estimate — set yours above or in the Calculator tab"}
          </p>

          <div className="macro-breakdown">
            <MacroRow label="Protein" grams={macros.proteinG} color={MACRO_COLORS.protein} />
            <MacroRow label="Carbs" grams={macros.carbsG} color={MACRO_COLORS.carbs} />
            <MacroRow label="Fat" grams={macros.fatG} color={MACRO_COLORS.fat} />
          </div>
          <p className="calorie-ring__note">Macro split is an estimate — per-food macros aren't tracked yet.</p>
        </>
      )}

      {showQuickAdd &&
        (quickAddOpen ? (
          <div className="calorie-ring-card__quick-add">
            <input
              type="text"
              placeholder="Food name"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              aria-label="Food name"
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="kcal"
              value={foodCalories}
              onChange={(e) => setFoodCalories(e.target.value)}
              aria-label="Calories"
              className="calorie-ring-card__quick-add-cal"
            />
            <button type="button" className="btn btn-primary btn-icon" onClick={handleAdd} aria-label="Add food">
              <PlusIcon width={18} height={18} />
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-secondary calorie-ring-card__log-btn" onClick={() => setQuickAddOpen(true)}>
            Log food
          </button>
        ))}
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
