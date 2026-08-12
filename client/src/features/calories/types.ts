export type Sex = "male" | "female";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very-active";

export interface BmrInput {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  servingDescription?: string;
  loggedAt: number;
}
