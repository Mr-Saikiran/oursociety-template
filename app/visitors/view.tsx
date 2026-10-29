'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Phone, Plus, Clock, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { Visitor } from '@/lib/data-extra'
import { createVisitor, setVisitorStatus } from '@/app/actions/data'
import { useAction } from '@/components/use-action'
import { useCanEdit } from '@/components/session-provider'
import { ReadOnlyNote } from '@/components/read-only-note'
import { society } from '@/society/config'

const statusLabel: Record<Visitor['status'], string> = {
  pending: 'Awaiting approval',
  approved: 'Approved',
  inside: 'Inside',
  exited: 'Exited',
  denied: 'Denied',
}
const statusVariant: Record<Visitor['status'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'default',
  approved: 'secondary',
  inside: 'secondary',
  exited: 'outline',
  denied: 'destructive',
}
const purposes: Visitor['purpose'][] = ['Guest', 'Delivery', 'Service', 'Cab', 'Contractor']

function PreApprove() {
  const [open, setOpen] = useState(false)
  const { pending, run } = useAction()
  const [purpose, setPurpose] = useState<Visitor['purpose']>('Guest')

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    run(
      () =>
        createVisitor({
          name: String(f.get('name')),
          phone: String(f.get('phone')),
          purpose,
          visiting: `${society.terms.unit} ${String(f.get('plot')).trim()}, ${String(f.get('road')).trim()}`,
          resident: String(f.get('resident')),
          expectedAt: String(f.get('when')).replace('T', ' '),
        }),
      () => setOpen(false),
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" />
        Pre-approve visitor
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pre-approve a visitor</DialogTitle>
          <DialogDescription>Security will let them in without a call.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5"><Label htmlFor="name">Visitor name</Label><Input id="name" name="name" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" required /></div>
            <div className="flex flex-col gap-1.5">
              <Label>Purpose</Label>
              <Select value={purpose} onValueChange={(v) => setPurpose(v as Visitor['purpose'])}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{purposes.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5"><Label htmlFor="plot">{society.terms.unit}</Label><Input id="plot" name="plot" required /></div>
            <div className="flex flex-col gap-1.5"><Label htmlFor="road">{society.terms.block}</Label><Input id="road" name="road" required /></div>
            <div className="flex flex-col gap-1.5"><Label htmlFor="resident">Resident</Label><Input id="resident" name="resident" /></div>
          </div>
          <div className="flex flex-col gap-1.5"><Label htmlFor="when">Expected at</Label><Input id="when" name="when" type="datetime-local" required /></div>
          <DialogFooter><Button type="submit" disabled={pending}>Approve</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function VisitorsView({ items }: { items: Visitor[] }) {
  const canEdit = useCanEdit()
  const { pending, run } = useAction()
  const setStatus = (id: string, status: Visitor['status']) => run(() => setVisitorStatus(id, status))

  const count = (s: Visitor['status']) => items.filter((v) => v.status === s).length

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(['pending', 'approved', 'inside', 'exited'] as const).map((s) => (
          <Card key={s}><CardContent className="p-4">
            <p className="text-2xl font-semibold">{count(s)}</p>
            <p className="text-sm text-muted-foreground">{statusLabel[s]}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="flex justify-end">
        {canEdit ? <PreApprove /> : <ReadOnlyNote action="approve or check in visitors" />}
      </div>

      <div className="flex flex-col gap-3">
        {items.map((v) => (
          <Card key={v.id}>
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{v.purpose}</Badge>
                  <Badge variant={statusVariant[v.status]}>{statusLabel[v.status]}</Badge>
                </div>
                <p className="font-medium">{v.name}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin className="size-3.5" aria-hidden />{v.visiting} · {v.resident}</span>
                  <span className="flex items-center gap-1.5"><Clock className="size-3.5" aria-hidden />{v.expectedAt}</span>
                  <span className="flex items-center gap-1.5"><Phone className="size-3.5" aria-hidden />{v.phone}</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                {canEdit && v.status === 'pending' && (
                  <>
                    <Button size="sm" disabled={pending} onClick={() => setStatus(v.id, 'approved')}>Approve</Button>
                    <Button size="sm" disabled={pending} variant="outline" onClick={() => setStatus(v.id, 'denied')}>Deny</Button>
                  </>
                )}
                {canEdit && v.status === 'approved' && <Button size="sm" disabled={pending} variant="outline" onClick={() => setStatus(v.id, 'inside')}>Check in</Button>}
                {canEdit && v.status === 'inside' && <Button size="sm" disabled={pending} variant="outline" onClick={() => setStatus(v.id, 'exited')}>Check out</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
