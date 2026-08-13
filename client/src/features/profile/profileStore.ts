import { getProfile, saveProfile } from "./profileApi";
import type { Profile, ProfileFormState } from "./types";

/**
 * Tiny external store (React's useSyncExternalStore, see useProfile.ts)
 * so the dashboard's BMI/Bodyweight cards and the Profile screen all read
 * the exact same fetched-once profile row instead of each doing their own
 * independent getProfile() call — a single source of truth for
 * height/weight/age/gender, and a single place a save() invalidates.
 */

interface ProfileState {
  userId: string | null;
  profile: Profile | null;
  loading: boolean;
}

let state: ProfileState = { userId: null, profile: null, loading: true };
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): ProfileState {
  return state;
}

export async function ensureProfileLoaded(userId: string): Promise<void> {
  if (state.userId === userId && !state.loading) return;
  state = { userId, profile: state.userId === userId ? state.profile : null, loading: true };
  emit();
  const profile = await getProfile(userId);
  state = { userId, profile, loading: false };
  emit();
}

export async function saveProfileAndRefresh(userId: string, form: ProfileFormState): Promise<void> {
  await saveProfile(userId, form);
  const profile = await getProfile(userId);
  state = { userId, profile, loading: false };
  emit();
}
