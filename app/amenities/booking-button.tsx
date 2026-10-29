'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarCheck, Lock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useCanEdit, useSession } from '@/components/session-provider'
import { useAction } from '@/components/use-action'
import { cancelBooking, createBooking } from '@/app/actions/data'
import type { Booking } from '@/lib/repo'
import { society } from '@/society/config'

const slots = ['6–9 AM', '9 AM–12 PM', '12–3 PM', '3–6 PM', '6–9 PM']

export function BookingButton({ amenity }: { amenity: string }) {
  const canEdit = useCanEdit()
  const [open, setOpen] = useState(false)
  const [slot, setSlot] = useState(slots[4])
  const { pending, run } = useAction()
  const today = new Date().toISOString().slice(0, 10)

  if (!canEdit) {
    return (
      <Button variant="outline" size="sm" className="h-10 w-full rounded-full text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" nativeButton={false} render={<Link href="/login?next=/amenities" />}>
        <Lock data-icon="inline-start" />
        Sign in to book
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="h-10 w-full rounded-full text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" />}>
        <CalendarCheck data-icon="inline-start" />
        Book
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Book {amenity}</DialogTitle>
          <DialogDescription>Bookings are confirmed instantly if the slot is free.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            const date = String(new FormData(e.currentTarget).get('date'))
            run(() => createBooking({ amenity, date, slot }), () => setOpen(false))
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor={`date-${amenity}`}>Date</Label>
            <Input id={`date-${amenity}`} name="date" type="date" min={today} defaultValue={today} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Time slot</Label>
            <Select value={slot} onValueChange={(v) => setSlot(String(v))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{slots.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter><Button type="submit" disabled={pending}>Confirm booking</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function UpcomingBookings({ bookings }: { bookings: Booking[] }) {
  const user = useSession()
  const { pending, run } = useAction()
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = bookings.filter((b) => b.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  if (upcoming.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <CalendarCheck className="size-5 text-primary" aria-hidden />
          <CardTitle className="text-xl"><h2>Upcoming bookings</h2></CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {upcoming.map((b) => {
            const d = new Date(b.date)
            return (
              <li key={b.id} className="flex items-center gap-4 py-4 first:pt-1 last:pb-0">
                <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <span className="tabular text-xl font-extrabold leading-none">
                    {d.toLocaleDateString(society.locale, { day: 'numeric' })}
                  </span>
                  <span className="text-xs font-bold">{d.toLocaleDateString(society.locale, { month: 'short' })}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold leading-snug">{b.amenity}</p>
                  <p className="mt-0.5 text-[0.9375rem] text-muted-foreground">
                    {d.toLocaleDateString(society.locale, { weekday: 'short' })}, {b.slot}
                  </p>
                  <p className="text-sm text-muted-foreground">{b.bookedBy}</p>
                </div>
                {user && (user.role === 'admin' || user.name === b.bookedBy) && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full"
                    aria-label={`Cancel ${b.amenity} booking`}
                    disabled={pending}
                    onClick={() => confirm('Cancel this booking?') && run(() => cancelBooking(b.id))}
                  >
                    <X />
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
