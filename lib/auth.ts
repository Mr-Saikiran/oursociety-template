// Server-only auth helpers: scrypt password hashes and HMAC-signed session cookies.
import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { cookies } from 'next/headers'
import { readUsers, toPublic, type PublicUser } from './users'

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>

export const SESSION_COOKIE = 'os_session'
const SESSION_DAYS = 7

function secret() {
  const s = process.env.SESSION_SECRET
  if (s) return s
  if (process.env.NODE_ENV === 'production') throw new Error('SESSION_SECRET is not set')
  return 'dev-only-session-secret'
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16)
  const hash = await scrypt(password, salt, 64)
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, saltB64, hashB64] = stored.split('$')
  if (scheme !== 'scrypt' || !saltB64 || !hashB64) return false
  const expected = Buffer.from(hashB64, 'base64')
  const actual = await scrypt(password, Buffer.from(saltB64, 'base64'), expected.length)
  return timingSafeEqual(actual, expected)
}

export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

export async function createSession(userId: string) {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp })).toString('base64url')
  const jar = await cookies()
  jar.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
}

export async function destroySession() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

/** The signed-in member, re-read from the store so removed members lose access at once. */
export async function getCurrentUser(): Promise<PublicUser | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value
  if (!raw) return null
  const [payload, sig] = raw.split('.')
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return null
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (typeof exp !== 'number' || exp < Date.now()) return null
    const user = (await readUsers()).find((u) => u.id === uid)
    return user ? toPublic(user) : null
  } catch {
    return null
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') throw new Error('Only admins can do this')
  return user
}
