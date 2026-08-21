import { useEffect, useRef, useState } from 'react'
import Terrain from './Terrain'
import EffectivePotential from './EffectivePotential'
import TrajectoryControls from './TrajectoryControls'
import { QUADRANTS, QUADRANT_TEXT } from '../data/framework'
import { phiNorm, quadrantInfo } from '../utils/phi'
import { phiState } from '../utils/visuals'
import type { TrajectoryNode } from '../trajectory/trajectoryTypes'
import { MAX_NODES } from '../trajectory/trajectoryTypes'
import { sortedNodes } from '../trajectory/trajectoryModel'

interface Props {
  v: number
  f: number
  eta: number
  nodes: TrajectoryNode[]
  playing: boolean
  onV: (n: number) => void
  onF: (n: number) => void
  onOpenArchitecture: () => void
  onApplyNode: (id: string) => void
  onAddNode: () => void
  onRemoveNode: (id: string) => void
  onRenameNode: (id: string, label: string) => void
  onPlayTrajectory: () => void
  onStopTrajectory: () => void
  onClearTrajectory: () => void
  onLoadSample: () => void
  onExploreChange: (dim: 'v' | 'f' | 'a') => void
}

const TICKS = [0, 25, 50, 75, 100]

function posOf(v: number, f: number): { x: number; y: number } {
  return { x: 8 + (f / 100) * 84, y: 92 - (v / 100) * 84 }
}

