// Static demo mode (`npm run build:static`): a read-only export of the seed data
// that any static host can serve, optionally under a sub-path such as /oursociety.
// No sign-in, no database, no edits.
export const STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === '1'

/** Sub-path the app is served from, e.g. '/oursociety'. Empty at the domain root. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Prefixes a /public file with the base path. next/link adds it by itself; plain URLs don't. */
export const asset = (path: string) => `${basePath}${path}`
