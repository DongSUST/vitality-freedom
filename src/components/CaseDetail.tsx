import { Fragment } from 'react'
import type { CaseStudy } from '../data/cases'
import type { Archetype } from '../data/archetypes'

interface Props {
  cs: CaseStudy
  arch: Archetype
  onPrev: () => void
  onNext: () => void
  onCompare: () => void
  onConditional: () => void
}

const STATUS_LABEL: Record<string, string> = {
  success: '成功案例 · Generative Case',
  transition: '转型案例 · Transition',
  failure: '警示案例 · Warning Case',
}

export default function CaseDetail({ cs, arch, onPrev, onNext, onCompare, onConditional }: Props) {
  return (
    <div>
      <header className="case-head">
        <div>
          <p className="eyebrow">{cs.market} · {STATUS_LABEL[cs.status]}</p>
          <h2>
            {cs.company}
            <span className="case-en">{cs.companyEn}</span>
          </h2>
          <p className="case-archetype mono">{arch.nameEn} · {arch.nameZh}</p>
        </div>
        <div className="case-actions">
          <button className="case-nav-btn" onClick={onPrev} aria-label="上一个案例">← 上一个</button>
          <button className="case-nav-btn" onClick={onNext} aria-label="下一个案例">下一个 →</button>
        </div>
      </header>

      <p className="case-method" style={{ margin: '14px 0 0' }}>
        Methodological Case Study · 方法论案例研究 — Historical cases are used to illustrate
        generative mechanisms and are not investment recommendations.
      </p>

      <blockquote className="case-question">
        「{cs.questionZh}」
        <span className="case-question-en">{cs.question}</span>
      </blockquote>

      <div className="case-structure">
        {arch.structure.map((s, i) => (
          <Fragment key={s.en}>
            <span className="struct-node">{s.en}<em>{s.zh}</em></span>
            {i < arch.structure.length - 1 && <span className="struct-arrow">→</span>}
          </Fragment>
        ))}
      </div>

      <div className="case-cols">
        <section>
          <div className="col-title">GEOMETRY · 几何</div>
          <ul>
            {cs.geometry.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </section>
        <section>
          <div className="col-title">STRUCTURAL POTENTIAL · 结构势能</div>
          <ul>
            {cs.structuralPotential.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </section>
        <section>
          <div className="col-title">MARKET FIELD · 市场场</div>
          <ul>
            {cs.marketField.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </section>
      </div>

      <div className="case-lesson">
        <span className="tag">LESSON · 教训</span>
        <p className="zh">{cs.lessonZh}</p>
        <p className="en">{cs.lesson}</p>
      </div>

      <div className="panel-foot">
        <button className="btn" onClick={onCompare}>Compare Cases 对照案例</button>
        <button className="btn btn-ghost" onClick={onConditional}>法无自性 · Conditional Geometry</button>
      </div>
    </div>
  )
}
