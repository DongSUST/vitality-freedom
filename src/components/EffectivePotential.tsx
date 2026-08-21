import { clamp01 } from '../utils/phi'
import { phiState } from '../utils/visuals'

interface Props {
  phi: number
  onOpen: () => void
}

// The conceptual core at the center of the quadrant.
// Phi is a STATE, not a score: size, glow, steadiness and connections
// express it — never a number on the surface.
export default function EffectivePotential({ phi, onOpen }: Props) {
  const n = clamp01(phi)
  const st = phiState(phi)
  const size = 74 + Math.sqrt(n) * 66
  const glow = 0.3 + n * 0.5
  const glyph = 22 + Math.sqrt(n) * 14
  // steadiness: higher potential breathes slower and calmer
  const breathDur = 4.5 + (1 - n) * 4.5

  return (
    <button
      className="phi-core"
      onClick={onOpen}
      aria-label="打开架构层 Architecture Reveal"
      title={'Φ · ' + st.en + ' ' + st.zh + ' — 点击展开 Architecture'}
      style={{
        width: size + 'px',
        height: size + 'px',
        boxShadow:
          '0 0 ' + (18 + n * 60) + 'px rgba(201,168,106,' + glow.toFixed(3) + '), inset 0 0 ' + (16 + n * 30) + 'px rgba(201,168,106,' + (0.05 + n * 0.12).toFixed(3) + ')',
      }}
    >
      <span className="phi-breathe" style={{ animationDuration: breathDur + 's' }} />
      <span className="phi-glyph" style={{ fontSize: glyph + 'px' }}>Φ</span>
      <span className="phi-state">{st.zh}</span>
    </button>
  )
}
