'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'
import { mutate, newId } from '@/lib/db'
import { collections, type Booking, type BillRun, type Item } from '@/lib/repo'
import { requestCategories, type RequestCategory, type ServiceRequest } from '@/lib/data'
import type { LedgerEntry, Notice, Visitor } from '@/lib/data-extra'
import { society } from '@/society/config'

export type ActionResult = { ok?: string; error?: string }

const today = () => new Date().toISOString().slice(0, 10)
const clean = (v: unknown, max = 500) => String(v ?? '').trim().slice(0, max)

async function editor() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Sign in to make changes.')
  return user
}

/** Runs a signed-in mutation on a collection, revalidates the given pages, and maps errors to a result. */
async function change<K extends keyof typeof collections>(
  key: K,
  paths: string[],
  fn: (items: Item<K>[], user: Awaited<ReturnType<typeof editor>>) => { items: Item<K>[]; ok: string } | { error: string },
): Promise<ActionResult> {
  try {
    const user = await editor()
    const { name, seed } = collections[key]
    const out = await mutate<Item<K>, ActionResult>(name, seed as Item<K>[], (items) => {
      const r = fn(items, user)
      return 'error' in r ? { items, result: { error: r.error } } : { items: r.items, result: { ok: r.ok } }
    })
    if (out?.ok) for (const p of paths) revalidatePath(p)
    return out ?? { error: 'Nothing changed.' }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

/* ----------------------------- Requests ------------------------------ */

export type NewRequest = Pick<ServiceRequest, 'category' | 'title' | 'description' | 'plotNo' | 'road' | 'raisedBy' | 'priority'>

export async function createRequest(input: NewRequest) {
  return change('requests', ['/requests', '/'], (items, user) => {
    if (!requestCategories.some((c) => c.id === input.category)) return { error: 'Choose a category.' }
    if (!['low', 'medium', 'high'].includes(input.priority)) return { error: 'Choose a priority.' }
    const title = clean(input.title, 140)
    if (!title) return { error: 'Enter a title.' }
    const year = new Date().getFullYear()
    const max = Math.max(0, ...items.map((r) => Number(r.ticketNo.split('-').pop()) || 0))
    const req: ServiceRequest = {
      id: newId('req'),
      ticketNo: `${society.ticketPrefix}-${year}-${String(max + 1).padStart(4, '0')}`,
      category: input.category as RequestCategory,
      title,
      description: clean(input.description, 2000),
      plotNo: clean(input.plotNo, 10),
      road: clean(input.road, 10),
      raisedBy: clean(input.raisedBy, 80) || user.name,
      raisedOn: today(),
      status: 'open',
      priority: input.priority,
      updates: [{ on: today(), note: `Ticket raised by ${user.name}.` }],
    }
    return { items: [req, ...items], ok: `Ticket ${req.ticketNo} raised` }
  })
}

export async function updateRequest(id: string, status: ServiceRequest['status'], note: string) {
  return change('requests', ['/requests', '/'], (items, user) => {
    const req = items.find((r) => r.id === id)
    if (!req) return { error: 'Request not found.' }
    if (!['open', 'in-progress', 'resolved'].includes(status)) return { error: 'Invalid status.' }
    const text = clean(note, 1000)
    if (!text && status === req.status) return { error: 'Add a note or change the status.' }
    req.status = status
    req.updates.push({ on: today(), note: `${text || `Status changed to ${status}.`} — ${user.name}` })
    return { items, ok: `${req.ticketNo} updated` }
  })
}

/* ----------------------------- Visitors ------------------------------ */

export async function createVisitor(input: Omit<Visitor, 'id' | 'status'>) {
  return change('visitors', ['/visitors'], (items) => {
    const name = clean(input.name, 80)
    if (!name) return { error: 'Enter the visitor name.' }
    const v: Visitor = {
      id: newId('v'),
      name,
      phone: clean(input.phone, 20),
      purpose: input.purpose,
      visiting: clean(input.visiting, 60),
      resident: clean(input.resident, 80) || 'Resident',
      expectedAt: clean(input.expectedAt, 20),
      status: 'approved',
    }
    return { items: [v, ...items], ok: `${name} pre-approved. Gate security can let them in.` }
  })
}

export async function setVisitorStatus(id: string, status: Visitor['status']) {
  const verbs: Record<string, string> = { approved: 'approved', denied: 'denied', inside: 'checked in', exited: 'checked out' }
  return change('visitors', ['/visitors'], (items) => {
    const v = items.find((x) => x.id === id)
    if (!v) return { error: 'Visitor not found.' }
    if (!verbs[status]) return { error: 'Invalid status.' }
    v.status = status
    return { items, ok: `${v.name} ${verbs[status]}` }
  })
}

/* ------------------------------ Notices ------------------------------ */

export async function createNotice(input: Pick<Notice, 'title' | 'body' | 'audience' | 'category'> & { roads?: string; attachments?: string[] }) {
  return change('notices', ['/notices', '/'], (items) => {
    const title = clean(input.title, 140)
    if (!title) return { error: 'Enter a title.' }
    const roads = clean(input.roads, 60)
    if (input.audience === 'unit' && !roads) return { error: 'Enter the roads this notice is for.' }
    const n: Notice = {
      id: newId('n'),
      title,
      body: clean(input.body, 4000),
      date: today(),
      audience: input.audience === 'unit' ? 'unit' : 'all',
      audienceLabel: input.audience === 'unit' ? `${society.terms.block} ${roads}` : 'All members',
      category: input.category,
      attachments: (input.attachments ?? []).map((a) => clean(a, 120)).slice(0, 10),
    }
    return { items: [n, ...items], ok: 'Notice published' }
  })
}

export async function deleteNotice(id: string) {
  return change('notices', ['/notices', '/'], (items) => {
    if (!items.some((n) => n.id === id)) return { error: 'Notice not found.' }
    return { items: items.filter((n) => n.id !== id), ok: 'Notice deleted' }
  })
}

/* ------------------------------ Ledger ------------------------------- */

const MODES: LedgerEntry['mode'][] = ['UPI', 'Bank transfer', 'Cash', 'Cheque']

export async function createLedgerEntry(input: Omit<LedgerEntry, 'id' | 'date'>) {
  return change('ledger', ['/accounting'], (items) => {
    const amount = Math.round(Number(input.amount))
    if (!(amount > 0)) return { error: 'Enter an amount above zero.' }
    if (!MODES.includes(input.mode)) return { error: 'Choose a payment mode.' }
    const e: LedgerEntry = {
      id: newId('l'),
      date: today(),
      type: input.type === 'income' ? 'income' : 'expense',
      category: clean(input.category, 60) || 'General',
      description: clean(input.description, 200),
      amount,
      mode: input.mode,
    }
    return { items: [e, ...items], ok: 'Entry added to ledger' }
  })
}

export async function deleteLedgerEntry(id: string) {
  return change('ledger', ['/accounting'], (items) => {
    if (!items.some((e) => e.id === id)) return { error: 'Entry not found.' }
    return { items: items.filter((e) => e.id !== id), ok: 'Entry deleted' }
  })
}

/* ------------------------------- Polls ------------------------------- */

export async function vote(pollId: string, optionId: string) {
  return change('polls', ['/polls'], (items, user) => {
    const poll = items.find((p) => p.id === pollId)
    if (!poll) return { error: 'Poll not found.' }
    if (poll.closes < today()) return { error: 'This poll has closed.' }
    const option = poll.options.find((o) => o.id === optionId)
    if (!option) return { error: 'Choose an option.' }
    poll.voters ??= {}
    if (poll.voters[user.id]) return { error: 'You have already voted in this poll.' }
    poll.voters[user.id] = optionId
    option.votes += 1
    return { items, ok: 'Your vote has been recorded' }
  })
}

export async function createPoll(input: { question: string; description: string; closes: string; options: string[] }) {
  return change('polls', ['/polls'], (items) => {
    const question = clean(input.question, 200)
    const options = input.options.map((o) => clean(o, 80)).filter(Boolean)
    if (!question) return { error: 'Enter a question.' }
    if (options.length < 2) return { error: 'Add at least two options.' }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.closes) || input.closes < today()) return { error: 'Choose a closing date from today onwards.' }
    return {
      items: [
        {
          id: newId('p'),
          question,
          description: clean(input.description, 400),
          closes: input.closes,
          options: options.map((label, i) => ({ id: String.fromCharCode(97 + i), label, votes: 0 })),
          voters: {},
        },
        ...items,
      ],
      ok: 'Poll created',
    }
  })
}

