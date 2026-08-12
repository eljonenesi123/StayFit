export interface WeightEntry {
  /** ISO date, "yyyy-mm-dd" */
  date: string;
  weightKg: number;
}

export interface MacroBreakdown {
  proteinG: number;
  carbsG: number;
  fatG: number;
}
