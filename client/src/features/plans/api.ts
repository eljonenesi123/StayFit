import { API_BASE_URL } from "../../lib/apiConfig";
import { ApiNotConfiguredError } from "../../lib/apiErrors";
import type { GeneratedPlan, PlanRequest } from "./types";

export { ApiNotConfiguredError };

/**
 * LIVE once the server has ANTHROPIC_API_KEY set — calls the StayFit backend,
 * which asks Claude for a structured plan. See server/src/routes/plans.js.
 */
export async function generatePlan(request: PlanRequest): Promise<GeneratedPlan> {
  const res = await fetch(`${API_BASE_URL}/api/generate-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (res.status === 501) {
    const body = await res.json().catch(() => null);
    throw new ApiNotConfiguredError(body?.message ?? "Plan generation isn't connected yet.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Couldn't generate a plan. Try again.");
  }
  return res.json();
}
