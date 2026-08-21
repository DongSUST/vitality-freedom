// Rollup-based production build (in-process, no child spawn — sandbox safe).
// Emits dist/index.html + dist/assets/app.js + dist/assets/style.css
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'

const cssChunks = []
function cssBundle() {
  return {
    name: 'css-bundle',
    transform(code, id) {
      if (id.endsWith('.css')) {
        cssChunks.push(code)
        return ''
      }
      return null
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'style.css', source: cssChunks.join('\n') })
    },
  }
}

rmSync('dist', { recursive: true, force: true })

const bundle = await rollup({
  input: 'src/main.tsx',
  plugins: [
    nodeResolve({ browser: true, exportConditions: ['browser'] }),
    commonjs(),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production'), preventAssignment: true }),
    typescript({ tsconfig: './tsconfig.json' }),
    cssBundle(),
  ],
})

await bundle.write({
  dir: 'dist/assets',
  format: 'es',
  entryFileNames: 'app.js',
  chunkFileNames: '[name].js',
  assetFileNames: '[name][extname]',
})
await bundle.close()

const html = readFileSync('index.html', 'utf8').replace(
  '<script type="module" src="/src/main.tsx"></script>',
  '<link rel="stylesheet" href="./assets/style.css" />\n    <script type="module" src="./assets/app.js"></script>',
)
mkdirSync('dist', { recursive: true })
writeFileSync('dist/index.html', html)
if (existsSync('public')) cpSync('public', 'dist', { recursive: true })
console.log('Build complete → dist/')
