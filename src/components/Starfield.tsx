import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  p: number
  drift: number
  tw: number
}

// Very light drifting stardust. Pauses automatically under prefers-reduced-motion.
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    let stars: Star[] = []
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(150, Math.floor((w * h) / 14000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.3 + Math.random() * 1.0,
        p: Math.random() * Math.PI * 2,
        drift: 0.006 + Math.random() * 0.02,
        tw: 0.4 + Math.random() * 1.2,
      }))
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const a = 0.22 + 0.34 * (0.5 + 0.5 * Math.sin(t * 0.0006 * s.tw + s.p))
        ctx.fillStyle = 'rgba(214, 222, 236, ' + a.toFixed(3) + ')'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        if (!reduced) {
          s.y -= s.drift
          if (s.y < -2) {
            s.y = h + 2
            s.x = Math.random() * w
          }
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    if (reduced) draw(0)
    else raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="starfield" aria-hidden="true" />
}
