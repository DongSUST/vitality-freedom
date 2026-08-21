import { CASES } from '../data/cases'
import { ARCHETYPES } from '../data/archetypes'

interface Props {
  onOpenCase: (id: string) => void
  onOpenCompare: () => void
}

const POS: Record<string, [number, number]> = {
  wuxi: [240, 190],
  hengrui: [540, 120],
  popmart: [810, 200],
  poly: [290, 430],
  yonghui: [720, 465],
}

const STATUS_COLOR: Record<string, string> = {
  success: '#c9a86a',
  transition: '#eef0e6',
  failure: '#c07a52',
}

const STATUS_LABEL: Record<string, string> = {
  success: '生成案例',
  transition: '转型案例',
  failure: '警示案例',
}

export default function ArchetypeAtlas({ onOpenCase, onOpenCompare }: Props) {
  return (
    <div>
      <p className="eyebrow">Generative Archetype Library · 生成原型库</p>
      <h2 className="panel-title-zh">Archetype Atlas 案例星图</h2>
      <span className="panel-title-en">Five generative conditions, mapped as constellations</span>
      <p className="panel-lead">
        每个案例不是一只股票，而是一类生成条件的实例。选择一颗星，观察它的结构链条。
      </p>
      <p className="case-method">
        Methodological Case Study · Historical cases are used to illustrate generative mechanisms
        and are not investment recommendations.（历史案例仅用于说明生成机制，不构成投资建议。）
      </p>

      <div className="atlas-wrap" style={{ marginTop: 22 }}>
        <div className="atlas-svg-wrap">
          <svg className="atlas-svg" viewBox="0 0 1040 600" role="img" aria-label="案例星图">
            {/* chart circles */}
            <g stroke="rgba(238,240,230,0.05)" fill="none">
              <circle cx="520" cy="300" r="120" />
              <circle cx="520" cy="300" r="240" />
              <circle cx="520" cy="300" r="360" />
              <path d="M520,0 L520,600 M0,300 L1040,300" />
              <path d="M160,120 L880,480 M160,480 L880,120" />
            </g>
            <g stroke="rgba(201,168,106,0.08)" fill="none" strokeDasharray="2 6">
              <path d="M240,190 L540,120 L810,200" />
              <path d="M290,430 L720,465" />
              <path d="M240,190 L290,430" />
            </g>

            {CASES.map((cs) => {
              const [x, y] = POS[cs.id]
              const color = STATUS_COLOR[cs.status]
              const arch = ARCHETYPES.find((a) => a.id === cs.archetypeId)
              return (
                <g
                  key={cs.id}
                  className="case-node"
                  onClick={() => onOpenCase(cs.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onOpenCase(cs.id)
                    }
                  }}
                >
                  <circle className="node-halo" cx={x} cy={y} r="26" fill={color} opacity="0.3" />
                  <circle className="node-ring" cx={x} cy={y} r="9" stroke={color} />
                  <circle cx={x} cy={y} r="2.2" fill={color} />
                  <text x={x} y={y + 36} textAnchor="middle" fill="#eef0e6" fontSize="15" style={{ fontFamily: 'var(--font-display)' }}>
                    {cs.company}
                  </text>
                  <text x={x} y={y + 53} textAnchor="middle" fill="#6f7a8c" fontSize="8" letterSpacing="0.14em" fontFamily="var(--font-mono)">
                    {arch ? arch.nameEn : ''}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <aside className="atlas-side">
          <div className="atlas-legend">
            <div className="atlas-legend-row"><i className="status-dot success" /> 生成案例 · Generative Case</div>
            <div className="atlas-legend-row"><i className="status-dot transition" /> 转型案例 · Transition</div>
            <div className="atlas-legend-row"><i className="status-dot failure" /> 警示案例 · Warning / Failure</div>
          </div>

          {CASES.map((cs) => {
            const arch = ARCHETYPES.find((a) => a.id === cs.archetypeId)
            return (
              <button key={cs.id} className="case-chip" onClick={() => onOpenCase(cs.id)}>
                <i className={'status-dot ' + cs.status} />
                <span>
                  <span className="case-chip-name">{cs.company} · {STATUS_LABEL[cs.status]}</span>
                  <span className="case-chip-en">{arch ? arch.nameEn : ''}</span>
                </span>
              </button>
            )
          })}

          <button className="btn btn-primary" onClick={onOpenCompare} style={{ marginTop: 6 }}>
            Compare Cases 对照案例
          </button>
        </aside>
      </div>
    </div>
  )
}
