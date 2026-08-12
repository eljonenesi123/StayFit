import { supabase } from "../../supabaseClient";
import type { Profile, ProfileFormState } from "./types";
import { resolveHeightCm, resolveWeightKg } from "./units";

/**
 * AuthContext's mock-auth mode (see USE_MOCK_AUTH) fakes a user id like
 * "mock-<email>" — not a real UUID, and there's no real Supabase session
 * behind it either way, so any real read/write would just fail (invalid
 * UUID, then RLS). Short-circuit here instead of surfacing that as a save
 * error and blocking navigation through the onboarding/profile screens.
 */
function isMockUserId(userId: string): boolean {
  return userId.startsWith("mock-");
}

/** Null when the user has no profile row yet (e.g. skipped onboarding) — not an error. */
export async function getProfile(userId: string): Promise<Profile | null> {
  if (isMockUserId(userId)) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function saveProfile(userId: string, form: ProfileFormState): Promise<void> {
  if (isMockUserId(userId)) return;
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
