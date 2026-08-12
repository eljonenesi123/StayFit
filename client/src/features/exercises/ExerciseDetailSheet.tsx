import type { Exercise } from "./types";
import Sheet from "../../components/Sheet";
import VideoEmbed from "./VideoEmbed";
import "./ExerciseCard.css";

interface ExerciseDetailSheetProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export default function ExerciseDetailSheet({ exercise, onClose }: ExerciseDetailSheetProps) {
  return (
    <Sheet open={exercise !== null} onClose={onClose} title={exercise?.name}>
      {exercise && (
        <div className="stack">
          <VideoEmbed videoUrl={exercise.videoUrl} title={exercise.name} />
          <div>
            <span className="eyebrow">{exercise.muscleGroup}</span>
            <h2 style={{ marginTop: 4 }}>{exercise.name}</h2>
          </div>
          <div className="exercise-card__chips">
            <span className={`exercise-card__difficulty exercise-card__difficulty--${exercise.difficulty.toLowerCase()}`}>
              {exercise.difficulty}
            </span>
            {exercise.equipment.map((eq) => (
              <span key={eq} className="chip chip-neutral">
                {eq}
              </span>
            ))}
          </div>
          <p>{exercise.description}</p>
        </div>
      )}
    </Sheet>
  );
}
