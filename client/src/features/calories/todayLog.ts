import type { FoodEntry } from "./types";
import { loadJSON } from "../../lib/storage";

export const LOG_STORAGE_KEY = "stayfit.calories.log";

export function isToday(timestamp: number): boolean {
  const d = new Date(timestamp);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export function getTodayEntries(): FoodEntry[] {
  const entries = loadJSON<FoodEntry[]>(LOG_STORAGE_KEY, []);
  return entries.filter((e) => isToday(e.loggedAt)).sort((a, b) => b.loggedAt - a.loggedAt);
}

export function getTodayTotal(): number {
  return getTodayEntries().reduce((sum, e) => sum + e.calories, 0);
}
