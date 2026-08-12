export type SegmentType = "work" | "rest";

export interface Segment {
  id: string;
  type: SegmentType;
  /** Duration in whole seconds — kept as seconds (not ms) since it's user-edited minutes:seconds. */
  durationSec: number;
  /** Optional custom label, e.g. "Sprint" or "Water break". Defaults to "Work"/"Rest" in the UI. */
  label?: string;
}

export type TimerStatus = "idle" | "running" | "paused" | "finished";

export interface SavedSequence {
  id: string;
  name: string;
  segments: Segment[];
  updatedAt: number;
}
