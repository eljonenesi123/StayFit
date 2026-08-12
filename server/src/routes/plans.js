import { Router } from "express";
import { anthropic, isAnthropicConfigured, CLAUDE_MODEL } from "../lib/anthropicClient.js";

/**
 * LIVE (once ANTHROPIC_API_KEY is set): POST /api/generate-plan
 * Body: PlanRequest (see client's features/plans/types.ts)
 * Calls Claude with output_config.format so the response is guaranteed to
 * parse against PLAN_SCHEMA — no wall-of-text parsing on the client.
 */

const router = Router();

const EXERCISE_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    sets: { type: "integer" },
    reps: { type: "string", description: "e.g. '8-12' or '30 sec'" },
    restSeconds: { type: "integer" },
    notes: { type: "string" },
  },
  required: ["name", "sets", "reps", "restSeconds", "notes"],
  additionalProperties: false,
};

const WORKOUT_DAY_SCHEMA = {
  type: "object",
  properties: {
    day: { type: "string", description: "e.g. 'Monday' or 'Day 1'" },
    focus: { type: "string", description: "e.g. 'Upper body strength'" },
    exercises: { type: "array", items: EXERCISE_SCHEMA },
  },
  required: ["day", "focus", "exercises"],
  additionalProperties: false,
};

const MEAL_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", description: "e.g. 'Breakfast'" },
    description: { type: "string" },
    estimatedCalories: { type: "integer" },
  },
  required: ["name", "description", "estimatedCalories"],
  additionalProperties: false,
};

const MEAL_DAY_SCHEMA = {
  type: "object",
  properties: {
    day: { type: "string" },
    meals: { type: "array", items: MEAL_SCHEMA },
  },
  required: ["day", "meals"],
  additionalProperties: false,
};

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string", description: "2-3 sentence overview of the plan and why it fits the stated goals" },
    workoutPlan: {
      anyOf: [
        {
          type: "object",
          properties: {
            daysPerWeek: { type: "integer" },
            days: { type: "array", items: WORKOUT_DAY_SCHEMA },
          },
          required: ["daysPerWeek", "days"],
          additionalProperties: false,
        },
        { type: "null" },
      ],
    },
    mealPlan: {
      anyOf: [
        {
          type: "object",
          properties: {
            dailyCalorieTarget: { type: "integer" },
            days: { type: "array", items: MEAL_DAY_SCHEMA },
          },
          required: ["dailyCalorieTarget", "days"],
          additionalProperties: false,
        },
        { type: "null" },
      ],
    },
  },
  required: ["summary", "workoutPlan", "mealPlan"],
  additionalProperties: false,
};

router.post("/", async (req, res) => {
  if (!isAnthropicConfigured) {
    return res.status(501).json({
      error: "not_configured",
      message: "ANTHROPIC_API_KEY is not set on the server — AI plan generation is a stub until it is.",
    });
  }

  const {
    goals,
    experienceLevel,
    daysPerWeek,
    equipment,
    dietaryRestrictions,
    wantsWorkoutPlan,
    wantsMealPlan,
  } = req.body ?? {};

  if (!goals || !experienceLevel || !daysPerWeek || (!wantsWorkoutPlan && !wantsMealPlan)) {
    return res.status(400).json({
      error: "invalid_request",
      message: "goals, experienceLevel, daysPerWeek, and at least one of wantsWorkoutPlan/wantsMealPlan are required.",
    });
  }

  const userBrief = [
    `Goals: ${Array.isArray(goals) ? goals.join(", ") : goals}`,
    `Experience level: ${experienceLevel}`,
    `Training days per week: ${daysPerWeek}`,
    `Equipment available: ${Array.isArray(equipment) && equipment.length ? equipment.join(", ") : "bodyweight only"}`,
    `Dietary restrictions: ${Array.isArray(dietaryRestrictions) && dietaryRestrictions.length ? dietaryRestrictions.join(", ") : "none"}`,
    `Include a workout plan: ${wantsWorkoutPlan ? "yes" : "no"}`,
    `Include a meal plan: ${wantsMealPlan ? "yes" : "no"}`,
  ].join("\n");

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 8000,
      output_config: {
        effort: "high",
        format: { type: "json_schema", schema: RESPONSE_SCHEMA },
      },
      system:
        "You are a certified strength coach and sports nutritionist generating a personalized plan. " +
        "Be specific and realistic — exact sets/reps/rest, and calorie estimates per meal. " +
        "Only include a workoutPlan or mealPlan when asked for; otherwise set that field to null. " +
        "Respect equipment constraints and dietary restrictions strictly. Scale intensity to the stated experience level.",
      messages: [{ role: "user", content: userBrief }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock) {
      return res.status(502).json({ error: "upstream_error", message: "No text response from the model." });
    }

    const parsed = JSON.parse(textBlock.text);
    return res.json(parsed);
  } catch (err) {
    console.error("generate-plan error:", err);
    return res.status(502).json({ error: "upstream_error", message: "Plan generation failed. Try again." });
  }
});

export default router;
