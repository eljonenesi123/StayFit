import mediaData from "../../data/exerciseMedia.json";

/**
 * Populated by scripts/fetchExercises.mjs (run once, locally, against the
 * ExerciseDB RapidAPI). The JSON and the GIFs it points at are static files
 * committed to the repo — nothing here calls RapidAPI or needs a key.
 */
export interface ExerciseMediaEntry {
  sourceName: string;
  bodyPart: string | null;
  target: string | null;
  equipment: string | null;
  secondaryMuscles: string[];
  instructions: string[];
  /** Relative path under client/public, e.g. "exercise-media/push-up.gif". Null if the download failed. */
  gif: string | null;
}

const MEDIA = mediaData as Record<string, ExerciseMediaEntry>;

export function getExerciseMedia(id: string): ExerciseMediaEntry | undefined {
  return MEDIA[id];
}

/** Resolves a relative public/ path against the deployed base path (GitHub Pages project-page subpath). */
export function resolvePublicUrl(relativePath: string): string {
  return `${import.meta.env.BASE_URL}${relativePath}`;
}
