export type HeightUnit = "cm" | "ftin";
export type WeightUnit = "kg" | "lb";
export type Gender = "female" | "male" | "other";
export type Goal = "lose_weight" | "build_muscle" | "stay_fit" | "improve_endurance";

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

export const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: "lose_weight", label: "Lose weight" },
  { value: "build_muscle", label: "Build muscle" },
  { value: "stay_fit", label: "Stay fit" },
  { value: "improve_endurance", label: "Improve endurance" },
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
