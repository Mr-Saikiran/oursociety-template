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
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={meeting.status === 'upcoming' ? 'default' : 'secondary'}>{meeting.type}</Badge>
            {meeting.status === 'upcoming' && <Badge variant="outline">Upcoming</Badge>}
          </div>
          <p className="font-medium leading-snug">{meeting.title}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CalendarClock className="size-3.5" />{fmtDate(meeting.date)}</span>
            <span className="flex items-center gap-1.5"><Clock className="size-3.5" />{meeting.time}</span>
            <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{meeting.venue}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {meeting.agenda.slice(0, 3).map((a) => (
              <span key={a} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{a}</span>
            ))}
            {meeting.agenda.length > 3 && (
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">+{meeting.agenda.length - 3} more</span>
            )}
          </div>
        </div>
        {hasMinutes && (
          <Button variant="outline" className="shrink-0" onClick={() => onOpen(meeting)}>
            <FileText data-icon="inline-start" />
            View minutes
          </Button>
        )}
      </CardContent>
    </Card>
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
        <TabsContent value="upcoming" className="mt-4 flex flex-col gap-3">
          {upcoming.map((m) => <MeetingCard key={m.id} meeting={m} onOpen={setActive} />)}
        </TabsContent>
        <TabsContent value="held" className="mt-4 flex flex-col gap-3">
          {held.map((m) => <MeetingCard key={m.id} meeting={m} onOpen={setActive} />)}
        </TabsContent>
      </Tabs>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl gap-0 p-0">
          {active && (
            <>
              <DialogHeader className="border-b border-border p-5 text-left">
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="secondary">{active.type}</Badge>
                  {active.minutes?.attendees && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="size-3.5" />{active.minutes.attendees} attendees
                    </span>
                  )}
                </div>
                <DialogTitle className="font-serif text-xl">{active.title}</DialogTitle>
                <DialogDescription>{fmtDate(active.date)} · {active.time} · {active.venue}</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                <div className="flex flex-col gap-5 p-5">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold">Summary</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{active.minutes?.summary}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold">Agenda</h3>
                    <ul className="flex flex-col gap-1.5">
                      {active.agenda.map((a) => (
                        <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-primary" />{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold">Decisions & resolutions</h3>
                    <div className="flex flex-col gap-3">
                      {active.minutes?.decisions.map((d, i) => (
                        <div key={i} className="rounded-xl border border-border bg-secondary/30 p-4">
                          <p className="text-sm font-medium">{d.topic}</p>
                          {d.initiator && (
                            <p className="mt-0.5 text-xs text-muted-foreground">Initiated by {d.initiator}</p>
                          )}
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{d.detail}</p>
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
