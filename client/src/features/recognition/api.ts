import { API_BASE_URL } from "../../lib/apiConfig";
import { ApiNotConfiguredError } from "../../lib/apiErrors";
import type { RecognitionResult } from "./types";

export { ApiNotConfiguredError };

interface RecognizeParams {
  mediaType: string;
  data: string; // base64, no data: prefix
  libraryExercises: { id: string; name: string }[];
}

/**
 * LIVE once the server has ANTHROPIC_API_KEY set — calls the StayFit backend,
 * which forwards the image to Claude's vision API. See server/src/routes/recognize.js.
 */
export async function recognizeExercise({ mediaType, data, libraryExercises }: RecognizeParams): Promise<RecognitionResult> {
  const res = await fetch(`${API_BASE_URL}/api/recognize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mediaType, data, libraryExercises }),
  });

  if (res.status === 501) {
    const body = await res.json().catch(() => null);
    throw new ApiNotConfiguredError(body?.message ?? "Exercise recognition isn't connected yet.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Couldn't identify that exercise. Try a clearer photo.");
  }
  return res.json();
}
