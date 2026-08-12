export type Confidence = "low" | "medium" | "high";

export interface RecognitionResult {
  exerciseName: string;
  description: string;
  formCues: string[];
  confidence: Confidence;
  libraryMatchId: string | null;
}
