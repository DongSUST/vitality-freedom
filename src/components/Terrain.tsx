import { useState } from 'react'
import { smooth, branchOn, visualModel } from '../utils/visuals'

interface Props {
  v: number
  f: number
  eta: number
  idPrefix?: string
}

// River / path network radiating from the valley floor toward the horizon.
const BRANCHES = [
  'M600,610 C580,560 520,540 470,470 C450,440 420,430 360,420',
  'M600,610 C610,560 650,530 700,480 C730,450 760,440 800,430',
  'M600,610 C600,560 600,520 600,470 C600,440 600,430 600,420',
  'M600,610 C560,560 500,530 430,480 C400,450 360,445 300,440',
  'M600,610 C640,560 700,530 770,480 C800,450 840,445 900,440',
  'M600,610 C530,570 450,550 380,500 C340,475 300,470 240,465',
  'M600,610 C670,570 750,550 820,500 C860,475 900,470 960,465',
]

// Horizon endpoints of each branch — used for Φ connection spokes.
const BRANCH_ENDS: [number, number][] = [
  [360, 420], [800, 430], [600, 420], [300, 440], [900, 440], [240, 465], [960, 465],
]

const CORE: [number, number] = [600, 488]

// Energy lines converging into the single channel (Overcommitment).
const TRAP_LINES = [
  'M120,700 C240,610 380,545 590,492',
  'M1080,700 C960,610 820,545 610,492',
  'M60,560 C220,560 420,520 585,496',
  'M1140,560 C980,560 780,520 615,496',
  'M240,430 C360,470 480,485 590,492',
  'M960,430 C840,470 720,485 610,492',
]

// Detour loops — visible when architecture efficiency is low (wasted flow).
const DETOURS = [
  'M470,470 C520,430 560,460 540,500 C520,530 480,520 470,470',
  'M740,480 C700,440 660,470 680,510 C700,540 740,530 740,480',
  'M600,520 C560,560 640,580 620,540 C600,510 620,510 600,520',
]

// Far destinations on the horizon (Dispersion: visible, rarely reached).
const LIGHTS: [number, number][] = [
  [240, 444], [360, 436], [480, 442], [720, 442], [840, 436], [960, 444],
]

const STARS = [
  [120, 90], [260, 60], [420, 110], [560, 70], [700, 130], [860, 80],
  [960, 150], [180, 200], [380, 180], [640, 210], [900, 220], [60, 260],
]

