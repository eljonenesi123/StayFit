import { useState } from "react";
import CalculatorTab from "./CalculatorTab";
import FoodLogTab from "./FoodLogTab";

type Tab = "calculator" | "log";

export default function CalorieCalculatorPage() {
  const [tab, setTab] = useState<Tab>("calculator");

  return (
    <div className="page">
      <div className="page-header">
        <h1>Calories</h1>
        <p>Estimate your daily energy needs, then log meals against a running total.</p>
      </div>

      <div className="segmented" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "calculator"} data-active={tab === "calculator"} onClick={() => setTab("calculator")}>
          Calculator
        </button>
        <button type="button" role="tab" aria-selected={tab === "log"} data-active={tab === "log"} onClick={() => setTab("log")}>
          Food log
        </button>
      </div>

      {tab === "calculator" ? <CalculatorTab /> : <FoodLogTab />}
    </div>
  );
}
