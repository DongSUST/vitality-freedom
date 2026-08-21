import SoundControl from './SoundControl'

interface Props {
  view: string
  onExplore: () => void
  onDiagnose: () => void
  onCases: () => void
  onAbout: () => void
  onReset: () => void
  soundOn: boolean
  soundVolume: number
  onToggleSound: () => void
  onVolume: (n: number) => void
}

export default function TopBar({
  view, onExplore, onDiagnose, onCases, onAbout, onReset,
  soundOn, soundVolume, onToggleSound, onVolume,
}: Props) {
  const inCases = view === 'atlas' || view === 'case' || view === 'compare' || view === 'conditional'

  return (
    <header className="topbar">
      <button className="brand" onClick={onExplore} aria-label="回到象限世界">
        <span className="brand-mark serif">Φ</span>
        <span className="brand-name">
          生命力 × 自由度
          <span className="brand-sub">Vitality × Freedom</span>
        </span>
      </button>
      <nav className="topnav" aria-label="主导航">
        <button className={'nav-btn' + (view === 'world' ? ' active' : '')} onClick={onExplore}>
          Explore<em>探索体系</em>
        </button>
        <button className={'nav-btn' + (view === 'diagnosis' ? ' active' : '')} onClick={onDiagnose}>
          Diagnose<em>状态诊断</em>
        </button>
        <button className={'nav-btn' + (inCases ? ' active' : '')} onClick={onCases}>
          Cases<em>案例与原型</em>
        </button>
      </nav>
      <div className="topbar-right">
        <SoundControl soundOn={soundOn} volume={soundVolume} onToggle={onToggleSound} onVolume={onVolume} />
        <button className="topbar-util" onClick={onAbout}>
          About
        </button>
        <button className="topbar-util" onClick={onReset}>
          Reset View
        </button>
      </div>
    </header>
  )
}
