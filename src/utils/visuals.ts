// V0.1.1 Embodied visual semantics.
// Vitality = FLOW · Freedom = REACHABLE PATHS · Architecture = CHANNEL STRUCTURE
// Phi = EMERGENT EFFECTIVE POTENTIAL (a state, not a score).

import { clamp01, phiNorm } from './phi'

// Smoothstep — all world features interpolate continuously through 50.
export function smooth(x0: number, x1: number, x: number): number {
  const t = clamp01((x - x0) / (x1 - x0))
  return t * t * (3 - 2 * t)
}

// ————— Φ conceptual states —————
export interface PhiState {
  id: string
  zh: string
  en: string
  note: string
  min: number
}

export const PHI_STATES: PhiState[] = [
  { id: 'latent', zh: '潜伏', en: 'Latent', note: '势能尚未成形', min: 0 },
  { id: 'compressed', zh: '压缩', en: 'Compressed', note: '能量集中、路径未开', min: 0.2 },
  { id: 'expanding', zh: '展开', en: 'Expanding', note: '能量与路径正在耦合', min: 0.4 },
  { id: 'generative', zh: '生成', en: 'Generative', note: '系统开始持续产生新选择', min: 0.6 },
  { id: 'compounding', zh: '复利', en: 'Compounding', note: '反馈回路稳定，势能自我放大', min: 0.8 },
]

export function phiState(phi: number): PhiState {
  const n = clamp01(phi)
  let state = PHI_STATES[0]
  for (const s of PHI_STATES) {
    if (n >= s.min - 1e-9) state = s
  }
  return state
}

// ————— World visual model (continuous in V, F, etaA) —————
export interface VisualModel {
  vn: number
  fn: number
  eta: number
  phi: number
  highV: number
  highF: number
  lowV: number
  lowF: number
  trap: number
  flowPower: number
  pathStrength: number
  activeBranches: number
  focusBranches: number
}

export function visualModel(v: number, f: number, eta: number): VisualModel {
  const vn = clamp01(v / 100)
  const fn = clamp01(f / 100)
  const highV = smooth(0.5, 0.68, vn)
  const highF = smooth(0.5, 0.68, fn)
  const lowV = 1 - smooth(0.32, 0.5, vn)
  const lowF = 1 - smooth(0.32, 0.5, fn)
  return {
    vn,
    fn,
    eta,
    phi: phiNorm(v, f, eta),
    highV,
    highF,
    lowV,
    lowF,
    trap: highV * lowF,
    flowPower: 0.25 + 0.75 * vn,
    pathStrength: 0.35 + 0.65 * vn,
    activeBranches: Math.round(fn * 6),
    focusBranches: 1 + Math.round(eta * 6),
  }
}

// Branch i fades in continuously as Freedom grows (no staircase).
export function branchOn(i: number, fn: number): number {
  return smooth(0.34 + i * 0.09, 0.46 + i * 0.09, fn)
}
