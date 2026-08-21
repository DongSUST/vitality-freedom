import { useState } from 'react'
import type { TrajectoryNode } from '../trajectory/trajectoryTypes'

interface Props {
  nodes: TrajectoryNode[]
  playing: boolean
  canAddMore: boolean
  onAdd: () => void
  onApply: (id: string) => void
  onRemove: (id: string) => void
  onRename: (id: string, label: string) => void
  onPlay: () => void
  onStop: () => void
  onClear: () => void
  onLoadSample: () => void
  onExplore: (dim: 'v' | 'f' | 'a') => void
}

// Session memory of system states, docked inside the world controls.
export default function TrajectoryControls(props: Props) {
  const {
    nodes, playing, canAddMore,
    onAdd, onApply, onRemove, onRename, onPlay, onStop, onClear, onLoadSample, onExplore,
  } = props
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const startEdit = (n: TrajectoryNode) => {
    setEditingId(n.id)
    setEditText(n.label)
  }

  const commitEdit = () => {
    if (editingId) onRename(editingId, editText.trim() || 'State')
    setEditingId(null)
  }

  return (
    <div className="traj-ctl">
      <button
        className="traj-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="状态轨迹 Trajectory"
      >
        TRACK · 轨迹 {nodes.length}/5 {open ? '▴' : '▾'}
      </button>

      {open && (
        <div className="traj-body">
          {nodes.length === 0 && (
            <p className="traj-empty tiny">
              还没有状态节点。点击「添加当前状态」，或从诊断页加入。
            </p>
          )}
          {nodes.length > 0 && (
            <ul className="traj-list">
              {nodes.map((n) => (
                <li key={n.id} className="traj-chip">
                  {editingId === n.id ? (
                    <input
                      className="traj-edit"
                      value={editText}
                      autoFocus
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitEdit()
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      aria-label="节点标签"
                    />
                  ) : (
                    <>
                      <button className="traj-chip-apply" onClick={() => onApply(n.id)}>
                        <i className={'traj-dot kind-' + n.kind} />
                        {n.label}
                      </button>
                      <span className="traj-chip-meta tiny">
                        {n.kind} · V{n.v} F{n.f} η{Math.round(n.eta * 100)}
                      </span>
                      <button className="traj-chip-btn traj-chip-edit" onClick={() => startEdit(n)} aria-label="编辑标签">
                        ✎
                      </button>
                      <button className="traj-chip-btn traj-chip-del" onClick={() => onRemove(n.id)} aria-label="删除节点">
                        ×
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="traj-actions">
            <button className="btn-small primary" disabled={!canAddMore} onClick={onAdd}>
              ＋ 添加当前状态
            </button>
            <button className="btn-small primary" disabled={nodes.length < 2 || playing} onClick={onPlay}>
              ▶ Play Trajectory
            </button>
            {playing && (
              <button className="btn-small" onClick={onStop}>
                ■ Stop
              </button>
            )}
            <button className="btn-small" onClick={onLoadSample}>
              载入示例 Load Sample
            </button>
            <button className="btn-small" onClick={onClear}>
              清空 Clear
            </button>
          </div>

          <div className="traj-explore tiny">
            <span>Explore Change 反事实探索：</span>
            <span className="row">
              <button className="btn-small" disabled={!canAddMore} onClick={() => onExplore('v')}>
                + Vitality
              </button>
              <button className="btn-small" disabled={!canAddMore} onClick={() => onExplore('f')}>
                + Freedom
              </button>
              <button className="btn-small" disabled={!canAddMore} onClick={() => onExplore('a')}>
                + Architecture
              </button>
            </span>
            <span>Exploratory state · not a prediction（探索性状态，非预测）</span>
          </div>
        </div>
      )}
    </div>
  )
}
