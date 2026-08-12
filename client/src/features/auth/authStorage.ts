import type { User } from "./types";

/**
 * ⚠️ STUB AUTH — NOT PRODUCTION-SAFE.
 *
 * This entire module is a client-only mock: "accounts" live in this browser's
 * localStorage, and there is no server validating anything. Anyone with dev
 * tools open can read every stored record, and the "password hash" below is
 * a basic, unsalted SHA-256 digest — adequate to avoid storing raw plaintext
 * in the demo, but not a real credential store (no salting strategy, no
 * server-side verification, trivially bypassed by editing localStorage).
 *
 * Before shipping this to real users, replace this module with a real auth
 * provider (e.g. Firebase Auth, Supabase Auth, or your own backend doing
 * password hashing + session issuance server-side). Passwords must never be
 * the client's job to secure — only a server can do that.
 */

const USERS_KEY = "stayfit.auth.users";
const SESSION_KEY = "stayfit.auth.session";
const GUEST_SESSION = "guest";

interface StoredUser extends User {
  passwordHash: string;
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password: string): Promise<string> {
  const encoded = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export async function signUp(email: string, password: string, name: string): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = loadUsers();
  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error("An account with that email already exists.");
  }
  const passwordHash = await hashPassword(password);
  const user: StoredUser = { id: newId(), email: normalizedEmail, name: name.trim(), passwordHash };
  saveUsers([...users, user]);
  localStorage.setItem(SESSION_KEY, user.id);
  return { id: user.id, email: user.email, name: user.name };
}

export async function logIn(email: string, password: string): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const user = loadUsers().find((u) => u.email === normalizedEmail && u.passwordHash === passwordHash);
  if (!user) {
    throw new Error("That email and password don't match an account here.");
  }
  localStorage.setItem(SESSION_KEY, user.id);
  return { id: user.id, email: user.email, name: user.name };
}

/** No account, no persisted data beyond the session flag — just skips the auth gate. */
export function continueAsGuest(): User {
  localStorage.setItem(SESSION_KEY, GUEST_SESSION);
  return { id: GUEST_SESSION, email: "", name: "Guest" };
}

export function logOut(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSessionUser(): User | null {
  const sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) return null;
  if (sessionId === GUEST_SESSION) return { id: GUEST_SESSION, email: "", name: "Guest" };
  const user = loadUsers().find((u) => u.id === sessionId);
  return user ? { id: user.id, email: user.email, name: user.name } : null;
}
