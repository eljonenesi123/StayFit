import { Router } from "express";

/**
 * STUB UNTIL USDA_API_KEY IS SET: GET /api/nutrition/search?q=banana
 * Proxies USDA FoodData Central (free, sign up at https://fdc.nal.usda.gov/api-key-signup)
 * so the key never reaches the client. Without a key, returns 501 and the
 * client falls back to manual calorie entry — see features/calories/nutritionApi.ts.
 */

const router = Router();

const USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

router.get("/search", async (req, res) => {
  const apiKey = process.env.USDA_API_KEY;
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (!apiKey) {
    return res.status(501).json({
      error: "not_configured",
      message: "USDA_API_KEY is not set on the server — food lookup is a stub. Use manual entry instead.",
    });
  }
  if (!query) {
    return res.status(400).json({ error: "invalid_request", message: "Query param 'q' is required." });
  }

  try {
    const url = new URL(USDA_SEARCH_URL);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("query", query);
    url.searchParams.set("pageSize", "10");
    url.searchParams.set("dataType", "Branded,Foundation,SR Legacy");

    const usdaRes = await fetch(url);
    if (!usdaRes.ok) {
      return res.status(502).json({ error: "upstream_error", message: "USDA lookup failed." });
    }
    const data = await usdaRes.json();

    const results = (data.foods ?? []).map((food) => {
      const energy = (food.foodNutrients ?? []).find(
        (n) => n.nutrientName === "Energy" && n.unitName === "KCAL"
      );
      return {
        id: String(food.fdcId),
        name: food.description,
        caloriesPerServing: energy ? Math.round(energy.value) : null,
        servingDescription: food.servingSize
          ? `${food.servingSize}${food.servingSizeUnit ?? ""}`
          : "per 100g",
      };
    });

    return res.json({ results });
  } catch (err) {
    console.error("nutrition search error:", err);
    return res.status(502).json({ error: "upstream_error", message: "Food lookup failed. Try manual entry." });
  }
});

export default router;
