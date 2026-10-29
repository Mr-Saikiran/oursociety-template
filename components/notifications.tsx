'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Bell, Megaphone, Wrench, CalendarClock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { meetings } from '@/lib/data'
import type { LiveData } from '@/lib/live'
import { society } from '@/society/config'

type Item = { id: string; date: string; title: string; body: string; href: string; icon: LucideIcon }

const STORAGE_KEY = 'oursociety:notifications-seen'

// Notices, latest request updates and upcoming meetings, newest first.
const buildItems = ({ notices, requests }: LiveData): Item[] => [
  ...notices.map((n) => ({ id: `n-${n.id}`, date: n.date, title: n.title, body: n.audienceLabel, href: '/notices', icon: Megaphone })),
  ...requests.map((r) => {
    const last = r.updates[r.updates.length - 1]
    return { id: `r-${r.id}-${last.on}`, date: last.on, title: `${r.ticketNo}: ${r.title}`, body: last.note, href: '/requests', icon: Wrench }
  }),
  ...meetings
    .filter((m) => m.status === 'upcoming')
    .map((m) => ({ id: `m-${m.id}`, date: m.date, title: `Upcoming: ${m.title}`, body: `${m.time} · ${m.venue}`, href: '/meetings', icon: CalendarClock })),
].sort((a, b) => b.date.localeCompare(a.date))

const fmt = (d: string) => new Date(d).toLocaleDateString(society.locale, { day: 'numeric', month: 'short' })

function readSeen(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

export function Notifications({ live }: { live: LiveData }) {
  const items = useMemo(() => buildItems(live), [live])
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState<Set<string> | null>(null)
  useEffect(() => setSeen(readSeen()), [])

  const unread = useMemo(() => (seen ? items.filter((i) => !seen.has(i.id)).length : 0), [seen, items])

  function markAllRead() {
    const all = new Set(items.map((i) => i.id))
    setSeen(all)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...all]))
    } catch {}
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'} className="relative">
            <Bell />
            {unread > 0 && (
              <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] leading-4 font-bold text-accent-foreground ring-2 ring-background">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </Button>
        }
      />
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-sm">
        <div className="flex items-center justify-between border-b px-5 py-4 pr-12">
          <SheetTitle className="text-base">Notifications</SheetTitle>
          {unread > 0 && (
            <Button variant="link" size="sm" className="h-auto p-0" onClick={markAllRead}>
              Mark all read
            </Button>
          )}
        </div>
        <ul className="flex-1 overflow-y-auto p-2">
          {items.map((i) => {
            const isUnread = seen ? !seen.has(i.id) : false
            const Icon = i.icon
            return (
              <li key={i.id}>
                <Link
                  href={i.href}
                  onClick={() => setOpen(false)}
                  className="flex gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn('text-sm leading-snug', isUnread ? 'font-semibold' : 'font-medium text-foreground/80')}>{i.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{i.body}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="text-[11px] text-muted-foreground">{fmt(i.date)}</span>
                    {isUnread && <span className="size-2 rounded-full bg-accent" aria-label="Unread" />}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </SheetContent>
    </Sheet>
  )
}
