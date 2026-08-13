import type { MacroBreakdown } from "./types";

/**
 * PLACEHOLDER RATIO SPLIT — the food log only stores total calories per
 * entry, not per-food macros, so this derives grams from a fixed 30/40/30
 * protein/carbs/fat split of whatever was actually logged today. Swap for
 * real per-food macro data once the nutrition source provides it.
 */
export function estimateMacros(totalCalories: number): MacroBreakdown {
  return {
    proteinG: Math.round((totalCalories * 0.3) / 4),
    carbsG: Math.round((totalCalories * 0.4) / 4),
    fatG: Math.round((totalCalories * 0.3) / 9),
  };
}
