/**
 * Alarm tones synthesized with the Web Audio API — no external sound files to
 * fetch or ship, and no risk of a silent <audio> element failing to autoplay.
 * Three distinct cues: round transition, rest transition, and sequence finish.
 */

let ctx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

/** Must be called from a user gesture (e.g. the "Start" tap) to unlock audio on iOS Safari. */
export function primeAudio(): void {
  const c = getContext();
  const osc = c.createOscillator();
  const gain = c.createGain();
  gain.gain.value = 0;
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.01);
}

function tone(freq: number, startAt: number, duration: number, gainPeak = 0.22, type: OscillatorType = "sine") {
  const c = getContext();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain).connect(c.destination);

  const t0 = c.currentTime + startAt;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/** Two quick rising beeps — "work starts / rest ends" cue. */
export function playWorkAlarm(): void {
  tone(880, 0, 0.16, 0.24, "sine");
  tone(1175, 0.18, 0.2, 0.24, "sine");
}

/** A single softer, lower tone — "rest starts" cue. */
export function playRestAlarm(): void {
  tone(523, 0, 0.28, 0.2, "sine");
}

/** A short ascending three-note fanfare — whole sequence complete. */
export function playFinishAlarm(): void {
  tone(659, 0, 0.18, 0.26, "triangle");
  tone(784, 0.16, 0.18, 0.26, "triangle");
  tone(988, 0.32, 0.4, 0.28, "triangle");
}

/** A brief tick used for the final 3-2-1 countdown, kept quiet and unobtrusive. */
export function playTick(): void {
  tone(1400, 0, 0.06, 0.1, "square");
}
