import { useState } from 'react'
import { CASES } from '../data/cases'
import { ARCHETYPES } from '../data/archetypes'

interface Props {
  onOpenConditional: () => void
}

// Shared geometry — both sides show the same shape on purpose:
// plateau → sharp drop → long low base.
const GEO_PATH = 'M8,34 L132,34 C142,34 150,42 156,58 C164,80 172,96 186,98 L292,98'

export default function CaseCompare({ onOpenConditional }: Props) {
  const [left, setLeft] = useState('wuxi')
  const [right, setRight] = useState('poly')

  const L = CASES.find((c) => c.id === left)!
  const R = CASES.find((c) => c.id === right)!
  const LA = ARCHETYPES.find((a) => a.id === L.archetypeId)!
  const RA = ARCHETYPES.find((a) => a.id === R.archetypeId)!

  const picker = (side: 'left' | 'right') => (
    <div>
      <span className="cond-tag" style={{ display: 'block', marginBottom: 6 }}>
        {side === 'left' ? '案例 A · Case A' : '案例 B · Case B'}
      </span>
      <div className="compare-pickers">
      {CASES.map((c) => (
        <button
          key={c.id}
          className={'pick-btn' + ((side === 'left' ? left : right) === c.id ? ' selected' : '')}
          onClick={() => (side === 'left' ? setLeft(c.id) : setRight(c.id))}
        >
          {c.company}
        </button>
      ))}
      </div>
    </div>
  )

  const column = (cs: typeof L, arch: typeof LA) => (
    <div className="compare-col">
      <h3>{cs.company}</h3>
      <div className="sub">{arch.nameEn} · {arch.nameZh}</div>
      <div className="geo-panel">
        <svg viewBox="0 0 300 130">
          <path d={GEO_PATH} stroke="#8a7347" strokeWidth="1.6" fill="none" />
          <circle cx="186" cy="98" r="3" fill="#8a7347" />
        </svg>
        <span className="same-tag">GEOMETRY · 价格几何（相似）</span>
      </div>
      <div className="col-title" style={{ marginTop: 14 }}>STRUCTURAL POTENTIAL · 结构势能</div>
      <ul className="sp-list">
        {cs.structuralPotential.map((s) => <li key={s}>{s}</li>)}
      </ul>
    </div>
  )

  return (
    <div>
      <p className="eyebrow">Compare Cases · 对照案例</p>
      <h2 className="panel-title-zh">Geometry 相似，Structural Potential 完全不同</h2>
      <span className="panel-title-en">Same shape · different generator</span>

      {picker('left')}
      {picker('right')}

      <div className="compare-grid">
        {column(L, LA)}
        <div className="compare-mid">
          <span className="compare-vs">VS</span>
          <div className="formula-box">
            <div className="f">P(Y|P, C<sub>1</sub>) ≠ P(Y|P, C<sub>2</sub>)</div>
          </div>
          <div className="compare-quote">
            <p className="zh">几何没有脱离生成条件的独立意义。</p>
            <p>Geometry has no independent meaning outside its generative conditions.</p>
          </div>
          <button className="btn btn-primary" onClick={onOpenConditional}>
            法无自性 · Conditional Geometry →
          </button>
        </div>
        {column(R, RA)}
      </div>
    </div>
  )
}
