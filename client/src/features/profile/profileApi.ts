import { supabase } from "../../supabaseClient";
import type { Profile, ProfileFormState } from "./types";
import { resolveHeightCm, resolveWeightKg } from "./units";

/** Null when the user has no profile row yet (e.g. skipped onboarding) — not an error. */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function saveProfile(userId: string, form: ProfileFormState): Promise<void> {
  const row = {
    user_id: userId,
    height: resolveHeightCm(form),
    weight: resolveWeightKg(form),
    age: form.age.trim() ? Number(form.age) : null,
    gender: form.gender,
    goal: form.goal,
  };
  const { error } = await supabase.from("profiles").upsert(row, { onConflict: "user_id" });
  if (error) throw new Error(error.message);
}