export default function QuadrantMatrix({
  v, f, eta, nodes, playing,
  onV, onF, onOpenArchitecture,
  onApplyNode, onAddNode, onRemoveNode, onRenameNode,
  onPlayTrajectory, onStopTrajectory, onClearTrajectory, onLoadSample, onExploreChange,
}: Props) {
  const quad = quadrantInfo(v, f)
  const phi = phiNorm(v, f, eta)
  const st = phiState(phi)
  const text = QUADRANT_TEXT[quad.id] ?? QUADRANT_TEXT.stagnation
  const x = 8 + (f / 100) * 84
  const y = 92 - (v / 100) * 84
  const traj = sortedNodes(nodes)
  const linePts = traj.map((n) => {
    const pt = posOf(n.v, n.f)
    return pt.x.toFixed(2) + ',' + pt.y.toFixed(2)
  }).join(' ')

  // Previous → current trail: a fading ghost marks state migration.
  const prevRef = useRef<{ x: number; y: number } | null>(null)
  const [ghost, setGhost] = useState<{ x: number; y: number; k: number } | null>(null)
  useEffect(() => {
    if (prevRef.current && (prevRef.current.x !== x || prevRef.current.y !== y)) {
      setGhost({ x: prevRef.current.x, y: prevRef.current.y, k: Date.now() })
    }
    prevRef.current = { x, y }
  }, [x, y])

  return (
    <div className="world">
      <div className="scene">
        <Terrain v={v} f={f} eta={eta} idPrefix="world" />
        <div className="scene-grid" />
        <div className="scene-vignette" />
        <div className="scene-bracket tl" />
        <div className="scene-bracket br" />

        {/* 16:9 core information safe zone — landscape can exceed it, info cannot */}
        <div className="scene-safe">
          {/* axes */}
          <div className="axis-v" />
          <div className="axis-h" />
          <span className="axis-label axis-label-v">VITALITY · 生命力</span>
          <span className="axis-label axis-label-h">FREEDOM · 自由度</span>
          {TICKS.map((t) => {
            const pos = 8 + (t / 100) * 84
            const vPos = 8 + (1 - t / 100) * 84
            return (
              <span key={'tv' + t}>
                <i className="axis-tick axis-tick-v" style={{ top: vPos + '%' }} />
                <i className="axis-tick-label axis-tick-label-v" style={{ top: vPos + '%' }}>{t}</i>
                <i className="axis-tick axis-tick-h" style={{ left: pos + '%' }} />
                <i className="axis-tick-label axis-tick-label-h" style={{ left: pos + '%' }}>{t}</i>
              </span>
            )
          })}

          {/* quadrant corner cards */}
          {QUADRANTS.map((qd) => (
            <div key={qd.id} className={'quad-card quad-' + qd.id + (qd.id === quad.id ? ' active' : '')}>
              <div className="quad-name serif">{qd.nameZh}</div>
              <div className="quad-en">{qd.nameEn}</div>
              <div className="quad-keys">
                {qd.keywords.map((k) => (
                  <span key={k}>{k}</span>
                ))}
              </div>
            </div>
          ))}

          {/* migration ghost (fades within seconds) */}
          {ghost && (
            <span
              key={ghost.k}
              className="state-point-ghost"
              style={{ left: ghost.x + '%', top: ghost.y + '%' }}
            />
          )}

          {/* trajectory — temporal state layer */}
          {traj.length > 1 && (
            <svg className={'traj-line' + (playing ? ' playing' : '')} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline points={linePts} vectorEffect="non-scaling-stroke" />
            </svg>
          )}
          {traj.map((n) => {
            const pt = posOf(n.v, n.f)
            return (
              <button
                key={n.id}
                className={'traj-node kind-' + n.kind}
                style={{
                  left: pt.x + '%',
                  top: pt.y + '%',
                  opacity: 0.45 + 0.55 * n.eta,
                  borderStyle: n.eta < 0.45 ? 'dotted' : 'solid',
                }}
                onClick={() => onApplyNode(n.id)}
                aria-label={'轨迹节点 ' + n.label + ' V' + n.v + ' F' + n.f + ' η' + Math.round(n.eta * 100)}
              >
                <span className="traj-node-label tiny">{n.label}</span>
              </button>
            )
          })}

          {/* moving state point */}
          <div className="state-point" style={{ left: x + '%', top: y + '%' }}>
            <span className="state-point-halo" />
            <span className="state-point-ring" />
            <span className="state-point-core" />
          </div>

          {/* center core */}
          <EffectivePotential phi={phi} onOpen={onOpenArchitecture} />

          {/* readout — short, embodied, no score */}
          <div className="readout">
            <p className="eyebrow">Current State · 当前状态</p>
            <span className="readout-state-en">{quad.nameEn.toUpperCase()}</span>
            <h2 className="readout-state serif">
              {quad.stateLine}
              <span className="readout-zh"> · {quad.nameZh}</span>
            </h2>
            <p className="readout-summary">{text.summary}</p>
            <p className="readout-watch tiny">
              <i>Watch</i> — {text.watch}
            </p>
            <p className="readout-phi tiny faint">
              Φ · {st.en.toUpperCase()} {st.zh} · Conceptual System State（非评分）
            </p>
          </div>

          {/* controls */}
          <div className="dock">
            <div className="dock-title">State Controls · 状态控制</div>
            <label className="slider-row">
              <span className="slider-name">VITALITY</span>
              <input
                className="vf-slider"
                type="range"
                min={0}
                max={100}
                step={1}
                value={v}
                onChange={(e) => onV(Number(e.target.value))}
                aria-label="生命力 Vitality"
              />
              <span className="slider-val">{v}</span>
            </label>
            <label className="slider-row">
              <span className="slider-name">FREEDOM</span>
              <input
                className="vf-slider"
                type="range"
                min={0}
                max={100}
                step={1}
                value={f}
                onChange={(e) => onF(Number(e.target.value))}
                aria-label="自由度 Freedom"
              />
              <span className="slider-val">{f}</span>
            </label>
            <div className="dock-eta">
              <svg className="eta-glyph" viewBox="0 0 64 18" aria-hidden="true">
                <g className="eta-chaotic" opacity={1 - eta}>
                  <path d="M2,3 C18,16 30,-2 44,8 C50,12 56,11 62,9" />
                  <path d="M2,9 C20,18 34,0 48,9 C54,13 58,12 62,9" />
                  <path d="M2,15 C16,4 32,20 46,10 C52,7 58,8 62,9" />
                </g>
                <g className="eta-clear" opacity={eta}>
                  <path d="M2,5 C20,5 40,8 62,9" />
                  <path d="M2,9 C20,9 40,9 62,9" />
                  <path d="M2,13 C20,13 40,10 62,9" />
                </g>
              </svg>
              <span>
                η<sub>A</sub> {Math.round(eta * 100)} · architecture efficiency
              </span>
            </div>

            <TrajectoryControls
              nodes={traj}
              playing={playing}
              canAddMore={nodes.length < MAX_NODES}
              onAdd={onAddNode}
              onApply={onApplyNode}
              onRemove={onRemoveNode}
              onRename={onRenameNode}
              onPlay={onPlayTrajectory}
              onStop={onStopTrajectory}
              onClear={onClearTrajectory}
              onLoadSample={onLoadSample}
              onExplore={onExploreChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
