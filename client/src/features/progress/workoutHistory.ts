import { loadJSON, saveJSON } from "../../lib/storage";

export interface WorkoutHistoryEntry {
  id: string;
  /** ISO date, "yyyy-mm-dd" */
  date: string;
  completedAt: number;
  durationSec: number;
  label: string;
}

const KEY_PREFIX = "stayfit.workoutHistory.";

function key(userId: string): string {
  return `${KEY_PREFIX}${userId}`;
}

function todayStr(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function getWorkoutHistory(userId: string): WorkoutHistoryEntry[] {
  return loadJSON<WorkoutHistoryEntry[]>(key(userId), []);
}

/** Called the moment a timer sequence naturally reaches "finished" — see RoundTimerPage.tsx. */
export function logCompletedWorkout(userId: string, entry: { durationSec: number; label: string }): WorkoutHistoryEntry {
  const record: WorkoutHistoryEntry = {
    id: newId(),
    date: todayStr(),
    completedAt: Date.now(),
    durationSec: entry.durationSec,
    label: entry.label,
  };
  const next = [record, ...getWorkoutHistory(userId)].slice(0, 100);
  saveJSON(key(userId), next);
  return record;
}

/** Distinct active dates within the current Mon–Sun week. */
export function getDaysActiveThisWeek(userId: string): number {
  const now = new Date();
  const dow = now.getDay(); // 0=Sun..6=Sat
  const daysSinceMonday = (dow + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysSinceMonday);
  monday.setHours(0, 0, 0, 0);

  const activeDates = new Set(
    getWorkoutHistory(userId)
      .filter((e) => new Date(e.completedAt) >= monday)
      .map((e) => e.date)
  );
  return activeDates.size;
}

/** Consecutive days with a completed workout, ending today or yesterday (a streak isn't broken until a full day is skipped). */
export function getCurrentStreak(userId: string): number {
  const dates = new Set(getWorkoutHistory(userId).map((e) => e.date));
  if (dates.size === 0) return 0;

  const cursor = new Date();
  if (!dates.has(todayStr(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dates.has(todayStr(cursor))) return 0;
  }

  let streak = 0;
  while (dates.has(todayStr(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
