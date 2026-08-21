import type { TrajectoryNode } from './trajectoryTypes'
import { createNode } from './trajectoryModel'

// Sample trajectory: stagnation → compressed power → opened world → compounding.
// Exploratory, not a prescription.
export function sampleTrajectory(): TrajectoryNode[] {
  return [
    createNode('Past 过去', 'past', 30, 25, 0.3),
    createNode('Transition 过渡', 'transition', 80, 30, 0.45),
    createNode('Now 现在', 'now', 80, 70, 0.65),
    createNode('Possible Future 可能未来', 'future', 85, 85, 0.9),
  ]
}
