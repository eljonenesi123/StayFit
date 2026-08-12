import Anthropic from "@anthropic-ai/sdk";

/**
 * Single shared Anthropic client. Reads ANTHROPIC_API_KEY from the environment
 * (see .env.example) — never hardcode a key here. LIVE integration: requires
 * a real key to function; without one, routes that use this return a 501
 * so the client can show its stub/fallback UI instead of a raw 500.
 */
export const isAnthropicConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

export const anthropic = isAnthropicConfigured
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export const CLAUDE_MODEL = "claude-opus-5";
