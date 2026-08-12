import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient";

/**
 * TEMPORARY TESTING FLAG. While true, Sign Up and Log In accept any
 * credentials and fake a session (stored in localStorage) instead of
 * calling Supabase — lets you repeat the onboarding flow as many times as
 * you want without hitting Supabase's signup/email rate limits. Every real
 * Supabase call below is untouched, just skipped while this is true.
 *
 * Set back to `false` to restore real signup/login — nothing else needs to
 * change. Continue as Guest and Log Out always use real Supabase, with or
 * without this flag, since guest sign-in was never rate-limit-prone.
 */
const USE_MOCK_AUTH = true;

const MOCK_SESSION_KEY = "stayfit.mockAuth.email";

function buildMockUser(email: string): User {
  return {
    id: `mock-${email.toLowerCase()}`,
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
    email,
    is_anonymous: false,
  };
}

function loadMockUser(): User | null {
  const email = localStorage.getItem(MOCK_SESSION_KEY);
  return email ? buildMockUser(email) : null;
}

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
    const mock = USE_MOCK_AUTH ? loadMockUser() : null;
    if (mock) {
      setUser(mock);
      setLoading(false);
      return;
    }

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
        if (USE_MOCK_AUTH) {
          localStorage.setItem(MOCK_SESSION_KEY, email);
          setUser(buildMockUser(email));
          return;
        }
        // Send the confirmation-email link back to wherever this app is actually
        // running (GitHub Pages or localhost), not Supabase's default Site URL —
        // that default still has to be added to the project's Redirect URLs
        // allow list in the Supabase dashboard, this alone isn't enough.
        const emailRedirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`;
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo } });
        if (error) throw new Error(error.message);
      },
      logIn: async (email, password) => {
        if (USE_MOCK_AUTH) {
          localStorage.setItem(MOCK_SESSION_KEY, email);
          setUser(buildMockUser(email));
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
      },
      continueAsGuest: async () => {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) throw new Error(error.message);
        // Clear any stale mock session so it doesn't shadow the real guest
        // session on the next page load.
        localStorage.removeItem(MOCK_SESSION_KEY);
      },
      logOut: async () => {
        localStorage.removeItem(MOCK_SESSION_KEY);
        await supabase.auth.signOut();
        setUser(null);
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
