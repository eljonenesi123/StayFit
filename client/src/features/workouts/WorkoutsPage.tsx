import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExerciseLibraryPage from "../exercises/ExerciseLibraryPage";
import RoundTimerPage from "../timer/RoundTimerPage";
import type { Segment } from "../timer/types";
import "./WorkoutsPage.css";

type WorkoutsSegment = "library" | "timer";

interface WorkoutsLocationState {
  segment?: WorkoutsSegment;
  openExerciseId?: string;
  autoStartWorkout?: { label: string; segments: Segment[] };
}

export default function WorkoutsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as WorkoutsLocationState | null;
  const consumedRef = useRef(false);

  const [segment, setSegment] = useState<WorkoutsSegment>(() => {
    if (state?.autoStartWorkout) return "timer";
    return state?.segment ?? "library";
  });

  // Read once; a ref (not just checking location.state) survives the
  // replace-navigation below clearing it before this value gets consumed.
  const autoStartRef = useRef(state?.autoStartWorkout ?? null);

  useEffect(() => {
    if (state && !consumedRef.current) {
      consumedRef.current = true;
      // Clear the hand-off state so a refresh or back-navigation doesn't re-trigger it.
      navigate(".", { replace: true, state: null });
    }
  }, [state, navigate]);

  return (
    <div className="page workouts-page">
      <div className="page-header">
        <h1>Workouts</h1>
      </div>

      <div className="segmented" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={segment === "library"}
          data-active={segment === "library"}
          onClick={() => setSegment("library")}
        >
          Library
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={segment === "timer"}
          data-active={segment === "timer"}
          onClick={() => setSegment("timer")}
        >
          Timer
        </button>
      </div>

      {/* Both segments stay mounted (toggled via CSS, not conditional rendering) so a
          running timer's live state survives switching to Library and back. */}
      <div className={segment === "library" ? "" : "workouts-page__hidden"}>
        <ExerciseLibraryPage />
      </div>
      <div className={segment === "timer" ? "" : "workouts-page__hidden"}>
        <RoundTimerPage autoStart={autoStartRef.current} />
      </div>
    </div>
  );
}
