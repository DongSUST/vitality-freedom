import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getAudioEngine } from './audio/AudioEngine'
import type { TrajectoryNode } from './trajectory/trajectoryTypes'
import { createNode, nextKind, defaultLabel, sortedNodes, canAdd } from './trajectory/trajectoryModel'
import { sampleTrajectory } from './trajectory/trajectoryPresets'
import { REFORM_MS, SEGMENT_MS, SEGMENT_MS_REDUCED, easeInOutCubic } from './utils/transitions'
import SoundControl from './components/SoundControl'
import Starfield from './components/Starfield'
import Entrance from './components/Entrance'
import TopBar from './components/TopBar'
import QuadrantMatrix from './components/QuadrantMatrix'
import ArchitectureReveal from './components/ArchitectureReveal'
import ThreeLayers from './components/ThreeLayers'
import StructuralPotential from './components/StructuralPotential'
import ArchetypeAtlas from './components/ArchetypeAtlas'
import CaseDetail from './components/CaseDetail'
import CaseCompare from './components/CaseCompare'
import ConditionalGeometry from './components/ConditionalGeometry'
import Diagnosis from './components/Diagnosis'
import About from './components/About'
import { CASES } from './data/cases'
import { ARCHETYPES } from './data/archetypes'

type View =
  | 'architecture'
  | 'layers'
  | 'structural'
  | 'atlas'
  | 'case'
  | 'compare'
  | 'conditional'
  | 'diagnosis'
  | 'about'

const VIEW_IDS: View[] = [
  'architecture',
  'layers',
  'structural',
  'atlas',
  'case',
  'compare',
  'conditional',
  'diagnosis',
  'about',
]

// Soundscape depth per module: world 100% → architecture 80% → cases 45–60% → diagnosis 35%.
const DEPTH_BY_VIEW: Record<string, number> = {
  world: 1,
  architecture: 0.8,
  layers: 0.8,
  structural: 0.8,
  atlas: 0.55,
  case: 0.45,
  compare: 0.45,
  conditional: 0.45,
  diagnosis: 0.35,
  about: 0.4,
}

const LEVELS: Record<View, string> = {
  architecture: 'LEVEL 1 · ARCHITECTURE · 架构',
  layers: 'LEVEL 2 · META / STRUCTURE / MARKET · 三层',
  structural: 'LEVEL 3 · STRUCTURAL POTENTIAL · 结构势能',
  atlas: 'LEVEL 4 · ARCHETYPE ATLAS · 案例原型库',
  case: 'LEVEL 5 · CASE STUDY · 具体案例',
  compare: 'LEVEL 5 · COMPARE · 对照',
  conditional: 'LEVEL 5 · CONDITIONAL GEOMETRY · 法无自性',
  diagnosis: 'REFLECTIVE · DIAGNOSIS · 诊断',
  about: 'ABOUT · 关于',
}

