import WeightCard from "./WeightCard";
import WorkoutHistorySection from "./WorkoutHistorySection";

export default function ProgressPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Progress</h1>
        <p>Your bodyweight trend and workout history over time.</p>
      </div>

      <div className="stack">
        <WeightCard />
        <WorkoutHistorySection />
      </div>
    </div>
  );
}
