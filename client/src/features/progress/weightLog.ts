import { loadJSON, saveJSON } from "../../lib/storage";

export interface WeightLogEntry {
  /** ISO date, "yyyy-mm-dd" */
  date: string;
  weightKg: number;
}

const KEY_PREFIX = "stayfit.weightLog.";
const MILESTONE_STEP_KG = 5;

function key(userId: string): string {
  return `${KEY_PREFIX}${userId}`;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getWeightLog(userId: string): WeightLogEntry[] {
  return loadJSON<WeightLogEntry[]>(key(userId), []);
}

export function getRecentTrend(userId: string, days = 7): WeightLogEntry[] {
  return getWeightLog(userId).slice(-days);
}

/**
 * Records today's weight (updating today's entry if one already exists).
 * The very first entry becomes the baseline for milestone detection —
 * `milestoneHit` is true only when this save just crossed a new 5kg-from-
 * baseline threshold that wasn't already crossed before this save, so a
 * repeat save at the same weight (or the very first-ever entry) never
 * falsely fires a celebration.
 */
export function logWeight(userId: string, weightKg: number): { log: WeightLogEntry[]; milestoneHit: boolean } {
  const log = getWeightLog(userId);
  const baseline = log[0]?.weightKg ?? weightKg;
  const previousChange = log.length > 0 ? Math.abs(log[log.length - 1].weightKg - baseline) : 0;

  const today = todayStr();
  const idx = log.findIndex((e) => e.date === today);
  const next = idx >= 0 ? [...log] : [...log, { date: today, weightKg }];
  if (idx >= 0) next[idx] = { date: today, weightKg };
  const trimmed = next.slice(-30);
  saveJSON(key(userId), trimmed);

  const newChange = Math.abs(weightKg - baseline);
  const milestoneHit = log.length > 0 && Math.floor(newChange / MILESTONE_STEP_KG) > Math.floor(previousChange / MILESTONE_STEP_KG);

  return { log: trimmed, milestoneHit };
}
