import { useNavigate } from "react-router-dom";
import { getTodaysCategory, getDefaultWorkoutSequence } from "../workouts/todaySuggestion";
import { CATEGORY_LABELS } from "../workouts/categories";
import "./TodayWorkoutCard.css";

const ESTIMATED_MINUTES = 20;

export default function TodayWorkoutCard() {
  const navigate = useNavigate();
  const category = getTodaysCategory();

  if (category === "rest") {
    return (
      <div className="card today-workout-card today-workout-card--rest">
        <span className="eyebrow">Today's Target</span>
        <p className="today-workout-card__rest-text">Rest day — recovery is part of the plan.</p>
      </div>
    );
  }

  const label = CATEGORY_LABELS[category];

  const handleStart = () => {
    navigate("/workouts", {
      state: { autoStartWorkout: { label, segments: getDefaultWorkoutSequence() } },
    });
  };

  return (
    <div className="card today-workout-card">
      <span className="eyebrow">Today's Target</span>
      <p className="today-workout-card__label">
        {label} — {ESTIMATED_MINUTES} min
      </p>
      <button type="button" className="btn btn-primary today-workout-card__start" onClick={handleStart}>
        Start
      </button>
    </div>
  );
}
