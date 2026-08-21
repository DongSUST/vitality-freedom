export default function About() {
  return (
    <div>
      <p className="eyebrow">About · 关于</p>
      <h2 className="panel-title-zh">生命力 × 自由度</h2>
      <span className="panel-title-en">Vitality-Driven Freedom System · V0.2 Living World</span>
      <p className="panel-lead">
        What is this? 这是一个关于 Vitality（生命力）、Freedom（自由度）、Architecture（架构）、
        Feedback（反馈）与 Learning（学习）的交互式世界模型。
        <br />
        A navigable world model exploring how vitality, freedom, architecture and feedback form an evolving system.
      </p>

      <div className="about-grid" style={{ marginTop: 22 }}>
        <div>
          <div className="about-line">
            <span className="about-num">01</span>
            <p>自由度决定生命可以去哪里。</p>
          </div>
          <div className="about-line">
            <span className="about-num">02</span>
            <p>生命力决定这些自由能够被实现到什么程度。</p>
          </div>
          <div className="about-line">
            <span className="about-num">03</span>
            <p>架构塑造生命力的流向，把生命力转化为有效行动。</p>
          </div>
          <div className="about-line">
            <span className="about-num">04</span>
            <p>反馈不断重塑架构，并创造新的自由。</p>
          </div>
          <p className="dim small">
            最终目标：用有限生命力，通过高效率架构，持续创造更高质量的未来自由。
          </p>
        </div>
        <aside className="about-side">
          <p>
            这不是投资建议工具，不是人格测试，不是医疗心理评估，也不是科学测量仪器。
            它是一个用于认知探索与系统思考的可导航世界模型；投资只是整个系统的重要应用场景之一。
          </p>
          <p>
            V0.1.1 具身化校准：Vitality = Flow，Freedom = Reachable Paths，Architecture = Channel Structure，
            Φ = 涌现的有效势能。V0.2 Living World：Sound = Audible State（声音 = 听觉状态），
            Trajectory = Temporal State（轨迹 = 时间状态）。
          </p>
          <p>
            本站不使用实时行情、不提供投资建议；所有案例仅用于说明生成机制与结构逻辑。
          </p>
        </aside>
      </div>

      <div className="method-box">
        <h4>Methodology · 方法论</h4>
        <p className="f">Φ = V × F × η<sub>A</sub></p>
        <p>
          This is a conceptual model, not an empirically calibrated scientific score.
          本模型用于认知探索与系统思考，并非经过经验校准的科学评分。
        </p>
        <p>
          全部声音由 Web Audio API 实时生成，随 V / F / η_A 连续变化（Sound = S(V, F, η_A)）；
          状态轨迹仅保存在当前会话内（最多 5 个节点），不涉及任何账户、数据库或云同步。
        </p>
      </div>
    </div>
  )
}
