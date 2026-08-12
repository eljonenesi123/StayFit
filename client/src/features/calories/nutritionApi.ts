import { API_BASE_URL } from "../../lib/apiConfig";
import { ApiNotConfiguredError } from "../../lib/apiErrors";

export { ApiNotConfiguredError };

export interface NutritionSearchResult {
  id: string;
  name: string;
  caloriesPerServing: number | null;
  servingDescription: string;
}

/**
 * STUB UNTIL USDA_API_KEY IS SET on the server — see server/src/routes/nutrition.js.
 * Throws ApiNotConfiguredError when unset, so the UI can fall back to manual entry.
 */
export async function searchFood(query: string): Promise<NutritionSearchResult[]> {
  const res = await fetch(`${API_BASE_URL}/api/nutrition/search?q=${encodeURIComponent(query)}`);

  if (res.status === 501) {
    const body = await res.json().catch(() => null);
    throw new ApiNotConfiguredError(body?.message ?? "Food lookup isn't connected yet — use manual entry.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Food lookup failed.");
  }
  const body = await res.json();
  return body.results;
}
