import type { Exercise } from "./types";
import MuscleGroupIcon from "./MuscleGroupIcon";
import { getExerciseMedia, resolvePublicUrl } from "./exerciseMedia";
import "./ExerciseCard.css";

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: () => void;
}

export default function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  const media = getExerciseMedia(exercise.id);

  return (
    <button type="button" className="exercise-card" onClick={onSelect}>
      <div className="exercise-card__thumb" aria-hidden="true">
        {media?.gif ? (
          <img src={resolvePublicUrl(media.gif)} alt="" loading="lazy" />
        ) : (
          <MuscleGroupIcon group={exercise.muscleGroup} />
        )}
      </div>
      <div className="exercise-card__body">
        <div className="exercise-card__meta">
          <span className="eyebrow">{exercise.muscleGroup}</span>
          <span className={`exercise-card__difficulty exercise-card__difficulty--${exercise.difficulty.toLowerCase()}`}>
            {exercise.difficulty}
          </span>
          {exercise.equipment.map((eq) => (
            <span key={eq} className="chip chip-neutral exercise-card__equipment">
              {eq}
            </span>
          ))}
        </div>
        <h3 className="exercise-card__name">{exercise.name}</h3>
        <p className="exercise-card__desc">{exercise.description}</p>
      </div>
    </button>
  );
}
