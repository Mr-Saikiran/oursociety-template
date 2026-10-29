// Exports a read-only demo of the seed data to out/, for any static host.
//   npm run build:static                        → served from the domain root
//   npm run build:static -- --base /oursociety  → served from example.com/oursociety/
//
// Server actions need a server, so for the build app/actions is swapped for stubs
// (scripts/static-actions) and local dev data in .data is set aside, so the demo
// shows the seed data. Both are restored afterwards.
import { spawnSync } from 'node:child_process'
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const i = process.argv.indexOf('--base')
// Accepts /oursociety or oursociety (Git Bash on Windows rewrites a leading / into a path).
const name = i > -1 ? (process.argv[i + 1] ?? '').replace(/^\/+|\/+$/g, '') : ''
if (!/^[\w./-]*$/.test(name)) throw new Error('--base must be a path such as /oursociety')
const base = name ? `/${name}` : ''

const ASIDE = '.static-aside'
const setAside = ['app/actions', '.data'].filter((p) => existsSync(p))

if (existsSync(ASIDE)) throw new Error(`${ASIDE}/ exists from an interrupted build. Move its contents back first.`)
mkdirSync(ASIDE)
try {
  setAside.forEach((p, n) => renameSync(p, `${ASIDE}/${n}`))
  cpSync('scripts/static-actions', 'app/actions', { recursive: true })
  rmSync('out', { recursive: true, force: true })

  const r = spawnSync('npx next build', {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NEXT_PUBLIC_STATIC_DEMO: '1', NEXT_PUBLIC_BASE_PATH: base },
  })
  if (r.status !== 0) process.exitCode = r.status ?? 1
  else {
    flattenSegmentPrefetches('out')
    console.log(`\nStatic demo written to out/${base ? `, to be served at ${base}/` : ''}`)
  }
} finally {
  rmSync('app/actions', { recursive: true, force: true })
  setAside.forEach((p, n) => renameSync(`${ASIDE}/${n}`, p))
  rmSync(ASIDE, { recursive: true, force: true })
}

// The export writes segment prefetches as `__next.maintenance/__PAGE__.txt`, but the
// client requests `__next.maintenance.__PAGE__.txt`. Add the flat copies it asks for.
function flattenSegmentPrefetches(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (!entry.isDirectory()) continue
    if (!entry.name.startsWith('__next.')) {
      flattenSegmentPrefetches(path)
      continue
    }
    const copy = (sub, prefix) => {
      for (const e of readdirSync(sub, { withFileTypes: true })) {
        const name = `${prefix}.${e.name}`
        if (e.isDirectory()) copy(join(sub, e.name), name)
        else copyFileSync(join(sub, e.name), join(dir, name))
      }
    }
    copy(path, entry.name)
  }
}
