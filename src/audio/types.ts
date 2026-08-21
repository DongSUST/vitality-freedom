import type { SoundModel } from './soundModel'

export type { SoundModel }

export type EngineMode = 'idle' | 'running' | 'suspended' | 'unsupported'

export interface EngineDebug {
  instances: number
  mode: EngineMode
  model: SoundModel | null
}
