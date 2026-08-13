#!/usr/bin/env node
/**
 * One-off script: fetch exercise data + demo GIFs from the ExerciseDB API
 * (RapidAPI) and save them as static files in the repo, so the deployed
 * client (GitHub Pages, no backend) never talks to RapidAPI or holds a key.
 *
 * Run once locally:
 *   1. cp scripts/.env.example scripts/.env   (then paste your key into it)
 *   2. node scripts/fetchExercises.mjs
 *
 * Output:
 *   - client/src/data/exerciseMedia.json   (matched metadata, committed to git)
 *   - client/public/exercise-media/*.gif   (downloaded demo GIFs, committed to git)
 *
 * How matching works (rewritten after the first run matched 0/26 — see
 * below): this RapidAPI listing's /exercises endpoint ignores any `limit`
 * you pass and always returns exactly 10 items from its full catalog in ID
 * order, so paging through it to build one big list to fuzzy-match against
 * would take 100+ requests and mostly return irrelevant items per page.
 * Instead, for each of our exercises we hit the catalog's own
 * /exercises/name/<query> search endpoint with a handful of keyword
 * variants (equipment words like "barbell"/"dumbbell" stripped out, then
 * progressively shorter word combinations), pool the results, and locally
 * pick the best-scoring candidate against the *full* original name
 * (equipment words included this time, so "barbell squat" still prefers a
 * barbell variant over a dumbbell one). This also revealed the catalog's
 * exercise objects have no gifUrl field at all — the actual GIF comes from
 * a separate /image?exerciseId=<id>&resolution=<n> endpoint, downloaded
 * per matched exercise below.
 *
 * Re-runs are cheap: every /exercises/name/<query> response is cached in
 * scripts/.cache/name-searches/ (gitignored) and already-downloaded GIFs
 * are skipped, so fixing one mapping and re-running doesn't re-spend your
 * free-tier quota on the rest. Pass --refresh to force fresh API calls, or
 * --force to re-download GIFs too.
 */

import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CLIENT_DIR = path.join(REPO_ROOT, "client");

const ENV_PATH = path.join(__dirname, ".env");
const EXERCISE_IDS_PATH = path.join(__dirname, "exercise-ids.json");
const CACHE_DIR = path.join(__dirname, ".cache");
const SEARCH_CACHE_DIR = path.join(CACHE_DIR, "name-searches");
const GIF_DIR = path.join(CLIENT_DIR, "public", "exercise-media");
const OUTPUT_JSON_PATH = path.join(CLIENT_DIR, "src", "data", "exerciseMedia.json");

const REFRESH = process.argv.includes("--refresh");
const FORCE = process.argv.includes("--force");
const IMAGE_RESOLUTION = process.env.RAPIDAPI_IMAGE_RESOLUTION || "180";

// --- tiny .env loader (no dependency; KEY=VALUE per line, # comments, optional quotes) ---
async function loadEnv(filePath) {
  let text;
  try {
    text = await readFile(filePath, "utf8");
  } catch {
    console.error(`No env file at ${filePath}.`);
    console.error(`Copy scripts/.env.example to scripts/.env and paste your RapidAPI key into RAPIDAPI_KEY.`);
    process.exit(1);
  }
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function normalize(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

// Equipment words stripped when building a *search* query (kept in the name
// used for local scoring, so a barbell vs. dumbbell variant still matters there).
// Deliberately NOT stripping "band" — ExerciseDB's own catalog names resistance-band
// exercises with "band" in them (e.g. "band row"), so keeping it narrows the search
// instead of widening it into unrelated barbell/cable rows.
const EQUIPMENT_PHRASES = ["pull up bar", "pull-up bar"];
const EQUIPMENT_WORDS = new Set([
  "barbell",
  "dumbbell",
  "kettlebell",
  "bodyweight",
  "machine",
  "bench",
  "cable",
  "resistance",
]);

function stripEquipment(normalizedName) {
  let s = normalizedName;
  for (const phrase of EQUIPMENT_PHRASES) s = s.replace(phrase, " ");
  const words = s.split(" ").filter((w) => w && !EQUIPMENT_WORDS.has(w));
  return words.join(" ").trim();
}

/** Light singularization so "dips"/"dip", "squats"/"squat" etc. count as the same token. */
function stem(word) {
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1);
  }
  return word;
}

/** Builds a short list of search-query variants, broadest/most-specific first. */
function buildQueries(ourName) {
  const full = normalize(ourName);
  const stripped = stripEquipment(full);
  const base = stripped || full; // e.g. "Pull-Up" strips to "" -> falls back to "pull up"

  const queries = [base];
  const words = base.split(" ").filter(Boolean);
  if (words.length > 2) queries.push(words.slice(-2).join(" "));

  const byLength = [...words].sort((a, b) => b.length - a.length);
  for (const w of byLength) {
    if (w.length >= 3) queries.push(w);
  }

  return [...new Set(queries)].slice(0, 4);
}

function scoreMatch(ourFullName, candidateName) {
  const a = normalize(ourFullName);
  const b = normalize(candidateName);
  if (a === b) return 1;
  const aTokens = new Set(a.split(" ").map(stem));
  const bTokens = new Set(b.split(" ").map(stem));
  let intersection = 0;
  for (const t of aTokens) if (bTokens.has(t)) intersection++;
  const union = new Set([...aTokens, ...bTokens]).size;
  let score = union === 0 ? 0 : intersection / union;
  if (a.includes(b) || b.includes(a)) score += 0.15;
  return Math.min(score, 1);
}

