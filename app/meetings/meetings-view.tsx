'use client'

import { useState } from 'react'
import { CalendarClock, MapPin, Clock, FileText, Users, ChevronRight } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { meetings, type Meeting } from '@/lib/data'
import { society } from '@/society/config'

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString(society.locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

function MeetingCard({ meeting, onOpen }: { meeting: Meeting; onOpen: (m: Meeting) => void }) {
  const hasMinutes = meeting.status === 'held' && meeting.minutes
  const upcoming = meeting.status === 'upcoming'
  const d = new Date(meeting.date)
  return (
    <li className="flex gap-4 px-5 py-6 sm:gap-5 sm:px-6">
      <div
        className={`flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl ${
          upcoming ? 'bg-accent text-accent-foreground' : 'bg-tone-sky text-tone-sky-ink'
        }`}
        aria-hidden
      >
        <span className="tabular text-2xl font-extrabold leading-none">{d.toLocaleDateString(society.locale, { day: 'numeric' })}</span>
        <span className="text-xs font-bold">{d.toLocaleDateString(society.locale, { month: 'short' })}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={upcoming ? 'sun' : 'sky'}>{meeting.type}</Badge>
            {upcoming && <Badge variant="mint">Upcoming</Badge>}
          </div>
          <p className="text-lg font-bold leading-snug">{meeting.title}</p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CalendarClock className="size-4" />{fmtDate(meeting.date)}</span>
            <span className="flex items-center gap-1.5"><Clock className="size-4" />{meeting.time}</span>
            <span className="flex items-center gap-1.5"><MapPin className="size-4" />{meeting.venue}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {meeting.agenda.slice(0, 3).map((a) => (
              <span key={a} className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">{a}</span>
            ))}
            {meeting.agenda.length > 3 && (
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">+{meeting.agenda.length - 3} more</span>
            )}
          </div>
        </div>
        {hasMinutes && (
          <Button variant="outline" className="shrink-0 self-start sm:self-center" onClick={() => onOpen(meeting)}>
            <FileText data-icon="inline-start" />
            View minutes
          </Button>
        )}
      </div>
    </li>
  )
}

export function MeetingsView() {
  const [active, setActive] = useState<Meeting | null>(null)
  const held = meetings.filter((m) => m.status === 'held').sort((a, b) => b.date.localeCompare(a.date))
  const upcoming = meetings.filter((m) => m.status === 'upcoming').sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="held">Held ({held.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-5">
          <Card className="py-0">
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {upcoming.map((m) => <MeetingCard key={m.id} meeting={m} onOpen={setActive} />)}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="held" className="mt-5">
          <Card className="py-0">
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {held.map((m) => <MeetingCard key={m.id} meeting={m} onOpen={setActive} />)}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl gap-0 p-0">
          {active && (
            <>
              <DialogHeader className="border-b border-border p-6 text-left">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge variant="sky">{active.type}</Badge>
                  {active.minutes?.attendees && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="size-4" />{active.minutes.attendees} attendees
                    </span>
                  )}
                </div>
                <DialogTitle className="text-xl font-extrabold leading-snug">{active.title}</DialogTitle>
                <DialogDescription>{fmtDate(active.date)}, {active.time}, {active.venue}</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                <div className="flex flex-col gap-6 p-6">
                  <div>
                    <h3 className="mb-2 text-base font-bold">Summary</h3>
                    <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{active.minutes?.summary}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-bold">Agenda</h3>
                    <ul className="flex flex-col gap-2">
                      {active.agenda.map((a) => (
                        <li key={a} className="flex items-start gap-2 text-[0.9375rem] text-muted-foreground">
                          <ChevronRight className="mt-1 size-4 shrink-0 text-primary" />{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-base font-bold">Decisions & resolutions</h3>
                    <div className="flex flex-col gap-3">
                      {active.minutes?.decisions.map((d, i) => (
                        <div key={i} className="rounded-2xl bg-muted p-4">
                          <p className="text-base font-bold">{d.topic}</p>
                          {d.initiator && (
                            <p className="mt-0.5 text-sm text-muted-foreground">Initiated by {d.initiator}</p>
                          )}
                          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted-foreground">{d.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
