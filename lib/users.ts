// Server-only member store, kept in the "users" collection of the lightweight DB.
import { list, mutate } from './db'

export type Role = 'admin' | 'editor'

export type StoredUser = {
  id: string
  name: string
  email: string
  role: Role
  passwordHash: string
  createdAt: string
}

export type PublicUser = Pick<StoredUser, 'id' | 'name' | 'email' | 'role'>

export const readUsers = () => list<StoredUser>('users')

export const mutateUsers = <R>(fn: (users: StoredUser[]) => { items: StoredUser[]; result?: R }) =>
  mutate<StoredUser, R>('users', [], fn)

export const toPublic = ({ id, name, email, role }: StoredUser): PublicUser => ({ id, name, email, role })

export const normalizeEmail = (e: string) => e.trim().toLowerCase()
