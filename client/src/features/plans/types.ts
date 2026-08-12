export type Goal = "Strength" | "Weight loss" | "Endurance" | "Muscle gain" | "General fitness" | "Mobility";
export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";
export type PlanEquipment =
  | "Bodyweight only"
  | "Dumbbells"
  | "Barbell"
  | "Kettlebell"
  | "Resistance bands"
  | "Full gym";
export type DietaryRestriction =
  | "None"
  | "Vegetarian"
  | "Vegan"
  | "Gluten-free"
  | "Dairy-free"
  | "Nut allergy"
  | "Low-carb";

export interface PlanRequest {
  goals: Goal[];
  experienceLevel: ExperienceLevel;
  daysPerWeek: number;
  equipment: PlanEquipment[];
  dietaryRestrictions: DietaryRestriction[];
  wantsWorkoutPlan: boolean;
  wantsMealPlan: boolean;
}

export interface PlanExercise {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: PlanExercise[];
}

export interface PlanMeal {
  name: string;
  description: string;
  estimatedCalories: number;
}

export interface MealDay {
  day: string;
  meals: PlanMeal[];
}

export interface GeneratedPlan {
  summary: string;
  workoutPlan: { daysPerWeek: number; days: WorkoutDay[] } | null;
  mealPlan: { dailyCalorieTarget: number; days: MealDay[] } | null;
}

export interface SavedPlan {
  id: string;
  createdAt: number;
  request: PlanRequest;
  plan: GeneratedPlan;
}
