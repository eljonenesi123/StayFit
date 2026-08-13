import type { FoodEntry } from "./types";
import { loadJSON, saveJSON } from "../../lib/storage";

export const LOG_STORAGE_KEY = "stayfit.calories.log";

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function isToday(timestamp: number): boolean {
  const d = new Date(timestamp);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export function getAllEntries(): FoodEntry[] {
  return loadJSON<FoodEntry[]>(LOG_STORAGE_KEY, []);
}

export function getTodayEntries(): FoodEntry[] {
  return getAllEntries()
    .filter((e) => isToday(e.loggedAt))
    .sort((a, b) => b.loggedAt - a.loggedAt);
}

export function getTodayTotal(): number {
  return getTodayEntries().reduce((sum, e) => sum + e.calories, 0);
}

/** Single place that appends+persists a food entry — used by both the dashboard quick-add and the full Food Log tab. */
export function addFoodEntry(name: string, calories: number, servingDescription?: string): FoodEntry | null {
  if (!name.trim() || !Number.isFinite(calories) || calories <= 0) return null;
  const entry: FoodEntry = { id: newId(), name: name.trim(), calories: Math.round(calories), servingDescription, loggedAt: Date.now() };
  saveJSON(LOG_STORAGE_KEY, [entry, ...getAllEntries()]);
  return entry;
}

export function removeFoodEntry(id: string): void {
  saveJSON(
    LOG_STORAGE_KEY,
    getAllEntries().filter((e) => e.id !== id)
  );
}
