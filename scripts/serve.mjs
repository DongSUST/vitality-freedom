// Minimal static server for previewing dist/ (in-process, no child spawn).
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'

const root = resolve(process.argv[2] || 'dist')
const port = Number(process.env.PORT || 4173)
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
}

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent((req.url || '/').split('?')[0])
    if (p === '/') p = '/index.html'
    const file = normalize(join(root, p))
    if (!file.startsWith(root)) {
      res.writeHead(403); res.end('forbidden'); return
    }
    const data = await readFile(file)
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(404); res.end('not found')
  }
}).listen(port, () => console.log('serving ' + root + ' at http://localhost:' + port))
