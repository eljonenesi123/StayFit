import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { User } from "./types";
import * as authStorage from "./authStorage";

interface AuthContextValue {
  user: User | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  continueAsGuest: () => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** See authStorage.ts — session state backing this is a client-only mock, not real auth. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authStorage.getSessionUser());

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      signUp: async (email, password, name) => {
        setUser(await authStorage.signUp(email, password, name));
      },
      logIn: async (email, password) => {
        setUser(await authStorage.logIn(email, password));
      },
      continueAsGuest: () => {
        setUser(authStorage.continueAsGuest());
      },
      logOut: () => {
        authStorage.logOut();
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
