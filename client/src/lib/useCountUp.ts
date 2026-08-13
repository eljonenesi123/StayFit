import { useEffect, useRef, useState } from "react";

/**
 * Counts up from 0 to `target` once (the first time this hook is `active`
 * with a real value), then just tracks later changes to `target` directly
 * — only the initial on-load reveal should animate, not every live update
 * (e.g. logging another food entry shouldn't replay the whole count-up).
 *
 * `active` should stay false while the real value isn't loaded yet (e.g.
 * during an async fetch) — otherwise the one-shot animation gets "spent"
 * animating 0 → 0 before the real number ever arrives, and the real value
 * just snaps in instead of counting up.
 */
export function useCountUp(target: number, durationMs = 600, active = true): number {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!active) return;
    if (hasAnimated.current) {
      setValue(target);
      return;
    }
    hasAnimated.current = true;
    let raf = 0;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min(1, (ts - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, active]);

  return active ? value : 0;
}