// Below this, the pool (already keyword-filtered by the API) still didn't
// produce anything confident enough to show as this exercise's demo — better
// to fall back to the existing icon/YouTube-search UI than show a misleading GIF.
const MATCH_THRESHOLD = 0.3;

function slugifyQuery(q) {
  return q.replace(/[^a-z0-9]+/g, "-");
}

async function searchByName(query, host, key) {
  await mkdir(SEARCH_CACHE_DIR, { recursive: true });
  const cachePath = path.join(SEARCH_CACHE_DIR, `${slugifyQuery(query)}.json`);

  if (!REFRESH) {
    try {
      const cached = await readFile(cachePath, "utf8");
      return JSON.parse(cached);
    } catch {
      // no cache yet, fall through to fetch
    }
  }

  const res = await fetch(`https://${host}/exercises/name/${encodeURIComponent(query)}`, {
    headers: { "X-RapidAPI-Key": key, "X-RapidAPI-Host": host },
  });

  if (!res.ok) {
    console.warn(`  Search "${query}" failed: ${res.status} ${res.statusText}`);
    return [];
  }

  const data = await res.json();
  const results = Array.isArray(data) ? data : [];
  await writeFile(cachePath, JSON.stringify(results, null, 2));
  return results;
}

async function findBestMatch(ex, host, key) {
  const queries = buildQueries(ex.name);
  const pool = new Map(); // id -> candidate

  // Try every query variant (cheap: capped at 4, cached per-query) rather than
  // stopping at the first that returns results — an early hit can still be the
  // wrong neighborhood (e.g. a generic "thrust"/"row" query) and shadow a much
  // better match that a later, more specific query would have found.
  for (const query of queries) {
    const results = await searchByName(query, host, key);
    for (const r of results) pool.set(r.id, r);
  }

  if (pool.size === 0) return { match: null, score: 0, queriesTried: queries };

  let best = null;
  let bestScore = -1;
  for (const candidate of pool.values()) {
    const score = scoreMatch(ex.name, candidate.name);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  if (bestScore < MATCH_THRESHOLD) {
    return { match: null, score: bestScore, queriesTried: queries, nearMiss: best };
  }
  return { match: best, score: bestScore, queriesTried: queries };
}

async function downloadGif(exerciseDbId, destPath, host, key) {
  try {
    await stat(destPath);
    if (!FORCE) {
      console.log(`  Skipping download (already have ${path.basename(destPath)}, pass --force to redo).`);
      return true;
    }
  } catch {
    // doesn't exist yet, proceed
  }

  const url = `https://${host}/image?exerciseId=${encodeURIComponent(exerciseDbId)}&resolution=${IMAGE_RESOLUTION}`;
  const res = await fetch(url, {
    headers: { "X-RapidAPI-Key": key, "X-RapidAPI-Host": host },
  });

  if (!res.ok) {
    console.warn(`  GIF download failed (${res.status}) for exerciseId=${exerciseDbId}`);
    return false;
  }
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("image")) {
    console.warn(`  Unexpected content-type "${contentType}" for exerciseId=${exerciseDbId}, skipping.`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buf);
  return true;
}

async function main() {
  await loadEnv(ENV_PATH);
  const key = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_HOST || "exercisedb.p.rapidapi.com";

  if (!key) {
    console.error(`RAPIDAPI_KEY is not set in ${ENV_PATH}. Paste your key in and re-run.`);
    process.exit(1);
  }

  const ours = JSON.parse(await readFile(EXERCISE_IDS_PATH, "utf8"));

  await mkdir(GIF_DIR, { recursive: true });
  await mkdir(path.dirname(OUTPUT_JSON_PATH), { recursive: true });

  const output = {};
  let matched = 0;
  let downloaded = 0;

  for (const ex of ours) {
    const { match, score, queriesTried, nearMiss } = await findBestMatch(ex, host, key);

    if (!match) {
      const nearMissNote = nearMiss ? ` (closest was "${nearMiss.name}", score ${score.toFixed(2)}, below threshold ${MATCH_THRESHOLD})` : "";
      console.warn(`No confident match for "${ex.name}" (${ex.id})${nearMissNote} — tried queries: ${queriesTried.join(", ")}`);
      continue;
    }
    console.log(`Matched "${ex.name}" -> "${match.name}" (score ${score.toFixed(2)}, tried: ${queriesTried.join(", ")})`);

    const destPath = path.join(GIF_DIR, `${ex.id}.gif`);
    const ok = await downloadGif(match.id, destPath, host, key);
    if (ok) downloaded++;

    output[ex.id] = {
      sourceName: match.name,
      bodyPart: match.bodyPart ?? null,
      target: match.target ?? null,
      equipment: match.equipment ?? null,
      secondaryMuscles: match.secondaryMuscles ?? [],
      instructions: match.instructions ?? [],
      gif: ok ? `exercise-media/${ex.id}.gif` : null,
    };
    matched++;

    // Be polite to the free-tier host between downloads.
    await new Promise((r) => setTimeout(r, 200));
  }

  await writeFile(OUTPUT_JSON_PATH, JSON.stringify(output, null, 2) + "\n");

  console.log(`\nDone. Matched ${matched}/${ours.length} exercises, downloaded ${downloaded} GIFs.`);
  console.log(`Wrote ${OUTPUT_JSON_PATH}`);
  console.log(`GIFs saved to ${GIF_DIR}`);
  console.log(`\nBoth are plain static files now — commit them normally. scripts/.env (your key) is gitignored and never read by the app.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
