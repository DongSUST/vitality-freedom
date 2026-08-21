// Unified state transition timing — visual, audio and phi share this clock.

export const STATE_TRANSITION_MS = 1800
export const REFORM_MS = 1000

// Trajectory playback: 1.5–3s per segment (spec), 700ms under reduced motion.
export const SEGMENT_MS = 2600
export const SEGMENT_MS_REDUCED = 700

export function easeInOutCubic(p: number): number {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
}
