import type { TrajectoryNode, NodeKind } from './trajectoryTypes'
import { MAX_NODES } from './trajectoryTypes'

let seq = 0

export function createNode(
  label: string,
  kind: NodeKind,
  v: number,
  f: number,
  eta: number,
): TrajectoryNode {
  seq++
  return {
    id: 'n-' + Date.now().toString(36) + '-' + seq,
    label,
    kind,
    v: Math.max(0, Math.min(100, Math.round(v))),
    f: Math.max(0, Math.min(100, Math.round(f))),
    eta: Math.max(0, Math.min(1, eta)),
    createdAt: Date.now(),
  }
}

// Suggested kind for the next node: past → transition → now → future…
export function nextKind(nodes: TrajectoryNode[]): NodeKind {
  if (nodes.length === 0) return 'past'
  const has = (k: NodeKind) => nodes.some((n) => n.kind === k)
  if (nodes.length === 1 && !has('transition')) return 'transition'
  if (!has('now')) return 'now'
  return 'future'
}

export function defaultLabel(kind: NodeKind): string {
  switch (kind) {
    case 'past':
      return 'Past 过去'
    case 'transition':
      return 'Transition 过渡'
    case 'now':
      return 'Now 现在'
    case 'future':
      return 'Possible Future 可能未来'
  }
}

export function sortedNodes(nodes: TrajectoryNode[]): TrajectoryNode[] {
  // stable sort: same-timestamp nodes keep insertion order
  return [...nodes].sort((a, b) => a.createdAt - b.createdAt)
}

export function canAdd(nodes: TrajectoryNode[]): boolean {
  return nodes.length < MAX_NODES
}
