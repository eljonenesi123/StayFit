import type { Exercise } from "./types";
import "./ExerciseCard.css";

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: () => void;
}

export default function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  return (
    <button type="button" className="exercise-card" onClick={onSelect}>
      <div className="exercise-card__top">
        <span className="eyebrow">{exercise.muscleGroup}</span>
        <span className={`exercise-card__difficulty exercise-card__difficulty--${exercise.difficulty.toLowerCase()}`}>
          {exercise.difficulty}
        </span>
      </div>
      <h3 className="exercise-card__name">{exercise.name}</h3>
      <p className="exercise-card__desc">{exercise.description}</p>
      <div className="exercise-card__chips">
        {exercise.equipment.map((eq) => (
          <span key={eq} className="chip chip-neutral">
            {eq}
          </span>
        ))}
      </div>
    </button>
  );
}
