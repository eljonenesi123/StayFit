export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

export function calculateBmi(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

export const BMI_STATUS_TEXT: Record<BmiCategory, string> = {
  underweight: "You are underweight",
  normal: "You have a normal weight",
  overweight: "You are overweight",
  obese: "You are in the obese range",
};
