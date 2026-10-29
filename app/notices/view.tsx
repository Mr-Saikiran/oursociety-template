'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Paperclip, Plus, Users, MapPin, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { Notice } from '@/lib/data-extra'
import { createNotice, deleteNotice } from '@/app/actions/data'
import { useAction } from '@/components/use-action'
import { useCanEdit } from '@/components/session-provider'
import { ReadOnlyNote } from '@/components/read-only-note'
import { society } from '@/society/config'

const fmt = (d: string) => new Date(d).toLocaleDateString(society.locale, { day: 'numeric', month: 'short', year: 'numeric' })
const categories: Notice['category'][] = ['General', 'Maintenance', 'Event', 'Security', 'Urgent']
const toneFor = (c: Notice['category']) =>
  c === 'Urgent' ? 'coral' : c === 'Event' ? 'sun' : c === 'Maintenance' ? 'sky' : c === 'Security' ? 'coral' : 'mint'

function NewNotice() {
  const [open, setOpen] = useState(false)
  const { pending, run } = useAction()
  const [audience, setAudience] = useState<Notice['audience']>('all')
  const [category, setCategory] = useState<Notice['category']>('General')

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const files = (f.getAll('files') as File[]).filter((x) => x.size > 0).map((x) => x.name)
    const roads = String(f.get('roads') ?? '').trim()
    run(
      () =>
        createNotice({
          title: String(f.get('title')),
          body: String(f.get('body')),
          audience,
          category,
          roads,
          attachments: files,
        }),
      () => setOpen(false),
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" />
        New notice
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a notice</DialogTitle>
          <DialogDescription>Applicable members are emailed when you publish.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5"><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
          <div className="flex flex-col gap-1.5"><Label htmlFor="body">Message</Label><Textarea id="body" name="body" rows={4} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Audience</Label>
              <Select items={[{ value: 'all', label: 'All members' }, { value: 'unit', label: 'Specific roads' }]} value={audience} onValueChange={(v) => setAudience(v as Notice['audience'])}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All members</SelectItem>
                  <SelectItem value="unit">Specific roads</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Notice['category'])}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          {audience === 'unit' && (
            <div className="flex flex-col gap-1.5"><Label htmlFor="roads">{society.terms.block}s</Label><Input id="roads" name="roads" required placeholder="e.g. 4B, 4C" /></div>
          )}
          <div className="flex flex-col gap-1.5"><Label htmlFor="files">Attachments</Label><Input id="files" name="files" type="file" multiple /></div>
          <DialogFooter><Button type="submit" disabled={pending}>Publish</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function NoticesView({ items }: { items: Notice[] }) {
  const canEdit = useCanEdit()
  const { pending, run } = useAction()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        {canEdit ? <NewNotice /> : <ReadOnlyNote action="publish notices" />}
      </div>
      <Card className="py-0">
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {items.map((n) => {
              const d = new Date(n.date)
              return (
                <li key={n.id} className="flex gap-4 px-5 py-6 sm:gap-5 sm:px-6">
                  <div
                    className={`flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl ${
                      n.category === 'Urgent' ? 'bg-tone-coral text-tone-coral-ink' : 'bg-accent text-accent-foreground'
                    }`}
                    aria-hidden
                  >
                    <span className="tabular text-2xl font-extrabold leading-none">
                      {d.toLocaleDateString(society.locale, { day: 'numeric' })}
                    </span>
                    <span className="text-xs font-bold">{d.toLocaleDateString(society.locale, { month: 'short' })}</span>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <Badge variant={toneFor(n.category)}>{n.category}</Badge>
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        {n.audience === 'all' ? <Users className="size-4" aria-hidden /> : <MapPin className="size-4" aria-hidden />}
                        {n.audienceLabel}
                      </span>
                      <span className="text-sm text-muted-foreground">{fmt(n.date)}</span>
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="ml-auto"
                          aria-label={`Delete notice: ${n.title}`}
                          disabled={pending}
                          onClick={() => confirm(`Delete "${n.title}"?`) && run(() => deleteNotice(n.id))}
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>
                    <p className="text-lg font-bold leading-snug">{n.title}</p>
                    <p className="max-w-prose text-[0.9375rem] leading-relaxed text-muted-foreground">{n.body}</p>
                    {n.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {n.attachments.map((a) => (
                          <span key={a} className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-semibold">
                            <Paperclip className="size-4 text-primary" aria-hidden />{a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
