const NODES = [
  {
    en: 'Asset Substrate',
    zh: '资产基底',
    note: '资产本身的系统强度：平台、网络、现金流、护城河。这是「机器」本身。',
  },
  {
    en: 'Shock Topology',
    zh: '冲击拓扑',
    note: '冲击来自何处、作用在系统的哪一环，是否伤及生成机制。',
  },
  {
    en: 'Recovery Vector',
    zh: '恢复向量',
    note: '系统自我修复的方向与速度，以及修复所需的能量是否可得。',
  },
  {
    en: 'Mispricing Potential',
    zh: '错误定价潜力',
    note: '叙事与现实的缺口——被错误定价的空间，才是机会所在。',
  },
]

interface Props {
  onBack: () => void
}

export default function StructuralPotential({ onBack }: Props) {
  return (
    <div>
      <p className="eyebrow">Structural Potential · 结构势能</p>
      <h2 className="panel-title-zh">Structural Potential 结构势能</h2>
      <span className="panel-title-en">Zoom into Layer 2</span>
      <p className="panel-lead">
        结构势能回答一个更锋利的问题：为什么偏偏是这家公司？它把「便宜」与「好」拆开——
        好的资产与好的价格，是两个完全不同的问题。
      </p>

      <div className="case-cols" style={{ marginTop: 22 }}>
        {NODES.map((n, i) => (
          <section key={n.en}>
            <div className="col-title">
              {String(i + 1).padStart(2, '0')} · {n.en}
            </div>
            <p className="dim small" style={{ marginBottom: 4 }}>{n.zh}</p>
            <p className="dim small" style={{ fontSize: 12, marginBottom: 0 }}>{n.note}</p>
          </section>
        ))}
      </div>

      <div className="chain-row" style={{ marginTop: 22 }}>
        {NODES.map((n, i) => (
          <span key={n.en} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span className="chain-node">{n.en}<em>{n.zh}</em></span>
            {i < NODES.length - 1 && <span className="chain-arrow">→</span>}
          </span>
        ))}
      </div>

      <div className="principle-box" style={{ marginTop: 22 }}>
        <p className="principle-line">
          Strong Asset <span className="neq">≠</span> Good Price
          <span style={{ color: 'var(--c-gold-deep)', margin: '0 12px' }}>·</span>
          Low Price <span className="neq">≠</span> Strong Asset
        </p>
        <p className="principle-note">
          真正寻找：
          <span className="target-line"> Strong System + Meaningful Compression + Recoverable Shock</span>
        </p>
      </div>

      <div className="panel-foot">
        <button className="btn btn-ghost" onClick={onBack}>
          ← 返回三层
        </button>
      </div>
    </div>
  )
}
