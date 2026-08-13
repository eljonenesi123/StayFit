import { useState } from "react";
import CalorieRing from "./CalorieRing";
import CalculatorTab from "../calories/CalculatorTab";
import FoodLogTab from "../calories/FoodLogTab";
import PlanGeneratorPage from "../plans/PlanGeneratorPage";

type Tab = "log" | "calculator" | "plans";

export default function MealsPage() {
  const [tab, setTab] = useState<Tab>("log");

  return (
    <div className="page">
      <div className="page-header">
        <h1>Meals</h1>
        <p>Log food, estimate your daily energy needs, and generate a meal plan.</p>
      </div>

      <div className="segmented" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "log"} data-active={tab === "log"} onClick={() => setTab("log")}>
          Log
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "calculator"}
          data-active={tab === "calculator"}
          onClick={() => setTab("calculator")}
        >
          Calculator
        </button>
        <button type="button" role="tab" aria-selected={tab === "plans"} data-active={tab === "plans"} onClick={() => setTab("plans")}>
          Plans
        </button>
      </div>

      {tab === "log" && (
        <div className="stack">
          <CalorieRing showQuickAdd={false} />
          <FoodLogTab />
        </div>
      )}
      {tab === "calculator" && <CalculatorTab />}
      {tab === "plans" && <PlanGeneratorPage />}
    </div>
  );
}
