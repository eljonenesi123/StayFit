import type { MacroBreakdown, WeightEntry } from "./types";
import { loadJSON, saveJSON } from "../../lib/storage";

/**
 * PLACEHOLDER DATA — there's no real weight-tracking feature yet (no "log
 * today's weight" UI), so the dashboard's trend card seeds seven days of
 * gently-varying demo weight around a base value the first time it's viewed,
 * then persists that seed so it stays stable across reloads instead of
 * re-randomizing. Replace this with real entries once weight logging exists.
 */

const WEIGHT_STORAGE_KEY = "stayfit.dashboard.weightTrend.placeholder";
const BASE_WEIGHT_KG = 72;

function seedWeightTrend(): WeightEntry[] {
  const entries: WeightEntry[] = [];
  const today = new Date();
  // Deterministic small day-to-day wiggle so the sparkline looks like a real trend, not a flat line.
  const wiggle = [0, -0.2, 0.1, -0.4, -0.1, -0.6, -0.3];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    entries.push({
      date: d.toISOString().slice(0, 10),
      weightKg: Math.round((BASE_WEIGHT_KG + wiggle[6 - i]) * 10) / 10,
    });
  }
  return entries;
}

export function getWeightTrend(): WeightEntry[] {
  const existing = loadJSON<WeightEntry[] | null>(WEIGHT_STORAGE_KEY, null);
  if (existing && existing.length === 7) return existing;
  const seeded = seedWeightTrend();
  saveJSON(WEIGHT_STORAGE_KEY, seeded);
  return seeded;
}

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
