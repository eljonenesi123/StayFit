import { useMemo, useState } from "react";
import type { ActivityLevel, Sex } from "./types";
import { ACTIVITY_LABELS, calculateBmr, calculateTdee, cmToFtIn, ftInToCm, kgToLb, lbToKg } from "./bmr";
import { loadJSON, saveJSON } from "../../lib/storage";
import "./CalculatorTab.css";

type Units = "metric" | "imperial";

interface CalculatorState {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  units: Units;
}

const STORAGE_KEY = "stayfit.calories.calculator";
export const TDEE_STORAGE_KEY = "stayfit.calories.tdeeTarget";

const DEFAULTS: CalculatorState = {
  sex: "female",
  age: 30,
  heightCm: 165,
  weightKg: 65,
  activityLevel: "moderate",
  units: "imperial",
};

export default function CalculatorTab() {
  const [state, setState] = useState<CalculatorState>(() => loadJSON(STORAGE_KEY, DEFAULTS));

  const bmr = useMemo(() => calculateBmr(state), [state]);
  const tdee = useMemo(() => calculateTdee(state), [state]);

  const update = (patch: Partial<CalculatorState>) => {
    const next = { ...state, ...patch };
    setState(next);
    saveJSON(STORAGE_KEY, next);
  };

  const useAsTarget = () => {
    saveJSON(TDEE_STORAGE_KEY, Math.round(tdee));
  };

  const ftIn = cmToFtIn(state.heightCm);

  return (
    <div className="stack">
      <div className="field">
        <label>Units</label>
        <div className="calculator-chip-row">
          <button type="button" className="chip" data-active={state.units === "imperial"} onClick={() => update({ units: "imperial" })}>
            Imperial (lb, ft/in)
          </button>
          <button type="button" className="chip" data-active={state.units === "metric"} onClick={() => update({ units: "metric" })}>
            Metric (kg, cm)
          </button>
        </div>
      </div>

      <div className="field">
        <label>Sex (used by the BMR formula)</label>
        <div className="calculator-chip-row">
          <button type="button" className="chip" data-active={state.sex === "female"} onClick={() => update({ sex: "female" })}>
            Female
          </button>
          <button type="button" className="chip" data-active={state.sex === "male"} onClick={() => update({ sex: "male" })}>
            Male
          </button>
        </div>
      </div>

      <div className="calculator-grid">
        <div className="field">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            inputMode="numeric"
            min={13}
            max={100}
            value={state.age}
            onChange={(e) => update({ age: Number(e.target.value) })}
          />
        </div>

        {state.units === "metric" ? (
          <>
            <div className="field">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                id="weight"
                type="number"
                inputMode="decimal"
                min={0}
                value={Math.round(state.weightKg)}
                onChange={(e) => update({ weightKg: Number(e.target.value) })}
              />
            </div>
            <div className="field">
              <label htmlFor="height">Height (cm)</label>
              <input
                id="height"
                type="number"
                inputMode="decimal"
                min={0}
                value={Math.round(state.heightCm)}
                onChange={(e) => update({ heightCm: Number(e.target.value) })}
              />
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <label htmlFor="weight-lb">Weight (lb)</label>
              <input
                id="weight-lb"
                type="number"
                inputMode="decimal"
                min={0}
                value={Math.round(kgToLb(state.weightKg))}
                onChange={(e) => update({ weightKg: lbToKg(Number(e.target.value)) })}
              />
            </div>
            <div className="field calculator-height-field">
              <label>Height</label>
              <div className="calculator-height-inputs">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  aria-label="Feet"
                  value={ftIn.feet}
                  onChange={(e) => update({ heightCm: ftInToCm(Number(e.target.value), ftIn.inches) })}
                />
                <span>ft</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={11}
                  aria-label="Inches"
                  value={ftIn.inches}
                  onChange={(e) => update({ heightCm: ftInToCm(ftIn.feet, Number(e.target.value)) })}
                />
                <span>in</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="field">
        <label htmlFor="activity">Activity level</label>
        <select
          id="activity"
          value={state.activityLevel}
          onChange={(e) => update({ activityLevel: e.target.value as ActivityLevel })}
        >
          {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="calculator-results">
        <div className="calculator-result">
          <span className="eyebrow">BMR</span>
          <span className="calculator-result__value">{Math.round(bmr)}</span>
          <span className="calculator-result__unit">kcal/day at rest</span>
        </div>
        <div className="calculator-result calculator-result--accent">
          <span className="eyebrow">TDEE</span>
          <span className="calculator-result__value">{Math.round(tdee)}</span>
          <span className="calculator-result__unit">kcal/day maintenance</span>
        </div>
      </div>

      <button type="button" className="btn btn-secondary" onClick={useAsTarget}>
        Use TDEE as today's calorie target
      </button>
    </div>
  );
}
