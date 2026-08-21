import { useState } from 'react'
import { DIAGNOSIS_GROUPS, BOTTLENECK_MAP, CONFIG_TEXTS } from '../data/diagnosis'
import type { DiagnosisDimension } from '../data/diagnosis'
import { average, quadrantKey } from '../utils/phi'

interface Props {
  onApply: (v: number, f: number, eta: number) => void
  hasNow: boolean
  onAddToTrajectory: (v: number, f: number, eta: number, replace: boolean) => void
}

const DEFAULT = 50

export default function Diagnosis({ onApply, hasNow, onAddToTrajectory }: Props) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    for (const g of DIAGNOSIS_GROUPS) {
      for (const d of g.dims) init[d.id] = DEFAULT
    }
    return init
  })

  const groupAvg = (id: string) => {
    const g = DIAGNOSIS_GROUPS.find((x) => x.id === id)!
    return average(g.dims.map((d) => values[d.id]))
  }

  const vScore = groupAvg('vitality')
  const fScore = groupAvg('freedom')
  const aScore = groupAvg('architecture')

  // Bottleneck: lowest group → lowest dimension inside it.
  const groups = [
    { id: 'vitality', avg: vScore },
    { id: 'freedom', avg: fScore },
    { id: 'architecture', avg: aScore },
  ]
  groups.sort((a, b) => a.avg - b.avg)
  const weakestGroup = DIAGNOSIS_GROUPS.find((g) => g.id === groups[0].id)!
  let weakestDim: DiagnosisDimension = weakestGroup.dims[0]
  for (const d of weakestGroup.dims) {
    if (values[d.id] < values[weakestDim.id]) weakestDim = d
  }
  const bottleneck = BOTTLENECK_MAP[weakestDim.id] ?? BOTTLENECK_MAP.selection

  const key = quadrantKey(vScore, fScore)
  const config = CONFIG_TEXTS[key]
  const dotX = 14 + (fScore / 100) * 90
  const dotY = 104 - (vScore / 100) * 90

  const setDim = (id: string, n: number) => {
    setValues((prev) => ({ ...prev, [id]: n }))
  }

  const reset = () => {
    const init: Record<string, number> = {}
    for (const g of DIAGNOSIS_GROUPS) {
      for (const d of g.dims) init[d.id] = DEFAULT
    }
    setValues(init)
  }

  return (
    <div>
      <p className="eyebrow">Where Am I Now? · 当前我在哪里？</p>
      <h2 className="panel-title-zh">当前我在哪里？</h2>
      <span className="panel-title-en">Reflective System Diagnostic · 反思性系统诊断</span>
      <p className="diag-intro">
        这不是人格测试，也不是投资能力评分。它是一个反思工具：分别检查生命力、自由度与架构三个维度，
        找到当前配置的瓶颈，并给出一个行动方向。
      </p>

      <div className="diag-groups">
        {DIAGNOSIS_GROUPS.map((g) => (
          <section key={g.id} className="diag-group">
            <h3>
              {g.titleZh}
              <span className="en">{g.titleEn}</span>
            </h3>
            <div className="diag-group-avg">
              AVG {Math.round(groupAvg(g.id))} / 100
            </div>
            {g.dims.map((d) => (
              <div key={d.id} className="diag-slider">
                <div className="row">
                  <span className="name">
                    {d.labelZh}
                    <small>{d.labelEn}</small>
                  </span>
                  <span className="val">{values[d.id]}</span>
                </div>
                <input
                  className="vf-slider"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={values[d.id]}
                  onChange={(e) => setDim(d.id, Number(e.target.value))}
                  aria-label={d.labelZh + ' ' + d.labelEn}
                />
              </div>
            ))}
          </section>
        ))}
      </div>

      <div className="diag-result">
        <div>
          <h3>Current Configuration · 当前配置</h3>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div className="mini-quad" aria-hidden="true">
              <span className="mini-label" style={{ top: 6, left: 8 }}>V↑</span>
              <span className="mini-label" style={{ bottom: 6, right: 8 }}>F→</span>
              <span className="mini-dot" style={{ left: dotX + 'px', top: dotY + 'px' }} />
            </div>
            <div>
              <p className="result-config">{config.line}</p>
              <p className="result-note">{config.note}</p>
            </div>
          </div>
          <p className="result-label">Primary Bottleneck · 主要瓶颈</p>
          <p className="result-text">
            <strong className="gold">{bottleneck.bottleneckZh}</strong>
            <span className="faint"> · {bottleneck.bottleneck}</span>
          </p>
          <p className="result-label">Current Risk · 当前风险</p>
          <p className="result-text">{bottleneck.risk}</p>
        </div>
        <div>
          <h3>One Suggested Direction · 一个建议方向</h3>
          <p className="result-text" style={{ fontSize: 14, lineHeight: 1.9 }}>
            {bottleneck.direction}
          </p>
          <p className="result-label">维度概览</p>
          <p className="result-text">
            V {Math.round(vScore)} · F {Math.round(fScore)} · A {Math.round(aScore)}
            <span className="faint">（概念性平均值，无总分排名）</span>
          </p>
          <div className="panel-foot" style={{ marginTop: 18 }}>
            <button
              className="btn btn-primary"
              onClick={() => onApply(Math.round(vScore), Math.round(fScore), aScore / 100)}
            >
              应用到象限世界 · Apply to World
            </button>
            <button
              className="btn"
              onClick={() => onAddToTrajectory(Math.round(vScore), Math.round(fScore), aScore / 100, false)}
            >
              Add to Trajectory 加入轨迹
            </button>
            {hasNow && (
              <button
                className="btn btn-ghost"
                onClick={() => onAddToTrajectory(Math.round(vScore), Math.round(fScore), aScore / 100, true)}
              >
                Replace Now 替换当前
              </button>
            )}
            <button className="btn btn-ghost" onClick={reset}>
              重置 Reset
            </button>
          </div>
        </div>
      </div>

      <p className="disclaimer">
        免责声明：本模块是概念性自我反思工具，不构成投资建议，也不是心理测评。所有数值均为概念性状态描述，而非测量评分。
      </p>
    </div>
  )
}
