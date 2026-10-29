'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CornerDownLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { navItems } from '@/lib/nav'
import { advisoryCommittee, executiveCommittee, meetings } from '@/lib/data'
import { contacts, documents } from '@/lib/data-extra'
import type { LiveData } from '@/lib/live'
import { society } from '@/society/config'

type Result = { id: string; title: string; subtitle: string; href: string; kind: string }

// Static part of the index: pages, committee, meetings, documents, contacts.
const staticIndex: Result[] = [
  ...navItems.map((n) => ({ id: `nav-${n.href}`, title: n.label, subtitle: n.description, href: n.href, kind: 'Page' })),
  ...[...executiveCommittee, ...advisoryCommittee].map((m) => ({
    id: `cm-${m.id}`, title: m.name, subtitle: m.role, href: '/committee', kind: 'Committee',
  })),
  ...meetings.map((m) => ({ id: `mt-${m.id}`, title: m.title, subtitle: `${m.type} · ${m.date}`, href: '/meetings', kind: 'Meeting' })),
  ...documents.map((d) => ({ id: `dc-${d.id}`, title: d.name, subtitle: d.category, href: '/documents', kind: 'Document' })),
  ...contacts.map((c) => ({ id: `ct-${c.id}`, title: c.name, subtitle: `${c.role} · ${c.phone}`, href: '/contacts', kind: 'Contact' })),
]

const buildIndex = ({ notices, requests, maintenance }: LiveData): Result[] => [
  ...staticIndex,
  ...maintenance.map((r) => ({
    id: `mr-${r.plotNo}`, title: r.owner, subtitle: `${society.terms.unit} ${r.plotNo}, ${society.terms.block} ${r.road} · ${r.status}`, href: '/maintenance', kind: 'Member',
  })),
  ...notices.map((n) => ({ id: `nt-${n.id}`, title: n.title, subtitle: n.audienceLabel, href: '/notices', kind: 'Notice' })),
  ...requests.map((r) => ({ id: `rq-${r.id}`, title: r.title, subtitle: `${r.ticketNo} · ${r.status}`, href: '/requests', kind: 'Request' })),
]

export function SearchDialog({ live }: { live: LiveData }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const index = useMemo(() => buildIndex(live), [live])
  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
    if (terms.length === 0) return index.filter((r) => r.kind === 'Page')
    return index
      .filter((r) => {
        const hay = `${r.title} ${r.subtitle} ${r.kind}`.toLowerCase()
        return terms.every((t) => hay.includes(t))
      })
      .slice(0, 30)
  }, [q, index])

  useEffect(() => setActive(0), [q])
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  function go(r: Result) {
    setOpen(false)
    setQ('')
    router.push(r.href)
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    if (e.key === 'Enter' && results[active]) { e.preventDefault(); go(results[active]) }
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="hidden h-9 w-56 justify-start gap-2 rounded-lg bg-muted/40 px-3 text-sm font-normal text-muted-foreground md:inline-flex"
      >
        <Search className="size-4" />
        Search…
        <kbd className="ml-auto rounded border bg-background px-1.5 text-[10px] font-medium">Ctrl K</kbd>
      </Button>
      <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setOpen(true)} className="md:hidden">
        <Search />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="top-[15%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl">
          <DialogTitle className="sr-only">Search {society.appName}</DialogTitle>
          <div className="flex items-center gap-2 border-b px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Search members, plots, notices, documents, contacts…"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Search"
              role="combobox"
              aria-expanded
              aria-controls="search-results"
            />
          </div>
          <ul id="search-results" ref={listRef} role="listbox" className="max-h-[50dvh] overflow-y-auto p-2">
            {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted-foreground">No results for “{q}”.</li>}
            {results.map((r, i) => (
              <li
                key={r.id}
                data-index={i}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm',
                  i === active && 'bg-muted',
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{r.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>
                </div>
                <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{r.kind}</span>
                {i === active && <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />}
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  )
}
