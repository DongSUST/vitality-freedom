// In-process runtime smoke test: mounts the real bundle in jsdom and walks
// the full experience path (entrance → world → sound → trajectory →
// architecture → layers → structural → atlas → case → compare →
// conditional → diagnosis → apply → about).
// Node-only, no browser, no child processes.
import { readFileSync } from 'node:fs'
import { JSDOM, VirtualConsole } from 'jsdom'

const failures = []
let passCount = 0

function check(name, cond) {
  if (cond) {
    passCount++
    console.log('  ok   ' + name)
  } else {
    failures.push(name)
    console.log('  FAIL ' + name)
  }
}

function findButton(text) {
  return Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes(text))
}

const consoleErrors = []
const vc = new VirtualConsole()
vc.on('jsdomError', (e) => consoleErrors.push('jsdomError: ' + String(e)))
vc.on('error', (e) => consoleErrors.push('console.error: ' + String(e)))

const dom = new JSDOM('<div id="root"></div>', {
  pretendToBeVisual: true,
  url: 'http://localhost:4399/',
  virtualConsole: vc,
})

const window = dom.window
window.matchMedia = () => ({
  matches: true,
  media: '',
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})
window.HTMLCanvasElement.prototype.getContext = () => null
if (!window.cancelAnimationFrame) window.cancelAnimationFrame = (id) => window.clearTimeout(id)

globalThis.window = window
globalThis.document = window.document
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
globalThis.HTMLElement = window.HTMLElement
globalThis.Element = window.Element
globalThis.Node = window.Node
globalThis.SVGElement = window.SVGElement

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

await import('../dist/assets/app.js')
await sleep(300)

// ---- Public release metadata ----
console.log('Step 0 · Public metadata')
const distHtml = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')
check('public: title metadata', distHtml.includes('<title>Vitality × Freedom'))
check('public: og + twitter tags', distHtml.includes('og:title') && distHtml.includes('og:image') && distHtml.includes('twitter:card'))
check('public: apple icon + description', distHtml.includes('apple-touch-icon') && distHtml.includes('navigable world model'))

// ---- Sound model (pure function, tested in Node) ----
console.log('Step 0b · Sound model')
let soundModelFn = null
try {
  const sm = await import('../src/audio/soundModel.ts')
  soundModelFn = sm.soundModel
} catch (e) {
  console.log('  (sound model import skipped: ' + e.message + ')')
}
check('sound model importable in node', !!soundModelFn)
if (soundModelFn) {
  const A = soundModelFn(20, 20, 0.7)
  const B = soundModelFn(90, 20, 0.7)
  const C = soundModelFn(20, 90, 0.7)
  const D = soundModelFn(90, 90, 0.9)
  check('sound: low V×low F thin & narrow', A.activity < 0.4 && A.spatialWidth < 0.5)
  check('sound: high V×low F active but narrow', B.activity > 0.8 && B.spatialWidth < 0.5 && B.activity > A.activity)
  check('sound: low V×high F wide but weak', C.spatialWidth > 0.8 && C.activity < 0.4)
  check('sound: high V×F×η active, wide, coherent', D.activity > 0.8 && D.spatialWidth > 0.8 && D.coherence > 0.8)
  check('sound: η controls coherence, not loudness', soundModelFn(80, 80, 0.2).coherence < soundModelFn(80, 80, 0.9).coherence)
}

// ---- Step 1: entrance ----
console.log('Step 1 · Entrance')
check('entrance title renders', document.body.textContent.includes('生命力 × 自由度'))
check('entrance formula renders', document.body.textContent.includes('Φ = V × F × η'))
const enterBtn = findButton('进入系统')
check('enter button exists', !!enterBtn)

// ---- Step 2: world / quadrant ----
console.log('Step 2 · V×F world')
enterBtn.click()
await sleep(1400)
check('entrance unmounted', !document.querySelector('.entrance'))
check('world visible', !!document.querySelector('.world-wrap.visible'))
check('phi core exists', !!document.querySelector('.phi-core'))
const sliders = document.querySelectorAll('.dock input[type=range]')
check('two sliders exist', sliders.length === 2)
check('readout shows current state', document.body.textContent.includes('Current State'))

// move sliders → high V, low F
function setSlider(input, value) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  setter.call(input, String(value))
  input.dispatchEvent(new window.Event('input', { bubbles: true }))
}
// 50/50 → latent potential, expressed as a state word (no score)
check('phi readout is a state, not a score', document.body.textContent.includes('Conceptual System State') && document.body.textContent.includes('LATENT'))

