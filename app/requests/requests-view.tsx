'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Trash2, Waves, Cctv, Zap, TrafficCone, Plus, CalendarClock, MapPin, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  requestCategories,
  type RequestCategory,
  type ServiceRequest,
} from '@/lib/data'
import { createRequest, updateRequest } from '@/app/actions/data'
import { useAction } from '@/components/use-action'
import { useCanEdit } from '@/components/session-provider'
import { ReadOnlyNote } from '@/components/read-only-note'
import { society } from '@/society/config'

const icons: Record<string, LucideIcon> = { Trash2, Waves, Cctv, Zap, TrafficCone }

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString(society.locale, { day: 'numeric', month: 'short', year: 'numeric' })

const categoryLabel = (id: RequestCategory) => requestCategories.find((c) => c.id === id)?.label ?? id

const statusLabel: Record<ServiceRequest['status'], string> = {
  open: 'Open',
  'in-progress': 'In progress',
  resolved: 'Resolved',
}

const statusVariant: Record<ServiceRequest['status'], 'default' | 'secondary' | 'outline'> = {
  open: 'default',
  'in-progress': 'secondary',
  resolved: 'outline',
}

const priorityVariant: Record<ServiceRequest['priority'], 'destructive' | 'secondary' | 'outline'> = {
  high: 'destructive',
  medium: 'secondary',
  low: 'outline',
}

function UpdateDialog({ req }: { req: ServiceRequest }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(req.status)
  const [note, setNote] = useState('')
  const { pending, run } = useAction()
  const statusItems = (Object.keys(statusLabel) as ServiceRequest['status'][]).map((s) => ({ value: s, label: statusLabel[s] }))
  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) { setStatus(req.status); setNote('') } }}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>Update</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update {req.ticketNo}</DialogTitle>
          <DialogDescription>{req.title}</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            run(() => updateRequest(req.id, status, note), () => setOpen(false))
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Select items={statusItems} value={status} onValueChange={(v) => setStatus(v as ServiceRequest['status'])}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {statusItems.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`note-${req.id}`}>Update note</Label>
            <Textarea id={`note-${req.id}`} rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Plumber assigned, visit on Monday" />
          </div>
          <DialogFooter><Button type="submit" disabled={pending}>Save update</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function TicketCard({ req, canEdit }: { req: ServiceRequest; canEdit: boolean }) {
  const cat = requestCategories.find((c) => c.id === req.category)
  const Icon = (cat && icons[cat.icon]) || Zap
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                {req.ticketNo} · {categoryLabel(req.category)}
              </p>
              <p className="font-medium leading-snug text-balance">{req.title}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <Badge variant={statusVariant[req.status]}>{statusLabel[req.status]}</Badge>
            <Badge variant={priorityVariant[req.priority]} className="capitalize">
              {req.priority}
            </Badge>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{req.description}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden />
            {society.terms.unit} {req.plotNo}, {society.terms.block} {req.road}
          </span>
          <span className="flex items-center gap-1.5">
            <UserRound className="size-3.5" aria-hidden />
            {req.raisedBy}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarClock className="size-3.5" aria-hidden />
            {fmtDate(req.raisedOn)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm">
            {req.assignedTo && (
              <>
                <span className="text-muted-foreground">Assigned to: </span>
                {req.assignedTo}
              </>
            )}
          </p>
          {canEdit && <UpdateDialog req={req} />}
        </div>

        <ol className="flex flex-col gap-2 border-l pl-4">
          {req.updates.map((u, i) => (
            <li key={i} className="relative text-sm">
              <span className="absolute top-1.5 -left-[1.28rem] size-2 rounded-full bg-primary" aria-hidden />
              <span className="text-xs text-muted-foreground">{fmtDate(u.on)}</span>
              <p>{u.note}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

function NewRequestDialog() {
  const [open, setOpen] = useState(false)
  const { pending, run } = useAction()
  const [category, setCategory] = useState<RequestCategory | ''>('')
  const [priority, setPriority] = useState<ServiceRequest['priority']>('medium')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (!category) {
      toast.error('Please choose a category')
      return
    }
    const form = e.currentTarget
    run(
      () =>
        createRequest({
          category,
          priority,
          title: String(f.get('title')),
          description: String(f.get('description')),
          plotNo: String(f.get('plotNo')),
          road: String(f.get('road')),
          raisedBy: String(f.get('raisedBy')),
        }),
      () => {
        form.reset()
        setOpen(false)
        setCategory('')
        setPriority('medium')
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" />
        New request
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Raise a request</DialogTitle>
          <DialogDescription>The committee will review it and post updates here.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Category</Label>
              <Select items={requestCategories.map((c) => ({ value: c.id, label: c.label }))} value={category} onValueChange={(v) => setCategory(v as RequestCategory)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {requestCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Priority</Label>
              <Select items={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} value={priority} onValueChange={(v) => setPriority(v as ServiceRequest['priority'])}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required placeholder="e.g. Garbage not collected" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Details</Label>
            <Textarea id="description" name="description" required rows={3} placeholder="What happened, since when?" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plotNo">{society.terms.unit} no.</Label>
              <Input id="plotNo" name="plotNo" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="road">{society.terms.block}</Label>
              <Input id="road" name="road" required placeholder="e.g. 4B" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="raisedBy">Your name</Label>
              <Input id="raisedBy" name="raisedBy" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending}>Submit request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function RequestsView({ items }: { items: ServiceRequest[] }) {
  const canEdit = useCanEdit()
  const [category, setCategory] = useState<'all' | RequestCategory>('all')
  const [tab, setTab] = useState<'all' | ServiceRequest['status']>('all')

  const counts = useMemo(
    () => ({
      open: items.filter((r) => r.status === 'open').length,
      'in-progress': items.filter((r) => r.status === 'in-progress').length,
      resolved: items.filter((r) => r.status === 'resolved').length,
    }),
    [items],
  )

  const filtered = useMemo(
    () =>
      items
        .filter((r) => (tab === 'all' || r.status === tab) && (category === 'all' || r.category === category))
        .sort((a, b) => b.raisedOn.localeCompare(a.raisedOn) || b.ticketNo.localeCompare(a.ticketNo)),
    [items, tab, category],
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3">
        {(['open', 'in-progress', 'resolved'] as const).map((s) => (
          <Card key={s}>
            <CardContent className="p-4">
              <p className="text-2xl font-semibold">{counts[s]}</p>
              <p className="text-sm text-muted-foreground">{statusLabel[s]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select items={[{ value: 'all', label: 'All categories' }, ...requestCategories.map((c) => ({ value: c.id, label: c.label }))]} value={category} onValueChange={(v) => setCategory(v as 'all' | RequestCategory)}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {requestCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {canEdit ? <NewRequestDialog /> : <ReadOnlyNote action="raise or update requests" />}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No requests match these filters.</p>
          ) : (
            filtered.map((r) => <TicketCard key={r.id} req={r} canEdit={canEdit} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
