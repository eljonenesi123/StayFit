import { Router } from "express";
import { anthropic, isAnthropicConfigured, CLAUDE_MODEL } from "../lib/anthropicClient.js";

/**
 * LIVE (once ANTHROPIC_API_KEY is set): POST /api/recognize
 * Body: { mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif", data: "<base64>", libraryExercises: [{id, name}] }
 * Identifies the exercise in a photo/video-frame via Claude vision and returns
 * structured guidance. This IDENTIFIES an exercise and gives generic guidance —
 * it does not generate video, and it is not a substitute for professional coaching.
 */

const router = Router();

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    exerciseName: { type: "string", description: "Best-guess name of the exercise being performed" },
    description: { type: "string", description: "1-2 sentence description of the movement" },
    formCues: {
      type: "array",
      items: { type: "string" },
      description: "3-5 short, actionable form/safety cues",
    },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    libraryMatchId: {
      anyOf: [{ type: "string" }, { type: "null" }],
      description: "id from the provided library list if it clearly matches, else null",
    },
  },
  required: ["exerciseName", "description", "formCues", "confidence", "libraryMatchId"],
  additionalProperties: false,
};

const ALLOWED_MEDIA_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

router.post("/", async (req, res) => {
  if (!isAnthropicConfigured) {
    return res.status(501).json({
      error: "not_configured",
      message: "ANTHROPIC_API_KEY is not set on the server — exercise recognition is a stub until it is.",
    });
  }

  const { mediaType, data, libraryExercises } = req.body ?? {};
  if (!mediaType || !data || !ALLOWED_MEDIA_TYPES.has(mediaType)) {
    return res.status(400).json({ error: "invalid_request", message: "Expected { mediaType, data } with a supported image type." });
  }

  const libraryList = Array.isArray(libraryExercises)
    ? libraryExercises.map((e) => `- ${e.id}: ${e.name}`).join("\n")
    : "";

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: RESPONSE_SCHEMA },
      },
      system:
        "You are a fitness form expert identifying an exercise from a single photo or video frame. " +
        "Be specific about the exercise name and give safe, generic form cues. " +
        "If the image doesn't clearly show a recognizable exercise, say so honestly in the description and use confidence 'low'.",
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data } },
            {
              type: "text",
              text:
                "Identify the exercise being performed in this image.\n\n" +
                (libraryList
                  ? `If it clearly matches one of these library exercises, set libraryMatchId to that id:\n${libraryList}`
                  : "No exercise library was provided, so libraryMatchId should be null."),
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock) {
      return res.status(502).json({ error: "upstream_error", message: "No text response from the model." });
    }

    const parsed = JSON.parse(textBlock.text);
    return res.json(parsed);
  } catch (err) {
    console.error("recognize error:", err);
    return res.status(502).json({ error: "upstream_error", message: "Exercise recognition failed. Try again." });
  }
});

export default router;
