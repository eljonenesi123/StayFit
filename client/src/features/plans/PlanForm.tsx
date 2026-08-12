import { useState } from "react";
import type { DietaryRestriction, ExperienceLevel, Goal, PlanEquipment, PlanRequest } from "./types";
import "./PlanForm.css";

const GOALS: Goal[] = ["Strength", "Weight loss", "Endurance", "Muscle gain", "General fitness", "Mobility"];
const LEVELS: ExperienceLevel[] = ["Beginner", "Intermediate", "Advanced"];
const EQUIPMENT: PlanEquipment[] = ["Bodyweight only", "Dumbbells", "Barbell", "Kettlebell", "Resistance bands", "Full gym"];
const DIETARY: DietaryRestriction[] = ["None", "Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Nut allergy", "Low-carb"];

interface PlanFormProps {
  onSubmit: (request: PlanRequest) => void;
  submitting: boolean;
  initial?: PlanRequest;
}

const DEFAULTS: PlanRequest = {
  goals: ["General fitness"],
  experienceLevel: "Beginner",
  daysPerWeek: 3,
  equipment: ["Bodyweight only"],
  dietaryRestrictions: ["None"],
  wantsWorkoutPlan: true,
  wantsMealPlan: true,
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function PlanForm({ onSubmit, submitting, initial }: PlanFormProps) {
  const [form, setForm] = useState<PlanRequest>(initial ?? DEFAULTS);

  const canSubmit = form.goals.length > 0 && (form.wantsWorkoutPlan || form.wantsMealPlan);

  return (
    <form
      className="plan-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit(form);
      }}
    >
      <div className="field">
        <label>Goals</label>
        <div className="plan-form__chips">
          {GOALS.map((g) => (
            <button
              key={g}
              type="button"
              className="chip"
              data-active={form.goals.includes(g)}
              onClick={() => setForm((f) => ({ ...f, goals: toggle(f.goals, g) }))}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="experience">Experience level</label>
        <select
          id="experience"
          value={form.experienceLevel}
          onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value as ExperienceLevel }))}
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="days">Days per week: {form.daysPerWeek}</label>
        <input
          id="days"
          type="range"
          min={1}
          max={7}
          value={form.daysPerWeek}
          onChange={(e) => setForm((f) => ({ ...f, daysPerWeek: Number(e.target.value) }))}
        />
      </div>

      <div className="field">
        <label>Equipment available</label>
        <div className="plan-form__chips">
          {EQUIPMENT.map((eq) => (
            <button
              key={eq}
              type="button"
              className="chip"
              data-active={form.equipment.includes(eq)}
              onClick={() => setForm((f) => ({ ...f, equipment: toggle(f.equipment, eq) }))}
            >
              {eq}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Dietary restrictions</label>
        <div className="plan-form__chips">
          {DIETARY.map((d) => (
            <button
              key={d}
              type="button"
              className="chip"
              data-active={form.dietaryRestrictions.includes(d)}
              onClick={() => setForm((f) => ({ ...f, dietaryRestrictions: toggle(f.dietaryRestrictions, d) }))}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Include</label>
        <div className="plan-form__toggles">
          <label className="plan-form__toggle">
            <input
              type="checkbox"
              checked={form.wantsWorkoutPlan}
              onChange={(e) => setForm((f) => ({ ...f, wantsWorkoutPlan: e.target.checked }))}
            />
            Workout plan
          </label>
          <label className="plan-form__toggle">
            <input
              type="checkbox"
              checked={form.wantsMealPlan}
              onChange={(e) => setForm((f) => ({ ...f, wantsMealPlan: e.target.checked }))}
            />
            Meal plan
          </label>
        </div>
      </div>

      <button type="submit" className="btn btn-primary plan-form__submit" disabled={!canSubmit || submitting}>
        {submitting ? "Generating…" : "Generate plan"}
      </button>
    </form>
  );
}
