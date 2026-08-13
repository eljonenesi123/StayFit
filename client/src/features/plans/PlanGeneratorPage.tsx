import { useState } from "react";
import PlanForm from "./PlanForm";
import PlanResultView from "./PlanResultView";
import { generatePlan, ApiNotConfiguredError } from "./api";
import type { GeneratedPlan, PlanRequest, SavedPlan } from "./types";
import { loadJSON, saveJSON } from "../../lib/storage";
import "./PlanGeneratorPage.css";

const STORAGE_KEY = "stayfit.plans.saved";

type Status = "form" | "loading" | "result" | "error" | "not-configured";

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function PlanGeneratorPage() {
  const [status, setStatus] = useState<Status>("form");
  const [lastRequest, setLastRequest] = useState<PlanRequest | null>(null);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => loadJSON(STORAGE_KEY, []));
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const runGeneration = async (request: PlanRequest) => {
    setLastRequest(request);
    setStatus("loading");
    try {
      const result = await generatePlan(request);
      setPlan(result);
      setStatus("result");
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

  const handleSave = () => {
    if (!plan || !lastRequest) return;
    const entry: SavedPlan = { id: newId(), createdAt: Date.now(), request: lastRequest, plan };
    const next = [entry, ...savedPlans];
    setSavedPlans(next);
    saveJSON(STORAGE_KEY, next);
  };

  const handleDeleteSaved = (id: string) => {
    const next = savedPlans.filter((p) => p.id !== id);
    setSavedPlans(next);
    saveJSON(STORAGE_KEY, next);
  };

  return (
    <div className="plan-generator-page">
      <div className="page-header">
        <p>Tell us your goals and we'll build a personalized workout and meal plan.</p>
      </div>

      {(status === "form" || status === "loading") && (
        <PlanForm onSubmit={runGeneration} submitting={status === "loading"} initial={lastRequest ?? undefined} />
      )}

      {status === "not-configured" && (
        <div className="stub-note">
          <span>{errorMessage}</span>
        </div>
      )}

      {status === "error" && (
        <div className="stub-note">
          <span>{errorMessage}</span>
          <button type="button" className="btn btn-ghost" onClick={() => setStatus("form")}>
            Back
          </button>
        </div>
      )}

      {status === "result" && plan && (
        <div className="stack">
          <PlanResultView plan={plan} />
          <div className="plan-result-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setStatus("form")}>
              Adjust inputs
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => lastRequest && runGeneration(lastRequest)}
            >
              Regenerate
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save plan
            </button>
          </div>
        </div>
      )}

      {savedPlans.length > 0 && (
        <div className="saved-plans">
          <h2 className="saved-plans__title">Saved plans</h2>
          <div className="stack">
            {savedPlans.map((sp) => (
              <div className="card saved-plan" key={sp.id}>
                <button
                  type="button"
                  className="saved-plan__header"
                  onClick={() => setExpandedId(expandedId === sp.id ? null : sp.id)}
                >
                  <span>
                    <strong>{new Date(sp.createdAt).toLocaleDateString()}</strong>
                    <span className="saved-plan__meta"> · {sp.request.goals.join(", ")}</span>
                  </span>
                  <span>{expandedId === sp.id ? "Hide" : "View"}</span>
                </button>
                {expandedId === sp.id && (
                  <div className="saved-plan__body">
                    <PlanResultView plan={sp.plan} />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDeleteSaved(sp.id)}
                      style={{ marginTop: "var(--space-3)" }}
                    >
                      Delete plan
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
