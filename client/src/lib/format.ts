/** Formats a millisecond duration as M:SS (or H:MM:SS once past an hour). */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function parseMinutesSecondsToMs(minutes: number, seconds: number): number {
  return (Math.max(0, minutes) * 60 + Math.max(0, Math.min(59, seconds))) * 1000;
}
