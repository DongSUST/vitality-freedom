export type NodeKind = 'past' | 'transition' | 'now' | 'future'

export interface TrajectoryNode {
  id: string
  label: string
  kind: NodeKind
  v: number
  f: number
  eta: number
  createdAt: number
}

export const MAX_NODES = 5
