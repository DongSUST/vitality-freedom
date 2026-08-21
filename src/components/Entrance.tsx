import Terrain from './Terrain'

interface Props {
  onEnter: () => void
  leaving: boolean
}

export default function Entrance({ onEnter, leaving }: Props) {
  return (
    <div className={'entrance' + (leaving ? ' leaving' : '')}>
      <div className="entrance-scene">
        <Terrain v={72} f={68} eta={0.62} idPrefix="ent" />
      </div>
      <div className="entrance-veil" />
      <div className="entrance-content">
        <p className="eyebrow">Vitality-Driven Freedom System</p>
        <h1 className="entrance-title">
          <span className="entrance-zh">生命力 × 自由度</span>
          <span className="entrance-en">Vitality × Freedom</span>
        </h1>
        <div className="entrance-formula serif">
          <span className="phi">Φ</span>
          <span className="eq"> = V × F × η<sub>A</sub></span>
        </div>
        <p className="entrance-quote serif">用有限生命力，创造更高质量的未来自由。</p>
        <button className="btn btn-primary entrance-enter" onClick={onEnter}>
          <span>进入系统</span>
          <span className="entrance-enter-en">Enter the System</span>
        </button>
        <p className="entrance-hint tiny faint">This is not a dashboard. This is a navigable world model.</p>
      </div>
    </div>
  )
}
