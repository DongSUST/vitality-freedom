import { THREE_LAYERS } from '../data/framework'

interface Props {
  onOpenStructural: () => void
  onOpenAtlas: () => void
}

export default function ThreeLayers({ onOpenStructural, onOpenAtlas }: Props) {
  return (
    <div>
      <p className="eyebrow">Three-Layer Generative Framework · 新三层</p>
      <h2 className="panel-title-zh">Meta → Structure → Market</h2>
      <span className="panel-title-en">The same opportunity, generated at different time scales</span>
      <p className="panel-lead">
        同一机会在不同时间尺度上被生成：上层解释「为什么存在」，中层解释「为什么是它」，下层解释「为什么是现在」。
      </p>

      <section className="stratum">
        <div className="stratum-tag">Layer 1 · years / decades · Slow Variables</div>
        <h3>
          Meta Generative Field<span className="zh">元生成场</span>
        </h3>
        <p className="stratum-q">「为什么这个世界会产生这种机会？」</p>
        <ul className="chips">
          {THREE_LAYERS[0].chips!.map((c) => (
            <li key={c.en}>{c.zh}<em>{c.en}</em></li>
          ))}
        </ul>
      </section>

      <section className="stratum">
        <div className="stratum-tag">Layer 2 · months / years</div>
        <h3>
          Structural Potential<span className="zh">结构势能</span>
        </h3>
        <p className="stratum-q">「为什么偏偏是这家公司？」</p>
        <div className="chain-row">
          {THREE_LAYERS[1].chain!.map((n, i) => (
            <span key={n.en} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span className="chain-node">{n.en}<em>{n.zh}</em></span>
              {i < THREE_LAYERS[1].chain!.length - 1 && <span className="chain-arrow">→</span>}
            </span>
          ))}
        </div>
        <div className="principle-box">
          <p className="principle-line">
            Strong Asset <span className="neq">≠</span> Good Price
            <span style={{ color: 'var(--c-gold-deep)', margin: '0 12px' }}>·</span>
            Low Price <span className="neq">≠</span> Strong Asset
          </p>
          <p className="principle-note">
            真正寻找：
            <span className="target-line"> Strong System + Meaningful Compression + Recoverable Shock</span>
            （强系统 + 有意义的价格压缩 + 可恢复的冲击）
          </p>
        </div>
        <div className="panel-foot" style={{ marginTop: 14 }}>
          <button className="btn btn-primary" onClick={onOpenStructural}>
            放大 Structural Potential 结构势能 →
          </button>
        </div>
      </section>

      <section className="stratum">
        <div className="stratum-tag">Layer 3 · days / months（Geometry: minutes / weeks）</div>
        <h3>
          Market Field<span className="zh">市场场</span>
        </h3>
        <p className="stratum-q">「为什么现在开始变化？」</p>
        <div className="chain-row">
          {THREE_LAYERS[2].chain!.map((n, i) => (
            <span key={n.en} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span className="chain-node">{n.en}<em>{n.zh}</em></span>
              {i < THREE_LAYERS[2].chain!.length - 1 && <span className="chain-arrow">→</span>}
            </span>
          ))}
        </div>
        <p className="dim small" style={{ marginBottom: 0 }}>
          PICGEO（市场可见输入）聚合为场，判断其生成器，观察几何，最终决定是否授予生命力许可。
        </p>
      </section>

      <div className="panel-foot">
        <button className="btn btn-primary" onClick={onOpenAtlas}>
          进入 Archetype Atlas 案例原型库 →
        </button>
      </div>
    </div>
  )
}
