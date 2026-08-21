import { useState } from 'react'
import { ARCH_CHAIN, ARCH_LOOP, FLOW_CHANNELS, PERMISSIONS, COMPRESSION_STEPS } from '../data/framework'

interface Props {
  eta: number
  onOpenLayers: () => void
}

// Node layout for the underground structure diagram (viewBox 0 0 520 560).
const NODES: { en: string; zh: string; x: number; y: number }[] = [
  { en: 'World', zh: '世界', x: 260, y: 84 },
  { en: 'Structure', zh: '结构', x: 95, y: 205 },
  { en: 'Candidate', zh: '候选', x: 285, y: 245 },
  { en: 'Field', zh: '场', x: 445, y: 205 },
  { en: 'Geometry', zh: '几何', x: 465, y: 375 },
  { en: 'Permission', zh: '许可', x: 310, y: 465 },
  { en: 'Outcome', zh: '结果', x: 150, y: 465 },
  { en: 'Archetype', zh: '原型', x: 85, y: 345 },
]

const EDGES = [
  'M260,84 C200,120 150,150 95,205',
  'M150,235 C220,245 250,245 285,245',
  'M350,245 C400,230 425,218 445,205',
  'M465,255 C470,315 465,340 465,375',
  'M430,440 C370,465 340,465 310,465',
  'M260,465 C210,465 180,465 150,465',
  'M130,430 C110,390 95,370 85,345',
]

const FLOW_PATHS = [
  { id: 'f1', d: 'M262,110 C272,160 284,205 285,238', label: 'Attention', lx: 300, ly: 172 },
  { id: 'f2', d: 'M250,100 C205,140 155,175 106,200', label: 'Research', lx: 118, ly: 158 },
  { id: 'f3', d: 'M312,252 C350,242 395,225 435,210', label: 'Computation', lx: 352, ly: 272 },
  { id: 'f4', d: 'M452,398 C420,452 370,478 322,462', label: 'Capital', lx: 368, ly: 452 },
  { id: 'f5', d: 'M130,452 C105,430 94,390 89,354', label: 'Experience', lx: 56, ly: 410 },
  { id: 'f6', d: 'M92,330 C100,292 100,250 103,214', label: 'Better Selection', lx: 18, ly: 268 },
]

const FUNNEL_SIZES = [34, 26, 18, 12, 9]

