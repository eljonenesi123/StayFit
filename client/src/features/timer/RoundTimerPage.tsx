import { useEffect, useState } from "react";
import type { Segment } from "./types";
import RoundBuilder from "./RoundBuilder";
import TimerDisplay from "./TimerDisplay";
import { useRoundTimer } from "./useRoundTimer";
import { loadJSON, saveJSON } from "../../lib/storage";
import { PlayIcon } from "../../components/icons";
import "./RoundTimerPage.css";

const STORAGE_KEY = "stayfit.timer.sequence";

const DEFAULT_SEGMENTS: Segment[] = [
  { id: "a", type: "work", durationSec: 120 },
  { id: "b", type: "rest", durationSec: 30 },
  { id: "c", type: "work", durationSec: 120 },
  { id: "d", type: "rest", durationSec: 30 },
];

export default function RoundTimerPage() {
  const [segments, setSegments] = useState<Segment[]>(() => loadJSON(STORAGE_KEY, DEFAULT_SEGMENTS));
  const timer = useRoundTimer(segments);

  useEffect(() => {
    if (timer.status === "idle") saveJSON(STORAGE_KEY, segments);
  }, [segments, timer.status]);

  const isBuilding = timer.status === "idle";

  return (
    <div className="page">
      {isBuilding ? (
        <>
          <div className="page-header">
            <h1>Round Timer</h1>
            <p>Build your work/rest sequence, then start. Runs accurately even if your screen locks mid-set.</p>
          </div>
          <RoundBuilder segments={segments} onChange={setSegments} />
          <div className="round-timer-start-bar">
            <button
              type="button"
              className="btn btn-primary"
              disabled={segments.length === 0}
              onClick={timer.start}
            >
              <PlayIcon width={20} height={20} />
              Start workout
            </button>
          </div>
        </>
      ) : (
        <TimerDisplay timer={timer} totalRounds={segments.length} onExit={timer.reset} />
      )}
    </div>
  );
}
