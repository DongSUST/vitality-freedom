// Conceptual state helpers. Phi is a conceptual system state, not a score.

import { QUADRANTS } from '../data/framework'
import type { QuadrantInfo } from '../data/framework'

export function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x))
}

// Phi ∝ V × F × etaA (normalized to 0..1)
export function phiNorm(v: number, f: number, eta: number): number {
  return (v / 100) * (f / 100) * clamp01(eta)
}

export function quadrantKey(v: number, f: number): 'hh' | 'hl' | 'lh' | 'll' {
  const hv = v >= 50 ? 'h' : 'l'
  const hf = f >= 50 ? 'h' : 'l'
  return (hv + hf) as 'hh' | 'hl' | 'lh' | 'll'
}

export function quadrantInfo(v: number, f: number): QuadrantInfo {
  const key = quadrantKey(v, f)
  return QUADRANTS.find((q) => q.key === key) ?? QUADRANTS[0]
}

export function average(nums: number[]): number {
  if (nums.length === 0) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}
