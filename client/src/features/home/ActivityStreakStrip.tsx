import { useAuth } from "../auth/AuthContext";
import { getWorkoutHistory, getCurrentStreak } from "../progress/workoutHistory";
import "./ActivityStreakStrip.css";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function ActivityStreakStrip() {
  const { user } = useAuth();
  if (!user) return null;

  const activeDates = new Set(getWorkoutHistory(user.id).map((e) => e.date));
  const streak = getCurrentStreak(user.id);

  const today = new Date();
  const daysSinceMonday = (today.getDay() + 6) % 7; // Date.getDay(): 0=Sun..6=Sat
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysSinceMonday);

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = toDateStr(d);
    return { label: DAY_LABELS[i], active: activeDates.has(dateStr), isToday: dateStr === toDateStr(today) };
  });

  const daysActiveCount = week.filter((d) => d.active).length;

  return (
    <div className="card activity-streak-strip">
      <div className="activity-streak-strip__dots">
        {week.map((d, i) => (
          <span
            key={i}
            className={`activity-streak-strip__dot${d.active ? " activity-streak-strip__dot--active" : ""}${d.isToday ? " activity-streak-strip__dot--today" : ""}`}
          >
            {d.label}
          </span>
        ))}
      </div>
      <p className="activity-streak-strip__summary">
        {daysActiveCount} {daysActiveCount === 1 ? "day" : "days"} active this week
        {streak > 1 && ` · ${streak}-day streak`}
      </p>
    </div>
  );
}
