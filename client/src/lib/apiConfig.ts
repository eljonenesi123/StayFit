/**
 * Base URL of the StayFit backend (server/), which proxies the Anthropic API
 * so no API key ever ships in this client bundle. Configure via
 * VITE_API_BASE_URL in client/.env — safe to expose since it's just a host,
 * not a secret.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787";
