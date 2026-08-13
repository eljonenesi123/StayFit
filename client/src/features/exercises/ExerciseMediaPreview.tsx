import type { Exercise } from "./types";
import { getExerciseMedia, resolvePublicUrl } from "./exerciseMedia";
import VideoEmbed from "./VideoEmbed";
import "./VideoEmbed.css";

interface ExerciseMediaPreviewProps {
  exercise: Exercise;
}

/** Prefers the locally-saved ExerciseDB GIF; falls back to the YouTube search embed when no match was downloaded. */
export default function ExerciseMediaPreview({ exercise }: ExerciseMediaPreviewProps) {
  const media = getExerciseMedia(exercise.id);

  if (media?.gif) {
    return (
      <div className="video-embed video-embed--gif">
        <img src={resolvePublicUrl(media.gif)} alt={`${exercise.name} demonstration`} loading="lazy" />
      </div>
    );
  }

  return <VideoEmbed videoUrl={exercise.videoUrl} title={exercise.name} />;
}