function Panel({ level, onClose, children }: { level: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="panel-overlay scroll-area">
      <div className="panel">
        <div className="panel-chrome">
          <span className="panel-level">{level}</span>
          <button className="panel-close" onClick={onClose} aria-label="关闭并返回上一层">
            ✕ 返回
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// Deep links: ?enter=1 skips the entrance, ?view=layers opens a panel directly.
const initialQuery = new URLSearchParams(window.location.search)
const initialView = initialQuery.get('view')
const initialCase = initialQuery.get('case')
const debugVisual = initialQuery.get('debug') === 'visual'

export default function App() {
  const [entered, setEntered] = useState(() => initialQuery.has('enter') || initialQuery.has('view'))
  const [leaving, setLeaving] = useState(false)
  const [entranceGone, setEntranceGone] = useState(() => initialQuery.has('enter') || initialQuery.has('view'))
  const [stack, setStack] = useState<View[]>(() =>
    initialView && VIEW_IDS.indexOf(initialView as View) !== -1 ? [initialView as View] : [],
  )
  const [caseId, setCaseId] = useState(initialCase && CASES.some((c) => c.id === initialCase) ? initialCase : 'wuxi')
  const [v, setV] = useState(50)
  const [f, setF] = useState(50)
  const [eta, setEta] = useState(0.62)
  const [reforming, setReforming] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [soundVolume, setSoundVolume] = useState(0.85)
  const [nodes, setNodes] = useState<TrajectoryNode[]>([])
  const [playing, setPlaying] = useState(false)
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const rafRef = useRef(0)
  const timerRef = useRef(0)
  const stopRef = useRef(false)

  const view = stack.length > 0 ? stack[stack.length - 1] : 'world'

  const enter = () => {
    setLeaving(true)
    setEntered(true)
    window.setTimeout(() => setEntranceGone(true), 1100)
  }

  const open = (nv: View) => setStack((s) => [...s, nv])
  const close = () => setStack((s) => s.slice(0, -1))

  const openCase = (id: string) => {
    setCaseId(id)
    setStack((s) => [...s, 'case'])
  }

  const goto = (nv: View) => setStack([nv])

  const resetView = () => {
    setStack([])
    setV(50)
    setF(50)
    setEta(0.62)
  }

  // Escape closes the top panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stack.length > 0) close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const caseIndex = CASES.findIndex((c) => c.id === caseId)
  const currentCase = CASES[caseIndex] ?? CASES[0]
  const currentArchetype =
    ARCHETYPES.find((a) => a.id === currentCase.archetypeId) ?? ARCHETYPES[0]

  // Diagnosis → world: a state transition (old world → reform → new world).
  const applyDiagnosis = (nv: number, nf: number, neta: number) => {
    setV(nv)
    setF(nf)
    setEta(neta)
    setStack([])
    setReforming(true)
    window.setTimeout(() => setReforming(false), REFORM_MS + 600)
  }

  // ————— Sound: world state layer, default OFF —————
  const soundDepth = playing ? 1 : (DEPTH_BY_VIEW[view] ?? 1)

  useEffect(() => {
    if (soundOn) getAudioEngine().setWorld(v, f, eta, soundDepth)
  }, [v, f, eta, soundOn, soundDepth])

  useEffect(() => {
    if (soundOn) getAudioEngine().setVolume(soundVolume)
  }, [soundOn, soundVolume])

  const toggleSound = () => {
    if (soundOn) {
      getAudioEngine().fadeOutAndStop()
      setSoundOn(false)
    } else {
      setSoundOn(true)
      const engine = getAudioEngine()
      engine.start()
      engine.setVolume(soundVolume)
      engine.setWorld(v, f, eta, soundDepth)
    }
  }

  // ————— Trajectory: session memory of system states —————
  const stopTrajectory = () => {
    stopRef.current = true
    if (typeof window.cancelAnimationFrame === 'function') window.cancelAnimationFrame(rafRef.current)
    window.clearTimeout(timerRef.current)
    setPlaying(false)
  }

  const playTrajectory = () => {
    if (playing) return
    const seq = sortedNodes(nodes)
    if (seq.length < 2) return
    stopRef.current = false
    setPlaying(true)
    const segDur = reducedMotion ? SEGMENT_MS_REDUCED : SEGMENT_MS
    let seg = 0
    const runSeg = () => {
      if (stopRef.current || seg >= seq.length - 1) {
        setPlaying(false)
        return
      }
      const from = seq[seg]
      const to = seq[seg + 1]
      const applyStep = (p: number) => {
        const e = easeInOutCubic(p)
        setV(Math.round(from.v + (to.v - from.v) * e))
        setF(Math.round(from.f + (to.f - from.f) * e))
        setEta(from.eta + (to.eta - from.eta) * e)
      }
      if (reducedMotion) {
        let step = 1
        const stepTick = () => {
          if (stopRef.current) {
            setPlaying(false)
            return
          }
          applyStep(step / 3)
          step++
          if (step <= 3) {
            timerRef.current = window.setTimeout(stepTick, segDur / 3)
          } else {
            seg++
            setReforming(true)
            window.setTimeout(() => setReforming(false), 700)
            runSeg()
          }
        }
        stepTick()
      } else {
        const t0 = performance.now()
        const frame = (t: number) => {
          if (stopRef.current) {
            setPlaying(false)
            return
          }
          const p = Math.min(1, (t - t0) / segDur)
          applyStep(p)
          if (p < 1) {
            rafRef.current = requestAnimationFrame(frame)
          } else {
            seg++
            setReforming(true)
            window.setTimeout(() => setReforming(false), 800)
            runSeg()
          }
        }
        rafRef.current = requestAnimationFrame(frame)
      }
    }
    runSeg()
  }

  const addNode = () => {
    setNodes((ns) => {
      if (!canAdd(ns)) return ns
      const kind = nextKind(ns)
      return [...ns, createNode(defaultLabel(kind), kind, v, f, eta)]
    })
  }

  const applyNode = (id: string) => {
    stopTrajectory()
    const n = nodes.find((x) => x.id === id)
    if (!n) return
    setV(n.v)
    setF(n.f)
    setEta(n.eta)
    setReforming(true)
    window.setTimeout(() => setReforming(false), REFORM_MS)
  }

  const removeNode = (id: string) => {
    stopTrajectory()
    setNodes((ns) => ns.filter((x) => x.id !== id))
  }

  const renameNode = (id: string, label: string) => {
    setNodes((ns) => ns.map((x) => (x.id === id ? { ...x, label } : x)))
  }

  const clearTrajectory = () => {
    stopTrajectory()
    setNodes([])
  }

  const loadSample = () => {
    stopTrajectory()
    setNodes(sampleTrajectory())
  }

  const exploreChange = (dim: 'v' | 'f' | 'a') => {
    const nv = dim === 'v' ? Math.min(100, v + 20) : v
    const nf = dim === 'f' ? Math.min(100, f + 20) : f
    const neta = dim === 'a' ? Math.min(1, eta + 0.2) : eta
    const label = dim === 'v' ? 'Future +V' : dim === 'f' ? 'Future +F' : 'Future +η'
    setNodes((ns) => (canAdd(ns) ? [...ns, createNode(label, 'future', nv, nf, neta)] : ns))
  }

  const addDiagnosisToTrajectory = (dv: number, df: number, deta: number, replace: boolean) => {
    setNodes((ns) => {
      if (replace) {
        return ns.map((x) => (x.kind === 'now' ? { ...x, v: dv, f: df, eta: deta } : x))
      }
      return canAdd(ns) ? [...ns, createNode('Now 现在', 'now', dv, df, deta)] : ns
    })
  }

  const renderPanel = (pv: View, index: number) => {
    const key = pv + index
    const common = {
      level: LEVELS[pv],
      onClose: close,
    }
    switch (pv) {
      case 'architecture':
        return (
          <Panel key={key} {...common}>
            <ArchitectureReveal eta={eta} onOpenLayers={() => open('layers')} />
          </Panel>
        )
      case 'layers':
        return (
          <Panel key={key} {...common}>
            <ThreeLayers
              onOpenStructural={() => open('structural')}
              onOpenAtlas={() => open('atlas')}
            />
          </Panel>
        )
      case 'structural':
        return (
          <Panel key={key} {...common}>
            <StructuralPotential onBack={close} />
          </Panel>
        )
      case 'atlas':
        return (
          <Panel key={key} {...common}>
            <ArchetypeAtlas onOpenCase={openCase} onOpenCompare={() => open('compare')} />
          </Panel>
        )
      case 'case':
        return (
          <Panel key={key} {...common}>
            <CaseDetail
              cs={currentCase}
              arch={currentArchetype}
              onPrev={() => setCaseId(CASES[(caseIndex - 1 + CASES.length) % CASES.length].id)}
              onNext={() => setCaseId(CASES[(caseIndex + 1) % CASES.length].id)}
              onCompare={() => open('compare')}
              onConditional={() => open('conditional')}
            />
          </Panel>
        )
      case 'compare':
        return (
          <Panel key={key} {...common}>
            <CaseCompare onOpenConditional={() => open('conditional')} />
          </Panel>
        )
      case 'conditional':
        return (
          <Panel key={key} {...common}>
            <ConditionalGeometry />
          </Panel>
        )
      case 'diagnosis':
        return (
          <Panel key={key} {...common}>
            <Diagnosis
              onApply={applyDiagnosis}
              hasNow={nodes.some((n) => n.kind === 'now')}
              onAddToTrajectory={addDiagnosisToTrajectory}
            />
          </Panel>
        )
      case 'about':
        return (
          <Panel key={key} {...common}>
            <About />
          </Panel>
        )
    }
  }

  return (
    <div className={'app' + (debugVisual ? ' debug-visual' : '')}>
      <Starfield />
      {entered && (
        <TopBar
          view={view}
          onExplore={() => setStack([])}
          onDiagnose={() => goto('diagnosis')}
          onCases={() => goto('atlas')}
          onAbout={() => open('about')}
          onReset={resetView}
          soundOn={soundOn}
          soundVolume={soundVolume}
          onToggleSound={toggleSound}
          onVolume={setSoundVolume}
        />
      )}

      {!entranceGone && <Entrance onEnter={enter} leaving={leaving} />}

      <div
        className={
          'world-wrap' +
          (entered ? ' visible' : '') +
          (stack.length > 0 ? ' dimmed' : '') +
          (reforming ? ' reforming' : '')
        }
      >
        <QuadrantMatrix
          v={v}
          f={f}
          eta={eta}
          nodes={nodes}
          playing={playing}
          onV={setV}
          onF={setF}
          onOpenArchitecture={() => open('architecture')}
          onApplyNode={applyNode}
          onAddNode={addNode}
          onRemoveNode={removeNode}
          onRenameNode={renameNode}
          onPlayTrajectory={playTrajectory}
          onStopTrajectory={stopTrajectory}
          onClearTrajectory={clearTrajectory}
          onLoadSample={loadSample}
          onExploreChange={exploreChange}
        />
      </div>

      {stack.map((pv, i) => renderPanel(pv, i))}
    </div>
  )
}
