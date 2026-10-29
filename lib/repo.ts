// Typed collections in the lightweight DB. Each starts from the original seed data
// the first time it is read, and is persisted on the first write.
import { list } from './db'
import { maintenanceRecords, serviceRequests, type MaintenanceRecord, type ServiceRequest } from './data'
import { ledger, notices, polls, visitors, type LedgerEntry, type Notice, type Poll, type Visitor } from './data-extra'

export type StoredPoll = Poll & { voters?: Record<string, string> }

export type Booking = {
  id: string
  amenity: string
  date: string
  slot: string
  bookedBy: string
  createdAt: string
}

export type BillRun = {
  id: string
  frequency: string
  period: string
  channel: string
  count: number
  total: number
  sentBy: string
  sentAt: string
}

export const collections = {
  requests: { name: 'requests', seed: serviceRequests as ServiceRequest[] },
  visitors: { name: 'visitors', seed: visitors as Visitor[] },
  notices: { name: 'notices', seed: notices as Notice[] },
  ledger: { name: 'ledger', seed: ledger as LedgerEntry[] },
  polls: { name: 'polls', seed: polls as StoredPoll[] },
  bookings: { name: 'bookings', seed: [] as Booking[] },
  maintenance: { name: 'maintenance', seed: maintenanceRecords as MaintenanceRecord[] },
  bills: { name: 'bills', seed: [] as BillRun[] },
} as const

type Collections = typeof collections
export type Item<K extends keyof Collections> = Collections[K]['seed'][number]

export const all = <K extends keyof Collections>(key: K) =>
  list<Item<K>>(collections[key].name, collections[key].seed as Item<K>[])

/** Strip who-voted-what before sending polls to the browser. */
export const publicPoll = ({ voters, ...p }: StoredPoll, userId?: string) => ({
  ...p,
  myVote: userId ? voters?.[userId] ?? null : null,
})
export type PublicPoll = ReturnType<typeof publicPoll>
