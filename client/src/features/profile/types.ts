export type HeightUnit = "cm" | "ftin";
export type WeightUnit = "kg" | "lb";
export type Gender = "female" | "male" | "other";
export type Goal = "build_muscle" | "lose_weight" | "improve_shape" | "stay_fit" | "endurance" | "flexibility";

/** In-progress form state, kept in whichever units the user is currently entering. */
export interface ProfileFormState {
  heightUnit: HeightUnit;
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weightUnit: WeightUnit;
  weight: string;
  age: string;
  /** Onboarding collects a date instead of a raw age — kept here (not derived-only) so it survives step back/forward navigation. Converted to `age` on change; never sent to Supabase itself (no matching column). */
  dateOfBirth: string;
  gender: Gender | null;
  /** Single-select — used by the standalone ProfilePage edit form and by profileApi (the Supabase "profiles" table only has one `goal text` column). */
  goal: Goal | null;
  /** Multi-select — used by the onboarding goal carousel only. Kept in sync with `goal` (set to `goals[0] ?? null`) so saving still writes something to that one column without needing a schema change. */
  goals: Goal[];
}

/** Row shape in the Supabase "profiles" table — always normalized to cm/kg. */
export interface Profile {
  user_id: string;
  height: number | null;
  weight: number | null;
  age: number | null;
  gender: Gender | null;
  goal: Goal | null;
  created_at: string;
}

export const GOAL_OPTIONS: { value: Goal; label: string; description: string }[] = [
  { value: "build_muscle", label: "Build Muscle", description: "Gain strength and size with focused training." },
  { value: "lose_weight", label: "Lose Weight", description: "Burn fat and build sustainable habits." },
  { value: "improve_shape", label: "Improve Shape", description: "Tone up and build a leaner physique." },
  { value: "stay_fit", label: "Stay Fit", description: "Keep up a steady, balanced routine." },
  { value: "endurance", label: "Endurance", description: "Build stamina for longer, harder sessions." },
  { value: "flexibility", label: "Flexibility", description: "Improve mobility and reduce stiffness." },
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other / prefer not to say" },
];

export const EMPTY_PROFILE_FORM: ProfileFormState = {
  heightUnit: "cm",
  heightCm: "",
  heightFt: "",
  heightIn: "",
  weightUnit: "kg",
  weight: "",
  age: "",
  dateOfBirth: "",
  gender: null,
  goal: null,
  goals: [],
};
