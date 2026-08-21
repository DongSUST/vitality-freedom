// Single generative soundscape engine.
// One AudioContext for the whole page life; sound = audible projection of
// (V, F, etaA). All parameter changes are smoothed (setTargetAtTime).

import { soundModel } from './soundModel'
import type { SoundModel } from './soundModel'
import type { EngineDebug, EngineMode } from './types'

// Pentatonic space — harmonic breadth opens with Freedom.
const SCALE = [220, 246.94, 277.18, 329.63, 369.99, 440, 493.88, 554.37, 659.26, 739.99, 880]

const TAU = 0.45 // smoothing time constant (s)
const LOOKAHEAD = 0.35
const TICK_MS = 140

let instanceCount = 0

export class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private pulseGain: GainNode | null = null
  private windGain: GainNode | null = null
  private windFilter: BiquadFilterNode | null = null
  private droneGain: GainNode | null = null
  private droneFilter: BiquadFilterNode | null = null
  private droneOscA: OscillatorNode | null = null
  private droneOscB: OscillatorNode | null = null
  private delay: DelayNode | null = null
  private feedback: GainNode | null = null
  private noiseBuffer: AudioBuffer | null = null
  private schedulerId: number | null = null
  private nextTickAt = 0
  private fadeTimer: number | null = null
  private model: SoundModel
  private volume = 0.85
  private depth = 1
  mode: EngineMode = 'idle'

  constructor() {
    instanceCount++
    this.model = soundModel(50, 50, 0.62)
  }

  start(): EngineMode {
    if (this.mode === 'running') return 'running'
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) {
      this.mode = 'unsupported'
      return 'unsupported'
    }
    try {
      const ctx = new Ctor()
      this.ctx = ctx

      const master = ctx.createGain()
      master.gain.value = 0
      master.connect(ctx.destination)
      this.master = master

      // — wind ambience: filtered noise —
      const noise = this.makeNoiseBuffer(ctx)
      this.noiseBuffer = noise
      const wind = ctx.createBufferSource()
      wind.buffer = noise
      wind.loop = true
      const windFilter = ctx.createBiquadFilter()
      windFilter.type = 'lowpass'
      windFilter.frequency.value = 350
      const windGain = ctx.createGain()
      windGain.gain.value = 0
      wind.connect(windFilter)
      windFilter.connect(windGain)
      windGain.connect(master)
      wind.start()
      this.windFilter = windFilter
      this.windGain = windGain

      // — low drone —
      const droneFilter = ctx.createBiquadFilter()
      droneFilter.type = 'lowpass'
      droneFilter.frequency.value = 240
      const droneGain = ctx.createGain()
      droneGain.gain.value = 0
      const oscA = ctx.createOscillator()
      oscA.type = 'sine'
      oscA.frequency.value = 55
      const oscB = ctx.createOscillator()
      oscB.type = 'sine'
      oscB.frequency.value = 82.5
      oscB.detune.value = 4
      oscA.connect(droneFilter)
      oscB.connect(droneFilter)
      droneFilter.connect(droneGain)
      droneGain.connect(master)
      oscA.start()
      oscB.start()
      this.droneFilter = droneFilter
      this.droneGain = droneGain
      this.droneOscA = oscA
      this.droneOscB = oscB

      // — pulse / bell bus with echo space —
      const pulseGain = ctx.createGain()
      pulseGain.gain.value = 0.3
      const delay = ctx.createDelay(2)
      delay.delayTime.value = 0.32
      const feedback = ctx.createGain()
      feedback.gain.value = 0.2
      pulseGain.connect(master)
      pulseGain.connect(delay)
      delay.connect(feedback)
      feedback.connect(delay)
      delay.connect(master)
      this.pulseGain = pulseGain
      this.delay = delay
      this.feedback = feedback

      ctx.resume().catch(() => {})
      this.mode = 'running'
      this.rampAll(true)
      this.nextTickAt = ctx.currentTime + 0.15
      this.schedulerId = window.setInterval(() => this.tick(), TICK_MS)
    } catch (err) {
      console.warn('AudioEngine: unsupported or blocked', err)
      this.mode = 'unsupported'
    }
    return this.mode
  }

  private makeNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * 2)
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    return buffer
  }

  setWorld(v: number, f: number, eta: number, depth: number): void {
    this.model = soundModel(v, f, eta)
    this.depth = Math.max(0, Math.min(1, depth))
    if (this.mode === 'running') this.rampAll(false)
  }

  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol))
    if (this.mode === 'running' && this.master && this.ctx) {
      const target = 0.9 * this.volume * this.depth
      this.master.gain.setTargetAtTime(target, this.ctx.currentTime, TAU)
    }
  }

  fadeOutAndStop(): void {
    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId)
      this.schedulerId = null
    }
    if (this.mode === 'running' && this.ctx && this.master) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.35)
      const ctx = this.ctx
      this.fadeTimer = window.setTimeout(() => {
        ctx.suspend().catch(() => {})
      }, 1100)
      this.mode = 'suspended'
    }
  }

  getDebug(): EngineDebug {
    return { instances: instanceCount, mode: this.mode, model: this.model }
  }

  // ————— scheduling —————
  private tick(): void {
    if (!this.ctx) return
    const m = this.model
    const t = this.ctx.currentTime
    while (this.nextTickAt < t + LOOKAHEAD) {
      this.scheduleAt(this.nextTickAt)
      const base = 1.45 - m.vitality * 1.0 // 1.45s → 0.45s
      const jitter = 1 + (1 - m.coherence) * Math.random() * 0.9
      this.nextTickAt += Math.max(0.25, base * jitter)
    }
  }

  private scheduleAt(time: number): void {
    if (!this.ctx) return
    const m = this.model

    // pulse — the vital heartbeat of the world
    this.playPulse(time)

    // low eta: offbeat ticks (rhythmic misalignment)
    if (Math.random() < (1 - m.coherence) * 0.35) {
      this.playPulse(time + 0.37 * Math.max(0.25, 1.45 - m.vitality))
    }

    // bells: distant possibilities — appear with Freedom, develop with Vitality
    if (Math.random() < m.freedom * 0.24) {
      const note = this.bellNote()
      this.playBell(time, note, (Math.random() * 2 - 1) * m.spatialWidth)
      if (m.vitality > 0.55 && Math.random() < 0.38) {
        this.playBell(time + 0.5, this.bellNote(note), (Math.random() * 2 - 1) * m.spatialWidth)
        this.playBell(time + 1.0, this.bellNote(note), (Math.random() * 2 - 1) * m.spatialWidth)
      }
    }

    // low eta: energy leaking away (audible dissipation)
    if (Math.random() < (1 - m.coherence) * m.vitality * 0.4) {
      this.playLeak(time)
    }
  }

  private playPulse(time: number): void {
    if (!this.ctx || !this.pulseGain) return
    const m = this.model
    const osc = this.ctx.createOscillator()
    osc.type = 'triangle'
    const idx = Math.min(SCALE.length - 1, Math.floor(Math.random() * (1 + m.harmonicBreadth * (SCALE.length - 1))))
    osc.frequency.value = SCALE[idx]
    const pan = this.ctx.createStereoPanner()
    pan.pan.value = (Math.random() * 2 - 1) * m.spatialWidth * 0.8
    const g = this.ctx.createGain()
    const dur = 0.5 - m.vitality * 0.28
    g.gain.setValueAtTime(0.0001, time)
    g.gain.exponentialRampToValueAtTime(0.5, time + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur)
    osc.connect(pan)
    pan.connect(g)
    g.connect(this.pulseGain)
    osc.start(time)
    osc.stop(time + dur + 0.1)
  }

  private bellNote(anchor?: number): number {
    const m = this.model
    const base = 5 + Math.floor(Math.random() * (1 + m.harmonicBreadth * 5))
    const idx = anchor !== undefined ? Math.min(SCALE.length - 1, anchor + (Math.random() < 0.5 ? -1 : 1)) : base
    return SCALE[Math.max(0, Math.min(SCALE.length - 1, idx))] * 2
  }

  private playBell(time: number, freq: number, panVal: number): void {
    if (!this.ctx || !this.pulseGain) return
    const m = this.model
    const g = this.ctx.createGain()
    const amp = 0.05 + m.vitality * 0.11
    g.gain.setValueAtTime(0.0001, time)
    g.gain.exponentialRampToValueAtTime(amp, time + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, time + 2.4)
    const pan = this.ctx.createStereoPanner()
    pan.pan.value = panVal
    const partials: [number, number][] = [
      [1, 1],
      [2.756, 0.4],
      [5.4, 0.15],
    ]
    for (const [ratio, gain] of partials) {
      const osc = this.ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq * ratio
      const og = this.ctx.createGain()
      og.gain.value = gain
      osc.connect(og)
      og.connect(g)
      osc.start(time)
      osc.stop(time + 2.6)
    }
    g.connect(pan)
    pan.connect(this.pulseGain)
  }

  private playLeak(time: number): void {
    if (!this.ctx || !this.master || !this.noiseBuffer) return
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuffer
    const bp = this.ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 500 + Math.random() * 1400
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0.0001, time)
    g.gain.exponentialRampToValueAtTime(0.12, time + 0.03)
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.3)
    src.connect(bp)
    bp.connect(g)
    g.connect(this.master)
    src.start(time)
    src.stop(time + 0.4)
  }

  // ————— smoothing —————
  private rampAll(immediate: boolean): void {
    if (!this.ctx) return
    const m = this.model
    const t = this.ctx.currentTime
    const ramp = (param: AudioParam, value: number) => {
      if (immediate) param.setValueAtTime(value, t)
      else param.setTargetAtTime(value, t, TAU)
    }
    if (this.master) ramp(this.master.gain, 0.9 * this.volume * this.depth)
    if (this.windGain) ramp(this.windGain.gain, (0.16 + (1 - m.vitality) * 0.55) * 0.4)
    if (this.windFilter) ramp(this.windFilter.frequency, 350 + m.freedom * 1400)
    if (this.droneGain) ramp(this.droneGain.gain, 0.1 + m.vitality * 0.13)
    if (this.droneFilter) ramp(this.droneFilter.frequency, 200 + m.freedom * 900)
    if (this.droneOscA) ramp(this.droneOscA.frequency, 55 + m.vitality * 20)
    if (this.droneOscB) ramp(this.droneOscB.frequency, (55 + m.vitality * 20) * 1.5)
    if (this.pulseGain) ramp(this.pulseGain.gain, 0.22 + m.vitality * 0.4)
    if (this.delay) ramp(this.delay.delayTime, 0.2 + (1 - m.coherence) * 0.18 + m.freedom * 0.28)
    if (this.feedback) ramp(this.feedback.gain, 0.08 + m.freedom * 0.28 + m.coherence * 0.1)
  }
}

let engine: AudioEngine | null = null

export function getAudioEngine(): AudioEngine {
  if (!engine) engine = new AudioEngine()
  return engine
}

export function getAudioDebug(): EngineDebug {
  return getAudioEngine().getDebug()
}

// Small debug hook for smoke tests (engine must never be duplicated).
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).__VF_AUDIO__ = { debug: getAudioDebug }
}
