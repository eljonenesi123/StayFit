import type { Segment } from "../timer/types";
import { CATEGORY_LABELS, type WorkoutCategory } from "./categories";

/**
 * Fixed day-of-week rotation — no plan/schedule data model exists yet, and
 * the AI plan generator depends on a paid API that isn't live on the
 * deployed site, so this is deliberately simple and always available
 * rather than personalized. Date.getDay(): 0=Sun..6=Sat.
 */
const ROTATION: Record<number, WorkoutCategory | "rest"> = {
  0: "rest",
  1: "upper",
  2: "lower",
  3: "cardio",
  4: "full-body",
  5: "core",
  6: "cardio",
};

export function getTodaysCategory(date: Date = new Date()): WorkoutCategory | "rest" {
  return ROTATION[date.getDay()];
}

export function getTodaysLabel(date: Date = new Date()): string {
  const cat = getTodaysCategory(date);
  return cat === "rest" ? "Rest day" : CATEGORY_LABELS[cat];
}

const ROUND_COUNT = 15;
const WORK_SEC = 60;
const REST_SEC = 20;

/** A generic 20-minute interval sequence — the timer has no concept of specific exercises, so every category shares this same structure. */
export function getDefaultWorkoutSequence(): Segment[] {
  const segments: Segment[] = [];
  for (let i = 0; i < ROUND_COUNT; i++) {
    segments.push({ id: `work-${i}`, type: "work", durationSec: WORK_SEC });
    segments.push({ id: `rest-${i}`, type: "rest", durationSec: REST_SEC });
  }
  return segments;
}
