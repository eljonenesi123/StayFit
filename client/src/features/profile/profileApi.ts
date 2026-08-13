import { supabase } from "../../supabaseClient";
import type { Profile, ProfileFormState } from "./types";
import { resolveHeightCm, resolveWeightKg } from "./units";
import { loadJSON, saveJSON } from "../../lib/storage";

/**
 * AuthContext's mock-auth mode (see USE_MOCK_AUTH) fakes a user id like
 * "mock-<email>" — not a real UUID, and there's no real Supabase session
 * behind it either way, so any real read/write would just fail (invalid
 * UUID, then RLS). Route these to a localStorage-backed mock profile
 * instead of a true no-op — a plain no-op meant profile data entered
 * during mock-auth onboarding/sign-up silently vanished, so the dashboard
 * could never show real BMI/weight even though the user had "entered" it.
 */
function isMockUserId(userId: string): boolean {
  return userId.startsWith("mock-");
}

function mockProfileKey(userId: string): string {
  return `stayfit.mockAuth.profile.${userId}`;
}

/** Null when the user has no profile row yet (e.g. skipped onboarding) — not an error. */
export async function getProfile(userId: string): Promise<Profile | null> {
  if (isMockUserId(userId)) {
    return loadJSON<Profile | null>(mockProfileKey(userId), null);
  }
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
  if (isMockUserId(userId)) {
    saveJSON(mockProfileKey(userId), { ...row, created_at: new Date().toISOString() });
    return;
  }
  const { error } = await supabase.from("profiles").upsert(row, { onConflict: "user_id" });
  if (error) throw new Error(error.message);
}
