import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Segment, TimerStatus } from "./types";
import { playWorkAlarm, playRestAlarm, playFinishAlarm, primeAudio } from "../../lib/audio";
import { createWakeLockController } from "../../lib/wakeLock";

/**
 * Interval-timer engine.
 *
 * Elapsed time is always *derived* from Date.now() against fixed epoch
 * timestamps (sequenceStartEpoch, pausedDurationMs) rather than accumulated
 * by counting setInterval ticks. A ticking interval only forces re-renders;
 * every value it renders is recomputed fresh from wall-clock time, so
 * backgrounding the tab or locking the screen can never cause drift — the
 * moment the UI wakes back up it reflects exactly where it should be.
 */

const TICK_MS = 200;

export interface RoundTimerState {
  status: TimerStatus;
  currentIndex: number;
  currentSegment: Segment | null;
  nextSegment: Segment | null;
  segmentElapsedMs: number;
  segmentRemainingMs: number;
  segmentProgress: number; // 0..1
  totalElapsedMs: number;
  totalRemainingMs: number;
  totalDurationMs: number;
  wakeLockSupported: boolean;
  wakeLockActive: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  togglePause: () => void;
  skip: () => void;
  reset: () => void;
}

export function useRoundTimer(segments: Segment[]): RoundTimerState {
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [, forceTick] = useState(0);

  const sequenceStartEpoch = useRef<number | null>(null);
  const pausedDurationMs = useRef(0);
  const pauseStartEpoch = useRef<number | null>(null);
  const lastAnnouncedIndex = useRef(-1);
  const wakeLock = useRef(createWakeLockController());

  const durations = useMemo(() => segments.map((s) => s.durationSec * 1000), [segments]);
  const cumulativeStarts = useMemo(() => {
    const out: number[] = [];
    let acc = 0;
    for (const d of durations) {
      out.push(acc);
      acc += d;
    }
    return out;
  }, [durations]);
  const totalDurationMs = useMemo(() => durations.reduce((a, b) => a + b, 0), [durations]);

  // Re-render ticker while running — purely a render trigger, never a time source.
  useEffect(() => {
    if (status !== "running") return;
    const id = window.setInterval(() => forceTick((n) => n + 1), TICK_MS);
    return () => window.clearInterval(id);
  }, [status]);

  // Re-acquire the wake lock when the tab becomes visible again (browsers
  // auto-release it on backgrounding) as long as we're still running.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible" && status === "running") {
        void wakeLock.current.request();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [status]);

  // Recomputed directly (no memo) on every render — including ones triggered
  // purely by the ticker — since it's cheap arithmetic and correctness here
  // matters more than micro-memoization.
  const now = Date.now();
  const liveTotalElapsedMs =
    sequenceStartEpoch.current === null
      ? 0
      : Math.max(
          0,
          (status === "paused" && pauseStartEpoch.current ? pauseStartEpoch.current : now) -
            sequenceStartEpoch.current -
            pausedDurationMs.current
        );

  let currentIndex = segments.length > 0 ? segments.length - 1 : -1;
  for (let i = 0; i < cumulativeStarts.length; i++) {
    if (liveTotalElapsedMs < cumulativeStarts[i] + durations[i]) {
      currentIndex = i;
      break;
    }
  }

  const isPastEnd = segments.length > 0 && liveTotalElapsedMs >= totalDurationMs && status !== "idle";
  const effectiveIndex = isPastEnd ? segments.length - 1 : currentIndex;
  const currentSegment = segments[effectiveIndex] ?? null;
  const nextSegment = segments[effectiveIndex + 1] ?? null;

  const segmentStart = cumulativeStarts[effectiveIndex] ?? 0;
  const segmentDuration = durations[effectiveIndex] ?? 0;
  const rawSegmentElapsed = liveTotalElapsedMs - segmentStart;
  const segmentElapsedMs = isPastEnd ? segmentDuration : Math.min(rawSegmentElapsed, segmentDuration);
  const segmentRemainingMs = Math.max(0, segmentDuration - segmentElapsedMs);
  const segmentProgress = segmentDuration > 0 ? segmentElapsedMs / segmentDuration : 0;

  // Advance status / play alarms when the segment index changes or the sequence completes.
  useEffect(() => {
    if (status !== "running") return;

    if (isPastEnd && lastAnnouncedIndex.current !== -2) {
      lastAnnouncedIndex.current = -2;
      setStatus("finished");
      playFinishAlarm();
      void wakeLock.current.release();
      return;
    }

    if (!isPastEnd && effectiveIndex !== lastAnnouncedIndex.current && lastAnnouncedIndex.current !== -1) {
      const seg = segments[effectiveIndex];
      if (seg) {
        if (seg.type === "work") playWorkAlarm();
        else playRestAlarm();
      }
    }
    if (!isPastEnd) lastAnnouncedIndex.current = effectiveIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveIndex, isPastEnd, status]);

  const start = useCallback(() => {
    if (segments.length === 0) return;
    primeAudio();
    sequenceStartEpoch.current = Date.now();
    pausedDurationMs.current = 0;
    pauseStartEpoch.current = null;
    lastAnnouncedIndex.current = 0;
    setStatus("running");
    void wakeLock.current.request();
  }, [segments.length]);

  const pause = useCallback(() => {
    if (status !== "running") return;
    pauseStartEpoch.current = Date.now();
    setStatus("paused");
    void wakeLock.current.release();
  }, [status]);

  const resume = useCallback(() => {
    if (status !== "paused" || pauseStartEpoch.current === null) return;
    pausedDurationMs.current += Date.now() - pauseStartEpoch.current;
    pauseStartEpoch.current = null;
    setStatus("running");
    void wakeLock.current.request();
  }, [status]);

  const togglePause = useCallback(() => {
    if (status === "running") pause();
    else if (status === "paused") resume();
  }, [status, pause, resume]);

  const skip = useCallback(() => {
    if (sequenceStartEpoch.current === null || segments.length === 0) return;
    const targetIndex = effectiveIndex + 1;
    // Pause-aware: jump relative to liveTotalElapsedMs (already accounts for
    // whether we're paused) rather than Date.now(), so skipping the final
    // round while paused doesn't leave elapsed time a few ms short of "finished".
    const targetCumulative = targetIndex >= segments.length ? totalDurationMs : cumulativeStarts[targetIndex];
    const jumpNeeded = targetCumulative - liveTotalElapsedMs;
    sequenceStartEpoch.current -= jumpNeeded;
    forceTick((n) => n + 1);
  }, [segments.length, effectiveIndex, cumulativeStarts, liveTotalElapsedMs, totalDurationMs]);

  const reset = useCallback(() => {
    sequenceStartEpoch.current = null;
    pausedDurationMs.current = 0;
    pauseStartEpoch.current = null;
    lastAnnouncedIndex.current = -1;
    setStatus("idle");
    void wakeLock.current.release();
  }, []);

  useEffect(() => {
    const wl = wakeLock.current;
    return () => {
      void wl.release();
    };
  }, []);

  return {
    status,
    currentIndex: effectiveIndex,
    currentSegment,
    nextSegment,
    segmentElapsedMs,
    segmentRemainingMs,
    segmentProgress,
    totalElapsedMs: liveTotalElapsedMs,
    totalRemainingMs: Math.max(0, totalDurationMs - liveTotalElapsedMs),
    totalDurationMs,
    wakeLockSupported: wakeLock.current.isSupported,
    wakeLockActive: wakeLock.current.isActive(),
    start,
    pause,
    resume,
    togglePause,
    skip,
    reset,
  };
}
