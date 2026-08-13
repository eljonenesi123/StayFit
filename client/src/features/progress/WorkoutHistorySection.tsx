import { useAuth } from "../auth/AuthContext";
import { getWorkoutHistory } from "./workoutHistory";
import { formatDuration } from "../../lib/format";
import "./WorkoutHistorySection.css";

function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function WorkoutHistorySection() {
  const { user } = useAuth();
  const history = user ? getWorkoutHistory(user.id) : [];

  return (
    <div className="card workout-history">
      <span className="eyebrow">Workout history</span>

      {history.length === 0 ? (
        <p className="workout-history__empty">Complete a workout to see your history here.</p>
      ) : (
        <ul className="workout-history__list">
          {history.map((entry) => (
            <li key={entry.id} className="workout-history__row">
              <div>
                <div className="workout-history__label">{entry.label}</div>
                <div className="workout-history__date">{formatDate(entry.date)}</div>
              </div>
              <span className="workout-history__duration">{formatDuration(entry.durationSec * 1000)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