/* ----------------------------- Bookings ------------------------------ */

export async function createBooking(input: Pick<Booking, 'amenity' | 'date' | 'slot'>) {
  return change('bookings', ['/amenities'], (items, user) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || input.date < today()) return { error: 'Choose a date from today onwards.' }
    const slot = clean(input.slot, 40)
    if (!slot) return { error: 'Choose a time slot.' }
    const amenity = clean(input.amenity, 80)
    if (items.some((b) => b.amenity === amenity && b.date === input.date && b.slot === slot)) {
      return { error: `${amenity} is already booked for that slot.` }
    }
    const b: Booking = { id: newId('b'), amenity, date: input.date, slot, bookedBy: user.name, createdAt: new Date().toISOString() }
    return { items: [b, ...items], ok: `${amenity} booked for ${input.date}, ${slot}` }
  })
}

export async function cancelBooking(id: string) {
  return change('bookings', ['/amenities'], (items) => {
    if (!items.some((b) => b.id === id)) return { error: 'Booking not found.' }
    return { items: items.filter((b) => b.id !== id), ok: 'Booking cancelled' }
  })
}

/* ---------------------------- Maintenance ---------------------------- */

export async function recordPayment(plotNo: string, amount: number, mode: LedgerEntry['mode']) {
  const amt = Math.round(Number(amount))
  if (!(amt > 0)) return { error: 'Enter an amount above zero.' }
  if (!MODES.includes(mode)) return { error: 'Choose a payment mode.' }
  let owner = ''
  const res = await change('maintenance', ['/maintenance', '/'], (items) => {
    const r = items.find((x) => x.plotNo === plotNo)
    if (!r) return { error: `${society.terms.unit} not found.` }
    if (amt > r.dueAmount) return { error: `Amount is more than the ${r.dueAmount} due.` }
    r.dueAmount -= amt
    r.paidAmount += amt
    r.status = r.dueAmount === 0 ? 'paid' : 'partial'
    r.lastPaid = today()
    owner = r.owner
    return { items, ok: `Payment recorded for plot ${plotNo}` }
  })
  if (res.ok) {
    // Keep the books in step: every maintenance payment is also ledger income.
    await createLedgerEntry({
      type: 'income',
      category: 'Maintenance',
      description: `Maintenance — plot ${plotNo} (${owner})`,
      amount: amt,
      mode,
    })
  }
  return res
}

/* ------------------------------- Bills ------------------------------- */

export async function recordBillRun(input: Omit<BillRun, 'id' | 'sentBy' | 'sentAt'>) {
  return change('bills', ['/bills'], (items, user) => {
    const run: BillRun = {
      id: newId('bill'),
      frequency: clean(input.frequency, 20),
      period: clean(input.period, 40),
      channel: clean(input.channel, 20),
      count: Math.max(0, Math.round(input.count)),
      total: Math.max(0, Math.round(input.total)),
      sentBy: user.name,
      sentAt: new Date().toISOString(),
    }
    return { items: [run, ...items], ok: `${run.count} bills for ${run.period} marked as sent` }
  })
}

