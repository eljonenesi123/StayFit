export type HeightUnit = "cm" | "ftin";
export type WeightUnit = "kg" | "lb";
export type Gender = "female" | "male" | "other";
export type Goal = "build_muscle" | "stay_fit" | "improve_shape" | "endurance";

/** In-progress form state, kept in whichever units the user is currently entering. */
export interface ProfileFormState {
  heightUnit: HeightUnit;
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weightUnit: WeightUnit;
  weight: string;
  age: string;
  gender: Gender | null;
  goal: Goal | null;
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
  { value: "stay_fit", label: "Stay Fit", description: "Keep up a steady, balanced routine." },
  { value: "improve_shape", label: "Improve Shape", description: "Tone up and reshape at your own pace." },
  { value: "endurance", label: "Endurance", description: "Build stamina for longer, harder efforts." },
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
  gender: null,
  goal: null,
};
