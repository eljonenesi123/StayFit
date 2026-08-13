import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type { Segment } from "./types";
import RoundBuilder from "./RoundBuilder";
import TimerDisplay from "./TimerDisplay";
import { useRoundTimer } from "./useRoundTimer";
import { loadJSON, saveJSON } from "../../lib/storage";
import { logCompletedWorkout } from "../progress/workoutHistory";
import { PlayIcon } from "../../components/icons";
import "./RoundTimerPage.css";

const STORAGE_KEY = "stayfit.timer.sequence";

const DEFAULT_SEGMENTS: Segment[] = [
  { id: "a", type: "work", durationSec: 120 },
  { id: "b", type: "rest", durationSec: 30 },
  { id: "c", type: "work", durationSec: 120 },
  { id: "d", type: "rest", durationSec: 30 },
];

interface RoundTimerPageProps {
  /** Set by Home's Today's Target card via WorkoutsPage — preloads and immediately starts this sequence instead of the builder. */
  autoStart?: { label: string; segments: Segment[] } | null;
}

export default function RoundTimerPage({ autoStart }: RoundTimerPageProps = {}) {
  const { user } = useAuth();
  const [segments, setSegments] = useState<Segment[]>(() => autoStart?.segments ?? loadJSON(STORAGE_KEY, DEFAULT_SEGMENTS));
  const timer = useRoundTimer(segments);
  const autoStartedRef = useRef(false);
  const loggedRef = useRef(false);

  useEffect(() => {
    if (timer.status === "idle" && !autoStart) saveJSON(STORAGE_KEY, segments);
  }, [segments, timer.status, autoStart]);

  // One-shot: skip straight past the builder into a running timer.
  useEffect(() => {
    if (autoStart && !autoStartedRef.current && timer.status === "idle") {
      autoStartedRef.current = true;
      timer.start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  // Log exactly once per completion — "completed" means the sequence
  // reached "finished" on its own, not a manual reset/stop.
  useEffect(() => {
    if (timer.status === "finished" && !loggedRef.current && user) {
      loggedRef.current = true;
      logCompletedWorkout(user.id, {
        durationSec: Math.round(timer.totalDurationMs / 1000),
        label: autoStart?.label ?? "Custom workout",
      });
    }
    if (timer.status !== "finished") loggedRef.current = false;
  }, [timer.status, timer.totalDurationMs, user, autoStart]);

  const isBuilding = timer.status === "idle";

  return (
    <div className="round-timer-page">
      {isBuilding ? (
        <>
          <div className="page-header">
            <p>Build your work/rest sequence, then start. Runs accurately even if your screen locks mid-set.</p>
          </div>
          <RoundBuilder segments={segments} onChange={setSegments} />
          <div className="round-timer-start-bar">
            <button type="button" className="btn btn-primary" disabled={segments.length === 0} onClick={timer.start}>
              <PlayIcon width={20} height={20} />
              Start workout
            </button>
          </div>
        </>
      ) : (
        <TimerDisplay timer={timer} totalRounds={segments.length} onExit={timer.reset} label={autoStart?.label} />
      )}
    </div>
  );
}
