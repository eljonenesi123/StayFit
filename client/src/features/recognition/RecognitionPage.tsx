import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EXERCISES } from "../exercises/data";
import { fileToImagePayload, type ImagePayload } from "./mediaCapture";
import { recognizeExercise, ApiNotConfiguredError } from "./api";
import type { RecognitionResult } from "./types";
import { CameraIcon } from "../../components/icons";
import "./RecognitionPage.css";

type Status = "idle" | "ready" | "loading" | "done" | "error" | "not-configured";

export default function RecognitionPage() {
  const [payload, setPayload] = useState<ImagePayload | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setResult(null);
    setStatus("loading");
    try {
      const img = await fileToImagePayload(file);
      setPayload(img);
      setStatus("ready");
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Couldn't read that file.");
      setStatus("error");
    }
  };

  const handleAnalyze = async () => {
    if (!payload) return;
    setStatus("loading");
    try {
      const libraryExercises = EXERCISES.map((e) => ({ id: e.id, name: e.name }));
      const res = await recognizeExercise({
        mediaType: payload.mediaType,
        data: payload.data,
        libraryExercises,
      });
      setResult(res);
      setStatus("done");
    } catch (e) {
      if (e instanceof ApiNotConfiguredError) {
        setErrorMessage(e.message);
        setStatus("not-configured");
      } else {
        setErrorMessage(e instanceof Error ? e.message : "Something went wrong.");
        setStatus("error");
      }
    }
  };

  const reset = () => {
    setPayload(null);
    setResult(null);
    setStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const matchedExercise = result?.libraryMatchId ? EXERCISES.find((e) => e.id === result.libraryMatchId) : null;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Scan Exercise</h1>
        <p>Upload or take a photo (or short video) of yourself mid-exercise for an AI read on form and identification.</p>
      </div>

      <div className="disclaimer" style={{ marginBottom: "var(--space-5)" }}>
        <span>
          This identifies the exercise and offers general guidance — it does not generate a new video, and it is
          <strong> not a substitute for professional coaching</strong>, especially for injury-risk or form feedback.
        </span>
      </div>

      {!payload && (
        <label className="recognition-drop">
          <CameraIcon width={32} height={32} />
          <span className="recognition-drop__title">Take or upload a photo/video</span>
          <span className="recognition-drop__hint">JPEG, PNG, or a short video clip</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            capture="environment"
            onChange={(e) => handleFile(e.target.files?.[0])}
            hidden
          />
        </label>
      )}

      {payload && (
        <div className="stack">
          <img src={payload.previewUrl} alt="Selected exercise frame" className="recognition-preview" />
          <div className="recognition-actions">
            <button type="button" className="btn btn-secondary" onClick={reset}>
              Choose another
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Analyzing…" : "Identify exercise"}
            </button>
          </div>
        </div>
      )}

      {status === "not-configured" && (
        <div className="stub-note" style={{ marginTop: "var(--space-5)" }}>
          <span>{errorMessage}</span>
        </div>
      )}

      {status === "error" && (
        <div className="stub-note" style={{ marginTop: "var(--space-5)" }}>
          <span>{errorMessage}</span>
        </div>
      )}

      {result && status === "done" && (
        <div className="card recognition-result">
          <span className="eyebrow">{result.confidence} confidence</span>
          <h2 style={{ marginTop: 4 }}>{result.exerciseName}</h2>
          <p>{result.description}</p>
          <h3 className="recognition-result__subhead">Form cues</h3>
          <ul>
            {result.formCues.map((cue, i) => (
              <li key={i}>{cue}</li>
            ))}
          </ul>
          {matchedExercise ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/workouts", { state: { segment: "library", openExerciseId: matchedExercise.id } })}
            >
              View "{matchedExercise.name}" in library
            </button>
          ) : (
            <p className="recognition-result__no-match">Not in the library yet — search the library for related moves.</p>
          )}
        </div>
      )}
    </div>
  );
}
