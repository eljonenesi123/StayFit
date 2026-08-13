import type { RoundTimerState } from "./useRoundTimer";
import { formatDuration } from "../../lib/format";
import { PlayIcon, PauseIcon, SkipIcon, ResetIcon, LockIcon } from "../../components/icons";
import "./TimerDisplay.css";

interface TimerDisplayProps {
  timer: RoundTimerState;
  totalRounds: number;
  onExit: () => void;
  /** e.g. "Upper Body" when this run came from Home's Today's Target card. */
  label?: string;
}

const RADIUS = 130;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function TimerDisplay({ timer, totalRounds, onExit, label }: TimerDisplayProps) {
  const {
    status,
    currentIndex,
    currentSegment,
    nextSegment,
    segmentRemainingMs,
    segmentProgress,
    totalRemainingMs,
    wakeLockSupported,
    start,
    togglePause,
    skip,
    reset,
  } = timer;

  const isRest = currentSegment?.type === "rest";
  const tone = isRest ? "rest" : "work";
  const offset = CIRCUMFERENCE * (1 - segmentProgress);
  const roundLabel = currentSegment ? (currentSegment.type === "work" ? "Work" : "Rest") : "";

  return (
    <div className={`timer-display timer-display--${tone} timer-display--${status}`}>
      <div className="timer-display__top">
        <span className="eyebrow">
          {label && `${label} · `}Round {Math.min(currentIndex + 1, totalRounds)} of {totalRounds}
        </span>
        {wakeLockSupported && status === "running" && (
          <span className="timer-display__wakelock" title="Screen will stay on">
            <LockIcon width={15} height={15} /> Screen on
          </span>
        )}
      </div>

      <div className="timer-display__ring-wrap">
        <svg viewBox="0 0 280 280" className="timer-display__ring">
          <circle cx="140" cy="140" r={RADIUS} className="timer-display__ring-track" />
          <circle
            cx="140"
            cy="140"
            r={RADIUS}
            className="timer-display__ring-progress"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="timer-display__center">
          {status === "finished" ? (
            <>
              <span className="timer-display__done-label">Complete</span>
              <span className="timer-display__clock timer-display__clock--small">
                {formatDuration(timer.totalDurationMs)}
              </span>
            </>
          ) : (
            <>
              <span className={`timer-display__segment-label timer-display__segment-label--${tone}`}>
                {roundLabel}
              </span>
              <span className="timer-display__clock">{formatDuration(segmentRemainingMs)}</span>
              {nextSegment && (
                <span className="timer-display__next">
                  Next · {nextSegment.type === "work" ? "Work" : "Rest"} {formatDuration(nextSegment.durationSec * 1000)}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="timer-display__meta">
        <span>Total remaining {formatDuration(totalRemainingMs)}</span>
      </div>

      <div className="timer-display__controls">
        {status === "idle" && (
          <button type="button" className="btn btn-primary timer-display__primary" onClick={start}>
            <PlayIcon width={22} height={22} />
            Start
          </button>
        )}
        {(status === "running" || status === "paused") && (
          <>
            <button type="button" className="btn btn-secondary btn-icon timer-display__reset" aria-label="Reset" onClick={reset}>
              <ResetIcon width={22} height={22} />
            </button>
            <button type="button" className="btn btn-primary timer-display__primary" onClick={togglePause}>
              {status === "running" ? <PauseIcon width={22} height={22} /> : <PlayIcon width={22} height={22} />}
              {status === "running" ? "Pause" : "Resume"}
            </button>
            <button type="button" className="btn btn-secondary btn-icon timer-display__skip" aria-label="Skip round" onClick={skip}>
              <SkipIcon width={22} height={22} />
            </button>
          </>
        )}
        {status === "finished" && (
          <button type="button" className="btn btn-primary timer-display__primary" onClick={onExit}>
            Done
          </button>
        )}
      </div>

      {status !== "idle" && (
        <button type="button" className="btn btn-ghost timer-display__edit-link" onClick={onExit}>
          Edit sequence
        </button>
      )}
    </div>
  );
}