// high energy + high freedom → expanding world
setSlider(sliders[0], 90)
setSlider(sliders[1], 90)
await sleep(200)
check('phi state becomes EXPANDING', document.body.textContent.includes('EXPANDING'))
check('creation state readout', document.body.textContent.includes('High Vitality / High Freedom'))
check('migration ghost appears', !!document.querySelector('.state-point-ghost'))

// high V, low F → trap
setSlider(sliders[0], 88)
setSlider(sliders[1], 24)
await sleep(200)
check('readout reflects High Vitality / Low Freedom', document.body.textContent.includes('High Vitality / Low Freedom'))
check('trap quadrant card active', !!document.querySelector('.quad-overcommitment.active'))
check('trap summary line', document.body.textContent.includes('力量被压入单一路径'))
check('watch line renders', document.body.textContent.includes('Powerful, but trapped'))

// ---- Step 2b: sound (jsdom → engine unsupported; UI must still work) ----
console.log('Step 2b · Sound')
check('sound defaults off', !!findButton('Sound · Off'))
findButton('Sound · Off').click()
await sleep(80)
check('sound toggles on via user gesture', !!findButton('Sound · On') && findButton('Sound · On').getAttribute('aria-pressed') === 'true')
check('sound engine created exactly once', window.__VF_AUDIO__ && window.__VF_AUDIO__.debug().instances === 1)

// ---- Step 2c: trajectory ----
console.log('Step 2c · Trajectory')
const trajToggle = findButton('轨迹 0/5')
check('trajectory toggle present and empty', !!trajToggle)
trajToggle.click()
await sleep(80)
findButton('＋ 添加当前状态').click() // node1: past @ 88/24
await sleep(80)
check('first node added as past', document.body.textContent.includes('轨迹 1/5') && !!document.querySelector('.traj-dot.kind-past'))
findButton('+ Vitality').click() // node2: future @ 100/24
await sleep(80)
check('explore change creates future node', document.body.textContent.includes('轨迹 2/5') && document.body.textContent.includes('Future +V'))
findButton('＋ 添加当前状态').click() // node3: transition
findButton('＋ 添加当前状态').click() // node4: now
findButton('＋ 添加当前状态').click() // node5: future
await sleep(80)
check('trajectory capped at 5', document.body.textContent.includes('轨迹 5/5'))
check('add disabled at max', findButton('＋ 添加当前状态').disabled === true)

// world remembers: drift away, then click the first node → back to trap
setSlider(sliders[0], 30)
setSlider(sliders[1], 30)
await sleep(200)
document.querySelector('.traj-chip-apply').click()
await sleep(300)
check('node click restores remembered world', document.body.textContent.includes('High Vitality / Low Freedom'))

// play → stop keeps state; full playback reaches the final node
findButton('▶ Play Trajectory').click()
await sleep(150)
check('stop control appears during playback', !!findButton('■ Stop'))
findButton('■ Stop').click()
await sleep(100)
check('stop keeps current state without crash', !!findButton('▶ Play Trajectory') && document.body.textContent.includes('High Vitality / Low Freedom'))
findButton('▶ Play Trajectory').click()
await sleep(3400) // reduced-motion segments: 4 × 700ms + buffer
check('playback completes to final node', document.body.textContent.includes('轨迹 5/5') && document.body.textContent.includes('High Vitality / Low Freedom'))

// free one slot for the diagnosis integration later
const delBtns = document.querySelectorAll('.traj-chip-del')
delBtns[delBtns.length - 1].click()
await sleep(80)
check('node deletion works', document.body.textContent.includes('轨迹 4/5'))

// ---- Step 3-4: architecture reveal ----
console.log('Step 3-4 · Architecture')
document.querySelector('.phi-core').click()
await sleep(300)
check('architecture panel opened', document.body.textContent.includes('降低耗散'))
check('chain has 8 nodes', document.querySelectorAll('.chain-strip .chain-item').length === 8)
const flowBtn = findButton('Show Vitality Flow')
flowBtn.click()
await sleep(100)
check('vitality flow toggled on', !!document.querySelector('.flow-on'))
check('sound engine not duplicated across views', window.__VF_AUDIO__.debug().instances === 1)

// ---- Step 5: three layers ----
console.log('Step 5 · Three layers')
findButton('进入三层').click()
await sleep(300)
check('layers panel opened', document.body.textContent.includes('Meta → Structure → Market'))
check('layer 1 chips', document.body.textContent.includes('元生成场'))
check('layer 2 chain', document.body.textContent.includes('Asset Substrate'))
check('strong asset principle', document.body.textContent.includes('Strong Asset ≠ Good Price'))
check('layer 3 chain', document.body.textContent.includes('PICGEO'))

