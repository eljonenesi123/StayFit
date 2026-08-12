import "dotenv/config";
import express from "express";
import cors from "cors";
import recognizeRouter from "./routes/recognize.js";
import plansRouter from "./routes/plans.js";
import nutritionRouter from "./routes/nutrition.js";
import { isAnthropicConfigured } from "./lib/anthropicClient.js";

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
// Photos can be a few MB once base64-encoded; keep this above typical phone-camera JPEG sizes.
app.use(express.json({ limit: "15mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    anthropicConfigured: isAnthropicConfigured,
    usdaConfigured: Boolean(process.env.USDA_API_KEY),
  });
});

app.use("/api/recognize", recognizeRouter);
app.use("/api/generate-plan", plansRouter);
app.use("/api/nutrition", nutritionRouter);

app.listen(PORT, () => {
  console.log(`StayFit server listening on http://localhost:${PORT}`);
  if (!isAnthropicConfigured) {
    console.warn("ANTHROPIC_API_KEY not set — /api/recognize and /api/generate-plan will return 501 stubs.");
  }
  if (!process.env.USDA_API_KEY) {
    console.warn("USDA_API_KEY not set — /api/nutrition/search will return 501 stubs.");
  }
});
