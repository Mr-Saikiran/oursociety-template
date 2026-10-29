'use client'

import { useState } from 'react'
import { CheckCircle2, Plus, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useCanEdit } from '@/components/session-provider'
import { ReadOnlyNote } from '@/components/read-only-note'
import { useAction } from '@/components/use-action'
import { createPoll, vote } from '@/app/actions/data'
import type { PublicPoll } from '@/lib/repo'
import { society } from '@/society/config'

const fmt = (d: string) => new Date(d).toLocaleDateString(society.locale, { day: 'numeric', month: 'short', year: 'numeric' })

function PollCard({ poll, today, canEdit }: { poll: PublicPoll; today: string; canEdit: boolean }) {
  const [choice, setChoice] = useState<string | null>(null)
  const { pending, run } = useAction()
  const closed = poll.closes < today
  const total = poll.options.reduce((s, o) => s + o.votes, 0)
  const showResults = closed || poll.myVote !== null || !canEdit
  const leader = Math.max(...poll.options.map((o) => o.votes))

  return (
    <Card className="py-0">
      <CardContent className="flex h-full flex-col gap-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xl font-bold leading-snug text-balance">{poll.question}</p>
            {poll.description && <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted-foreground">{poll.description}</p>}
          </div>
          <Badge variant={closed ? 'secondary' : 'mint'} className="shrink-0">{closed ? 'Closed' : 'Open'}</Badge>
        </div>

        <div className="flex flex-col gap-5">
          {poll.options.map((o) => {
            const pct = total ? Math.round((o.votes / total) * 100) : 0
            const lead = o.votes === leader && total > 0
            if (showResults) {
              return (
                <div key={o.id} className="flex flex-col gap-2">
                  <div className="flex items-end justify-between gap-4">
                    <span className="flex min-w-0 flex-col">
                      <span className="flex items-center gap-2 text-base font-bold leading-snug">
                        {o.label}
                        {poll.myVote === o.id && <CheckCircle2 className="size-5 shrink-0 text-primary" aria-label="Your vote" />}
                      </span>
                      <span className="tabular text-sm text-muted-foreground">{o.votes} votes</span>
                    </span>
                    <span className={`tabular shrink-0 text-3xl font-extrabold leading-none ${lead ? 'text-primary' : 'text-muted-foreground'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${lead ? 'bg-primary' : 'bg-primary/35'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            }
            return (
              <label
                key={o.id}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring ${choice === o.id ? 'bg-tone-mint text-tone-mint-ink' : 'bg-muted hover:bg-secondary'}`}
              >
                <input type="radio" name={poll.id} value={o.id} checked={choice === o.id} onChange={() => setChoice(o.id)} className="size-4 accent-[var(--primary)]" />
                {o.label}
              </label>
            )
          })}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            <span><span className="tabular font-bold text-foreground">{total}</span> votes</span>
            <span>{closed ? 'Closed' : 'Closes'} {fmt(poll.closes)}</span>
          </span>
          {!showResults && (
            <Button size="sm" onClick={() => choice && run(() => vote(poll.id, choice))} disabled={!choice || pending}>
              Submit vote
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function NewPoll({ today }: { today: string }) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState(['', ''])
  const { pending, run } = useAction()

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    run(
      () =>
        createPoll({
          question: String(f.get('question')),
          description: String(f.get('description')),
          closes: String(f.get('closes')),
          options,
        }),
      () => {
        setOpen(false)
        setOptions(['', ''])
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" />
        New poll
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a poll</DialogTitle>
          <DialogDescription>Signed-in members can vote once each.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5"><Label htmlFor="question">Question</Label><Input id="question" name="question" required /></div>
          <div className="flex flex-col gap-1.5"><Label htmlFor="description">Details (optional)</Label><Input id="description" name="description" /></div>
          <div className="flex flex-col gap-1.5"><Label htmlFor="closes">Closes on</Label><Input id="closes" name="closes" type="date" min={today} required /></div>
          <div className="flex flex-col gap-2">
            <Label>Options</Label>
            {options.map((o, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={o}
                  onChange={(e) => setOptions((p) => p.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder={`Option ${i + 1}`}
                  aria-label={`Option ${i + 1}`}
                  required={i < 2}
                />
                {options.length > 2 && (
                  <Button type="button" variant="ghost" size="icon" aria-label={`Remove option ${i + 1}`} onClick={() => setOptions((p) => p.filter((_, j) => j !== i))}>
                    <X />
                  </Button>
                )}
              </div>
            ))}
            {options.length < 6 && (
              <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => setOptions((p) => [...p, ''])}>
                <Plus data-icon="inline-start" />
                Add option
              </Button>
            )}
          </div>
          <DialogFooter><Button type="submit" disabled={pending}>Create poll</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function PollsView({ polls, today }: { polls: PublicPoll[]; today: string }) {
  const canEdit = useCanEdit()
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">{canEdit ? <NewPoll today={today} /> : <ReadOnlyNote action="vote or create polls" />}</div>
      <div className="grid gap-6 lg:grid-cols-2">
        {polls.map((p) => <PollCard key={p.id} poll={p} today={today} canEdit={canEdit} />)}
      </div>
    </div>
  )
}
