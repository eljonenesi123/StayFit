import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient";

interface AuthContextValue {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      signUp: async (email, password) => {
        // Send the confirmation-email link back to wherever this app is actually
        // running (GitHub Pages or localhost), not Supabase's default Site URL —
        // that default still has to be added to the project's Redirect URLs
        // allow list in the Supabase dashboard, this alone isn't enough.
        const emailRedirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`;
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo } });
        if (error) throw new Error(error.message);
      },
      logIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
      },
      continueAsGuest: async () => {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) throw new Error(error.message);
      },
      logOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [user]
  );

  if (loading) {
    return <div className="auth-loading">Loading…</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
