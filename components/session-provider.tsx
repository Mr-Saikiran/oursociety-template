'use client'

import { createContext, useContext } from 'react'
import type { PublicUser } from '@/lib/users'

const SessionContext = createContext<PublicUser | null>(null)

export function SessionProvider({ user, children }: { user: PublicUser | null; children: React.ReactNode }) {
  return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
}

export const useSession = () => useContext(SessionContext)

/** Signed-in members (admins and editors) can make changes; everyone else is read-only. */
export const useCanEdit = () => useSession() !== null