export default function ArchitectureReveal({ eta, onOpenLayers }: Props) {
  const [flowOn, setFlowOn] = useState(false)

  return (
    <div>
      <p className="eyebrow">Architecture · 架构</p>
      <h2 className="panel-title-zh">Architecture 架构</h2>
      <span className="panel-title-en">A : (V, F) → Φ — the transformation operator</span>
      <p className="panel-lead">
        架构不是更多规则。它负责把生命力转化为有效行动 —— Vitality → Useful Action。
        自由度决定生命可以去哪里，生命力决定这些自由能被实现到什么程度，架构决定生命力如何流动与转化。
      </p>

      <div className="arch-grid" style={{ marginTop: 24 }}>
        <div>
          <div className="arch-intro">
            <p className="lead serif">Φ = V × F × η<sub>A</sub></p>
            <p className="dim small">
              当前架构效率 η<sub>A</sub> = {Math.round(eta * 100)}（概念值，可由诊断模块更新）。
            </p>
          </div>

          <div className="arch-value">
            <span className="arch-num">01</span>
            <div>
              <h3>降低耗散 · Reduce Dissipation</h3>
              <p>避免随机研究、热点追逐、信息过载、权限混乱、频繁切换。</p>
            </div>
          </div>

          <div className="arch-value">
            <span className="arch-num">02</span>
            <div>
              <h3>压缩候选 · Compress Candidates</h3>
              <p>把注意力从一百个方向，压缩到一个值得下注的候选。</p>
              <div className="funnel">
                {COMPRESSION_STEPS.map((step, i) => (
                  <span key={step} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span
                      className="funnel-dot"
                      style={{ width: FUNNEL_SIZES[i] + 'px', height: FUNNEL_SIZES[i] + 'px', fontSize: 8 + (4 - i) * 1.4 + 'px' }}
                    >
                      {step}
                    </span>
                    {i < COMPRESSION_STEPS.length - 1 && <span className="funnel-arrow">→</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="arch-value">
            <span className="arch-num">03</span>
            <div>
              <h3>分配生命力 · Allocate Vitality</h3>
              <p>候选通过架构获得生命力的许可，逐级升级。</p>
              <ul className="chips" style={{ marginTop: 8 }}>
                {PERMISSIONS.map((p) => (
                  <li key={p.en}>{p.zh}<em>{p.en}</em></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel-foot">
            <button
              className={'btn' + (flowOn ? ' btn-primary' : '')}
              onClick={() => setFlowOn(!flowOn)}
              aria-pressed={flowOn}
            >
              {flowOn ? 'Hide Vitality Flow 隐藏流动' : 'Show Vitality Flow 显示生命力流动'}
            </button>
            <button className="btn btn-ghost" onClick={onOpenLayers}>
              进入三层 Enter the Three Layers →
            </button>
          </div>
        </div>

        <div className={'arch-svg-wrap' + (flowOn ? ' flow-on' : '')}>
          <svg className="arch-svg" viewBox="0 0 520 560" role="img" aria-label="架构地下结构图">
            {/* surface line */}
            <path d="M0,84 L520,84" stroke="rgba(238,240,230,0.28)" strokeWidth="1" />
            <path d="M0,84 L40,62 L80,84 L130,58 L180,84 L240,64 L300,84 L360,60 L420,84 L470,66 L520,84" stroke="rgba(238,240,230,0.18)" strokeWidth="1" fill="none" />
            <text x="12" y="74" className="node-label" fontSize="8.5">SURFACE · 地表（V×F 世界）</text>
            <path d="M260,96 L260,146" stroke="rgba(201,168,106,0.5)" strokeWidth="1" markerEnd="url(#arr)" />
            <text x="268" y="128" className="node-label" fontSize="8">enter 进入</text>

            <defs>
              <marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L6,3.5 L0,7 Z" fill="rgba(201,168,106,0.7)" />
              </marker>
            </defs>

            {/* edges */}
            {EDGES.map((d, i) => (
              <path key={i} className="edge" d={d} markerEnd="url(#arr)" />
            ))}
            {/* feedback loop */}
            <path className="edge-loop" d="M75,290 C80,252 85,228 95,213" markerEnd="url(#arr)" />
            <text x="40" y="268" className="flow-label" fontSize="8.5">{ARCH_LOOP}</text>

            {/* nodes */}
            {NODES.map((n) => (
              <g key={n.en}>
                <circle className="node-dot" cx={n.x} cy={n.y} r={n.en === 'World' ? 9 : 8} />
                <text x={n.x} y={n.y - 14} textAnchor="middle" className="node-label" fontSize="10">{n.en}</text>
                <text x={n.x} y={n.y + 22} textAnchor="middle" className="node-label-zh" fontSize="9">{n.zh}</text>
              </g>
            ))}

            {/* vitality flow overlay */}
            <g>
              {FLOW_PATHS.map((fp, i) => (
                <g key={fp.id}>
                  <path id={fp.id} className="flow-path" d={fp.d} style={{ animationDelay: (i * 1.1) + 's' }} />
                  <g className="flow-movers">
                    <circle r="2.4" fill="#ecd9ab" opacity="0.95">
                      <animateMotion dur="9s" begin={(i * 1.1) + 's'} repeatCount="indefinite">
                        <mpath xlinkHref={'#' + fp.id} />
                      </animateMotion>
                    </circle>
                  </g>
                  <text x={fp.lx} y={fp.ly} className="flow-label" fontSize="8.5">{fp.label}</text>
                </g>
              ))}
            </g>
          </svg>

          <div className="flow-legend">
            {FLOW_CHANNELS.map((c) => (
              <span key={c.from}>
                {c.from}<i />{c.to}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="chain-strip">
        {ARCH_CHAIN.map((n, i) => (
          <span key={n.en} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span className="chain-item">{n.en}<em>{n.zh}</em></span>
            {i < ARCH_CHAIN.length - 1 && <span className="chain-arrow">→</span>}
          </span>
        ))}
        <span className="chain-loop">↺ {ARCH_LOOP}</span>
      </div>
      <p className="dim small" style={{ marginTop: 10, marginBottom: 0 }}>
        Outcome → Archetype → Better Selection：结果回流为原型，原型改进下一次选择。反馈不断重塑架构，并创造新的自由。
      </p>
    </div>
  )
}
