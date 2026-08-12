export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Arms"
  | "Legs"
  | "Glutes"
  | "Core"
  | "Full Body"
  | "Cardio";

export type Equipment =
  | "Bodyweight"
  | "Dumbbells"
  | "Barbell"
  | "Kettlebell"
  | "Resistance Band"
  | "Machine"
  | "Pull-up Bar"
  | "Bench";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment[];
  difficulty: Difficulty;
  description: string;
  /**
   * The video source is intentionally just a URL string so it's trivial to
   * swap the provider later (self-hosted file, Vimeo, a stock exercise-video
   * API, etc.) without touching the data model or UI.
   *
   * Two shapes are supported by resolveEmbedUrl() in youtube.ts:
   *  - a normal YouTube watch/share URL ("https://www.youtube.com/watch?v=...")
   *  - a "search:<query>" pseudo-URL, used as a placeholder below since this
   *    project doesn't yet have curated per-exercise video IDs — see the
   *    STUB note in data.ts.
   */
  videoUrl: string;
}