// V0.1.1 embodied world model:
//   Vitality   = FLOW            (speed, density, light, growth, continuity)
//   Freedom    = REACHABLE PATHS (branches, horizon, open vista, exits)
//   Architecture = CHANNEL STRUCTURE (focus vs detours, leaks, coherence)
// All features interpolate continuously — no 50% hard switches.
export default function Terrain({ v, f, eta, idPrefix = 't' }: Props) {
  const [reduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const m = visualModel(v, f, eta)
  const { vn, fn } = m

  const brightness = 0.88 + vn * 0.18
  const bucket = Math.round(v / 5) * 5
  const dotDur = 34 - (bucket / 100) * 20 // 14s..34s, faster = more vitality
  const dotsPerBranch = 1 + Math.round(vn * 2) // 1..3
  const pathOpacity = 0.35 + 0.65 * vn // dispersion: paths exist but stay faint
  const branchWidth = 1.6 + vn * 1.2 // shallow rivers at low vitality
  const constellationOn = m.highF * smooth(0.55, 0.85, vn)
  const reachOn = m.highF * smooth(0.55, 0.85, vn) // distant lights get connected only with real energy
  const leakOn = (1 - eta) * vn * m.highF // energy dissipating off-channel
  const detourOn = (1 - eta) * vn * m.highF * 0.4
  const spokeOn = m.highF * (0.14 + 0.86 * m.phi)

  const p = (s: string) => idPrefix + '-' + s

  return (
    <svg
      className="terrain-svg"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ filter: 'brightness(' + brightness + ')' }}
    >
      <defs>
        <linearGradient id={p('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1322" />
          <stop offset="0.55" stopColor="#0a111d" />
          <stop offset="1" stopColor="#0c1524" />
        </linearGradient>
        <linearGradient id={p('river')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#24506f" />
          <stop offset="0.5" stopColor="#8fb59b" />
          <stop offset="1" stopColor="#24506f" />
        </linearGradient>
        <radialGradient id={p('sun')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ecd9ab" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ecd9ab" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={p('moon')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#dfe6f0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#dfe6f0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={p('ember')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c07a52" stopOpacity="0.42" />
          <stop offset="1" stopColor="#c07a52" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={p('haze')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020409" stopOpacity="0" />
          <stop offset="1" stopColor="#020409" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect width="1200" height="700" fill={'url(#' + p('sky') + ')'} />

      {/* stars — visibility closes down with Freedom */}
      <g fill="#dfe6f0" opacity={0.35 + 0.65 * fn}>
        {STARS.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 1.2 : 0.8} opacity={0.3 + (i % 4) * 0.14} />
        ))}
      </g>

      {/* constellation — stars connect only in open, energetic worlds */}
      <path
        d="M120,90 L260,60 L420,110 L560,70 L700,130"
        stroke="#aeb6c2"
        strokeWidth="0.8"
        fill="none"
        opacity={constellationOn * 0.5}
      />

      {/* moon */}
      <g opacity={0.3 + fn * 0.3}>
        <circle cx="1010" cy="110" r="60" fill={'url(#' + p('moon') + ')'} opacity="0.5" />
        <circle cx="1010" cy="110" r="20" fill="#e6ead9" opacity="0.9" />
        <circle cx="1002" cy="103" r="4" fill="#c8cdb8" opacity="0.5" />
        <circle cx="1018" cy="116" r="3" fill="#c8cdb8" opacity="0.4" />
      </g>

      {/* far mountains — recede as the world opens */}
      <g
        className="far-mtn"
        style={{
          transform: 'translate(0px, ' + Math.round(34 - m.highF * 92) + 'px)',
          opacity: 0.9 - m.highF * 0.18,
        }}
      >
        <path
          d="M0,430 L90,360 L170,410 L260,330 L360,400 L470,345 L560,415 L660,340 L770,405 L880,355 L980,420 L1080,350 L1200,415 L1200,700 L0,700 Z"
          fill="#0d1526"
        />
      </g>
      <g
        className="far-mtn"
        style={{
          transform: 'translate(0px, ' + Math.round(20 - m.highF * 50) + 'px)',
          opacity: 0.95 - m.highF * 0.13,
        }}
      >
        <path
          d="M0,470 L120,420 L220,455 L330,400 L450,450 L560,415 L680,455 L790,410 L900,455 L1010,425 L1120,460 L1200,430 L1200,700 L0,700 Z"
          fill="#0a111d"
        />
      </g>

      {/* open vista: wide horizon + distant land */}
      <g opacity={m.highF}>
        <rect x="0" y="428" width="1200" height="46" fill={'url(#' + p('sun') + ')'} opacity="0.7" />
        <path
          d="M0,452 C150,436 300,446 450,442 C600,438 750,446 900,441 C1050,436 1150,444 1200,440 L1200,470 L0,470 Z"
          fill="#16283f"
          opacity="0.9"
        />
        <path d="M0,470 C180,458 360,468 540,462 C720,456 900,466 1200,458 L1200,700 L0,700 Z" fill="#0f1a2c" />
      </g>

      {/* far destinations: visible with freedom; reached only with energy */}
      <g>
        {LIGHTS.map(([lx, ly], i) => (
          <circle key={'l' + i} cx={lx} cy={ly} r="1.7" fill="#ecd9ab" opacity={m.highF * (0.55 + 0.45 * (1 - vn))} />
        ))}
        {LIGHTS.map(([lx, ly], i) => (
          <line key={'c' + i} x1={CORE[0]} y1={CORE[1]} x2={lx} y2={ly} stroke="#8fb59b" strokeWidth="0.7" opacity={reachOn * 0.4} />
        ))}
      </g>

      {/* valley floor */}
      <path d="M0,500 C200,480 380,492 600,488 C820,484 1000,492 1200,482 L1200,700 L0,700 Z" fill="#0b1322" />
      <path d="M0,560 C240,540 480,552 720,546 C900,542 1050,552 1200,546 L1200,700 L0,700 Z" fill="#080e19" />

      {/* low F: canyon walls close in */}
      <g className="canyon-wall" style={{ transform: 'translate(' + Math.round((1 - m.highF) * 58) + 'px, 0px)', opacity: m.lowF }}>
        <path d="M0,430 L0,700 L170,700 L90,430 Z" fill="#060a13" />
      </g>
      <g className="canyon-wall" style={{ transform: 'translate(' + Math.round(-(1 - m.highF) * 58) + 'px, 0px)', opacity: m.lowF }}>
        <path d="M1200,430 L1200,700 L1030,700 L1110,430 Z" fill="#060a13" />
      </g>
      <g stroke="#1d3a57" strokeWidth="1.5" fill="none" opacity={m.lowF * 0.45}>
        <path d="M0,60 C300,150 600,60 900,150 L1200,60" />
        <path d="M0,112 C300,202 600,112 900,202 L1200,112" />
      </g>

      {/* base channel — continuity is vitality: broken when energy is low */}
      <path
        className="base-channel"
        d="M600,700 C600,640 600,600 600,560 C600,530 598,505 596,486"
        stroke="#1d3a57"
        strokeWidth="3"
        fill="none"
        style={{
          opacity: 0.35 + 0.65 * vn,
          strokeDasharray: Math.round(380 + vn * 620) + ' ' + Math.round(110 - vn * 110),
        }}
      />

      {/* Φ connection spokes — the core binds reachable paths together */}
      <g>
        {BRANCH_ENDS.slice(0, m.activeBranches).map(([ex, ey], i) => (
          <line
            key={'sp' + i}
            x1={CORE[0]}
            y1={CORE[1]}
            x2={ex}
            y2={ey}
            stroke="#ecd9ab"
            strokeWidth="0.8"
            opacity={spokeOn * branchOn(i, fn)}
          />
        ))}
      </g>

      {/* branching river / path network — reachable state space */}
      <g opacity={m.highF}>
        {BRANCHES.map((d, i) => {
          const focus = i < m.focusBranches ? 1 : 0.55
          return (
            <path
              key={i}
              d={d}
              stroke={'url(#' + p('river') + ')'}
              strokeWidth={branchWidth}
              fill="none"
              strokeLinecap="round"
              opacity={branchOn(i, fn) * pathOpacity * focus}
            />
          )
        })}

        {/* vitality flow dots — speed/density = flow strength */}
        {!reduced &&
          BRANCHES.slice(0, m.activeBranches).map((d, i) =>
            Array.from({ length: dotsPerBranch }, (_, j) => (
              <circle key={'flow-' + bucket + '-' + i + '-' + j} r="1.6" fill="#ecd9ab" opacity={0.25 + 0.65 * vn}>
                <animateMotion dur={dotDur + 's'} begin={(-(i * 3.1 + j * 2.3)).toFixed(1) + 's'} repeatCount="indefinite" path={d} />
              </circle>
            )),
          )}

        {/* low eta: energy leaking off the channels (dissipation) */}
        {!reduced &&
          leakOn > 0.02 &&
          BRANCHES.slice(0, Math.min(m.activeBranches, 4)).map((d, i) => (
            <g key={'leak-' + i} opacity={leakOn}>
              <circle r="1.4" fill="#c07a52">
                <animateMotion dur={dotDur + 's'} begin={(-(i * 3.1 + 1)).toFixed(1) + 's'} repeatCount="indefinite" path={d} />
                <animate attributeName="opacity" values="0.8;0.6;0" keyTimes="0;0.65;1" dur={dotDur + 's'} repeatCount="indefinite" />
              </circle>
            </g>
          ))}

        {/* low eta: flow wandering into detour loops (wasted motion) */}
        {!reduced &&
          detourOn > 0.02 &&
          DETOURS.map((d, i) => (
            <g key={'detour-' + i} opacity={detourOn}>
              <path d={d} stroke="#8a7347" strokeWidth="1" fill="none" strokeDasharray="2 5" />
              <circle r="1.4" fill="#8a7347">
                <animateMotion dur={(dotDur * 1.6) + 's'} begin={(-(i * 2.1)).toFixed(1) + 's'} repeatCount="indefinite" path={d} />
              </circle>
            </g>
          ))}
      </g>

      {/* overcommitment: massive energy forced through one path */}
      <g opacity={m.trap}>
        <ellipse cx="600" cy="590" rx="240" ry="66" fill={'url(#' + p('ember') + ')'} opacity="0.6" />
        <path d="M600,610 L600,470" stroke="#c07a52" strokeWidth="2" opacity="0.55" />
        <path d="M520,470 C540,450 570,455 575,475 C578,488 565,498 550,494" stroke="#c07a52" strokeWidth="1.4" fill="none" opacity="0.35" />
        <path d="M680,470 C660,450 630,455 625,475 C622,488 635,498 650,494" stroke="#c07a52" strokeWidth="1.4" fill="none" opacity="0.35" />
        <g stroke="#c07a52" strokeWidth="1" fill="none" opacity="0.3">
          {TRAP_LINES.map((d, i) => (
            <path key={'tl' + i} d={d} />
          ))}
        </g>
        {!reduced &&
          TRAP_LINES.map((d, i) => (
            <circle key={'trap-' + bucket + '-' + i} r="1.8" fill="#ecd9ab" opacity="0.9">
              <animateMotion dur={(dotDur * 0.42) + 's'} begin={(-(i * 1.7)).toFixed(1) + 's'} repeatCount="indefinite" path={d} />
            </circle>
          ))}
        {!reduced && (
          <circle r="2.4" fill="#ecd9ab" opacity="0.95">
            <animateMotion dur={(dotDur * 0.5) + 's'} repeatCount="indefinite" path="M600,700 C600,640 600,600 600,560 C600,530 598,505 596,486" />
          </circle>
        )}
      </g>

      {/* high V: light shafts — glow, not whiteness */}
      <g opacity={m.highV * 0.4}>
        <path d="M760,0 L840,0 L980,700 L880,700 Z" fill={'url(#' + p('sun') + ')'} opacity="0.5" />
        <path d="M540,0 L610,0 L740,700 L640,700 Z" fill={'url(#' + p('sun') + ')'} opacity="0.32" />
      </g>

      {/* high V: growth — birds and life */}
      <g opacity={m.highV * smooth(0.35, 0.6, fn) * 0.8}>
        <g stroke="#b5d6be" strokeWidth="1.2" fill="none">
          <path d="M300,180 q6,-6 12,0 q6,6 12,0" />
          <path d="M340,150 q5,-5 10,0 q5,5 10,0" />
          <path d="M280,210 q5,-5 10,0 q5,5 10,0" />
          <path d="M420,120 q5,-5 10,0 q5,5 10,0" />
        </g>
      </g>
      <g fill="#a8d3b4" opacity={m.highV * 0.5}>
        <circle cx="520" cy="560" r="1.4" />
        <circle cx="560" cy="590" r="1.2" />
        <circle cx="640" cy="575" r="1.4" />
        <circle cx="690" cy="600" r="1.1" />
        <circle cx="470" cy="600" r="1.1" />
        <circle cx="730" cy="570" r="1.3" />
      </g>

      {/* tiny figure — present when the world is open */}
      <g transform="translate(600,660)" stroke="#aeb6c2" strokeWidth="1.6" fill="none" opacity={m.highF * 0.75}>
        <circle cx="0" cy="-7" r="2.4" />
        <path d="M0,-4 L0,6 M0,-1 L-4,3 M0,-1 L4,3 M0,6 L-3,11 M0,6 L3,11" />
      </g>

      {/* low V: dark haze — quiet, compressed, stagnant */}
      <g opacity={m.lowV}>
        <rect width="1200" height="700" fill={'url(#' + p('haze') + ')'} opacity="0.85" />
        <rect width="1200" height="700" fill="#020409" opacity="0.15" />
      </g>
    </svg>
  )
}
