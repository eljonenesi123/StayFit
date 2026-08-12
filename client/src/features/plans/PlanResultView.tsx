import type { GeneratedPlan } from "./types";
import "./PlanResultView.css";

export default function PlanResultView({ plan }: { plan: GeneratedPlan }) {
  return (
    <div className="stack">
      <div className="card">
        <span className="eyebrow">Your plan</span>
        <p style={{ marginTop: 6, marginBottom: 0 }}>{plan.summary}</p>
      </div>

      {plan.workoutPlan && (
        <div className="stack">
          <h3 className="plan-section-title">Workout — {plan.workoutPlan.daysPerWeek}x / week</h3>
          {plan.workoutPlan.days.map((day, i) => (
            <div className="card plan-day" key={i}>
              <div className="plan-day__header">
                <strong>{day.day}</strong>
                <span className="eyebrow">{day.focus}</span>
              </div>
              <ul className="plan-day__exercises">
                {day.exercises.map((ex, j) => (
                  <li key={j}>
                    <div className="plan-day__exercise-row">
                      <span className="plan-day__exercise-name">{ex.name}</span>
                      <span className="plan-day__exercise-meta">
                        {ex.sets} × {ex.reps} · rest {ex.restSeconds}s
                      </span>
                    </div>
                    {ex.notes && <p className="plan-day__exercise-notes">{ex.notes}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {plan.mealPlan && (
        <div className="stack">
          <h3 className="plan-section-title">Meals — ~{plan.mealPlan.dailyCalorieTarget} kcal/day</h3>
          {plan.mealPlan.days.map((day, i) => (
            <div className="card plan-day" key={i}>
              <div className="plan-day__header">
                <strong>{day.day}</strong>
              </div>
              <ul className="plan-day__exercises">
                {day.meals.map((meal, j) => (
                  <li key={j}>
                    <div className="plan-day__exercise-row">
                      <span className="plan-day__exercise-name">{meal.name}</span>
                      <span className="plan-day__exercise-meta">{meal.estimatedCalories} kcal</span>
                    </div>
                    <p className="plan-day__exercise-notes">{meal.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
