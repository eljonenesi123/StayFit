import type { MuscleGroup } from "../exercises/types";

export type WorkoutCategory = "upper" | "lower" | "cardio" | "core" | "full-body";

export const CATEGORY_LABELS: Record<WorkoutCategory, string> = {
  upper: "Upper Body",
  lower: "Lower Body",
  cardio: "Cardio",
  core: "Core",
  "full-body": "Full Body",
};

export const CATEGORIES: WorkoutCategory[] = ["upper", "lower", "cardio", "core", "full-body"];

/** Rolls the exercise library's fine-grained muscle groups up into the 5 workout categories. */
export const MUSCLE_GROUP_TO_CATEGORY: Record<MuscleGroup, WorkoutCategory> = {
  Chest: "upper",
  Back: "upper",
  Shoulders: "upper",
  Arms: "upper",
  Legs: "lower",
  Glutes: "lower",
  Core: "core",
  "Full Body": "full-body",
  Cardio: "cardio",
};
