// Pure mapping from world state to audible state.
// S = f(V, F, etaA). Self-contained (no imports) so it can be tested in Node.
//
//   Vitality   → activity        (event density, not loudness)
//   Freedom    → spatialWidth + harmonicBreadth
//   etaA       → coherence
//   Phi        → overall depth reference

export interface SoundModel {
  vitality: number
  freedom: number
  architecture: number
  phi: number
  activity: number
  spatialWidth: number
  harmonicBreadth: number
  coherence: number
  density: number
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x))
}

function smooth(x0: number, x1: number, x: number): number {
  const t = clamp01((x - x0) / (x1 - x0))
  return t * t * (3 - 2 * t)
}

export function soundModel(v: number, f: number, eta: number, phi?: number): SoundModel {
  const vn = clamp01(v / 100)
  const fn = clamp01(f / 100)
  const en = clamp01(eta)
  return {
    vitality: vn,
    freedom: fn,
    architecture: en,
    phi: phi !== undefined ? clamp01(phi) : vn * fn * en,
    activity: 0.12 + 0.88 * vn,
    spatialWidth: 0.18 + 0.82 * fn,
    harmonicBreadth: 0.15 + 0.85 * fn,
    coherence: 0.15 + 0.85 * en,
    density: 0.08 + 0.92 * vn * fn,
  }
}

export function isUnsupported() {
  return typeof window === 'undefined' || (!window.AudioContext && !(window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext)
}
