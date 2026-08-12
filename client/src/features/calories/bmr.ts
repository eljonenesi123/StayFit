import type { ActivityLevel, BmrInput, Sex } from "./types";

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very-active": 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary — little to no exercise",
  light: "Light — exercise 1-3 days/week",
  moderate: "Moderate — exercise 3-5 days/week",
  active: "Active — exercise 6-7 days/week",
  "very-active": "Very active — physical job or 2x/day training",
};

/** Mifflin-St Jeor equation. `sex` is the physiological input the formula was derived for. */
export function calculateBmr({ sex, age, heightCm, weightKg }: Pick<BmrInput, "sex" | "age" | "heightCm" | "weightKg">): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export function calculateTdee(input: BmrInput): number {
  const bmr = calculateBmr(input);
  return bmr * ACTIVITY_MULTIPLIERS[input.activityLevel];
}

export function lbToKg(lb: number): number {
  return lb * 0.453592;
}

export function kgToLb(kg: number): number {
  return kg / 0.453592;
}

export function ftInToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54;
}

export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export type { Sex };
