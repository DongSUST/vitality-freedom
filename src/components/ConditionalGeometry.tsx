import { useState } from 'react'

type CondId = 'shock' | 'decay' | 'regime'

// The same geometry stays fixed in the center. Only the generative
// condition changes — and with it, the outcome path.
const GEOMETRY_PATH = 'M12,60 C40,56 70,58 100,57 C150,55 190,57 240,58 C268,58 290,64 310,86 C330,108 350,132 380,140 L452,142'

const CONDITIONS: { id: CondId; zh: string; en: string }[] = [
  { id: 'shock', zh: '强系统 + 外部冲击', en: 'Strong System + External Shock' },
  { id: 'decay', zh: '结构衰减', en: 'Structural Decay' },
  { id: 'regime', zh: '体制切换', en: 'Regime Shift' },
]

const OUTCOME_PATHS: Record<CondId, string> = {
  shock: 'M20,150 C70,146 100,122 130,108 C165,92 200,78 230,66 C260,56 285,50 300,47',
  decay: 'M20,42 C60,44 85,62 110,74 C140,88 165,102 195,116 C225,130 250,142 285,151 L300,154',
  regime: 'M20,58 L118,58 C128,58 136,64 140,78 C146,98 156,118 176,132 C196,146 224,154 260,157 L300,159',
}

const OUTCOME_TEXT: Record<CondId, { zh: string; en: string }> = {
  shock: {
    zh: '冲击被吸收，机器恢复运行，修复缺口被重新定价。',
    en: 'The shock is absorbed; the machine keeps running; the mispricing closes.',
  },
  decay: {
    zh: '价格便宜，持续变得更便宜——价值随结构一起衰减。',
    en: 'Cheap gets cheaper as the structure decays alongside the price.',
  },
  regime: {
    zh: '均值回归不再发生，旧中枢永久失效。',
    en: 'Mean reversion fails; the old regime is gone for good.',
  },
}

export default function ConditionalGeometry() {
  const [cond, setCond] = useState<CondId>('shock')

  return (
    <div>
      <p className="eyebrow">Conditional Geometry · 法无自性</p>
      <h2 className="panel-title-zh">法无自性 · Conditional Geometry</h2>
      <span className="panel-title-en">Geometry has no independent meaning outside its generative conditions</span>

      <div className="cond-center">
        <div className="cond-geo-frame">
          <svg viewBox="0 0 464 200">
            <path d={GEOMETRY_PATH} stroke="#8a7347" strokeWidth="1.8" fill="none" />
            <circle cx="380" cy="140" r="4" fill="#8a7347" />
          </svg>
        </div>
        <span className="cond-tag">The same geometry · 同一几何形态</span>

        <div className="cond-tabs" role="tablist" aria-label="生成条件">
          {CONDITIONS.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={cond === c.id}
              className={'cond-tab' + (cond === c.id ? ' active' : '')}
              onClick={() => setCond(c.id)}
            >
              {c.zh}
              <small>C = {c.en}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="cond-result">
        <div>
          <div className="cond-outcome-frame">
            <svg viewBox="0 0 320 170">
              {(Object.keys(OUTCOME_PATHS) as CondId[]).map((id) => (
                <path
                  key={id}
                  className={'outcome-path' + (cond === id ? ' active' : '')}
                  d={OUTCOME_PATHS[id]}
                  stroke={id === 'shock' ? '#8fb59b' : '#c07a52'}
                  strokeWidth="2"
                  fill="none"
                />
              ))}
            </svg>
          </div>
          <div className="cond-outcome-text">
            <p className="zh">{OUTCOME_TEXT[cond].zh}</p>
            <p className="en">{OUTCOME_TEXT[cond].en}</p>
          </div>
        </div>

        <div className="cond-explain">
          <div className="formula-box" style={{ margin: 0 }}>
            <p className="dim small" style={{ marginBottom: 6 }}>传统经验 · Traditional heuristic</p>
            <div className="f">P(Y|P)</div>
            <p className="dim small" style={{ margin: '10px 0 6px' }}>条件生成 · Conditional generation</p>
            <div className="f">P(Y|P, C)</div>
          </div>
          <div className="formula-box" style={{ margin: 0 }}>
            <div className="f">P(Y|P, C<sub>1</sub>) ≠ P(Y|P, C<sub>2</sub>)</div>
            <p className="dim small" style={{ marginTop: 8, marginBottom: 0 }}>
              C = Meta Field + Structural Potential + Market Field
            </p>
          </div>
          <div className="cond-inference">
            <p className="zh">上层生成机制的不相似，优先于下层价格几何的相似。</p>
            <p className="en">Higher-layer mismatch overrides lower-layer resemblance.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