// structural potential zoom
findButton('放大 Structural Potential').click()
await sleep(300)
check('structural panel opened', document.body.textContent.includes('冲击拓扑'))
document.querySelector('.panel-close').click()
await sleep(300)
check('back to layers', document.body.textContent.includes('为什么偏偏是这家公司'))

// ---- Step 6: atlas → case ----
console.log('Step 6 · Atlas & Case')
findButton('进入 Archetype Atlas').click()
await sleep(300)
check('atlas has 5 case nodes', document.querySelectorAll('.atlas-svg .case-node').length === 5)
document.querySelector('.case-node').dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
await sleep(300)
check('case panel opened (药明康德)', document.body.textContent.includes('药明康德'))
check('case question renders', document.body.textContent.includes('外部冲击是否真的损伤了机器'))
check('case methodological disclaimer', document.body.textContent.includes('Methodological Case Study'))

// ---- Step 7: compare (poly) ----
console.log('Step 7 · Compare')
findButton('Compare Cases').click()
await sleep(300)
check('compare panel opened', document.body.textContent.includes('Geometry 相似'))
check('conditional probability formula', document.body.textContent.includes('P(Y|P, C1) ≠ P(Y|P, C2)'))
check('geometry-no-independent-meaning quote', document.body.textContent.includes('几何没有脱离生成条件的独立意义'))

// ---- Step 8-9: conditional geometry ----
console.log('Step 8-9 · Conditional Geometry')
findButton('法无自性').click()
await sleep(300)
check('conditional panel opened', document.body.textContent.includes('上层生成机制的不相似'))
check('three condition tabs', document.querySelectorAll('.cond-tab').length === 3)
const decayTab = Array.from(document.querySelectorAll('.cond-tab')).find((b) => b.textContent.includes('结构衰减'))
decayTab.click()
await sleep(100)
check('outcome switches to decay', document.body.textContent.includes('价值随结构一起衰减'))

// ---- Step 10: diagnosis ----
console.log('Step 10 · Diagnosis')
findButton('Diagnose').click()
await sleep(300)
check('diagnosis panel opened', document.body.textContent.includes('Reflective System Diagnostic'))
check('18 sliders', document.querySelectorAll('.diag-group input[type=range]').length === 18)
const selectionSlider = Array.from(document.querySelectorAll('.diag-group input[type=range]')).find(
  (el) => el.getAttribute('aria-label').includes('Selection'),
)
setSlider(selectionSlider, 10)
await sleep(200)
check('bottleneck detected (选择压缩不足)', document.body.textContent.includes('选择压缩不足'))
check('direction rendered', document.body.textContent.includes('在扩大感知面之前'))
check('disclaimer present', document.body.textContent.includes('不构成投资建议'))
check('add-to-trajectory option', !!findButton('Add to Trajectory'))
check('replace-now option shown when now exists', !!findButton('Replace Now'))
findButton('Add to Trajectory').click()
await sleep(100)
findButton('应用到象限世界').click()
await sleep(120)
check('world reforming transition', !!document.querySelector('.world-wrap.reforming'))
await sleep(1800)
check('reforming transition completes', !document.querySelector('.world-wrap.reforming'))
check('back in world after apply', !!document.querySelector('.dock'))
check('eta updated from diagnosis', document.querySelector('.dock-eta').textContent.includes('architecture efficiency'))
check('diagnosis result became a trajectory node', document.body.textContent.includes('轨迹 5/5') && document.querySelectorAll('.traj-dot.kind-now').length === 2)

// ---- Step 11: about & methodology ----
console.log('Step 11 · About & Methodology')
findButton('About').click()
await sleep(300)
check('about methodology note', document.body.textContent.includes('Methodology') && document.body.textContent.includes('并非经过经验校准的科学评分'))
check('about what-is-this', document.body.textContent.includes('navigable world model'))
document.querySelector('.panel-close').click()
await sleep(200)

// ---- reset & sound off ----
findButton('Reset View').click()
await sleep(200)
check('reset returns sliders to 50', document.querySelectorAll('.dock input[type=range]')[0].value === '50')
findButton('Sound · On').click()
await sleep(100)
check('sound toggles off cleanly', !!findButton('Sound · Off') && window.__VF_AUDIO__.debug().instances === 1)

console.log('')
console.log('PASS ' + passCount + ' · FAIL ' + failures.length)
console.log('console errors: ' + consoleErrors.length)
for (const e of consoleErrors) console.log('  ' + e)
if (failures.length > 0) {
  console.log('Failed checks: ' + failures.join(' | '))
  process.exit(1)
}
console.log('SMOKE TEST OK')
