/**
 * Screen Wake Lock API wrapper. Falls back gracefully (no-op) on browsers
 * that don't support it — the timer still works, the screen just may sleep.
 */

type WakeLockSentinelLike = {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (type: "release", listener: () => void) => void;
};

export interface WakeLockHandle {
  isSupported: boolean;
  isActive: () => boolean;
  request: () => Promise<void>;
  release: () => Promise<void>;
}

export function createWakeLockController(): WakeLockHandle {
  const isSupported = typeof navigator !== "undefined" && "wakeLock" in navigator;
  let sentinel: WakeLockSentinelLike | null = null;

  const request = async () => {
    if (!isSupported) return;
    try {
      sentinel = (await (navigator as unknown as {
        wakeLock: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
      }).wakeLock.request("screen")) as WakeLockSentinelLike;
      sentinel.addEventListener("release", () => {
        sentinel = null;
      });
    } catch {
      // Denied (e.g. low battery, backgrounded tab) — fail silently, timer logic doesn't depend on this.
      sentinel = null;
    }
  };

  const release = async () => {
    if (sentinel && !sentinel.released) {
      await sentinel.release();
    }
    sentinel = null;
  };

  return {
    isSupported,
    isActive: () => sentinel !== null,
    request,
    release,
  };
}
