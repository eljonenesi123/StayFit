import { useMemo, useState } from "react";
import { searchFood, ApiNotConfiguredError, type NutritionSearchResult } from "./nutritionApi";
import { loadJSON } from "../../lib/storage";
import { TDEE_STORAGE_KEY } from "./CalculatorTab";
import { getAllEntries, addFoodEntry, removeFoodEntry, isToday } from "./todayLog";
import { TrashIcon, PlusIcon } from "../../components/icons";
import "./FoodLogTab.css";

export default function FoodLogTab() {
  const [entries, setEntries] = useState(() => getAllEntries());
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NutritionSearchResult[] | null>(null);
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "not-configured" | "error">("idle");
  const [manualName, setManualName] = useState("");
  const [manualCalories, setManualCalories] = useState("");

  const target = loadJSON<number | null>(TDEE_STORAGE_KEY, null);

  const todaysEntries = useMemo(
    () => entries.filter((e) => isToday(e.loggedAt)).sort((a, b) => b.loggedAt - a.loggedAt),
    [entries]
  );
  const totalToday = todaysEntries.reduce((sum, e) => sum + e.calories, 0);

  const addEntry = (name: string, calories: number, servingDescription?: string) => {
    const entry = addFoodEntry(name, calories, servingDescription);
    if (entry) setEntries(getAllEntries());
  };

  const removeEntry = (id: string) => {
    removeFoodEntry(id);
    setEntries(getAllEntries());
  };

  const runSearch = async () => {
    if (!query.trim()) return;
    setSearchStatus("loading");
    try {
      const results = await searchFood(query.trim());
      setSearchResults(results);
      setSearchStatus("idle");
    } catch (e) {
      if (e instanceof ApiNotConfiguredError) {
        setSearchStatus("not-configured");
      } else {
        setSearchStatus("error");
      }
      setSearchResults(null);
    }
  };

  return (
    <div className="stack">
      <div className="card food-log__summary">
        <div>
          <span className="eyebrow">Today</span>
          <div className="food-log__total">{totalToday} kcal</div>
        </div>
        {target && (
          <div className="food-log__target">
            <span className="eyebrow">Target</span>
            <div className="food-log__target-value">{target} kcal</div>
            <div className={`food-log__remaining ${target - totalToday < 0 ? "food-log__remaining--over" : ""}`}>
              {target - totalToday >= 0 ? `${target - totalToday} remaining` : `${totalToday - target} over`}
            </div>
          </div>
        )}
      </div>

      <div className="field">
        <label htmlFor="food-search">Search foods</label>
        <div className="food-log__search-row">
          <input
            id="food-search"
            type="text"
            placeholder="e.g. grilled chicken breast"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
          />
          <button type="button" className="btn btn-secondary" onClick={runSearch} disabled={searchStatus === "loading"}>
            {searchStatus === "loading" ? "…" : "Search"}
          </button>
        </div>
      </div>

      {searchStatus === "not-configured" && (
        <div className="stub-note">
          <span>Food lookup isn't connected yet (no nutrition API key set) — use manual entry below.</span>
        </div>
      )}
      {searchStatus === "error" && (
        <div className="stub-note">
          <span>Search failed — use manual entry below.</span>
        </div>
      )}

      {searchResults && searchResults.length > 0 && (
        <ul className="food-log__results">
          {searchResults.map((r) => (
            <li key={r.id} className="food-log__result-row">
              <div>
                <div className="food-log__result-name">{r.name}</div>
                <div className="food-log__result-meta">
                  {r.caloriesPerServing != null ? `${r.caloriesPerServing} kcal` : "kcal unknown"} · {r.servingDescription}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                aria-label={`Add ${r.name}`}
                onClick={() => addEntry(r.name, r.caloriesPerServing ?? 0, r.servingDescription)}
                disabled={r.caloriesPerServing == null}
              >
                <PlusIcon width={20} height={20} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="card">
        <span className="eyebrow">Manual entry</span>
        <div className="food-log__manual-row">
          <input
            type="text"
            placeholder="Food name"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            aria-label="Food name"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="kcal"
            value={manualCalories}
            onChange={(e) => setManualCalories(e.target.value)}
            aria-label="Calories"
            className="food-log__manual-cal"
          />
          <button
            type="button"
            className="btn btn-primary btn-icon"
            aria-label="Add food"
            onClick={() => {
              addEntry(manualName, Number(manualCalories));
              setManualName("");
              setManualCalories("");
            }}
          >
            <PlusIcon width={20} height={20} />
          </button>
        </div>
      </div>

      {todaysEntries.length === 0 ? (
        <div className="empty-state">
          <p>No food logged yet today.</p>
        </div>
      ) : (
        <ul className="food-log__entries">
          {todaysEntries.map((e) => (
            <li key={e.id} className="food-log__entry-row">
              <div>
                <div className="food-log__result-name">{e.name}</div>
                {e.servingDescription && <div className="food-log__result-meta">{e.servingDescription}</div>}
              </div>
              <div className="food-log__entry-actions">
                <span className="food-log__entry-cal">{e.calories} kcal</span>
                <button type="button" className="btn btn-ghost btn-icon" aria-label={`Remove ${e.name}`} onClick={() => removeEntry(e.id)}>
                  <TrashIcon width={18} height={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
