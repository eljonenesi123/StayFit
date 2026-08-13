import { useEffect, useSyncExternalStore } from "react";
import { useAuth } from "../auth/AuthContext";
import { ensureProfileLoaded, getSnapshot, subscribe } from "./profileStore";
import type { ProfileFormState } from "./types";
import { saveProfileAndRefresh } from "./profileStore";

/** Shared read access to the single cached profile row — see profileStore.ts. */
export function useProfile() {
  const { user } = useAuth();
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    if (user) void ensureProfileLoaded(user.id);
  }, [user]);

  const isCurrentUser = snapshot.userId === (user?.id ?? null);
  return {
    profile: isCurrentUser ? snapshot.profile : null,
    loading: !user || !isCurrentUser || snapshot.loading,
  };
}

/** Saves through the shared store so every subscriber re-renders with the fresh row. */
export function useSaveProfile() {
  const { user } = useAuth();
  return async (form: ProfileFormState) => {
    if (!user) return;
    await saveProfileAndRefresh(user.id, form);
  };
}
