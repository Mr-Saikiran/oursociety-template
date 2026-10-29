'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createSession,
  destroySession,
  getCurrentUser,
  hashPassword,
  requireAdmin,
  safeEqual,
  verifyPassword,
} from '@/lib/auth'
import { mutateUsers, normalizeEmail, readUsers, type Role, type StoredUser } from '@/lib/users'

export type FormState = { error?: string; ok?: string } | undefined

const MIN_PASSWORD = 8
const str = (f: FormData, k: string) => String(f.get(k) ?? '').trim()
const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const isRole = (r: string): r is Role => r === 'admin' || r === 'editor'
const pause = () => new Promise((r) => setTimeout(r, 400))

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const email = normalizeEmail(str(form, 'email'))
  const password = String(form.get('password') ?? '')
  const user = (await readUsers()).find((u) => u.email === email)
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    await pause()
    return { error: 'Email or password is incorrect.' }
  }
  await createSession(user.id)
  const next = str(form, 'next')
  redirect(next.startsWith('/') && !next.startsWith('//') ? next : '/')
}

export async function logout() {
  await destroySession()
  redirect('/')
}

/** Creates the first admin. Only works while no members exist, and needs the SETUP_CODE. */
export async function setupAdmin(_: FormState, form: FormData): Promise<FormState> {
  const expected = process.env.SETUP_CODE ?? (process.env.NODE_ENV === 'production' ? '' : 'dev-setup')
  if (!expected) return { error: 'Setup is disabled: SETUP_CODE is not configured.' }
  if (!safeEqual(str(form, 'setupCode'), expected)) {
    await pause()
    return { error: 'Setup code is incorrect.' }
  }

  const name = str(form, 'name')
  const email = normalizeEmail(str(form, 'email'))
  const password = String(form.get('password') ?? '')
  if (!name) return { error: 'Enter your name.' }
  if (!isEmail(email)) return { error: 'Enter a valid email.' }
  if (password.length < MIN_PASSWORD) return { error: `Password must be at least ${MIN_PASSWORD} characters.` }

  const admin: StoredUser = {
    id: randomUUID(),
    name,
    email,
    role: 'admin',
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  const created = await mutateUsers((users) =>
    users.length > 0 ? { items: users, result: false } : { items: [admin], result: true },
  )
  if (!created) return { error: 'An admin already exists. Sign in instead.' }
  await createSession(admin.id)
  redirect('/settings')
}

export async function addMember(_: FormState, form: FormData): Promise<FormState> {
  try {
    await requireAdmin()
  } catch (e) {
    return { error: (e as Error).message }
  }
  const name = str(form, 'name')
  const email = normalizeEmail(str(form, 'email'))
  const role = str(form, 'role')
  const password = String(form.get('password') ?? '')
  if (!name) return { error: 'Enter a name.' }
  if (!isEmail(email)) return { error: 'Enter a valid email.' }
  if (!isRole(role)) return { error: 'Choose a role.' }
  if (password.length < MIN_PASSWORD) return { error: `Temporary password must be at least ${MIN_PASSWORD} characters.` }

  const passwordHash = await hashPassword(password)
  const added = await mutateUsers((users) => {
    if (users.some((u) => u.email === email)) return { items: users, result: false }
    return {
      items: [...users, { id: randomUUID(), name, email, role, passwordHash, createdAt: new Date().toISOString() }],
      result: true,
    }
  })
  if (!added) return { error: 'A member with this email already exists.' }
  revalidatePath('/settings')
  return { ok: `${name} can now sign in as ${role}.` }
}

export async function updateRole(userId: string, role: Role): Promise<FormState> {
  const me = await requireAdmin()
  if (!isRole(role)) return { error: 'Invalid role.' }
  if (userId === me.id && role !== 'admin') return { error: 'You cannot remove your own admin role.' }
  const name = await mutateUsers((users) => {
    const target = users.find((u) => u.id === userId)
    if (target) target.role = role
    return { items: users, result: target?.name }
  })
  if (!name) return { error: 'Member not found.' }
  revalidatePath('/settings')
  return { ok: `${name} is now ${role}.` }
}

export async function removeMember(userId: string): Promise<FormState> {
  const me = await requireAdmin()
  if (userId === me.id) return { error: 'You cannot remove yourself.' }
  const name = await mutateUsers((users) => ({
    items: users.filter((u) => u.id !== userId),
    result: users.find((u) => u.id === userId)?.name,
  }))
  if (!name) return { error: 'Member not found.' }
  revalidatePath('/settings')
  return { ok: `${name} was removed.` }
}

export async function changePassword(_: FormState, form: FormData): Promise<FormState> {
  const me = await getCurrentUser()
  if (!me) return { error: 'Sign in first.' }
  const current = String(form.get('current') ?? '')
  const next = String(form.get('next') ?? '')
  if (next.length < MIN_PASSWORD) return { error: `New password must be at least ${MIN_PASSWORD} characters.` }
  const user = (await readUsers()).find((u) => u.id === me.id)
  if (!user || !(await verifyPassword(current, user.passwordHash))) {
    await pause()
    return { error: 'Current password is incorrect.' }
  }
  const passwordHash = await hashPassword(next)
  await mutateUsers((users) => ({
    items: users.map((u) => (u.id === me.id ? { ...u, passwordHash } : u)),
  }))
  return { ok: 'Password updated.' }
}
